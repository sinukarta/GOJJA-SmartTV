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
}

export interface Subscription {
  id: string;
  customerId: string;
  propertyId: string;
  buyerId: string;
  buyerType: 'ISP' | 'CUSTOMER';
  planName: string;
  planVersion: string;
  seats: number;
  unitPriceIdr: number;
  status: 'Active' | 'Trial' | 'PastDue';
  effectiveDate: string;
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

export interface CapabilityFlag {
  capability: string;
  status: 'Supported' | 'Limited' | 'Unsupported' | 'Unknown';
  route: string;
  evidenceType: 'DemoFixture' | 'LiveObserved';
  limitation: string;
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

export interface ProfileOverride {
  id: string;
  propertyId: string;
  layer: 'PLATFORM' | 'CUSTOMER' | 'PROPERTY' | 'ROOM_CLASS' | 'ROOM' | 'STAY';
  targetId: string;
  field: 'accentColor' | 'welcomeHeadline' | 'logoText' | 'defaultLocale' | 'preTvPromoEnabled';
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

export interface Campaign {
  id: string;
  propertyId: string;
  name: string;
  category: 'Spa & Wellness' | 'Corporate Welcome' | 'Fine Dining' | 'Pool & Leisure' | 'External Offer';
  placement: 'home_hero' | 'welcome_screen' | 'service_detail' | 'pre_live_tv';
  status: 'Active' | 'Draft' | 'Scheduled' | 'Expired' | 'Paused';
  priority: number;
  frequencyCapPerStay: number;
  durationSeconds: number;
  skippableAfterSeconds: number;
  startUtc: string;
  endUtc: string;
  imageUrl: string;
  headline: Record<GuestLocale, string>;
  ctaLabel: Record<GuestLocale, string>;
  creativeVersion: number;
  startsCount: number;
  completedCount: number;
  skippedCount: number;
  interruptedCount: number;
  failedAfterStartCount: number;
  totalPlaySeconds: number;
}

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
  lineDescription: string;
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

export interface UpdateJob {
  id: string;
  propertyId: string;
  endpointId: string;
  roomId: string;
  releaseId: string;
  stage:
    | 'AwaitingApproval'
    | 'AwaitingReadiness'
    | 'Staged'
    | 'Installing'
    | 'Verifying'
    | 'Healthy'
    | 'Deferred'
    | 'OutcomeUnknown'
    | 'Failed';
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
  observedModel?: string;
  observedManufacturer?: string;
  observedAndroidVersion?: string;
  observedSdkInt?: number;
  observedBuildFingerprint?: string;
  observedSerial?: string;
  assignedRoomId?: string | null;
  lastObservedUtc: string;
  origin: 'SEEDED' | 'LIVE_OBSERVATION' | 'SIMULATION_EVENT';
  executionMode: 'SIMULATED' | 'LIVE';
  notes: string;
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
    description: 'Commercial and product governance, plan catalog review, and aggregate business KPIs.',
    permissions: ['plans.read', 'plans.manage', 'subscriptions.read', 'customers.read', 'properties.read', 'analytics.read', 'audit.read'],
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
      'contracts.read',
      'contracts.verify',
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
    id: 'SUB-01',
    customerId: 'C-01',
    propertyId: 'P-01',
    buyerId: 'ISP-A',
    buyerType: 'ISP',
    planName: 'Hospitality Core Wholesale (H)',
    planVersion: '2026.10-W1',
    seats: 12,
    unitPriceIdr: 15000,
    status: 'Active',
    effectiveDate: '2026-10-01',
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
    unitPriceIdr: 15000,
    status: 'Active',
    effectiveDate: '2026-10-01',
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
    unitPriceIdr: 25000,
    status: 'Active',
    effectiveDate: '2026-10-15',
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
    providerName: 'Nusantara Vision Hospitality (F-A)',
    basis: 'room',
    quantity: 6,
    status: 'Active',
    packages: ['PKG-BASIC', 'PKG-INTL', 'PKG-SPORTS'],
    allowedRoomClasses: ['Standard', 'Deluxe', 'Suite'],
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
    name: 'Nusantara News HD',
    category: 'News',
    packageId: 'PKG-BASIC',
    providerId: 'F-A',
    language: 'ID',
    currentProgram: {
      id: 'Laporan Utama Petang: Ekonomi Digital ASEAN',
      en: 'Evening Headline Report: ASEAN Digital Economy',
      'zh-CN': '晚间头条：东盟数字经济观察',
      'ja-JP': 'イブニングニュース：ASEANデジタル経済',
    },
    programTime: '18:00 – 19:30',
    streamUrlHint: 'hls://demo-headend.local/ch01/manifest.m3u8',
    thumbnailUrl: '/assets/aistudio/Hotel_Tentrem_SmartTV_App_Showcase_62a23bd8.png',
  },
  {
    id: 'CH-02',
    number: '002',
    name: 'World Journey Documentary',
    category: 'Entertainment',
    packageId: 'PKG-INTL',
    providerId: 'F-A',
    language: 'EN',
    currentProgram: {
      id: 'Warisan Arsitektur Nusantara & Kyoto',
      en: 'Sacred Architecture of Java & Kyoto',
      'zh-CN': '爪哇与京都的传统建筑遗产',
      'ja-JP': 'ジャワと京都の伝統建築紀行',
    },
    programTime: '18:30 – 20:00',
    streamUrlHint: 'hls://demo-headend.local/ch02/manifest.m3u8',
    thumbnailUrl: '/assets/aistudio/GOJJA_SmartTV_linen_hospitality_dashboard_886c6353.png',
  },
  {
    id: 'CH-03',
    number: '003',
    name: 'Family Cinema Asia',
    category: 'Movies',
    packageId: 'PKG-INTL',
    providerId: 'F-A',
    language: 'EN / ID Sub',
    currentProgram: {
      id: 'Sinema Pilihan: Senja di Borobudur',
      en: 'Feature Film: Twilight Over Borobudur',
      'zh-CN': '精选电影：婆罗浮屠的黄昏',
      'ja-JP': '特別上映：ボロブドゥールの夕暮れ',
    },
    programTime: '18:00 – 20:15',
    streamUrlHint: 'hls://demo-headend.local/ch03/manifest.m3u8',
    thumbnailUrl: '/assets/aistudio/Hotel_Tentrem_SmartTV_App_Showcase_62a23bd8.png',
  },
  {
    id: 'CH-04',
    number: '004',
    name: 'Arena Sport Live 4K',
    category: 'Sports',
    packageId: 'PKG-SPORTS',
    providerId: 'F-A',
    language: 'ID / EN',
    currentProgram: {
      id: 'Siaran Langsung: Sepak Bola Kualifikasi Piala Dunia (Suite Exclusive)',
      en: 'Live Football: World Cup Asian Qualifier (Suite Tier)',
      'zh-CN': '现场直播：世界杯亚洲区预选赛（套房专享）',
      'ja-JP': 'ライブ中継：ワールドカップアジア予選（スイート限定）',
    },
    programTime: '18:00 – 20:00',
    streamUrlHint: 'hls://demo-headend.local/ch04/manifest.m3u8',
    thumbnailUrl: '/assets/aistudio/Hotel_Tentrem_SmartTV_App_Showcase_62a23bd8.png',
  },
  {
    id: 'CH-05',
    number: '005',
    name: 'Hotel Sanctuary Channel',
    category: 'Hotel',
    packageId: 'PKG-FREE',
    providerId: 'PROPERTY-LOCAL',
    language: 'Multi-Locale',
    currentProgram: {
      id: 'Panduan Kuliner Kayumanis, Spa & Layanan Concierge 24 Jam',
      en: 'Kayumanis Culinary Guide, Royal Spa & 24-Hour Concierge',
      'zh-CN': '酒店美食、水疗及24小时礼宾指南',
      'ja-JP': '館内ダイニング、スパ＆24時間コンシェルジュ案内',
    },
    programTime: '24 Hours Loop',
    streamUrlHint: 'local://property-media/welcome-arunika.mp4',
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
    endUtc: '2026-11-03T12:00:00Z',
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
    lineDescription: 'GOJJA Hospitality Core Wholesale — 12 Contracted Seats × Rp15,000',
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
    lineDescription: 'GOJJA Hospitality Core Wholesale — 8 Contracted Seats × Rp15,000',
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
    lineDescription: 'GOJJA Hospitality Core Direct — 10 Contracted Seats × Rp25,000',
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
