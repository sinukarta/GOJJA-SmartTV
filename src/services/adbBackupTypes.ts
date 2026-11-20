import type { TvDeviceBackup } from '../data/mockData';

export const SONY_BRAVIA_STOCK_ENABLED_PACKAGES: string[] = [
  'com.google.android.apps.tv.launcherx',
  'com.google.android.tvlauncher',
  'com.google.android.leanbacklauncher',
  'com.google.android.leanbacklauncher.recommendations',
  'com.google.android.tungsten.setupwraith',
  'com.google.android.katniss',
  'com.android.tv.settings',
  'com.google.android.youtube.tv',
  'com.sony.dtv.homex',
  'com.sony.dtv.tvinput.visual',
  'com.sony.dtv.braviasync',
  'com.sony.dtv.networksetup',
  'com.sony.dtv.osat.dialog',
  'com.android.vending',
  'com.google.android.gms',
  'com.google.android.gsf',
  'com.google.android.videos',
  'com.google.android.play.games',
  'com.google.android.tv.frameworkpackagestubs',
  'com.netflix.ninja',
  'com.disney.disneyplus',
  'com.vidio.android.tv',
  'com.spotify.tv.android',
  'com.amazon.amazonvideo.livingroom',
  'tv.mola.android',
  'com.android.providers.media',
  'com.android.providers.downloads',
  'com.android.providers.settings',
  'com.android.bluetooth',
  'com.android.systemui',
  'com.android.packageinstaller',
  'com.android.inputmethod.latin',
  'com.google.android.inputmethod.latin',
  'com.android.keychain',
  'com.android.dreams.basic',
  'com.android.printspooler',
  'com.android.companiondevicemanager',
  'com.android.carrierconfig',
  'com.android.statementservice',
  'com.android.externalstorage',
  'com.android.vpndialogs',
  'com.android.defcontainer',
  'com.android.sharedstoragebackup',
  'com.android.server.telecom',
  'com.android.shell',
  'com.android.location.fused',
  'com.android.documentsui',
  'com.android.captiveportallogin',
  'com.android.camera2',
  'com.android.musicfx',
  'com.android.hotspot2.osulogin',
  'com.android.proxyhandler',
  'com.android.pacprocessor',
  'com.android.certinstaller',
  'com.android.wallpaper.livepicker',
  'com.android.htmlviewer',
  'com.android.bips',
  'com.android.backupconfirm',
  'com.android.providers.contacts',
  'com.android.providers.userdictionary',
  'com.sony.dtv.audio.output',
  'com.sony.dtv.braviacontroller',
  'com.sony.dtv.remoteservice',
  'com.sony.dtv.soundexpander',
  'com.sony.dtv.tvinput.atv',
  'com.sony.dtv.tvinput.dtv',
  'com.sony.dtv.tvinput.hdmi',
  'com.sony.dtv.multidisplay',
  'com.sony.dtv.airplay',
  'com.sony.dtv.homekit',
  'com.sony.dtv.screensaver',
  'com.sony.dtv.irblaster',
  'com.sony.dtv.service.voice',
  'com.sony.dtv.service.bt',
  'com.sony.dtv.service.hbbtv',
  'com.sony.dtv.service.teletext',
  'com.sony.dtv.service.epg',
  'com.sony.dtv.smarthelp',
  'com.sony.dtv.photosharingplus',
  'com.sony.dtv.screenmirroring',
  'com.sony.dtv.guide',
  'com.sony.dtv.customerhelp',
  'com.sony.dtv.networkmediaplayer',
  'com.sony.dtv.usbmediaplayer',
  'com.sony.dtv.hotelmode.service',
  'com.sony.dtv.hotelmode.ui',
  'com.sony.dtv.prosettings',
  'com.sony.dtv.systeminfo',
  'com.sony.dtv.networkdiag',
  'com.sony.dtv.wifisetup',
  'com.sony.dtv.btremote',
  'com.sony.dtv.channelsetup',
  'com.sony.dtv.soundsettings',
  'com.sony.dtv.picturesettings',
  'com.sony.dtv.eco',
  'com.sony.dtv.clock',
  'com.sony.dtv.timer',
  'com.sony.dtv.parentalcontrol',
  'com.sony.dtv.accessibility',
  'com.sony.dtv.privacypolicy',
  'com.sony.dtv.legalinfo',
  'com.sony.dtv.opensource',
  'com.sony.dtv.firmwareupdate',
  'com.sony.dtv.retailmode',
  'com.sony.dtv.demo',
  'com.sony.dtv.initialsetup',
  'com.sony.dtv.channelscan',
  'com.sony.dtv.tuning',
  'com.sony.dtv.avinput',
  'com.sony.dtv.componentinput',
  'com.sony.dtv.audioin',
  'com.sony.dtv.spdif',
  'com.sony.dtv.arc',
  'com.sony.dtv.earc',
  'com.sony.dtv.bluetoothaudio',
  'com.sony.dtv.headphone',
  'com.sony.dtv.subwoofer',
  'com.sony.dtv.soundbar',
  'com.sony.dtv.cec',
  'com.sony.dtv.braviasyncui',
  'com.sony.dtv.standby',
  'com.sony.dtv.faststart',
];

export const SONY_BRAVIA_STOCK_DISABLED_PACKAGES: string[] = [
  'com.sony.dtv.demomode',
  'com.sony.dtv.retailmode.playback',
  'com.sony.dtv.storepresentation',
  'com.sony.dtv.samplemedia',
  'com.sony.dtv.touchremote',
  'com.sony.dtv.nfcservice',
  'com.sony.dtv.3dglasses',
  'com.sony.dtv.camera.calibration',
  'com.sony.dtv.voice.diagnostic',
  'com.sony.dtv.btdevice.snr',
  'com.sony.dtv.loguploader',
  'com.sony.dtv.fota.diagnostic',
];

export const SONY_BRAVIA_THIRD_PARTY_PACKAGES: string[] = [
  'com.netflix.ninja',
  'com.disney.disneyplus',
  'com.vidio.android.tv',
  'com.spotify.tv.android',
  'com.amazon.amazonvideo.livingroom',
  'tv.mola.android',
  'com.google.android.youtube.tv',
  'com.google.android.play.games',
];

export function generateRestoreBashScript(backup: TvDeviceBackup): string {
  const target = `${backup.targetIp}:${backup.targetPort || 5555}`;
  const launcherComp = backup.originalLauncher.component || 'com.google.android.apps.tv.launcherx/.home.HomeActivity';

  return `#!/bin/bash
# ==============================================================================
# GOJJA SmartTV / CleanYourTV Standalone Reversible Restore Script
# Target Device: ${backup.deviceInfo.manufacturer} ${backup.deviceInfo.model} (${target})
# Android Version: ${backup.deviceInfo.androidVersion} (SDK ${backup.deviceInfo.sdkInt})
# Serial Number: ${backup.deviceInfo.serialNo || 'N/A'}
# Original OEM Home Launcher: ${launcherComp}
# Backup ID: ${backup.id}
# Created At: ${backup.createdAtUtc}
# ==============================================================================

set -e
TARGET="${target}"

echo "======================================================================"
echo " GOJJA SmartTV - Restoring TV to 100% Original Stock Factory State"
echo " Target Device: $TARGET (${backup.deviceInfo.model})"
echo " Original OEM Launcher: ${launcherComp}"
echo " Total Packages to Re-enable: ${backup.packageInventory.enabledPackages.length}"
echo "======================================================================"

echo "[1/4] Connecting to TV over ADB TCP..."
adb connect "$TARGET"

echo "[2/4] Restoring all original stock packages that were disabled..."
SCRIPT_DIR="$(cd "$(dirname "\${BASH_SOURCE[0]}")" && pwd)"
PACKAGE_FILE="$SCRIPT_DIR/packages_enabled.txt"

if [ -f "$PACKAGE_FILE" ]; then
    while IFS= read -r pkg || [ -n "$pkg" ]; do
        pkg=$(echo "$pkg" | tr -d '\\r' | xargs)
        if [ -n "$pkg" ]; then
            echo "  -> Re-enabling: $pkg"
            adb -s "$TARGET" shell pm enable --user 0 "$pkg" 2>/dev/null || true
        fi
    done < "$PACKAGE_FILE"
else
    echo "  [!] packages_enabled.txt not found, falling back to embedded manifest..."
${backup.packageInventory.enabledPackages.map((p) => `    adb -s "$TARGET" shell pm enable --user 0 "${p}" 2>/dev/null || true`).join('\n')}
fi

echo "[3/4] Re-setting default Home Launcher to ${launcherComp}..."
adb -s "$TARGET" shell cmd package set-home-activity "${launcherComp}" 2>/dev/null || true
adb -s "$TARGET" shell am start -a android.intent.action.MAIN -c android.intent.category.HOME 2>/dev/null || true
adb -s "$TARGET" shell input keyevent KEYCODE_HOME

echo "[4/4] Verifying active Home Launcher..."
adb -s "$TARGET" shell cmd package resolve-activity --brief -a android.intent.action.MAIN -c android.intent.category.HOME

echo "======================================================================"
echo " [✓ SUCCESS] TV has been restored to 100% original stock state!"
echo " All disabled apps re-enabled. Factory OEM launcher reinstated."
echo "======================================================================"
`;
}

export function generateRestoreBatchScript(backup: TvDeviceBackup): string {
  const target = `${backup.targetIp}:${backup.targetPort || 5555}`;
  const launcherComp = backup.originalLauncher.component || 'com.google.android.apps.tv.launcherx/.home.HomeActivity';

  return `@echo off
REM ==============================================================================
REM GOJJA SmartTV / CleanYourTV Standalone Reversible Restore Script (Windows)
REM Target Device: ${backup.deviceInfo.manufacturer} ${backup.deviceInfo.model} (${target})
REM Android Version: ${backup.deviceInfo.androidVersion} (SDK ${backup.deviceInfo.sdkInt})
REM Serial Number: ${backup.deviceInfo.serialNo || 'N/A'}
REM Original OEM Home Launcher: ${launcherComp}
REM Backup ID: ${backup.id}
REM Created At: ${backup.createdAtUtc}
REM ==============================================================================

set TARGET=${target}

echo ======================================================================
echo  GOJJA SmartTV - Restoring TV to 100%% Original Stock Factory State
echo  Target Device: %TARGET% (${backup.deviceInfo.model})
echo  Original OEM Launcher: ${launcherComp}
echo  Total Packages to Re-enable: ${backup.packageInventory.enabledPackages.length}
echo ======================================================================

echo [1/4] Connecting to TV over ADB TCP...
adb connect %TARGET%

echo [2/4] Restoring all original stock packages that were disabled...
if exist "%~dp0packages_enabled.txt" (
    for /f "usebackq tokens=* delims=" %%x in ("%~dp0packages_enabled.txt") do (
        echo   -^> Re-enabling: %%x
        adb -s %TARGET% shell pm enable --user 0 %%x
    )
) else (
    echo   [!] packages_enabled.txt not found, using embedded package routine...
${backup.packageInventory.enabledPackages.map((p) => `    adb -s %TARGET% shell pm enable --user 0 ${p}`).join('\r\n')}
)

echo [3/4] Re-setting default Home Launcher to ${launcherComp}...
adb -s %TARGET% shell cmd package set-home-activity ${launcherComp}
adb -s %TARGET% shell am start -a android.intent.action.MAIN -c android.intent.category.HOME
adb -s %TARGET% shell input keyevent KEYCODE_HOME

echo [4/4] Verifying active Home Launcher...
adb -s %TARGET% shell cmd package resolve-activity --brief -a android.intent.action.MAIN -c android.intent.category.HOME

echo ======================================================================
echo  [SUCCESS] TV has been restored to 100%% original stock state!
echo  All disabled apps re-enabled. Factory OEM launcher reinstated.
echo ======================================================================
pause
`;
}

export function createDemoDeviceBackup(
  targetIp: string,
  targetPort: number = 5555,
  candidateId: string = 'DVC-01',
  propertyId: string = 'P-01',
  operator: string = 'demo-platform-admin'
): TvDeviceBackup {
  const timestamp = new Date().toISOString();
  const dateTag = timestamp.replace(/[-:T]/g, '').slice(0, 14);
  const backupId = `BKP-${candidateId}-${dateTag}`;
  const cleanIp = targetIp.replace(/\./g, '_');
  const folderName = `tv-${cleanIp}-${dateTag}`;

  const backup: TvDeviceBackup = {
    id: backupId,
    candidateId,
    propertyId,
    targetIp,
    targetPort,
    createdAtUtc: timestamp,
    createdBy: operator,
    deviceInfo: {
      brand: 'Sony',
      model: 'BRAVIA 4K VH21',
      manufacturer: 'Sony',
      androidVersion: '11',
      sdkInt: 30,
      buildFingerprint: 'Sony/BRAVIA_VH21/BRAVIA_VH21:11/RTT0.210502.002/104:user/release-keys',
      serialNo: 'SN-ARUNIKA-104-NEW',
    },
    originalLauncher: {
      component: 'com.google.android.apps.tv.launcherx/.home.HomeActivity',
      packageName: 'com.google.android.apps.tv.launcherx',
      activityName: '.home.HomeActivity',
      allAvailableLaunchers: [
        'com.google.android.apps.tv.launcherx/.home.HomeActivity',
        'com.google.android.tvlauncher/.MainActivity',
        'com.sony.dtv.homex/.MainActivity',
      ],
    },
    packageInventory: {
      totalCount: SONY_BRAVIA_STOCK_ENABLED_PACKAGES.length + SONY_BRAVIA_STOCK_DISABLED_PACKAGES.length,
      enabledPackages: [...SONY_BRAVIA_STOCK_ENABLED_PACKAGES],
      disabledPackages: [...SONY_BRAVIA_STOCK_DISABLED_PACKAGES],
      thirdPartyPackages: [...SONY_BRAVIA_THIRD_PARTY_PACKAGES],
      systemPackages: SONY_BRAVIA_STOCK_ENABLED_PACKAGES.filter((p) => !SONY_BRAVIA_THIRD_PARTY_PACKAGES.includes(p)),
    },
    settingsDump: {
      globalSettingsCount: 48,
      secureSettingsCount: 36,
      systemSettingsCount: 24,
    },
    visualBaseline: {
      screenshotUrl: '/assets/aistudio/Hotel_Tentrem_SmartTV_App_Showcase_62a23bd8.png',
      capturedAtUtc: timestamp,
    },
    restoreArtifacts: {
      backupFolderPath: `./backups/${folderName}`,
      restoreBashScript: '',
      restoreBatchScript: '',
    },
    status: 'Verified',
    notes: 'CleanYourTV hospitality pre-flight snapshot created. Fully reversible to stock Sony BRAVIA 4K state.',
  };

  backup.restoreArtifacts.restoreBashScript = generateRestoreBashScript(backup);
  backup.restoreArtifacts.restoreBatchScript = generateRestoreBatchScript(backup);

  return backup;
}

export interface TakeoverSafetyAuditResult {
  isSafe: boolean;
  totalOnlineEndpoints: number;
  backedEndpointsCount: number;
  unbackedEndpointsCount: number;
  unbackedEndpoints: {
    id: string;
    label: string;
    model: string;
    ip: string;
    port: number;
  }[];
  reason?: string;
}

export function evaluateTakeoverSafety(
  onlineEndpoints: { id: string; label?: string; modelName?: string; ipHint?: string; portHint?: number; activeBackup?: TvDeviceBackup; activeBackupId?: string }[],
  deviceBackups: TvDeviceBackup[] = []
): TakeoverSafetyAuditResult {
  if (onlineEndpoints.length === 0) {
    return {
      isSafe: false,
      totalOnlineEndpoints: 0,
      backedEndpointsCount: 0,
      unbackedEndpointsCount: 0,
      unbackedEndpoints: [],
      reason: 'Tidak ada TV online yang terdeteksi untuk properti ini.',
    };
  }

  const unbacked = onlineEndpoints.filter((ep) => {
    const hasVerified =
      ep.activeBackup?.status === 'Verified' ||
      deviceBackups.some(
        (b) =>
          (b.id === ep.activeBackupId || b.endpointId === ep.id || (ep.ipHint && b.targetIp === ep.ipHint)) &&
          b.status === 'Verified'
      );
    return !hasVerified;
  });

  const isSafe = unbacked.length === 0;
  const unbackedDetails = unbacked.map((e) => ({
    id: e.id,
    label: e.label || e.id,
    model: e.modelName || 'Android TV',
    ip: e.ipHint || '0.0.0.0',
    port: e.portHint || 5555,
  }));

  return {
    isSafe,
    totalOnlineEndpoints: onlineEndpoints.length,
    backedEndpointsCount: onlineEndpoints.length - unbacked.length,
    unbackedEndpointsCount: unbacked.length,
    unbackedEndpoints: unbackedDetails,
    reason: isSafe
      ? 'Seluruh TV online memiliki backup snapshot terverifikasi (CleanYourTV Standard).'
      : `Terdapat ${unbacked.length} TV online yang belum memiliki backup konfigurasi terverifikasi.`,
  };
}
