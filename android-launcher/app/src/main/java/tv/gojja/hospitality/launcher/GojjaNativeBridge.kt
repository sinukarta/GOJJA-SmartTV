package tv.gojja.hospitality.launcher

import android.content.Context
import android.content.Intent
import android.net.wifi.WifiManager
import android.os.Build
import android.webkit.JavascriptInterface
import android.webkit.WebView
import android.widget.Toast
import java.net.NetworkInterface
import java.util.*

/**
 * Native Android JavaScript Interface Bridge
 * Memberikan akses hardware TV dan peluncuran aplikasi eksternal (Netflix, YouTube) ke antarmuka web GOJJA.
 */
class GojjaNativeBridge(
    private val context: Context,
    private val webView: WebView
) {

    /**
     * Membuka Aplikasi OTT Eksternal (Netflix, YouTube, Prime Video, Spotify)
     * Menggunakan Leanback Launch Intent resmi Android TV
     */
    @JavascriptInterface
    fun launchOttApp(packageName: String): Boolean {
        return try {
            val pm = context.packageManager
            val intent = pm.getLeanbackLaunchIntentForPackage(packageName)
                ?: pm.getLaunchIntentForPackage(packageName)
            if (intent != null) {
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                context.startActivity(intent)
                true
            } else {
                false
            }
        } catch (e: Exception) {
            e.printStackTrace()
            false
        }
    }

    /**
     * Mengecek apakah paket aplikasi tertentu terpasang di TV
     */
    @JavascriptInterface
    fun isPackageInstalled(packageName: String): Boolean {
        return try {
            context.packageManager.getPackageInfo(packageName, 0)
            true
        } catch (e: Exception) {
            false
        }
    }

    /**
     * Memperbarui URL Server CMS dinamis secara lokal
     */
    @JavascriptInterface
    fun setServerUrl(newUrl: String): Boolean {
        return try {
            val prefs = context.getSharedPreferences(GojjaHomeActivity.PREFS_NAME, Context.MODE_PRIVATE)
            prefs.edit().putString(GojjaHomeActivity.KEY_SERVER_URL, newUrl).apply()
            webView.post { webView.loadUrl(newUrl) }
            true
        } catch (e: Exception) {
            false
        }
    }

    /**
     * Memuat ulang tampilan TV (Hot-Reload)
     */
    @JavascriptInterface
    fun reloadScreen() {
        webView.post { webView.reload() }
    }

    /**
     * Ekspor Data Telemetri & Identitas Perangkat Hardware TV
     */
    @JavascriptInterface
    fun getDeviceInfoJson(): String {
        val ipAddress = getLocalIpAddress()
        return """
            {
                "manufacturer": "${Build.MANUFACTURER}",
                "model": "${Build.MODEL}",
                "brand": "${Build.BRAND}",
                "device": "${Build.DEVICE}",
                "androidVersion": "${Build.VERSION.RELEASE}",
                "sdkInt": ${Build.VERSION.SDK_INT},
                "ipAddress": "$ipAddress",
                "appVersion": "4.2.0-hospitality"
            }
        """.trimIndent()
    }

    private fun getLocalIpAddress(): String {
        try {
            val interfaces = Collections.list(NetworkInterface.getNetworkInterfaces())
            for (intf in interfaces) {
                val addrs = Collections.list(intf.inetAddresses)
                for (addr in addrs) {
                    if (!addr.isLoopbackAddress && addr.hostAddress.indexOf(':') < 0) {
                        return addr.hostAddress ?: "127.0.0.1"
                    }
                }
            }
        } catch (ex: Exception) {
            ex.printStackTrace()
        }
        return "127.0.0.1"
    }
}
