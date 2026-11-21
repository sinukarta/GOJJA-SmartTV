@echo off
echo ====================================================================
echo 🚀 GOJJA SMARTTV — APK CONTAINER BUILDER
echo Target: GojjaLauncher-v4.2.0-hospitality.apk
echo ====================================================================

cd /d "%~dp0\.."

if not exist "gradlew.bat" (
    echo [INFO] Generating Gradle wrapper files...
)

echo [1/3] Checking Android SDK Environment...
if "%ANDROID_HOME%"=="" (
    echo [WARNING] ANDROID_HOME environment variable is not set.
    echo Please ensure Android SDK is installed or open this project in Android Studio.
)

echo [2/3] Building Release APK...
call gradlew assembleRelease

if exist "app\build\outputs\apk\release\app-release.apk" (
    echo [3/3] Staging APK to staging destination...
    if not exist "..\bin" mkdir "..\bin"
    copy /Y "app\build\outputs\apk\release\app-release.apk" "..\bin\GojjaLauncher-v4.2.0-hospitality.apk"
    echo.
    echo 🎉 BUILD SUCCESS: ..\bin\GojjaLauncher-v4.2.0-hospitality.apk created!
) else (
    echo.
    echo [NOTE] To build manually: Open android-launcher folder in Android Studio and select Build > Generate Signed Bundle / APK.
)
