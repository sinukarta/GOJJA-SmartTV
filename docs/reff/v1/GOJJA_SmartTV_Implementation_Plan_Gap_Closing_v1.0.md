# GOJJA SmartTV
# Implementation Plan — Gap Closing & Feature Deepening
**Versi 1.1 | 7 November 2026 | Asia/Jakarta**  
**Owner:** Dyan Raditya Sinukarta / Product Owner GOJJA  
**Status:** In Progress — Fase A Completed (Poin 1, 2, 5 Selesai & Terverifikasi)  
**Baseline:** Master PRD v1.0 · Product Consolidation & Decision Register v1.1 · Prototype Specification & Build Brief v1.0 · UI/UX Design System v1.1 · Current Prototype Codebase

---

## Ringkasan Eksekutif

Dokumen ini merinci rencana implementasi untuk menutup gap prioritas tinggi (poin 1–5) serta memperdalam tiga area yang diminta menjadi lebih kompleks dan komprehensif:

| No | Area | Prioritas Asal | Sifat Pekerjaan | Status Saat Ini |
|:---|:-----|:---------------|:----------------|:----------------|
| 1 | Seat Ledger + Billing State Machine | Tinggi | Perkuat foundation bisnis | **SELESAI (Fase A)** |
| 2 | Capability-based Feature Gating | Tinggi | Device-aware product surface | **SELESAI (Fase A)** |
| 3 | Update Eligibility & Job State Machine | Tinggi | Operasi armada yang aman | **SELESAI (Fase B)** |
| 4 | Provider Entitlement Resolution | Tinggi | Hak tayang yang benar | **SELESAI (Fase B)** |
| 5 | Preflight & Limitation Messaging | Tinggi | Onboarding yang jujur | **SELESAI (Fase A)** |
| 6 | Branding Inheritance & Resolution Engine | Sedang → Tinggi (diperluas) | Brand experience multi-layer | **SELESAI (Fase C)** |
| 7 | Campaign Eligibility Engine & Measurement Taxonomy | Sedang → Tinggi (diperluas) | Monetisasi internal yang terukur | **SELESAI (Fase C)** |
| 13 | Marketplace & Ad Network Foundation | Rendah → Medium (diperluas) | Model ekspansi komersial | *Menunggu (Fase D)* |

**Prinsip pengerjaan:**
- Semua perubahan tetap dalam spirit Prototype → Production transition.
- Tidak menjanjikan kemampuan perangkat yang belum dibuktikan.
- Simulation badge wajib dipertahankan di mana fitur masih demo.
- Server-side authorization dan audit tetap menjadi sumber kebenaran.
- Setiap epic memiliki Definition of Done yang dapat diuji.

---

## 1. Seat Ledger + Billing State Machine (M02)

### 1.1 Tujuan
Mengubah model subscription dari “angka seat statis” menjadi **ledger yang dapat diaudit**, membedakan quantity committed, allocated, reserved, billed, online, dan trial dengan aturan prorata, change order, grace, dan suspension yang konsisten.

### 1.2 Gap Saat Ini
- Quantity seat ditampilkan tetapi belum fully transactional.
- Tidak ada change order / true-up / prorata yang akurat.
- Invoice status sederhana; belum ada partial payment allocation, credit note, atau grace policy yang dikonfigurasi.
- Online count tidak memengaruhi billing (sesuai desain), tetapi belum ada visualisasi yang jelas antara committed vs allocated vs online.

### 1.3 Scope Implementasi

#### Domain Model Baru / Diperluas
```
SeatLedgerEntry {
  id, subscriptionId, propertyId,
  type: 'COMMITTED' | 'ALLOCATED' | 'RESERVED' | 'RELEASED' | 'ADJUSTMENT',
  quantityDelta: number,
  effectiveFrom, effectiveTo,
  reasonCode, changeOrderId?,
  createdBy, createdAt, version
}

SubscriptionState {
  committedQuantity,
  allocatedQuantity,
  reservedQuantity,
  billedQuantityCurrentPeriod,
  onlineObservedQuantity,   // informational only
  trialEndsAt?,
  graceEndsAt?,
  suspensionStatus: 'None' | 'Soft' | 'Hard'
}

ChangeOrder {
  id, subscriptionId,
  requestedDelta, effectiveDate,
  status: 'Draft' | 'Approved' | 'Applied' | 'Rejected',
  prorataAmountIdr?,
  approvedBy?, appliedAt?
}

InvoiceLine {
  ...
  seatDays, unitPriceIdr, lineType: 'BASE' | 'TRUE_UP' | 'CREDIT' | 'ADJUSTMENT'
}
```

#### Aturan Bisnis yang Harus Ditegakkan
1. Allocation tidak boleh melebihi committed + approved temporary allowance.
2. Dua concurrent request seat terakhir → satu sukses, satu penolakan jelas (optimistic concurrency / version check).
3. Prorata memakai hari kalender + timezone properti; rounding per line tervalidasi.
4. Pengurangan efektif periode berikutnya (kecuali policy khusus).
5. Trial expired tanpa paid order → tidak auto-charge.
6. Soft suspension: batasi fitur baru / publish; Hard suspension: batasi entitlement baru (tidak brick TV yang sudah online).
7. Payment webhook / manual verify harus idempotent.

#### API / Service yang Ditambahkan
- `POST /api/subscriptions/:id/change-order`
- `POST /api/subscriptions/:id/allocate-seats`
- `POST /api/finance/invoices/:id/verify-payment` (sudah ada, diperkuat)
- `GET /api/subscriptions/:id/ledger`
- Internal worker: period close + true-up generation

#### UI Surfaces
- Subscription detail: committed / allocated / online cards + ledger timeline
- Change Order wizard (request → review → apply)
- Invoice detail dengan line breakdown + payment allocation
- Property overview KPI yang membedakan “Licensed” vs “Online”

### 1.4 Acceptance Criteria (Utama)
- [x] Pool 1000 committed, allocate 950 → sisa 50 terlihat jelas (terimplementasi di KPI cards & breakdown).
- [x] Request allocate saat sisa habis → penolakan dengan reason code `QUOTA_EXCEEDED` dan audit log.
- [x] Tambah seat via Change Order dengan tanggal kalender berjalan → estimasi true-up prorata dihitung otomatis (kalender 30 hari).
- [x] Invoice issued → partial payment support → remaining balance terupdate real-time.
- [x] Soft suspension memblokir publish branding baru tanpa menghapus data tamu atau mematikan TV yang sedang online; Hard suspension memblokir alokasi perangkat baru.

### 1.5 Estimasi & Dependensi
- Effort: M–L (3–5 hari fokus) — **SELESAI DI FASE A**
- Dependensi: Domain model SSOT, audit log, timezone properti
- Risiko: Salah implementasi prorata → sengketa komersial (termitigasi dengan formula kalender terstandarisasi)

---

## 2. Capability-based Feature Gating (M10)

### 2.1 Tujuan
Membuat seluruh permukaan produk (CMS + TV Guest App) **sadar kemampuan perangkat**. Fitur hanya ditawarkan jika capability profile mendukungnya, dengan messaging yang jujur.

### 2.2 Gap Saat Ini
- `capabilityProfile` dan `CapabilityFlag` sudah ada di model.
- Belum digunakan secara sistematis untuk menyembunyikan / menonaktifkan kontrol.
- Operator masih melihat tombol yang sebenarnya tidak bisa dieksekusi pada perangkat tertentu.

### 2.3 Scope Implementasi

#### Capability Taxonomy (awal)
| Capability Key | Meaning | Typical Routes |
|----------------|---------|----------------|
| `launcher.takeover` | Bisa set sebagai default Home | ADB / DPC / OEM |
| `adb.install` | Bisa install/update APK via ADB | ADB |
| `adb.shell` | Bisa eksekusi perintah terbatas | ADB |
| `kiosk.mode` | Device-owner / lock task | DPC / EMM |
| `power.recovery` | Bisa recover setelah AC restore | OEM + test |
| `drm.widevine.l1` | DRM level | Device cert |
| `playback.hls` / `playback.dash` | Streaming protocol | Player |
| `offline.cache` | Local media cache | App storage |
| `remote.dpad` | Full D-pad navigation | Always expected |

Status per capability: `Supported` | `Limited` | `Unsupported` | `Unknown`

#### Resolution Engine
```
effectiveCapability(endpoint, capabilityKey) → {
  status,
  route,
  evidenceType: 'DemoFixture' | 'LiveObserved' | 'VendorDeclared',
  limitationMessage?,
  requiredAction?
}
```

#### Gating Points
- Brand Studio → Launcher takeover section
- Update job creation → hanya endpoint yang eligible
- Channel package assignment → filter by playback capability
- Campaign creative type (video) → cek offline.cache / playback
- TV Guest App → hide features yang Unsupported (dengan fallback aman)

#### UI Patterns
- Badge “Limited / Unsupported” di device card
- Tooltip / inline reason
- “Why is this disabled?” expandable
- Preflight report sebelum assign/deploy

### 2.4 Acceptance Criteria
- [x] Endpoint dengan `launcher.takeover = Unsupported` menampilkan advisory banner dan modal breakdown alasan limitation.
- [x] Operator melihat alasan yang jelas ("Why is this disabled?"), bukan kontrol mati tanpa penjelasan.
- [x] Capability Profile tertera jelas pada device list (Managed vs Limited vs Assisted) dengan tombol inspect lengkap.
- [x] LIVE_LAB observation menampilkan fact riil (Android SDK & ADB transport state).

### 2.5 Estimasi
- Effort: M (2–4 hari) — **SELESAI DI FASE A**
- Dependensi: Endpoint model, Discovery flow

---

## 3. Update Eligibility & Job State Machine (M09)

### 3.1 Tujuan
Membuat proses update **aman, dapat diaudit, dan sesuai urutan keputusan** yang sudah ditetapkan di PRD.

### 3.2 Urutan Eligibility yang Wajib
1. Technical Approval (GOJJA Technical Admin)
2. Property Install Permission (Property Manager / standing policy)
3. Readiness (Checkout + Housekeeping Ready for Maintenance)
4. Schedule Window (timezone properti)
5. Device Health & Capability check
6. Download + Verify package
7. Install
8. Post-install Health Gate
9. Mark Healthy / Failed / OutcomeUnknown

### 3.3 State Machine Job
```
AwaitingApproval
  → AwaitingReadiness
    → Staged (window aktif + package ready)
      → Installing
        → Verifying
          → Healthy
          → Failed
          → OutcomeUnknown (offline saat critical phase)
  → Deferred (window lewat / check-in baru / permission dicabut)
```

### 3.4 Aturan Kritis
- Check-in baru **membatalkan** eligibility lama.
- Offline saat window → tunggu window sah berikutnya, **bukan** install begitu online.
- OutcomeUnknown harus bisa direkonsiliasi manual atau otomatis saat device reconnect.
- Canary support (subset endpoint) di Phase 1.5 / P1C.

### 3.5 Scope Implementasi
- Perkuat `UpdateJob` model + transition guards di server.
- UI: Update Approvals board + Job timeline per endpoint/room.
- Reconcile endpoint (`/api/updates/reconcile-job` sudah ada → perlu diperdalam).
- Notification / audit setiap transisi penting.

### 3.6 Acceptance Criteria
- [x] Job tidak bisa masuk Installing tanpa urutan 1–5 terpenuhi (dievaluasi lewat `evaluateEndpointUpdateEligibility` 9-step engine).
- [x] Check-in baru membatalkan job yang belum Installing (BR06 rule otomatis mendefers job di `POST /api/stays/checkin` & audit logged).
- [x] OutcomeUnknown muncul dan bisa di-resolve lewat `POST /api/updates/reconcile-job`.
- [x] Audit trail lengkap untuk setiap transisi eligibility & reconcile.

### 3.7 Estimasi
- Effort: M–L (3–5 hari) — **SELESAI DI FASE B**

---

## 4. Provider Entitlement Resolution (M07)

### 4.1 Tujuan
Membangun **effective channel lineup** per endpoint/room/stay berdasarkan kontrak, package, room class, dan status koneksi provider — meskipun playback masih mock.

### 4.2 Gap Saat Ini
- Contract & Channel model ada.
- Tidak ada resolution engine yang menghitung “channel apa yang boleh dilihat endpoint ini sekarang”.

### 4.3 Resolution Pipeline
```
1. Ambil active ProviderContract untuk property
2. Filter package yang masih valid (status, validUntil, connectionStatus)
3. Filter berdasarkan roomClass / allowedRoomClasses
4. Filter publicAreaAllowed vs in-room
5. Apply channel map order + hidden flags
6. Resolve locale-aware metadata
7. Output: EffectiveLineup + DenialReasons[]
```

### 4.4 Model Tambahan
```
EffectiveChannel {
  channelId, number, name, category,
  entitlementSource: contractId + packageId,
  denialReason?: 'CONTRACT_EXPIRED' | 'ROOM_CLASS_NOT_ALLOWED' | 'PROVIDER_DEGRADED' | ...
}

EntitlementSnapshot {
  endpointId, computedAt, lineupVersion, channels: EffectiveChannel[]
}
```

### 4.5 UI & TV Impact
- Channels page menampilkan “Effective for this room class”.
- TV Guest App memakai effective lineup (bukan raw channel list).
- Support ticket dapat melihat denial reason yang teredaksi.

### 4.6 Acceptance Criteria
- [x] Room class yang tidak diizinkan tidak melihat channel premium (Standard Room ditolak PKG-SPORTS dengan code `ROOM_CLASS_NOT_ALLOWED`).
- [x] Contract expired / degraded → channel ditolak dengan kode informatif (`CONTRACT_EXPIRED` atau `PROVIDER_DEGRADED`).
- [x] Perubahan package menghasilkan lineup resolution baru yang reaktif.
- [x] Denial reason tersedia untuk support dan guest TV app (bukan hanya layar hitam atau error generic).

### 4.7 Estimasi
- Effort: M (3–4 hari) — **SELESAI DI FASE B**
- Catatan: Real DRM/HLS tetap P1C; yang dibangun sekarang adalah **hak** dan **lineup**.

---

## 5. Preflight & Limitation Messaging (Discovery / Assign)

### 5.1 Tujuan
Membuat proses discovery → assign → deploy **jujur terhadap keterbatasan perangkat** sebelum operator menganggap TV “siap”.

### 5.2 Preflight Checklist (Minimal)
| Check | Supported | Limited | Unsupported | Action |
|-------|-----------|---------|-------------|--------|
| OS / Android version | ✓ | version range | too old | Block / Warn |
| Storage free | ✓ | low | critical | Warn / Block install |
| Network / time sync | ✓ | NTP drift | unreachable | Warn |
| ADB authorization | ✓ | needs re-auth | not available | Guide |
| Installer route | ADB / other | partial | none | Show available routes |
| Decoder / Widevine | level | limited | none | Capability flag |
| Launcher takeover path | ✓ | assisted | unsupported | Clear messaging |

### 5.3 UX Requirements
- Preflight report sebelum “Assign to Room”.
- Setiap failure/limitation punya **reason + recommended next action**.
- Tidak ada “Success” hijau jika hanya Compatible/Limited.
- LIVE_LAB menampilkan observed facts; DEMO menampilkan fixture dengan badge jelas.

### 5.4 Acceptance Criteria
- [x] Assign diblokir jika preflight critical (seperti ADB Authorization atau OS compatibility) gagal.
- [x] Operator memahami perbedaan Supported vs Limited vs Unsupported melalui visual status tag dan action recommendation.
- [x] Preflight inspection report dievaluasi sebelum binding kamar dan tercatat di audit trail.

### 5.5 Estimasi
- Effort: S–M (2–3 hari) — **SELESAI DI FASE A**

---

## 6. Branding Inheritance & Resolution Engine (Diperluas & Komprehensif)

### 6.1 Tujuan
Membangun sistem branding multi-layer yang kuat, dapat di-preview, dapat di-audit, dan sesuai dengan UI/UX Design System v1.1 serta FR05-* di Master PRD.

### 6.2 Layer Model (Wajib)
```
PLATFORM          → default GOJJA tokens & safe regions
  └── CUSTOMER    → brand kit organisasi (opsional)
        └── PROPERTY → logo, warna, hero, welcome, menu, info
              └── ROOM_CLASS → override terbatas (suite vs standard)
                    └── ROOM → override sangat terbatas
                          └── STAY / GROUP → personal/group welcome overlay
```

**Group overlay** memiliki priority tersendiri dan conflict resolution eksplisit (bukan last-write-wins tersembunyi).

### 6.3 Field Categories & Inheritance Rules

| Field Category | Inheritable | Overridable di Property | Overridable di Room/Stay | Locked by Plan/Policy |
|----------------|-------------|--------------------------|---------------------------|------------------------|
| Logo (image/text) | Yes | Yes | No | No |
| Primary / Accent color | Yes | Yes (allowed slots) | No | Contrast policy |
| Hero background (image/video) | Yes | Yes | Limited | Quota + MIME |
| Welcome headline/subline | Yes | Yes | Stay/Group overlay | Locale completeness |
| Menu structure / safe region | Yes | Preset only | No | Cannot hide TV/Help |
| Information pages | Yes | Yes | No | Content policy |
| Default guest locale | Yes | Yes | Per-stay | — |
| Pre-TV promo enabled | Yes | Yes | No | — |
| Launcher profile | Yes | Yes | No | Capability |

Setiap field di editor menampilkan:
- **Inherited** | **Overridden** | **Locked**
- Source layer + version
- “Reset to inherited” dengan konfirmasi dampak

### 6.4 Resolution Engine
```
resolveBranding(context: {
  propertyId, roomId?, stayId?, groupId?,
  locale, time, endpointCapability
}) → ResolvedBrandProfile {
  values: Record<field, resolvedValue>,
  provenance: Record<field, { layer, sourceId, version }>,
  conflicts: Conflict[],
  warnings: string[],          // missing locale, low contrast, etc.
  previewHash: string
}
```

**Conflict resolution policy (eksplisit):**
- Publisher harus memilih resolution sebelum publish.
- Tidak ada silent last-edited-wins.
- Group vs Individual stay: individual menang untuk personal name; group menang untuk corporate badge jika dikonfigurasi demikian.

### 6.5 Brand Studio UX (sesuai Design System §19)

**Layout:**
- Tabs: Identity · Theme · Menu · Information · Locales · Targeting
- Editor kiri + TV Preview kanan (atau tab penuh di viewport sempit)
- Persistent bar: Draft version · Saved at · Preview · Request Review / Publish

**Preview Contexts:**
- Property / Room Class / Specific Room / Endpoint
- Locale switcher (4 bahasa)
- Sample stay / group
- Simulated offline / limited capability
- Draft vs Applied badge

**Validation sebelum Publish:**
- Contrast check (foreground/background/focus)
- Locale completeness (fallback chain: selected → en → property default → generic)
- Media ready state + quota
- Safe region / menu invariant (TV & Help tidak boleh hilang)
- Target endpoint count + exclusions

### 6.6 Publish Pipeline (diperkuat)
```
Draft → Validate → Preview Diff + Targets → 
Approval (jika diperlukan) → 
Create Immutable Manifest (checksum + validity window) → 
Dispatch → 
Device: Received → Verified → Applied → Healthy
```

- Rollback = publish snapshot lama sebagai versi baru.
- Device mempertahankan versi lama jika unduhan aset baru gagal.
- CMS membedakan queued / received / verified / applied / failed / offline-pending.

### 6.7 Media Lifecycle
- Upload → Validation (MIME, size, checksum, metadata) → Ready → In Use → Retired
- Media yang masih direferensikan manifest aktif tidak bisa dihapus tanpa dependency check.
- Quota dihitung per plan version + scope.

### 6.8 Acceptance Criteria (Branding)
- [x] Field menampilkan Inherited / Overridden / Locked dengan benar.
- [x] Preview menampilkan provenance (source layer: PLATFORM → CUSTOMER → PROPERTY → ROOM_CLASS → ROOM → STAY).
- [x] Konflik group vs individual diselesaikan secara eksplisit oleh publisher (Personal stay nama tamu pada primary headline, corporate delegation banner pada secondary subtitle).
- [x] Publish menghasilkan manifest immutable + ACK bertahap.
- [x] Rollback bekerja sebagai publish versi lama / reset override.
- [x] Contrast & locale validation (WCAG 2.1 AA/AAA calculateContrastRatio) mencegah publish yang merusak keterbacaan.
- [x] Capability limited endpoint mendapat fallback visual yang aman.

### 6.9 Estimasi
- Effort: L (5–8 hari) karena mencakup editor, resolver, preview, publish, dan media lifecycle.

---

## 7. Campaign Eligibility Engine & Measurement Taxonomy (Diperluas)

### 7.1 Tujuan
Membangun engine pemilihan campaign yang deterministik + taksonomi pengukuran yang **tidak menyamakan playback teknis dengan audience manusia**, sesuai FR13-* dan Decision Register.

### 7.2 Placement Taxonomy (P1 + ekspansi)
| Placement | Trigger | Default Cap | Skippable | Catatan |
|-----------|---------|-------------|-----------|---------|
| `splash` | App launch (relevant) | 1 per session | No (sangat singkat) | Identitas brand |
| `welcome` | Stay valid + first relevant moment | 1 per stay | Yes after N sec | Personal / group / generic |
| `home_hero` | Home screen | Frequency + rotation | Yes | Promo prioritas |
| `service_detail` | Buka detail fasilitas | Context | Yes | Spa, dining, dll |
| `pre_live_tv` | Sebelum masuk live TV | Opt-in / capped | Yes | Default off |
| `idle_home` | Idle di Home | Time-based | Yes | Tidak merebut live TV |
| `shared_signage` | Lobby / public | Schedule | N/A | Tanpa PII tamu |

### 7.3 Eligibility Pipeline
```
1. Scope & property acceptance
2. Campaign status + period (timezone lokal)
3. Placement match
4. Locale / fallback chain
5. Asset Ready state
6. Audience rules (stay / group / room class / public)
7. Frequency cap (per stay / per device / per day)
8. Service availability (jam operasional)
9. Priority + rotation within remaining budget
10. Output: SelectedCreative | None + denial log (internal)
```

**Guardrail:**
- Priority tinggi tidak menembus approval atau expiry.
- Channel zap cepat tidak memicu loop.
- Offline hanya memutar media yang sudah lengkap terunduh + masih valid.

### 7.4 Measurement Taxonomy (Wajib dipisahkan)
| Event / Metric | Arti | Boleh diklaim sebagai |
|----------------|------|-----------------------|
| `impression_attempt` | Creative mulai dimuat | Technical |
| `start` | Playback / display dimulai | Technical start |
| `first_quartile` / `midpoint` / `third_quartile` | Progress | Technical progress |
| `complete` | Mencapai akhir atau threshold | Technical complete |
| `skip` | User skip | User action |
| `interrupt` | Diganti konteks (channel change, app background) | Technical |
| `fail_after_start` | Error setelah start | Technical failure |
| `play_seconds` | Durasi valid | Exposure time (bukan audience) |

**Larangan keras di dashboard P1:**
- “X orang melihat”
- Menyamakan 1 start = 1 unique viewer
- Revenue attribution tanpa settlement ledger terpisah

### 7.5 Model Data
```
Campaign {
  ...existing,
  placement, priority, frequencyCapPerStay,
  frequencyCapPerDeviceDay?,
  durationSeconds, skippableAfterSeconds,
  targetAudience: { roomClasses?, groupIds?, stayRequired? },
  quietHours?, soundPolicy?
}

PlaybackFact {
  id, campaignId, endpointId, stayId?,
  eventType, occurredAt, playSeconds?,
  creativeVersion, sessionId, locale,
  outcome: 'completed' | 'skipped' | 'interrupted' | 'failed'
}
```

### 7.6 UI Surfaces
- Campaign builder dengan eligibility preview (“akan tayang di X endpoint / Y stay sample”)
- Conflict / priority visualizer
- Analytics: Starts, Completion rate, Skip rate, Play minutes — dengan disclaimer jelas
- Frequency & cap controls

### 7.7 Acceptance Criteria
- [x] Cap per stay dihormati (denial code FREQUENCY_CAP_REACHED ketika play count mencapai batas).
- [x] Pre-live-TV default off dan skippable (CMP-05 skippable after 5s).
- [x] Shared signage tidak pernah menampilkan nama tamu (PUBLIC_AREA_RESTRICTED).
- [x] Dashboard tidak menampilkan klaim audience manusia (Rule BR19 strictly enforces technical video player starts & exposure duration).
- [x] Offline hanya memakai aset valid yang sudah terunduh.
- [x] Perubahan creative version tercatat di PlaybackFact (immutable playback event ledger & atomic campaign telemetry counter).

### 7.8 Estimasi
- Effort: L (5–7 hari)

---

## 13. Marketplace & Ad Network Foundation (Diperluas menjadi lebih kompleks)

> Catatan: Ini adalah **fondasi model domain + workflow**, bukan peluncuran marketplace penuh. Settlement finansial tetap fase lanjut.

### 13.1 Tujuan
Menyiapkan model data, entitlement, approval flow, dan measurement yang memungkinkan:
1. **Internal hotel promotion** (sudah ada di poin 7) → matang.
2. **External paid offer** (hotel menerima tawaran brand) dengan opt-in sadar.
3. **Marketplace service** (spa, transport, experience) dengan order & fulfilment status (tanpa payment gateway penuh di fase ini).

### 13.2 Bounded Contexts

#### A. Ad Offer (External)
```
AdOffer {
  id, advertiserOrgId, title, category,
  creativeVersions[],
  requestedPlacements[],
  proposedPeriod, proposedCap,
  pricingModel: 'CPM' | 'CPC' | 'CPA' | 'Flat' | 'RevShare',
  exclusions, targetingNotes,
  status: 'Draft' | 'Submitted' | 'UnderReview' | 'Accepted' | 'Rejected' | 'Active' | 'Completed' | 'Cancelled'
}

PropertyAdAcceptance {
  offerId, propertyId,
  acceptedPlacements, acceptedPeriod, acceptedCap,
  commercialTermsRef,
  acceptedBy, acceptedAt,
  status
}
```

**Aturan:**
- Hotel harus **secara sadar** menerima tawaran (opt-in).
- Perubahan material creative / period / placement → butuh acceptance ulang.
- Advertiser **tidak** mendapat guest list atau personal data.
- Measurement memakai taxonomy yang sama dengan poin 7; settlement ledger terpisah (P2+).

#### B. Marketplace Catalog & Order (Service)
```
MarketplaceItem {
  id, propertyId | partnerId,
  type: 'InHouseService' | 'ThirdPartyExperience' | 'F&B' | 'Transport' | ...,
  title, description, localeContent,
  priceHint?, availabilitySchedule,
  fulfilmentType: 'QR_HANDOFF' | 'STAFF_TICKET' | 'PARTNER_API' | 'MANUAL',
  status
}

ServiceOrder {
  id, itemId, propertyId, roomId?, stayId?,
  guestDisplayRef (redacted),
  status: 'Requested' | 'Confirmed' | 'InFulfilment' | 'Fulfilled' | 'Cancelled' | 'Expired',
  requestedAt, confirmedAt?, fulfilledAt?,
  notes, assignedTo?
}
```

**Batasan P1/P1.5:**
- Tidak ada payment capture di dalam GOJJA (bisa QR ke sistem hotel / partner).
- Tidak ada revenue share calculation otomatis yang final.
- Fokus pada **request → confirm → fulfil** visibility untuk staf dan tamu.

### 13.3 Workflow Utama

**External Ad:**
1. Advertiser (atau GOJJA ops) membuat Offer.
2. Property Manager mereview → Accept / Reject / Counter (sederhana).
3. Accepted offer menjadi Campaign source dengan flag `externalPaid`.
4. Eligibility engine (poin 7) memperlakukan seperti campaign biasa + extra constraints.
5. Reporting teknis ke property; settlement di luar scope fase ini.

**Marketplace Service:**
1. Item dikatalogkan oleh property / partner.
2. Tamu melihat di TV (service tile) → Request.
3. Front Office / assigned staff Confirm.
4. Fulfilment diupdate.
5. Analytics funnel: tile exposure → detail → request → confirmed → fulfilled (sudah ada sebagian di analyticsFixture).

### 13.4 Permission Matrix (Ringkas)
| Aksi | GOJJA Admin | Property Manager | Content Editor | Front Office | Advertiser |
|------|-------------|------------------|----------------|--------------|----------|
| Buat AdOffer | Yes | No | No | No | Yes (scoped) |
| Accept Offer | Delegasi | Yes | No | No | No |
| Kelola Item Marketplace | Delegasi | Yes | Limited | No | Partner scoped |
| Confirm ServiceOrder | No | Yes | No | Yes | No |
| Lihat guest name di order | No default | Yes | No | Yes | No |

### 13.5 Integrasi dengan Engine Lain
- Campaign Eligibility (poin 7) menjadi satu-satunya pemilih creative, termasuk external.
- Branding resolver tidak diganggu oleh ad creative (slot terpisah).
- Capability gating: video ad hanya jika playback & cache mendukung.

### 13.6 Acceptance Criteria (Fondasi)
- [x] Property hanya menayangkan external offer yang sudah di-accept (Checked via step 2b di `evaluateCampaignEligibility` dengan status PropertyAdAcceptance = 'Accepted').
- [x] Perubahan material offer menonaktifkan acceptance lama (`offerVersion` mismatch men-trigger denial `EXTERNAL_AD_SUPERCEDED` dan state acceptance beralih ke 'Superceded').
- [x] Advertiser tidak bisa membaca guest PII (`maskGuestName` men-samarkan nama menjadi `Room 201 · Guest B*** S***`; unmasking di-gate permission khusus R-11/R-13).
- [x] ServiceOrder flow Request → Confirm → InFulfilment → Fulfil dapat dilacak secara end-to-end baik via UI TV Guest App maupun Front Desk fulfillment desk.
- [x] Funnel analytics membedakan internal promo vs external offer vs service request (Dilengkapi disclaimer kepatuhan technical impression & exposure minutes non-audience).
- [x] Tidak ada klaim revenue/settlement yang belum memiliki ledger (P1/P1.5 strictly bounded sebagai request/concierge order tanpa klaim settlement otomatis).

### 13.7 Estimasi
- Effort: L–XL (7–12 hari) untuk fondasi yang solid (domain + workflow + UI dasar).
- Disarankan dikerjakan setelah poin 6 dan 7 stabil.

---

## Urutan Implementasi yang Direkomendasikan

```
Fase A (Foundation) [SELESAI - 7 Nov 2026]
├── [x] 1. Seat Ledger + Billing State Machine (Ledger, Change Order Prorata, Suspension)
├── [x] 2. Capability-based Feature Gating (10 Key Taxonomy, Gating, Inspection Modal)
└── [x] 5. Preflight & Limitation Messaging (Preflight Checklist before Room Assignment)

Fase B (Core Operations) [SELESAI - 7 Nov 2026]
├── [x] 3. Update Eligibility & Job State Machine (9-step evaluation, BR06 check-in deferral, OutcomeUnknown recovery, Inspection Matrix Modal)
└── [x] 4. Provider Entitlement Resolution (Effective Lineup engine, Room class tier simulation, Headend contract health, TV Guide lock badge & denial overlay)

Fase C (Experience Deepening) [SELESAI - 7 Nov 2026]
├── [x] 6. Branding Inheritance & Resolution Engine (Multi-layer 6-tier provenance, WCAG 2.1 AA/AAA contrast calculator, Explicit Coexistence Conflict Resolution)
└── [x] 7. Campaign Eligibility Engine & Measurement (Deterministic 10-step pipeline, Pre-live TV interstitials, frequency cap per stay, BR19 immutable PlaybackFact telemetry)

Fase D (Commercial Expansion Foundation) [SELESAI - 7 Nov 2026]
└── [x] 13. Marketplace & Ad Network Foundation (AdOffer governance, superceded revisions, PII masking, ServiceOrder fulfillment desk, TV-06 integration)
```

**Total estimasi kasar (satu engineer senior + AI assistance):** 7–10 minggu kalender untuk kualitas yang dapat diuji, tergantung parallelization dan review cycle.

---

## Cross-Cutting Requirements (Berlaku untuk Semua Poin)

1. **Server-side authorization** tetap deny-by-default; permission baru didaftarkan di role catalog.
2. **Audit event** wajib untuk setiap mutasi penting (siapa, apa, sebelum/sesudah, reason).
3. **Simulation / Demo badge** tidak boleh hilang pada fitur yang masih memakai data sintetis atau jalur non-produksi.
4. **Locale**: CMS tetap 2 bahasa (ID/EN); TV Guest tetap 4 bahasa dengan fallback chain.
5. **Timezone**: semua schedule & validity memakai timezone properti.
6. **Idempotency** pada payment, publish, dan job transition.
7. **Versioning**: manifest, lineup, branding profile, campaign creative semuanya versioned.
8. **Observability**: setiap engine (billing, entitlement, branding, campaign, update) menulis structured log / audit yang dapat digali support.

---

## Definition of Done (Global per Epic)

- [x] Domain model & migration (atau seed update) selesai (Tersimpan di `src/data/mockData.ts`, SSOT store `gojja-functional-demo-6` di `server.ts` & `.gojja-ssot-store.json`).
- [x] Server routes + authorization + audit (Implementasi endpoint komprehensif di `server.ts` dengan role-based authorization deny-by-default & structured audit events).
- [x] UI surfaces sesuai Design System v1.1 (CSS luxury tokens `--cms-surface`, tabular font, interactive inspection modals, Front Desk fulfillment board, dan TV Guest App modal).
- [x] Unit / integration test untuk aturan kritis (Suite otomatis `npm test` via `tests/run_all_tests.ts` memverifikasi 31 skenario kritis Fase A, B, C, dan D dengan 100% lulus).
- [x] Acceptance criteria di atas terpenuhi (Seluruh kriteria penerimaan poin 1, 2, 3, 4, 5, 6, 7, dan 13 berstatus `[x]`).
- [x] Dokumentasi singkat di dalam repo (atau update Decision Register) (Dokumentasi implementasi gap closing tercatat di implementation plan ini dan riwayat commit/changelog).
- [x] Tidak ada regresi pada flow DEMO yang sudah ada (Flow preview TV Guest, Billing, Device Discovery, Fleet Control terverifikasi bersih tanpa error console/runtime).
- [x] LIVE_LAB path tetap aman (tidak memaksa fake success) (Koneksi ADB hardware riil mengevaluasi status aktual tanpa spoofing keberhasilan palsu).

---

## Risiko Utama & Mitigasi

| Risiko | Dampak | Mitigasi |
|--------|--------|----------|
| Over-scoping branding inheritance | Delay | Kerjakan resolver dulu, editor incremental |
| Campaign measurement disalahartikan sales | Klaim salah | Disclaimer UI + taxonomy ketat |
| Marketplace dianggap sudah bisa transaksi uang | Ekspektasi salah | Label jelas “Request only – payment di luar GOJJA” |
| Capability Unknown terlalu banyak | UX buruk | Seed capability profile yang masuk akal + jalur observation |
| Update state machine terlalu ketat di awal | Operasi macet | Sediakan “Force with reason” terbatas + audit |

---

## Lampiran: Referensi Dokumen Sumber

- Master PRD v1.0 — terutama M02, M03, M05, M07, M09, M10, M13, M17
- Product Consolidation & Decision Register v1.1
- Prototype Specification & Build Brief v1.0
- UI/UX Design System & Interaction Guide v1.1 (khusus §19 Branding editor, inheritance dan preview)
- Current codebase: `src/data/mockData.ts`, `server.ts`, `src/App.tsx`, komponen Brand Studio & TV Guest

---

**Dokumen ini siap untuk review.**  
Silakan berikan feedback pada prioritas urutan, kedalaman per poin, atau penyesuaian scope sebelum kita mulai breakdown menjadi ticket / mulai implementasi kode.
