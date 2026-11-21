package tv.gojja.hospitality.launcher

import android.annotation.SuppressLint
import android.app.Activity
import android.content.Context
import android.content.SharedPreferences
import android.os.Bundle
import android.os.PowerManager
import android.view.KeyEvent
import android.view.View
import android.view.WindowManager
import android.webkit.*
import android.widget.FrameLayout

/**
 * GOJJA SmartTV Hospitality Launcher Container Activity
 * Standard: CleanYourTV Reversible Android TV Home Screen Architecture
 */
class GojjaHomeActivity : Activity() {

    private lateinit var webView: WebView
    private lateinit var prefs: SharedPreferences
    private var wakeLock: PowerManager.WakeLock? = null

    companion object {
        const val PREFS_NAME = "GojjaLauncherPrefs"
        const val KEY_SERVER_URL = "server_url"
        const val DEFAULT_FALLBACK_URL = "http://192.168.1.50:5173/?mode=tv-guest&kiosk=true"
    }

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // 1. Fullscreen Immersive TV Kiosk (Hide Status Bar & Navigation Bar)
        window.setFlags(
            WindowManager.LayoutParams.FLAG_FULLSCREEN,
            WindowManager.LayoutParams.FLAG_FULLSCREEN
        )
        window.decorView.systemUiVisibility = (
            View.SYSTEM_UI_FLAG_FULLSCREEN or
            View.SYSTEM_UI_FLAG_HIDE_NAVIGATION or
            View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY or
            View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN or
            View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION or
            View.SYSTEM_UI_FLAG_LAYOUT_STABLE
        )

        // Prevent screen sleep while in hospitality display mode
        window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)

        prefs = getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)

        // 2. Inisialisasi Hardware-Accelerated WebView
        val rootLayout = FrameLayout(this)
        webView = WebView(this).apply {
            layoutParams = FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT,
                FrameLayout.LayoutParams.MATCH_PARENT
            )
            isFocusable = true
            isFocusableInTouchMode = true

            settings.apply {
                javaScriptEnabled = true
                domStorageEnabled = true
                databaseEnabled = true
                
                // STANDAR KRITIS 4: Bypass Autoplay Media Policy
                // Wajib disetel false agar siaran IPTV dan video promosi hotel bisa autoplay tanpa klik remote
                mediaPlaybackRequiresUserGesture = false
                
                allowFileAccess = true
                allowContentAccess = true
                cacheMode = WebSettings.LOAD_DEFAULT
                mixedContentMode = WebSettings.MIXED_CONTENT_ALWAYS_ALLOW
                useWideViewPort = true
                loadWithOverviewMode = true
            }

            // 3. Pasang Native Bridge (@JavascriptInterface)
            addJavascriptInterface(GojjaNativeBridge(this@GojjaHomeActivity, this), "AndroidTvBridge")

            webViewClient = object : WebViewClient() {
                override fun onReceivedError(view: WebView?, request: WebResourceRequest?, error: WebResourceError?) {
                    super.onReceivedError(view, request, error)
                    // Auto retry connection if server was momentarily restarting
                }
            }

            webChromeClient = object : WebChromeClient() {}
        }

        rootLayout.addView(webView)
        setContentView(rootLayout)

        // 4. Muat URL Hospitality CMS Aktif
        val activeUrl = prefs.getString(KEY_SERVER_URL, DEFAULT_FALLBACK_URL) ?: DEFAULT_FALLBACK_URL
        webView.loadUrl(activeUrl)
        webView.requestFocus()
    }

    /**
     * Intersepsi Tombol Remote D-Pad & Back
     */
    override fun dispatchKeyEvent(event: KeyEvent): Boolean {
        if (event.action == KeyEvent.ACTION_DOWN) {
            when (event.keyCode) {
                KeyEvent.KEYCODE_BACK -> {
                    // Teruskan event Back ke Web App untuk menutup modal atau kembali ke menu sebelumnya
                    webView.evaluateJavascript(
                        "window.dispatchEvent(new KeyboardEvent('keydown', {'key': 'Escape'}));",
                        null
                    )
                    return true // Cegah keluar dari Home Activity
                }
                KeyEvent.KEYCODE_DPAD_CENTER, KeyEvent.KEYCODE_ENTER -> {
                    webView.evaluateJavascript(
                        "window.dispatchEvent(new KeyboardEvent('keydown', {'key': 'Enter'}));",
                        null
                    )
                }
                KeyEvent.KEYCODE_DPAD_UP -> {
                    webView.evaluateJavascript(
                        "window.dispatchEvent(new KeyboardEvent('keydown', {'key': 'ArrowUp'}));",
                        null
                    )
                }
                KeyEvent.KEYCODE_DPAD_DOWN -> {
                    webView.evaluateJavascript(
                        "window.dispatchEvent(new KeyboardEvent('keydown', {'key': 'ArrowDown'}));",
                        null
                    )
                }
                KeyEvent.KEYCODE_DPAD_LEFT -> {
                    webView.evaluateJavascript(
                        "window.dispatchEvent(new KeyboardEvent('keydown', {'key': 'ArrowLeft'}));",
                        null
                    )
                }
                KeyEvent.KEYCODE_DPAD_RIGHT -> {
                    webView.evaluateJavascript(
                        "window.dispatchEvent(new KeyboardEvent('keydown', {'key': 'ArrowRight'}));",
                        null
                    )
                }
            }
        }
        return super.dispatchKeyEvent(event)
    }

    override fun onResume() {
        super.onResume()
        webView.onResume()
    }

    override fun onPause() {
        super.onPause()
        webView.onPause()
    }

    override fun onDestroy() {
        super.onDestroy()
        wakeLock?.let { if (it.isHeld) it.release() }
        webView.destroy()
    }
}
