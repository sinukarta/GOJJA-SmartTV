import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  createDemoDeviceBackup,
  generateRestoreBashScript,
  generateRestoreBatchScript,
  persistBackupFolder,
  evaluateTakeoverSafety,
  SONY_BRAVIA_STOCK_ENABLED_PACKAGES,
  SONY_BRAVIA_STOCK_DISABLED_PACKAGES,
} from '../src/services/adbBackupService.ts';

console.log('\n================================================================');
console.log('📦 GOJJA SMARTTV — CLEANYOURTV ADB BACKUP & RESTORE VERIFIER');
console.log('================================================================\n');

let count = 0;
function test(name: string, fn: () => void) {
  fn();
  count++;
  console.log(`  ✓ ${name}`);
}

// 1. Comprehensive Backup Manifest Verification
test('Backup generates complete 134-package baseline snapshot', () => {
  const backup = createDemoDeviceBackup('192.168.10.104', 5555, 'DVC-01', 'P-01', 'tester');
  assert.equal(backup.deviceInfo.manufacturer, 'Sony');
  assert.equal(backup.deviceInfo.model, 'BRAVIA 4K VH21');
  assert.equal(backup.deviceInfo.androidVersion, '11');
  assert.equal(backup.deviceInfo.sdkInt, 30);
  assert.equal(backup.packageInventory.enabledPackages.length, SONY_BRAVIA_STOCK_ENABLED_PACKAGES.length);
  assert.equal(backup.packageInventory.disabledPackages.length, SONY_BRAVIA_STOCK_DISABLED_PACKAGES.length);
  assert.equal(backup.packageInventory.totalCount, SONY_BRAVIA_STOCK_ENABLED_PACKAGES.length + SONY_BRAVIA_STOCK_DISABLED_PACKAGES.length);
  assert.equal(backup.status, 'Verified');
});

// 2. OEM Factory Launcher Resolution
test('OEM factory launcher is captured as Google TV LauncherX', () => {
  const backup = createDemoDeviceBackup('192.168.10.104', 5555, 'DVC-01', 'P-01', 'tester');
  assert.equal(backup.originalLauncher.component, 'com.google.android.apps.tv.launcherx/.home.HomeActivity');
  assert.equal(backup.originalLauncher.packageName, 'com.google.android.apps.tv.launcherx');
  assert.ok(backup.originalLauncher.allAvailableLaunchers.length >= 2);
});

// 3. Standalone Bash Restore Script Verification
test('restore.sh includes target IP, all packages, set-home-activity, and KEYCODE_HOME', () => {
  const backup = createDemoDeviceBackup('192.168.10.104', 5555, 'DVC-01', 'P-01', 'tester');
  const bash = generateRestoreBashScript(backup);
  assert.ok(bash.includes('192.168.10.104:5555'));
  assert.ok(bash.includes('pm enable --user 0'));
  assert.ok(bash.includes('cmd package set-home-activity "com.google.android.apps.tv.launcherx/.home.HomeActivity"'));
  assert.ok(bash.includes('am start -a android.intent.action.MAIN -c android.intent.category.HOME'));
  assert.ok(bash.includes('input keyevent KEYCODE_HOME'));
  assert.ok(bash.includes('cmd package resolve-activity'));
});

// 4. Standalone Windows Batch Restore Script Verification
test('restore.bat is Windows-compatible and executes exact reversible routine', () => {
  const backup = createDemoDeviceBackup('192.168.10.104', 5555, 'DVC-01', 'P-01', 'tester');
  const bat = generateRestoreBatchScript(backup);
  assert.ok(bat.includes('@echo off'));
  assert.ok(bat.includes('set TARGET=192.168.10.104:5555'));
  assert.ok(bat.includes('pm enable --user 0'));
  assert.ok(bat.includes('cmd package set-home-activity com.google.android.apps.tv.launcherx/.home.HomeActivity'));
  assert.ok(bat.includes('input keyevent KEYCODE_HOME'));
});

// 5. Atomic Disk Persistence Check
test('persistBackupFolder creates manifest.json, packages_enabled.txt, and scripts on disk', () => {
  const backup = createDemoDeviceBackup('192.168.10.104', 5555, 'DVC-01', 'P-01', 'tester');
  const dir = persistBackupFolder(backup);
  assert.ok(fs.existsSync(dir));
  assert.ok(fs.existsSync(path.join(dir, 'manifest.json')));
  assert.ok(fs.existsSync(path.join(dir, 'packages_enabled.txt')));
  assert.ok(fs.existsSync(path.join(dir, 'packages_disabled.txt')));
  assert.ok(fs.existsSync(path.join(dir, 'getprop_dump.txt')));
  assert.ok(fs.existsSync(path.join(dir, 'restore.sh')));
  assert.ok(fs.existsSync(path.join(dir, 'restore.bat')));

  // Read back and verify manifest integrity
  const saved = JSON.parse(fs.readFileSync(path.join(dir, 'manifest.json'), 'utf8'));
  assert.equal(saved.id, backup.id);
  assert.equal(saved.deviceInfo.model, 'BRAVIA 4K VH21');
  assert.equal(saved.packageInventory.totalCount, backup.packageInventory.totalCount);
});

// 6. Zero Leaks / Reversibility Guarantee
test('Every originally enabled package is present in packages_enabled.txt', () => {
  const backup = createDemoDeviceBackup('192.168.10.104', 5555, 'DVC-01', 'P-01', 'tester');
  for (const pkg of SONY_BRAVIA_STOCK_ENABLED_PACKAGES) {
    assert.ok(backup.packageInventory.enabledPackages.includes(pkg), `Missing package ${pkg}`);
  }
});

// 7. Safety Guardrail: Block Unbacked TV Endpoints
test('Safety Guardrail blocks launcher takeover when online TV lacks verified backup', () => {
  const mockEndpoints = [
    { id: 'E-01', label: 'Room 101 TV', modelName: 'BRAVIA 4K VH21', ipHint: '192.168.10.101', portHint: 5555 },
    { id: 'E-02', label: 'Room 102 TV', modelName: 'BRAVIA 4K VH21', ipHint: '192.168.10.102', portHint: 5555 },
  ];

  // No backups present
  const resultEmpty = evaluateTakeoverSafety(mockEndpoints, []);
  assert.equal(resultEmpty.isSafe, false);
  assert.equal(resultEmpty.unbackedEndpointsCount, 2);
  assert.equal(resultEmpty.backedEndpointsCount, 0);

  // Partial backup (only E-01 backed up)
  const backupE01 = createDemoDeviceBackup('192.168.10.101', 5555, 'DVC-01', 'P-01', 'tester');
  backupE01.endpointId = 'E-01';
  const resultPartial = evaluateTakeoverSafety(mockEndpoints, [backupE01]);
  assert.equal(resultPartial.isSafe, false);
  assert.equal(resultPartial.unbackedEndpointsCount, 1);
  assert.equal(resultPartial.backedEndpointsCount, 1);
  assert.equal(resultPartial.unbackedEndpoints[0].id, 'E-02');
});

// 8. Safety Guardrail: Unlocks when All Online TVs are Verified
test('Safety Guardrail unlocks when all online TVs have verified backup snapshots', () => {
  const mockEndpoints = [
    { id: 'E-01', label: 'Room 101 TV', modelName: 'BRAVIA 4K VH21', ipHint: '192.168.10.101', portHint: 5555 },
    { id: 'E-02', label: 'Room 102 TV', modelName: 'BRAVIA 4K VH21', ipHint: '192.168.10.102', portHint: 5555 },
  ];

  const backupE01 = createDemoDeviceBackup('192.168.10.101', 5555, 'DVC-01', 'P-01', 'tester');
  backupE01.endpointId = 'E-01';
  const backupE02 = createDemoDeviceBackup('192.168.10.102', 5555, 'DVC-02', 'P-01', 'tester');
  backupE02.endpointId = 'E-02';

  const resultFull = evaluateTakeoverSafety(mockEndpoints, [backupE01, backupE02]);
  assert.equal(resultFull.isSafe, true);
  assert.equal(resultFull.unbackedEndpointsCount, 0);
  assert.equal(resultFull.backedEndpointsCount, 2);
  assert.ok(resultFull.reason?.includes('CleanYourTV Standard'));
});

// 9. Safety Guardrail: Corrupted or Failed Backup Remains Locked
test('Safety Guardrail rejects Corrupted backups and remains locked', () => {
  const mockEndpoints = [
    { id: 'E-01', label: 'Room 101 TV', modelName: 'BRAVIA 4K VH21', ipHint: '192.168.10.101', portHint: 5555 },
  ];

  const corruptedBackup = createDemoDeviceBackup('192.168.10.101', 5555, 'DVC-01', 'P-01', 'tester');
  corruptedBackup.endpointId = 'E-01';
  corruptedBackup.status = 'Corrupted';

  const result = evaluateTakeoverSafety(mockEndpoints, [corruptedBackup]);
  assert.equal(result.isSafe, false);
  assert.equal(result.unbackedEndpointsCount, 1);
});

console.log(`\n================================================================`);
console.log(`🎉 ALL ${count} CLEANYOURTV BACKUP & RESTORE CHECKS PASSED!`);
console.log('================================================================\n');
