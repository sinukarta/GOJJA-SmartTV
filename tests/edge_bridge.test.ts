import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import type { Response } from 'express';
import {
  EdgeBridgeManager,
  buildEdgeInstallerBash,
  buildEdgeInstallerPowerShell,
  ALLOWED_EDGE_JOB_TYPES,
} from '../src/services/edgeBridgeService.ts';

console.log('\n================================================================');
console.log('⚡ GOJJA SMARTTV — CLOUD SAAS EDGE BRIDGE & AUTO-ADB VERIFIER');
console.log('================================================================\n');

let count = 0;
async function test(name: string, fn: () => void | Promise<void>) {
  await fn();
  count++;
  console.log(`  ✓ ${name}`);
}

async function run() {
  const manager = new EdgeBridgeManager();

  await test('Generates valid pairing code bound to propertyId', () => {
    const token = manager.generatePairingToken('P-01', 'LIVE_LAB', 'alpha-admin', 15);
    assert.match(token.code, /^GJA-\d{4}-P01$/);
    assert.equal(token.propertyId, 'P-01');
    assert.equal(token.environmentId, 'LIVE_LAB');
  });

  let issuedToken = '';
  let issuedAgentId = '';

  await test('Redeems pairing code once and rejects replay', () => {
    const token = manager.generatePairingToken('P-01', 'LIVE_LAB', 'alpha-admin', 15);
    const res1 = manager.redeemPairingToken(token.code, {
      name: 'Hotel-Lobby-NUC',
      hostPlatform: 'linux x64',
      interfaceName: 'eth0',
      subnetCidr: '192.168.10.0/24',
      adbAvailable: true,
      adbVersion: 'Android Debug Bridge version 1.0.41',
      rsaFingerprint: 'ABCD1234EFGH5678',
    });
    assert.equal(res1.ok, true);
    if (res1.ok) {
      issuedToken = res1.session.agentToken;
      issuedAgentId = res1.session.agentId;
      assert.ok(issuedToken.startsWith('gja_edge_'));
      assert.equal(res1.session.adbAvailable, true);
    }

    const res2 = manager.redeemPairingToken(token.code, {});
    assert.equal(res2.ok, false);
    if (!res2.ok) {
      assert.equal(res2.code, 'PAIRING_CODE_USED');
    }
  });

  await test('Rejects expired pairing code', () => {
    const expired = manager.generatePairingToken('P-02', 'LIVE_LAB', 'alpha-admin', -1);
    const res = manager.redeemPairingToken(expired.code, {});
    assert.equal(res.ok, false);
    if (!res.ok) {
      assert.equal(res.code, 'PAIRING_CODE_EXPIRED');
    }
  });

  await test('Authenticates Bearer agentToken and updates heartbeat', () => {
    const session = manager.authenticateAgentToken(`Bearer ${issuedToken}`);
    assert.ok(session);
    assert.equal(session.agentId, issuedAgentId);

    const updated = manager.updateHeartbeat(issuedAgentId, {
      adbVersion: 'Android Debug Bridge version 1.0.41 (35.0.2)',
      rsaFingerprint: '9988AABBCCDD1122',
    });
    assert.ok(updated);
    assert.equal(updated.rsaFingerprint, '9988AABBCCDD1122');
  });

  await test('Dispatches allowlisted job over SSE stream and resolves on job-result', async () => {
    const writtenFrames: string[] = [];
    const mockSseRes = {
      writableEnded: false,
      write(chunk: string) {
        writtenFrames.push(chunk);
        return true;
      },
    } as unknown as Response;

    manager.attachSseStream(issuedAgentId, mockSseRes);
    const online = manager.getOnlineAgentForProperty('P-01', 'LIVE_LAB');
    assert.ok(online);
    assert.equal(online.agentId, issuedAgentId);

    const jobPromise = manager.dispatchJob('P-01', 'SCAN_SUBNET', { subnetCidr: '192.168.10.0/24', ports: [5555] }, 'LIVE_LAB', 5000);
    assert.equal(writtenFrames.length, 1);
    assert.ok(writtenFrames[0].includes('event: job'));

    const dataJson = JSON.parse(writtenFrames[0].split('data: ')[1].trim());
    assert.equal(dataJson.type, 'SCAN_SUBNET');

    const matched = manager.completeJob({
      jobId: dataJson.jobId,
      ok: true,
      data: { candidates: [{ ip: '192.168.10.51', port: 5555 }] },
      completedAtUtc: new Date().toISOString(),
    });
    assert.equal(matched, true);

    const jobRes = await jobPromise;
    assert.equal(jobRes.ok, true);
    assert.equal((jobRes.data?.candidates as any[]).length, 1);
  });

  await test('Rejects non-allowlisted command types', async () => {
    assert.ok(ALLOWED_EDGE_JOB_TYPES.includes('CAPTURE_BACKUP'));
    await assert.rejects(
      () => manager.dispatchJob('P-01', 'ARBITRARY_SHELL' as any, {}, 'LIVE_LAB', 1000),
      /Disallowed edge job type/
    );
  });

  await test('Generates valid Bash and PowerShell 1-line installers', () => {
    const bash = buildEdgeInstallerBash('https://cloud.gojja.tv', 'GJA-1234-P01');
    assert.ok(bash.includes('https://cloud.gojja.tv/gojja-connector.mjs'));
    assert.ok(bash.includes('--pair "GJA-1234-P01" --daemon'));

    const ps1 = buildEdgeInstallerPowerShell('https://cloud.gojja.tv', 'GJA-1234-P01');
    assert.ok(ps1.includes('https://cloud.gojja.tv/gojja-connector.mjs'));
    assert.ok(ps1.includes('--pair "GJA-1234-P01" --daemon'));
  });

  await test('public/gojja-connector.mjs passes Node.js syntax check', () => {
    const connectorPath = path.resolve(process.cwd(), 'public', 'gojja-connector.mjs');
    execFileSync(process.execPath, ['--check', connectorPath], { stdio: 'pipe' });
  });

  console.log(`\n🎉 ALL ${count}/${count} EDGE BRIDGE CHECKS PASSED!\n`);
}

run().catch((err) => {
  console.error('❌ Edge bridge test failed:', err);
  process.exit(1);
});
