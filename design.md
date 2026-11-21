# GOJJA SmartTV CMS — Unified Design System & UX/UI Specification
*Standardized Architecture, Tokens, Typography, Responsive Tables, 10-Foot Big Screen & Hospitality Components for Enterprise Smart TV Fleet Management*

---

## 1. Design System Philosophy & Principles

GOJJA SmartTV CMS is built for hotel property managers, owners, system installers, and hospitality staff who manage real-time in-room TV hardware, guest experiences, and multimedia distribution. 

1. **Executive Hospitality Aesthetic**: A clean, balanced palette combining deep cobalt accents (`#0050F5`), warm ivory/slate surfaces, and high-contrast typography reflecting five-star luxury standards.
2. **Zero Text Overflow & Rock-Solid Responsiveness**: Tables, cards, and forms never cramp, burst, or overflow across viewports (from 360px mobile screens to 4K ultra-wide displays).
3. **Zero-PII Compliance by Design**: Guest names, identifiers, and sensitive data are presented through structured masking patterns (`B*** S***`) with clear front-office permission toggles.
4. **Consistent Sub-Navigation & Component Hierarchy**: Standardized button pills, count badges, cards, and action buttons ensure seamless predictability across all modules.
5. **Fail-Safe Safety Visuals**: Destructive or irreversible hardware actions are visually locked with amber guardrails (`ShieldAlert`) and unlock only upon positive verification with green telemetry (`ShieldCheck`).
6. **10-Foot UI Fidelity**: The guest-facing TV interface is purpose-built for big screens (1920x1080), high-contrast readability from a 3-meter viewing distance, and seamless remote control (D-Pad) focus states.

---

## 2. Color Palette & Token Reference

All colors are controlled via CSS variables in `src/index.css` to guarantee 100% fidelity between Light Mode and Dark Mode.

### 2.1 Brand & Action Accents
| Token | Hex (Light / Dark) | Usage |
|---|---|---|
| `--brand-cobalt` | `#0050F5` | Primary action buttons, active navigation pills, highlighted links |
| `--brand-indigo` | `#4F3FE5` | Luxury gradient CTA, system highlights, launcher brand |
| `--brand-violet` | `#7C35E0` | Creative accents, suite tier accents |
| `--brand-coral` | `#FF5E70` | Secondary charts, urgency highlights |
| `--brand-gold` | `#E5C185` | Champagne luxury crest, VIP corporate accents, orbital loader inner ring |

### 2.2 Surface & Layout Tokens
| Token | Light Theme | Dark Theme | Purpose |
|---|---|---|---|
| `--cms-bg` | `#F6F4EF` (Ivory warm) | `#4B4A47` (Warm slate) | Application background |
| `--cms-surface` | `#FFFFFF` | `#5B5955` | Cards, tables, drawers, modal containers |
| `--cms-sidebar` | `#FFFFFF` | `#4B4A47` | Navigation sidebar background |
| `--cms-divider` | `#E3E7EF` | `#77746E` | 1px clean separator lines |
| `--cms-control-border` | `#7A8496` | `#C3BFB6` | Form inputs, select dropdowns, borders |
| `--cms-text` | `#10172F` | `#F8F5EE` | Primary headers, strong labels, table rows |
| `--cms-text-secondary` | `#586174` | `#E2DFD8` | Captions, subtitles, inactive nav, table headers |

### 2.3 Semantic Status Badges
| Status | Background & Text Classes | Indicator Dot | Typical Use |
|---|---|---|---|
| **Online / Success** | `bg-emerald-500/15 text-emerald-700 dark:text-emerald-300` | `bg-emerald-500 animate-pulse` | TV Online, Housekeeping Ready, Fulfilled, GojjaLauncher Active |
| **Warning / Pending** | `bg-amber-500/15 text-amber-800 dark:text-amber-300` | `bg-amber-500` | Requested, Dirty HK, Contract Review, Safety Lock Engaged, Stock OEM |
| **Danger / Offline** | `bg-rose-500/15 text-rose-700 dark:text-rose-300` | `bg-rose-500` | TV Offline, Check-Out & Purge, Rejected, Blocked, Corrupted Backup |
| **Informational** | `bg-blue-500/10 text-blue-600 dark:text-blue-400` | `bg-blue-500` | InHouse stay, TV locale badges, categories, dynamic manifest notice |

---

## 3. Unified Typography Standard (Plus Jakarta Sans)

To eliminate any visual font discrepancies across pages, buttons, and inputs, the entire application strictly standardizes on **Plus Jakarta Sans** as the unified neo-grotesque font for all headings, body text, inputs, buttons, and badges. Hardware identifiers, IP addresses, and currency continue to utilize **JetBrains Mono** with tabular numerals.

```css
--font-heading: "Plus Jakarta Sans", "Noto Sans SC", "Noto Sans JP", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
--font-ui: "Plus Jakarta Sans", "Noto Sans SC", "Noto Sans JP", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
--font-mono: "JetBrains Mono", monospace;

html, body, button, input, select, textarea, optgroup {
  font-family: var(--font-ui);
}
```

### Type Scale & Letter Spacing
- **Page Titles**: `text-2xl font-bold tracking-tight text-[var(--cms-text)]` (letter-spacing: -0.02em)
- **Section Headers**: `text-base font-bold text-[var(--cms-text)]`
- **Sub-headers & Descriptions**: `text-xs text-[var(--cms-text-secondary)] leading-relaxed`
- **Table Column Headers**: `text-[11px] font-semibold uppercase tracking-wider text-[var(--cms-text-secondary)]`
- **Standard Body, Buttons & Inputs**: `text-xs text-[var(--cms-text)]`
- **Ringkasan Properti & KPI Cards**: Unified in Plus Jakarta Sans using `tabular-nums font-bold` (or `<RollingKpiValue />` with `formatIdr`). Single metrics (`12`), ratios (`5 / 7`, `4 / 6`), and formatted currency (`Rp180.000`) share identical font geometry, weight, and baseline alignment.
- **Hardware IDs, IPs, Code Tokens**: `font-mono-tabular font-bold` (`font-variant-numeric: tabular-nums`) rendered in JetBrains Mono.

---

## 4. Sub-Navigation Pill Standards

All sub-tab bars across `Rooms & Guests`, `Marketplace & Ads`, `Content Library`, etc. MUST use the standardized cobalt pill system:

### Container
```tsx
<div className="flex items-center gap-2 border-b border-[var(--cms-divider)] pb-3 overflow-x-auto luxury-scrollbar">
```

### Active Button
```tsx
<button
  type="button"
  onClick={() => setActiveSubTab('tab-name')}
  className="px-4 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap bg-[#0050F5] text-white shadow-xs"
>
  <Icon className="w-4 h-4" />
  <span>Nama Tab</span>
  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono-tabular font-bold bg-white/20 text-white">
    {count}
  </span>
</button>
```

### Inactive Button
```tsx
<button
  type="button"
  onClick={() => setActiveSubTab('tab-name')}
  className="px-4 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap text-[var(--cms-text-secondary)] hover:text-[var(--cms-text)] hover:bg-black/5 dark:hover:bg-white/5"
>
  <Icon className="w-4 h-4" />
  <span>Nama Tab</span>
  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono-tabular font-bold bg-black/5 dark:bg-white/10 text-[var(--cms-text-secondary)]">
    {count}
  </span>
</button>
```

---

## 5. The 6 Anti-Overflow Table Architecture Rules

To prevent table text from bursting into divs (`jebol text ke div`) and guarantee seamless desktop & mobile responsiveness:

### Rule 1: Dual-Container Wrapping
Every table must be wrapped in a card container with `overflow-hidden`, and an inner scrolling div with `luxury-scrollbar`:
```tsx
<div className="rounded-2xl bg-[var(--cms-surface)] border border-[var(--cms-divider)] shadow-xs overflow-hidden">
  <div className="overflow-x-auto luxury-scrollbar">
    <table className="w-full min-w-[940px] text-left border-collapse text-xs">
      {/* ... */}
    </table>
  </div>
</div>
```

### Rule 2: Explicit Minimum Widths (`min-w-[...]`)
Never use bare `w-full` without an explicit minimum pixel width. Suggested minimums:
- **7+ Columns** (`Rooms & TV`, `Marketplace Orders`, `Devices Fleet`): `min-w-[940px]`..`min-w-[960px]`
- **5-6 Columns** (`Channel Lineup`, `Invoices`, `Audit Logs`): `min-w-[840px]`..`min-w-[880px]`
- **4 Columns** (`Acceptance Criteria`, `Short Summaries`): `min-w-[700px]`..`min-w-[760px]`

### Rule 3: Text Truncation with Tooltips
Never allow unbounded user strings (Guest Names, Group Names, Notes, URLs) to wrap into arbitrary heights:
```tsx
<div className="truncate max-w-[200px] text-[var(--cms-text)]" title={longString}>
  {longString}
</div>
```

### Rule 4: Action Button Clusters
Action buttons and status pills MUST have `whitespace-nowrap` and right-aligned action cells:
```tsx
<td className="py-3 px-4 text-right whitespace-nowrap">
  <button className="px-3 py-1.5 rounded-xl bg-[#0050F5] hover:bg-[#0040C8] text-white font-semibold text-xs shadow-xs inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap">
    <Play className="w-3.5 h-3.5" />
    <span>Action</span>
  </button>
</td>
```

### Rule 5: Standardized Bound TV Chip
Bound TV endpoints inside table cells must use the structured 2-line card pattern rather than uncontained horizontal flex strings:
```tsx
<div className="p-2 rounded-xl bg-[var(--cms-bg)] border border-[var(--cms-divider)] space-y-0.5">
  <div className="flex items-center justify-between gap-2">
    <span className="font-mono-tabular font-bold text-xs text-[var(--cms-text)] flex items-center gap-1.5">
      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
      {ep.id} · {ep.label || ep.modelName}
    </span>
    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
      {ep.connection}
    </span>
  </div>
  <div className="text-[10px] text-[var(--cms-text-secondary)] font-mono-tabular truncate" title={`${ep.capabilityProfile} (v${ep.appVersion})`}>
    {ep.capabilityProfile} · v{ep.appVersion}
  </div>
</div>
```

### Rule 6: Symmetrical Edge Column Padding (`px-6`)
To prevent cell contents from touching table card borders (`nempel`) and provide a generous luxury breathing room:
- **First column**: `py-4 px-6` (or `py-3.5 px-6` in `<thead>`).
- **Intermediate columns**: `py-4 px-4` (or `py-3.5 px-4` in `<thead>`).
- **Last column (Actions / Status / Feed)**: `py-4 px-6 text-right whitespace-nowrap` (with `inline-flex items-center gap-1.5` on buttons).
- This guarantees a 24px buffer zone between buttons and the container's rounded corner or border line, eliminating edge collision across all display resolutions.

---

## 6. Luxury SmartTV Stream Player & Animated Loader Specification

When live TV streams (HLS/DASH or video previews) are connecting or buffering, the player avoids jarring blank screens or generic browser spinners by presenting a custom, high-end hospitality animated loader.

### Loader Design Tokens
- **Overlay**: Radial gradient (`radial-gradient(circle at center, rgba(16, 23, 47, 0.88) 0%, rgba(8, 11, 20, 0.97) 100%)`) with `backdrop-filter: blur(12px)` and subtle dot grid pattern.
- **Orbital Spinner**:
  - Outer orbital ring: 2.2s clockwise rotation in Cobalt `#0050F5` with `drop-shadow(0 0 14px rgba(0, 80, 245, 0.65))`.
  - Inner orbital ring: 1.6s counter-clockwise rotation in Champagne Gold `#E5C185` with `drop-shadow(0 0 10px rgba(229, 193, 133, 0.5))`.
  - Center core: 2s breathing pulse with TV broadcast vector icon.
- **Labels & Status**:
  - Primary title: Channel number and name (`CH 001 · CNN Indonesia`) in `Plus Jakarta Sans` font-bold text-shadowed.
  - Subtitle: Animated 3-dot pulse wave with `Sinkronisasi buffer siaran live HLS`.
  - Engineering pill: `GOJJA Hospitality Stream Engine` with live green beacon pulse (`#10B981`).
- **Transitions**: Smooth `0.35s` fade-in on buffer start, and seamless `0.45s` fade-out as playback triggers `onPlaying`.
- **10-Foot Big Screen Scaling**: Dimensions scale up proportionally on `.gojja-tv` (from 90px to 130px orbital spinner, 17px to 30px title font) matching the 1920x1080 guest canvas.

---

## 7. Form & Input Controls

### Standard Inputs & Selects
```tsx
<input
  type="text"
  className="w-full px-3 py-2 rounded-xl bg-[var(--cms-input)] border border-[var(--cms-control-border)] text-xs text-[var(--cms-text)] focus:ring-2 focus:ring-[#0050F5] focus:border-transparent outline-none transition-all"
/>
```

### Primary Luxury CTA
```tsx
<button className="px-4 py-2.5 rounded-xl bg-[#0050F5] hover:bg-[#0040C8] text-white font-semibold text-xs shadow-xs inline-flex items-center justify-center gap-2 cursor-pointer transition-all">
  <Icon className="w-4 h-4" />
  <span>Simpan Konfigurasi</span>
</button>
```

### Secondary Ghost Button
```tsx
<button className="px-4 py-2.5 rounded-xl border border-[var(--cms-divider)] hover:bg-black/5 dark:hover:bg-white/5 text-[var(--cms-text)] font-semibold text-xs inline-flex items-center justify-center gap-2 cursor-pointer transition-all">
  <span>Batal</span>
</button>
```

---

## 8. Responsive Breakpoint Strategy

- **Mobile Viewports (< 640px)**:
  - Header actions stack vertically (`flex-col sm:flex-row`).
  - Sub-navigation bars scroll horizontally with `luxury-scrollbar`.
  - Tables maintain clean proportions with explicit `min-w-[940px]` allowing horizontal swipe without column squishing.
  - Multi-column forms collapse to single-column (`grid-cols-1`).
- **Tablet Viewports (640px - 1024px)**:
  - Form grids expand to 2-columns (`sm:grid-cols-2`).
  - Metric summary cards render 2x2.
- **Desktop & Ultra-wide (≥ 1024px)**:
  - 12-column layouts for Form + Table boards (`lg:col-span-4` + `lg:col-span-8`).
  - Metric rows expand to 4 cards (`lg:grid-cols-4`).

### 8.1 Compact Rails, Sidebars & Studio Drawers (< 380px)
When components (such as `TvEntertainmentSettings`) are mounted inside narrow panels (such as the Brand Studio configuration rail of ~330px width):
- **Do NOT rely on viewport media queries alone** (e.g. `lg:grid-cols-3`): in desktop browsers, `lg:` activates regardless of the container's narrow width.
- **Use `compact?: boolean` prop**: pass `compact={true}` from the rail parent.
- **Render as Single-Column Stack**: switch grids to `flex flex-col space-y-2`, rendering items as sleek horizontal pills.
- **Stack Provisioning Rows Vertically**: stack inputs vertically rather than using wide 12-column horizontal grids.

---

## 9. Brand Studio & GojjaCleanTV Launcher Takeover UI Specification

The GojjaCleanTV panel within Brand Studio (`#branding`) adheres to strict safety visual gating:

### 9.1 Safety Guardrail Visual States
1. **Safety Locked State (Amber Shield Card)**:
   - When one or more online TVs lack a verified baseline backup.
   - Container: `border-amber-500/40 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent p-4`.
   - Header badge: `bg-amber-500/20 text-amber-800 dark:text-amber-300` with `Lock` icon and text `Safety Lock Engaged (X TV Belum Dicadangkan)`.
   - Action Button: Locked with `cursor-not-allowed opacity-60 bg-slate-700/50 text-slate-400`.
   - Quick 1-Click Action: Amber button `[📦 Buat Backup TV Sekarang (X TV) · Buka Kunci Safety Lock]`.
2. **Safety Verified State (Emerald Shield Card)**:
   - When all online TVs possess a verified backup snapshot.
   - Container: `border-emerald-500/40 bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent p-3.5`.
   - Header badge: `bg-emerald-500/20 text-emerald-700 dark:text-emerald-300` with `CheckCircle2` icon.
   - Action Button: Unlocked with primary cobalt `bg-[#0050F5] hover:bg-[#0040C8] text-white shadow-md cursor-pointer`.

### 9.2 Profile Selection Cards
Three standardized profile cards:
- **`CLEAN_WITH_OTT`** (Standard): Clean launcher without Google TV ads, retains YouTube/Netflix.
- **`STRICT_KIOSK`**: Dedicated hospitality kiosk, disables all third-party consumer OTT apps.
- **`CUSTOM`**: Manual toggle checklist of Android packages.
- Active state: `bg-[#0050F5]/10 border-[#0050F5]`. Inactive state: `bg-[var(--cms-bg)] border-[var(--cms-divider)]`.

### 9.3 Live ADB Transcript Console
- Background: Obsidian terminal `#0B0F17` with subtle `border-white/10`.
- Typography: Tabular JetBrains Mono `font-mono-tabular text-[11px]` in terminal green `#6EE7B7`.
- Scrollable viewport: `max-h-40 overflow-y-auto luxury-scrollbar`.

---

## 10. Dual-Mode Deployment & Per-Room Operational UX

In the **Rooms & TV** tab (`#rooms`), each room row renders an actionable TV endpoint cluster:

### 10.1 TV Endpoint Row Pattern
```tsx
<div className="flex items-center justify-end gap-1.5 flex-wrap">
  {/* Status Pill */}
  <span className="px-2 py-0.5 rounded text-[10px] font-semibold border bg-emerald-500/10 text-emerald-700 border-emerald-500/20">
    🛡️ GojjaLauncher
  </span>

  {/* Quick Action: Backup */}
  <button className="px-2 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-semibold text-[10px]">
    Backup
  </button>

  {/* Quick Action: Deploy */}
  <button className="px-2 py-1 rounded-lg bg-[#0050F5] hover:bg-[#0040C8] text-white font-semibold text-[10px]">
    Deploy Launcher
  </button>

  {/* Quick Action: Restore */}
  <button className="px-2 py-1 rounded-lg bg-[var(--cms-bg)] border font-semibold text-[10px]">
    Restore OEM
  </button>

  {/* Preview Modal Trigger */}
  <button className="px-2.5 py-1 rounded-lg bg-[#0050F5] text-white font-semibold text-xs">
    Preview E-01
  </button>
</div>
```

---

## 11. Backup Inspector & Restore Modal UX Specification

The Backup Inspector Modal (`DeviceDiscoveryView.tsx`) provides 4 organized inspection tabs:

1. **Tab 1 — Baseline Summary**: Hardware model (Sony Bravia/Xiaomi), Android OS version, OEM launcher package name, and verification status badge.
2. **Tab 2 — Package Inventory**: Two-column breakdown of active packages (`packages_enabled.txt`) vs pre-disabled packages (`packages_disabled.txt`) with search filter.
3. **Tab 3 — Standalone Scripts**: Syntax-highlighted code viewers for `restore.bat` (Windows) and `restore.sh` (Linux/macOS) with 1-click copy to clipboard.
4. **Tab 4 — 1-Click Restore**: Interactive restore trigger with live ADB execution terminal.

---

## 12. 10-Foot Big Screen Hospitality TV Canvas Specification

The guest-facing TV interface (`TvGuestAppModal.tsx`) operates on the **10-Foot UI Standard** (viewed from a couch/bed 3 meters away):

1. **Canvas Geometry**: Standardized to `1920x1080` (Full HD 16:9 ratio). All fonts and touch targets scale proportionally.
2. **Focus State Trapping**: Every interactive item (menu cards, channel list, F&B items, buttons) displays an unmistakable glowing focus ring:
   ```css
   .tv-focusable:focus, .tv-focusable.active {
     outline: 3px solid #0050F5;
     box-shadow: 0 0 20px rgba(0, 80, 245, 0.7);
     transform: scale(1.04);
     transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
   }
   ```
3. **D-Pad Directional Nav**:
   - `ArrowUp / ArrowDown`: Channel guide scrolling & vertical section switching.
   - `ArrowLeft / ArrowRight`: Main menu navigation pills & carousel paging.
   - `Enter / DPAD_CENTER`: Selection confirmation & stream playback.
   - `Escape / KEYCODE_BACK`: Modal closing or return to home screen.
4. **Contrast & Atmospheric Background**: Deep atmospheric radial background with ambient hotel hero video playing behind semi-transparent cards (`backdrop-filter: blur(16px)`).
