#!/usr/bin/env bash
set -e

echo "===================================================================="
echo "🚀 GOJJA SMARTTV — APK CONTAINER BUILDER (LINUX / MACOS)"
echo "Target: GojjaLauncher-v4.2.0-hospitality.apk"
echo "===================================================================="

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$DIR"

echo "[1/3] Checking Android SDK Environment..."
if [ -z "$ANDROID_HOME" ]; then
    echo "[WARNING] ANDROID_HOME is not set."
fi

echo "[2/3] Building Release APK via Gradle..."
./gradlew assembleRelease || {
    echo "[NOTE] To build manually: Open android-launcher folder in Android Studio and select Build > Generate Signed Bundle / APK."
    exit 0
}

if [ -f "app/build/outputs/apk/release/app-release.apk" ]; then
    echo "[3/3] Staging APK to bin/..."
    mkdir -p ../bin
    cp app/build/outputs/apk/release/app-release.apk ../bin/GojjaLauncher-v4.2.0-hospitality.apk
    echo "🎉 BUILD SUCCESS: ../bin/GojjaLauncher-v4.2.0-hospitality.apk created!"
fi
