plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

android {
    namespace = "tv.gojja.hospitality.launcher"
    compileSdk = 34

    defaultConfig {
        applicationId = "tv.gojja.hospitality.launcher"
        minSdk = 21
        targetSdk = 34
        versionCode = 420
        versionName = "4.2.0-hospitality"

        // Hospitality default URL (can be overridden via ADB or Settings)
        manifestPlaceholders["defaultServerUrl"] = "http://192.168.1.50:5173"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
            signingConfig = signingConfigs.getByName("debug")
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_1_8
        targetCompatibility = JavaVersion.VERSION_1_8
    }

    kotlinOptions {
        jvmTarget = "1.8"
    }
}

dependencies {
    implementation("androidx.core:core-ktx:1.12.0")
    implementation("androidx.appcompat:appcompat:1.6.1")
    implementation("androidx.leanback:leanback:1.0.0")
}
