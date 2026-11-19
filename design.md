# GOJJA SmartTV CMS — Unified Design System & UX/UI Specification
*Standardized Architecture, Tokens, Typography, Responsive Tables & Components for Enterprise Hospitality CMS*

---

## 1. Design System Philosophy & Principles

GOJJA SmartTV CMS is built for hotel property managers, owners, and hospitality staff who manage real-time in-room TV hardware, guest experiences, and multimedia distribution. 

1. **Executive Hospitality Aesthetic**: A clean, balanced palette combining deep cobalt accents, warm ivory/slate surfaces, and high-contrast typography.
2. **Zero Text Overflow & Rock-Solid Responsiveness**: Tables, cards, and forms never cramp, burst, or overflow across viewports (from 360px mobile screens to 4K ultra-wide displays).
3. **Zero-PII Compliance by Design**: Guest names, identifiers, and sensitive data are presented through structured masking patterns (`B*** S***`) with clear front-office permission toggles.
4. **Consistent Sub-Navigation & Component Hierarchy**: Standardized button pills, count badges, cards, and action buttons ensure seamless predictability across all modules.

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
| **Online / Success** | `bg-emerald-500/15 text-emerald-700 dark:text-emerald-300` | `bg-emerald-500 animate-pulse` | TV Online, Housekeeping Ready, Fulfilled, Pass |
| **Warning / Pending** | `bg-amber-500/15 text-amber-800 dark:text-amber-300` | `bg-amber-500` | Requested, Dirty HK, Contract Review, Superceded |
| **Danger / Offline** | `bg-rose-500/15 text-rose-700 dark:text-rose-300` | `bg-rose-500` | TV Offline, Check-Out & Purge, Rejected, Blocked |
| **Informational** | `bg-blue-500/10 text-blue-600 dark:text-blue-400` | `bg-blue-500` | InHouse stay, TV locale badges, categories |

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

## 5. The 5 Anti-Overflow Table Architecture Rules

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

### Buttons

#### Primary Luxury CTA
```tsx
<button className="px-4 py-2.5 rounded-xl bg-[#0050F5] hover:bg-[#0040C8] text-white font-semibold text-xs shadow-xs inline-flex items-center justify-center gap-2 cursor-pointer transition-all">
  <Icon className="w-4 h-4" />
  <span>Simpan Konfigurasi</span>
</button>
```

#### Secondary Ghost Button
```tsx
<button className="px-4 py-2.5 rounded-xl border border-[var(--cms-divider)] hover:bg-black/5 dark:hover:bg-white/5 text-[var(--cms-text)] font-semibold text-xs inline-flex items-center justify-center gap-2 cursor-pointer transition-all">
  <span>Batal</span>
</button>
```

---

## 7. Responsive Breakpoint Strategy

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

### 7.1 Compact Rails, Sidebars & Studio Drawers (< 380px)
When components (such as `TvEntertainmentSettings`) are mounted inside narrow panels (such as the Brand Studio configuration rail of ~330px width):
- **Do NOT rely on viewport media queries alone** (e.g. `lg:grid-cols-3`): in desktop browsers, `lg:` activates regardless of the container's narrow width, cramming cards into 100px unreadable slivers.
- **Use `compact?: boolean` prop**: pass `compact={true}` from the rail parent.
- **Render as Single-Column Stack**: switch grids to `flex flex-col space-y-2`, rendering items as sleek horizontal pills `[Icon 28px] [Title + Desc (truncated)] [Status Pill + Checkbox]`.
- **Stack Provisioning Rows Vertically**: stack inputs vertically rather than using wide 12-column horizontal grids.

---

## 8. Summary of Standardized Modules

| Module / View | Subtabs & Layout | Tables Min-Width | Responsive Features |
|---|---|---|---|
| **Rooms & Guests** (`rooms`) | `Kamar & TV`, `Daftar Tamu`, `Grup Tour`, `PMS` | `min-w-[960px]` & `min-w-[860px]` | Truncated guest/group names, 2-line bound TV chips, language switcher pills |
| **Content Library** (`tv-services`) | Entertainment config, Contracts, Lineup | `min-w-[880px]` | Cobalt primary buttons, verified badge chips, channel program truncation |
| **Marketplace & Ads** (`marketplace`) | `Jaringan Iklan`, `Katalog & Orders`, `Corong` | `min-w-[920px]` | Standardized cobalt sub-nav, redacted PII toggle, order status flow buttons |
| **Devices & Fleet** (`devices`) | LAN discovery candidates, Fleet inventory | `min-w-[940px]` | Hardware chip, live heartbeat indicator, 1-click room assignment |
| **IPTV Channels** (`channels`) | IPTV Packages, Lineup & Stream Feeds | `min-w-[900px]` | Package tier badges, EPG program truncation, remote test playback |
| **Billing & Invoices** (`billing`) | Subscriptions, Seat Ledger, Invoices | `min-w-[840px]` | Tabular IDR formatting, idempotency reference, finance approval action |
| **Audit Logs** (`compliance`) | Append-Only Domain Audit Explorer | `min-w-[860px]` | ISO timestamps, actor roles, outcome chips, scrollable max-h-72 viewport |
