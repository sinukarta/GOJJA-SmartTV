#!/usr/bin/env node
/**
 * GOJJA SmartTV — Official Cloud Edge Agent & Local Connector Bridge
 * Zero-dependency Node.js companion (v18+) that runs inside the hotel's LAN.
 *
 * Modes:
 *   1. Cloud SaaS Daemon Mode (Recommended):
 *      node gojja-connector.mjs --server https://your-saas.com --pair GJA-1234-P01 --daemon
 *      - Automatically downloads & installs official Android SDK Platform-Tools (ADB) if missing
 *      - Persists ADB RSA keys in ~/.gojja-edge/android so TVs only prompt once
 *      - Opens an outbound persistent SSE relay to the Cloud SaaS (no port forwarding needed)
 *      - Executes strictly allowlisted ADB commands (scan, auth, backup, deploy, restore)
 *
 *   2. Legacy One-Shot CLI Mode:
 *      node gojja-connector.mjs --server http://localhost:3000 --property P-01 --subnet 192.168.1.0/24 --scan-now
 */

import os from 'node:os';
import net from 'node:net';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';

const execFileAsync = promisify(execFile);

const args = process.argv.slice(2);
function getArg(flag, fallback = '') {
  const idx = args.indexOf(flag);
  return idx !== -1 && args[idx + 1] ? args[idx + 1] : fallback;
}

const SERVER_URL = getArg('--server', 'http://localhost:3000').replace(/\/$/, '');
const PROPERTY_ID = getArg('--property', 'P-01');
const SUBNET_CIDR = getArg('--subnet', '');
const PAIR_CODE = getArg('--pair', '');
const DAEMON_MODE = args.includes('--daemon') || Boolean(PAIR_CODE);
const NO_AUTO_ADB = args.includes('--no-auto-adb');
const CONNECTOR_NAME = getArg('--name', `${os.hostname()}-EdgeAgent`);

const EDGE_HOME = path.join(os.homedir(), '.gojja-edge');
const EDGE_CONFIG_FILE = path.join(EDGE_HOME, 'config.json');
const EDGE_ANDROID_HOME = path.join(EDGE_HOME, 'android');
const EDGE_PLATFORM_TOOLS_DIR = path.join(EDGE_HOME, 'platform-tools');
const ADB_EXE_NAME = process.platform === 'win32' ? 'adb.exe' : 'adb';

const ALLOWED_JOB_TYPES = new Set([
  'SCAN_SUBNET',
  'ADB_CONNECT_AUTH',
  'ADB_PAIR',
  'ADB_PROBE',
  'CAPTURE_BACKUP',
  'DEPLOY_LAUNCHER',
  'RESTORE_OEM',
  'SCREENCAP',
]);

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function getAdbEnv() {
  ensureDir(EDGE_ANDROID_HOME);
  // If user already has authorized adbkey in their default ~/.android directory, inherit it
  const defaultAndroidHome = path.join(os.homedir(), '.android');
  const defaultKey = path.join(defaultAndroidHome, 'adbkey');
  const edgeKey = path.join(EDGE_ANDROID_HOME, 'adbkey');
  if (fs.existsSync(defaultKey) && !fs.existsSync(edgeKey)) {
    try {
      fs.copyFileSync(defaultKey, edgeKey);
      if (fs.existsSync(`${defaultKey}.pub`)) {
        fs.copyFileSync(`${defaultKey}.pub`, `${edgeKey}.pub`);
      }
    } catch {
      // ignore
    }
  }
  return {
    ...process.env,
    ANDROID_SDK_HOME: EDGE_ANDROID_HOME,
    ANDROID_USER_HOME: EDGE_ANDROID_HOME,
  };
}

function resolveLocalAdbBin() {
  const candidates = [
    path.join(EDGE_PLATFORM_TOOLS_DIR, ADB_EXE_NAME),
    path.join(process.cwd(), 'bin', 'platform-tools', ADB_EXE_NAME),
    path.join(process.cwd(), 'bin', ADB_EXE_NAME),
    process.env.LOCALAPPDATA ? path.join(process.env.LOCALAPPDATA, 'Android', 'Sdk', 'platform-tools', 'adb.exe') : '',
    'adb',
  ].filter(Boolean);
  for (const c of candidates) {
    if (c === 'adb' || fs.existsSync(c)) return c;
  }
  return 'adb';
}

async function detectAdb() {
  const adbBin = resolveLocalAdbBin();
  try {
    const { stdout } = await execFileAsync(adbBin, ['version'], {
      timeout: 4000,
      windowsHide: true,
      env: getAdbEnv(),
    });
    const firstLine = stdout.split(/\r?\n/)[0]?.trim() || 'adb detected';
    return { available: true, version: firstLine, path: adbBin };
  } catch {
    return { available: false, version: 'Not found (Auto-installable)', path: adbBin };
  }
}

function getPlatformToolsDownloadUrl() {
  if (process.platform === 'win32') {
    return 'https://dl.google.com/android/repository/platform-tools-latest-windows.zip';
  }
  if (process.platform === 'darwin') {
    return 'https://dl.google.com/android/repository/platform-tools-latest-darwin.zip';
  }
  return 'https://dl.google.com/android/repository/platform-tools-latest-linux.zip';
}

async function ensureAdbInstalled() {
  const current = await detectAdb();
  if (current.available) return current;
  if (NO_AUTO_ADB) return current;

  ensureDir(EDGE_HOME);
  const url = getPlatformToolsDownloadUrl();
  const zipPath = path.join(EDGE_HOME, 'platform-tools.zip');

  console.log(`→ ADB not found. Auto-downloading official Android SDK Platform-Tools...`);
  console.log(`  Source: ${url}`);

  try {
    const res = await fetch(url);
    if (!res.ok || !res.body) {
      throw new Error(`HTTP ${res.status} downloading platform-tools`);
    }
    const fileStream = fs.createWriteStream(zipPath);
    await pipeline(Readable.fromWeb(res.body), fileStream);

    console.log(`→ Extracting Platform-Tools to ${EDGE_HOME}...`);
    if (process.platform === 'win32') {
      await execFileAsync(
        'powershell.exe',
        ['-NoProfile', '-Command', `Expand-Archive -Path "${zipPath}" -DestinationPath "${EDGE_HOME}" -Force`],
        { timeout: 60000, windowsHide: true }
      );
    } else {
      try {
        await execFileAsync('unzip', ['-o', zipPath, '-d', EDGE_HOME], { timeout: 60000 });
      } catch {
        await execFileAsync('python3', ['-m', 'zipfile', '-e', zipPath, EDGE_HOME], { timeout: 60000 });
      }
      const adbTarget = path.join(EDGE_PLATFORM_TOOLS_DIR, 'adb');
      if (fs.existsSync(adbTarget)) {
        fs.chmodSync(adbTarget, 0o755);
      }
    }

    try {
      fs.unlinkSync(zipPath);
    } catch {
      // ignore cleanup error
    }

    const verified = await detectAdb();
    if (verified.available) {
      console.log(`✓ Auto-installed ADB: ${verified.version} (${verified.path})`);
    }
    return verified;
  } catch (err) {
    console.warn(`! Auto-ADB installation failed: ${err instanceof Error ? err.message : err}`);
    return current;
  }
}

function getOrReadRsaFingerprint() {
  const pubKey = path.join(EDGE_ANDROID_HOME, 'adbkey.pub');
  if (fs.existsSync(pubKey)) {
    const content = fs.readFileSync(pubKey, 'utf8').trim();
    return crypto.createHash('sha256').update(content).digest('hex').slice(0, 16).toUpperCase();
  }
  return 'PENDING-FIRST-CONNECT';
}

function getLocalInterfaces() {
  const nets = os.networkInterfaces();
  const list = [];
  for (const [name, addrs] of Object.entries(nets)) {
    if (!addrs) continue;
    for (const addr of addrs) {
      if (addr.family === 'IPv4' && !addr.internal) {
        const parts = addr.address.split('.');
        const cidr = parts.length === 4 ? `${parts[0]}.${parts[1]}.${parts[2]}.0/24` : `${addr.address}/24`;
        list.push({ name, address: addr.address, netmask: addr.netmask, cidr });
      }
    }
  }
  return list;
}

function probeTcpPort(ip, port, timeoutMs = 500) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    let settled = false;
    const finish = (reachable) => {
      if (!settled) {
        settled = true;
        socket.destroy();
        resolve(reachable);
      }
    };
    socket.setTimeout(timeoutMs);
    socket.once('connect', () => finish(true));
    socket.once('timeout', () => finish(false));
    socket.once('error', () => finish(false));
    socket.connect(port, ip);
  });
}

async function discoverMdnsAdbServices(adbBin, cidr) {
  const prefix = cidr.split('.').slice(0, 3).join('.');
  const results = [];
  try {
    const { stdout } = await execAdb(adbBin, ['mdns', 'services'], 3500);
    const lines = stdout.split(/\r?\n/).slice(1);
    for (const line of lines) {
      const match = /(\S+)\s+(_adb[^\s]*)\s+(\d+\.\d+\.\d+\.\d+):(\d+)/.exec(line);
      if (match) {
        const [, instanceName, serviceType, ip, portStr] = match;
        if (ip.startsWith(prefix + '.')) {
          const isPairing = serviceType.includes('pairing');
          results.push({
            ip,
            port: Number(portStr),
            pairingPort: isPairing ? Number(portStr) : undefined,
            friendlyName: instanceName,
            discoverySource: 'mDNS',
            serviceHint: `${serviceType} (${ip}:${portStr})`,
            reachability: 'Reachable',
            authState: isPairing ? 'PairRequired' : 'AuthRequired',
            confidence: 'High',
            notes: isPairing
              ? `Android 11+ Wireless Debugging Pairing service detected (${serviceType}). Use 6-digit pairing code on TV.`
              : `Android 11+ Wireless Debugging Connect service detected (${serviceType}).`,
          });
        }
      }
    }
  } catch {
    // mDNS may not be supported on older adb builds; continue with TCP probe
  }
  return results;
}

async function probeCastEurekaInfo(ip) {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 1500);
    const res = await fetch(`http://${ip}:8008/setup/eureka_info?options=detail`, { signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) return null;
    const info = await res.json();
    return {
      name: info.name || 'Smart TV (Google Cast)',
      manufacturer: info.manufacturer || '',
      modelName: info.model_name || info.detail?.model_name || '',
    };
  } catch {
    return null;
  }
}

async function runBoundedSubnetScan(cidr, ports = [5555, 8008]) {
  const baseIp = cidr.split('/')[0];
  const parts = baseIp.split('.').map(Number);
  if (parts.length !== 4 || parts.some((n) => Number.isNaN(n))) {
    throw new Error(`Invalid IPv4 CIDR: ${cidr}`);
  }
  const prefix = `${parts[0]}.${parts[1]}.${parts[2]}`;
  const found = [];
  const batchSize = 24;

  for (let start = 1; start <= 254; start += batchSize) {
    const tasks = [];
    for (let host = start; host < Math.min(255, start + batchSize); host++) {
      const ip = `${prefix}.${host}`;
      for (const port of ports) {
        tasks.push(
          probeTcpPort(ip, port, 450).then((ok) => {
            if (ok) {
              found.push({
                ip,
                port,
                friendlyName: `LAN-Host-${ip}:${port}`,
                discoverySource: 'TCP_PROBE',
                serviceHint: port === 8008 ? 'Google Cast / DIAL (Port 8008)' : `TCP Port ${port} Open`,
                reachability: 'Reachable',
                authState: port === 5555 ? 'AuthRequired' : 'CandidateFound',
                confidence: port === 5555 ? 'High' : 'Medium',
              });
            }
          })
        );
      }
    }
    await Promise.all(tasks);
  }
  return found;
}

async function execAdb(adbBin, adbArgs, timeout = 5000) {
  return execFileAsync(adbBin, adbArgs, {
    timeout,
    windowsHide: true,
    env: getAdbEnv(),
  });
}

async function probeAdbProperties(ip, port = 5555, adbBin = 'adb') {
  const target = `${ip}:${port}`;
  try {
    let connOut = '';
    try {
      const { stdout, stderr } = await execAdb(adbBin, ['connect', target], 7000);
      connOut = `${stdout || ''} ${stderr || ''}`.trim();
    } catch (e) {
      connOut = String(e?.message || '');
    }

    let state = 'unknown';
    try {
      const { stdout: devOut } = await execAdb(adbBin, ['devices'], 4000);
      for (const line of devOut.split(/\r?\n/)) {
        const parts = line.trim().split(/\s+/);
        if (parts[0] === target && parts[1]) {
          state = parts[1];
          break;
        }
      }
    } catch {
      // ignore
    }

    if (state === 'unknown') {
      try {
        const { stdout: stateOut } = await execAdb(adbBin, ['-s', target, 'get-state'], 3500);
        state = stateOut.trim();
      } catch (e) {
        const msg = String(e?.message || '');
        if (msg.includes('unauthorized')) state = 'unauthorized';
        else if (msg.includes('offline')) state = 'offline';
        else if (connOut.toLowerCase().includes('connected to')) state = 'unauthorized';
      }
    }

    if (state === 'device') {
      const getP = async (k) => {
        try {
          const { stdout } = await execAdb(adbBin, ['-s', target, 'shell', 'getprop', k], 3000);
          return stdout.trim();
        } catch {
          return '';
        }
      };
      const [brand, model, manufacturer, release, sdk, fingerprint, serialNo] = await Promise.all([
        getP('ro.product.brand'),
        getP('ro.product.model'),
        getP('ro.product.manufacturer'),
        getP('ro.build.version.release'),
        getP('ro.build.version.sdk'),
        getP('ro.build.fingerprint'),
        getP('ro.serialno'),
      ]);
      return {
        brand: brand || manufacturer,
        model: model || 'Smart TV',
        manufacturer: manufacturer || brand,
        release,
        sdk,
        fingerprint,
        serialNo,
        verified: true,
        state,
      };
    }
    return { verified: false, state };
  } catch (err) {
    return { verified: false, state: 'error', error: err instanceof Error ? err.message : 'connect failed' };
  }
}

async function executeEdgeJob(job, adbInfo) {
  if (!ALLOWED_JOB_TYPES.has(job.type)) {
    return { jobId: job.jobId, ok: false, error: `Disallowed job type: ${job.type}`, completedAtUtc: new Date().toISOString() };
  }
  const adbBin = adbInfo.path;
  const payload = job.payload || {};

  try {
    if (job.type === 'SCAN_SUBNET') {
      const cidr = String(payload.subnetCidr || '192.168.1.0/24');
      const requestedPorts = Array.isArray(payload.ports) && payload.ports.length > 0 ? payload.ports.map(Number) : [5555];
      const scanPorts = Array.from(new Set([...requestedPorts, 8008]));

      const mdnsCandidates = adbInfo.available ? await discoverMdnsAdbServices(adbBin, cidr) : [];
      const tcpCandidates = await runBoundedSubnetScan(cidr, scanPorts);

      const candidates = [...mdnsCandidates];
      for (const tc of tcpCandidates) {
        if (!candidates.some((c) => c.ip === tc.ip && c.port === tc.port)) {
          candidates.push(tc);
        }
      }

      for (const cand of candidates) {
        if (cand.port === 8008) {
          const castInfo = await probeCastEurekaInfo(cand.ip);
          if (castInfo) {
            cand.friendlyName = `${castInfo.name} (Cast/TV)`;
            cand.observedBrand = castInfo.manufacturer || cand.observedBrand;
            cand.observedModel = castInfo.modelName || cand.observedModel;
            cand.notes = `TV terdeteksi via Google Cast (8008), tetapi ADB Port 5555 / Wireless Debugging belum aktif. Aktifkan Developer Options -> USB/Wireless Debugging di TV.`;
          }
          continue;
        }
        if (adbInfo.available && (cand.port === 5555 || (cand.discoverySource === 'mDNS' && cand.authState !== 'PairRequired'))) {
          const props = await probeAdbProperties(cand.ip, cand.port, adbBin);
          if (props && props.verified) {
            const brand = (props.brand || '').trim();
            const model = (props.model || '').trim();
            cand.friendlyName = `${brand ? brand.toUpperCase() + ' ' : ''}${model}`.trim();
            cand.serviceHint = `${brand} ${model} • Android ${props.release || '?'}`;
            cand.authState = 'DeviceVerified';
            cand.observedBrand = brand;
            cand.observedModel = model;
            cand.observedManufacturer = props.manufacturer;
            cand.observedAndroidVersion = props.release;
            cand.observedSdkInt = Number(props.sdk) || 0;
          }
        }
      }
      return { jobId: job.jobId, ok: true, data: { candidates }, completedAtUtc: new Date().toISOString() };
    }

    if (job.type === 'ADB_PAIR') {
      const ip = String(payload.ip || '');
      const pairingPort = Number(payload.pairingPort || 0);
      const pairingCode = String(payload.pairingCode || '').trim();
      if (!adbInfo.available) {
        return { jobId: job.jobId, ok: false, error: 'ADB binary unavailable on Edge Agent.', completedAtUtc: new Date().toISOString() };
      }
      if (!ip || !pairingPort || !/^\d{6}$/.test(pairingCode)) {
        return { jobId: job.jobId, ok: false, error: 'Valid IP, pairingPort, and 6-digit pairingCode are required.', completedAtUtc: new Date().toISOString() };
      }
      const { stdout, stderr } = await execAdb(adbBin, ['pair', `${ip}:${pairingPort}`, pairingCode], 10000);
      const combined = `${stdout}\n${stderr}`.trim();
      const success = /Successfully paired/i.test(combined);
      if (!success) {
        return { jobId: job.jobId, ok: false, error: `adb pair failed: ${combined.slice(0, 160)}`, completedAtUtc: new Date().toISOString() };
      }
      return { jobId: job.jobId, ok: true, data: { paired: true, message: `Paired with ${ip}:${pairingPort}` }, completedAtUtc: new Date().toISOString() };
    }

    if (job.type === 'ADB_CONNECT_AUTH' || job.type === 'ADB_PROBE') {
      const ip = String(payload.ip || '');
      const port = Number(payload.port || 5555);
      if (!adbInfo.available) {
        return { jobId: job.jobId, ok: false, error: 'ADB binary unavailable on Edge Agent.', completedAtUtc: new Date().toISOString() };
      }
      const props = await probeAdbProperties(ip, port, adbBin);
      if (!props.verified) {
        return {
          jobId: job.jobId,
          ok: false,
          error: `Waiting for on-TV RSA debugging authorization prompt on ${ip}:${port} (state=${props.state}).`,
          completedAtUtc: new Date().toISOString(),
        };
      }
      const brand = (props.brand || '').trim();
      const model = (props.model || 'Smart TV').trim();
      return {
        jobId: job.jobId,
        ok: true,
        data: {
          ...props,
          friendlyName: `${brand ? brand.toUpperCase() + ' ' : ''}${model}`.trim(),
        },
        completedAtUtc: new Date().toISOString(),
      };
    }

    if (job.type === 'CAPTURE_BACKUP') {
      const ip = String(payload.ip || '');
      const port = Number(payload.port || 5555);
      const target = `${ip}:${port}`;
      const deviceId = String(payload.deviceId || 'DVC-01');
      const propertyId = String(payload.propertyId || PROPERTY_ID);
      const capturedBy = String(payload.capturedBy || 'edge-agent');

      const props = await probeAdbProperties(ip, port, adbBin);
      if (!props.verified) {
        return { jobId: job.jobId, ok: false, error: `TV ${target} is not authorized (state=${props.state}).`, completedAtUtc: new Date().toISOString() };
      }

      const [allRes, sysRes, thirdRes, disabledRes, homeRes] = await Promise.all([
        execAdb(adbBin, ['-s', target, 'shell', 'pm', 'list', 'packages'], 6000),
        execAdb(adbBin, ['-s', target, 'shell', 'pm', 'list', 'packages', '-s'], 6000),
        execAdb(adbBin, ['-s', target, 'shell', 'pm', 'list', 'packages', '-3'], 6000),
        execAdb(adbBin, ['-s', target, 'shell', 'pm', 'list', 'packages', '-d'], 6000),
        execAdb(adbBin, ['-s', target, 'shell', 'cmd', 'package', 'resolve-activity', '--brief', '-a', 'android.intent.action.MAIN', '-c', 'android.intent.category.HOME'], 5000),
      ]);

      const parsePkgs = (txt) => txt.split(/\r?\n/).map((l) => l.replace(/^package:/, '').trim()).filter(Boolean);
      const allPackages = parsePkgs(allRes.stdout);
      const systemPackages = parsePkgs(sysRes.stdout);
      const thirdPartyPackages = parsePkgs(thirdRes.stdout);
      const disabledPackages = parsePkgs(disabledRes.stdout);
      const disabledSet = new Set(disabledPackages);
      const enabledPackages = allPackages.filter((p) => !disabledSet.has(p));
      const homeLine = homeRes.stdout.split(/\r?\n/).map((l) => l.trim()).find((l) => l.includes('/')) || 'com.google.android.apps.tv.launcherx/.home.HomeActivity';
      const origPkg = homeLine.split('/')[0];

      const nowIso = new Date().toISOString();
      const backupId = `BKP-${Date.now().toString(36).toUpperCase()}`;
      const backup = {
        id: backupId,
        deviceId,
        propertyId,
        targetIp: ip,
        targetPort: port,
        capturedAtUtc: nowIso,
        capturedBy,
        status: 'Verified',
        deviceInfo: {
          brand: props.brand || 'Android TV',
          model: props.model || 'Smart TV',
          manufacturer: props.manufacturer || props.brand || 'OEM',
          androidVersion: props.release || '11',
          sdkInt: Number(props.sdk) || 30,
          serialNo: props.serialNo || target,
          fingerprint: props.fingerprint || 'unknown',
        },
        originalLauncher: {
          packageName: origPkg,
          component: homeLine,
          resolvedVia: 'cmd package resolve-activity',
        },
        packageInventory: {
          allPackages,
          systemPackages,
          thirdPartyPackages,
          disabledPackages,
          enabledPackages,
          totalCount: allPackages.length,
        },
        scripts: {
          restoreSh: `#!/usr/bin/env bash\nadb connect ${target}\nadb -s ${target} shell cmd package set-home-activity ${homeLine}\n`,
          restoreBat: `@echo off\nadb connect ${target}\nadb -s ${target} shell cmd package set-home-activity ${homeLine}\n`,
        },
        folderPath: path.join(EDGE_HOME, 'backups', backupId),
      };

      return { jobId: job.jobId, ok: true, data: { backup }, completedAtUtc: new Date().toISOString() };
    }

    if (job.type === 'DEPLOY_LAUNCHER') {
      const target = `${payload.ip}:${payload.port || 5555}`;
      const disabledPackages = Array.isArray(payload.disabledPackages) ? payload.disabledPackages : [];
      const homeActivity = String(payload.homeActivity || 'tv.gojja.hospitality.launcher/.GojjaHomeActivity');
      const transcript = [`$ adb connect ${target}`];
      await execAdb(adbBin, ['connect', target], 5000);
      for (const pkg of disabledPackages) {
        try {
          await execAdb(adbBin, ['-s', target, 'shell', 'pm', 'disable-user', '--user', '0', String(pkg)], 3500);
          transcript.push(`$ adb -s ${target} shell pm disable-user --user 0 ${pkg}`);
        } catch {
          // package might not exist on this OEM
        }
      }
      try {
        await execAdb(adbBin, ['-s', target, 'shell', 'cmd', 'package', 'set-home-activity', homeActivity], 4000);
        transcript.push(`$ adb -s ${target} shell cmd package set-home-activity ${homeActivity}`);
        await execAdb(adbBin, ['-s', target, 'shell', 'am', 'start', '-a', 'android.intent.action.MAIN', '-c', 'android.intent.category.HOME'], 4000);
        transcript.push(`$ adb -s ${target} shell am start -a android.intent.action.MAIN -c android.intent.category.HOME`);
      } catch {
        // ignore if APK not yet sideloaded
      }
      return { jobId: job.jobId, ok: true, data: { transcript }, completedAtUtc: new Date().toISOString() };
    }

    if (job.type === 'RESTORE_OEM') {
      const target = `${payload.ip}:${payload.port || 5555}`;
      const enabledPackages = Array.isArray(payload.enabledPackages) ? payload.enabledPackages : [];
      const origComponent = String(payload.originalLauncherComponent || 'com.google.android.apps.tv.launcherx/.home.HomeActivity');
      const transcript = [`$ adb connect ${target}`];
      await execAdb(adbBin, ['connect', target], 5000);
      for (const pkg of enabledPackages) {
        try {
          await execAdb(adbBin, ['-s', target, 'shell', 'pm', 'enable', '--user', '0', String(pkg)], 3500);
          transcript.push(`$ adb -s ${target} shell pm enable --user 0 ${pkg}`);
        } catch {
          // ignore
        }
      }
      await execAdb(adbBin, ['-s', target, 'shell', 'cmd', 'package', 'set-home-activity', origComponent], 4000);
      transcript.push(`$ adb -s ${target} shell cmd package set-home-activity ${origComponent}`);
      await execAdb(adbBin, ['-s', target, 'shell', 'am', 'start', '-a', 'android.intent.action.MAIN', '-c', 'android.intent.category.HOME'], 4000);
      transcript.push(`$ adb -s ${target} shell am start -a android.intent.action.MAIN -c android.intent.category.HOME`);
      return { jobId: job.jobId, ok: true, data: { transcript }, completedAtUtc: new Date().toISOString() };
    }

    if (job.type === 'SCREENCAP') {
      const target = `${payload.ip}:${payload.port || 5555}`;
      await execAdb(adbBin, ['connect', target], 6000);
      let buffer = null;
      try {
        const { stdout } = await execFileAsync(adbBin, ['-s', target, 'exec-out', 'screencap', '-p'], {
          encoding: 'buffer',
          maxBuffer: 25 * 1024 * 1024,
          timeout: 10000,
          windowsHide: true,
          env: getAdbEnv(),
        });
        if (stdout && stdout.length > 8 && stdout[0] === 0x89 && stdout[1] === 0x50 && stdout[2] === 0x4e && stdout[3] === 0x47) {
          buffer = stdout;
        }
      } catch {
        // fallback to /data/local/tmp/
      }

      if (!buffer) {
        const remoteFile = `/data/local/tmp/gojja_cap_${Date.now()}.png`;
        const localFile = path.join(EDGE_HOME, `cap_${Date.now()}.png`);
        await execAdb(adbBin, ['-s', target, 'shell', 'screencap', '-p', remoteFile], 9000);
        await execAdb(adbBin, ['-s', target, 'pull', remoteFile, localFile], 9000);
        await execAdb(adbBin, ['-s', target, 'shell', 'rm', '-f', remoteFile], 3000).catch(() => {});
        if (fs.existsSync(localFile)) {
          buffer = fs.readFileSync(localFile);
          try { fs.unlinkSync(localFile); } catch {}
        }
      }

      if (buffer && buffer.length > 0) {
        const dataUrl = `data:image/png;base64,${buffer.toString('base64')}`;
        return { jobId: job.jobId, ok: true, data: { dataUrl, sizeBytes: buffer.length }, completedAtUtc: new Date().toISOString() };
      }
      return { jobId: job.jobId, ok: false, error: 'Screenshot capture failed. Device might be sleeping or locked.', completedAtUtc: new Date().toISOString() };
    }

    return { jobId: job.jobId, ok: false, error: `Unsupported job type: ${job.type}`, completedAtUtc: new Date().toISOString() };
  } catch (err) {
    return {
      jobId: job.jobId,
      ok: false,
      error: err instanceof Error ? err.message : 'Job execution error',
      completedAtUtc: new Date().toISOString(),
    };
  }
}

async function runDaemonMode(adbInfo, primaryIface, selectedCidr) {
  ensureDir(EDGE_HOME);
  let savedConfig = null;
  if (fs.existsSync(EDGE_CONFIG_FILE)) {
    try {
      savedConfig = JSON.parse(fs.readFileSync(EDGE_CONFIG_FILE, 'utf8'));
    } catch {
      savedConfig = null;
    }
  }

  let agentToken = savedConfig?.serverUrl === SERVER_URL ? savedConfig?.agentToken : '';
  let agentId = savedConfig?.serverUrl === SERVER_URL ? savedConfig?.agentId : '';

  if (PAIR_CODE) {
    console.log(`→ Redeeming Cloud Pairing Code: ${PAIR_CODE}...`);
    const enrollRes = await fetch(`${SERVER_URL}/api/edge/enroll`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pairingCode: PAIR_CODE,
        name: CONNECTOR_NAME,
        hostPlatform: `${os.platform()} ${os.release()} (${os.arch()})`,
        interfaceName: primaryIface.name,
        subnetCidr: selectedCidr,
        interfaces: getLocalInterfaces(),
        adbAvailable: adbInfo.available,
        adbVersion: adbInfo.version,
        rsaFingerprint: getOrReadRsaFingerprint(),
      }),
    });
    const enrollData = await enrollRes.json();
    if (!enrollRes.ok) {
      console.error('✗ Pairing failed:', enrollData.message || enrollData);
      process.exit(1);
    }
    agentToken = enrollData.agentToken;
    agentId = enrollData.agentId;
    fs.writeFileSync(
      EDGE_CONFIG_FILE,
      JSON.stringify({ serverUrl: SERVER_URL, agentId, agentToken, propertyId: enrollData.propertyId }, null, 2)
    );
    console.log(`✓ Paired & Enrolled as ${agentId} (Property ${enrollData.propertyId})`);
  }

  if (!agentToken) {
    console.error('✗ No saved Edge token found. Please pass --pair <PAIRING_CODE> from your Cloud Dashboard.');
    process.exit(1);
  }

  // Local loopback status server on 127.0.0.1:3939 for instant browser local detection
  try {
    const loopback = http.createServer((req, res) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', '*');
      if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
      }
      if (req.url === '/status' || req.url === '/interfaces') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(
          JSON.stringify({
            ok: true,
            agentId,
            serverUrl: SERVER_URL,
            interfaces: getLocalInterfaces(),
            adbAvailable: adbInfo.available,
            adbVersion: adbInfo.version,
          })
        );
        return;
      }
      res.writeHead(404);
      res.end('Not found');
    });
    loopback.on('error', () => {
      // port in use or restricted, non-fatal
    });
    loopback.listen(3939, '127.0.0.1', () => {
      console.log('✓ Local loopback status ready on http://127.0.0.1:3939/interfaces');
    });
  } catch {
    // ignore
  }

  // Periodic heartbeat every 30s
  setInterval(async () => {
    try {
      await fetch(`${SERVER_URL}/api/edge/heartbeat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${agentToken}` },
        body: JSON.stringify({
          adbAvailable: adbInfo.available,
          adbVersion: adbInfo.version,
          subnetCidr: selectedCidr,
          interfaceName: primaryIface.name,
          interfaces: getLocalInterfaces(),
          rsaFingerprint: getOrReadRsaFingerprint(),
        }),
      });
    } catch {
      // ignore transient heartbeat failure
    }
  }, 30000);

  // Persistent SSE Relay Loop with Auto-Reconnect
  while (true) {
    try {
      console.log(`→ Connecting outbound SSE relay to ${SERVER_URL}/api/edge/stream...`);
      const streamRes = await fetch(`${SERVER_URL}/api/edge/stream`, {
        headers: { Authorization: `Bearer ${agentToken}`, Accept: 'text/event-stream' },
      });

      if (streamRes.status === 401) {
        console.error('✗ Agent token rejected (401). Please re-pair using a fresh --pair code.');
        process.exit(1);
      }
      if (!streamRes.ok || !streamRes.body) {
        throw new Error(`Stream HTTP ${streamRes.status}`);
      }

      console.log(`✓ Cloud Edge Relay ONLINE (${agentId}) — Listening for dashboard commands...`);
      const reader = streamRes.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const frames = buffer.split('\n\n');
        buffer = frames.pop() || '';

        for (const frame of frames) {
          const lines = frame.split(/\r?\n/);
          let eventType = 'message';
          let dataLine = '';
          for (const line of lines) {
            if (line.startsWith('event:')) eventType = line.slice(6).trim();
            if (line.startsWith('data:')) dataLine += line.slice(5).trim();
          }
          if (eventType === 'job' && dataLine) {
            const job = JSON.parse(dataLine);
            console.log(`⚡ Executing Cloud Job [${job.type}] (${job.jobId})...`);
            const result = await executeEdgeJob(job, adbInfo);
            await fetch(`${SERVER_URL}/api/edge/job-result`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${agentToken}` },
              body: JSON.stringify(result),
            });
            console.log(`  ${result.ok ? '✓' : '✗'} Job ${job.jobId} completed.`);
          }
        }
      }
    } catch (err) {
      console.warn(`! SSE Relay disconnected (${err instanceof Error ? err.message : err}). Reconnecting in 5s...`);
      await new Promise((r) => setTimeout(r, 5000));
    }
  }
}

async function main() {
  console.log('==============================================================');
  console.log(' GOJJA SmartTV — Cloud Edge Agent & Local Connector Bridge');
  console.log('==============================================================');

  const adbInfo = await ensureAdbInstalled();
  const interfaces = getLocalInterfaces();
  const primaryIface = interfaces[0] || { name: 'lan0', cidr: '192.168.1.0/24' };
  const selectedCidr = SUBNET_CIDR || primaryIface.cidr;

  console.log(`• Target Backend : ${SERVER_URL}`);
  console.log(`• Host Platform  : ${os.platform()} ${os.release()} (${os.arch()})`);
  console.log(`• Local Interface: ${primaryIface.name} (${selectedCidr})`);
  console.log(`• Official ADB   : ${adbInfo.version}`);

  if (DAEMON_MODE) {
    await runDaemonMode(adbInfo, primaryIface, selectedCidr);
    return;
  }

  // Legacy One-Shot CLI Registration + Optional Scan
  const regRes = await fetch(`${SERVER_URL}/api/live-lab/connector/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Gojja-Persona': 'alpha-installer',
      'X-Gojja-Env': 'LIVE_LAB',
    },
    body: JSON.stringify({
      propertyId: PROPERTY_ID,
      name: CONNECTOR_NAME,
      hostPlatform: `${os.platform()} ${os.release()} (${os.arch()})`,
      interfaceName: primaryIface.name,
      subnetCidr: selectedCidr,
      adbVersion: adbInfo.version,
      adbAvailable: adbInfo.available,
    }),
  });

  const regData = await regRes.json();
  if (!regRes.ok) {
    console.error('Failed to register connector:', regData);
    process.exit(1);
  }
  const connectorId = regData.connector.id;
  console.log(`✓ Enrolled as Connector ID: ${connectorId}`);

  if (args.includes('--scan-now')) {
    console.log(`→ Scanning bounded subnet ${selectedCidr} on port 5555...`);
    const candidates = await runBoundedSubnetScan(selectedCidr, [5555]);
    console.log(`✓ TCP scan found ${candidates.length} reachable endpoint(s).`);

    if (adbInfo.available && candidates.length > 0) {
      console.log('→ Probing device properties via ADB getprop...');
      for (const cand of candidates) {
        if (cand.port === 5555) {
          const props = await probeAdbProperties(cand.ip, cand.port, adbInfo.path);
          if (props && props.verified) {
            const brand = (props.brand || '').trim();
            const model = (props.model || '').trim();
            cand.friendlyName = `${brand ? brand.toUpperCase() + ' ' : ''}${model}`.trim();
            cand.serviceHint = `${brand} ${model} • Android ${props.release || '?'}`;
            cand.authState = 'DeviceVerified';
            cand.observedBrand = brand;
            cand.observedModel = model;
            cand.observedManufacturer = props.manufacturer;
            cand.observedAndroidVersion = props.release;
            cand.observedSdkInt = Number(props.sdk) || 0;
            console.log(`  ✓ Identified: ${cand.friendlyName} (${cand.ip}:${cand.port})`);
          }
        }
      }
    }

    console.log(`→ Reporting ${candidates.length} candidate(s) to server...`);
    await fetch(`${SERVER_URL}/api/live-lab/connector/report-scan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Gojja-Persona': 'alpha-installer',
        'X-Gojja-Env': 'LIVE_LAB',
      },
      body: JSON.stringify({
        connectorId,
        propertyId: PROPERTY_ID,
        interfaceName: primaryIface.name,
        subnetCidr: selectedCidr,
        candidates,
      }),
    });
  }
}

main().catch((err) => {
  console.error('Connector fatal error:', err.message);
  process.exit(1);
});
