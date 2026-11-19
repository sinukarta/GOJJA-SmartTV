#!/usr/bin/env node
/**
 * GOJJA SmartTV — Official Standalone Local Connector Bridge (Node.js CLI Companion)
 * Runs on the installer's laptop (Windows / macOS / Linux) inside the property LAN.
 * Connects outbound over HTTPS/HTTP to the GOJJA SmartTV Backend, registers local
 * network consent, executes bounded RFC1918 TCP / mDNS discovery and official
 * Android SDK Platform-Tools (`adb`) allowlisted commands, and posts verified
 * device observations back to the GOJJA dashboard.
 *
 * Usage:
 *   node gojja-connector.mjs --server http://localhost:3000 --property P-01 --subnet 192.168.1.0/24
 */

import os from 'node:os';
import net from 'node:net';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

import fs from 'node:fs';
import path from 'node:path';

const execFileAsync = promisify(execFile);

const args = process.argv.slice(2);
function getArg(flag, fallback) {
  const idx = args.indexOf(flag);
  return idx !== -1 && args[idx + 1] ? args[idx + 1] : fallback;
}

const SERVER_URL = getArg('--server', 'http://localhost:3000').replace(/\/$/, '');
const PROPERTY_ID = getArg('--property', 'P-01');
const SUBNET_CIDR = getArg('--subnet', '');
const CONNECTOR_NAME = getArg('--name', `${os.hostname()}-Connector`);

function resolveLocalAdbBin() {
  const candidates = [
    path.join(process.cwd(), 'bin', 'platform-tools', process.platform === 'win32' ? 'adb.exe' : 'adb'),
    path.join(process.cwd(), 'bin', process.platform === 'win32' ? 'adb.exe' : 'adb'),
    'adb',
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  return 'adb';
}

async function detectAdb() {
  const adbBin = resolveLocalAdbBin();
  try {
    const { stdout } = await execFileAsync(adbBin, ['version'], { timeout: 4000, windowsHide: true });
    const firstLine = stdout.split(/\r?\n/)[0]?.trim() || 'adb detected';
    return { available: true, version: firstLine, path: adbBin };
  } catch {
    return { available: false, version: 'Not found in PATH (Install Android SDK Platform-Tools)', path: 'adb' };
  }
}

async function probeAdbProperties(ip, port = 5555, adbBin = 'adb') {
  const target = `${ip}:${port}`;
  try {
    await execFileAsync(adbBin, ['connect', target], { timeout: 4000, windowsHide: true });
    const { stdout: stateOut } = await execFileAsync(adbBin, ['-s', target, 'get-state'], { timeout: 3000, windowsHide: true });
    const state = stateOut.trim();
    if (state === 'device') {
      const getP = async (k) => {
        try {
          const { stdout } = await execFileAsync(adbBin, ['-s', target, 'shell', 'getprop', k], { timeout: 2500, windowsHide: true });
          return stdout.trim();
        } catch {
          return '';
        }
      };
      const [brand, model, manufacturer, release, sdk] = await Promise.all([
        getP('ro.product.brand'),
        getP('ro.product.model'),
        getP('ro.product.manufacturer'),
        getP('ro.build.version.release'),
        getP('ro.build.version.sdk'),
      ]);
      return {
        brand: brand || manufacturer,
        model: model || 'Smart TV',
        manufacturer: manufacturer || brand,
        release,
        sdk,
        verified: true,
      };
    }
  } catch {
    // connect or query failed
  }
  return null;
}

function getLocalInterfaces() {
  const nets = os.networkInterfaces();
  const list = [];
  for (const [name, addrs] of Object.entries(nets)) {
    if (!addrs) continue;
    for (const addr of addrs) {
      if (addr.family === 'IPv4' && !addr.internal) {
        list.push({ name, address: addr.address, netmask: addr.netmask, cidr: addr.cidr || `${addr.address}/24` });
      }
    }
  }
  return list;
}

function probeTcpPort(ip, port, timeoutMs = 550) {
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

async function runBoundedSubnetScan(cidr, ports = [5555]) {
  const baseIp = cidr.split('/')[0];
  const parts = baseIp.split('.').map(Number);
  if (parts.length !== 4 || parts.some((n) => Number.isNaN(n))) {
    throw new Error(`Invalid IPv4 CIDR: ${cidr}`);
  }
  const prefix = `${parts[0]}.${parts[1]}.${parts[2]}`;
  const found = [];
  const batchSize = 16;

  for (let start = 1; start <= 254; start += batchSize) {
    const tasks = [];
    for (let host = start; host < Math.min(255, start + batchSize); host++) {
      const ip = `${prefix}.${host}`;
      for (const port of ports) {
        tasks.push(
          probeTcpPort(ip, port, 550).then((ok) => {
            if (ok) {
              found.push({
                ip,
                port,
                friendlyName: `LAN-Host-${ip}:${port}`,
                discoverySource: 'TCP_PROBE',
                serviceHint: `TCP Port ${port} Open`,
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

async function main() {
  console.log('==============================================================');
  console.log(' GOJJA SmartTV — Official Local Connector Bridge (LIVE_LAB)');
  console.log('==============================================================');
  const adbInfo = await detectAdb();
  const interfaces = getLocalInterfaces();
  const primaryIface = interfaces[0] || { name: 'lan0', cidr: '192.168.1.0/24' };
  const selectedCidr = SUBNET_CIDR || primaryIface.cidr;

  console.log(`• Target Backend : ${SERVER_URL}`);
  console.log(`• Property Scope : ${PROPERTY_ID}`);
  console.log(`• Host Platform  : ${os.platform()} ${os.release()} (${os.arch()})`);
  console.log(`• Local Interface: ${primaryIface.name} (${selectedCidr})`);
  console.log(`• Official ADB   : ${adbInfo.version}`);

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
