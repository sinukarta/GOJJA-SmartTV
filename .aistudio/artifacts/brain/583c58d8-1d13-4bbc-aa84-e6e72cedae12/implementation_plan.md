# GOJJA SmartTV — Enterprise Hospitality SaaS, Local Connector & TV Experience Platform

GOJJA SmartTV is an end-to-end multi-tenant hospitality television management platform that unifies central GOJJA platform governance, ISP partner operations, property self-service branding and stay management, real local network Android TV/ADB device discovery and onboarding, and an interactive 4-locale TV Guest App shell. This implementation delivers a cohesive full-stack application with server-side RBAC, a single source of truth (SSOT) seeded from a unified data module, Light and Warm Graphite Dark themes with purposeful motion, and an authentic Local Connector bridge for live LAN/ADB device scanning and verification.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following architectural and UX decisions were confirmed during interactive clarification and govern the full-stack build:

- **Confirmed Decision 1 — Local Connector & LIVE_LAB Architecture**: Bundled downloadable Node/CLI local connector bridge (`gojja-connector.mjs`) with outbound HTTP/WebSocket synchronization to the backend, paired with real server-side network interface discovery and ADB tool execution where available. In `LIVE_LAB` mode, the system never fabricates or substitutes simulated scans or fake connections; it enforces explicit network consent, real mDNS/bounded TCP port probing (including port 5555 and wireless pairing/connection ports), and real `adb` authorization and read-only `getprop` device inventory.
- **Confirmed Decision 2 — Single Source of Truth (SSOT) & Persistence**: The backend runs a unified persistent store seeded from `mockData.ts` (`DEMO` and `LIVE_LAB` workspaces separated by `environmentId`). Every dashboard metric, table, inheritance resolver, invoice ledger, and TV preview queries and mutates this single authoritative backend store with optimistic concurrency (`resourceVersion`) and audit logging.
- **Confirmed Decision 3 — Executive Entry & Split-Panel Login Experience**: The application opens to an Executive Product Showcase & Split-Panel Login experience featuring the custom lowercase `gojja` Open Future identity, hospitality photography, credential login, a one-click `DEMO` persona switcher across all 16 roles (`R-01` through `R-16`), and an explicit `DEMO` vs. `LIVE_LAB` workspace toggle.

---

## 1. Overview & Core Concept

- **What It Does**: Provides a complete operational SaaS suite for hospitality SmartTV fleets. Platform administrators govern organizations, ISP partners, subscriptions, releases, and finance; ISP partners manage delegated properties, wholesale seat allocations, and L1 deployments; hotel property teams customize TV branding with per-field inheritance, manage manual check-in/out and corporate group welcomes without requiring a PMS, allocate content packages by room class, run promotional campaigns, and approve maintenance windows; and installers execute local network discovery, ADB pairing/connection, device verification, and room assignment.
- **Target Audience / Persona**:
  - **GOJJA Platform & Technical Admins (`R-01` to `R-07`)**: Business owners, platform admins, technical release approvers, security admins, finance officers, support operators, and auditors.
  - **ISP Reseller Partners & Installers (`R-08`, `R-09`)**: Regional ISP account admins (Alpha Hospitality Network, Beta Property Connect) and field deployment engineers.
  - **Property Teams (`R-10` to `R-15`)**: Hotel owners, property managers, content editors, front office staff, analysts, and property finance teams.
  - **In-Room Guests (`R-16`)**: Hotel guests interacting with the 10-foot TV UI via D-pad remote navigation across 4 languages (`id`, `en`, `zh-CN`, `ja-JP`).
- **Key Value**: Eliminates per-hotel custom APK forks and blind operational guesswork by enforcing strict separation between software seat entitlements, content provider rights, technical release approvals, property maintenance readiness, and verified physical device state.

---

## 2. User Experience & Visual Design

### Key User Flows

1. **Executive Landing, Authentication & Role/Workspace Selection**:
   - Users arrive at the split-panel login and executive showcase highlighting GOJJA SmartTV's hospitality capabilities and visual references.
   - Users can sign in with credentials or use the `DEMO` Persona Switcher to inspect any of the 16 roles (`R-01`..`R-16`), or switch to `LIVE_LAB` mode with real session authentication.
2. **GOJJA Platform & Finance Administration**:
   - Inspect global KPIs derived live from the SSOT: **30 contracted seats**, **14 allocated endpoints**, **16 available seats**, **12 rooms**, **11 online / 3 offline TVs**, and **Rp550,000 issued / Rp120,000 paid / Rp430,000 outstanding** invoices.
   - Manage organizations (`C-01` Hotel Arunika Yogyakarta via `ISP-A`, `C-02` Bayu Bali Suites via `ISP-B`, `C-03` Sora Serviced Residence direct), review provider contracts (`CT-01`..`CT-03`), approve technical releases (`REL-01`), and verify invoice payments idempotently (`INV-01`..`INV-03`).
3. **ISP Partner Portfolio & Seat Allocation**:
   - Scoped strictly to the partner's active relationships (`ISP-A` cannot see or query `ISP-B` or direct `C-03` properties).
   - View wholesale seat pools, assign installer delegations, monitor fleet health, and escalate L1 support tickets.
4. **Property CMS: Branding Inheritance, Stays, Provider Lineups & Campaigns**:
   - **Branding & Publish Center**: Edit hotel logo, warm luxury color slots, welcome media, and 4-locale guest strings (`id`, `en`, `zh-CN`, `ja-JP`). Inspect per-field inheritance (`Platform → Customer → Property → Room Class → Room → Stay`), preview effective configuration on any target room, and publish immutable manifests with staged endpoint ACKs (`Received → Verified → Applied → Healthy`).
   - **Guest Stay & Corporate Group Board**: Perform manual check-in, extend stays, execute room moves with context version guards, configure corporate group welcomes (`G-CORP` on rooms 102/103), and trigger checkout with GOJJA session reset vs. per-app OTT cleanup status.
   - **TV Services & Entitlements**: Manage provider contracts, test source connections, allocate packages (`Basic`, `International`, `Sports`) respecting room vs. endpoint contract basis (including 2-TV suites in Room 301 and Room 502), and reorder channel lineups.
   - **Campaigns, Updates & Analytics**: Manage hotel promotions (`CMP-01`..`CMP-04`) with frequency caps and skip rules, grant property installation windows with room readiness checks, and review deduplicated playback and QoE metrics (**212s** campaign play seconds, **60%** completion, **1,530s / 25.5m** channel play time).
5. **Device Discovery & Deployment (Local Connector & Live ADB Lab)**:
   - Enroll a Local Connector to an authorized property and grant explicit local network consent (selecting a physical host interface, bounded RFC1918 `/24` CIDR subnet, allowed actions, and expiry).
   - In `DEMO` mode, step through deterministic discovery scenarios (`SCN-01`..`SCN-16`, candidates `DVC-01`..`DVC-03`) clearly badged as simulated.
   - In `LIVE_LAB` mode, run the bundled Local Connector bridge (`gojja-connector.mjs`) or host network scanner to perform real mDNS/DNS-SD discovery (`_adb._tcp`, `_adb-tls-pairing._tcp`, `_adb-tls-connect._tcp`) and bounded TCP port probing (port `5555` and custom ports), pair via 6-digit wireless pairing code or authorize RSA prompt on the physical Android TV/box, verify `adb get-state` + read-only `getprop` hardware inventory (`ro.product.model`, `ro.product.manufacturer`, `ro.build.version.release`, `ro.build.version.sdk`, `ro.build.fingerprint`), and bind the verified device to a property and room.
6. **Interactive 10-Foot TV Guest App Preview & Mockup Showcase**:
   - Launch an interactive 16:9 TV Guest App canvas (`/tv/:endpointId`) controllable via keyboard D-pad (`ArrowUp`, `ArrowDown`, `ArrowLeft`, `ArrowRight`, `Enter`, `Escape`/`Backspace`) or on-screen remote.
   - Experience Splash, Personalized/Corporate Welcome, Hospitality Home, Live TV Guide & Player with entitlement enforcement, Culinary & Spa Services with QR handoff, Promotions, and 4-Language Switcher (`Bahasa Indonesia`, `English`, `简体中文`, `日本語`).

### Visual Identity & Theme

- **Aesthetic Direction**: **Open Future & Linen Hospitality** — crisp, airy architectural precision in Light mode and warm medium graphite luxury in Dark mode, paired with a rich cinematic 10-foot hospitality TV interface.
- **Color Palette & Mood**:
  - **GOJJA Brand Spectrum (Custom Wordmark Only)**: Cobalt `#0050F5` (`g`), Indigo `#4F3FE5` (`o`), Violet `#7C35E0` (first `j`), Magenta `#CA3596` (second `j`), Coral `#FF5E70` (`a`). Rendered via an accurate SVG wordmark component preserving the diagonal cut on `o`, paired `jj`, and diagonal terminals.
  - **CMS Light Mode (Default)**: Soft Pearl Canvas `#F5F6FA`, Pure White Sidebar/Header/Cards `#FFFFFF` (never dark/navy sidebars in Light mode), Midnight Text `#10172F`, Secondary Slate `#586174`, Divider `#E3E7EF`, Control Boundary `#7A8496`, Primary Action Cobalt `#0050F5`.
  - **CMS Warm Graphite Dark Mode**: Warm Graphite Canvas & Sidebar `#4B4A47`, Elevated Header/Input `#504F4B`, Card Surface `#5B5955`, Ivory Primary Text `#F8F5EE`, Secondary Warm Gray `#E2DFD8`, Control Border `#C3BFB6`, Chart Lilac Accent `#C7B9FF`.
  - **TV Guest Scene**: Deep Obsidian Hospitality Canvas `#10151C`, Warm Ivory Text `#F8F5EE`, Champagne Gold Accent `#DCC6A1`, measured dark scrims over resort photography, and high-visibility 4px dual-keyline D-pad focus rings.
- **Typography & Hierarchy**:
  - **Display & Headings**: `Plus Jakarta Sans` (600/700) with tight tracking and balanced wrapping.
  - **UI & Dense Body**: `Plus Jakarta Sans` / `DM Sans` (400/500) with CJK fallback (`Noto Sans SC`, `Noto Sans JP`) for Mandarin and Japanese guest locales.
  - **Data, Telemetry & Financial Ledgers**: `JetBrains Mono` with `font-variant-numeric: tabular-nums` on all seat counters, IP/port endpoints, durations, and IDR currency columns.
- **Interactive Feedback & Motion (Corbel-Inspired Motion Contract)**:
  - **Sliding Navigation Indicator**: Elastic active indicator in sidebar and tabs with leading/trailing edge timing (`360ms` / `550ms`).
  - **Circular Theme Reveal**: `620ms` circular clip-path reveal originating from the theme toggle button coordinates via `document.startViewTransition` with graceful instant fallback and `prefers-reduced-motion` support.
  - **SVG Chart Line Reveal & Rolling KPI Digits**: Smooth `900ms` SVG stroke-dasharray reveal on analytics charts and `650ms` numeric interpolation on non-financial KPI cards (while keeping issued invoice figures exact and un-animated).

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1 — Strict Separation of `DEMO` and `LIVE_LAB` Provenance**:
  - *Chosen Approach*: Partition all records by `environmentId` (`DEMO` vs. `LIVE_LAB`) and attach immutable provenance fields (`origin`, `executionMode`, `verificationLevel`).
  - *Why*: Ensures users can explore all 69 screen states and 16 failure scenarios immediately in `DEMO` mode while guaranteeing that `LIVE_LAB` never fakes a scan result, never auto-populates mock TVs when no connector is running, and only marks a device `DEVICE_VERIFIED` after real ADB transport + `getprop` verification.
- **Decision 2 — Browser-to-LAN Bridge via Outbound Local Connector + Direct Host Execution**:
  - *Chosen Approach*: Provide both (a) direct server-side execution endpoints (so when the server runs on a local machine with `adb` and LAN access, it scans and connects directly) and (b) a downloadable standalone Node.js connector script (`gojja-connector.mjs`) that any engineer or installer can run on their Windows/macOS/Linux laptop on the hotel Wi-Fi/LAN to bridge local mDNS/TCP scans and `adb` commands back to the cloud dashboard over HTTP/REST.
  - *Why*: Web browsers and cloud containers cannot directly route raw TCP packets to private `192.168.x.x` hotel subnets. Offering both local server execution and a zero-dependency companion script makes live ADB discovery work both in local dev and when hosted remotely on Cloud Run.
- **Decision 3 — Deny-by-Default Server-Side RBAC Across 16 Personas**:
  - *Chosen Approach*: Evaluate every API request against the intersection of `authenticated principal ∩ environment ∩ active role grant ∩ organization/property relationship ∩ action permission ∩ resource ownership`.
  - *Why*: Prevents cross-tenant leaks (e.g., `ISP-A` querying `ISP-B`), prevents content editors (`R-12`) from publishing or viewing guest names, and prevents property owners (`R-10`) from approving technical APK releases (`R-03`).

---

## 4. Technical Architecture & Data Strategy

### Architecture & Component Diagram

```
┌────────────────────────────────────────────────────────────────────────────────────┐
│                        CLIENT WEB APPLICATION (React 19 + TS)                      │
│                                                                                    │
│  ┌──────────────────────┐  ┌──────────────────────────┐  ┌──────────────────────┐  │
│  │ Executive Landing &  │  │ Multi-Role CMS Shells    │  │ 10-Foot TV Guest App │  │
│  │ Split-Panel Login    │  │ • GOJJA Admin (GA-01..15)│  │ Preview & Showcase   │  │
│  │ • Credential Auth    │  │ • ISP Portal (IS-01..07) │  │ • D-Pad Focus Engine │  │
│  │ • 16-Role Switcher   │  │ • Property (PR-01..27)   │  │ • 4 Guest Locales    │  │
│  │ • DEMO / LIVE Toggle │  │ • Installer (IN-01..08)  │  │ • Live Guide/Player  │  │
│  └──────────┬───────────┘  │ • Lab Panels (LB-01..04) │  └──────────┬───────────┘  │
│             │              └────────────┬─────────────┘             │              │
└─────────────┼───────────────────────────┼───────────────────────────┼──────────────┘
              │ HTTPS REST + Auth Header  │                           │
              ▼                           ▼                           ▼
┌────────────────────────────────────────────────────────────────────────────────────┐
│                     EXPRESS BACKEND & POLICY ENGINE (server.ts)                    │
│                                                                                    │
│  ┌──────────────────────┐  ┌──────────────────────────┐  ┌──────────────────────┐  │
│  │ Auth & RBAC Resolver │  │ Domain Services & Jobs   │  │ Connector & ADB Hub  │  │
│  │ • 16 Roles + 2 SPs   │  │ • Profile Inheritance    │  │ • Enrollment & Grant │  │
│  │ • Scope Intersection │  │ • Stay & Version Guards  │  │ • Scoped Job Queue   │  │
│  │ • Inspector & Audit  │  │ • Entitlement & Finance  │  │ • Acceptance Runner  │  │
│  └──────────┬───────────┘  └────────────┬─────────────┘  └──────────┬───────────┘  │
│             │                           │                           │              │
│             └───────────────────────────┼───────────────────────────┘              │
│                                         ▼                                          │
│             ┌───────────────────────────────────────────────────────┐              │
│             │   Authoritative Persistent Store (SSOT)               │              │
│             │   • Seeded from unified mockData.ts + JSON disk sync  │              │
│             │   • Isolated DEMO & LIVE_LAB namespaces               │              │
│             └───────────────────────────────────────────────────────┘              │
└─────────────────────────────────────────────────────────────────────┬──────────────┘
                                                                      │
                                      Outbound HTTPS Poll / Result    │
                                                                      ▼
┌────────────────────────────────────────────────────────────────────────────────────┐
│               LOCAL CONNECTOR AGENT (Downloadable Node CLI + Host Runner)          │
│                                                                                    │
│  ┌──────────────────────┐  ┌──────────────────────────┐  ┌──────────────────────┐  │
│  │ Network Interface &  │  │ Bounded LAN Discovery    │  │ Official ADB Adapter │  │
│  │ Consent Guard        │  │ • mDNS / DNS-SD Listener │  │ • execFile('adb',..) │  │
│  │ • RFC1918 /24 Limit  │  │ • TCP Probe (5555, etc.) │  │ • Pair / Connect     │  │
│  │ • Grant Expiry Check │  │ • Candidate Fingerprints │  │ • get-state & getprop│  │
│  └──────────────────────┘  └──────────────────────────┘  └──────────────────────┘  │
└────────────────────────────────────────────────────────────────────────────────────┘
```

### Data Model & State

- **Single Source of Truth (`mockData.ts` + Persistent Server Store)**:
  - **Organizations & Partners**: `ISP-A` (Alpha Hospitality Network), `ISP-B` (Beta Property Connect), `C-01` / `P-01` (Hotel Arunika Yogyakarta — 12 seats, 6 rooms, 7 TVs: 5 online, 2 offline), `C-02` / `P-02` (Bayu Bali Suites — 8 seats, 4 rooms, 5 TVs: 4 online, 1 offline), `C-03` / `P-03` (Sora Serviced Residence — 10 seats, 2 rooms, 2 TVs: 2 online, 0 offline).
  - **Rooms, Multi-TV Suites & Endpoints**: 12 rooms (`ROOM-101`..`ROOM-602`) and 14 endpoints (`E-01`..`E-14`), including two-TV suites in `ROOM-301` (`E-06`, `E-07`) and `ROOM-502` (`E-11`, `E-12`), plus capability profiles (`CAP-M1` Managed, `CAP-L1` Limited on `E-09`, `CAP-A1` Assisted on `E-14`).
  - **Stays & Corporate Groups**: 7 active stays (`S-01`..`S-07`), corporate group `G-CORP` on `S-02`/`S-03`, context version tracking, and per-role guest name masking.
  - **Provider Contracts, Packages & Lineups**: `CT-01` (room-based, 6 rooms, Basic/International/Sports), `CT-02` (endpoint-based, 5 endpoints), `CT-03` (Submitted/Unverified on `P-03` blocking premium channels), plus channel catalog and property lineup order.
  - **Branding Profiles, Assets, Campaigns & Publications**: Multi-layer profile inheritance, 4-locale dictionaries, media assets, campaigns `CMP-01`..`CMP-04`, and immutable publications with per-endpoint ACK tracking.
  - **Releases, Readiness & Update Jobs**: Release `REL-01` (`v1.0.1`), dual approval gates (GOJJA technical approval + Property installation window), and per-endpoint readiness matrix.
  - **Finance, Analytics, Tickets & Audit**: Invoices `INV-01` (`Rp180,000` unpaid), `INV-02` (`Rp120,000` paid), `INV-03` (`Rp250,000` unpaid), deduplicated analytics fixtures (**212s** campaign play time, **1,530s** channel play time), support tickets `TK-01`/`TK-02`, and append-only audit log.
  - **Live Discovery & ADB Lab Entities**: Registered connectors, local network consents, `DiscoveryRun` records, discovered `Candidate` items, and verified `AdbSession` device inventories.

### Interactive Component & State Mapping

- **Workspace & Role Bar**: Switching persona or workspace (`DEMO` vs. `LIVE_LAB`) updates the active session token, re-fetches scoped server data, and clears unauthorized views immediately.
- **Branding & Inheritance Editor**: Editing theme colors, logos, or localized greetings saves a new draft version in the backend; clicking "Preview Effective Config" computes the exact resolved field provenance for any room/stay; clicking "Publish" (restricted to `R-10`/`R-11`) creates an immutable publication and updates the live TV Guest App preview.
- **Device Discovery & Deployment View (`IN-01..08` + `LB-01..04`)**:
  - *Step 1 (Connector & Network Consent)*: Select host network interface and authorize a bounded CIDR range (e.g., `192.168.1.0/24`) and allowed actions (`network.scan`, `adb.pair`, `adb.connect`, `adb.inventory`).
  - *Step 2 (Scan & Candidate Table)*: Execute scan (simulated scenario in `DEMO`, or real connector/host scan in `LIVE_LAB`). View candidate IP, port (`5555` or dynamic TLS port), discovery source (`mDNS` vs. `TCP Probe` vs. `Manual`), reachability, and authorization state.
  - *Step 3 (Pair, Connect & Read Device Info)*: Initiate wireless pairing (with ephemeral 6-digit pairing code) or direct TCP connection (`adb connect IP:5555`), verify transport state (`adb get-state`), read actual device properties (`model`, `manufacturer`, `androidVersion`, `sdkInt`, `buildFingerprint`, `serial`), and assign the verified device to a property and room with atomic seat allocation.
- **Built-In Acceptance Test Runner**: Includes an interactive Acceptance & Verification Suite page that runs automated checks across the Functional, RBAC/Security, Live LAN/ADB, and UI/UX/Motion acceptance criteria and reports actual live pass/blocked statuses with inspectable evidence.
