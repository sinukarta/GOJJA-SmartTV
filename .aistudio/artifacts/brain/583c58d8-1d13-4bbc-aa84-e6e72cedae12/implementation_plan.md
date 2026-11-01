# GOJJA SmartTV — Precision Layout, Navigation & Viewport Polish Plan

This plan resolves the five visual and interaction issues identified in the latest review: replacing text-baked mockup backgrounds with clean resort photography, locking the Login Page to a single `100dvh` zero-scroll viewport on both desktop and mobile, separating sidebar navigation selectors and views so each menu item highlights and renders independently, making the TV Guest App Preview close button (`✕`) always visible within the viewport, and splitting the dashboard into independent scroll containers with a fixed sidebar footer and ultra-thin luxury scrollbars.

## User Review & Critical Decisions

> [!IMPORTANT]
> Both design decisions from the clarification step have been locked in and are incorporated below:

- **Confirmed Decision 1 (Dedicated Menu Views & Selectors)**: Every sidebar item (`Overview`, `Rooms & Guests`, `Devices`, `Discovery & Deploy`, `Brand Studio`, `Content Library`, `Campaigns`, `Channels & Packages`, `Updates`, `Analytics`, `Users & Access`, `Subscription`, `Support`, `Settings`) maintains its own independent active selector state (`activeTab === item.id`) and renders its own dedicated view without highlighting sibling items.
- **Confirmed Decision 2 (Single-Screen `100dvh` Login on Mobile & Desktop)**: On mobile viewports (`< 1024px`), the 4 feature highlight cards are hidden so the compact resort header and the organic pearl authentication card fit cleanly within `100dvh` (`overflow-hidden`) with zero vertical scrolling. On desktop (`>= 1024px`), vertical spacing and card padding are calibrated so the 60:40 split layout also fits inside `100dvh` without scrolling.

---

## 1. Overview & Core Concept

- **What It Does**: Elevates the GOJJA SmartTV Hospitality CMS and 10-Foot TV Guest App prototype to a production-grade luxury standard where every viewport, scroll container, background image, and navigation state behaves predictably.
- **Target Audience / Persona**: Hospitality property managers, owners, ISP partner operators, and executive reviewers evaluating the prototype on desktop laptops and mobile phones.
- **Key Value**: Eliminates double-rendered background text, accidental page scrolling on login, dual-highlighted sidebar links, clipped modal close buttons, and coupled sidebar/content scrolling.

---

## 2. User Experience & Visual Design

### Key User Flows & Fixes

1. **Clean Resort Background Photography (Issue #1)**:
   - **Login Page (`LoginLandingView.tsx`)**: Replaces the text-baked V-11 mockup screenshot (`file_000000007f6882118a6641812590e14f_11e44e63.png`) with the clean, text-free cliffside sunset infinity pool photograph (`/assets/aistudio/file_0000000043808207bbdf250e0b1586c7_702e345a.png`) paired with a subtle left-to-right contrast scrim and soft organic wave SVG divider on the right auth panel.
   - **TV Guest App Backdrop (`mockData.ts` & `TvGuestAppModal.tsx`)**: Replaces the 6-panel UI collage image (`Hotel_Tentrem_SmartTV_App_Showcase_62a23bd8.png`) on `P-01` (`Hotel Arunika Yogyakarta`) with the clean panoramic Borobudur resort photograph (`/assets/aistudio/file_00000000a6b08211935c3a540293bf6c_74821162.png`), ensuring the TV Guest App preview never shows ghost UI text behind the live TV canvas.

2. **One-Screen Zero-Scroll Login Page — `100dvh` Desktop & Mobile (Issue #2)**:
   - **Root Container**: Locked to `h-[100dvh] w-full overflow-hidden flex flex-col lg:flex-row`.
   - **Mobile View (`< 1024px`)**: Renders a compact top resort header (official `gojja` vector wordmark + quick action buttons for `TV Preview` and `16 Roles` + 1-line tagline) directly above a flex-centered, compact organic pearl authentication card (`p-5`, tightened input heights `py-2`, compact social sign-in & footer). Feature cards are hidden on mobile so everything fits comfortably on one screen without scrolling.
   - **Desktop View (`>= 1024px`)**: Left 58% showcase panel and Right 42% organic pearl auth container both use `h-full flex flex-col justify-between py-6 lg:py-8 px-10 xl:px-14` with scaled spacing (`space-y-3.5`) so even on 768px-tall laptop screens, the entire login experience fits on a single screen without scrollbars.

3. **Dedicated Active Selector & View per Sidebar Menu Item (Issue #3)**:
   - Removes the coupled active conditions (`(item.id === 'devices' && activeTab === 'rooms')`, `(item.id === 'channels' && activeTab === 'tv-services')`, `(item.id === 'users' && activeTab === 'support-qa')`, `(item.id === 'settings' && activeTab === 'branding')`).
   - Each of the 14 navigation items sets `setActiveTab(item.id)` and checks strictly `activeTab === item.id`:
     - **`Rooms & Guests` (`rooms`)**: Focuses on room occupancy, guest check-in/check-out lifecycle, housekeeping/privacy states, and room creation.
     - **`Devices` (`devices`)**: Dedicated fleet hardware & endpoint management table (ADB status, applied config version, TV profile assignment, live TV preview trigger, and device maintenance toggle).
     - **`Content Library` (`tv-services`)**: Curated hotel dining, spa, facilities, and concierge service catalog with mobile QR handoff tokens.
     - **`Channels & Packages` (`channels`)**: Live IPTV channel line-up, provider contract status, and room-class channel package matrix (`Basic`, `International`, `Sports`).
     - **`Users & Access` (`users`)**: 16-Role RBAC catalog, active user accounts directory, and instant persona switcher.
     - **`Settings` (`settings`)**: Property workspace configuration (Wi-Fi SSID, Front Desk extension, timezone, default guest locale, environment mode, and demo reset).

4. **Always-Visible TV Guest App Preview Close Button (Issue #4)**:
   - Constrains the modal wrapper in `TvGuestAppModal.tsx` to `max-h-[100dvh] p-2 sm:p-4 flex flex-col items-center justify-center overflow-hidden` and caps the 16:9 TV canvas height on desktop laptops (`max-h-[calc(100dvh-140px)] aspect-video w-auto max-w-full mx-auto`) so the Top Reviewer Bar and Bottom D-Pad Bar are **never** pushed off the top or bottom edge of the screen.
   - Enhances the Close button (`✕ Tutup Preview` / `✕ Close`) in the top-right of the reviewer bar with high-contrast styling (`bg-rose-500 hover:bg-rose-600 text-white font-bold px-3 py-1.5 rounded-lg shadow-md`) plus an additional subtle corner close button inside the modal so the user can always exit immediately on both mobile and desktop.

5. **Fixed Sidebar Footer & Independent Ultra-Thin Luxury Scrollbars (Issue #5)**:
   - **App Shell Geometry**: The dashboard root changes from `min-h-screen` to `h-[100dvh] overflow-hidden flex flex-col`.
   - **Left Sidebar (`aside`)**: `h-[calc(100dvh-72px)] flex flex-col justify-between overflow-hidden`:
     - *Top*: Fixed `gojja SmartTV` Property Workspace header (`shrink-0`).
     - *Middle*: Scrollable navigation list (`flex-1 overflow-y-auto luxury-scrollbar pr-1`) containing `WORKSPACE`, `ADMINISTRATION`, and `Need help?`.
     - *Bottom Footer*: Pinned `shrink-0` footer containing the Resort Photo Card (`Open. Connected. Forward.`) and role status bar — always stays anchored at the bottom of the sidebar while the menu scrolls above it.
   - **Right Viewport (`main`)**: `flex-1 h-[calc(100dvh-72px)] overflow-y-auto luxury-scrollbar` — scrolls completely independently of the left sidebar.
   - **Ultra-Thin Scrollbar Styling (`index.css`)**: Custom `.luxury-scrollbar` class with `scrollbar-width: thin` (4px width in WebKit, transparent track, subtle translucent thumb `rgba(148, 163, 184, 0.25)` that brightens gently on hover).

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Independent Scroll Containers (`h-[100dvh] overflow-hidden` Shell)**
  - *Chosen Approach*: Lock the outer shell to `100dvh` and give the sidebar nav area and the main content area separate `overflow-y-auto` containers with a pinned sidebar footer.
  - *Why*: Matches native luxury desktop/SaaS workspace ergonomics where navigation context and brand footer remain stationary while large data tables or analytics scroll smoothly on the right.
- **Decision 2: Strict 1-to-1 `NavTabId` Mapping**
  - *Chosen Approach*: Map every sidebar button 1-to-1 to its own `NavTabId` and dedicated view section.
  - *Why*: Eliminates confusing dual-selection highlights and gives operators focused workspaces for `Devices`, `Channels & Packages`, `Users & Access`, and `Settings`.

---

## 4. Technical Architecture & Data Strategy *(Technical Reference)*

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ Root App Container (h-[100dvh] overflow-hidden)                              │
├──────────────────────────────────────────────────────────────────────────────┤
│ Mode A: LoginLandingView (h-[100dvh] overflow-hidden, Zero Scroll)           │
│  ├─ Background Layer: Clean Resort Photo (file_0000...4380.png) + Scrim      │
│  ├─ Mobile (<1024px): Compact Header + Centered Pearl Auth Card (No Cards)   │
│  └─ Desktop (>=1024px): 58% Brand/4-Cards Panel + 42% Organic Pearl Auth     │
├──────────────────────────────────────────────────────────────────────────────┤
│ Mode B: Dashboard Workspace Shell (h-[100dvh] overflow-hidden flex-col)      │
│  ├─ Top Header (h-[72px] shrink-0): Hamburger + Property Pill + Actions      │
│  └─ Body Split (flex-1 flex overflow-hidden h-[calc(100dvh-72px)])           │
│      ├─ Left Sidebar (w-[250px] shrink-0 flex-col overflow-hidden)           │
│      │   ├─ Top Brand Header (shrink-0)                                      │
│      │   ├─ Middle Nav List (flex-1 overflow-y-auto luxury-scrollbar)        │
│      │   │   └─ 14 Distinct NavTabId Items (Strict 1:1 Active Highlight)     │
│      │   └─ Bottom Pinned Footer (shrink-0: Resort Card + Role Info)         │
│      └─ Right Main Viewport (flex-1 overflow-y-auto luxury-scrollbar)        │
│          └─ 14 Dedicated Tab Views (overview, rooms, devices, discovery,     │
│             branding, tv-services, campaigns, channels, updates, analytics,  │
│             users, billing, support-qa, settings)                            │
├──────────────────────────────────────────────────────────────────────────────┤
│ Modal Overlay: TvGuestAppModal (max-h-[100dvh] overflow-hidden)              │
│  ├─ Top Reviewer Bar (shrink-0, Prominent Red/White "✕ Close" Button)        │
│  ├─ 16:9 TV Canvas (max-h-[calc(100dvh-140px)], Clean Borobudur Backdrop)    │
│  └─ Bottom D-Pad Remote Simulator Strip (shrink-0)                           │
└──────────────────────────────────────────────────────────────────────────────┘
```
