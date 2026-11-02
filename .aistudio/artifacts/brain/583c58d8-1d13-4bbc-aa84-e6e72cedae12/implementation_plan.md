# Implementation Plan: Real Brand Studio Media Uploads & `GojjaCleanTV` (`GojjaLauncher`) SmartTV ADB Takeover

## 1. Architectural Overview

This upgrade transforms **Brand Studio**, **Promotions & Campaigns**, and the **SmartTV Deployment Pipeline** into a complete hospitality branding and existing-TV replacement system inspired by the non-root ADB architecture of `Gathin23/cleanyourtv` — built natively as **GojjaCleanTV (`GojjaLauncher`)**.

### Core Capabilities
1. **Real Brand Studio Media Uploads + Curated Hospitality Presets**:
   - **Hotel Brand Logo (`logoImageUrl`)**: Upload a transparent PNG, SVG, WebP, or JPG logo directly from the computer (persisted via server-side storage/Data URL up to 25MB), enter a direct image URL, or toggle between **Image Logo + Wordmark** vs **Image Logo Only**.
   - **TV Home / Welcome Background (`heroImageUrl` & `heroVideoUrl` + `heroMediaType: 'image' | 'video'`)**: Upload a custom 1080p/4K hotel background photo or looping MP4/WebM ambient video, enter a URL, or one-click select from curated luxury hospitality video & photo presets (Infinity Pool Aerial Loop, Javanese Sanctuary Dusk, Oceanfront Resort Villa, Culinary & Spa Showcase).
   - **Featured Promotional Video / Banner (`promoMediaUrl` & `promoMediaType: 'image' | 'video'`)**: Upload or select promotional videos and images directly inside **Brand Studio** and **Promotions & Campaigns (`activeTab === 'campaigns'`)**, which immediately play inside the 10-foot SmartTV **Welcome Screen**, **Home Screen**, and **04 Promo** tab.

2. **`GojjaCleanTV` & `GojjaLauncher` Engine (Non-Root ADB SmartTV Replacement)**:
   - Built on the same technical principles as `Gathin23/cleanyourtv`, tailored specifically for hospitality fleet management under the **GOJJA SmartTV** brand (`tv.gojja.hospitality.launcher` / `GojjaLauncher.apk`):
     - **Step 1 — Non-Root ADB Handshake**: Connects to existing consumer/commercial Android TV or Google TV devices over LAN (`adb connect <tv-ip>:5555`).
     - **Step 2 — Stock OEM & Google TV Debloat (`pm disable-user --user 0`)**: Safely disables ad-heavy stock launchers and telemetry bloatware without root:
       - `com.google.android.tvlauncher` (Google TV Ad Launcher)
       - `com.google.android.leanbacklauncher` (Android TV Stock Launcher)
       - `com.google.android.tungsten.setupwraith` / OEM bloatware packages (`com.netflix.ninja`, `com.amazon.amazonvideo.livingroom`, `com.google.android.youtube.tv` — configurable per hotel policy).
     - **Step 3 — Reversible Package State Backup**: Records disabled packages per TV endpoint so hotels can click **Restore Stock TV Launcher (`pm enable`)** at any time with zero factory reset required.
     - **Step 4 — `GojjaLauncher` Home Screen Takeover**: Installs and locks `tv.gojja.hospitality.launcher/.GojjaHomeActivity` via `adb shell cmd package set-home-activity tv.gojja.hospitality.launcher/.GojjaHomeActivity` and launches the live branded hospitality dashboard (`am start -a android.intent.action.MAIN -c android.intent.category.HOME`).
   - **Interactive `GojjaCleanTV` Control Panel & Downloadable CLI Script (`gojja-cleantv.sh` / `gojja-cleantv.bat`)**:
     - Accessible directly inside **Brand Studio** (and **Discovery & Deploy**), allowing operators to:
       - Select Debloat Profile (**Strict Hospitality Kiosk**, **Clean Launcher + Keep Streaming Apps**, or **Custom Package Selection**).
       - Run **Apply `GojjaLauncher` Takeover to Property Fleet / Room TV** (executes real ADB commands in `LIVE_LAB` mode or updates fleet state in `DEMO` mode, visually switching the TV between *Stock Google TV Ad Screen* and *GojjaLauncher Branded Hospitality Screen*).
       - Download a ready-to-run, self-contained **`gojja-cleantv.sh` (macOS/Linux)** or **`gojja-cleantv.ps1` (Windows PowerShell)** automation script pre-configured with the property's TV IP addresses, brand manifest URL, and reversible `--restore` flag.

---

## 2. Planned Code Changes

### A. Data Models & Curated Hospitality Presets (`/src/data/mockData.ts`)
- Extend `Property` interface with:
  - `logoImageUrl?: string;`
  - `heroMediaType?: 'image' | 'video';`
  - `heroVideoUrl?: string;`
  - `promoMediaType?: 'image' | 'video';`
  - `promoMediaUrl?: string;`
  - `promoTitle?: string;`
  - `launcherConfig?: { mode: 'GOJJA_LAUNCHER' | 'STOCK_TV_LAUNCHER'; profile: 'STRICT_KIOSK' | 'CLEAN_WITH_OTT' | 'CUSTOM'; disabledPackages: string[]; lastAppliedAt: string; launcherVersion: string; };`
- Extend `Campaign` interface with:
  - `mediaUrl?: string;`
  - `mediaType?: 'image' | 'video';`
- Add `CURATED_BRAND_MEDIA_PRESETS` containing verified, high-speed MP4 video loops and 4K resort photography presets, plus sample SVG/PNG luxury hotel crest logos so users can test video/logo switching with a single click in addition to uploading files from their computer.

### B. Backend Endpoints & `GojjaCleanTV` Script Generator (`/server.ts`)
- Increase Express JSON body limit (`express.json({ limit: '30mb' })`) so direct base64/Data-URL image and short video uploads from the browser persist reliably without payload size errors.
- Update `POST /api/branding/draft` and `POST /api/branding/publish` to persist `logoImageUrl`, `heroMediaType`, `heroImageUrl`, `heroVideoUrl`, `promoMediaType`, `promoMediaUrl`, `promoTitle`, and `launcherConfig`.
- Update `POST /api/campaigns/create` to persist `mediaUrl` and `mediaType` (`image` | `video`).
- Add `POST /api/branding/launcher-takeover`:
  - Accepts `propertyId`, `endpointId` (or `'ALL'`), `action` (`'APPLY_GOJJA_LAUNCHER'` | `'RESTORE_STOCK_LAUNCHER'`), `profile`, and `disabledPackages`.
  - In `LIVE_LAB` mode, executes real ADB commands (`pm disable-user --user 0 ...`, `cmd package set-home-activity tv.gojja.hospitality.launcher/.GojjaHomeActivity`, `input keyevent KEYCODE_HOME`) against connected TV IPs; in `DEMO` mode, updates the property and endpoint launcher state and logs the exact ADB command transcript.

### C. Brand Studio & Campaigns Real Upload UI + `GojjaCleanTV` Panel (`/src/App.tsx`)
- In **Brand Studio (`activeTab === 'branding'`)**:
  - **1. Brand Logo Uploader**: Drag-and-drop / file picker (`PNG, SVG, JPG, WebP`), direct URL input, one-click luxury hotel crest presets, and live preview thumbnail with "Remove / Reset to Text Logo" button.
  - **2. Welcome / Hero Background Media (Image or Video)**: Toggle between **Image Backdrop** and **Looping Video Backdrop (`MP4/WebM`)**, with computer file upload (`<input type="file" accept="image/*,video/*" />`), URL input, and Curated Resort Video/Photo Presets.
  - **3. Featured In-Room Promo Video / Image**: Upload a promotional video or poster image directly in Brand Studio (or in **Promotions & Campaigns**) that syncs with the TV's `04 Promo` showcase and Welcome screen.
  - **4. `GojjaCleanTV` (`GojjaLauncher`) SmartTV Override & Debloat Panel**:
    - Interactive toggle & status badge showing `Active Launcher: GojjaLauncher v4.2 (Stock Launcher Disabled)` vs `Stock Google TV Launcher (Ad-Heavy)`.
    - Selectable Debloat Package Checklist (`com.google.android.tvlauncher`, `com.google.android.leanbacklauncher`, `com.google.android.tungsten.setupwraith`, `com.netflix.ninja`, `com.google.android.youtube.tv`, etc.).
    - Action buttons: **Apply `GojjaLauncher` Takeover (ADB)**, **Restore Stock TV Launcher**, and **Download `gojja-cleantv.sh` Script** (generates and downloads a complete shell script modeled on `cleanyourtv` customized for the active property).
- In **Promotions & Campaigns (`activeTab === 'campaigns'`)**:
  - Add file upload (`image/*,video/*`) + URL input + preset selector when creating a new campaign, and render video/image previews on campaign cards.

### D. 10-Foot SmartTV Guest Experience (`/src/components/TvGuestAppModal.tsx`)
- Render `property.logoImageUrl` in the top-left TV header (alongside or replacing text wordmark).
- Render `<video autoPlay loop muted playsInline src={property.heroVideoUrl} />` when `heroMediaType === 'video'` is active, with smooth fallback to `heroImageUrl`.
- Support playing uploaded promotional videos (`<video controls autoPlay loop muted />`) and campaign media inside the **04 Promo** screen and Welcome screen.
- Add a **`Launcher Mode` Preview Toggle** (`GojjaLauncher Hospitality OS` vs `Stock Android TV Before GojjaCleanTV`) in the TV Preview header so stakeholders can visually compare a cluttered stock SmartTV vs the clean, branded `GojjaLauncher` experience.

---

## 3. Verification Criteria
- Uploading a custom logo image, background video/image, or promotional video/image in **Brand Studio** immediately updates the live embedded TV preview and the full-screen **TV Guest App Preview** modal, and persists across Save Draft & Publish Changes.
- Running **Apply `GojjaLauncher` Takeover** updates the property/device launcher state, logs the ADB `pm disable-user` + `cmd package set-home-activity` sequence, and allows downloading the self-contained `gojja-cleantv.sh` script.
- `lint_applet` and `compile_applet` pass with zero TypeScript or build errors.
