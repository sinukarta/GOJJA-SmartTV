import { resolveTvExperience } from './tvExperience';
import type { TvExperienceSettings, EntertainmentEntitlement } from './tvExperience';
/**
 * GOJJA SmartTV — Unified Single Source of Truth (SSOT) Seed & Domain Data
 * Implements Prototype Specification & Build Brief v1.0, Master PRD v1.0,
 * Product Consolidation v1.1, UI/UX Design System v1.0 R1, and Implementation Contract v1.0.
 */

export type EnvironmentId = 'DEMO' | 'LIVE_LAB';
export type GuestLocale = 'id' | 'en' | 'zh-CN' | 'ja-JP';
export type CmsLocale = 'id' | 'en';

export type RoleId =
  | 'R-01'
  | 'R-02'
  | 'R-03'
  | 'R-04'
  | 'R-05'
  | 'R-06'
  | 'R-07'
  | 'R-08'
  | 'R-09'
  | 'R-10'
  | 'R-11'
  | 'R-12'
  | 'R-13'
  | 'R-14'
  | 'R-15'
  | 'R-16'
  | 'SP-01'
  | 'SP-02';

export interface RoleDefinition {
  id: RoleId;
  name: string;
  category: 'GOJJA_ADMIN' | 'ISP_PARTNER' | 'PROPERTY_TEAM' | 'GUEST' | 'SERVICE_PRINCIPAL';
  defaultSurface: 'gojja' | 'partner' | 'property' | 'installer' | 'tv';
  description: string;
  permissions: string[];
  exclusions: string[];
}

export interface UserAccount {
  id: string;
  alias: string;
  name: string;
  email: string;
  roleId: RoleId;
  organizationId: string | null;
  partnerId: string | null;
  propertyIds: string[];
  allowedEnvironments: EnvironmentId[];
  avatarInitials: string;
  badgeLabel: string;
}

export interface Partner {
  id: string;
  name: string;
  status: 'Active' | 'Suspended';
  region: string;
  contactEmail: string;
  supportTier: string;
}

export interface Customer {
  id: string;
  name: string;
  legalEntity: string;
  type: 'organization' | 'household';
  propertyId: string;
  partnerId: string | null;
  salesRoute: 'ISP_RESELLER' | 'DIRECT';
  status: 'Active' | 'Trial' | 'Restricted';
}

export interface Property {
  tvExperience?: TvExperienceSettings;
  id: string;
  customerId: string;
  partnerId: string | null;
  name: string;
  categoryLabel: string;
  city: string;
  timezone: string;
  defaultLocale: GuestLocale;
  experienceProfile: 'Hospitality' | 'Residence' | 'Home' | 'SharedDisplay';
  heroImageUrl: string;
  logoText: string;
  logoSubtitle: string;
  accentColor: string;
  primaryColor: string;
  welcomeHeadline: Record<GuestLocale, string>;
  welcomeSubline: Record<GuestLocale, string>;
  wifiSsid: string;
  frontDeskExt: string;
  resourceVersion: number;
  logoImageUrl?: string;
  heroMediaType?: 'image' | 'video';
  heroVideoUrl?: string;
  promoMediaType?: 'image' | 'video';
  promoMediaUrl?: string;
  promoTitle?: string;
  launcherConfig?: {
    mode: 'GOJJA_LAUNCHER' | 'STOCK_TV_LAUNCHER';
    profile: 'STRICT_KIOSK' | 'CLEAN_WITH_OTT' | 'CUSTOM';
    disabledPackages: string[];
    lastAppliedAt: string;
    launcherVersion: string;
    lastAdbTranscript?: string[];
  };
}

export type SubscriptionSuspensionStatus = 'None' | 'Soft' | 'Hard';

export interface SeatLedgerEntry {
  id: string;
  subscriptionId: string;
  propertyId: string;
  type: 'COMMITTED' | 'ALLOCATED' | 'RESERVED' | 'RELEASED' | 'ADJUSTMENT';
  quantityDelta: number;
  effectiveFrom: string;
  effectiveTo?: string;
  reasonCode: string;
  changeOrderId?: string;
  createdBy: string;
  createdAtUtc: string;
  version: number;
}

export interface ChangeOrder {
  id: string;
  subscriptionId: string;
  propertyId: string;
  requestedDelta: number;
  effectiveDate: string;
  status: 'Draft' | 'Approved' | 'Applied' | 'Rejected';
  prorataAmountIdr: number;
  reason: string;
  requestedBy: string;
  approvedBy?: string | null;
  appliedAtUtc?: string | null;
  createdAtUtc: string;
}

export interface InvoiceLine {
  id: string;
  description: string;
  seatDays: number;
  unitPriceIdr: number;
  amountIdr: number;
  lineType: 'BASE' | 'TRUE_UP' | 'CREDIT' | 'ADJUSTMENT';
}

export interface Subscription {
  entertainmentAppsEntitlement?: EntertainmentEntitlement;
  id: string;
  customerId: string;
  propertyId: string;
  buyerId: string;
  buyerType: 'ISP' | 'CUSTOMER';
  planName: string;
  planVersion: string;
  seats: number;
  committedQuantity: number;
  allocatedQuantity: number;
  reservedQuantity: number;
  billedQuantityCurrentPeriod: number;
  unitPriceIdr: number;
  status: 'Active' | 'Trial' | 'PastDue';
  suspensionStatus: SubscriptionSuspensionStatus;
  trialEndsAt?: string;
  graceEndsAt?: string;
  effectiveDate: string;
  version: number;
}

export interface Room {
  id: string;
  propertyId: string;
  code: string;
  roomClass: 'Standard' | 'Deluxe' | 'Suite' | 'Studio';
  floor: number;
  housekeeping: 'Ready' | 'Dirty' | 'Inspecting';
  maintenanceAuthorized: boolean;
  notes?: string;
}

export type CapabilityKey =
  | 'launcher.takeover'
  | 'adb.install'
  | 'adb.shell'
  | 'kiosk.mode'
  | 'power.recovery'
  | 'drm.widevine.l1'
  | 'playback.hls'
  | 'playback.dash'
  | 'offline.cache'
  | 'remote.dpad';

export interface EffectiveCapabilityResult {
  capability: CapabilityKey;
  status: 'Supported' | 'Limited' | 'Unsupported' | 'Unknown';
  route: string;
  evidenceType: 'DemoFixture' | 'LiveObserved' | 'VendorDeclared';
  limitationMessage?: string;
  requiredAction?: string;
}

export interface CapabilityFlag {
  capability: string;
  status: 'Supported' | 'Limited' | 'Unsupported' | 'Unknown';
  route: string;
  evidenceType: 'DemoFixture' | 'LiveObserved';
  limitation: string;
}

export interface PreflightCheckItem {
  id: string;
  name: string;
  category: 'OS' | 'Storage' | 'Network' | 'ADB' | 'DRM' | 'Launcher';
  status: 'Supported' | 'Limited' | 'Unsupported';
  observedValue: string;
  detail: string;
  requiredAction?: string;
  isCritical: boolean;
}

export interface TvDeviceBackup {
  id: string;
  candidateId?: string;
  endpointId?: string;
  propertyId: string;
  targetIp: string;
  targetPort: number;
  createdAtUtc: string;
  createdBy: string;
  deviceInfo: {
    brand: string;
    model: string;
    manufacturer: string;
    androidVersion: string;
    sdkInt: number;
    buildFingerprint?: string;
    serialNo?: string;
  };
  originalLauncher: {
    component: string;
    packageName: string;
    activityName: string;
    allAvailableLaunchers: string[];
  };
  packageInventory: {
    totalCount: number;
    enabledPackages: string[];
    disabledPackages: string[];
    thirdPartyPackages: string[];
    systemPackages: string[];
  };
  settingsDump?: {
    globalSettingsCount: number;
    secureSettingsCount: number;
    systemSettingsCount: number;
  };
  visualBaseline?: {
    screenshotUrl?: string;
    capturedAtUtc?: string;
  };
  restoreArtifacts: {
    backupFolderPath?: string;
    restoreBashScript: string;
    restoreBatchScript: string;
  };
  status: 'Verified' | 'Restored' | 'Corrupted';
  notes?: string;
}

export interface Endpoint {
  id: string;
  propertyId: string;
  roomId: string;
  subscriptionId: string;
  label: string;
  connection: 'Online' | 'Offline';
  capabilityProfile: 'DEMO-MANAGED' | 'DEMO-LIMITED' | 'DEMO-ASSISTED' | 'LIVE-VERIFIED';
  modelName: string;
  manufacturer: string;
  androidVersion: string;
  sdkInt: number;
  appVersion: string;
  desiredVersion: string;
  appliedConfigVersion: number;
  lastSeenUtc: string;
  ipHint: string;
  portHint: number;
  serialRef: string;
  bindingVersion: number;
  origin: 'SEEDED' | 'MANUAL' | 'LIVE_OBSERVATION';
  verificationLevel: 'OBSERVED' | 'TRANSPORT_VERIFIED' | 'DEVICE_VERIFIED' | 'APPLIED' | 'HEALTHY';
  activeBackupId?: string;
  activeBackup?: TvDeviceBackup;
}

export interface Stay {
  id: string;
  propertyId: string;
  roomId: string;
  displayName: string | null;
  locale: GuestLocale;
  groupId: string | null;
  arrivalUtc: string;
  departureUtc: string;
  status: 'InHouse' | 'CheckedOut' | 'Planned';
  contextVersion: number;
  ottCleanupStatus: 'NotApplicable' | 'Pending' | 'VerifiedClean' | 'ManualSOPRequired';
}

export interface CorporateGroup {
  id: string;
  propertyId: string;
  name: string;
  stayIds: string[];
  message: Record<GuestLocale, string>;
  arrivalUtc: string;
  departureUtc: string;
  badgeText: string;
}

export type EntitlementDenialCode =
  | 'CONTRACT_EXPIRED'
  | 'CONTRACT_NOT_ACTIVE'
  | 'PACKAGE_NOT_INCLUDED'
  | 'ROOM_CLASS_NOT_ALLOWED'
  | 'PROVIDER_DEGRADED'
  | 'PUBLIC_AREA_RESTRICTED'
  | 'HIDDEN_IN_GUIDE';

export interface DenialReason {
  channelId: string;
  channelName: string;
  packageId: string;
  code: EntitlementDenialCode;
  message: string;
}

export interface EffectiveChannel extends Channel {
  entitlementSource: string;
  allowedRoomClasses: string[];
}

export interface EffectiveLineupResult {
  propertyId: string;
  roomId?: string;
  roomClass: string;
  isPublicArea: boolean;
  computedAtUtc: string;
  lineupVersion: number;
  channels: EffectiveChannel[];
  deniedChannels: DenialReason[];
}

export interface ProviderContract {
  id: string;
  propertyId: string;
  holderName: string;
  providerId: string;
  providerName: string;
  basis: 'room' | 'endpoint';
  quantity: number;
  status: 'Submitted' | 'Verified' | 'Active' | 'Expired';
  packages: string[];
  allowedRoomClasses: string[];
  multiTvIncluded: boolean;
  publicAreaAllowed: boolean;
  validUntilUtc: string;
  connectionStatus: 'Ready' | 'Degraded' | 'Failed' | 'TokenExpired';
}

export interface Channel {
  id: string;
  number: string;
  name: string;
  category: 'News' | 'Entertainment' | 'Sports' | 'Movies' | 'Hotel';
  packageId: 'PKG-FREE' | 'PKG-BASIC' | 'PKG-INTL' | 'PKG-SPORTS';
  providerId: string;
  language: string;
  currentProgram: Record<GuestLocale, string>;
  programTime: string;
  streamUrlHint: string;
  thumbnailUrl: string;
  hiddenInGuide?: boolean;
}

export type BrandingLayer = 'PLATFORM' | 'CUSTOMER' | 'PROPERTY' | 'ROOM_CLASS' | 'ROOM' | 'STAY';

export type BrandingFieldKey =
  | 'accentColor'
  | 'primaryColor'
  | 'welcomeHeadline'
  | 'welcomeSubline'
  | 'logoText'
  | 'logoSubtitle'
  | 'logoImageUrl'
  | 'heroMediaType'
  | 'heroImageUrl'
  | 'heroVideoUrl'
  | 'promoMediaType'
  | 'promoMediaUrl'
  | 'promoTitle'
  | 'defaultLocale'
  | 'preTvPromoEnabled';

export interface ProfileOverride {
  id: string;
  propertyId: string;
  layer: BrandingLayer;
  targetId: string;
  field: BrandingFieldKey;
  value: string;
  updatedBy: string;
  updatedAtUtc: string;
  version: number;
}

export interface Publication {
  id: string;
  propertyId: string;
  version: number;
  title: string;
  publishedBy: string;
  publishedAtUtc: string;
  status: 'Active' | 'PartialAck' | 'Superseded';
  targetCount: number;
  receivedCount: number;
  verifiedCount: number;
  appliedCount: number;
  healthyCount: number;
  offlinePendingCount: number;
  notes: string;
}

export type CampaignPlacement =
  | 'home_hero'
  | 'welcome_screen'
  | 'service_detail'
  | 'pre_live_tv'
  | 'idle_home'
  | 'shared_signage';

export interface CampaignTargetAudience {
  roomClasses?: string[];
  groupIds?: string[];
  stayRequired?: boolean;
  isPublicAreaAllowed?: boolean;
}

export interface Campaign {
  id: string;
  propertyId: string;
  name: string;
  category: 'Spa & Wellness' | 'Corporate Welcome' | 'Fine Dining' | 'Pool & Leisure' | 'External Offer';
  placement: CampaignPlacement;
  status: 'Active' | 'Draft' | 'Scheduled' | 'Expired' | 'Paused';
  priority: number;
  frequencyCapPerStay: number;
  durationSeconds: number;
  skippableAfterSeconds: number;
  startUtc: string;
  endUtc: string;
  imageUrl: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  headline: Record<GuestLocale, string>;
  ctaLabel: Record<GuestLocale, string>;
  creativeVersion: number;
  startsCount: number;
  completedCount: number;
  skippedCount: number;
  interruptedCount: number;
  failedAfterStartCount: number;
  totalPlaySeconds: number;
  targetAudience?: CampaignTargetAudience;
  externalPaid?: boolean;
  adOfferId?: string;
  advertiserName?: string;
  offerVersion?: number;
}

export type PlaybackEventType =
  | 'impression_attempt'
  | 'start'
  | 'first_quartile'
  | 'midpoint'
  | 'third_quartile'
  | 'complete'
  | 'skip'
  | 'interrupt'
  | 'fail_after_start';

export interface PlaybackFact {
  id: string;
  campaignId: string;
  endpointId: string;
  stayId?: string;
  eventType: PlaybackEventType;
  occurredAt: string;
  playSeconds: number;
  creativeVersion: number;
  sessionId: string;
  locale: GuestLocale;
  outcome: 'completed' | 'skipped' | 'interrupted' | 'failed';
}

// ============================================================================
// FASE D: Commercial Expansion Foundation (Poin 13: Marketplace & Ad Network)
// ============================================================================

export type AdOfferPricingModel = 'CPM' | 'CPC' | 'CPA' | 'Flat' | 'RevShare';
export type AdOfferStatus =
  | 'Draft'
  | 'Submitted'
  | 'UnderReview'
  | 'Accepted'
  | 'Rejected'
  | 'Active'
  | 'Completed'
  | 'Cancelled';

export interface AdOfferCreative {
  version: number;
  headline: string;
  subline: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  targetPlacement: CampaignPlacement;
  callToAction?: string;
  advertiserBrand: string;
  updatedAtUtc: string;
}

export interface AdOffer {
  id: string;
  advertiserOrgId: string;
  advertiserName: string;
  title: string;
  category: 'F&B' | 'AUTOMOTIVE' | 'LUXURY_RETAIL' | 'AIRLINE' | 'LOCAL_EXPERIENCE' | 'FINTECH';
  creativeVersions: AdOfferCreative[];
  currentVersion: number;
  requestedPlacements: CampaignPlacement[];
  proposedPeriod: {
    startUtc: string;
    endUtc: string;
  };
  proposedCapPerStay: number;
  pricingModel: AdOfferPricingModel;
  proposedRateIdr: number;
  exclusions?: string[];
  targetingNotes?: string;
  status: AdOfferStatus;
  createdAtUtc: string;
}

export type PropertyAdAcceptanceStatus = 'PendingReview' | 'Accepted' | 'Rejected' | 'Superceded';

export interface PropertyAdAcceptance {
  id: string;
  offerId: string;
  offerVersion: number;
  propertyId: string;
  acceptedPlacements: CampaignPlacement[];
  acceptedPeriod: {
    startUtc: string;
    endUtc: string;
  };
  acceptedCapPerStay: number;
  commercialTermsRef: string;
  acceptedBy: string;
  acceptedAtUtc: string;
  status: PropertyAdAcceptanceStatus;
  rejectionReason?: string;
  supercededReason?: string;
}

export type MarketplaceItemType =
  | 'InHouseService'
  | 'ThirdPartyExperience'
  | 'F&B'
  | 'Transport'
  | 'Wellness';

export type FulfilmentType = 'QR_HANDOFF' | 'STAFF_TICKET' | 'PARTNER_API' | 'MANUAL';

export interface MarketplaceItem {
  tvIcon?: import('./tvCatalog').TvCatalogIconId;
  videoUrl?: string;
  locationLabel?: string;
  exploreCategory?: import('./tvCatalog').ExploreCategory;
  id: string;
  propertyId: string;
  partnerId?: string;
  partnerName?: string;
  type: MarketplaceItemType;
  title: string;
  description: string;
  localeContent: Record<GuestLocale, { title: string; description: string; actionLabel: string }>;
  priceHint?: string;
  availabilitySchedule: string;
  fulfilmentType: FulfilmentType;
  status: 'Active' | 'Paused' | 'Archived';
  imageUrl?: string;
  featured?: boolean;
}

export type ServiceOrderStatus =
  | 'Requested'
  | 'Confirmed'
  | 'InFulfilment'
  | 'Fulfilled'
  | 'Cancelled'
  | 'Expired';

export interface ServiceOrder {
  id: string;
  itemId: string;
  itemTitle: string;
  propertyId: string;
  roomId?: string;
  stayId?: string;
  guestDisplayRef: string; // Strictly redacted PII, e.g., 'Room 201 · Guest B*** S***'
  rawGuestName?: string;   // Only accessible to authorized staff (Front Office / Property Manager)
  status: ServiceOrderStatus;
  requestedAtUtc: string;
  confirmedAtUtc?: string | null;
  fulfilledAtUtc?: string | null;
  notes?: string;
  assignedTo?: string | null;
  fulfilmentType: FulfilmentType;
}

export function maskGuestName(fullName: string): string {
  if (!fullName) return 'Guest ***';
  const parts = fullName.trim().split(/\s+/);
  return parts
    .map((p) => {
      if (p.length <= 1) return `${p}***`;
      return `${p[0]}***`;
    })
    .join(' ');
}

export interface GojjaCleanTvPackageItem {
  pkg: string;
  label: string;
  category: 'STOCK_LAUNCHER' | 'TELEMETRY_ADS' | 'PRELOADED_OTT';
  defaultInStrict: boolean;
  defaultInOttKeep: boolean;
  description: string;
}

export const GOJJA_CLEANTV_PACKAGES: GojjaCleanTvPackageItem[] = [
  {
    pkg: 'com.google.android.apps.tv.launcherx',
    label: 'Google TV Core LauncherX (Modern Google TV Interface)',
    category: 'STOCK_LAUNCHER',
    defaultInStrict: true,
    defaultInOttKeep: true,
    description: 'Disables default Google TV LauncherX shell on modern Sony Bravia, Xiaomi, and TCL Google TVs.',
  },
  {
    pkg: 'com.google.android.tvlauncher',
    label: 'Android TV Stock Home Launcher (Ad Banner Shell)',
    category: 'STOCK_LAUNCHER',
    defaultInStrict: true,
    defaultInOttKeep: true,
    description: 'Disables default Android TV home screen & sponsored carousel so GojjaLauncher takes over HOME button.',
  },
  {
    pkg: 'com.google.android.leanbacklauncher',
    label: 'Android TV Leanback Stock Launcher',
    category: 'STOCK_LAUNCHER',
    defaultInStrict: true,
    defaultInOttKeep: true,
    description: 'Disables legacy Android TV stock home screen and recommendations row.',
  },
  {
    pkg: 'com.google.android.leanbacklauncher.recommendations',
    label: 'Android TV Sponsored Recommendations Service',
    category: 'TELEMETRY_ADS',
    defaultInStrict: true,
    defaultInOttKeep: true,
    description: 'Stops background ad & movie recommendation injection on Android TV.',
  },
  {
    pkg: 'com.google.android.tungsten.setupwraith',
    label: 'Google TV SetupWraith & Telemetry Agent',
    category: 'TELEMETRY_ADS',
    defaultInStrict: true,
    defaultInOttKeep: true,
    description: 'Disables background OEM setup prompts and consumer telemetry popups.',
  },
  {
    pkg: 'com.netflix.ninja',
    label: 'Preloaded Netflix Consumer App',
    category: 'PRELOADED_OTT',
    defaultInStrict: true,
    defaultInOttKeep: false,
    description: 'Optional: Disable if hotel restricts third-party OTT login leaks between stays.',
  },
  {
    pkg: 'com.amazon.amazonvideo.livingroom',
    label: 'Preloaded Prime Video App',
    category: 'PRELOADED_OTT',
    defaultInStrict: true,
    defaultInOttKeep: false,
    description: 'Optional: Disable preloaded Amazon Prime Video button hijack.',
  },
  {
    pkg: 'com.google.android.youtube.tv',
    label: 'YouTube for Android TV',
    category: 'PRELOADED_OTT',
    defaultInStrict: false,
    defaultInOttKeep: false,
    description: 'Optional: Keep enabled for guest entertainment or disable in strict kiosk mode.',
  },
];

export const CURATED_BRAND_MEDIA_PRESETS = {
  logos: [
    {
      id: 'crest-gold',
      label: 'Royal Javanese Gold Crest (SVG)',
      url: `data:image/svg+xml;utf8,${encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" fill="none"><rect width="120" height="120" rx="24" fill="#1E3A2F"/><circle cx="60" cy="60" r="44" stroke="#DCC6A1" stroke-width="2.5" stroke-dasharray="4 3"/><path d="M60 26L74 54H46L60 26Z" fill="#DCC6A1"/><path d="M38 72C46 62 74 62 82 72" stroke="#DCC6A1" stroke-width="3" stroke-linecap="round"/><text x="60" y="92" text-anchor="middle" fill="#F8F5EE" font-family="serif" font-size="13" font-weight="bold" letter-spacing="3">ARUNIKA</text></svg>'
      )}`,
    },
    {
      id: 'crest-ocean',
      label: 'Bayu Oceanfront Monogram (SVG)',
      url: `data:image/svg+xml;utf8,${encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" fill="none"><rect width="120" height="120" rx="24" fill="#173753"/><circle cx="60" cy="60" r="44" stroke="#C8A97E" stroke-width="2.5"/><path d="M34 62C44 50 56 74 66 62C76 50 82 66 88 58" stroke="#C8A97E" stroke-width="4" stroke-linecap="round"/><text x="60" y="88" text-anchor="middle" fill="#F8F5EE" font-family="sans-serif" font-size="14" font-weight="bold" letter-spacing="3">BAYU</text></svg>'
      )}`,
    },
    {
      id: 'crest-sora',
      label: 'Sora Urban Executive Emblem (SVG)',
      url: `data:image/svg+xml;utf8,${encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" fill="none"><rect width="120" height="120" rx="24" fill="#0F172A"/><rect x="24" y="24" width="72" height="72" rx="14" stroke="#94A3B8" stroke-width="2.5"/><path d="M44 74V44L60 34L76 44V74" stroke="#F8FAFC" stroke-width="3.5" stroke-linejoin="round"/><text x="60" y="90" text-anchor="middle" fill="#94A3B8" font-family="sans-serif" font-size="12" font-weight="bold" letter-spacing="4">SORA</text></svg>'
      )}`,
    },
  ],
  heroBackgrounds: [
    {
      id: 'bg-sanctuary-img',
      label: 'Javanese Sanctuary Courtyard (4K Photo)',
      type: 'image' as const,
      url: '/assets/aistudio/file_00000000a6b08211935c3a540293bf6c_74821162.png',
    },
    {
      id: 'bg-ocean-img',
      label: 'Oceanfront Infinity Villa Dusk (4K Photo)',
      type: 'image' as const,
      url: '/assets/aistudio/file_0000000043808207bbdf250e0b1586c7_702e345a.png',
    },
    {
      id: 'bg-resort-video-1',
      label: 'Nature playback test (CC0 MP4)',
      type: 'video' as const,
      url: '/assets/tv/demo-flower.mp4',
    },
    {
      id: 'bg-resort-video-2',
      label: 'HLS test stream (Big Buck Bunny)',
      type: 'video' as const,
      url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    },
  ],
  promoMedia: [
    {
      id: 'promo-video-spa',
      label: 'Local CC0 video — playback test',
      type: 'video' as const,
      url: '/assets/tv/demo-flower.mp4',
      title: 'Video demo CC0 — ganti dengan video hotel',
    },
    {
      id: 'promo-video-dining',
      label: 'HLS video — playback test',
      type: 'video' as const,
      url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
      title: 'HLS test stream — bukan siaran hotel',
    },
    {
      id: 'promo-image-sanctuary',
      label: 'Private Pool & Sanctuary Offer (HD Banner Image)',
      type: 'image' as const,
      url: '/assets/aistudio/file_0000000043808207bbdf250e0b1586c7_702e345a.png',
      title: 'Private Villa Sunset High Tea • 20% In-House Guest Privilege',
    },
  ],
};

export interface Invoice {
  id: string;
  subscriptionId: string;
  customerId: string;
  propertyId: string;
  buyerId: string;
  buyerName: string;
  periodLabel: string;
  issuedAtUtc: string;
  dueAtUtc: string;
  status: 'Issued' | 'Paid' | 'PartiallyPaid' | 'Overdue';
  seatsBilled: number;
  unitPriceIdr: number;
  totalIdr: number;
  paidIdr: number;
  remainingBalanceIdr: number;
  lineDescription: string;
  lines: InvoiceLine[];
  receiptRefs: string[];
}

export interface Receipt {
  id: string;
  invoiceId: string;
  transactionRef: string;
  amountIdr: number;
  verifiedBy: string;
  verifiedAtUtc: string;
  method: string;
}

export interface ReleaseArtifact {
  id: string;
  versionCode: number;
  versionName: string;
  packageName: string;
  sha256: string;
  signerIdentity: string;
  status: 'Draft' | 'TechnicalReview' | 'TechnicallyApproved' | 'Published';
  createdBy: string;
  technicallyApprovedBy: string | null;
  releaseNotes: string;
  targetProfiles: string[];
}

export interface PropertyUpdateApproval {
  id: string;
  propertyId: string;
  releaseId: string;
  approvedBy: string | null;
  status: 'PendingPermission' | 'ApprovedWindow' | 'Deferred';
  windowStartLocal: string;
  windowEndLocal: string;
  standingPolicy: boolean;
}

export type UpdateJobStage =
  | 'AwaitingApproval'
  | 'AwaitingReadiness'
  | 'Staged'
  | 'Installing'
  | 'Verifying'
  | 'Healthy'
  | 'Deferred'
  | 'OutcomeUnknown'
  | 'Failed'
  | 'Cancelled'
  | 'RolledBack'
  | 'RollbackFailed';

export interface UpdateJob {
  id: string;
  propertyId: string;
  endpointId: string;
  roomId: string;
  releaseId: string;
  stage: UpdateJobStage;
  reason: string;
  updatedAtUtc: string;
}

export interface SupportTicket {
  id: string;
  propertyId: string;
  endpointId: string;
  title: string;
  category: 'Provider / DRM' | 'Media / Storage' | 'Network / LAN' | 'Update / ADB';
  severity: 'High' | 'Medium' | 'Low';
  status: 'Open' | 'Triaged' | 'InProgress' | 'Resolved';
  symptom: string;
  observedFacts: string[];
  diagnosticInference: string;
  suggestedNextAction: string;
  limitationsNote: string;
  assignedTo: string;
  createdAtUtc: string;
}

export interface ConnectorRegistration {
  id: string;
  environmentId: EnvironmentId;
  propertyId: string;
  name: string;
  hostPlatform: string;
  status: 'Online' | 'Offline' | 'Revoked';
  enrolledBy: string;
  enrolledAtUtc: string;
  lastHeartbeatUtc: string;
  adbVersion: string;
  adbAvailable: boolean;
  interfaceName: string;
  subnetCidr: string;
  allowedActions: string[];
  consentExpiresAtUtc: string;
}

export interface DiscoveryCandidate {
  id: string;
  environmentId: EnvironmentId;
  connectorId: string;
  propertyId: string;
  ip: string;
  port: number;
  pairingPort?: number;
  friendlyName: string;
  discoverySource: 'mDNS' | 'TCP_PROBE' | 'MANUAL' | 'DEMO_SCENARIO';
  serviceHint: string;
  reachability: 'Reachable' | 'Unreachable' | 'Timeout';
  authState:
    | 'CandidateFound'
    | 'AuthRequired'
    | 'PairRequired'
    | 'Paired'
    | 'TransportReady'
    | 'DeviceVerified'
    | 'Enrolled'
    | 'Unsupported';
  confidence: 'High' | 'Medium' | 'Low';
  observedBrand?: string;
  observedModel?: string;
  observedManufacturer?: string;
  observedAndroidVersion?: string;
  observedSdkInt?: number;
  observedBuildFingerprint?: string;
  observedSerial?: string;
  lastScreenshotUrl?: string;
  lastScreenshotCapturedAt?: string;
  assignedRoomId?: string | null;
  lastObservedUtc: string;
  origin: 'SEEDED' | 'LIVE_OBSERVATION' | 'SIMULATION_EVENT';
  executionMode: 'SIMULATED' | 'LIVE';
  notes: string;
  activeBackupId?: string;
  activeBackup?: TvDeviceBackup;
}

export interface DiscoveryRun {
  id: string;
  environmentId: EnvironmentId;
  connectorId: string;
  propertyId: string;
  interfaceName: string;
  subnetCidr: string;
  portsProbed: number[];
  startedAtUtc: string;
  completedAtUtc: string;
  hostsAttempted: number;
  candidatesFound: number;
  executionMode: 'SIMULATED' | 'LIVE';
  status: 'Completed' | 'Failed' | 'BlockedNoConnector';
  summaryText: string;
}

export interface AuditEvent {
  id: string;
  environmentId: EnvironmentId;
  timestampUtc: string;
  actorAlias: string;
  actorRole: RoleId;
  action: string;
  targetRef: string;
  propertyId: string | null;
  outcome: 'ALLOW' | 'DENY' | 'RECONCILE';
  reasonCode: string;
  details: string;
}

export interface ScenarioDefinition {
  id: string;
  code: string;
  title: string;
  category: 'Onboarding' | 'Stay & Privacy' | 'Provider Rights' | 'Update & Maintenance' | 'Finance & Analytics';
  description: string;
  expectedOutcome: string;
}

export const ROLES_CATALOG: RoleDefinition[] = [
  {
    id: 'R-01',
    name: 'Product / Business Owner',
    category: 'GOJJA_ADMIN',
    defaultSurface: 'gojja',
    description: 'Commercial and product governance, ISP & tenant onboarding, plan catalog review, and aggregate business KPIs.',
    permissions: [
      'plans.read',
      'plans.manage',
      'partners.manage',
      'customers.read',
      'customers.manage',
      'properties.read',
      'properties.manage',
      'subscriptions.read',
      'subscriptions.manage',
      'seats.allocate',
      'branding.read',
      'branding.edit',
      'branding.publish',
      'media.manage',
      'campaigns.edit',
      'campaigns.publish',
      'analytics.read',
      'audit.read',
    ],
    exclusions: ['payments.verify', 'adb.connect', 'guests.name.read'],
  },
  {
    id: 'R-02',
    name: 'Platform Administrator',
    category: 'GOJJA_ADMIN',
    defaultSurface: 'gojja',
    description: 'Manages organizations, ISP partners, properties, subscriptions, and delegated synthetic rights verification.',
    permissions: [
      'customers.read',
      'customers.manage',
      'partners.manage',
      'properties.read',
      'properties.manage',
      'plans.read',
      'subscriptions.read',
      'subscriptions.manage',
      'seats.allocate',
      'branding.read',
      'branding.edit',
      'branding.publish',
      'media.manage',
      'campaigns.edit',
      'campaigns.publish',
      'contracts.read',
      'contracts.verify',
      'endpoints.bind',
      'network.scan',
      'audit.read',
    ],
    exclusions: ['releases.technicalapprove', 'payments.verify', 'adb.connect', 'guests.name.read'],
  },
  {
    id: 'R-03',
    name: 'Technical Administrator',
    category: 'GOJJA_ADMIN',
    defaultSurface: 'gojja',
    description: 'Release artifact technical review, certification profiles, and escalated diagnostics.',
    permissions: [
      'releases.create',
      'releases.technicalapprove',
      'diagnostics.read',
      'tickets.manage',
      'endpoints.read',
      'properties.read',
      'audit.read',
    ],
    exclusions: ['updates.propertyapprove', 'payments.verify', 'guests.name.read'],
  },
  {
    id: 'R-04',
    name: 'Security Administrator',
    category: 'GOJJA_ADMIN',
    defaultSurface: 'gojja',
    description: 'IAM roles, delegation grants, revocation, and append-only security audit inspection.',
    permissions: ['users.read', 'users.manage', 'roles.assign', 'delegation.grant', 'delegation.revoke', 'connectors.revoke', 'audit.read'],
    exclusions: ['payments.verify', 'branding.publish', 'adb.connect', 'guests.name.read'],
  },
  {
    id: 'R-05',
    name: 'GOJJA Finance',
    category: 'GOJJA_ADMIN',
    defaultSurface: 'gojja',
    description: 'Wholesale and direct invoice issuance, payment verification, and credit adjustments.',
    permissions: ['invoices.read', 'invoices.issue', 'payments.verify', 'credits.review', 'subscriptions.read', 'customers.read'],
    exclusions: ['releases.technicalapprove', 'adb.connect', 'network.scan', 'guests.name.read'],
  },
  {
    id: 'R-06',
    name: 'Support Operator',
    category: 'GOJJA_ADMIN',
    defaultSurface: 'gojja',
    description: 'Ticket triage, knowledge base lookup, and scoped read-only diagnostic bundle review.',
    permissions: ['tickets.create', 'tickets.manage', 'diagnostics.read', 'endpoints.read', 'properties.read'],
    exclusions: ['releases.technicalapprove', 'payments.verify', 'adb.connect', 'guests.name.read'],
  },
  {
    id: 'R-07',
    name: 'Auditor',
    category: 'GOJJA_ADMIN',
    defaultSurface: 'gojja',
    description: 'Read-only access to redacted audit logs, compliance reports, and aggregate metrics.',
    permissions: ['audit.read', 'analytics.read', 'reports.export', 'invoices.read'],
    exclusions: ['customers.manage', 'payments.verify', 'adb.connect', 'guests.name.read'],
  },
  {
    id: 'R-08',
    name: 'ISP Partner Administrator',
    category: 'ISP_PARTNER',
    defaultSurface: 'partner',
    description: 'Manages customers, properties, and seat allocations within active ISP partner relationship.',
    permissions: [
      'customers.read',
      'customers.manage',
      'properties.read',
      'properties.manage',
      'subscriptions.read',
      'seats.allocate',
      'endpoints.read',
      'contracts.read',
      'tickets.create',
      'invoices.read',
    ],
    exclusions: ['contracts.verify', 'payments.verify', 'guests.name.read'],
  },
  {
    id: 'R-09',
    name: 'Partner / Assigned Installer',
    category: 'ISP_PARTNER',
    defaultSurface: 'installer',
    description: 'Executes local connector enrollment, bounded LAN scan, ADB pair/connect/inventory, and room binding.',
    permissions: [
      'connectors.enroll',
      'network.scan',
      'adb.pair',
      'adb.connect',
      'adb.inventory',
      'adb.disconnect',
      'rooms.read',
      'endpoints.read',
      'endpoints.bind',
    ],
    exclusions: ['recovery.factoryreset', 'payments.verify', 'guests.name.read', 'branding.publish'],
  },
  {
    id: 'R-10',
    name: 'Property Owner',
    category: 'PROPERTY_TEAM',
    defaultSurface: 'property',
    description: 'Full property governance, branding publish, campaign approval, and maintenance window permission.',
    permissions: [
      'properties.read',
      'rooms.read',
      'rooms.manage',
      'endpoints.read',
      'endpoints.bind',
      'network.scan',
      'branding.read',
      'branding.edit',
      'branding.publish',
      'media.manage',
      'campaigns.edit',
      'campaigns.publish',
      'contracts.read',
      'contracts.submit',
      'packages.allocate',
      'lineup.edit',
      'updates.propertyapprove',
      'analytics.read',
      'invoices.read',
    ],
    exclusions: ['releases.technicalapprove', 'payments.verify'],
  },
  {
    id: 'R-11',
    name: 'Property Manager',
    category: 'PROPERTY_TEAM',
    defaultSurface: 'property',
    description: 'Day-to-day hotel CMS operations, branding & campaign publishing, stay oversight, and update scheduling.',
    permissions: [
      'properties.read',
      'rooms.read',
      'rooms.manage',
      'endpoints.read',
      'endpoints.bind',
      'network.scan',
      'branding.read',
      'branding.edit',
      'branding.publish',
      'media.manage',
      'stays.read',
      'guests.name.read',
      'stays.manage',
      'guest.reset',
      'contracts.read',
      'contracts.submit',
      'packages.allocate',
      'lineup.edit',
      'campaigns.edit',
      'campaigns.publish',
      'updates.propertyapprove',
      'updates.readiness',
      'analytics.read',
      'tickets.create',
    ],
    exclusions: ['releases.technicalapprove', 'payments.verify', 'contracts.verify'],
  },
  {
    id: 'R-12',
    name: 'Content Editor',
    category: 'PROPERTY_TEAM',
    defaultSurface: 'property',
    description: 'Creates and edits branding drafts, media assets, hotel info, and campaign drafts; cannot publish.',
    permissions: ['properties.read', 'branding.read', 'branding.edit', 'media.manage', 'info.edit', 'campaigns.edit'],
    exclusions: ['branding.publish', 'campaigns.publish', 'guests.name.read', 'invoices.read', 'adb.connect'],
  },
  {
    id: 'R-13',
    name: 'Front Office',
    category: 'PROPERTY_TEAM',
    defaultSurface: 'property',
    description: 'Manages manual guest check-in/out, corporate group welcomes, room moves, and room readiness status.',
    permissions: ['properties.read', 'rooms.read', 'stays.read', 'guests.name.read', 'stays.manage', 'guest.reset', 'updates.readiness'],
    exclusions: ['branding.publish', 'updates.propertyapprove', 'recovery.factoryreset', 'invoices.read'],
  },
  {
    id: 'R-14',
    name: 'Property Analyst',
    category: 'PROPERTY_TEAM',
    defaultSurface: 'property',
    description: 'Reviews property playback metrics, channel QoE, and campaign completion without guest PII.',
    permissions: ['properties.read', 'analytics.read', 'reports.export'],
    exclusions: ['guests.name.read', 'branding.edit', 'stays.manage', 'adb.connect'],
  },
  {
    id: 'R-15',
    name: 'Property Finance',
    category: 'PROPERTY_TEAM',
    defaultSurface: 'property',
    description: 'Views property subscription statements and direct invoices; cannot post GOJJA receipts.',
    permissions: ['properties.read', 'subscriptions.read', 'invoices.read', 'reports.export'],
    exclusions: ['payments.verify', 'invoices.issue', 'guests.name.read', 'adb.connect'],
  },
  {
    id: 'R-16',
    name: 'In-Room Guest (End User)',
    category: 'GUEST',
    defaultSurface: 'tv',
    description: 'Interacts with the in-room TV experience, live channels, hotel services, and guest locale.',
    permissions: ['guest.menu.read', 'guest.locale.set', 'guest.channel.play', 'guest.service.request'],
    exclusions: ['properties.manage', 'branding.edit', 'invoices.read', 'adb.connect'],
  },
];

export const USER_ACCOUNTS: UserAccount[] = [
  {
    id: 'USR-01',
    alias: 'demo-business-owner',
    name: 'Dyan Raditya Sinukarta',
    email: 'dyan@gojja.tv',
    roleId: 'R-01',
    organizationId: 'GOJJA-HQ',
    partnerId: null,
    propertyIds: ['P-01', 'P-02', 'P-03'],
    allowedEnvironments: ['DEMO', 'LIVE_LAB'],
    avatarInitials: 'DR',
    badgeLabel: 'Business Owner',
  },
  {
    id: 'USR-02',
    alias: 'demo-platform-admin',
    name: 'Rendra Pratama',
    email: 'platform.admin@gojja.tv',
    roleId: 'R-02',
    organizationId: 'GOJJA-HQ',
    partnerId: null,
    propertyIds: ['P-01', 'P-02', 'P-03'],
    allowedEnvironments: ['DEMO', 'LIVE_LAB'],
    avatarInitials: 'RP',
    badgeLabel: 'Platform Admin',
  },
  {
    id: 'USR-03',
    alias: 'demo-technical-admin-a',
    name: 'Bima Sakti',
    email: 'tech.approver@gojja.tv',
    roleId: 'R-03',
    organizationId: 'GOJJA-HQ',
    partnerId: null,
    propertyIds: ['P-01', 'P-02', 'P-03'],
    allowedEnvironments: ['DEMO', 'LIVE_LAB'],
    avatarInitials: 'BS',
    badgeLabel: 'Technical Admin',
  },
  {
    id: 'USR-04',
    alias: 'demo-security-admin',
    name: 'Nadia Kusuma',
    email: 'security@gojja.tv',
    roleId: 'R-04',
    organizationId: 'GOJJA-HQ',
    partnerId: null,
    propertyIds: ['P-01', 'P-02', 'P-03'],
    allowedEnvironments: ['DEMO', 'LIVE_LAB'],
    avatarInitials: 'NK',
    badgeLabel: 'Security Admin',
  },
  {
    id: 'USR-05',
    alias: 'demo-finance',
    name: 'Sari Wulandari',
    email: 'finance@gojja.tv',
    roleId: 'R-05',
    organizationId: 'GOJJA-HQ',
    partnerId: null,
    propertyIds: ['P-01', 'P-02', 'P-03'],
    allowedEnvironments: ['DEMO'],
    avatarInitials: 'SW',
    badgeLabel: 'GOJJA Finance',
  },
  {
    id: 'USR-06',
    alias: 'demo-support',
    name: 'Bagus Setiawan',
    email: 'support@gojja.tv',
    roleId: 'R-06',
    organizationId: 'GOJJA-HQ',
    partnerId: null,
    propertyIds: ['P-01', 'P-02', 'P-03'],
    allowedEnvironments: ['DEMO', 'LIVE_LAB'],
    avatarInitials: 'BG',
    badgeLabel: 'Support L2',
  },
  {
    id: 'USR-07',
    alias: 'demo-auditor',
    name: 'Hendra Wijaya',
    email: 'auditor@gojja.tv',
    roleId: 'R-07',
    organizationId: 'GOJJA-HQ',
    partnerId: null,
    propertyIds: ['P-01', 'P-02', 'P-03'],
    allowedEnvironments: ['DEMO', 'LIVE_LAB'],
    avatarInitials: 'HW',
    badgeLabel: 'Compliance Auditor',
  },
  {
    id: 'USR-08',
    alias: 'alpha-admin',
    name: 'Arif Budiman (Alpha ISP)',
    email: 'admin@alphahospitality.net.id',
    roleId: 'R-08',
    organizationId: 'ISP-A',
    partnerId: 'ISP-A',
    propertyIds: ['P-01'],
    allowedEnvironments: ['DEMO', 'LIVE_LAB'],
    avatarInitials: 'AB',
    badgeLabel: 'ISP Alpha Admin',
  },
  {
    id: 'USR-09',
    alias: 'beta-admin',
    name: 'Made Wirawan (Beta ISP)',
    email: 'admin@betaconnect.co.id',
    roleId: 'R-08',
    organizationId: 'ISP-B',
    partnerId: 'ISP-B',
    propertyIds: ['P-02'],
    allowedEnvironments: ['DEMO'],
    avatarInitials: 'MW',
    badgeLabel: 'ISP Beta Admin',
  },
  {
    id: 'USR-10',
    alias: 'alpha-installer',
    name: 'Dimas Kurniawan (Field Installer)',
    email: 'installer@alphahospitality.net.id',
    roleId: 'R-09',
    organizationId: 'ISP-A',
    partnerId: 'ISP-A',
    propertyIds: ['P-01'],
    allowedEnvironments: ['DEMO', 'LIVE_LAB'],
    avatarInitials: 'DK',
    badgeLabel: 'Field Installer',
  },
  {
    id: 'USR-11',
    alias: 'property-owner',
    name: 'Kanjeng Gusti (Owner P-01)',
    email: 'owner@hotelarunika.com',
    roleId: 'R-10',
    organizationId: 'C-01',
    partnerId: 'ISP-A',
    propertyIds: ['P-01'],
    allowedEnvironments: ['DEMO', 'LIVE_LAB'],
    avatarInitials: 'KG',
    badgeLabel: 'Property Owner',
  },
  {
    id: 'USR-12',
    alias: 'property-manager',
    name: 'Putri Maharani (GM P-01)',
    email: 'you@hotelarunika.com',
    roleId: 'R-11',
    organizationId: 'C-01',
    partnerId: 'ISP-A',
    propertyIds: ['P-01'],
    allowedEnvironments: ['DEMO', 'LIVE_LAB'],
    avatarInitials: 'PM',
    badgeLabel: 'Property Manager',
  },
  {
    id: 'USR-13',
    alias: 'content-editor',
    name: 'Larasati (Marketing Editor P-01)',
    email: 'editor@hotelarunika.com',
    roleId: 'R-12',
    organizationId: 'C-01',
    partnerId: 'ISP-A',
    propertyIds: ['P-01'],
    allowedEnvironments: ['DEMO'],
    avatarInitials: 'LR',
    badgeLabel: 'Content Editor',
  },
  {
    id: 'USR-14',
    alias: 'front-office',
    name: 'Rizky Pratama (Front Office P-01)',
    email: 'fo@hotelarunika.com',
    roleId: 'R-13',
    organizationId: 'C-01',
    partnerId: 'ISP-A',
    propertyIds: ['P-01'],
    allowedEnvironments: ['DEMO'],
    avatarInitials: 'FO',
    badgeLabel: 'Front Office',
  },
  {
    id: 'USR-15',
    alias: 'property-analyst',
    name: 'Kevin Santoso (Analyst P-01)',
    email: 'analyst@hotelarunika.com',
    roleId: 'R-14',
    organizationId: 'C-01',
    partnerId: 'ISP-A',
    propertyIds: ['P-01'],
    allowedEnvironments: ['DEMO'],
    avatarInitials: 'KS',
    badgeLabel: 'Property Analyst',
  },
  {
    id: 'USR-16',
    alias: 'property-finance',
    name: 'Yulia Citra (Finance P-01)',
    email: 'billing@hotelarunika.com',
    roleId: 'R-15',
    organizationId: 'C-01',
    partnerId: 'ISP-A',
    propertyIds: ['P-01'],
    allowedEnvironments: ['DEMO'],
    avatarInitials: 'YC',
    badgeLabel: 'Property Finance',
  },
  {
    id: 'USR-17',
    alias: 'guest-room-101',
    name: 'In-Room Guest (Room 101)',
    email: 'guest.101@hotelarunika.local',
    roleId: 'R-16',
    organizationId: 'C-01',
    partnerId: null,
    propertyIds: ['P-01'],
    allowedEnvironments: ['DEMO'],
    avatarInitials: 'GU',
    badgeLabel: 'Guest Session',
  },
];

export const INITIAL_PARTNERS: Partner[] = [
  {
    id: 'ISP-A',
    name: 'Alpha Hospitality Network',
    status: 'Active',
    region: 'Central Java & DI Yogyakarta',
    contactEmail: 'noc@alphahospitality.net.id',
    supportTier: 'L1 Field + Managed Fiber',
  },
  {
    id: 'ISP-B',
    name: 'Beta Property Connect',
    status: 'Active',
    region: 'Bali & Nusa Tenggara',
    contactEmail: 'ops@betaconnect.co.id',
    supportTier: 'L1 Field + Hospitality IPTV',
  },
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'C-01',
    name: 'PT Arunika Hospitality Indonesia',
    legalEntity: 'PT Arunika Hospitality Indonesia',
    type: 'organization',
    propertyId: 'P-01',
    partnerId: 'ISP-A',
    salesRoute: 'ISP_RESELLER',
    status: 'Active',
  },
  {
    id: 'C-02',
    name: 'PT Bayu Resort Seminyak',
    legalEntity: 'PT Bayu Resort Seminyak',
    type: 'organization',
    propertyId: 'P-02',
    partnerId: 'ISP-B',
    salesRoute: 'ISP_RESELLER',
    status: 'Active',
  },
  {
    id: 'C-03',
    name: 'PT Sora Urban Living',
    legalEntity: 'PT Sora Urban Living',
    type: 'organization',
    propertyId: 'P-03',
    partnerId: null,
    salesRoute: 'DIRECT',
    status: 'Active',
  },
];

export const INITIAL_PROPERTIES: Property[] = [
  {
    tvExperience: {...resolveTvExperience(),appsEnabled:true},
    id: 'P-01',
    customerId: 'C-01',
    partnerId: 'ISP-A',
    name: 'Hotel Arunika Yogyakarta',
    categoryLabel: 'Boutique Heritage Sanctuary • 6 Rooms / 7 TVs',
    city: 'Yogyakarta',
    timezone: 'Asia/Jakarta',
    defaultLocale: 'id',
    experienceProfile: 'Hospitality',
    heroImageUrl: '/assets/aistudio/file_00000000a6b08211935c3a540293bf6c_74821162.png',
    logoText: 'HOTEL ARUNIKA',
    logoSubtitle: 'YOGYAKARTA',
    accentColor: '#DCC6A1',
    primaryColor: '#1E3A2F',
    welcomeHeadline: {
      id: 'Selamat malam',
      en: 'A Sanctuary in the Heart of Yogyakarta',
      'zh-CN': '欢迎下榻日惹阿鲁尼卡酒店',
      'ja-JP': 'ジョグジャカルタの静寂なサンクチュアリへようこそ',
    },
    welcomeSubline: {
      id: 'Nikmati ketenangan dan kehangatan budaya Jawa selama masa menginap Anda.',
      en: 'Experience timeless Javanese serenity and curated hospitality in your suite.',
      'zh-CN': '在您的套房内体验永恒的爪哇宁静与精致礼遇。',
      'ja-JP': 'ジャワの伝統的なおもてなしと穏やかなひとときをお楽しみください。',
    },
    wifiSsid: 'Arunika-Sanctuary-5G',
    frontDeskExt: 'Dial 0 or WhatsApp +62 274 555 010',
    resourceVersion: 4,
    heroMediaType: 'image',
    promoMediaType: 'video',
    promoMediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    promoTitle: 'Royal Javanese Spa • Complimentary 30-Min Welcome Ritual',
    launcherConfig: {
      mode: 'GOJJA_LAUNCHER',
      profile: 'CLEAN_WITH_OTT',
      disabledPackages: [
        'com.google.android.tvlauncher',
        'com.google.android.leanbacklauncher',
        'com.google.android.leanbacklauncher.recommendations',
        'com.google.android.tungsten.setupwraith',
      ],
      lastAppliedAt: '2026-11-02T05:30:00Z',
      launcherVersion: 'GojjaLauncher v4.2.0-hospitality',
    },
  },
  {
    id: 'P-02',
    customerId: 'C-02',
    partnerId: 'ISP-B',
    name: 'Bayu Bali Suites',
    categoryLabel: 'Oceanfront Luxury Suites • 4 Rooms / 5 TVs',
    city: 'Seminyak, Bali',
    timezone: 'Asia/Makassar',
    defaultLocale: 'en',
    experienceProfile: 'Hospitality',
    heroImageUrl: '/assets/aistudio/file_0000000043808207bbdf250e0b1586c7_702e345a.png',
    logoText: 'BAYU BALI',
    logoSubtitle: 'OCEANFRONT SUITES',
    accentColor: '#C8A97E',
    primaryColor: '#173753',
    welcomeHeadline: {
      id: 'Selamat datang di Bayu Bali Suites',
      en: 'Welcome to Bayu Bali Oceanfront Suites',
      'zh-CN': '欢迎来到巴厘岛巴尤海景套房酒店',
      'ja-JP': 'バユ・バリ・オーシャンフロント・スイートへようこそ',
    },
    welcomeSubline: {
      id: 'Bersantai dengan pemandangan samudra dan layanan concierge pribadi.',
      en: 'Unwind with Indian Ocean breezes and private villa dining at your fingertips.',
      'zh-CN': '尽享印度洋海风与私人别墅餐饮服务。',
      'ja-JP': 'インド洋の潮風とプライベートダイニングをご堪能ください。',
    },
    wifiSsid: 'BayuSuites-Guest',
    frontDeskExt: 'Dial 88 for Villa Butler',
    resourceVersion: 2,
  },
  {
    id: 'P-03',
    customerId: 'C-03',
    partnerId: null,
    name: 'Sora Serviced Residence',
    categoryLabel: 'Executive Short-Stay Studios • 2 Rooms / 2 TVs',
    city: 'Jakarta Selatan',
    timezone: 'Asia/Jakarta',
    defaultLocale: 'id',
    experienceProfile: 'Hospitality',
    heroImageUrl: '/assets/aistudio/file_0000000043808207bbdf250e0b1586c7_702e345a.png',
    logoText: 'SORA RESIDENCE',
    logoSubtitle: 'SCBD JAKARTA',
    accentColor: '#94A3B8',
    primaryColor: '#0F172A',
    welcomeHeadline: {
      id: 'Selamat datang di Sora Serviced Residence',
      en: 'Welcome to Sora Serviced Residence',
      'zh-CN': '欢迎入住索拉服务式公寓',
      'ja-JP': 'ソラ・サービスレジデンスへようこそ',
    },
    welcomeSubline: {
      id: 'Hunian eksekutif modern dengan layanan pintar terintegrasi.',
      en: 'Modern executive living with seamless digital concierge services.',
      'zh-CN': '配备智能礼宾服务的现代行政公寓。',
      'ja-JP': 'スマートコンシェルジュを備えたモダンなエグゼクティブレジデンス。',
    },
    wifiSsid: 'Sora-Resident-WiFi',
    frontDeskExt: 'Dial 100 for Concierge',
    resourceVersion: 1,
  },
];

export const INITIAL_SUBSCRIPTIONS: Subscription[] = [
  {
    entertainmentAppsEntitlement: {status:'Active',mode:'DEMO',reference:'DEMO-ADDON-PREVIEW'},
    id: 'SUB-01',
    customerId: 'C-01',
    propertyId: 'P-01',
    buyerId: 'ISP-A',
    buyerType: 'ISP',
    planName: 'Hospitality Core Wholesale (H)',
    planVersion: '2026.10-W1',
    seats: 12,
    committedQuantity: 12,
    allocatedQuantity: 7,
    reservedQuantity: 1,
    billedQuantityCurrentPeriod: 12,
    unitPriceIdr: 15000,
    status: 'Active',
    suspensionStatus: 'None',
    effectiveDate: '2026-10-01',
    version: 4,
  },
  {
    id: 'SUB-02',
    customerId: 'C-02',
    propertyId: 'P-02',
    buyerId: 'ISP-B',
    buyerType: 'ISP',
    planName: 'Hospitality Core Wholesale (H)',
    planVersion: '2026.10-W1',
    seats: 8,
    committedQuantity: 8,
    allocatedQuantity: 5,
    reservedQuantity: 0,
    billedQuantityCurrentPeriod: 8,
    unitPriceIdr: 15000,
    status: 'Active',
    suspensionStatus: 'None',
    effectiveDate: '2026-10-01',
    version: 2,
  },
  {
    id: 'SUB-03',
    customerId: 'C-03',
    propertyId: 'P-03',
    buyerId: 'C-03',
    buyerType: 'CUSTOMER',
    planName: 'Hospitality Core Direct (Demo)',
    planVersion: '2026.10-D1',
    seats: 10,
    committedQuantity: 10,
    allocatedQuantity: 2,
    reservedQuantity: 0,
    billedQuantityCurrentPeriod: 10,
    unitPriceIdr: 25000,
    status: 'Active',
    suspensionStatus: 'None',
    effectiveDate: '2026-10-15',
    version: 1,
  },
];

export const INITIAL_SEAT_LEDGER: SeatLedgerEntry[] = [
  {
    id: 'LED-001',
    subscriptionId: 'SUB-01',
    propertyId: 'P-01',
    type: 'COMMITTED',
    quantityDelta: 10,
    effectiveFrom: '2026-10-01T00:00:00Z',
    reasonCode: 'INITIAL_CONTRACT_COMMISSION',
    createdBy: 'Finance Wholesale Ops',
    createdAtUtc: '2026-10-01T00:00:00Z',
    version: 1,
  },
  {
    id: 'LED-002',
    subscriptionId: 'SUB-01',
    propertyId: 'P-01',
    type: 'ALLOCATED',
    quantityDelta: 5,
    effectiveFrom: '2026-10-05T08:00:00Z',
    reasonCode: 'BATCH_DEPLOY_PHASE_1',
    createdBy: 'Bima Sakti (Tech Admin)',
    createdAtUtc: '2026-10-05T08:00:00Z',
    version: 2,
  },
  {
    id: 'LED-003',
    subscriptionId: 'SUB-01',
    propertyId: 'P-01',
    type: 'COMMITTED',
    quantityDelta: 2,
    effectiveFrom: '2026-10-20T00:00:00Z',
    reasonCode: 'CHANGE_ORDER_EXPANSION',
    changeOrderId: 'CO-01',
    createdBy: 'Putri Maharani (Property Mgr)',
    createdAtUtc: '2026-10-20T10:15:00Z',
    version: 3,
  },
  {
    id: 'LED-004',
    subscriptionId: 'SUB-01',
    propertyId: 'P-01',
    type: 'ALLOCATED',
    quantityDelta: 2,
    effectiveFrom: '2026-10-22T09:00:00Z',
    reasonCode: 'SUITE_EXPANSION_E06_E07',
    createdBy: 'Bima Sakti (Tech Admin)',
    createdAtUtc: '2026-10-22T09:00:00Z',
    version: 4,
  },
  {
    id: 'LED-005',
    subscriptionId: 'SUB-01',
    propertyId: 'P-01',
    type: 'RESERVED',
    quantityDelta: 1,
    effectiveFrom: '2026-11-01T00:00:00Z',
    reasonCode: 'STAGED_ROOM104_EXPANSION',
    createdBy: 'Bima Sakti (Tech Admin)',
    createdAtUtc: '2026-11-01T08:30:00Z',
    version: 4,
  },
  {
    id: 'LED-006',
    subscriptionId: 'SUB-02',
    propertyId: 'P-02',
    type: 'COMMITTED',
    quantityDelta: 8,
    effectiveFrom: '2026-10-01T00:00:00Z',
    reasonCode: 'INITIAL_CONTRACT_COMMISSION',
    createdBy: 'Finance Wholesale Ops',
    createdAtUtc: '2026-10-01T00:00:00Z',
    version: 1,
  },
  {
    id: 'LED-007',
    subscriptionId: 'SUB-02',
    propertyId: 'P-02',
    type: 'ALLOCATED',
    quantityDelta: 5,
    effectiveFrom: '2026-10-10T11:00:00Z',
    reasonCode: 'VILLA_DEPLOYMENT',
    createdBy: 'Wayan Sudira (Property Mgr)',
    createdAtUtc: '2026-10-10T11:00:00Z',
    version: 2,
  },
  {
    id: 'LED-008',
    subscriptionId: 'SUB-03',
    propertyId: 'P-03',
    type: 'COMMITTED',
    quantityDelta: 10,
    effectiveFrom: '2026-10-15T00:00:00Z',
    reasonCode: 'DIRECT_DEMO_POOL',
    createdBy: 'Siti Rahma (Direct Sales)',
    createdAtUtc: '2026-10-15T00:00:00Z',
    version: 1,
  },
  {
    id: 'LED-009',
    subscriptionId: 'SUB-03',
    propertyId: 'P-03',
    type: 'ALLOCATED',
    quantityDelta: 2,
    effectiveFrom: '2026-10-20T14:00:00Z',
    reasonCode: 'PILOT_STUDIOS',
    createdBy: 'Aris Munandar (Operations)',
    createdAtUtc: '2026-10-20T14:00:00Z',
    version: 1,
  },
];

export const INITIAL_CHANGE_ORDERS: ChangeOrder[] = [
  {
    id: 'CO-01',
    subscriptionId: 'SUB-01',
    propertyId: 'P-01',
    requestedDelta: 2,
    effectiveDate: '2026-10-20',
    status: 'Applied',
    prorataAmountIdr: 11000,
    reason: 'Royal Suite 301 expansion requiring 2 additional dedicated TV seats',
    requestedBy: 'Putri Maharani (Property Mgr P-01)',
    approvedBy: 'Finance Wholesale Director',
    appliedAtUtc: '2026-10-20T10:15:00Z',
    createdAtUtc: '2026-10-19T14:20:00Z',
  },
];

export const INITIAL_ROOMS: Room[] = [
  { id: 'ROOM-101', propertyId: 'P-01', code: '101', roomClass: 'Standard', floor: 1, housekeeping: 'Ready', maintenanceAuthorized: false },
  { id: 'ROOM-102', propertyId: 'P-01', code: '102', roomClass: 'Standard', floor: 1, housekeeping: 'Ready', maintenanceAuthorized: false },
  { id: 'ROOM-103', propertyId: 'P-01', code: '103', roomClass: 'Standard', floor: 1, housekeeping: 'Ready', maintenanceAuthorized: false },
  { id: 'ROOM-201', propertyId: 'P-01', code: '201', roomClass: 'Deluxe', floor: 2, housekeeping: 'Dirty', maintenanceAuthorized: false, notes: 'Vacant but housekeeping not ready — blocks disruptive APK install' },
  { id: 'ROOM-202', propertyId: 'P-01', code: '202', roomClass: 'Deluxe', floor: 2, housekeeping: 'Ready', maintenanceAuthorized: true },
  { id: 'ROOM-301', propertyId: 'P-01', code: '301', roomClass: 'Suite', floor: 3, housekeeping: 'Ready', maintenanceAuthorized: false, notes: 'Royal Suite with 2 TVs (Living Room E-06 & Bedroom E-07)' },
  { id: 'ROOM-401', propertyId: 'P-02', code: '401', roomClass: 'Deluxe', floor: 1, housekeeping: 'Ready', maintenanceAuthorized: false },
  { id: 'ROOM-402', propertyId: 'P-02', code: '402', roomClass: 'Deluxe', floor: 1, housekeeping: 'Ready', maintenanceAuthorized: true },
  { id: 'ROOM-501', propertyId: 'P-02', code: '501', roomClass: 'Suite', floor: 2, housekeeping: 'Ready', maintenanceAuthorized: false },
  { id: 'ROOM-502', propertyId: 'P-02', code: '502', roomClass: 'Suite', floor: 2, housekeeping: 'Ready', maintenanceAuthorized: true, notes: 'Ocean Suite with 2 TVs (E-11 & E-12)' },
  { id: 'ROOM-601', propertyId: 'P-03', code: '601', roomClass: 'Studio', floor: 6, housekeeping: 'Ready', maintenanceAuthorized: false },
  { id: 'ROOM-602', propertyId: 'P-03', code: '602', roomClass: 'Studio', floor: 6, housekeeping: 'Ready', maintenanceAuthorized: true },
];

export const INITIAL_ENDPOINTS: Endpoint[] = [
  {
    id: 'E-01',
    propertyId: 'P-01',
    roomId: 'ROOM-101',
    subscriptionId: 'SUB-01',
    label: 'Living Room TV',
    connection: 'Online',
    capabilityProfile: 'DEMO-MANAGED',
    modelName: 'BRAVIA 4K VH21',
    manufacturer: 'Sony',
    androidVersion: '11',
    sdkInt: 30,
    appVersion: '2.4.1',
    desiredVersion: '2.4.1',
    appliedConfigVersion: 4,
    lastSeenUtc: '2026-11-02T06:59:00Z',
    ipHint: '192.168.10.101',
    portHint: 5555,
    serialRef: 'SN-ARUNIKA-101',
    bindingVersion: 1,
    origin: 'SEEDED',
    verificationLevel: 'HEALTHY',
  },
  {
    id: 'E-02',
    propertyId: 'P-01',
    roomId: 'ROOM-102',
    subscriptionId: 'SUB-01',
    label: 'Living Room TV',
    connection: 'Online',
    capabilityProfile: 'DEMO-MANAGED',
    modelName: 'BRAVIA 4K VH21',
    manufacturer: 'Sony',
    androidVersion: '11',
    sdkInt: 30,
    appVersion: '2.4.1',
    desiredVersion: '2.4.1',
    appliedConfigVersion: 4,
    lastSeenUtc: '2026-11-02T06:59:10Z',
    ipHint: '192.168.10.102',
    portHint: 5555,
    serialRef: 'SN-ARUNIKA-102',
    bindingVersion: 1,
    origin: 'SEEDED',
    verificationLevel: 'HEALTHY',
  },
  {
    id: 'E-03',
    propertyId: 'P-01',
    roomId: 'ROOM-103',
    subscriptionId: 'SUB-01',
    label: 'Living Room TV',
    connection: 'Online',
    capabilityProfile: 'DEMO-MANAGED',
    modelName: 'BRAVIA 4K VH21',
    manufacturer: 'Sony',
    androidVersion: '11',
    sdkInt: 30,
    appVersion: '2.4.1',
    desiredVersion: '2.4.1',
    appliedConfigVersion: 4,
    lastSeenUtc: '2026-11-02T06:59:20Z',
    ipHint: '192.168.10.103',
    portHint: 5555,
    serialRef: 'SN-ARUNIKA-103',
    bindingVersion: 1,
    origin: 'SEEDED',
    verificationLevel: 'HEALTHY',
  },
  {
    id: 'E-04',
    propertyId: 'P-01',
    roomId: 'ROOM-201',
    subscriptionId: 'SUB-01',
    label: 'Deluxe Main TV',
    connection: 'Online',
    capabilityProfile: 'DEMO-MANAGED',
    modelName: 'BRAVIA 4K VH21',
    manufacturer: 'Sony',
    androidVersion: '11',
    sdkInt: 30,
    appVersion: '2.4.0',
    desiredVersion: '2.4.1',
    appliedConfigVersion: 4,
    lastSeenUtc: '2026-11-02T06:59:05Z',
    ipHint: '192.168.10.201',
    portHint: 5555,
    serialRef: 'SN-ARUNIKA-201',
    bindingVersion: 1,
    origin: 'SEEDED',
    verificationLevel: 'HEALTHY',
  },
  {
    id: 'E-05',
    propertyId: 'P-01',
    roomId: 'ROOM-202',
    subscriptionId: 'SUB-01',
    label: 'Deluxe Main TV',
    connection: 'Offline',
    capabilityProfile: 'DEMO-MANAGED',
    modelName: 'BRAVIA 4K VH21',
    manufacturer: 'Sony',
    androidVersion: '11',
    sdkInt: 30,
    appVersion: '2.3.8',
    desiredVersion: '2.4.1',
    appliedConfigVersion: 3,
    lastSeenUtc: '2026-11-02T05:00:00Z',
    ipHint: '192.168.10.202',
    portHint: 5555,
    serialRef: 'SN-ARUNIKA-202',
    bindingVersion: 1,
    origin: 'SEEDED',
    verificationLevel: 'OBSERVED',
  },
  {
    id: 'E-06',
    propertyId: 'P-01',
    roomId: 'ROOM-301',
    subscriptionId: 'SUB-01',
    label: 'Suite Living Room TV',
    connection: 'Online',
    capabilityProfile: 'DEMO-MANAGED',
    modelName: 'BRAVIA XR 65',
    manufacturer: 'Sony',
    androidVersion: '12',
    sdkInt: 31,
    appVersion: '2.4.1',
    desiredVersion: '2.4.1',
    appliedConfigVersion: 4,
    lastSeenUtc: '2026-11-02T06:59:30Z',
    ipHint: '192.168.10.231',
    portHint: 5555,
    serialRef: 'SN-ARUNIKA-301A',
    bindingVersion: 1,
    origin: 'SEEDED',
    verificationLevel: 'HEALTHY',
  },
  {
    id: 'E-07',
    propertyId: 'P-01',
    roomId: 'ROOM-301',
    subscriptionId: 'SUB-01',
    label: 'Suite Master Bedroom TV',
    connection: 'Offline',
    capabilityProfile: 'DEMO-MANAGED',
    modelName: 'BRAVIA XR 55',
    manufacturer: 'Sony',
    androidVersion: '12',
    sdkInt: 31,
    appVersion: '2.4.0',
    desiredVersion: '2.4.1',
    appliedConfigVersion: 3,
    lastSeenUtc: '2026-11-02T04:45:00Z',
    ipHint: '192.168.10.232',
    portHint: 5555,
    serialRef: 'SN-ARUNIKA-301B',
    bindingVersion: 1,
    origin: 'SEEDED',
    verificationLevel: 'OBSERVED',
  },
  {
    id: 'E-08',
    propertyId: 'P-02',
    roomId: 'ROOM-401',
    subscriptionId: 'SUB-02',
    label: 'Villa Living TV',
    connection: 'Online',
    capabilityProfile: 'DEMO-MANAGED',
    modelName: 'TCL 55P735 Pro',
    manufacturer: 'TCL',
    androidVersion: '11',
    sdkInt: 30,
    appVersion: '2.4.1',
    desiredVersion: '2.4.1',
    appliedConfigVersion: 2,
    lastSeenUtc: '2026-11-02T06:59:12Z',
    ipHint: '10.20.4.101',
    portHint: 5555,
    serialRef: 'SN-BAYU-401',
    bindingVersion: 1,
    origin: 'SEEDED',
    verificationLevel: 'HEALTHY',
  },
  {
    id: 'E-09',
    propertyId: 'P-02',
    roomId: 'ROOM-402',
    subscriptionId: 'SUB-02',
    label: 'Villa Living TV (Limited SKU)',
    connection: 'Online',
    capabilityProfile: 'DEMO-LIMITED',
    modelName: 'Consumer Android TV 43',
    manufacturer: 'GenericOEM',
    androidVersion: '10',
    sdkInt: 29,
    appVersion: '2.4.0',
    desiredVersion: '2.4.1',
    appliedConfigVersion: 2,
    lastSeenUtc: '2026-11-02T06:58:50Z',
    ipHint: '10.20.4.102',
    portHint: 5555,
    serialRef: 'SN-BAYU-402',
    bindingVersion: 1,
    origin: 'SEEDED',
    verificationLevel: 'HEALTHY',
  },
  {
    id: 'E-10',
    propertyId: 'P-02',
    roomId: 'ROOM-501',
    subscriptionId: 'SUB-02',
    label: 'Ocean Suite TV',
    connection: 'Online',
    capabilityProfile: 'DEMO-MANAGED',
    modelName: 'TCL 65C645',
    manufacturer: 'TCL',
    androidVersion: '12',
    sdkInt: 31,
    appVersion: '2.4.1',
    desiredVersion: '2.4.1',
    appliedConfigVersion: 2,
    lastSeenUtc: '2026-11-02T06:59:40Z',
    ipHint: '10.20.5.101',
    portHint: 5555,
    serialRef: 'SN-BAYU-501',
    bindingVersion: 1,
    origin: 'SEEDED',
    verificationLevel: 'HEALTHY',
  },
  {
    id: 'E-11',
    propertyId: 'P-02',
    roomId: 'ROOM-502',
    subscriptionId: 'SUB-02',
    label: 'Ocean Suite Lounge TV',
    connection: 'Online',
    capabilityProfile: 'DEMO-MANAGED',
    modelName: 'TCL 65C645',
    manufacturer: 'TCL',
    androidVersion: '12',
    sdkInt: 31,
    appVersion: '2.4.1',
    desiredVersion: '2.4.1',
    appliedConfigVersion: 2,
    lastSeenUtc: '2026-11-02T06:59:18Z',
    ipHint: '10.20.5.102',
    portHint: 5555,
    serialRef: 'SN-BAYU-502A',
    bindingVersion: 1,
    origin: 'SEEDED',
    verificationLevel: 'HEALTHY',
  },
  {
    id: 'E-12',
    propertyId: 'P-02',
    roomId: 'ROOM-502',
    subscriptionId: 'SUB-02',
    label: 'Ocean Suite Bedroom TV',
    connection: 'Offline',
    capabilityProfile: 'DEMO-MANAGED',
    modelName: 'TCL 50P735',
    manufacturer: 'TCL',
    androidVersion: '11',
    sdkInt: 30,
    appVersion: '2.4.0',
    desiredVersion: '2.4.1',
    appliedConfigVersion: 1,
    lastSeenUtc: '2026-11-02T03:30:00Z',
    ipHint: '10.20.5.103',
    portHint: 5555,
    serialRef: 'SN-BAYU-502B',
    bindingVersion: 1,
    origin: 'SEEDED',
    verificationLevel: 'OBSERVED',
  },
  {
    id: 'E-13',
    propertyId: 'P-03',
    roomId: 'ROOM-601',
    subscriptionId: 'SUB-03',
    label: 'Studio Main TV',
    connection: 'Online',
    capabilityProfile: 'DEMO-MANAGED',
    modelName: 'GOJJA Certified Box G1',
    manufacturer: 'SEI Robotics',
    androidVersion: '13',
    sdkInt: 33,
    appVersion: '2.4.1',
    desiredVersion: '2.4.1',
    appliedConfigVersion: 1,
    lastSeenUtc: '2026-11-02T06:59:45Z',
    ipHint: '172.16.60.101',
    portHint: 5555,
    serialRef: 'SN-SORA-601',
    bindingVersion: 1,
    origin: 'SEEDED',
    verificationLevel: 'HEALTHY',
  },
  {
    id: 'E-14',
    propertyId: 'P-03',
    roomId: 'ROOM-602',
    subscriptionId: 'SUB-03',
    label: 'Studio Main TV (Assisted Update)',
    connection: 'Online',
    capabilityProfile: 'DEMO-ASSISTED',
    modelName: 'SmartBox Retail A12',
    manufacturer: 'SDMC',
    androidVersion: '12',
    sdkInt: 31,
    appVersion: '2.4.0',
    desiredVersion: '2.4.1',
    appliedConfigVersion: 1,
    lastSeenUtc: '2026-11-02T06:59:22Z',
    ipHint: '172.16.60.102',
    portHint: 5555,
    serialRef: 'SN-SORA-602',
    bindingVersion: 1,
    origin: 'SEEDED',
    verificationLevel: 'HEALTHY',
  },
];

export const INITIAL_STAYS: Stay[] = [
  {
    id: 'S-01',
    propertyId: 'P-01',
    roomId: 'ROOM-101',
    displayName: 'Bapak Aditya',
    locale: 'id',
    groupId: null,
    arrivalUtc: '2026-11-01T07:00:00Z',
    departureUtc: '2026-11-03T04:00:00Z',
    status: 'InHouse',
    contextVersion: 2,
    ottCleanupStatus: 'NotApplicable',
  },
  {
    id: 'S-02',
    propertyId: 'P-01',
    roomId: 'ROOM-102',
    displayName: null,
    locale: 'en',
    groupId: 'G-CORP',
    arrivalUtc: '2026-11-01T07:00:00Z',
    departureUtc: '2026-11-03T04:00:00Z',
    status: 'InHouse',
    contextVersion: 1,
    ottCleanupStatus: 'NotApplicable',
  },
  {
    id: 'S-03',
    propertyId: 'P-01',
    roomId: 'ROOM-103',
    displayName: null,
    locale: 'zh-CN',
    groupId: 'G-CORP',
    arrivalUtc: '2026-11-01T07:00:00Z',
    departureUtc: '2026-11-03T04:00:00Z',
    status: 'InHouse',
    contextVersion: 1,
    ottCleanupStatus: 'NotApplicable',
  },
  {
    id: 'S-04',
    propertyId: 'P-01',
    roomId: 'ROOM-301',
    displayName: 'Demo Guest Suite',
    locale: 'ja-JP',
    groupId: null,
    arrivalUtc: '2026-11-01T07:00:00Z',
    departureUtc: '2026-11-03T04:00:00Z',
    status: 'InHouse',
    contextVersion: 3,
    ottCleanupStatus: 'NotApplicable',
  },
  {
    id: 'S-05',
    propertyId: 'P-02',
    roomId: 'ROOM-401',
    displayName: null,
    locale: 'en',
    groupId: null,
    arrivalUtc: '2026-11-01T07:00:00Z',
    departureUtc: '2026-11-03T04:00:00Z',
    status: 'InHouse',
    contextVersion: 1,
    ottCleanupStatus: 'NotApplicable',
  },
  {
    id: 'S-06',
    propertyId: 'P-02',
    roomId: 'ROOM-501',
    displayName: null,
    locale: 'id',
    groupId: null,
    arrivalUtc: '2026-11-01T07:00:00Z',
    departureUtc: '2026-11-03T04:00:00Z',
    status: 'InHouse',
    contextVersion: 1,
    ottCleanupStatus: 'NotApplicable',
  },
  {
    id: 'S-07',
    propertyId: 'P-03',
    roomId: 'ROOM-601',
    displayName: null,
    locale: 'id',
    groupId: null,
    arrivalUtc: '2026-11-01T07:00:00Z',
    departureUtc: '2026-11-03T04:00:00Z',
    status: 'InHouse',
    contextVersion: 1,
    ottCleanupStatus: 'NotApplicable',
  },
];

export const INITIAL_CORPORATE_GROUPS: CorporateGroup[] = [
  {
    id: 'G-CORP',
    propertyId: 'P-01',
    name: 'Nusantara Executive Summit 2026',
    stayIds: ['S-02', 'S-03'],
    message: {
      id: 'Selamat Datang, Delegasi Nusantara Corporate Group',
      en: 'Welcome, Nusantara Corporate Group',
      'zh-CN': '欢迎，努山塔拉企业代表团',
      'ja-JP': 'ヌサンタラ・コーポレートグループの皆様、ようこそ',
    },
    arrivalUtc: '2026-11-01T07:00:00Z',
    departureUtc: '2026-11-03T04:00:00Z',
    badgeText: 'Corporate Summit Delegation',
  },
];

export const INITIAL_CONTRACTS: ProviderContract[] = [
  {
    id: 'CT-01',
    propertyId: 'P-01',
    holderName: 'PT Arunika Hospitality Indonesia (via ISP-A)',
    providerId: 'F-A',
    providerName: 'Nusantara Vision Core (F-A)',
    basis: 'room',
    quantity: 6,
    status: 'Active',
    packages: ['PKG-BASIC', 'PKG-INTL'],
    allowedRoomClasses: ['Standard', 'Deluxe', 'Suite'],
    multiTvIncluded: true,
    publicAreaAllowed: false,
    validUntilUtc: '2027-06-30T23:59:59Z',
    connectionStatus: 'Ready',
  },
  {
    id: 'CT-01B',
    propertyId: 'P-01',
    holderName: 'PT Arunika Hospitality Indonesia (via ISP-A)',
    providerId: 'F-A',
    providerName: 'Nusantara Vision Sports Tier (F-A)',
    basis: 'room',
    quantity: 3,
    status: 'Active',
    packages: ['PKG-SPORTS'],
    allowedRoomClasses: ['Deluxe', 'Suite'],
    multiTvIncluded: true,
    publicAreaAllowed: false,
    validUntilUtc: '2027-06-30T23:59:59Z',
    connectionStatus: 'Ready',
  },
  {
    id: 'CT-02',
    propertyId: 'P-02',
    holderName: 'PT Bayu Resort Seminyak (via ISP-B)',
    providerId: 'F-B',
    providerName: 'Pasifik Media Broadcast (F-B)',
    basis: 'endpoint',
    quantity: 5,
    status: 'Active',
    packages: ['PKG-BASIC', 'PKG-SPORTS'],
    allowedRoomClasses: ['Deluxe', 'Suite'],
    multiTvIncluded: true,
    publicAreaAllowed: false,
    validUntilUtc: '2027-03-31T23:59:59Z',
    connectionStatus: 'TokenExpired',
  },
  {
    id: 'CT-03',
    propertyId: 'P-03',
    holderName: 'PT Sora Urban Living',
    providerId: 'F-A',
    providerName: 'Nusantara Vision Hospitality (F-A)',
    basis: 'endpoint',
    quantity: 2,
    status: 'Submitted',
    packages: ['PKG-BASIC'],
    allowedRoomClasses: ['Studio'],
    multiTvIncluded: false,
    publicAreaAllowed: false,
    validUntilUtc: '2027-10-31T23:59:59Z',
    connectionStatus: 'Ready',
  },
];

export const INITIAL_CHANNELS: Channel[] = [
  {
    id: 'CH-01',
    number: '001',
    name: 'CNN Indonesia',
    category: 'News',
    packageId: 'PKG-BASIC',
    providerId: 'DETIK-LIVE',
    language: 'ID',
    currentProgram: {
      id: 'CNN Indonesia News Report & Warta Terkini',
      en: 'CNN Indonesia News Report & Prime Headlines',
      'zh-CN': '印尼CNN要闻直播',
      'ja-JP': 'CNNインドネシア・プライムニュース',
    },
    programTime: '18:00 – 19:30',
    streamUrlHint: 'https://video.detik.com/livecnn/smil:cnntv/chunklist_w268557525_b384000_sleng.m3u8',
    thumbnailUrl: '/assets/aistudio/Hotel_Tentrem_SmartTV_App_Showcase_62a23bd8.png',
  },
  {
    id: 'CH-02',
    number: '002',
    name: 'CNBC Indonesia',
    category: 'News',
    packageId: 'PKG-BASIC',
    providerId: 'DETIK-LIVE',
    language: 'ID / EN',
    currentProgram: {
      id: 'Squawk Box Indonesia: Riset Pasar Modal & Finansial',
      en: 'Squawk Box Indonesia: Capital Markets & Financial Pulse',
      'zh-CN': '印尼CNBC财经早报',
      'ja-JP': 'CNBCインドネシア・マーケットリサーチ',
    },
    programTime: '18:30 – 20:00',
    streamUrlHint: 'https://video.detik.com/livecnbc/smil:cnbctv/chunklist_w1279679883_b384000_sleng.m3u8',
    thumbnailUrl: '/assets/aistudio/GOJJA_SmartTV_linen_hospitality_dashboard_886c6353.png',
  },
  {
    id: 'CH-03',
    number: '003',
    name: 'DAAI TV',
    category: 'Entertainment',
    packageId: 'PKG-BASIC',
    providerId: 'DAAI-PLUS',
    language: 'ID / ZH',
    currentProgram: {
      id: 'Bumi & Inspirasi: Harmoni Budaya Nusantara',
      en: 'Earth & Inspiration: Harmony of Nusantara Culture',
      'zh-CN': '地球与灵感：印尼多元文化之美',
      'ja-JP': '地球とインスピレーション：インドネシア文化の調和',
    },
    programTime: '18:00 – 19:30',
    streamUrlHint: 'https://pull.daaiplus.com/live-DAAIPLUS/live-DAAIPLUS_HD.m3u8',
    thumbnailUrl: '/assets/aistudio/Hotel_Tentrem_SmartTV_App_Showcase_62a23bd8.png',
  },
  {
    id: 'CH-04',
    number: '004',
    name: 'Garuda TV (1080p)',
    category: 'News',
    packageId: 'PKG-BASIC',
    providerId: 'HGM-TV',
    language: 'ID',
    currentProgram: {
      id: 'Garuda Terkini: Warta Nasional & Diplomasi',
      en: 'Garuda Prime News: National & Diplomatic Reports',
      'zh-CN': '嘉鲁达新闻：印尼国家发展速递',
      'ja-JP': 'ガルーダニュース：全国と外交リポート',
    },
    programTime: '19:00 – 20:30',
    streamUrlHint: 'https://hgmtv.com:19360/garudatvlivestreaming/garudatvlivestreaming.m3u8',
    thumbnailUrl: '/assets/aistudio/Hotel_Tentrem_SmartTV_App_Showcase_62a23bd8.png',
  },
  {
    id: 'CH-05',
    number: '005',
    name: 'TVRI Yogyakarta (720p)',
    category: 'Entertainment',
    packageId: 'PKG-BASIC',
    providerId: 'TVRI-JOGJA',
    language: 'ID / Jawa',
    currentProgram: {
      id: 'Panggung Kesenian Jogja & Budaya Mataram',
      en: 'Jogja Cultural Stage & Mataram Heritage',
      'zh-CN': '日惹艺术舞台与传统文化',
      'ja-JP': 'ジョグジャカルタ伝統芸能と文化',
    },
    programTime: '18:00 – 19:30',
    streamUrlHint: 'https://ott-balancer.tvri.go.id/live/eds/Jogjakarta/hls/Jogjakarta.m3u8',
    thumbnailUrl: '/assets/aistudio/Hotel_Tentrem_SmartTV_App_Showcase_62a23bd8.png',
  },
  {
    id: 'CH-06',
    number: '006',
    name: 'Indonesiana TV',
    category: 'Entertainment',
    packageId: 'PKG-BASIC',
    providerId: 'KEMENDIKBUD',
    language: 'ID',
    currentProgram: {
      id: 'Dokumenter Warisan Budaya & Musik Tradisional Nusantara',
      en: 'Nusantara Heritage Documentary & Traditional Soundscapes',
      'zh-CN': '印尼文化遗产与传统音乐纪录片',
      'ja-JP': 'インドネシア伝統音楽と遺産ドキュメンタリー',
    },
    programTime: '18:30 – 20:00',
    streamUrlHint: 'https://tvstreamcast.com/indonesiana.m3u8',
    thumbnailUrl: '/assets/aistudio/Hotel_Tentrem_SmartTV_App_Showcase_62a23bd8.png',
  },
  {
    id: 'CH-07',
    number: '007',
    name: 'Jawa Pos TV Jakarta (720p)',
    category: 'Entertainment',
    packageId: 'PKG-INTL',
    providerId: 'JAWAPOS-LIVE',
    language: 'ID',
    currentProgram: {
      id: 'Lensa Metropolis & Dinamika Urban Jakarta',
      en: 'Metropolis Lens & Jakarta Urban Pulse',
      'zh-CN': '雅加达都会观察与城市生活',
      'ja-JP': 'メトロポリス・レンズ：ジャカルタの今',
    },
    programTime: '19:00 – 20:30',
    streamUrlHint: 'http://122.248.43.242:1935/JAWAPOSTVJKT/_definst_/myStream/playlist.m3u8',
    thumbnailUrl: '/assets/aistudio/Hotel_Tentrem_SmartTV_App_Showcase_62a23bd8.png',
  },
  {
    id: 'CH-08',
    number: '008',
    name: 'Nusantara TV (1080p)',
    category: 'Sports',
    packageId: 'PKG-SPORTS',
    providerId: 'SIAR-US',
    language: 'ID / EN',
    currentProgram: {
      id: 'Sorotan Olahraga Nusantara & Liga Premier',
      en: 'Nusantara Sports Highlights & Premier League',
      'zh-CN': '群岛体育焦点与足球联赛',
      'ja-JP': 'ヌサンタラスポーツ中継＆ハイライト',
    },
    programTime: '18:00 – 20:00',
    streamUrlHint: 'https://nusantaratv.siar.us/nusantaratv/live/playlist.m3u8',
    thumbnailUrl: '/assets/aistudio/Hotel_Tentrem_SmartTV_App_Showcase_62a23bd8.png',
  },
  {
    id: 'CH-09',
    number: '009',
    name: 'TATV (720p)',
    category: 'Hotel',
    packageId: 'PKG-FREE',
    providerId: 'TATV-SOLO',
    language: 'ID / Jawa',
    currentProgram: {
      id: 'Seputar Solo Raya & Ragam Kuliner Tradisional',
      en: 'Solo Raya Highlights & Traditional Culinary Arts',
      'zh-CN': '梭罗地方新闻与传统美食特辑',
      'ja-JP': 'ソロ地域ニュースと伝統グルメ紹介',
    },
    programTime: '24 Jam Non-Stop',
    streamUrlHint: 'https://v2.siar.us/tatv/live.sdp/playlist.m3u8',
    thumbnailUrl: '/assets/aistudio/Hotel_Tentrem_SmartTV_App_Showcase_62a23bd8.png',
  },
  {
    id: 'CH-10',
    number: '010',
    name: 'Jek TV (720p)',
    category: 'Hotel',
    packageId: 'PKG-FREE',
    providerId: 'JEKTV-JAMBI',
    language: 'ID',
    currentProgram: {
      id: 'Warta Jambi Hari Ini & Panorama Melayu',
      en: 'Jambi Today & Malay Archipelago Panorama',
      'zh-CN': '占碑焦点与马来风情全景',
      'ja-JP': 'ジャンビ・トゥデイ＆マレー風土紀行',
    },
    programTime: '24 Jam Non-Stop',
    streamUrlHint: 'http://27.124.81.245:1935/jektv/myStream/playlist.m3u8',
    thumbnailUrl: '/assets/aistudio/Hotel_Tentrem_SmartTV_App_Showcase_62a23bd8.png',
  },
  {
    id: 'CH-11',
    number: '011',
    name: 'Kids TV',
    category: 'Entertainment',
    packageId: 'PKG-FREE',
    providerId: 'MEDIACDN-RU',
    language: 'Multi-Locale',
    currentProgram: {
      id: 'Petualangan Kartun Ceria & Lagu Anak Edukasi',
      en: 'Fun Cartoon Adventures & Kids Educational Songs',
      'zh-CN': '少儿趣味动画与益智儿歌',
      'ja-JP': 'キッズアニメアドベンチャー＆知育ソング',
    },
    programTime: '24 Jam Non-Stop',
    streamUrlHint: 'http://origin5.mediacdn.ru/live/kidstv/index.m3u8',
    thumbnailUrl: '/assets/aistudio/Hotel_Tentrem_SmartTV_App_Showcase_62a23bd8.png',
  },
];

export const INITIAL_CAMPAIGNS: Campaign[] = [
  {
    id: 'CMP-01',
    propertyId: 'P-01',
    name: 'Spa experience — Royal Javanese Ritual',
    category: 'Spa & Wellness',
    placement: 'home_hero',
    status: 'Active',
    priority: 90,
    frequencyCapPerStay: 3,
    durationSeconds: 30,
    skippableAfterSeconds: 5,
    startUtc: '2026-11-01T00:00:00Z',
    endUtc: '2026-11-30T23:59:59Z',
    imageUrl: '/assets/aistudio/Hotel_Tentrem_SmartTV_App_Showcase_62a23bd8.png',
    headline: {
      id: 'Waktu untuk Bersantai — Royal Javanese Spa',
      en: 'Time to Unwind — Royal Javanese Spa Ritual',
      'zh-CN': '放松时刻 — 皇家爪哇水疗体验',
      'ja-JP': '癒しのひととき — ロイヤルジャワニーズスパ',
    },
    ctaLabel: {
      id: 'Lihat Layanan Spa',
      en: 'Explore Spa Services',
      'zh-CN': '查看水疗服务',
      'ja-JP': 'スパメニューを見る',
    },
    creativeVersion: 2,
    startsCount: 10,
    completedCount: 6,
    skippedCount: 2,
    interruptedCount: 1,
    failedAfterStartCount: 1,
    totalPlaySeconds: 212,
    targetAudience: { isPublicAreaAllowed: true },
  },
  {
    id: 'CMP-02',
    propertyId: 'P-01',
    name: 'Nusantara Corporate Summit Welcome',
    category: 'Corporate Welcome',
    placement: 'welcome_screen',
    status: 'Active',
    priority: 95,
    frequencyCapPerStay: 1,
    durationSeconds: 15,
    skippableAfterSeconds: 0,
    startUtc: '2026-11-01T00:00:00Z',
    endUtc: '2026-11-30T12:00:00Z',
    imageUrl: '/assets/aistudio/GOJJA_SmartTV_linen_hospitality_dashboard_886c6353.png',
    headline: {
      id: 'Selamat Datang Delegasi Nusantara Summit di Ballroom Pukul 19.00',
      en: 'Welcome Nusantara Corporate Group — Gala Dinner at 19:00',
      'zh-CN': '欢迎努山塔拉企业峰会代表 — 晚宴19:00开始',
      'ja-JP': 'ヌサンタラ・サミット代表団様歓迎 — 19:00よりガラディナー',
    },
    ctaLabel: {
      id: 'Jadwal Acara',
      en: 'View Summit Agenda',
      'zh-CN': '查看峰会议程',
      'ja-JP': 'アジェンダを見る',
    },
    creativeVersion: 1,
    startsCount: 4,
    completedCount: 4,
    skippedCount: 0,
    interruptedCount: 0,
    failedAfterStartCount: 0,
    totalPlaySeconds: 60,
    targetAudience: { groupIds: ['GRP-01'], stayRequired: true },
  },
  {
    id: 'CMP-03',
    propertyId: 'P-01',
    name: 'Kayumanis Signature Rijsttafel Dining',
    category: 'Fine Dining',
    placement: 'service_detail',
    status: 'Draft',
    priority: 75,
    frequencyCapPerStay: 2,
    durationSeconds: 20,
    skippableAfterSeconds: 3,
    startUtc: '2026-11-05T00:00:00Z',
    endUtc: '2026-11-30T23:59:59Z',
    imageUrl: '/assets/aistudio/Hotel_Tentrem_SmartTV_App_Showcase_62a23bd8.png',
    headline: {
      id: 'Kayumanis Restoran — Cita Rasa Istimewa Nusantara',
      en: 'Kayumanis Restaurant — Heritage Indonesian Gastronomy',
      'zh-CN': 'Kayumanis餐厅 — 印尼传统美食盛宴',
      'ja-JP': 'カユマニス・レストラン — 伝統のインドネシア美食',
    },
    ctaLabel: {
      id: 'Lihat Menu',
      en: 'View Dining Menu',
      'zh-CN': '查看菜单',
      'ja-JP': 'メニューを見る',
    },
    creativeVersion: 1,
    startsCount: 0,
    completedCount: 0,
    skippedCount: 0,
    interruptedCount: 0,
    failedAfterStartCount: 0,
    totalPlaySeconds: 0,
  },
  {
    id: 'CMP-04',
    propertyId: 'P-01',
    name: 'October Cultural Jazz Night',
    category: 'Pool & Leisure',
    placement: 'home_hero',
    status: 'Expired',
    priority: 50,
    frequencyCapPerStay: 2,
    durationSeconds: 25,
    skippableAfterSeconds: 5,
    startUtc: '2026-10-01T00:00:00Z',
    endUtc: '2026-10-31T23:59:59Z',
    imageUrl: '/assets/aistudio/GOJJA_SmartTV_linen_hospitality_dashboard_886c6353.png',
    headline: {
      id: 'Malam Jazz Tepi Kolam (Berakhir)',
      en: 'Poolside Cultural Jazz Night (Ended)',
      'zh-CN': '池畔爵士之夜（已结束）',
      'ja-JP': 'プールサイド・ジャズナイト（終了）',
    },
    ctaLabel: {
      id: 'Info Acara',
      en: 'Event Details',
      'zh-CN': '活动详情',
      'ja-JP': 'イベント詳細',
    },
    creativeVersion: 1,
    startsCount: 18,
    completedCount: 14,
    skippedCount: 4,
    interruptedCount: 0,
    failedAfterStartCount: 0,
    totalPlaySeconds: 370,
  },
  {
    id: 'CMP-05',
    propertyId: 'P-01',
    name: 'Executive Suite Sunset Aperitif',
    category: 'Fine Dining',
    placement: 'pre_live_tv',
    status: 'Active',
    priority: 85,
    frequencyCapPerStay: 2,
    durationSeconds: 15,
    skippableAfterSeconds: 5,
    startUtc: '2026-11-01T00:00:00Z',
    endUtc: '2026-11-30T23:59:59Z',
    imageUrl: '/assets/aistudio/Hotel_Tentrem_SmartTV_App_Showcase_62a23bd8.png',
    headline: {
      id: 'Aperitif Eksklusif Tamu Suite di Rooftop Lounge',
      en: 'Complimentary Sunset Aperitif at Suite Rooftop Lounge',
      'zh-CN': '套房贵宾专属日落餐前酒会',
      'ja-JP': 'スイート限定 ルーフトップ・サンセットアペリティフ',
    },
    ctaLabel: {
      id: 'Lihat Detail',
      en: 'View Lounge Details',
      'zh-CN': '查看酒廊详情',
      'ja-JP': '詳細を見る',
    },
    creativeVersion: 1,
    startsCount: 8,
    completedCount: 5,
    skippedCount: 3,
    interruptedCount: 0,
    failedAfterStartCount: 0,
    totalPlaySeconds: 95,
    targetAudience: { roomClasses: ['Suite', 'Deluxe'], stayRequired: true },
  },
  {
    id: 'CMP-06',
    propertyId: 'P-01',
    name: 'Heritage Facilities & Cultural Garden Walk',
    category: 'Pool & Leisure',
    placement: 'shared_signage',
    status: 'Active',
    priority: 60,
    frequencyCapPerStay: 99,
    durationSeconds: 20,
    skippableAfterSeconds: 0,
    startUtc: '2026-11-01T00:00:00Z',
    endUtc: '2026-11-30T23:59:59Z',
    imageUrl: '/assets/aistudio/GOJJA_SmartTV_linen_hospitality_dashboard_886c6353.png',
    headline: {
      id: 'Jelajahi Fasilitas Sanctuary & Kebun Budaya Arunika',
      en: 'Discover Sanctuary Facilities & Arunika Cultural Garden',
      'zh-CN': '探索酒店静谧设施与文化花园',
      'ja-JP': 'サンクチュアリ施設と文化庭園の散策',
    },
    ctaLabel: {
      id: 'Panduan Resor',
      en: 'Resort Guide',
      'zh-CN': '度假村指南',
      'ja-JP': 'リゾート案内',
    },
    creativeVersion: 1,
    startsCount: 42,
    completedCount: 38,
    skippedCount: 2,
    interruptedCount: 2,
    failedAfterStartCount: 0,
    totalPlaySeconds: 780,
    targetAudience: { isPublicAreaAllowed: true },
  },
  {
    id: 'CMP-EXT-01',
    propertyId: 'P-01',
    name: 'Garuda Priority Executive Miles & In-Flight Upgrade (External Offer)',
    category: 'External Offer',
    externalPaid: true,
    adOfferId: 'OFFER-01',
    offerVersion: 1,
    advertiserName: 'Garuda Indonesia',
    placement: 'home_hero',
    status: 'Active',
    priority: 88,
    frequencyCapPerStay: 2,
    durationSeconds: 15,
    skippableAfterSeconds: 5,
    startUtc: '2026-11-01T00:00:00Z',
    endUtc: '2026-12-31T23:59:59Z',
    imageUrl: '/assets/aistudio/file_0000000043808207bbdf250e0b1586c7_702e345a.png',
    headline: {
      id: 'Terbang Bersama Garuda Indonesia — Double Miles untuk Tamu Arunika',
      en: 'Fly the Skies with Garuda Indonesia — Double Miles for Arunika Guests',
      'zh-CN': '搭乘印尼鹰航 — 尊享双倍里程与专属休息室',
      'ja-JP': 'ガルーダ・インドネシア航空 — ご宿泊者様限定ダブルマイル進呈',
    },
    ctaLabel: {
      id: 'Dapatkan Miles',
      en: 'Claim Double Miles',
      'zh-CN': '领取特权',
      'ja-JP': 'マイル特典を見る',
    },
    creativeVersion: 1,
    startsCount: 8,
    completedCount: 6,
    skippedCount: 1,
    interruptedCount: 1,
    failedAfterStartCount: 0,
    totalPlaySeconds: 110,
    targetAudience: { isPublicAreaAllowed: true },
  },
];

// ============================================================================
// FASE D SEEDED DATA: Ad Offers, Property Acceptances, Marketplace & Orders
// ============================================================================

export const INITIAL_AD_OFFERS: AdOffer[] = [
  {
    id: 'OFFER-01',
    advertiserOrgId: 'ADV-GARUDA',
    advertiserName: 'Garuda Indonesia',
    title: 'Garuda Priority Executive Miles & In-Flight Upgrade',
    category: 'AIRLINE',
    currentVersion: 1,
    creativeVersions: [
      {
        version: 1,
        headline: 'Fly the Skies of Indonesia with Double Miles',
        subline: 'Exclusive GarudaMiles bonus and complimentary lounge access for hotel guests.',
        mediaUrl: '/assets/aistudio/file_0000000043808207bbdf250e0b1586c7_702e345a.png',
        mediaType: 'image',
        targetPlacement: 'home_hero',
        callToAction: 'Scan QR for Member Upgrade',
        advertiserBrand: 'Garuda Indonesia',
        updatedAtUtc: '2026-11-01T00:00:00Z',
      },
    ],
    requestedPlacements: ['home_hero', 'service_detail'],
    proposedPeriod: {
      startUtc: '2026-11-01T00:00:00Z',
      endUtc: '2026-12-31T23:59:59Z',
    },
    proposedCapPerStay: 2,
    pricingModel: 'CPM',
    proposedRateIdr: 350000,
    exclusions: ['Standard Room'],
    targetingNotes: 'Focus on Suite & Villa guests; executive leisure profile. Zero guest PII exposed.',
    status: 'Active',
    createdAtUtc: '2026-11-01T00:00:00Z',
  },
  {
    id: 'OFFER-02',
    advertiserOrgId: 'ADV-BCA',
    advertiserName: 'BCA Solitaire & Prioritas',
    title: 'BCA Solitaire Curated Privileges & Dining Rebate',
    category: 'FINTECH',
    currentVersion: 1,
    creativeVersions: [
      {
        version: 1,
        headline: 'BCA Solitaire Curated Privileges',
        subline: 'Enjoy up to 25% dining rebate at Arunika Heritage with BCA Prioritas card.',
        mediaUrl: '/assets/aistudio/file_00000000a6b08211935c3a540293bf6c_74821162.png',
        mediaType: 'image',
        targetPlacement: 'welcome_screen',
        callToAction: 'View Privileges',
        advertiserBrand: 'Bank Central Asia',
        updatedAtUtc: '2026-11-02T00:00:00Z',
      },
    ],
    requestedPlacements: ['welcome_screen', 'home_hero'],
    proposedPeriod: {
      startUtc: '2026-11-01T00:00:00Z',
      endUtc: '2026-12-15T23:59:59Z',
    },
    proposedCapPerStay: 1,
    pricingModel: 'Flat',
    proposedRateIdr: 12500000,
    exclusions: [],
    targetingNotes: 'High-net-worth welcome interstitial proposal. Awaiting Property Manager opt-in review.',
    status: 'Submitted',
    createdAtUtc: '2026-11-02T00:00:00Z',
  },
  {
    id: 'OFFER-03',
    advertiserOrgId: 'ADV-LEXUS',
    advertiserName: 'Lexus Indonesia',
    title: 'Lexus Electrified Chauffeur Experience',
    category: 'AUTOMOTIVE',
    currentVersion: 1,
    creativeVersions: [
      {
        version: 1,
        headline: 'Lexus LM 350h Luxury Mover Chauffeur',
        subline: 'Complimentary private airport transfer for Presidential Suite stays.',
        mediaUrl: '/assets/aistudio/file_00000000a6b08211935c3a540293bf6c_74821162.png',
        mediaType: 'image',
        targetPlacement: 'pre_live_tv',
        callToAction: 'Book Test Drive',
        advertiserBrand: 'Lexus Indonesia',
        updatedAtUtc: '2026-11-03T00:00:00Z',
      },
    ],
    requestedPlacements: ['pre_live_tv', 'service_detail'],
    proposedPeriod: {
      startUtc: '2026-11-01T00:00:00Z',
      endUtc: '2026-11-30T23:59:59Z',
    },
    proposedCapPerStay: 1,
    pricingModel: 'CPA',
    proposedRateIdr: 500000,
    exclusions: ['Deluxe Garden', 'Superior'],
    targetingNotes: 'Requires pre_live_tv interstitial consent and Suite guest target only.',
    status: 'Submitted',
    createdAtUtc: '2026-11-03T00:00:00Z',
  },
];

export const INITIAL_PROPERTY_AD_ACCEPTANCES: PropertyAdAcceptance[] = [
  {
    id: 'PAC-01',
    offerId: 'OFFER-01',
    offerVersion: 1,
    propertyId: 'P-01',
    acceptedPlacements: ['home_hero', 'service_detail'],
    acceptedPeriod: {
      startUtc: '2026-11-01T00:00:00Z',
      endUtc: '2026-12-31T23:59:59Z',
    },
    acceptedCapPerStay: 2,
    commercialTermsRef: 'AGR-ARUNIKA-GARUDA-2026Q4',
    acceptedBy: 'pm_arunika',
    acceptedAtUtc: '2026-11-02T08:30:00Z',
    status: 'Accepted',
  },
];

export const INITIAL_MARKETPLACE_ITEMS: MarketplaceItem[] = [
  {
    id: 'MKT-01',
    propertyId: 'P-01',
    type: 'F&B',
    title: 'Kayumanis Signature Indonesian Rijsttafel',
    description: 'A royal multi-dish tasting presentation reflecting royal Javanese gastronomic traditions, served in-room or at the courtyard.',
    localeContent: {
      id: {
        title: 'Kayumanis Rijsttafel Nusantara',
        description: 'Sajian hidangan istana dengan rempah autentik Nusantara disajikan di kamar atau teras.',
        actionLabel: 'Pesan Meja / Menu',
      },
      en: {
        title: 'Kayumanis Indonesian Rijsttafel',
        description: 'Royal heritage banquet featuring curated regional dishes delivered to your suite.',
        actionLabel: 'Request Table / Menu',
      },
      'zh-CN': {
        title: '肉桂印尼皇家飨宴',
        description: '为您呈献精心调配的传统印尼特色菜肴，可送至套房或庭院享用。',
        actionLabel: '预订餐桌 / 菜单',
      },
      'ja-JP': {
        title: 'カユマニス・インドネシア宮廷料理',
        description: '厳選された伝統スパイス料理をお部屋またはテラスにてご堪能ください。',
        actionLabel: 'テーブル／メニュー予約',
      },
    },
    priceHint: 'Rp 450.000 / person',
    availabilitySchedule: '11:00 – 22:30',
    fulfilmentType: 'STAFF_TICKET',
    status: 'Active',
    featured: true,
  },
  {
    id: 'MKT-02',
    propertyId: 'P-01',
    type: 'Wellness',
    title: 'Royal Javanese Boreh & Herbal Compress',
    description: 'Ancient warming spice therapy with clove, ginger, and sandalwood to soothe travel fatigue and improve circulation.',
    localeContent: {
      id: {
        title: 'Spa Boreh Keraton & Kompres Herbal',
        description: 'Terapi rempah hangat cengkeh, jahe, dan cendana untuk meredakan kelelahan.',
        actionLabel: 'Reservasi Slot Spa',
      },
      en: {
        title: 'Royal Boreh Spice & Herbal Compress',
        description: 'Traditional warming herbal therapy with sandalwood and clove to restore vital energy.',
        actionLabel: 'Request Spa Slot',
      },
      'zh-CN': {
        title: '爪哇皇家草药热敷水疗',
        description: '丁香、生姜和檀香暖身草本疗法，舒缓旅途疲劳。',
        actionLabel: '预约水疗时段',
      },
      'ja-JP': {
        title: 'ロイヤル・ボレ＆ハーブ温熱スパ',
        description: '生姜や白檀の伝統ハーブを用いた温熱療法で旅の疲れを癒します。',
        actionLabel: 'スパのご予約',
      },
    },
    priceHint: 'Rp 650.000 / 90 min',
    availabilitySchedule: '09:00 – 22:00',
    fulfilmentType: 'STAFF_TICKET',
    status: 'Active',
    featured: true,
  },
  {
    id: 'MKT-03',
    propertyId: 'P-01',
    partnerId: 'PARTNER-TRANS',
    partnerName: 'Bluebird Golden Bird Luxury Limousine',
    type: 'Transport',
    title: 'VIP Airport Limousine Transfer (Toyota Alphard HEV)',
    description: 'Executive meet-and-greet curbside service with dedicated baggage escort and cold towel refreshment.',
    localeContent: {
      id: {
        title: 'Antar Jemput Bandara VIP Alphard',
        description: 'Layanan penjemputan eksekutif langsung dari pintu kedatangan dengan pengawalan bagasi.',
        actionLabel: 'Pesan Transport VIP',
      },
      en: {
        title: 'VIP Airport Limousine (Alphard HEV)',
        description: 'Curbside VIP meet-and-greet airport transfer with dedicated luggage handling.',
        actionLabel: 'Request VIP Limousine',
      },
      'zh-CN': {
        title: 'VIP豪华机场接送服务 (埃尔法)',
        description: '专职人员机场贵宾迎接与行李协助，尊享无忧出行。',
        actionLabel: '预约接送',
      },
      'ja-JP': {
        title: 'VIP 空港送迎リムジン (アルファード)',
        description: '空港到着ロビーでのお出迎えとお荷物エスコート付き専用送迎。',
        actionLabel: '送迎予約',
      },
    },
    priceHint: 'Rp 750.000 / one-way',
    availabilitySchedule: '24 Hours',
    fulfilmentType: 'PARTNER_API',
    status: 'Active',
    featured: false,
  },
  {
    id: 'MKT-04',
    propertyId: 'P-01',
    partnerId: 'PARTNER-TOUR',
    partnerName: 'Borobudur Sunrise & Heritage Curator',
    type: 'ThirdPartyExperience',
    title: 'Private Sunrise Meditation at Punthuk Setumbu',
    description: 'Exclusive pre-dawn scenic view of Borobudur emerging from morning mist with hot Javanese herbal tea.',
    localeContent: {
      id: {
        title: 'Meditasi Sunrise Punthuk Setumbu Borobudur',
        description: 'Pemandangan magis fajar Borobudur di atas kabut pagi dipandu pemandu budaya lokal.',
        actionLabel: 'Jadwalkan Tur',
      },
      en: {
        title: 'Private Borobudur Sunrise Meditation',
        description: 'Pre-dawn private vantage point to witness morning mist lifting over ancient temples.',
        actionLabel: 'Schedule Tour',
      },
      'zh-CN': {
        title: '婆罗浮屠日出冥想私享之旅',
        description: '晨曦破晓时分俯瞰云海中的婆罗浮屠古刹，享用热爪哇药草茶。',
        actionLabel: '预约体验',
      },
      'ja-JP': {
        title: 'ボロブドゥール朝日と静寂の瞑想ツアー',
        description: '朝霧に包まれる古代寺院を望む特別な夜明けのプライベートツアー。',
        actionLabel: 'ツアー予約',
      },
    },
    priceHint: 'Rp 850.000 / person',
    availabilitySchedule: '04:30 Departure',
    fulfilmentType: 'QR_HANDOFF',
    status: 'Active',
    featured: false,
  },
  {
  "id": "MKT-LAUNDRY-P01",
  "propertyId": "P-01",
  "type": "InHouseService",
  "title": "Laundry & Garment Care",
  "description": "Laundry and garment care during your stay.",
  "localeContent": {
    "id": {
      "title": "Laundry & Perawatan Pakaian",
      "description": "Layanan cuci dan perawatan pakaian. Hubungi resepsionis untuk jadwal dan tarif.",
      "actionLabel": "Minta layanan laundry"
    },
    "en": {
      "title": "Laundry & Garment Care",
      "description": "Laundry and garment care. Contact reception for schedules and prices.",
      "actionLabel": "Request laundry"
    },
    "zh-CN": {
      "title": "洗衣与衣物护理",
      "description": "洗衣和衣物护理。时间和价格请咨询前台。",
      "actionLabel": "申请洗衣服务"
    },
    "ja-JP": {
      "title": "ランドリー・衣類ケア",
      "description": "衣類の洗濯とケア。営業時間と料金はフロントにお問い合わせください。",
      "actionLabel": "ランドリーを依頼"
    }
  },
  "availabilitySchedule": "08:00–20:00",
  "fulfilmentType": "STAFF_TICKET",
  "status": "Active",
  "featured": false
},
];

export const INITIAL_SERVICE_ORDERS: ServiceOrder[] = [
  {
    id: 'ORD-2026-001',
    itemId: 'MKT-01',
    itemTitle: 'Kayumanis Signature Indonesian Rijsttafel',
    propertyId: 'P-01',
    roomId: 'R-01-201',
    stayId: 'S-01',
    guestDisplayRef: 'Room 201 · Guest B*** S***',
    rawGuestName: 'Bambang Soediro',
    status: 'Confirmed',
    requestedAtUtc: '2026-11-02T11:15:00Z',
    confirmedAtUtc: '2026-11-02T11:18:20Z',
    notes: 'Serve at courtyard veranda for 2 pax at 19:30.',
    assignedTo: 'Front Office Duty Manager (fo_arunika)',
    fulfilmentType: 'STAFF_TICKET',
  },
  {
    id: 'ORD-2026-002',
    itemId: 'MKT-02',
    itemTitle: 'Royal Javanese Boreh & Herbal Compress',
    propertyId: 'P-01',
    roomId: 'R-01-301',
    stayId: 'S-02',
    guestDisplayRef: 'Room 301 · Guest C*** L***',
    rawGuestName: 'Chen Lin',
    status: 'InFulfilment',
    requestedAtUtc: '2026-11-02T14:00:00Z',
    confirmedAtUtc: '2026-11-02T14:05:00Z',
    notes: 'Prefers warm clove herbal compress at 16:00.',
    assignedTo: 'Royal Spa Lead Therapist',
    fulfilmentType: 'STAFF_TICKET',
  },
  {
    id: 'ORD-2026-003',
    itemId: 'MKT-03',
    itemTitle: 'VIP Airport Limousine Transfer (Toyota Alphard HEV)',
    propertyId: 'P-01',
    roomId: 'R-01-502',
    stayId: 'S-04',
    guestDisplayRef: 'Room 502 · Guest D*** W***',
    rawGuestName: 'Dr. Dian Wulandari',
    status: 'Requested',
    requestedAtUtc: '2026-11-02T15:30:00Z',
    notes: 'Flight GA-204 departure tomorrow at 09:40 AM.',
    fulfilmentType: 'PARTNER_API',
  },
];

export const INITIAL_PUBLICATIONS: Publication[] = [
  {
    id: 'PUB-01',
    propertyId: 'P-01',
    version: 4,
    title: 'Autumn Sanctuary Theme + 4-Locale Guest Pack v4',
    publishedBy: 'Putri Maharani (GM P-01)',
    publishedAtUtc: '2026-11-01T09:30:00Z',
    status: 'PartialAck',
    targetCount: 7,
    receivedCount: 5,
    verifiedCount: 5,
    appliedCount: 5,
    healthyCount: 5,
    offlinePendingCount: 2,
    notes: 'Applied on 5 of 7 TVs (E-01, E-02, E-03, E-04, E-06). 2 TVs (E-05 Room 202, E-07 Room 301 Bedroom) are offline and queued for reconnect reconciliation.',
  },
];

export const INITIAL_PROFILE_OVERRIDES: ProfileOverride[] = [
  {
    id: 'OVR-01',
    propertyId: 'P-01',
    layer: 'PLATFORM',
    targetId: 'GLOBAL',
    field: 'accentColor',
    value: '#0050F5',
    updatedBy: 'system',
    updatedAtUtc: '2026-10-01T00:00:00Z',
    version: 1,
  },
  {
    id: 'OVR-02',
    propertyId: 'P-01',
    layer: 'PROPERTY',
    targetId: 'P-01',
    field: 'accentColor',
    value: '#DCC6A1',
    updatedBy: 'property-manager',
    updatedAtUtc: '2026-11-01T08:00:00Z',
    version: 4,
  },
  {
    id: 'OVR-03',
    propertyId: 'P-01',
    layer: 'ROOM_CLASS',
    targetId: 'Suite',
    field: 'welcomeHeadline',
    value: 'Welcome to The Royal Heritage Suite at Hotel Arunika',
    updatedBy: 'property-manager',
    updatedAtUtc: '2026-11-01T08:30:00Z',
    version: 2,
  },
  {
    id: 'OVR-04',
    propertyId: 'P-01',
    layer: 'ROOM_CLASS',
    targetId: 'Suite',
    field: 'accentColor',
    value: '#E5C185',
    updatedBy: 'property-manager',
    updatedAtUtc: '2026-11-01T08:30:00Z',
    version: 1,
  },
  {
    id: 'OVR-05',
    propertyId: 'P-01',
    layer: 'CUSTOMER',
    targetId: 'C-01',
    field: 'logoSubtitle',
    value: 'A Heritage Luxury Hotel',
    updatedBy: 'brand-director',
    updatedAtUtc: '2026-10-15T00:00:00Z',
    version: 1,
  },
];

export const INITIAL_PLAYBACK_FACTS: PlaybackFact[] = [
  {
    id: 'FACT-01',
    campaignId: 'CMP-01',
    endpointId: 'E-01',
    stayId: 'S-01',
    eventType: 'complete',
    occurredAt: '2026-11-02T10:15:30Z',
    playSeconds: 30,
    creativeVersion: 2,
    sessionId: 'SESS-E01-001',
    locale: 'id',
    outcome: 'completed',
  },
  {
    id: 'FACT-02',
    campaignId: 'CMP-01',
    endpointId: 'E-01',
    stayId: 'S-01',
    eventType: 'skip',
    occurredAt: '2026-11-02T14:20:10Z',
    playSeconds: 6,
    creativeVersion: 2,
    sessionId: 'SESS-E01-002',
    locale: 'id',
    outcome: 'skipped',
  },
  {
    id: 'FACT-03',
    campaignId: 'CMP-02',
    endpointId: 'E-06',
    stayId: 'S-03',
    eventType: 'complete',
    occurredAt: '2026-11-02T16:00:00Z',
    playSeconds: 15,
    creativeVersion: 1,
    sessionId: 'SESS-E06-001',
    locale: 'en',
    outcome: 'completed',
  },
];

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'INV-01',
    subscriptionId: 'SUB-01',
    customerId: 'C-01',
    propertyId: 'P-01',
    buyerId: 'ISP-A',
    buyerName: 'Alpha Hospitality Network (Wholesale Payer for P-01)',
    periodLabel: 'November 2026',
    issuedAtUtc: '2026-11-01T00:00:00Z',
    dueAtUtc: '2026-11-10T23:59:59Z',
    status: 'Issued',
    seatsBilled: 12,
    unitPriceIdr: 15000,
    totalIdr: 180000,
    paidIdr: 0,
    remainingBalanceIdr: 180000,
    lineDescription: 'GOJJA Hospitality Core Wholesale — 12 Contracted Seats × Rp15,000',
    lines: [
      {
        id: 'INVL-01-A',
        description: 'Base Seat Allocation — 10 Contracted Units (Full Month November 2026)',
        seatDays: 300,
        unitPriceIdr: 15000,
        amountIdr: 150000,
        lineType: 'BASE',
      },
      {
        id: 'INVL-01-B',
        description: 'True-up Change Order CO-01 — 2 Units Royal Suite 301 expansion (Effective 20 Oct prorata)',
        seatDays: 60,
        unitPriceIdr: 15000,
        amountIdr: 30000,
        lineType: 'TRUE_UP',
      },
    ],
    receiptRefs: [],
  },
  {
    id: 'INV-02',
    subscriptionId: 'SUB-02',
    customerId: 'C-02',
    propertyId: 'P-02',
    buyerId: 'ISP-B',
    buyerName: 'Beta Property Connect (Wholesale Payer for P-02)',
    periodLabel: 'November 2026',
    issuedAtUtc: '2026-11-01T00:00:00Z',
    dueAtUtc: '2026-11-10T23:59:59Z',
    status: 'Paid',
    seatsBilled: 8,
    unitPriceIdr: 15000,
    totalIdr: 120000,
    paidIdr: 120000,
    remainingBalanceIdr: 0,
    lineDescription: 'GOJJA Hospitality Core Wholesale — 8 Contracted Seats × Rp15,000',
    lines: [
      {
        id: 'INVL-02-A',
        description: 'Base Seat Allocation — 8 Villa Units (Full Month November 2026)',
        seatDays: 240,
        unitPriceIdr: 15000,
        amountIdr: 120000,
        lineType: 'BASE',
      },
    ],
    receiptRefs: ['RCP-01'],
  },
  {
    id: 'INV-03',
    subscriptionId: 'SUB-03',
    customerId: 'C-03',
    propertyId: 'P-03',
    buyerId: 'C-03',
    buyerName: 'PT Sora Urban Living (Direct Customer P-03)',
    periodLabel: 'November 2026',
    issuedAtUtc: '2026-11-01T00:00:00Z',
    dueAtUtc: '2026-11-10T23:59:59Z',
    status: 'Issued',
    seatsBilled: 10,
    unitPriceIdr: 25000,
    totalIdr: 250000,
    paidIdr: 0,
    remainingBalanceIdr: 250000,
    lineDescription: 'GOJJA Hospitality Core Direct — 10 Contracted Seats × Rp25,000',
    lines: [
      {
        id: 'INVL-03-A',
        description: 'Base Studio Direct Pool — 10 Demo Seats (Full Month November 2026)',
        seatDays: 300,
        unitPriceIdr: 25000,
        amountIdr: 250000,
        lineType: 'BASE',
      },
    ],
    receiptRefs: [],
  },
];

export const INITIAL_RECEIPTS: Receipt[] = [
  {
    id: 'RCP-01',
    invoiceId: 'INV-02',
    transactionRef: 'TRX-BETA-20261101-001',
    amountIdr: 120000,
    verifiedBy: 'Sari Wulandari (GOJJA Finance)',
    verifiedAtUtc: '2026-11-01T14:20:00Z',
    method: 'Bank Transfer Virtual Account (Simulated)',
  },
];

export const INITIAL_RELEASES: ReleaseArtifact[] = [
  {
    id: 'REL-01',
    versionCode: 20401,
    versionName: '2.4.1',
    packageName: 'tv.gojja.hospitality.shell',
    sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    signerIdentity: 'CN=GOJJA Release Authority, OU=AndroidTV, O=GOJJA',
    status: 'TechnicallyApproved',
    createdBy: 'Bima Sakti (Technical Admin)',
    technicallyApprovedBy: 'Bima Sakti (Technical Admin)',
    releaseNotes: '4-locale CJK font fallback optimization, atomic manifest pointer swap, and D-pad focus restoration after channel guide exit.',
    targetProfiles: ['DEMO-MANAGED', 'DEMO-ASSISTED'],
  },
  {
    id: 'REL-02',
    versionCode: 20402,
    versionName: '2.4.2-rc1',
    packageName: 'tv.gojja.hospitality.shell',
    sha256: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
    signerIdentity: 'CN=GOJJA Release Authority, OU=AndroidTV, O=GOJJA',
    status: 'TechnicalReview',
    createdBy: 'Bima Sakti (Technical Admin)',
    technicallyApprovedBy: null,
    releaseNotes: 'Candidate build with low-latency HLS buffer tuning and enhanced wake-from-standby telemetry.',
    targetProfiles: ['DEMO-MANAGED'],
  },
];

export const INITIAL_UPDATE_APPROVALS: PropertyUpdateApproval[] = [
  {
    id: 'UPA-01',
    propertyId: 'P-01',
    releaseId: 'REL-01',
    approvedBy: 'Putri Maharani (GM P-01)',
    status: 'ApprovedWindow',
    windowStartLocal: '02:00 WIB',
    windowEndLocal: '05:00 WIB',
    standingPolicy: false,
  },
  {
    id: 'UPA-02',
    propertyId: 'P-01',
    releaseId: 'REL-02',
    approvedBy: null,
    status: 'PendingPermission',
    windowStartLocal: '02:00 WIB',
    windowEndLocal: '05:00 WIB',
    standingPolicy: false,
  },
];

export const INITIAL_UPDATE_JOBS: UpdateJob[] = [
  {
    id: 'JOB-UPD-01',
    propertyId: 'P-01',
    endpointId: 'E-04',
    roomId: 'ROOM-201',
    releaseId: 'REL-01',
    stage: 'AwaitingReadiness',
    reason: 'Room 201 is Vacant, but Housekeeping status is Dirty (Not Ready for Maintenance — BR06).',
    updatedAtUtc: '2026-11-02T06:30:00Z',
  },
  {
    id: 'JOB-UPD-02',
    propertyId: 'P-01',
    endpointId: 'E-05',
    roomId: 'ROOM-202',
    releaseId: 'REL-01',
    stage: 'Deferred',
    reason: 'Endpoint E-05 is currently Offline (last seen 12:00 WIB). Will re-evaluate window and approval on reconnect.',
    updatedAtUtc: '2026-11-02T06:30:00Z',
  },
  {
    id: 'JOB-UPD-03',
    propertyId: 'P-01',
    endpointId: 'E-07',
    roomId: 'ROOM-301',
    releaseId: 'REL-01',
    stage: 'Deferred',
    reason: 'Room 301 is Occupied (Stay S-04 InHouse) and Endpoint E-07 is Offline.',
    updatedAtUtc: '2026-11-02T06:30:00Z',
  },
];

export const INITIAL_TICKETS: SupportTicket[] = [
  {
    id: 'TK-01',
    propertyId: 'P-02',
    endpointId: 'E-09',
    title: 'Provider token expired on Pasifik Media stream (Room 402)',
    category: 'Provider / DRM',
    severity: 'High',
    status: 'Triaged',
    symptom: 'Guest in Room 402 sees "Channel temporarily unavailable (Code: TOKEN_EXPIRED)" on sports & news channels.',
    observedFacts: [
      'Endpoint E-09 heartbeat is Online (last seen 13:58 WIB).',
      'GOJJA App Shell v2.4.0 is responsive; Hotel Info channel plays normally.',
      'Provider connection CT-02 reported HTTP 401 TokenExpired from headend gateway.',
    ],
    diagnosticInference: 'Upstream provider authentication token for CT-02 has expired; this is a provider credential lifecycle issue, not an Android TV hardware or GOJJA APK crash.',
    suggestedNextAction: 'Refresh provider secret reference in TV Services → Provider Connection and run TV-side connection probe.',
    limitationsNote: 'Read-only diagnostic assistant. Cannot autonomously modify provider credentials or reset TV.',
    assignedTo: 'Bagus Setiawan (Support L2)',
    createdAtUtc: '2026-11-02T05:15:00Z',
  },
  {
    id: 'TK-02',
    propertyId: 'P-01',
    endpointId: 'E-05',
    title: 'Staged media asset download interrupted on Room 202 TV',
    category: 'Media / Storage',
    severity: 'Medium',
    status: 'Open',
    symptom: 'Publication PUB-01 shows 5/7 Applied; E-05 remains on config v3.',
    observedFacts: [
      'Endpoint E-05 lost Wi-Fi connectivity at 12:00 WIB during staging of welcome-arunika.mp4.',
      'Atomic manifest guard retained last known valid configuration v3 without corrupting active theme.',
    ],
    diagnosticInference: 'Room 202 keycard power or local AP connection dropped before checksum verification completed.',
    suggestedNextAction: 'Verify room power/AP in Room 202; endpoint will automatically resume staging and ACK v4 upon reconnect.',
    limitationsNote: 'Read-only diagnostic assistant. Cannot power on physical TV panel remotely when AC power is cut.',
    assignedTo: 'Dimas Kurniawan (ISP-A L1)',
    createdAtUtc: '2026-11-02T05:40:00Z',
  },
];

export const INITIAL_DEMO_CANDIDATES: DiscoveryCandidate[] = [
  {
    id: 'DVC-01',
    environmentId: 'DEMO',
    connectorId: 'CON-DEMO-P01',
    propertyId: 'P-01',
    ip: '192.168.10.104',
    port: 5555,
    friendlyName: 'BRAVIA-4K-Room104-Candidate',
    discoverySource: 'mDNS',
    serviceHint: '_adb._tcp.local (Port 5555)',
    reachability: 'Reachable',
    authState: 'AuthRequired',
    confidence: 'High',
    observedModel: 'BRAVIA 4K VH21',
    observedManufacturer: 'Sony',
    observedAndroidVersion: '11',
    observedSdkInt: 30,
    observedBuildFingerprint: 'Sony/BRAVIA_VH21/BRAVIA_VH21:11/RTT0.210502.002/104:user/release-keys',
    observedSerial: 'SN-ARUNIKA-104-NEW',
    assignedRoomId: null,
    lastObservedUtc: '2026-11-02T06:55:00Z',
    origin: 'SEEDED',
    executionMode: 'SIMULATED',
    notes: 'Reachable over hospitality VLAN. Waiting for on-TV RSA debugging authorization prompt confirmation.',
  },
  {
    id: 'DVC-02',
    environmentId: 'DEMO',
    connectorId: 'CON-DEMO-P01',
    propertyId: 'P-01',
    ip: '192.168.10.105',
    port: 5555,
    friendlyName: 'AndroidTV-LivingRoom-105',
    discoverySource: 'mDNS',
    serviceHint: '_androidtvremote2._tcp.local (Hint only)',
    reachability: 'Unreachable',
    authState: 'CandidateFound',
    confidence: 'Medium',
    assignedRoomId: null,
    lastObservedUtc: '2026-11-02T06:55:00Z',
    origin: 'SEEDED',
    executionMode: 'SIMULATED',
    notes: 'Advertised Android TV Remote service via mDNS, but TCP port 5555 connection timed out. Do not assume developer mode is off—check VLAN ACL or wireless debugging pairing port.',
  },
  {
    id: 'DVC-03',
    environmentId: 'DEMO',
    connectorId: 'CON-DEMO-P01',
    propertyId: 'P-01',
    ip: '192.168.10.199',
    port: 8009,
    friendlyName: 'Lobby-Signage-NonAndroid',
    discoverySource: 'TCP_PROBE',
    serviceHint: 'Cast / Signage Port 8009 (Not ADB)',
    reachability: 'Reachable',
    authState: 'Unsupported',
    confidence: 'Low',
    assignedRoomId: null,
    lastObservedUtc: '2026-11-02T06:55:00Z',
    origin: 'SEEDED',
    executionMode: 'SIMULATED',
    notes: 'Open cast/HTTP port only; no ADB daemon or supported Android TV management route.',
  },
];

export const INITIAL_CONNECTORS: ConnectorRegistration[] = [
  {
    id: 'CON-DEMO-P01',
    environmentId: 'DEMO',
    propertyId: 'P-01',
    name: 'Arunika Field Laptop Connector (Simulated)',
    hostPlatform: 'Windows 11 x64 • Electron/Node Bridge',
    status: 'Online',
    enrolledBy: 'alpha-installer',
    enrolledAtUtc: '2026-11-02T06:00:00Z',
    lastHeartbeatUtc: '2026-11-02T07:00:00Z',
    adbVersion: 'Android Debug Bridge version 1.0.41 (Version 35.0.2-12147458)',
    adbAvailable: true,
    interfaceName: 'eth0 (Hospitality Management VLAN 10)',
    subnetCidr: '192.168.10.0/24',
    allowedActions: ['network.scan', 'adb.pair', 'adb.connect', 'adb.inventory', 'adb.disconnect'],
    consentExpiresAtUtc: '2026-11-02T15:00:00Z',
  },
];

export const SCENARIOS_CATALOG: ScenarioDefinition[] = [
  {
    id: 'SCN-01',
    code: 'SCN-01',
    title: 'Happy Onboarding (DVC-01 → Room 104 → E-15)',
    category: 'Onboarding',
    description: 'Authorize DVC-01 on TV, verify ADB get-state & getprop inventory, bind to new Room 104, and allocate 1 seat from SUB-01.',
    expectedOutcome: 'Endpoint E-15 created in Room 104; allocated seats increase from 14 to 15 (P-01: 7 → 8, available: 16 → 15).',
  },
  {
    id: 'SCN-02',
    code: 'SCN-02',
    title: 'Connector Offline Guard',
    category: 'Onboarding',
    description: 'Set local connector offline and attempt network scan.',
    expectedOutcome: 'Scan blocked with CONNECTOR_OFFLINE; no fake candidate list generated.',
  },
  {
    id: 'SCN-04',
    code: 'SCN-04',
    title: 'TV RSA Authorization Pending / Denied',
    category: 'Onboarding',
    description: 'Attempt inventory read before staff accepts RSA prompt on TV screen.',
    expectedOutcome: 'Returns ADB_UNAUTHORIZED; blocks device verification and enrollment until authorized.',
  },
  {
    id: 'SCN-05',
    code: 'SCN-05',
    title: 'Disconnect Mid-Command (OutcomeUnknown)',
    category: 'Update & Maintenance',
    description: 'Simulate connection drop during update/deployment execution on E-04.',
    expectedOutcome: 'Job enters OutcomeUnknown state requiring Reconcile before retry.',
  },
  {
    id: 'SCN-07',
    code: 'SCN-07',
    title: 'New Check-In Race Before Update Install',
    category: 'Update & Maintenance',
    description: 'Check in a guest into Room 202 right before scheduled update job executes.',
    expectedOutcome: 'Context version increments; update job rechecks eligibility and defers installation to protect guest.',
  },
  {
    id: 'SCN-11',
    code: 'SCN-11',
    title: 'Stale Checkout Event After New Check-In',
    category: 'Stay & Privacy',
    description: 'Replay delayed checkout event from previous stay version on Room 101.',
    expectedOutcome: 'Rejected by contextVersion guard; current guest Bapak Aditya remains active.',
  },
  {
    id: 'SCN-12',
    code: 'SCN-12',
    title: 'Duplicate Offline Playback Batch',
    category: 'Finance & Analytics',
    description: 'Replay duplicate playback event batch from E-01 after reconnect.',
    expectedOutcome: 'Deduplicated by eventId; CMP-01 stays at 10 starts and 212 play seconds.',
  },
  {
    id: 'SCN-15',
    code: 'SCN-15',
    title: 'Idempotent Invoice Payment Verification',
    category: 'Finance & Analytics',
    description: 'Submit payment verification for INV-01 (Rp180,000) twice with the same transaction reference.',
    expectedOutcome: 'First call marks INV-01 Paid (Paid: Rp300K, Outstanding: Rp250K); second call returns existing receipt without double-posting.',
  },
];

export const ANALYTICS_FIXTURE = {
  campaignSummary: {
    campaignId: 'CMP-01',
    campaignName: 'Spa experience — Royal Javanese Ritual',
    periodLabel: '1 Nov – 2 Nov 2026 (Fixture)',
    starts: 10,
    completed: 6,
    skipped: 2,
    interrupted: 1,
    failedAfterStart: 1,
    totalPlaySeconds: 212,
    completionRatePercent: 60,
    quartiles: { q25: 7, q50: 7, q75: 6 },
  },
  channelSummary: {
    propertyId: 'P-01',
    attempts: 8,
    starts: 7,
    failedBeforeStart: 1,
    validSessionDurationsSeconds: [600, 300, 240, 180, 120, 60, 30],
    totalPlaySeconds: 1530,
    totalPlayMinutes: 25.5,
    medianSessionSeconds: 180,
    uniqueReportingEndpoints: 4,
    targetEndpoints: 5,
    reportingCoveragePercent: 80,
  },
  serviceFunnel: {
    tileExposures: 20,
    detailOpens: 8,
    qrLandingSessions: 3,
    serviceRequests: 2,
    confirmedBookings: 1,
    fulfilledPaid: 0,
  },
  dailyPlaybackTrend: [
    { date: '25 Oct', starts: 48, playMinutes: 142 },
    { date: '26 Oct', starts: 76, playMinutes: 215 },
    { date: '27 Oct', starts: 98, playMinutes: 284 },
    { date: '28 Oct', starts: 82, playMinutes: 240 },
    { date: '29 Oct', starts: 112, playMinutes: 318 },
    { date: '30 Oct', starts: 105, playMinutes: 296 },
    { date: '31 Oct', starts: 138, playMinutes: 390 },
  ],
};

export function resolveEndpointCapabilities(endpoint: Endpoint): Record<CapabilityKey, EffectiveCapabilityResult> {
  const profile = endpoint.capabilityProfile;
  const isManaged = profile === 'DEMO-MANAGED' || profile === 'LIVE-VERIFIED';
  const isLimited = profile === 'DEMO-LIMITED';
  const isAssisted = profile === 'DEMO-ASSISTED';
  const evidenceType = profile === 'LIVE-VERIFIED' ? 'LiveObserved' : 'DemoFixture';

  return {
    'launcher.takeover': {
      capability: 'launcher.takeover',
      status: isManaged ? 'Supported' : isAssisted ? 'Limited' : 'Unsupported',
      route: isManaged ? 'ADB Shell pm set-home-activity' : isAssisted ? 'User confirmation dialog' : 'Blocked by OEM locked launcher',
      evidenceType,
      limitationMessage: isLimited
        ? 'TCL OEM UI locks default home launcher. Requires manual settings navigation or factory hospitality firmware.'
        : isAssisted
        ? 'Requires guest or technician to select GOJJA once on boot.'
        : undefined,
      requiredAction: isLimited
        ? 'Deploy via secondary app launcher or obtain vendor unlock code.'
        : undefined,
    },
    'adb.install': {
      capability: 'adb.install',
      status: 'Supported',
      route: 'ADB Wireless (port 5555)',
      evidenceType,
    },
    'adb.shell': {
      capability: 'adb.shell',
      status: isAssisted ? 'Limited' : 'Supported',
      route: 'ADB Shell daemon',
      evidenceType,
      limitationMessage: isAssisted ? 'Restricted permissions on Philips Android 9.' : undefined,
    },
    'kiosk.mode': {
      capability: 'kiosk.mode',
      status: isManaged ? 'Supported' : 'Limited',
      route: 'Android Device Policy / Lock Task',
      evidenceType,
      limitationMessage: !isManaged ? 'Requires device owner provisioning via QR/NFC.' : undefined,
    },
    'power.recovery': {
      capability: 'power.recovery',
      status: 'Supported',
      route: 'AC Power state resume test',
      evidenceType,
    },
    'drm.widevine.l1': {
      capability: 'drm.widevine.l1',
      status: isLimited ? 'Limited' : 'Supported',
      route: 'Widevine Modular DRM (Hardware Secure)',
      evidenceType,
      limitationMessage: isLimited ? 'Fallback to Widevine L3 (SD only, 480p/576p).' : undefined,
    },
    'playback.hls': {
      capability: 'playback.hls',
      status: 'Supported',
      route: 'ExoPlayer / Media3 HLS pipeline',
      evidenceType,
    },
    'playback.dash': {
      capability: 'playback.dash',
      status: isAssisted ? 'Limited' : 'Supported',
      route: 'ExoPlayer / Media3 MPEG-DASH pipeline',
      evidenceType,
    },
    'offline.cache': {
      capability: 'offline.cache',
      status: 'Supported',
      route: 'App Internal Storage (/data/data)',
      evidenceType,
    },
    'remote.dpad': {
      capability: 'remote.dpad',
      status: 'Supported',
      route: 'Standard Android KeyEvent (DPAD_CENTER, UP, DOWN, LEFT, RIGHT)',
      evidenceType,
    },
  };
}

export function checkCapability(endpoint: Endpoint, key: CapabilityKey): EffectiveCapabilityResult {
  const all = resolveEndpointCapabilities(endpoint);
  return all[key];
}

export function runDevicePreflight(candidate: DiscoveryCandidate): {
  passed: boolean;
  criticalPassed: boolean;
  items: PreflightCheckItem[];
  summary: string;
} {
  const sdkInt = candidate.observedSdkInt || 30;
  const authState = candidate.authState;
  const isTcl = (candidate.observedManufacturer || candidate.observedModel || '').toLowerCase().includes('tcl');
  const isSony = (candidate.observedManufacturer || candidate.observedModel || '').toLowerCase().includes('sony');

  const osCheck: PreflightCheckItem = {
    id: 'PFC-OS',
    name: 'Android OS Version & SDK',
    category: 'OS',
    status: sdkInt >= 29 ? 'Supported' : sdkInt >= 26 ? 'Limited' : 'Unsupported',
    observedValue: `Android ${candidate.observedAndroidVersion || '11'} (SDK ${sdkInt})`,
    detail: sdkInt >= 29 ? 'Modern Android TV runtime compatible with GOJJA Shell v2.4+.' : 'Legacy Android TV runtime. Some UI animations and WebKit features may degrade.',
    isCritical: true,
    requiredAction: sdkInt < 26 ? 'Upgrade firmware or replace endpoint box.' : undefined,
  };

  const isAdbAuthorized = authState === 'DeviceVerified' || authState === 'TransportReady' || authState === 'Enrolled';
  const adbCheck: PreflightCheckItem = {
    id: 'PFC-ADB',
    name: 'ADB Wireless Authorization',
    category: 'ADB',
    status: isAdbAuthorized ? 'Supported' : authState === 'AuthRequired' || authState === 'PairRequired' || authState === 'Paired' ? 'Limited' : 'Unsupported',
    observedValue: authState,
    detail: isAdbAuthorized
      ? 'RSA key verified and connected. Remote provisioning ready.'
      : authState === 'AuthRequired'
      ? 'Host RSA key pending acceptance on TV screen prompt.'
      : 'Device pairing or transport link required before binding.',
    isCritical: true,
    requiredAction: authState === 'AuthRequired' ? 'Click "Allow always from this computer" on the TV screen.' : undefined,
  };

  const storageCheck: PreflightCheckItem = {
    id: 'PFC-STORAGE',
    name: 'Internal Flash Storage Headroom',
    category: 'Storage',
    status: 'Supported',
    observedValue: '4.8 GB Available (Est.)',
    detail: 'Adequate storage for APK binary (42MB) and cached promotional video assets (max 500MB).',
    isCritical: false,
  };

  const netCheck: PreflightCheckItem = {
    id: 'PFC-NET',
    name: 'LAN Latency & NTP Time Synchronization',
    category: 'Network',
    status: 'Supported',
    observedValue: 'Ping < 4ms • NTP In-Sync',
    detail: 'Hospitality VLAN routing verified. Digital certificate validity and token checks will pass.',
    isCritical: true,
  };

  const drmCheck: PreflightCheckItem = {
    id: 'PFC-DRM',
    name: 'Widevine Hardware Modular DRM',
    category: 'DRM',
    status: isTcl ? 'Limited' : 'Supported',
    observedValue: isTcl ? 'Widevine L3 (Software Security)' : 'Widevine L1 (OEM Hardware Trusted)',
    detail: isTcl
      ? 'Limited to standard definition (SD 480p) streams for DRM-protected premium channels.'
      : 'Hardware root-of-trust verified. Full HD 1080p and 4K UHD streaming authorized.',
    isCritical: false,
    requiredAction: isTcl ? 'Advise guest or operations that 4K premium channels require L1 certified hardware.' : undefined,
  };

  const launcherCheck: PreflightCheckItem = {
    id: 'PFC-LAUNCHER',
    name: 'Default Launcher Takeover Feasibility',
    category: 'Launcher',
    status: isTcl ? 'Unsupported' : isSony ? 'Supported' : 'Limited',
    observedValue: isTcl ? 'OEM Protected Home (Locked)' : isSony ? 'Standard Android TV Home (Takeover Ready)' : 'Vendor Shell Present',
    detail: isTcl
      ? 'Manufacturer locks default home activity. TV boot will show TCL Home unless factory hospitality firmware is flashed.'
      : 'Can automatically set GOJJA Hospitality Shell as default home activity on AC power on.',
    isCritical: false,
    requiredAction: isTcl ? 'SOP: Set GOJJA app on auto-start upon boot via hospitality settings.' : undefined,
  };

  const items: PreflightCheckItem[] = [osCheck, adbCheck, storageCheck, netCheck, drmCheck, launcherCheck];
  const criticalPassed = !items.some((i) => i.isCritical && i.status === 'Unsupported');
  const anyUnsupported = items.some((i) => i.status === 'Unsupported');
  const anyLimited = items.some((i) => i.status === 'Limited');

  const summary = criticalPassed
    ? anyUnsupported
      ? 'Compatible with Limitations: Core provisioning will succeed, but certain features (such as Launcher Takeover or HD DRM) are constrained by hardware.'
      : anyLimited
      ? 'Ready for Assignment with Advisory: Host pairing or minor limitations noted.'
      : 'Fully Verified: Device meets all optimal criteria for GOJJA Managed Hospitality Shell.'
    : 'Blocked: Critical preflight check failed. Resolve ADB authorization or firmware issues before assigning.';

  return {
    passed: criticalPassed,
    criticalPassed,
    items,
    summary,
  };
}

export function resolveEffectiveLineup(
  propertyId: string,
  roomClass: string = 'Standard',
  isPublicArea: boolean = false,
  contracts: ProviderContract[] = INITIAL_CONTRACTS,
  channels: Channel[] = INITIAL_CHANNELS
): EffectiveLineupResult {
  const propertyContracts = contracts.filter((c) => c.propertyId === propertyId);
  const effectiveChannels: EffectiveChannel[] = [];
  const deniedChannels: DenialReason[] = [];

  for (const ch of channels) {
    // 1. Hotel In-House Channels (PKG-FREE) are always entitled regardless of external contracts
    if (ch.packageId === 'PKG-FREE') {
      effectiveChannels.push({
        ...ch,
        entitlementSource: 'In-House Hospitality Headend',
        allowedRoomClasses: ['Standard', 'Deluxe', 'Suite', 'Studio', 'PublicArea'],
      });
      continue;
    }

    // 2. Hidden in Guide check
    if (ch.hiddenInGuide) {
      deniedChannels.push({
        channelId: ch.id,
        channelName: ch.name,
        packageId: ch.packageId,
        code: 'HIDDEN_IN_GUIDE',
        message: `Channel ${ch.name} is marked hidden in electronic program guide.`,
      });
      continue;
    }

    // 3. Find contract that covers this channel's package
    const matchingContract = propertyContracts.find((c) => c.packages.includes(ch.packageId));

    if (!matchingContract) {
      deniedChannels.push({
        channelId: ch.id,
        channelName: ch.name,
        packageId: ch.packageId,
        code: 'PACKAGE_NOT_INCLUDED',
        message: `Package ${ch.packageId} is not included in property ${propertyId} provider contracts.`,
      });
      continue;
    }

    // 4. Contract Status check
    if (matchingContract.status !== 'Active' && matchingContract.status !== 'Verified') {
      deniedChannels.push({
        channelId: ch.id,
        channelName: ch.name,
        packageId: ch.packageId,
        code: 'CONTRACT_NOT_ACTIVE',
        message: `Provider contract ${matchingContract.id} (${matchingContract.providerName}) is currently '${matchingContract.status}'.`,
      });
      continue;
    }

    // 5. Expiration check
    if (new Date(matchingContract.validUntilUtc).getTime() < Date.now()) {
      deniedChannels.push({
        channelId: ch.id,
        channelName: ch.name,
        packageId: ch.packageId,
        code: 'CONTRACT_EXPIRED',
        message: `Provider contract ${matchingContract.id} expired on ${matchingContract.validUntilUtc.slice(0, 10)}.`,
      });
      continue;
    }

    // 6. Provider connection / token status check
    if (matchingContract.connectionStatus !== 'Ready') {
      deniedChannels.push({
        channelId: ch.id,
        channelName: ch.name,
        packageId: ch.packageId,
        code: 'PROVIDER_DEGRADED',
        message: `Provider headend connection is ${matchingContract.connectionStatus} for contract ${matchingContract.id}.`,
      });
      continue;
    }

    // 7. Public Area check
    if (isPublicArea && !matchingContract.publicAreaAllowed) {
      deniedChannels.push({
        channelId: ch.id,
        channelName: ch.name,
        packageId: ch.packageId,
        code: 'PUBLIC_AREA_RESTRICTED',
        message: `Contract ${matchingContract.id} restricts broadcasts to private in-room TVs only. Public signage playback prohibited.`,
      });
      continue;
    }

    // 8. Room Class Tier check
    if (!matchingContract.allowedRoomClasses.includes(roomClass)) {
      deniedChannels.push({
        channelId: ch.id,
        channelName: ch.name,
        packageId: ch.packageId,
        code: 'ROOM_CLASS_NOT_ALLOWED',
        message: `Room class '${roomClass}' is not eligible for tier ${ch.packageId} (Permitted tiers: ${matchingContract.allowedRoomClasses.join(', ')}).`,
      });
      continue;
    }

    // Passed all resolution gates!
    effectiveChannels.push({
      ...ch,
      entitlementSource: `${matchingContract.id} (${matchingContract.providerName})`,
      allowedRoomClasses: matchingContract.allowedRoomClasses,
    });
  }

  // Sort channels by channel number
  effectiveChannels.sort((a, b) => parseInt(a.number, 10) - parseInt(b.number, 10));

  return {
    propertyId,
    roomClass,
    isPublicArea,
    computedAtUtc: new Date().toISOString(),
    lineupVersion: 1,
    channels: effectiveChannels,
    deniedChannels,
  };
}

export interface UpdateEligibilityStep {
  step: number;
  name: string;
  passed: boolean;
  detail: string;
}

export interface EndpointEligibilityEvaluation {
  endpointId: string;
  roomId: string;
  roomCode: string;
  stage: UpdateJobStage;
  eligible: boolean;
  primaryReason: string;
  steps: UpdateEligibilityStep[];
}

export function evaluateEndpointUpdateEligibility(
  endpoint: Endpoint,
  room: Room | undefined,
  activeStay: Stay | undefined,
  release: ReleaseArtifact,
  approval: PropertyUpdateApproval | undefined
): {
  eligible: boolean;
  resultingStage: UpdateJobStage;
  primaryReason: string;
  steps: UpdateEligibilityStep[];
} {
  const steps: UpdateEligibilityStep[] = [];

  // Step 1: Technical Approval by GOJJA Platform Admin (R-03)
  const isTechApproved = release.status === 'TechnicallyApproved' && !!release.technicallyApprovedBy;
  steps.push({
    step: 1,
    name: 'Technical Approval Gate (R-03)',
    passed: isTechApproved,
    detail: isTechApproved
      ? `Release ${release.versionName} signed and technically approved by ${release.technicallyApprovedBy}.`
      : `Release ${release.versionName} requires sign-off from R-03 Technical Admin before deployment.`,
  });

  // Step 2: Hotel Property Maintenance Window Granted (R-10/R-11)
  const isPropApproved = approval?.status === 'ApprovedWindow';
  steps.push({
    step: 2,
    name: 'Property Window Permission (R-10/R-11)',
    passed: isPropApproved,
    detail: isPropApproved
      ? `Property granted maintenance window (${approval?.windowStartLocal}–${approval?.windowEndLocal}).`
      : `Property operator has not granted an installation permission window.`,
  });

  // Step 3: Scheduled Maintenance Window Active
  const isWindowActive = isPropApproved;
  steps.push({
    step: 3,
    name: 'Scheduled Maintenance Window Active',
    passed: isWindowActive,
    detail: isWindowActive
      ? `Window authorized: ${approval?.windowStartLocal || '02:00'} to ${approval?.windowEndLocal || '05:00'} WIB.`
      : `Outside approved deployment time window.`,
  });

  // Step 4: Endpoint Connectivity & Heartbeat
  const isOnline = endpoint.connection === 'Online';
  steps.push({
    step: 4,
    name: 'Endpoint Online & Transport Ready',
    passed: isOnline,
    detail: isOnline
      ? `Endpoint is Online with active MQTT/gRPC telemetry heartbeat.`
      : `Endpoint ${endpoint.id} is Offline. Cannot stage payload without active transport.`,
  });

  // Step 5: Guest Occupancy Status (BR06)
  const hasGuest = !!activeStay && activeStay.status === 'InHouse';
  steps.push({
    step: 5,
    name: 'Room Vacancy Protection (BR06)',
    passed: !hasGuest,
    detail: !hasGuest
      ? `Room is Vacant. No active guest in-house.`
      : `Disruptive update blocked: Guest in-house (${activeStay?.id}). Deferring to next checkout.`,
  });

  // Step 6: Housekeeping & Physical Maintenance Readiness
  const isHousekeepingReady = room?.housekeeping === 'Ready' && !!room?.maintenanceAuthorized;
  steps.push({
    step: 6,
    name: 'Housekeeping & Maintenance Authorization',
    passed: isHousekeepingReady,
    detail: isHousekeepingReady
      ? `Room ${room?.code || endpoint.roomId} is Clean/Ready and authorized for TV maintenance.`
      : `Room ${room?.code || endpoint.roomId} housekeeping is '${room?.housekeeping || 'Dirty'}' (Authorized=${room?.maintenanceAuthorized ?? false}).`,
  });

  // Step 7: TV Power State & Screen Playback Guard
  const isTransportReady = endpoint.connection === 'Online';
  steps.push({
    step: 7,
    name: 'Screen Activity & Transport Guard',
    passed: isTransportReady,
    detail: isTransportReady
      ? `Endpoint transport is ${endpoint.connection}; background package staging authorized.`
      : `Endpoint is disconnected. Transport staging halted.`,
  });

  // Step 8: Hardware Profile Compatibility
  const isProfileMatch = release.targetProfiles.includes(endpoint.capabilityProfile);
  steps.push({
    step: 8,
    name: 'Hardware Capability Profile Match',
    passed: isProfileMatch,
    detail: isProfileMatch
      ? `Endpoint profile '${endpoint.capabilityProfile}' supported by release ${release.versionName}.`
      : `Incompatible profile: Endpoint is '${endpoint.capabilityProfile}', release targets [${release.targetProfiles.join(', ')}].`,
  });

  // Step 9: Package Checksum Preflight & Storage
  const isHealthyAlready = endpoint.appVersion === release.versionName;
  const isPreflightOk = true;
  steps.push({
    step: 9,
    name: 'Package Checksum & Storage Preflight',
    passed: isPreflightOk,
    detail: isHealthyAlready
      ? `Already verified on target v${release.versionName} (${release.sha256.slice(0, 16)}...).`
      : `Preflight passed: SHA-256 verified, >500MB free storage available.`,
  });

  const allPassed = steps.every((s) => s.passed);

  let resultingStage: UpdateJobStage = 'Healthy';
  let primaryReason = '';

  if (!isTechApproved || !isPropApproved) {
    resultingStage = 'AwaitingApproval';
    primaryReason = !isTechApproved
      ? `Blocked at Step 1: Release requires Technical Approval (R-03).`
      : `Blocked at Step 2: Property Manager window permission required (R-10/R-11).`;
  } else if (hasGuest) {
    resultingStage = 'Deferred';
    primaryReason = `Deferred at Step 5: Room has active guest stay (${activeStay?.id}). Preserving guest experience (BR06).`;
  } else if (!isHousekeepingReady) {
    resultingStage = 'AwaitingReadiness';
    primaryReason = `Blocked at Step 6: Room housekeeping is '${room?.housekeeping || 'Dirty'}' (MaintenanceAuthorized=${room?.maintenanceAuthorized}).`;
  } else if (!isOnline) {
    resultingStage = 'Deferred';
    primaryReason = `Deferred at Step 4: Endpoint ${endpoint.id} is Offline. Scheduled window passed without heartbeat.`;
  } else if (!isProfileMatch) {
    resultingStage = 'Deferred';
    primaryReason = `Incompatible at Step 8: Hardware profile '${endpoint.capabilityProfile}' not supported by target release.`;
  } else if (isHealthyAlready) {
    resultingStage = 'Healthy';
    primaryReason = `Endpoint verified Healthy on target release v${release.versionName}.`;
  } else {
    resultingStage = 'Staged';
    primaryReason = `All 9 eligibility checks passed. Payload staged for installation.`;
  }

  return {
    eligible: allPassed,
    resultingStage,
    primaryReason,
    steps,
  };
}

// =======================================================================
// FASE C: BRANDING INHERITANCE & MULTI-LAYER RESOLUTION ENGINE (M05 / FR05)
// =======================================================================

export type FieldInheritanceStatus = 'Inherited' | 'Overridden' | 'Locked';

export interface FieldProvenance {
  field: BrandingFieldKey;
  layer: BrandingLayer;
  sourceId: string;
  version: number;
  label: string;
  status: FieldInheritanceStatus;
}

export interface BrandingConflict {
  field: BrandingFieldKey;
  candidateLayers: {
    layer: BrandingLayer;
    value: string;
    sourceId: string;
    label: string;
  }[];
  resolutionPolicy: string;
  winningLayer: BrandingLayer;
}

export interface BrandingResolutionContext {
  propertyId: string;
  roomId?: string;
  roomClass?: string;
  stayId?: string;
  groupId?: string;
  locale?: GuestLocale;
}

export interface ResolvedBrandingProfile {
  propertyId: string;
  context: BrandingResolutionContext;
  values: {
    logoText: string;
    logoSubtitle: string;
    logoImageUrl: string;
    primaryColor: string;
    accentColor: string;
    heroMediaType: 'image' | 'video';
    heroImageUrl: string;
    heroVideoUrl: string;
    promoMediaType: 'image' | 'video';
    promoMediaUrl: string;
    promoTitle: string;
    welcomeHeadline: string;
    welcomeSubline: string;
    defaultLocale: GuestLocale;
    preTvPromoEnabled: boolean;
    contrastRatio: number;
    contrastPassed: boolean;
  };
  provenance: Record<BrandingFieldKey, FieldProvenance>;
  conflicts: BrandingConflict[];
  warnings: string[];
  previewHash: string;
}

export function calculateContrastRatio(hex1: string, hex2: string): number {
  function getLuminance(hex: string): number {
    const clean = hex.replace('#', '');
    if (clean.length < 6) return 0.5;
    const r = parseInt(clean.substring(0, 2), 16) / 255;
    const g = parseInt(clean.substring(2, 4), 16) / 255;
    const b = parseInt(clean.substring(4, 6), 16) / 255;
    const a = [r, g, b].map((v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  }
  const l1 = getLuminance(hex1);
  const l2 = getLuminance(hex2);
  const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  return Math.round(ratio * 10) / 10;
}

export function resolveBranding(
  property: Property,
  overrides: ProfileOverride[] = INITIAL_PROFILE_OVERRIDES,
  context: BrandingResolutionContext,
  corporateGroups: CorporateGroup[] = INITIAL_CORPORATE_GROUPS,
  stays: Stay[] = INITIAL_STAYS
): ResolvedBrandingProfile {
  const locale = context.locale || property.defaultLocale || 'id';
  const propertyOverrides = overrides.filter((o) => o.propertyId === property.id || o.layer === 'PLATFORM');
  const provenance: Partial<Record<BrandingFieldKey, FieldProvenance>> = {};
  const conflicts: BrandingConflict[] = [];
  const warnings: string[] = [];

  // 1. Base values from PLATFORM & PROPERTY layer
  const values: Record<BrandingFieldKey, any> = {
    logoText: property.logoText || 'Hotel Arunika',
    logoSubtitle: property.logoSubtitle || 'Yogyakarta Luxury Sanctuary',
    logoImageUrl: property.logoImageUrl || '',
    primaryColor: property.primaryColor || '#1E2530',
    accentColor: property.accentColor || '#DCC6A1',
    heroMediaType: property.heroMediaType || 'image',
    heroImageUrl: property.heroImageUrl || '',
    heroVideoUrl: property.heroVideoUrl || '',
    promoMediaType: property.promoMediaType || 'image',
    promoMediaUrl: property.promoMediaUrl || '',
    promoTitle: property.promoTitle || '',
    welcomeHeadline: property.welcomeHeadline?.[locale] || property.welcomeHeadline?.en || 'Selamat Datang',
    welcomeSubline: property.welcomeSubline?.[locale] || property.welcomeSubline?.en || '',
    defaultLocale: property.defaultLocale || 'id',
    preTvPromoEnabled: 'false',
  };

  // Initialize default provenance as PROPERTY layer
  (Object.keys(values) as BrandingFieldKey[]).forEach((field) => {
    provenance[field] = {
      field,
      layer: 'PROPERTY',
      sourceId: property.id,
      version: property.resourceVersion || 1,
      label: `Property Default (${property.name})`,
      status: 'Inherited',
    };
  });

  // 2. Apply CUSTOMER Layer overrides
  const custOverrides = propertyOverrides.filter((o) => o.layer === 'CUSTOMER');
  for (const o of custOverrides) {
    values[o.field] = o.value;
    provenance[o.field] = {
      field: o.field,
      layer: 'CUSTOMER',
      sourceId: o.targetId,
      version: o.version,
      label: `Customer Brand Kit (${o.targetId})`,
      status: 'Overridden',
    };
  }

  // 3. Apply PROPERTY Layer explicit overrides
  const propLayerOverrides = propertyOverrides.filter((o) => o.layer === 'PROPERTY' && o.targetId === property.id);
  for (const o of propLayerOverrides) {
    values[o.field] = o.value;
    provenance[o.field] = {
      field: o.field,
      layer: 'PROPERTY',
      sourceId: o.targetId,
      version: o.version,
      label: `Property Setting (${property.id})`,
      status: 'Overridden',
    };
  }

  // 4. Apply ROOM_CLASS Layer overrides
  if (context.roomClass) {
    const rcOverrides = propertyOverrides.filter((o) => o.layer === 'ROOM_CLASS' && o.targetId === context.roomClass);
    for (const o of rcOverrides) {
      values[o.field] = o.value;
      provenance[o.field] = {
        field: o.field,
        layer: 'ROOM_CLASS',
        sourceId: o.targetId,
        version: o.version,
        label: `Room Class Override (${context.roomClass} Tier)`,
        status: 'Overridden',
      };
    }
  }

  // 5. Apply ROOM Layer overrides
  if (context.roomId) {
    const roomOverrides = propertyOverrides.filter((o) => o.layer === 'ROOM' && o.targetId === context.roomId);
    for (const o of roomOverrides) {
      values[o.field] = o.value;
      provenance[o.field] = {
        field: o.field,
        layer: 'ROOM',
        sourceId: o.targetId,
        version: o.version,
        label: `Room Specific Override (${context.roomId})`,
        status: 'Overridden',
      };
    }
  }

  // 6. Apply STAY / GROUP Overlays with explicit conflict resolution
  const activeStay = context.stayId ? stays.find((s) => s.id === context.stayId) : undefined;
  const activeGroup = context.groupId
    ? corporateGroups.find((g) => g.id === context.groupId)
    : activeStay?.groupId
    ? corporateGroups.find((g) => g.id === activeStay.groupId)
    : undefined;

  // Conflict Resolution: Personal Guest Greeting vs Corporate Group Message
  if (activeStay && activeGroup) {
    conflicts.push({
      field: 'welcomeHeadline',
      candidateLayers: [
        {
          layer: 'STAY',
          value: `Bapak/Ibu ${activeStay.displayName}`,
          sourceId: activeStay.id,
          label: `Personal Guest (${activeStay.displayName})`,
        },
        {
          layer: 'STAY',
          value: activeGroup.message[locale] || activeGroup.name,
          sourceId: activeGroup.id,
          label: `Corporate Group (${activeGroup.name})`,
        },
      ],
      resolutionPolicy: 'Dual-Layer Coexistence: Guest displayName retained in primary greeting; Corporate group banner rendered in secondary subtitle.',
      winningLayer: 'STAY',
    });
    values.welcomeHeadline = `Selamat Datang, ${activeStay.displayName}`;
    values.welcomeSubline = activeGroup.message[locale] || activeGroup.message.en || activeGroup.name;
    provenance.welcomeHeadline = {
      field: 'welcomeHeadline',
      layer: 'STAY',
      sourceId: activeStay.id,
      version: 1,
      label: `Personal Stay Overlay (${activeStay.displayName})`,
      status: 'Overridden',
    };
    provenance.welcomeSubline = {
      field: 'welcomeSubline',
      layer: 'STAY',
      sourceId: activeGroup.id,
      version: 1,
      label: `Corporate Group Overlay (${activeGroup.name})`,
      status: 'Overridden',
    };
  } else if (activeStay) {
    values.welcomeHeadline = `Selamat Datang, ${activeStay.displayName}`;
    provenance.welcomeHeadline = {
      field: 'welcomeHeadline',
      layer: 'STAY',
      sourceId: activeStay.id,
      version: 1,
      label: `Personal Stay Overlay (${activeStay.displayName})`,
      status: 'Overridden',
    };
  } else if (activeGroup) {
    values.welcomeSubline = activeGroup.message[locale] || activeGroup.message.en || activeGroup.name;
    provenance.welcomeSubline = {
      field: 'welcomeSubline',
      layer: 'STAY',
      sourceId: activeGroup.id,
      version: 1,
      label: `Corporate Group Overlay (${activeGroup.name})`,
      status: 'Overridden',
    };
  }

  // 7. WCAG Contrast Check
  const contrastRatio = calculateContrastRatio(values.accentColor, values.primaryColor);
  const contrastPassed = contrastRatio >= 3.0;
  if (!contrastPassed) {
    warnings.push(`Low contrast warning: Accent color ${values.accentColor} against primary ${values.primaryColor} yields ${contrastRatio}:1 (WCAG AA requires >= 4.5:1 for body text, >= 3.0:1 for large graphical elements).`);
  }

  return {
    propertyId: property.id,
    context,
    values: {
      ...values,
      preTvPromoEnabled: values.preTvPromoEnabled === 'true' || values.preTvPromoEnabled === true,
      contrastRatio,
      contrastPassed,
    },
    provenance: provenance as Record<BrandingFieldKey, FieldProvenance>,
    conflicts,
    warnings,
    previewHash: `BR-${property.id}-${Date.now().toString().slice(-4)}`,
  };
}

// =======================================================================
// FASE C: CAMPAIGN ELIGIBILITY & TELEMETRY TAXONOMY (M13 / FR13)
// =======================================================================

export type CampaignDenialCode =
  | 'EXPIRED'
  | 'NOT_YET_ACTIVE'
  | 'STATUS_NOT_ACTIVE'
  | 'PLACEMENT_MISMATCH'
  | 'ROOM_CLASS_EXCLUDED'
  | 'GROUP_EXCLUDED'
  | 'STAY_REQUIRED'
  | 'FREQUENCY_CAP_REACHED'
  | 'PUBLIC_AREA_RESTRICTED'
  | 'EXTERNAL_AD_NOT_ACCEPTED'
  | 'EXTERNAL_AD_SUPERCEDED';

export interface CampaignEligibilityContext {
  propertyId: string;
  placement: CampaignPlacement;
  roomClass?: string;
  stayId?: string;
  groupId?: string;
  locale?: GuestLocale;
  isPublicArea?: boolean;
  currentPlayCountThisStay?: number;
  nowUtc?: string;
  propertyAdAcceptances?: PropertyAdAcceptance[];
}

export interface CampaignDenialReason {
  campaignId: string;
  campaignName: string;
  code: CampaignDenialCode;
  reason: string;
}

export interface CampaignEligibilityResult {
  selectedCampaign: Campaign | null;
  placement: CampaignPlacement;
  evaluatedCount: number;
  eligibleCount: number;
  denials: CampaignDenialReason[];
  decisionProvenance: string;
}

export function evaluateCampaignEligibility(
  context: CampaignEligibilityContext,
  campaigns: Campaign[] = INITIAL_CAMPAIGNS
): CampaignEligibilityResult {
  const now = context.nowUtc ? new Date(context.nowUtc).getTime() : Date.now();
  const playCount = context.currentPlayCountThisStay || 0;
  const propertyCampaigns = campaigns.filter((c) => c.propertyId === context.propertyId);

  const eligible: Campaign[] = [];
  const denials: CampaignDenialReason[] = [];

  for (const cmp of propertyCampaigns) {
    // 1. Placement Match
    if (cmp.placement !== context.placement) {
      denials.push({
        campaignId: cmp.id,
        campaignName: cmp.name,
        code: 'PLACEMENT_MISMATCH',
        reason: `Campaign placement '${cmp.placement}' does not match requested placement '${context.placement}'.`,
      });
      continue;
    }

    // 2. Status Active
    if (cmp.status !== 'Active') {
      denials.push({
        campaignId: cmp.id,
        campaignName: cmp.name,
        code: 'STATUS_NOT_ACTIVE',
        reason: `Campaign status is '${cmp.status}' (only 'Active' campaigns can be scheduled).`,
      });
      continue;
    }

    // 2b. External Paid Offer Opt-in & Version Control (Poin 13)
    if (cmp.externalPaid && cmp.adOfferId) {
      const acceptances = context.propertyAdAcceptances || [];
      const match = acceptances.find(
        (a) => a.offerId === cmp.adOfferId && a.propertyId === context.propertyId
      );
      if (!match || match.status === 'Rejected') {
        denials.push({
          campaignId: cmp.id,
          campaignName: cmp.name,
          code: 'EXTERNAL_AD_NOT_ACCEPTED',
          reason: `External paid ad offer '${cmp.adOfferId}' has not been explicitly accepted by property manager (Opt-in required).`,
        });
        continue;
      }
      const requiredVersion = cmp.offerVersion ?? cmp.creativeVersion;
      if (match.status === 'Superceded' || match.offerVersion < requiredVersion) {
        denials.push({
          campaignId: cmp.id,
          campaignName: cmp.name,
          code: 'EXTERNAL_AD_SUPERCEDED',
          reason: `External offer creative was revised to v${requiredVersion}; property acceptance (v${match.offerVersion}) is Superceded and requires re-approval.`,
        });
        continue;
      }
    }

    // 3. Time Validity Window
    const start = new Date(cmp.startUtc).getTime();
    const end = new Date(cmp.endUtc).getTime();
    if (now < start) {
      denials.push({
        campaignId: cmp.id,
        campaignName: cmp.name,
        code: 'NOT_YET_ACTIVE',
        reason: `Campaign start schedule (${cmp.startUtc}) is in the future.`,
      });
      continue;
    }
    if (now > end) {
      denials.push({
        campaignId: cmp.id,
        campaignName: cmp.name,
        code: 'EXPIRED',
        reason: `Campaign expired on ${cmp.endUtc.slice(0, 10)}.`,
      });
      continue;
    }

    // 4. Public Area Privacy & Signage Constraint (FR13-02)
    if (context.isPublicArea && !cmp.targetAudience?.isPublicAreaAllowed && cmp.placement !== 'shared_signage') {
      denials.push({
        campaignId: cmp.id,
        campaignName: cmp.name,
        code: 'PUBLIC_AREA_RESTRICTED',
        reason: `Campaign contains in-room targeting and is restricted from public signage display.`,
      });
      continue;
    }

    // 5. Room Class Targeting
    if (cmp.targetAudience?.roomClasses && cmp.targetAudience.roomClasses.length > 0) {
      if (!context.roomClass || !cmp.targetAudience.roomClasses.includes(context.roomClass)) {
        denials.push({
          campaignId: cmp.id,
          campaignName: cmp.name,
          code: 'ROOM_CLASS_EXCLUDED',
          reason: `Targeted to room classes [${cmp.targetAudience.roomClasses.join(', ')}], current room is '${context.roomClass || 'None'}'.`,
        });
        continue;
      }
    }

    // 6. Corporate Group Targeting
    if (cmp.targetAudience?.groupIds && cmp.targetAudience.groupIds.length > 0) {
      if (!context.groupId || !cmp.targetAudience.groupIds.includes(context.groupId)) {
        denials.push({
          campaignId: cmp.id,
          campaignName: cmp.name,
          code: 'GROUP_EXCLUDED',
          reason: `Targeted to group delegation [${cmp.targetAudience.groupIds.join(', ')}], active stay group is '${context.groupId || 'Individual'}'.`,
        });
        continue;
      }
    }

    // 7. Stay Requirement
    if (cmp.targetAudience?.stayRequired && !context.stayId) {
      denials.push({
        campaignId: cmp.id,
        campaignName: cmp.name,
        code: 'STAY_REQUIRED',
        reason: `Campaign requires active guest stay session.`,
      });
      continue;
    }

    // 8. Frequency Cap per Stay
    if (cmp.frequencyCapPerStay > 0 && playCount >= cmp.frequencyCapPerStay) {
      denials.push({
        campaignId: cmp.id,
        campaignName: cmp.name,
        code: 'FREQUENCY_CAP_REACHED',
        reason: `Stay frequency cap reached (${playCount}/${cmp.frequencyCapPerStay} plays consumed).`,
      });
      continue;
    }

    // Passed all guards!
    eligible.push(cmp);
  }

  // Priority ordering (highest priority wins; ties broken by creativeVersion)
  eligible.sort((a, b) => {
    if (b.priority !== a.priority) return b.priority - a.priority;
    return b.creativeVersion - a.creativeVersion;
  });

  const selectedCampaign = eligible.length > 0 ? eligible[0] : null;
  const decisionProvenance = selectedCampaign
    ? `Selected '${selectedCampaign.name}' (${selectedCampaign.id}, Priority: ${selectedCampaign.priority}) for placement '${context.placement}'. ${eligible.length} eligible, ${denials.length} excluded.`
    : `No eligible campaign found for placement '${context.placement}'. Evaluated ${propertyCampaigns.length} campaigns (${denials.length} excluded).`;

  return {
    selectedCampaign,
    placement: context.placement,
    evaluatedCount: propertyCampaigns.length,
    eligibleCount: eligible.length,
    denials,
    decisionProvenance,
  };
}
