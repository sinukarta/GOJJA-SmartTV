import {ApiRequestError} from './data/tvApiErrors';
import {StudioSection} from './components/StudioSection';
import { TvEntertainmentSettings } from './components/TvEntertainmentSettings';
import { TvStudioSettings } from './components/TvStudioSettings';
import { resolveTvExperience, hasEntertainmentEntitlement, resolveLegacyDemoMedia, type TvExperienceSettings } from './data/tvExperience';
import React, { useEffect, useState, useCallback } from 'react';
import {
  LayoutDashboard,
  Tv,
  Users,
  Palette,
  Radio,
  Megaphone,
  Bell,
  BarChart3,
  CreditCard,
  LifeBuoy,
  Radar,
  ShieldCheck,
  Sun,
  Moon,
  Search,
  Calendar,
  ChevronRight,
  ChevronDown,
  RotateCcw,
  LogOut,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Plus,
  Play,
  Layers,
  Building2,
  FileCheck2,
  Lock,
  Sparkles,
  Menu,
  Globe,
  Wifi,
  Bed,
  Download,
  Award,
  ExternalLink,
  Settings,
  HelpCircle,
  X,
  Upload,
  Video,
  Image as ImageIcon,
  Terminal,
  Trash2,
  ShoppingBag,
  Store,
  Handshake,
  Tag,
  Eye,
  EyeOff,
} from 'lucide-react';
import {
  EnvironmentId,
  CmsLocale,
  GuestLocale,
  RoleId,
  RoleDefinition,
  UserAccount,
  Partner,
  Customer,
  Property,
  Subscription,
  Room,
  Endpoint,
  Stay,
  CorporateGroup,
  ProviderContract,
  Channel,
  Campaign,
  Publication,
  ProfileOverride,
  Invoice,
  Receipt,
  ReleaseArtifact,
  PropertyUpdateApproval,
  UpdateJob,
  SupportTicket,
  ConnectorRegistration,
  DiscoveryCandidate,
  DiscoveryRun,
  AuditEvent,
  ScenarioDefinition,
  CURATED_BRAND_MEDIA_PRESETS,
  GOJJA_CLEANTV_PACKAGES,
  AdOffer,
  PropertyAdAcceptance,
  MarketplaceItem,
  ServiceOrder,
  ServiceOrderStatus,
  maskGuestName,
  ROLES_CATALOG,
  USER_ACCOUNTS,
  INITIAL_PARTNERS,
  INITIAL_CUSTOMERS,
  INITIAL_PROPERTIES,
  INITIAL_SUBSCRIPTIONS,
  INITIAL_ROOMS,
  INITIAL_ENDPOINTS,
  INITIAL_STAYS,
  INITIAL_CORPORATE_GROUPS,
  INITIAL_CONTRACTS,
  INITIAL_CHANNELS,
  INITIAL_CAMPAIGNS,
  INITIAL_PUBLICATIONS,
  INITIAL_PROFILE_OVERRIDES,
  INITIAL_INVOICES,
  INITIAL_RECEIPTS,
  INITIAL_AD_OFFERS,
  INITIAL_PROPERTY_AD_ACCEPTANCES,
  INITIAL_MARKETPLACE_ITEMS,
  INITIAL_SERVICE_ORDERS,
  INITIAL_RELEASES,
  INITIAL_UPDATE_APPROVALS,
  INITIAL_UPDATE_JOBS,
  INITIAL_TICKETS,
  INITIAL_CONNECTORS,
  INITIAL_DEMO_CANDIDATES,
  SCENARIOS_CATALOG,
  ANALYTICS_FIXTURE,
} from './data/mockData';
import { GojjaWordmark, RollingKpiValue } from './components/GojjaWordmark';
import { TvGuestAppView } from './components/TvGuestAppModal';
import { DeviceDiscoveryView } from './components/DeviceDiscoveryView';
import { LoginLandingView } from './components/LoginLandingView';

const CMS_UI_STRINGS: Record<
  CmsLocale,
  {
    navOverview: string;
    navTenants: string;
    navRooms: string;
    navDevices: string;
    navDiscovery: string;
    navBranding: string;
    navTvServices: string;
    navCampaigns: string;
    navMarketplace: string;
    navChannels: string;
    navUpdates: string;
    navAnalytics: string;
    navUsers: string;
    navBilling: string;
    navSupport: string;
    navSettings: string;
    groupWorkspace: string;
    groupAdmin: string;
    needHelp: string;
    searchPlaceholder: string;
    propOverviewTitle: string;
    propOverviewSub: string;
    scanDevicesBtn: string;
    connectorReqNote: string;
    openTvPreviewBtn: string;
    kpiLicensedTvs: string;
    kpiTvsOnline: string;
    kpiOccupiedRooms: string;
    kpiActiveCampaigns: string;
    kpiUpdatesPending: string;
    kpiMonthlyPlan: string;
    deviceRoomHealthTitle: string;
    viewAllDevices: string;
    playbackInsightsTitle: string;
    playbackInsightsSub: string;
    brandWelcomeCard: string;
    openBrandStudioBtn: string;
    updateApprovalsCard: string;
    reviewScheduleBtn: string;
    recentActivityCard: string;
    roomsHeaderTitle: string;
    roomsHeaderSub: string;
    addRoomBtn: string;
    roomTvLocaleLabel: string;
    brandStudioTitle: string;
    brandStudioSub: string;
    brandStep1: string;
    brandStep2: string;
    brandStep3: string;
    brandStep4: string;
    tvLocaleControlTitle: string;
    tvLocaleControlSub: string;
    applyTvLocaleBtn: string;
    tvPreviewHeader: string;
    tvPreviewSub: string;
    fullScreenTvBtn: string;
    saveDraftBtn: string;
    publishToTvsBtn: string;
    settingsTitle: string;
    settingsSub: string;
  }
> = {
  id: {
    navOverview: 'Ringkasan',
    navTenants: 'Tenant & Mitra ISP',
    navRooms: 'Kamar & Tamu',
    navDevices: 'Perangkat TV',
    navDiscovery: 'Pindai & Deploy',
    navBranding: 'Brand Studio & TV',
    navTvServices: 'Pustaka Konten',
    navCampaigns: 'Kampanye Promo',
    navMarketplace: 'Marketplace & Iklan',
    navChannels: 'Saluran & Paket TV',
    navUpdates: 'Pembaruan OTA',
    navAnalytics: 'Analitik Tayangan',
    navUsers: 'Pengguna & RBAC',
    navBilling: 'Langganan & Tagihan',
    navSupport: 'Dukungan & QA',
    navSettings: 'Pengaturan',
    groupWorkspace: 'RUANG KERJA',
    groupAdmin: 'ADMINISTRASI',
    needHelp: 'Butuh bantuan?',
    searchPlaceholder: 'Cari kamar, perangkat TV, atau konten...',
    propOverviewTitle: 'Ringkasan Properti',
    propOverviewSub: 'Setiap layar. Setiap masa menginap. Satu pengalaman terhubung.',
    scanDevicesBtn: 'Pindai perangkat',
    connectorReqNote: 'ⓘ Membutuhkan konektor lokal',
    openTvPreviewBtn: 'Buka Pratinjau TV (4 Bahasa)',
    kpiLicensedTvs: 'Lisensi TV',
    kpiTvsOnline: 'TV Online',
    kpiOccupiedRooms: 'Kamar Terisi',
    kpiActiveCampaigns: 'Kampanye Aktif',
    kpiUpdatesPending: 'Update Tertunda',
    kpiMonthlyPlan: 'Paket Bulanan',
    deviceRoomHealthTitle: 'Kesehatan Perangkat & Kamar',
    viewAllDevices: 'Lihat semua kamar & TV',
    playbackInsightsTitle: 'Analitik Pemutaran TV',
    playbackInsightsSub: 'Sesi tayangan harian di seluruh layar kamar',
    brandWelcomeCard: 'Brand & Sambutan TV (4 Bahasa)',
    openBrandStudioBtn: 'Buka Brand Studio',
    updateApprovalsCard: 'Persetujuan Pembaruan',
    reviewScheduleBtn: 'Tinjau jadwal OTA',
    recentActivityCard: 'Aktivitas Terbaru',
    roomsHeaderTitle: 'Kamar, Tamu & Bahasa Layar TV',
    roomsHeaderSub:
      'Atur okupansi tamu, kesiapan Housekeeping, dan ubah Bahasa Antarmuka TV Kamar secara langsung (4 Bahasa: EN, ID, 中文, 日本語).',
    addRoomBtn: 'Tambah Kamar',
    roomTvLocaleLabel: 'Bahasa TV Kamar (4 Bahasa)',
    brandStudioTitle: 'Brand Studio, Bahasa TV (4 Bahasa) & GojjaLauncher',
    brandStudioSub:
      'Unggah logo hotel, video/foto background TV, video promosi, atur 4 bahasa layar TV (EN, ID, 中文, 日本語), dan ganti launcher bawaan SmartTV via ADB.',
    brandStep1: '1. Logo Brand Hotel (Unggah / Preset / Teks)',
    brandStep2: '2. Background Beranda TV (Foto 4K atau Video Loop)',
    brandStep3: '3. Video / Gambar Promosi (Layar 04 Promo)',
    brandStep4: '4. Warna Tema & Pengaturan 4 Bahasa Layar TV (EN, ID, 中文, 日本語)',
    tvLocaleControlTitle: 'Pengaturan Bahasa: Login/CMS (2 Bahasa) vs Antarmuka SmartTV (4 Bahasa)',
    tvLocaleControlSub:
      'Login & CMS menggunakan 2 bahasa (Indonesia & Inggris), sedangkan antarmuka SmartTV kamar mendukung 4 bahasa (Inggris, Indonesia, Cina 中文, dan Jepang 日本語) yang dapat diubah langsung dari sini.',
    applyTvLocaleBtn: 'Terapkan Bahasa TV ke Semua Kamar',
    tvPreviewHeader: 'Pratinjau Beranda TV (Kanvas Interaktif 4 Bahasa)',
    tvPreviewSub:
      'Klik tombol bahasa EN / ID / 中文 / 日本語 atau tab 06 Bahasa (4) di layar TV untuk menguji perubahan bahasa secara real-time.',
    fullScreenTvBtn: 'Pratinjau TV Layar Penuh',
    saveDraftBtn: 'Simpan Draf',
    publishToTvsBtn: 'Publikasikan ke Seluruh TV',
    settingsTitle: 'Pengaturan Properti, Bahasa & Lingkungan Kerja',
    settingsSub:
      'Kelola bahasa Dashboard CMS (2 Bahasa: ID / EN), bahasa default layar SmartTV Tamu (4 Bahasa: EN / ID / 中文 / 日本語), Wi-Fi, dan mode runtime.',
  },
  en: {
    navOverview: 'Overview',
    navTenants: 'Tenants & ISPs',
    navRooms: 'Rooms & Guests',
    navDevices: 'Devices',
    navDiscovery: 'Discovery & Deploy',
    navBranding: 'Brand Studio',
    navTvServices: 'Content Library',
    navCampaigns: 'Campaigns',
    navMarketplace: 'Marketplace & Ads',
    navChannels: 'Channels & Packages',
    navUpdates: 'Updates',
    navAnalytics: 'Analytics',
    navUsers: 'Users & Access',
    navBilling: 'Subscription',
    navSupport: 'Support',
    navSettings: 'Settings',
    groupWorkspace: 'WORKSPACE',
    groupAdmin: 'ADMINISTRATION',
    needHelp: 'Need help?',
    searchPlaceholder: 'Search rooms, devices or content...',
    propOverviewTitle: 'Property Overview',
    propOverviewSub: 'Every screen. Every stay. One connected experience.',
    scanDevicesBtn: 'Scan devices',
    connectorReqNote: 'ⓘ Local connector required',
    openTvPreviewBtn: 'Open TV preview (4 Languages)',
    kpiLicensedTvs: 'Licensed TVs',
    kpiTvsOnline: 'TVs online',
    kpiOccupiedRooms: 'Occupied rooms',
    kpiActiveCampaigns: 'Active campaigns',
    kpiUpdatesPending: 'Updates pending',
    kpiMonthlyPlan: 'Monthly plan',
    deviceRoomHealthTitle: 'Device & Room Health',
    viewAllDevices: 'View all devices',
    playbackInsightsTitle: 'Playback Insights',
    playbackInsightsSub: 'Daily playback sessions across all endpoints',
    brandWelcomeCard: 'Brand & Welcome (4 Languages)',
    openBrandStudioBtn: 'Open Brand Studio',
    updateApprovalsCard: 'Update Approvals',
    reviewScheduleBtn: 'Review schedule',
    recentActivityCard: 'Recent Activity',
    roomsHeaderTitle: 'Rooms, Guests & TV Interface Language',
    roomsHeaderSub:
      'Manage guest occupancy, Housekeeping readiness, and switch in-room SmartTV language directly from the dashboard (4 Languages: EN, ID, 中文, 日本語).',
    addRoomBtn: 'Add Room',
    roomTvLocaleLabel: 'Room TV Language (4 Locales)',
    brandStudioTitle: 'Brand Studio, TV Languages (4) & SmartTV Launcher',
    brandStudioSub:
      'Upload real hotel logos, looping background videos/photos, promotional videos, configure 4 TV guest languages (EN, ID, 中文, 日本語), and replace stock SmartTV launchers via ADB.',
    brandStep1: '1. Hotel Brand Logo (Upload / Preset / Text)',
    brandStep2: '2. TV Home Background (Photo or Video Loop)',
    brandStep3: '3. Promotional Video / Image (04 Promo Screen)',
    brandStep4: '4. Theme Colors & 4-Language SmartTV Setup (EN, ID, 中文, 日本語)',
    tvLocaleControlTitle: 'Language Architecture: Login/CMS (2 Languages) vs. SmartTV Interface (4 Languages)',
    tvLocaleControlSub:
      'Login & CMS Dashboard use 2 operational languages (Indonesian & English), while the in-room SmartTV Guest Interface supports 4 full languages (English, Indonesian, Chinese 中文, and Japanese 日本語) controllable directly from the dashboard.',
    applyTvLocaleBtn: 'Push TV Language to All Rooms',
    tvPreviewHeader: 'TV Home Preview (Live Interactive 4-Language Canvas)',
    tvPreviewSub:
      'Click EN / ID / 中文 / 日本語 or tab 06 Language (4) inside the TV preview below to test live language switching.',
    fullScreenTvBtn: 'Full-Screen TV Preview',
    saveDraftBtn: 'Save draft',
    publishToTvsBtn: 'Publish changes to TVs',
    settingsTitle: 'Property, Language & Workspace Settings',
    settingsSub:
      'Configure CMS Dashboard language (2 options: ID / EN), default SmartTV Guest Interface language (4 options: EN / ID / 中文 / 日本語), Wi-Fi, and runtime mode.',
  },
};

type NavTabId =
  | 'overview'
  | 'tenants'
  | 'rooms'
  | 'guests'
  | 'devices'
  | 'discovery'
  | 'branding'
  | 'tv-services'
  | 'campaigns'
  | 'marketplace'
  | 'channels'
  | 'updates'
  | 'analytics'
  | 'users'
  | 'billing'
  | 'support-qa'
  | 'settings';

function getAllowedTabsForRole(roleId: RoleId): NavTabId[] {
  switch (roleId) {
    case 'R-01': // Product / Business Owner (GOJJA HQ)
      return ['overview', 'tenants', 'tv-services', 'branding', 'campaigns', 'marketplace', 'channels', 'analytics', 'users', 'billing', 'settings'];
    case 'R-02': // Platform Administrator (GOJJA HQ)
      return ['overview', 'tenants', 'rooms', 'devices', 'tv-services', 'branding', 'campaigns', 'marketplace', 'channels', 'users', 'billing', 'support-qa', 'settings'];
    case 'R-03': // Technical Administrator (GOJJA HQ)
      return ['overview', 'devices', 'updates', 'support-qa', 'users'];
    case 'R-04': // Security Administrator (GOJJA HQ)
      return ['overview', 'users', 'support-qa', 'settings'];
    case 'R-05': // GOJJA Finance (GOJJA HQ)
      return ['overview', 'tenants', 'billing', 'users'];
    case 'R-06': // Support Operator (GOJJA HQ)
      return ['overview', 'devices', 'support-qa', 'users'];
    case 'R-07': // Compliance Auditor (GOJJA HQ)
      return ['overview', 'analytics', 'billing', 'support-qa'];
    case 'R-08': // ISP Partner Administrator
      return ['overview', 'tenants', 'rooms', 'devices', 'channels', 'billing', 'support-qa', 'users'];
    case 'R-09': // Partner / Assigned Field Installer
      return ['overview', 'devices', 'discovery', 'rooms'];
    case 'R-10': // Property Owner
      return ['overview', 'rooms', 'devices', 'branding', 'tv-services', 'campaigns', 'marketplace', 'channels', 'updates', 'analytics', 'billing', 'settings'];
    case 'R-11': // Property Manager
      return ['overview', 'rooms', 'devices', 'branding', 'tv-services', 'campaigns', 'marketplace', 'channels', 'updates', 'analytics', 'support-qa', 'settings', 'users'];
    case 'R-12': // Content Editor
      return ['overview', 'branding', 'tv-services', 'campaigns', 'marketplace'];
    case 'R-13': // Front Office
      return ['overview', 'rooms', 'devices', 'marketplace'];
    case 'R-14': // Property Analyst
      return ['overview', 'analytics', 'marketplace'];
    case 'R-15': // Property Finance
      return ['overview', 'billing'];
    case 'R-16': // In-Room Guest
      return ['overview'];
    default:
      return ['overview', 'rooms', 'devices'];
  }
}

interface BootstrapPayload {
  environmentId: EnvironmentId;
  clockUtc: string;
  currentUser: UserAccount;
  currentRole: RoleDefinition;
  rolesCatalog: RoleDefinition[];
  userAccounts: UserAccount[];
  scenariosCatalog: ScenarioDefinition[];
  analyticsFixture: {
    campaignSummary: {
      campaignId: string;
      campaignName: string;
      periodLabel: string;
      starts: number;
      completed: number;
      skipped: number;
      interrupted: number;
      failedAfterStart: number;
      totalPlaySeconds: number;
      completionRatePercent: number;
      quartiles: { q25: number; q50: number; q75: number };
    };
    channelSummary: {
      propertyId: string;
      attempts: number;
      starts: number;
      failedBeforeStart: number;
      validSessionDurationsSeconds: number[];
      totalPlaySeconds: number;
      totalPlayMinutes: number;
      medianSessionSeconds: number;
      uniqueReportingEndpoints: number;
      targetEndpoints: number;
      reportingCoveragePercent: number;
    };
    serviceFunnel: {
      tileExposures: number;
      detailOpens: number;
      qrLandingSessions: number;
      serviceRequests: number;
      confirmedBookings: number;
      fulfilledPaid: number;
    };
    dailyPlaybackTrend: Array<{ date: string; starts: number; playMinutes: number }>;
  };
  hostRuntime: {
    adb: { available: boolean; version: string; path: string };
    interfaces: Array<{ name: string; address: string; netmask: string; cidr: string; internal: boolean }>;
    platform: string;
  };
  kpis: {
    totalContractedSeats: number;
    totalAllocatedSeats: number;
    totalAvailableSeats: number;
    totalRooms: number;
    onlineEndpointsCount: number;
    offlineEndpointsCount: number;
    occupiedRoomsCount: number;
    vacantRoomsCount: number;
    totalIssuedIdr: number;
    totalPaidIdr: number;
    totalOutstandingIdr: number;
  };
  data: {
    partners: Partner[];
    customers: Customer[];
    properties: Property[];
    subscriptions: Subscription[];
    rooms: Room[];
    endpoints: Endpoint[];
    stays: Stay[];
    corporateGroups: CorporateGroup[];
    contracts: ProviderContract[];
    channels: Channel[];
    campaigns: Campaign[];
    publications: Publication[];
    profileOverrides: ProfileOverride[];
    invoices: Invoice[];
    receipts: Receipt[];
    adOffers?: AdOffer[];
    propertyAdAcceptances?: PropertyAdAcceptance[];
    marketplaceItems?: MarketplaceItem[];
    serviceOrders?: ServiceOrder[];
    releases: ReleaseArtifact[];
    updateApprovals: PropertyUpdateApproval[];
    updateJobs: UpdateJob[];
    tickets: SupportTicket[];
    connectors: ConnectorRegistration[];
    candidates: DiscoveryCandidate[];
    discoveryRuns: DiscoveryRun[];
    auditEvents: AuditEvent[];
  };
}

function createLocalFallbackBootstrap(alias: string, env: EnvironmentId): BootstrapPayload {
  const user = USER_ACCOUNTS.find((u) => u.alias === alias) || USER_ACCOUNTS[0];
  const role = ROLES_CATALOG.find((r) => r.id === user.roleId) || ROLES_CATALOG[0];
  const canReadGuestNames = role.permissions.includes('guests.name.read');

  const scopedProperties = INITIAL_PROPERTIES.filter((p) => user.propertyIds.includes(p.id));
  const scopedPropertyIds = new Set(scopedProperties.map((p) => p.id));
  const scopedRooms = INITIAL_ROOMS.filter((r) => scopedPropertyIds.has(r.propertyId));
  const scopedEndpoints = INITIAL_ENDPOINTS.filter((e) => scopedPropertyIds.has(e.propertyId));
  const scopedStays = INITIAL_STAYS.filter((s) => scopedPropertyIds.has(s.propertyId)).map((s) => ({
    ...s,
    displayName: canReadGuestNames ? s.displayName : s.displayName ? 'Guest [Redacted by Role]' : null,
  }));
  const scopedSubscriptions = INITIAL_SUBSCRIPTIONS.filter((s) => scopedPropertyIds.has(s.propertyId));
  const scopedInvoices = INITIAL_INVOICES.filter((i) => scopedPropertyIds.has(i.propertyId));

  const totalContractedSeats = scopedSubscriptions.reduce((acc, s) => acc + (s.committedQuantity ?? s.seats), 0);
  const totalAllocatedSeats = scopedSubscriptions.reduce((acc, s) => acc + (s.allocatedQuantity ?? scopedEndpoints.length), 0);
  const totalReservedSeats = scopedSubscriptions.reduce((acc, s) => acc + (s.reservedQuantity ?? 0), 0);
  const totalAvailableSeats = Math.max(0, totalContractedSeats - totalAllocatedSeats - totalReservedSeats);
  const onlineEndpointsCount = scopedEndpoints.filter((e) => e.connection === 'Online').length;
  const offlineEndpointsCount = scopedEndpoints.filter((e) => e.connection === 'Offline').length;
  const occupiedRoomIds = new Set(scopedStays.filter((s) => s.status === 'InHouse').map((s) => s.roomId));
  const occupiedRoomsCount = scopedRooms.filter((r) => occupiedRoomIds.has(r.id)).length;
  const vacantRoomsCount = scopedRooms.length - occupiedRoomsCount;
  const totalIssuedIdr = scopedInvoices.reduce((acc, i) => acc + i.totalIdr, 0);
  const totalPaidIdr = scopedInvoices.reduce((acc, i) => acc + i.paidIdr, 0);
  const totalOutstandingIdr = totalIssuedIdr - totalPaidIdr;

  return {
    environmentId: env,
    clockUtc: new Date().toISOString(),
    currentUser: user,
    currentRole: role,
    rolesCatalog: ROLES_CATALOG,
    userAccounts: USER_ACCOUNTS,
    scenariosCatalog: SCENARIOS_CATALOG,
    analyticsFixture: ANALYTICS_FIXTURE,
    hostRuntime: {
      adb: { available: false, version: 'Vercel Edge / Cloud Demo', path: 'adb' },
      interfaces: [{ name: 'eth0', address: '127.0.0.1', netmask: '255.255.255.0', cidr: '127.0.0.1/24', internal: false }],
      platform: 'Vercel Cloud Edge / Client-Side Demo',
    },
    kpis: {
      totalContractedSeats,
      totalAllocatedSeats,
      totalAvailableSeats,
      totalRooms: scopedRooms.length,
      onlineEndpointsCount,
      offlineEndpointsCount,
      occupiedRoomsCount,
      vacantRoomsCount,
      totalIssuedIdr,
      totalPaidIdr,
      totalOutstandingIdr,
    },
    data: {
      partners: INITIAL_PARTNERS,
      customers: INITIAL_CUSTOMERS,
      properties: INITIAL_PROPERTIES,
      subscriptions: INITIAL_SUBSCRIPTIONS,
      rooms: INITIAL_ROOMS,
      endpoints: INITIAL_ENDPOINTS,
      stays: scopedStays,
      corporateGroups: INITIAL_CORPORATE_GROUPS,
      contracts: INITIAL_CONTRACTS,
      channels: INITIAL_CHANNELS,
      campaigns: INITIAL_CAMPAIGNS,
      publications: INITIAL_PUBLICATIONS,
      profileOverrides: INITIAL_PROFILE_OVERRIDES,
      invoices: INITIAL_INVOICES,
      receipts: INITIAL_RECEIPTS,
      adOffers: INITIAL_AD_OFFERS,
      propertyAdAcceptances: INITIAL_PROPERTY_AD_ACCEPTANCES,
      marketplaceItems: INITIAL_MARKETPLACE_ITEMS,
      serviceOrders: INITIAL_SERVICE_ORDERS,
      releases: INITIAL_RELEASES,
      updateApprovals: INITIAL_UPDATE_APPROVALS,
      updateJobs: INITIAL_UPDATE_JOBS,
      tickets: INITIAL_TICKETS,
      connectors: INITIAL_CONNECTORS,
      candidates: INITIAL_DEMO_CANDIDATES,
      discoveryRuns: [],
      auditEvents: [],
    },
  };
}

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('gojja_cms_theme');
    return saved === 'dark' ? 'dark' : 'light';
  });
  const [cmsLocale, setCmsLocale] = useState<CmsLocale>(() => {
    const saved = localStorage.getItem('gojja_cms_locale');
    return saved === 'en' ? 'en' : 'id';
  });
  const handleChangeCmsLocale = useCallback((nextLoc: CmsLocale) => {
    setCmsLocale(nextLoc);
    localStorage.setItem('gojja_cms_locale', nextLoc);
  }, []);
  const ct = CMS_UI_STRINGS[cmsLocale];

  const [viewMode, setViewMode] = useState<'landing' | 'dashboard'>(() => {
    return (localStorage.getItem('gojja_cms_view_mode') as 'landing' | 'dashboard') || 'landing';
  });
  const [personaAlias, setPersonaAlias] = useState<string>(() => {
    return localStorage.getItem('gojja_cms_persona') || 'property-manager';
  });
  const [environmentId, setEnvironmentId] = useState<EnvironmentId>(() => {
    return (localStorage.getItem('gojja_cms_env') as EnvironmentId) || 'DEMO';
  });
  const [activeTab, setActiveTab] = useState<NavTabId>(() => {
    return (localStorage.getItem('gojja_cms_active_tab') as NavTabId) || 'overview';
  });

  useEffect(() => {
    localStorage.setItem('gojja_cms_view_mode', viewMode);
  }, [viewMode]);

  useEffect(() => {
    localStorage.setItem('gojja_cms_persona', personaAlias);
  }, [personaAlias]);

  useEffect(() => {
    localStorage.setItem('gojja_cms_env', environmentId);
  }, [environmentId]);

  useEffect(() => {
    localStorage.setItem('gojja_cms_active_tab', activeTab);
  }, [activeTab]);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>('P-01');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [bootstrap, setBootstrap] = useState<BootstrapPayload | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusBanner, setStatusBanner] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  // TV Guest App Modal state
  const [tvModalEndpointId, setTvModalEndpointId] = useState<string | null>(null);

  // Branding Editor local form state (Real Media Upload + Presets + GojjaCleanTV)
  const [brandLogoText, setBrandLogoText] = useState<string>('HOTEL ARUNIKA');
  const [brandLogoSubtitle, setBrandLogoSubtitle] = useState<string>('YOGYAKARTA');
  const [brandLogoImageUrl, setBrandLogoImageUrl] = useState<string>('');
  const [brandHeroMediaType, setBrandHeroMediaType] = useState<'image' | 'video'>('image');
  const [brandHeroImageUrl, setBrandHeroImageUrl] = useState<string>(
    '/assets/aistudio/file_00000000a6b08211935c3a540293bf6c_74821162.png'
  );
  const [brandHeroVideoUrl, setBrandHeroVideoUrl] = useState<string>(
    '/assets/tv/demo-flower.mp4'
  );
  const [brandPromoMediaType, setBrandPromoMediaType] = useState<'image' | 'video'>('video');
  const [brandPromoMediaUrl, setBrandPromoMediaUrl] = useState<string>(
    '/assets/tv/demo-flower.mp4'
  );
  const [brandPromoTitle, setBrandPromoTitle] = useState<string>(
    'Royal Javanese Spa • Complimentary 30-Min Welcome Ritual'
  );
  const [brandTvExperience, setBrandTvExperience] = useState<TvExperienceSettings>(() => resolveTvExperience());
  const [brandAccentColor, setBrandAccentColor] = useState<string>('#DCC6A1');
  const [brandPrimaryColor, setBrandPrimaryColor] = useState<string>('#1E3A2F');
  const [brandLocaleTab, setBrandLocaleTab] = useState<GuestLocale>('en');
  const [brandHeadline, setBrandHeadline] = useState<Record<GuestLocale, string>>({
    id: 'Selamat malam',
    en: 'A Sanctuary in the Heart of Yogyakarta',
    'zh-CN': '欢迎下榻日惹阿鲁尼卡酒店',
    'ja-JP': 'ジョグジャカルタの静寂なサンクチュアリへようこそ',
  });

  // GojjaCleanTV / GojjaLauncher Non-Root ADB Takeover state
  const [cleanTvProfile, setCleanTvProfile] = useState<'STRICT_KIOSK' | 'CLEAN_WITH_OTT' | 'CUSTOM'>('CLEAN_WITH_OTT');
  const [cleanTvDisabledPackages, setCleanTvDisabledPackages] = useState<string[]>([
    'com.google.android.tvlauncher',
    'com.google.android.leanbacklauncher',
    'com.google.android.leanbacklauncher.recommendations',
    'com.google.android.tungsten.setupwraith',
  ]);
  const [cleanTvTranscript, setCleanTvTranscript] = useState<string[]>([]);

  // New Campaign Upload form state
  const [newCmpName, setNewCmpName] = useState<string>('');
  const [newCmpCategory, setNewCmpCategory] = useState<Campaign['category']>('Spa & Wellness');
  const [newCmpPlacement, setNewCmpPlacement] = useState<Campaign['placement']>('home_hero');
  const [newCmpMediaType, setNewCmpMediaType] = useState<'image' | 'video'>('video');
  const [newCmpMediaUrl, setNewCmpMediaUrl] = useState<string>(
    '/assets/tv/demo-flower.mp4'
  );
  const [newCmpCta, setNewCmpCta] = useState<string>('Reserve via Concierge');

  // Room & Stay creation state
  const [roomsSubNav, setRoomsSubNav] = useState<'rooms' | 'guests' | 'groups' | 'pms'>('rooms');
  const [newRoomCode, setNewRoomCode] = useState<string>('');
  const [newRoomClass, setNewRoomClass] = useState<'Standard' | 'Deluxe' | 'Suite' | 'Studio'>('Standard');
  const [checkInRoomId, setCheckInRoomId] = useState<string>('ROOM-201');
  const [checkInSalutation, setCheckInSalutation] = useState<string>('Mr.');
  const [checkInGuestName, setCheckInGuestName] = useState<string>('');
  const [checkInLocale, setCheckInLocale] = useState<GuestLocale>('id');
  const [checkInGroupId, setCheckInGroupId] = useState<string>('');

  // Corporate Group creation state
  const [newGroupName, setNewGroupName] = useState<string>('');
  const [newGroupBadge, setNewGroupBadge] = useState<string>('VIP Tour Delegation');
  const [newGroupMessageId, setNewGroupMessageId] = useState<string>('Selamat Datang, Rombongan Tamu Terhormat');
  const [newGroupMessageEn, setNewGroupMessageEn] = useState<string>('Welcome, Distinguished Guests & Tour Delegation');

  // Finance Payment Verification form state
  const [paymentTxRef, setPaymentTxRef] = useState<string>('TRX-ALPHA-20261102-901');

  // Multi-Tenant Onboarding state (Add ISP Partner & Add Tenant Property)
  const [newIspName, setNewIspName] = useState<string>('');
  const [newIspRegion, setNewIspRegion] = useState<string>('Bali & Nusa Tenggara');
  const [newIspEmail, setNewIspEmail] = useState<string>('');
  const [newIspAdminName, setNewIspAdminName] = useState<string>('');

  const [newTenantName, setNewTenantName] = useState<string>('');
  const [newTenantCity, setNewTenantCity] = useState<string>('Bali');
  const [newTenantPartnerId, setNewTenantPartnerId] = useState<string>('ISP-A');
  const [newTenantSeats, setNewTenantSeats] = useState<number>(15);
  const [newTenantWifi, setNewTenantWifi] = useState<string>('');
  const [newTenantAdminName, setNewTenantAdminName] = useState<string>('');
  const [newTenantAdminEmail, setNewTenantAdminEmail] = useState<string>('');

  // Acceptance Test Runner state
  const [acceptanceReport, setAcceptanceReport] = useState<{
    executedAtUtc: string;
    summary: { totalChecked: number; passed: number; blockedHardware: number; failed: number };
    results: Array<{ id: string; suite: string; title: string; status: string; expected: string; actual: string }>;
  } | null>(null);

  // Fase D Poin 13: Marketplace & External Ad Network state
  const [marketplaceSubTab, setMarketplaceSubTab] = useState<'OFFERS' | 'ORDERS' | 'FUNNEL'>('OFFERS');
  const [showRawGuestNames, setShowRawGuestNames] = useState(false);
  const [revisingOfferId, setRevisingOfferId] = useState<string | null>(null);
  const [revisionHeadline, setRevisionHeadline] = useState('');
  const [revisionSubline, setRevisionSubline] = useState('');

  // Sync theme to document root
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
    }
    localStorage.setItem('gojja_cms_theme', theme);
  }, [theme]);

  // 620ms Circular Theme Reveal using View Transition API with fallback (§12.8)
  const handleToggleTheme = (e: React.MouseEvent<HTMLButtonElement>) => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const docAny = document as Document & {
      startViewTransition?: (cb: () => void) => { ready: Promise<void> };
    };

    if (!docAny.startViewTransition || prefersReduced) {
      setTheme(nextTheme);
      return;
    }

    const x = e.clientX || window.innerWidth - 40;
    const y = e.clientY || 32;
    const endRadius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

    try {
      const transition = docAny.startViewTransition(() => {
        setTheme(nextTheme);
      });
      transition.ready
        .then(() => {
          document.documentElement.animate(
            {
              clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`],
            },
            {
              duration: 620,
              easing: 'cubic-bezier(0.65, 0, 0.35, 1)',
              pseudoElement: '::view-transition-new(root)',
            }
          );
        })
        .catch(() => {
          setTheme(nextTheme);
        });
    } catch {
      setTheme(nextTheme);
    }
  };

  const handleClientSideFallbackApi = useCallback(
    (url: string, options: RequestInit = {}, persona: string = 'property-manager') => {
      const body = options.body ? JSON.parse(options.body as string) : {};

      if (url.includes('/api/bootstrap')) {
        return createLocalFallbackBootstrap(persona, environmentId);
      }

      if (url.includes('/api/marketplace/offers/accept')) {
        setBootstrap((prev) => {
          if (!prev) return prev;
          const acceptances = prev.data.propertyAdAcceptances || [];
          const newAcc: PropertyAdAcceptance = {
            id: `PAC-${Date.now()}`,
            offerId: body.offerId,
            offerVersion: 1,
            propertyId: body.propertyId || 'P-01',
            acceptedPlacements: ['home_hero', 'service_detail'],
            acceptedPeriod: { startUtc: '2026-11-01T00:00:00Z', endUtc: '2026-12-31T23:59:59Z' },
            acceptedCapPerStay: 2,
            commercialTermsRef: 'AGR-VERCEL-DEMO',
            acceptedBy: persona,
            acceptedAtUtc: new Date().toISOString(),
            status: 'Accepted',
          };
          return {
            ...prev,
            data: {
              ...prev.data,
              propertyAdAcceptances: [...acceptances.filter((a) => a.offerId !== body.offerId), newAcc],
            },
          };
        });
        return { ok: true, message: 'Tawaran iklan berhasil disetujui (Vercel Mode).' };
      }

      if (url.includes('/api/marketplace/offers/reject')) {
        setBootstrap((prev) => {
          if (!prev) return prev;
          const acceptances = prev.data.propertyAdAcceptances || [];
          return {
            ...prev,
            data: {
              ...prev.data,
              propertyAdAcceptances: acceptances.filter((a) => a.offerId !== body.offerId),
            },
          };
        });
        return { ok: true, message: 'Tawaran iklan ditolak.' };
      }

      if (url.includes('/api/marketplace/offers/update-creative')) {
        setBootstrap((prev) => {
          if (!prev) return prev;
          const offers = prev.data.adOffers || [];
          const acceptances = prev.data.propertyAdAcceptances || [];
          return {
            ...prev,
            data: {
              ...prev.data,
              adOffers: offers.map((o) => (o.id === body.offerId ? { ...o, currentVersion: o.currentVersion + 1 } : o)),
              propertyAdAcceptances: acceptances.map((a) =>
                a.offerId === body.offerId ? { ...a, status: 'Superceded' } : a
              ),
            },
          };
        });
        return { ok: true, message: 'Materi kreatif diperbarui. Acceptance otomatis Superceded (Vercel Mode).' };
      }

      if (url.includes('/api/marketplace/services/create-order')) {
        const item = INITIAL_MARKETPLACE_ITEMS.find((i) => i.id === body.itemId);
        const newOrder: ServiceOrder = {
          id: `ORD-${Date.now()}`,
          itemId: body.itemId,
          itemTitle: item?.title || 'Concierge Service',
          propertyId: body.propertyId || 'P-01',
          roomId: body.roomId,
          guestDisplayRef: 'Room 201 · Guest D*** W***',
          status: 'Requested',
          fulfilmentType: item?.fulfilmentType || 'STAFF_TICKET',
          requestedAtUtc: new Date().toISOString(),
          notes: body.notes || 'Permintaan via TV Guest',
        };
        setBootstrap((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            data: {
              ...prev.data,
              serviceOrders: [newOrder, ...(prev.data.serviceOrders || [])],
            },
          };
        });
        return { ok: true, order: newOrder, message: 'Pesanan concierge berhasil dibuat.' };
      }

      if (url.includes('/api/marketplace/services/update-order-status')) {
        setBootstrap((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            data: {
              ...prev.data,
              serviceOrders: (prev.data.serviceOrders || []).map((o) =>
                o.id === body.orderId ? { ...o, status: body.status } : o
              ),
            },
          };
        });
        return { ok: true, message: `Status pesanan diubah menjadi ${body.status}.` };
      }

      if (url.includes('/api/live-lab/scan')) {
        const run: DiscoveryRun = {
          id: `RUN-DEMO-${Date.now().toString().slice(-4)}`,
          environmentId: 'DEMO',
          connectorId: 'CON-DEMO-P-01',
          propertyId: body.propertyId || 'P-01',
          interfaceName: 'eth0',
          subnetCidr: body.subnetCidr || '192.168.10.0/24',
          portsProbed: body.ports || [5555],
          startedAtUtc: new Date().toISOString(),
          completedAtUtc: new Date().toISOString(),
          hostsAttempted: 254,
          candidatesFound: 3,
          executionMode: 'SIMULATED',
          status: 'Completed',
          summaryText: `Simulated scan on ${body.subnetCidr || '192.168.10.0/24'} completed.`,
        };
        return { ok: true, run, message: run.summaryText };
      }

      if (url.includes('/api/live-lab/adb-screenshot')) {
        return {
          ok: true,
          imageUrl: '/assets/aistudio/Hotel_Tentrem_SmartTV_App_Showcase_62a23bd8.png',
          capturedAt: new Date().toISOString(),
          message: 'Tangkapan layar TV simulasi (Vercel Mode).',
        };
      }

      if (url.includes('/api/live-lab/adb-probe')) {
        return {
          ok: true,
          message: 'Perangkat berhasil di-probe (Vercel Mode).',
        };
      }

      return { ok: true, message: 'Aksi disimulasikan (Vercel Client Mode).' };
    },
    [environmentId]
  );

  const apiCall = useCallback(
    async (pathUrl: string, options: RequestInit = {}, overridePersona?: string, overrideEnv?: EnvironmentId) => {
      const persona = overridePersona || personaAlias;
      const env = overrideEnv || environmentId;
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'X-Gojja-Persona': persona,
        'X-Gojja-Env': env,
        ...(options.headers as Record<string, string>),
      };

      const authoritative = /^\/api\/(?:tv\/(?:open-channel|open-app)|properties\/entertainment\/license|stays\/locale|branding\/draft|campaigns\/evaluate-eligibility|marketplace\/services\/(?:create-order|upsert-item))/.test(pathUrl);
      try {
        const res = await fetch(pathUrl, { ...options, headers });
        if (!res.ok) {
          // If 404 on static deployment (like Vercel), gracefully fallback to local client emulation
          if (res.status === 404 && !authoritative) {
            return handleClientSideFallbackApi(pathUrl, options, persona);
          }
          if(authoritative&&[404,405,502,503,504].includes(res.status))throw new ApiRequestError('Required API service is unavailable on this host. Use the local full-stack preview or configure a backend before deployment.','API_UNAVAILABLE',res.status);
          const text = await res.text();
          let data;
          try {
            data = JSON.parse(text);
          } catch {
            throw new Error(`HTTP ${res.status}: ${res.statusText}`);
          }
          throw new Error(data.message || data.code || 'Request denied by server policy');
        }
        if(authoritative&&!res.headers.get('content-type')?.includes('application/json'))throw new ApiRequestError('This host returned a web page instead of the required API response.','API_UNAVAILABLE',res.status);
        return await res.json();
      } catch (err: unknown) {
        if (authoritative) throw err;
        // Non-TV legacy static-host emulation remains explicitly separate.
        console.warn(`[Client-Side SSOT] Route ${pathUrl} handled locally:`, err);
        return handleClientSideFallbackApi(pathUrl, options, persona);
      }
    },
    [personaAlias, environmentId, handleClientSideFallbackApi]
  );

  const applyPropertyDefaults = useCallback((properties: Property[]) => {
    const propToUse = properties.find((p) => p.id === selectedPropertyId) || properties[0] || null;
    if (propToUse) {
      setSelectedPropertyId(propToUse.id);
      setBrandLogoText(propToUse.logoText);
      setBrandLogoSubtitle(propToUse.logoSubtitle);
      setBrandLogoImageUrl(propToUse.logoImageUrl || '');
      setBrandHeroMediaType(propToUse.heroMediaType || 'image');
      setBrandHeroImageUrl(propToUse.heroImageUrl);
      if (propToUse.heroVideoUrl) setBrandHeroVideoUrl(resolveLegacyDemoMedia(propToUse.heroVideoUrl));
      setBrandPromoMediaType(propToUse.promoMediaType || 'video');
      if (propToUse.promoMediaUrl) setBrandPromoMediaUrl(resolveLegacyDemoMedia(propToUse.promoMediaUrl));
      if (propToUse.promoTitle) setBrandPromoTitle(propToUse.promoTitle);
      setBrandAccentColor(propToUse.accentColor);
      setBrandPrimaryColor(propToUse.primaryColor);
      setBrandHeadline(propToUse.welcomeHeadline);
      setBrandTvExperience(resolveTvExperience(propToUse.tvExperience,propToUse.wifiSsid));
      if (propToUse.launcherConfig?.disabledPackages?.length) {
        setCleanTvDisabledPackages(propToUse.launcherConfig.disabledPackages);
      }
      if (propToUse.launcherConfig?.lastAdbTranscript?.length) {
        setCleanTvTranscript(propToUse.launcherConfig.lastAdbTranscript);
      }
    }
  }, [selectedPropertyId]);

  const fetchBootstrap = useCallback(
    async (overridePersona?: string, overrideEnv?: EnvironmentId) => {
      try {
        const payload: BootstrapPayload = await apiCall('/api/bootstrap', { method: 'GET' }, overridePersona, overrideEnv);
        setBootstrap(payload);
        applyPropertyDefaults(payload.data.properties);
      } catch (err: unknown) {
        console.warn('Backend API /api/bootstrap not reachable, activating client-side SSOT fallback for Vercel mode:', err);
        const fallback = createLocalFallbackBootstrap(overridePersona || personaAlias, overrideEnv || environmentId);
        setBootstrap(fallback);
        applyPropertyDefaults(fallback.data.properties);
      } finally {
        setLoading(false);
      }
    },
    [apiCall, applyPropertyDefaults, personaAlias, environmentId]
  );

  useEffect(() => {
    fetchBootstrap();
  }, [fetchBootstrap]);

  const showNotice = (type: 'success' | 'error' | 'info', text: string) => {
    setStatusBanner({ type, text });
    setTimeout(() => {
      setStatusBanner((prev) => (prev?.text === text ? null : prev));
    }, 6000);
  };

  const handleUploadFileToDataUrl = (
    file: File | undefined,
    maxMb: number,
    onSuccess: (dataUrl: string, detectedType: 'image' | 'video', fileName: string) => void
  ) => {
    if (!file) return;
    const sizeMb = file.size / (1024 * 1024);
    if (sizeMb > maxMb) {
      showNotice('error', `File '${file.name}' (${sizeMb.toFixed(1)} MB) exceeds the ${maxMb} MB browser upload limit.`);
      return;
    }
    const detectedType: 'image' | 'video' = file.type.startsWith('video/') ? 'video' : 'image';
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onSuccess(reader.result, detectedType, file.name);
        showNotice('success', `Uploaded ${detectedType} '${file.name}' (${sizeMb.toFixed(2)} MB) into live preview.`);
      }
    };
    reader.onerror = () => {
      showNotice('error', `Could not read file '${file.name}'.`);
    };
    reader.readAsDataURL(file);
  };

  const handleDownloadGojjaCleanTvScript = (prop: Property, endpoints: Endpoint[], packagesToDisable: string[]) => {
    const onlineIps = endpoints.map((e) => `${e.ipHint}:${e.portHint || 5555}`);
    const pkgLines = packagesToDisable.map((p) => `  "${p}"`).join('\n');
    const ipLines = (onlineIps.length ? onlineIps : ['192.168.10.101:5555']).map((ip) => `  "${ip}"`).join('\n');

    const scriptContent = `#!/usr/bin/env bash
# ==============================================================================
# GojjaCleanTV (GojjaLauncher) — Non-Root Android TV / Google TV Takeover Script
# Architecture aligned with Gathin23/cleanyourtv + GOJJA SmartTV Hospitality CMS
# Property: ${prop.name} (${prop.id}) | City: ${prop.city}
# Generated: ${new Date().toISOString()}
# ==============================================================================
# Usage:
#   chmod +x gojja-cleantv-${prop.id.toLowerCase()}.sh
#   ./gojja-cleantv-${prop.id.toLowerCase()}.sh --apply     # Disable stock ad launcher & set GojjaLauncher
#   ./gojja-cleantv-${prop.id.toLowerCase()}.sh --restore   # Re-enable stock OEM launcher (100% reversible)
# ==============================================================================

set -euo pipefail

MODE="\${1:---apply}"
GOJJA_LAUNCHER_PKG="tv.gojja.hospitality.launcher"
GOJJA_HOME_ACTIVITY="tv.gojja.hospitality.launcher/.GojjaHomeActivity"
GOJJA_APK_FILE="\${GOJJA_APK_FILE:-GojjaLauncher-v4.2.0-hospitality.apk}"

TV_TARGETS=(
${ipLines}
)

PACKAGES_TO_DISABLE=(
${pkgLines}
)

echo "=================================================================="
echo " GOJJA SmartTV · GojjaCleanTV Non-Root ADB Provisioner"
echo " Property: ${prop.name} (${prop.id})"
echo " Mode:     \${MODE}"
echo "=================================================================="

if ! command -v adb >/dev/null 2>&1; then
  echo "[ERROR] 'adb' (Android Platform Tools) is not installed in PATH."
  exit 1
fi

for TARGET in "\${TV_TARGETS[@]}"; do
  echo ""
  echo ">>> Connecting to SmartTV at \${TARGET} ..."
  adb connect "\${TARGET}" || continue

  if [[ "\${MODE}" == "--restore" ]]; then
    echo ">>> [RESTORE] Re-enabling stock Android TV / Google TV packages on \${TARGET}..."
    for PKG in "\${PACKAGES_TO_DISABLE[@]}"; do
      adb -s "\${TARGET}" shell pm enable --user 0 "\${PKG}" 2>/dev/null || true
      echo "    + Enabled \${PKG}"
    done
    adb -s "\${TARGET}" shell cmd package set-home-activity com.google.android.tvlauncher/.MainActivity 2>/dev/null || true
    adb -s "\${TARGET}" shell input keyevent KEYCODE_HOME
    echo ">>> [OK] Stock TV launcher restored on \${TARGET}."
  else
    echo ">>> [BACKUP] Saving current enabled package snapshot..."
    adb -s "\${TARGET}" shell pm list packages -e > "gojja_backup_\${TARGET//[:.]/_}.txt" || true

    if [[ -f "\${GOJJA_APK_FILE}" ]]; then
      echo ">>> [INSTALL] Installing \${GOJJA_APK_FILE} on \${TARGET}..."
      adb -s "\${TARGET}" install -r -g "\${GOJJA_APK_FILE}"
    fi

    echo ">>> [DEBLOAT] Disabling stock ad-heavy launcher & bloatware (non-root pm disable-user)..."
    for PKG in "\${PACKAGES_TO_DISABLE[@]}"; do
      adb -s "\${TARGET}" shell pm disable-user --user 0 "\${PKG}" 2>/dev/null || true
      echo "    - Disabled \${PKG}"
    done

    echo ">>> [LOCK HOME] Setting GojjaLauncher as default Hospitality Home Activity..."
    adb -s "\${TARGET}" shell cmd package set-home-activity "\${GOJJA_HOME_ACTIVITY}" 2>/dev/null || true
    adb -s "\${TARGET}" shell am start -a android.intent.action.MAIN -c android.intent.category.HOME
    echo ">>> [OK] GojjaLauncher active on \${TARGET} (${prop.logoText})."
  fi
done

echo ""
echo "Done. Run with '--restore' at any time to revert to stock TV launcher."
`;

    const blob = new Blob([scriptContent], { type: 'text/x-shellscript;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gojja-cleantv-${prop.id.toLowerCase()}.sh`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showNotice('success', `Downloaded gojja-cleantv-${prop.id.toLowerCase()}.sh script (${endpoints.length} TV endpoints configured).`);
  };

  const handleLoginSuccess = async (account: UserAccount, env: EnvironmentId) => {
    setPersonaAlias(account.alias);
    setEnvironmentId(env);
    await fetchBootstrap(account.alias, env);
    if (account.propertyIds && account.propertyIds.length > 0) {
      setSelectedPropertyId(account.propertyIds[0]);
    }
    const allowed = getAllowedTabsForRole(account.roleId);
    if (account.roleId === 'R-16') {
      setTvModalEndpointId('E-01');
      setActiveTab('overview');
    } else if (account.roleId === 'R-01' || account.roleId === 'R-02' || account.roleId === 'R-08') {
      setActiveTab('tenants');
    } else if (account.roleId === 'R-09') {
      setActiveTab('discovery');
    } else if (account.roleId === 'R-05' || account.roleId === 'R-15') {
      setActiveTab('billing');
    } else if (account.roleId === 'R-12') {
      setActiveTab('branding');
    } else if (account.roleId === 'R-13') {
      setActiveTab('rooms');
    } else if (account.roleId === 'R-14') {
      setActiveTab('analytics');
    } else {
      setActiveTab(allowed[0] || 'overview');
    }
    setViewMode('dashboard');
    showNotice('info', `Signed in as ${account.name} (${account.roleId} · ${account.badgeLabel}) in ${env} workspace.`);
  };

  if (loading || !bootstrap) {
    return (
      <div className="min-h-screen bg-[var(--cms-bg)] text-[var(--cms-text)] flex items-center justify-center p-6">
        <div className="text-center space-y-3">
          <GojjaWordmark size="md" showDescriptor={true} />
          <div className="text-xs text-[var(--cms-text-secondary)]">Loading GOJJA SmartTV Single Source of Truth...</div>
        </div>
      </div>
    );
  }

  const { currentUser, currentRole, data, kpis, analyticsFixture, hostRuntime } = bootstrap;
  const activeProperty =
    data.properties.find((p) => p.id === selectedPropertyId) || data.properties[0] || {
      id: 'P-01',
      customerId: 'C-01',
      partnerId: 'ISP-A',
      name: 'Hotel Arunika Yogyakarta',
      categoryLabel: 'Boutique Hotel • 6 Rooms',
      city: 'Yogyakarta',
      timezone: 'Asia/Jakarta',
      defaultLocale: 'id' as GuestLocale,
      experienceProfile: 'Hospitality' as const,
      heroImageUrl: '/assets/aistudio/Hotel_Tentrem_SmartTV_App_Showcase_62a23bd8.png',
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
        id: 'Nikmati ketenangan Anda',
        en: 'Experience serenity in your suite',
        'zh-CN': '尽享宁静时光',
        'ja-JP': '穏やかなひとときを',
      },
      wifiSsid: 'Arunika-Guest',
      frontDeskExt: '0',
      resourceVersion: 4,
    };

  const propSubscription = data.subscriptions.find((s) => s.propertyId === activeProperty.id);
  const propRooms = data.rooms.filter((r) => r.propertyId === activeProperty.id);
  const propEndpoints = data.endpoints.filter((e) => e.propertyId === activeProperty.id);
  const propStays = data.stays.filter((s) => s.propertyId === activeProperty.id);
  const propCampaigns = data.campaigns.filter((c) => c.propertyId === activeProperty.id);
  const propOnlineCount = propEndpoints.filter((e) => e.connection === 'Online').length;
  const propOfflineCount = propEndpoints.filter((e) => e.connection === 'Offline').length;

  // TV Modal lookup & Fallback Preview Endpoint (Prevents crash in empty LIVE_LAB)
  const defaultPreviewEndpoint: Endpoint = {
    id: 'E-PREVIEW',
    propertyId: activeProperty.id,
    roomId: propRooms[0]?.id || 'ROOM-101',
    subscriptionId: propSubscription?.id || 'SUB-01',
    label: `${activeProperty.name} Preview TV`,
    connection: 'Online',
    capabilityProfile: 'LIVE-VERIFIED',
    modelName: 'SmartTV Preview',
    manufacturer: 'GOJJA Preview',
    androidVersion: '12',
    sdkInt: 31,
    appVersion: '2.4.1',
    desiredVersion: '2.4.1',
    appliedConfigVersion: 4,
    lastSeenUtc: new Date().toISOString(),
    ipHint: '127.0.0.1',
    portHint: 5555,
    serialRef: 'SN-PREVIEW',
    bindingVersion: 1,
    origin: 'MANUAL',
    verificationLevel: 'DEVICE_VERIFIED',
  };
  const modalEndpoint = data.endpoints.find((e) => e.id === tvModalEndpointId) || propEndpoints[0] || data.endpoints[0] || defaultPreviewEndpoint;
  const modalRoom =
    data.rooms.find((r) => r.id === modalEndpoint?.roomId) ||
    propRooms[0] || {
      id: 'ROOM-101',
      propertyId: activeProperty.id,
      code: '101',
      roomClass: 'Standard' as const,
      floor: 1,
      housekeeping: 'Ready' as const,
      maintenanceAuthorized: true,
    };
  const modalStay = data.stays.find((s) => s.roomId === modalRoom.id && s.status === 'InHouse');
  const modalGroup = data.corporateGroups.find((g) => g.id === modalStay?.groupId);

  const entertainmentLicensed = hasEntertainmentEntitlement(data.subscriptions.find(s => s.propertyId === activeProperty.id), environmentId);
  const tvExperienceBindings = {
    entertainmentLicensed,
    onOpenEntertainmentApp: async (appId: string): Promise<{url:string}> => {
      return await apiCall('/api/tv/open-app', {method:'POST',body:JSON.stringify({endpointId:modalEndpoint.id,appId})});
    },
    contracts: data.contracts,
    marketplaceItems: data.marketplaceItems || [],
    serviceOrders: data.serviceOrders || [],
    onRequestServiceOrder: async (itemId: string, _itemTitle: string) => {
      const result = await apiCall('/api/marketplace/services/create-order', {
        method: 'POST', body: JSON.stringify({itemId, propertyId: activeProperty.id, roomId: modalRoom.id, stayId: modalStay?.id, notes: 'Requested explicitly through TV preview'}),
      });
      if (!result.order) throw new Error('Server did not confirm the service request.');
      setBootstrap(prev => prev ? {...prev, data: {...prev.data, serviceOrders: [result.order, ...(prev.data.serviceOrders || [])]}} : prev);
    },
    onEvaluateCampaign: async (external: boolean): Promise<Campaign | null> => {
      const candidate = data.campaigns.find(c => c.propertyId === activeProperty.id && !!c.externalPaid === external);
      const result = await apiCall('/api/campaigns/evaluate-eligibility', {
        method: 'POST', body: JSON.stringify({propertyId: activeProperty.id, placement: candidate?.placement || 'home_hero', roomClass: modalRoom.roomClass, stayId: modalStay?.id, groupId: modalStay?.groupId, locale: brandLocaleTab, externalPaid: external}),
      });
      return result.selectedCampaign || null;
    },
  };


  if (viewMode === 'landing') {
    return (
      <>
        <LoginLandingView
          userAccounts={bootstrap.userAccounts}
          rolesCatalog={bootstrap.rolesCatalog}
          theme={theme}
          cmsLocale={cmsLocale}
          onChangeCmsLocale={handleChangeCmsLocale}
          onToggleTheme={handleToggleTheme}
          onLoginSuccess={handleLoginSuccess}
          onOpenTvShowcase={() => setTvModalEndpointId('E-01')}
        />
        {tvModalEndpointId && modalEndpoint && (
          <TvGuestAppView
                      {...tvExperienceBindings}
            property={activeProperty}
            room={modalRoom}
            endpoint={modalEndpoint}
            stay={modalStay}
            corporateGroup={modalGroup}
            channels={data.channels}
            campaigns={data.campaigns}
            marketplaceItems={data.marketplaceItems || []}

            onSelectLocale={async (nextTvLoc) => {
              setBrandLocaleTab(nextTvLoc);
              try {
                await apiCall('/api/stays/locale', {
                  method: 'POST',
                  body: JSON.stringify({
                    propertyId: activeProperty.id,
                    roomId: modalRoom.id,
                    stayId: modalStay?.id,
                    locale: nextTvLoc,
                  }),
                });
                await fetchBootstrap();
              } catch {
                // ignore if guest read-only
              }
            }}
            onClose={() => setTvModalEndpointId(null)}
            onOpenChannelCheck={async (epId, chId) => {
              try {
                return await apiCall('/api/tv/open-channel', {
                  method: 'POST',
                  body: JSON.stringify({ endpointId: epId, channelId: chId }),
                });
              } catch (err: unknown) {
                return { allowed: false, code:err instanceof ApiRequestError?err.code:undefined, message: err instanceof Error ? err.message : 'Access restricted' };
              }
            }}
          />
        )}
      </>
    );
  }

  const allowedTabs = getAllowedTabsForRole(currentRole.id);

  const allWorkspaceNav: Array<{ id: NavTabId; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { id: 'overview', label: ct.navOverview, icon: LayoutDashboard },
    { id: 'tenants', label: ct.navTenants, icon: Building2 },
    { id: 'rooms', label: ct.navRooms, icon: Bed },
    { id: 'devices', label: ct.navDevices, icon: Tv },
    { id: 'discovery', label: ct.navDiscovery, icon: Radar },
    { id: 'branding', label: ct.navBranding, icon: Palette },
    { id: 'tv-services', label: ct.navTvServices, icon: Radio },
    { id: 'campaigns', label: ct.navCampaigns, icon: Megaphone },
    { id: 'marketplace', label: ct.navMarketplace, icon: ShoppingBag },
    { id: 'channels', label: ct.navChannels, icon: Layers },
    { id: 'updates', label: ct.navUpdates, icon: Download },
    { id: 'analytics', label: ct.navAnalytics, icon: BarChart3 },
  ];

  const allAdminNav: Array<{ id: NavTabId; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { id: 'users', label: ct.navUsers, icon: ShieldCheck },
    { id: 'billing', label: ct.navBilling, icon: CreditCard },
    { id: 'support-qa', label: ct.navSupport, icon: LifeBuoy },
    { id: 'settings', label: ct.navSettings, icon: Settings },
  ];

  // Filter sidebar items strictly by role permissions (Confirmed Decision 1)
  const workspaceNav = allWorkspaceNav.filter((item) => allowedTabs.includes(item.id));
  const adminNav = allAdminNav.filter((item) => allowedTabs.includes(item.id));

  return (
    <div className="h-[100dvh] overflow-hidden bg-[var(--cms-bg)] text-[var(--cms-text)] flex flex-col font-sans">
      {/* Top Shell Header Bar (Exact V-12 Layout & Mobile Non-Overlapping Layout) */}
      <header className="shrink-0 z-30 h-[72px] px-3 sm:px-4 md:px-6 bg-[var(--cms-header)] border-b border-[var(--cms-divider)] flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Hamburger (Mobile) + Property Selector + Search (Tablet/Desktop) */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 mr-2">
          {/* Hamburger button (Mobile only, shrink-0 ensures it NEVER gets overlapped) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 shrink-0 rounded-xl text-[var(--cms-text-secondary)] hover:text-[var(--cms-text)] hover:bg-[var(--cms-bg)] transition-colors md:hidden"
            title="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Property Selector Pill: shrinks and truncates gracefully without overlapping */}
          <div className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-[var(--cms-bg)] border border-[var(--cms-divider)] min-w-0 max-w-[155px] xs:max-w-[190px] sm:max-w-[260px] md:max-w-none shrink">
            <img
              src="/assets/aistudio/file_00000000a6b08211935c3a540293bf6c_74821162.png"
              alt="Hotel thumbnail"
              referrerPolicy="no-referrer"
              className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg object-cover shrink-0"
            />
            <div className="text-left hidden md:block shrink-0">
              <div className="text-xs font-bold leading-none text-[var(--cms-text)]">
                {activeProperty.name.split(' ')[0]} {activeProperty.name.split(' ')[1] || 'Arunika'}
              </div>
              <div className="text-[10px] text-[var(--cms-text-secondary)] leading-none mt-0.5">
                {activeProperty.city}
              </div>
            </div>
            <select
              value={activeProperty.id}
              onChange={(e) => {
                const pid = e.target.value;
                setSelectedPropertyId(pid);
                const p = data.properties.find((x) => x.id === pid);
                if (p) {
                  setBrandLogoText(p.logoText);
                  setBrandLogoSubtitle(p.logoSubtitle);
                  setBrandLogoImageUrl(p.logoImageUrl || '');
                  setBrandHeroMediaType(p.heroMediaType || 'image');
                  setBrandHeroImageUrl(p.heroImageUrl);
                  if (p.heroVideoUrl) setBrandHeroVideoUrl(resolveLegacyDemoMedia(p.heroVideoUrl));
                  setBrandPromoMediaType(p.promoMediaType || 'video');
                  if (p.promoMediaUrl) setBrandPromoMediaUrl(resolveLegacyDemoMedia(p.promoMediaUrl));
                  if (p.promoTitle) setBrandPromoTitle(p.promoTitle);
                  setBrandAccentColor(p.accentColor);
                  setBrandPrimaryColor(p.primaryColor);
                  setBrandHeadline(p.welcomeHeadline);
                  setBrandTvExperience(resolveTvExperience(p.tvExperience,p.wifiSsid));
                  setBrandLocaleTab(p.defaultLocale || 'id');
                  if (p.launcherConfig?.disabledPackages?.length) {
                    setCleanTvDisabledPackages(p.launcherConfig.disabledPackages);
                  }
                  if (p.launcherConfig?.lastAdbTranscript?.length) {
                    setCleanTvTranscript(p.launcherConfig.lastAdbTranscript);
                  }
                }
              }}
              aria-label="Select active property"
              className="bg-transparent text-xs font-semibold cursor-pointer focus:outline-none truncate min-w-0 w-full"
            >
              {data.properties.map((p) => (
                <option key={p.id} value={p.id} className="text-slate-900">
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* DEMO DATA badge (Desktop / Tablet) */}
          <span className="hidden xl:inline-flex px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-300 font-bold text-[10px] tracking-wider uppercase shrink-0">
            {environmentId === 'LIVE_LAB' ? 'LIVE LAB' : 'DEMO DATA'}
          </span>

          {/* Global Search (Tablet / Desktop) */}
          <div className="hidden sm:flex items-center relative w-52 md:w-72 shrink-0">
            <Search className="w-4 h-4 text-[var(--cms-text-secondary)] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={ct.searchPlaceholder}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-[var(--cms-bg)] border border-[var(--cms-divider)] text-xs text-[var(--cms-text)] placeholder:text-[var(--cms-text-secondary)] focus:outline-2 focus:outline-[var(--brand-indigo)] transition-all"
            />
          </div>
        </div>

        {/* Right: Actions (2-Language CMS Toggle ID/EN, Theme Toggle, Notifications, User Avatar, Logout) */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Interactive 2-Language CMS Switcher (Strictly ID & EN for Login & CMS Dashboard) */}
          <div
            className="inline-flex items-center gap-0.5 p-0.5 rounded-xl bg-[var(--cms-bg)] border border-[var(--cms-divider)] text-[11px] font-bold"
            title={
              cmsLocale === 'id'
                ? 'Bahasa Dashboard CMS (2 Bahasa: ID / EN). Untuk 4 Bahasa Layar TV, buka Brand Studio atau Kamar & Tamu.'
                : 'CMS Dashboard Language (2 options: ID / EN). For 4 SmartTV Guest Languages, open Brand Studio or Rooms & Guests.'
            }
          >
            <Globe className="w-3.5 h-3.5 text-[var(--cms-text-secondary)] ml-1.5 mr-0.5 hidden xs:inline" />
            <button
              type="button"
              onClick={() => handleChangeCmsLocale('id')}
              className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                cmsLocale === 'id'
                  ? 'bg-[var(--brand-indigo)] text-white shadow-xs'
                  : 'text-[var(--cms-text-secondary)] hover:text-[var(--cms-text)]'
              }`}
            >
              ID
            </button>
            <button
              type="button"
              onClick={() => handleChangeCmsLocale('en')}
              className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                cmsLocale === 'en'
                  ? 'bg-[var(--brand-indigo)] text-white shadow-xs'
                  : 'text-[var(--cms-text-secondary)] hover:text-[var(--cms-text)]'
              }`}
            >
              EN
            </button>
          </div>

          {/* Mobile Compact Single Icon Theme Toggle (Saves 40px on mobile screens) */}
          <button
            type="button"
            onClick={handleToggleTheme}
            className="sm:hidden p-2 rounded-xl bg-[var(--cms-bg)] border border-[var(--cms-divider)] text-xs font-medium hover:opacity-90 transition-all text-[var(--cms-text-secondary)]"
            title="Toggle Light / Dark Mode"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-500" />
            )}
          </button>

          {/* Desktop / Tablet Circular Sun/Moon Toggle Pill */}
          <button
            type="button"
            onClick={handleToggleTheme}
            className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--cms-bg)] border border-[var(--cms-divider)] text-xs font-medium hover:opacity-90 transition-all"
            title="Toggle Light / Warm Graphite Dark Mode"
          >
            <Sun
              className={`w-3.5 h-3.5 ${
                theme === 'light' ? 'text-amber-500 fill-amber-400' : 'text-[var(--cms-text-secondary)]'
              }`}
            />
            <span className="text-[var(--cms-divider)]">|</span>
            <Moon
              className={`w-3.5 h-3.5 ${
                theme === 'dark' ? 'text-[#C7B9FF] fill-[#C7B9FF]' : 'text-[var(--cms-text-secondary)]'
              }`}
            />
          </button>

          {/* Notifications Bell with 3 Count Badge */}
          <button
            type="button"
            onClick={() => setActiveTab('updates')}
            className="relative p-2 rounded-xl bg-[var(--cms-bg)] border border-[var(--cms-divider)] text-[var(--cms-text-secondary)] hover:text-[var(--cms-text)] transition-colors shrink-0"
            title="3 pending system notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white font-bold text-[9px] flex items-center justify-center">
              3
            </span>
          </button>

          {/* User Profile Avatar */}
          <div
            onClick={() => {
              if (window.innerWidth < 768) {
                setMobileMenuOpen(true);
              }
            }}
            className="flex items-center gap-2 pl-1 sm:pl-2 border-l border-[var(--cms-divider)] cursor-pointer md:cursor-default shrink-0"
            title={window.innerWidth < 768 ? "Open navigation & profile" : "User Profile"}
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[var(--brand-indigo)] text-white font-bold text-xs flex items-center justify-center shadow-xs shrink-0">
              {currentUser.avatarInitials || 'NP'}
            </div>
            <div className="text-left hidden xl:block">
              <div className="text-xs font-bold leading-none text-[var(--cms-text)]">{currentUser.name || 'Nadia Putri'}</div>
              <div className="text-[10px] text-[var(--cms-text-secondary)] leading-none mt-0.5">
                {currentRole.name || 'Property Admin'}
              </div>
            </div>
          </div>

          <div className="text-right hidden 2xl:block text-[11px] font-mono-tabular text-[var(--cms-text-secondary)] pl-2 border-l border-[var(--cms-divider)]">
            31 Oct 2026 · WIB
          </div>

          {/* Return to Login (Desktop / Tablet) */}
          <button
            onClick={() => setViewMode('landing')}
            className="hidden sm:block p-2 rounded-xl bg-[var(--cms-bg)] border border-[var(--cms-divider)] text-[var(--cms-text-secondary)] hover:text-[var(--cms-text)] shrink-0"
            title="Return to Workspace Login"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Mobile Slide-Out Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex" role="dialog" aria-modal="true">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Slide-out Drawer Panel */}
          <aside className="relative z-10 w-72 max-w-[85vw] h-full bg-[var(--cms-sidebar)] border-r border-[var(--cms-divider)] p-4 flex flex-col justify-between overflow-hidden shadow-2xl">
            {/* Fixed Top Header with Logo + Close button */}
            <div className="shrink-0 flex items-center justify-between pb-3 border-b border-[var(--cms-divider)]">
              <div>
                <GojjaWordmark size="sm" showDescriptor={true} variant={theme === 'dark' ? 'reverse' : 'color'} />
                <div className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[var(--cms-text-secondary)] mt-0.5">
                  PROPERTY WORKSPACE
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-xl bg-[var(--cms-bg)] text-[var(--cms-text-secondary)] hover:text-[var(--cms-text)] border border-[var(--cms-divider)]"
                title="Close Navigation"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Middle Navigation Menu */}
            <div className="flex-1 overflow-y-auto luxury-scrollbar pr-1 py-3 space-y-5 min-h-0">
              {/* Group 1: WORKSPACE */}
              <div className="space-y-1">
                <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-[var(--cms-text-secondary)]">
                  {ct.groupWorkspace}
                </div>
                <nav className="space-y-0.5 pt-1">
                  {workspaceNav.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id);
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                          isActive
                            ? 'bg-[var(--nav-selected-bg)] text-[var(--nav-selected-fg)] font-semibold shadow-xs'
                            : 'text-[var(--cms-text-secondary)] hover:text-[var(--cms-text)] hover:bg-black/5 dark:hover:bg-white/5'
                        }`}
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Group 2: ADMINISTRATION */}
              {adminNav.length > 0 && (
                <div className="space-y-1">
                  <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-[var(--cms-text-secondary)]">
                    {ct.groupAdmin}
                  </div>
                  <nav className="space-y-0.5 pt-1">
                    {adminNav.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setActiveTab(item.id);
                            setMobileMenuOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                            isActive
                              ? 'bg-[var(--nav-selected-bg)] text-[var(--nav-selected-fg)] font-semibold shadow-xs'
                              : 'text-[var(--cms-text-secondary)] hover:text-[var(--cms-text)] hover:bg-black/5 dark:hover:bg-white/5'
                          }`}
                        >
                          <Icon className="w-4 h-4 shrink-0" />
                          <span>{item.label}</span>
                        </button>
                      );
                    })}
                  </nav>
                </div>
              )}

              {/* Need help? link */}
              {allowedTabs.includes('support-qa') && (
                <div className="px-3 pt-1">
                  <a
                    href="#help"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab('support-qa');
                      setMobileMenuOpen(false);
                    }}
                    className="inline-flex items-center gap-1.5 text-xs text-[var(--cms-text-secondary)] hover:text-[var(--cms-text)] font-medium"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>{ct.needHelp}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>

            {/* Pinned Bottom Resort Card Footer in Drawer */}
            <div className="shrink-0 pt-3 border-t border-[var(--cms-divider)] space-y-2.5 bg-[var(--cms-sidebar)]">
              <div className="relative rounded-2xl overflow-hidden h-24 border border-white/20 shadow-md">
                <img
                  src="/assets/aistudio/file_0000000043808207bbdf250e0b1586c7_702e345a.png"
                  alt="Hospitality Sanctuary"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-3 flex flex-col justify-end text-white">
                  <div className="text-[11px] font-bold leading-tight">Open. Connected. Forward.</div>
                  <div className="text-[9px] text-slate-300 font-mono-tabular mt-0.5">GOJJA SmartTV · v1.0</div>
                </div>
              </div>
              <div className="flex items-center justify-between text-[11px] text-[var(--cms-text-secondary)]">
                <span className="font-semibold text-[var(--cms-text)] truncate max-w-[140px]">
                  {currentRole.name}
                </span>
                <button
                  onClick={() => {
                    setViewMode('landing');
                    setMobileMenuOpen(false);
                  }}
                  className="text-[11px] font-medium text-[var(--brand-indigo)] hover:underline inline-flex items-center gap-1"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* Main Workspace Body: Independently Scrollable Sidebar + Independently Scrollable Viewport */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
        {/* Left Sidebar (Desktop Only: Fixed Logo Top, Scrollable Menu Middle, Pinned Resort Footer Bottom) */}
        <aside className="hidden md:flex md:w-[250px] shrink-0 h-full bg-[var(--cms-sidebar)] border-r border-[var(--cms-divider)] p-4 flex-col justify-between overflow-hidden">
          {/* 1. Pinned Sidebar Logo Header */}
          <div className="shrink-0 px-2 pt-0.5 pb-3 border-b border-[var(--cms-divider)] space-y-1">
            <button
              onClick={() => setViewMode('landing')}
              className="text-left block"
              title="Return to Login"
            >
              <GojjaWordmark size="sm" showDescriptor={true} variant={theme === 'dark' ? 'reverse' : 'color'} />
            </button>
            <div className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[var(--cms-text-secondary)]">
              PROPERTY WORKSPACE
            </div>
          </div>

          {/* 2. Independently Scrollable Navigation Menu (Ultra-thin luxury scrollbar) */}
          <div className="flex-1 overflow-y-auto luxury-scrollbar pr-1 py-3 space-y-5 min-h-0">
            {/* Group 1: WORKSPACE */}
            <div className="space-y-1">
              <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-[var(--cms-text-secondary)]">
                {ct.groupWorkspace}
              </div>
              <nav className="space-y-0.5 pt-1">
                {workspaceNav.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[var(--nav-selected-bg)] text-[var(--nav-selected-fg)] font-semibold shadow-xs'
                          : 'text-[var(--cms-text-secondary)] hover:text-[var(--cms-text)] hover:bg-black/5 dark:hover:bg-white/5'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Group 2: ADMINISTRATION */}
            {adminNav.length > 0 && (
              <div className="space-y-1">
                <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-[var(--cms-text-secondary)]">
                  {ct.groupAdmin}
                </div>
                <nav className="space-y-0.5 pt-1">
                  {adminNav.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                          isActive
                            ? 'bg-[var(--nav-selected-bg)] text-[var(--nav-selected-fg)] font-semibold shadow-xs'
                            : 'text-[var(--cms-text-secondary)] hover:text-[var(--cms-text)] hover:bg-black/5 dark:hover:bg-white/5'
                        }`}
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            )}

            {/* Need help? link */}
            {allowedTabs.includes('support-qa') && (
              <div className="px-3 pt-1">
                <a
                  href="#help"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab('support-qa');
                  }}
                  className="inline-flex items-center gap-1.5 text-xs text-[var(--cms-text-secondary)] hover:text-[var(--cms-text)] font-medium"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>{ct.needHelp}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>

          {/* 3. Pinned Bottom Resort Photo Card Footer */}
          <div className="shrink-0 pt-3 border-t border-[var(--cms-divider)] space-y-2.5 bg-[var(--cms-sidebar)]">
            <div className="relative rounded-2xl overflow-hidden h-28 border border-white/20 shadow-md group">
              <img
                src="/assets/aistudio/file_0000000043808207bbdf250e0b1586c7_702e345a.png"
                alt="Hospitality Sanctuary"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-3 flex flex-col justify-end text-white">
                <div className="text-xs font-bold leading-tight">Open.</div>
                <div className="text-xs font-bold leading-tight">Connected.</div>
                <div className="text-xs font-bold leading-tight">Forward.</div>
                <div className="text-[10px] text-slate-300 font-mono-tabular mt-0.5">
                  GOJJA SmartTV · v1.0
                </div>
              </div>
            </div>

            {/* Live Environment & Quick Actions */}
            <div className="flex items-center justify-between text-[11px] text-[var(--cms-text-secondary)]">
              <span className="font-semibold text-[var(--cms-text)] truncate max-w-[140px]">
                {currentRole.id} · {currentRole.name}
              </span>
              <button
                onClick={async () => {
                  await apiCall('/api/demo/reset', { method: 'POST' });
                  await fetchBootstrap();
                  showNotice('success', 'Reset DEMO workspace to pristine seed.');
                }}
                className="text-[10px] font-medium text-[var(--cms-link)] hover:underline cursor-pointer shrink-0"
              >
                Reset DEMO
              </button>
            </div>
          </div>
        </aside>

        {/* Main Viewport Content */}
        <main className="flex-1 h-full overflow-y-auto overflow-x-hidden luxury-scrollbar p-4 sm:p-6 md:p-8">
          <div className="max-w-[1440px] w-full mx-auto space-y-6 pb-8">
          {/* Global Status Toast */}
          {statusBanner && activeTab !== 'discovery' && (
            <div
              className={`px-4 py-3 rounded-xl border text-xs font-medium flex items-center justify-between gap-3 ${
                statusBanner.type === 'error'
                  ? 'bg-rose-500/15 border-rose-500/40 text-rose-800 dark:text-rose-200'
                  : statusBanner.type === 'success'
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-800 dark:text-emerald-200'
                  : 'bg-blue-500/15 border-blue-500/40 text-blue-800 dark:text-blue-200'
              }`}
            >
              <div className="flex items-center gap-2">
                {statusBanner.type === 'error' ? (
                  <XCircle className="w-4 h-4 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                )}
                <span>{statusBanner.text}</span>
              </div>
              <button onClick={() => setStatusBanner(null)} className="text-[11px] underline shrink-0">
                Dismiss
              </button>
            </div>
          )}

          {/* ===================================================================== */}
          {/* TAB 1: OVERVIEW (Exact V-12 Layout)                                   */}
          {/* ===================================================================== */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Panoramic Resort Hero Banner (Exact V-12) */}
              <div className="relative rounded-3xl overflow-hidden border border-[var(--cms-divider)] bg-[var(--cms-surface)] min-h-[170px] p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-sm">
                <img
                  src="/assets/aistudio/file_00000000a6b08211935c3a540293bf6c_74821162.png"
                  alt="Hotel Arunika Borobudur Resort Panoramic Banner"
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-white/40 dark:from-black/90 dark:via-black/75 dark:to-black/50" />

                <div className="relative z-10 space-y-1.5 max-w-xl">
                  <div className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[var(--brand-indigo)] dark:text-[#C7B9FF]">
                    {activeProperty.logoText} · {activeProperty.logoSubtitle}
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--cms-text)]">
                    {ct.propOverviewTitle}
                  </h1>
                  <p className="text-xs sm:text-sm text-[var(--cms-text-secondary)]">
                    {ct.propOverviewSub}
                  </p>
                </div>

                {/* Right Hero CTA Buttons */}
                <div className="relative z-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <div className="flex flex-col items-center sm:items-end">
                    <button
                      onClick={() => setActiveTab('discovery')}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl btn-luxury-indigo text-white text-xs font-bold inline-flex items-center justify-center gap-2 shadow-md hover:scale-[1.02] transition-all cursor-pointer"
                    >
                      <Radar className="w-4 h-4" />
                      <span>{ct.scanDevicesBtn}</span>
                    </button>
                    <span className="text-[10px] text-[var(--cms-text-secondary)] mt-1">
                      {ct.connectorReqNote}
                    </span>
                  </div>

                  <button
                    onClick={() => setTvModalEndpointId(propEndpoints[0]?.id || 'E-01')}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white/80 dark:bg-black/60 hover:bg-white dark:hover:bg-black/80 backdrop-blur-md border border-[var(--cms-divider)] text-[var(--cms-text)] text-xs font-bold inline-flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                  >
                    <Play className="w-4 h-4 text-[var(--brand-indigo)] fill-[var(--brand-indigo)]" />
                    <span>{ct.openTvPreviewBtn}</span>
                  </button>
                </div>
              </div>

              {/* 6 Rolling KPI Cards in a Row */}
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3.5">
                {/* 1. Licensed TVs */}
                <div className="p-4 rounded-2xl bg-[var(--cms-surface)] border border-[var(--cms-divider)] flex flex-col justify-between shadow-xs">
                  <div className="flex items-center justify-between text-xs text-[var(--cms-text-secondary)]">
                    <span className="font-medium">{ct.kpiLicensedTvs}</span>
                    <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-[#0050F5] flex items-center justify-center">
                      <Tv className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold mt-3 text-[var(--cms-text)]">
                    <RollingKpiValue value={12} />
                  </div>
                  <div className="text-[11px] text-[var(--cms-text-secondary)] mt-1">
                    7 assigned · 5 available
                  </div>
                </div>

                {/* 2. TVs online */}
                <div className="p-4 rounded-2xl bg-[var(--cms-surface)] border border-[var(--cms-divider)] flex flex-col justify-between shadow-xs">
                  <div className="flex items-center justify-between text-xs text-[var(--cms-text-secondary)]">
                    <span className="font-medium">{ct.kpiTvsOnline}</span>
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                      <Wifi className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold mt-3 text-[var(--cms-text)]">
                    5 / 7
                  </div>
                  <div className="text-[11px] text-rose-600 dark:text-rose-400 font-semibold mt-1">
                    2 offline
                  </div>
                </div>

                {/* 3. Occupied rooms */}
                <div className="p-4 rounded-2xl bg-[var(--cms-surface)] border border-[var(--cms-divider)] flex flex-col justify-between shadow-xs">
                  <div className="flex items-center justify-between text-xs text-[var(--cms-text-secondary)]">
                    <span className="font-medium">{ct.kpiOccupiedRooms}</span>
                    <div className="w-7 h-7 rounded-lg bg-purple-500/10 text-[#7C35E0] flex items-center justify-center">
                      <Bed className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold mt-3 text-[var(--cms-text)]">
                    4 / 6
                  </div>
                  <div className="text-[11px] text-[var(--cms-text-secondary)] mt-1">
                    Current stays
                  </div>
                </div>

                {/* 4. Active campaigns */}
                <div className="p-4 rounded-2xl bg-[var(--cms-surface)] border border-[var(--cms-divider)] flex flex-col justify-between shadow-xs">
                  <div className="flex items-center justify-between text-xs text-[var(--cms-text-secondary)]">
                    <span className="font-medium">{ct.kpiActiveCampaigns}</span>
                    <div className="w-7 h-7 rounded-lg bg-pink-500/10 text-[#CA3596] flex items-center justify-center">
                      <Megaphone className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold mt-3 text-[var(--cms-text)]">
                    <RollingKpiValue value={2} />
                  </div>
                  <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">
                    Published
                  </div>
                </div>

                {/* 5. Updates pending */}
                <div className="p-4 rounded-2xl bg-[var(--cms-surface)] border border-[var(--cms-divider)] flex flex-col justify-between shadow-xs">
                  <div className="flex items-center justify-between text-xs text-[var(--cms-text-secondary)]">
                    <span className="font-medium">{ct.kpiUpdatesPending}</span>
                    <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
                      <Download className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold mt-3 text-[var(--cms-text)]">
                    <RollingKpiValue value={2} />
                  </div>
                  <div className="text-[11px] text-amber-600 dark:text-amber-400 font-medium mt-1">
                    Awaiting approval
                  </div>
                </div>

                {/* 6. Monthly plan */}
                <div className="p-4 rounded-2xl bg-[var(--cms-surface)] border border-[var(--cms-divider)] flex flex-col justify-between shadow-xs">
                  <div className="flex items-center justify-between text-xs text-[var(--cms-text-secondary)]">
                    <span className="font-medium">{ct.kpiMonthlyPlan}</span>
                    <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-[var(--brand-indigo)] flex items-center justify-center">
                      <Award className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-lg sm:text-xl font-extrabold mt-3 text-[var(--cms-text)] truncate">
                    Rp180.000
                  </div>
                  <div className="text-[11px] text-[var(--cms-text-secondary)] mt-1">
                    Core · 12 seats
                  </div>
                </div>
              </div>

              {/* 60:40 Operational Split */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                {/* Left (60%): Device & Room Health Table */}
                <div className="lg:col-span-7 p-6 rounded-2xl bg-[var(--cms-surface)] border border-[var(--cms-divider)] flex flex-col justify-between shadow-xs">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-base font-bold text-[var(--cms-text)]">{ct.deviceRoomHealthTitle}</h2>
                      <button
                        onClick={() => setActiveTab('rooms')}
                        className="text-xs font-semibold text-[var(--cms-link)] hover:underline inline-flex items-center gap-1 cursor-pointer"
                      >
                        <span>{ct.viewAllDevices}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="border-b border-[var(--cms-divider)] text-[var(--cms-text-secondary)]">
                            <th className="py-2.5 pr-3 font-medium">Room</th>
                            <th className="py-2.5 px-3 font-medium">Device</th>
                            <th className="py-2.5 px-3 font-medium">Status</th>
                            <th className="py-2.5 px-3 font-medium">TV profile</th>
                            <th className="py-2.5 pl-3 font-medium">Last seen</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--cms-divider)]">
                          <tr className="hover:bg-black/5 dark:hover:bg-white/5">
                            <td className="py-3 pr-3 font-semibold text-[var(--cms-text)]">101 · Standard</td>
                            <td className="py-3 px-3 font-mono-tabular">ARU-TV-101</td>
                            <td className="py-3 px-3">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-semibold text-[11px]">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                Online
                              </span>
                            </td>
                            <td className="py-3 px-3 text-[var(--cms-text-secondary)]">Basic</td>
                            <td className="py-3 pl-3 text-[var(--cms-text-secondary)]">Just now</td>
                          </tr>
                          <tr className="hover:bg-black/5 dark:hover:bg-white/5">
                            <td className="py-3 pr-3 font-semibold text-[var(--cms-text)]">102 · Standard</td>
                            <td className="py-3 px-3 font-mono-tabular">ARU-TV-102</td>
                            <td className="py-3 px-3">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-semibold text-[11px]">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                Online
                              </span>
                            </td>
                            <td className="py-3 px-3 text-[var(--cms-text-secondary)]">Basic</td>
                            <td className="py-3 pl-3 text-[var(--cms-text-secondary)]">Just now</td>
                          </tr>
                          <tr className="hover:bg-black/5 dark:hover:bg-white/5">
                            <td className="py-3 pr-3 font-semibold text-[var(--cms-text)]">103 · Standard</td>
                            <td className="py-3 px-3 font-mono-tabular">ARU-TV-103</td>
                            <td className="py-3 px-3">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-semibold text-[11px]">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                Online
                              </span>
                            </td>
                            <td className="py-3 px-3 text-[var(--cms-text-secondary)]">Basic</td>
                            <td className="py-3 pl-3 text-[var(--cms-text-secondary)]">Just now</td>
                          </tr>
                          <tr className="hover:bg-black/5 dark:hover:bg-white/5">
                            <td className="py-3 pr-3 font-semibold text-[var(--cms-text)]">201 · Deluxe</td>
                            <td className="py-3 px-3 font-mono-tabular">ARU-TV-201</td>
                            <td className="py-3 px-3">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-semibold text-[11px]">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                Online
                              </span>
                            </td>
                            <td className="py-3 px-3 text-[var(--cms-text-secondary)]">International</td>
                            <td className="py-3 pl-3 text-[var(--cms-text-secondary)]">Just now</td>
                          </tr>
                          <tr className="hover:bg-black/5 dark:hover:bg-white/5">
                            <td className="py-3 pr-3 font-semibold text-[var(--cms-text)]">202 · Deluxe</td>
                            <td className="py-3 px-3 font-mono-tabular">ARU-TV-202</td>
                            <td className="py-3 px-3">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-700 dark:text-rose-300 font-semibold text-[11px]">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                                Offline
                              </span>
                            </td>
                            <td className="py-3 px-3 text-[var(--cms-text-secondary)]">International</td>
                            <td className="py-3 pl-3 text-rose-600 dark:text-rose-400 font-medium">18 min ago</td>
                          </tr>
                          <tr className="hover:bg-black/5 dark:hover:bg-white/5">
                            <td className="py-3 pr-3 font-semibold text-[var(--cms-text)]">301 · Suite</td>
                            <td className="py-3 px-3 font-mono-tabular">2 TVs</td>
                            <td className="py-3 px-3">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 font-semibold text-[11px]">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                1 offline
                              </span>
                            </td>
                            <td className="py-3 px-3 text-[var(--cms-text-secondary)]">Sports</td>
                            <td className="py-3 pl-3 text-[var(--cms-text-secondary)]">Mixed</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[var(--cms-divider)] text-[11px] text-[var(--cms-text-secondary)]">
                    7 devices • 6 rooms • 2 need attention
                  </div>
                </div>

                {/* Right (40%): Playback Insights Dual-Line SVG Chart */}
                <div className="lg:col-span-5 p-6 rounded-2xl bg-[var(--cms-surface)] border border-[var(--cms-divider)] flex flex-col justify-between shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-bold text-[var(--cms-text)]">{ct.playbackInsightsTitle}</h2>
                      <p className="text-[11px] text-[var(--cms-text-secondary)]">
                        {ct.playbackInsightsSub}
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-lg bg-[var(--cms-bg)] border border-[var(--cms-divider)] text-xs font-medium cursor-pointer">
                      Last 7 days ▾
                    </span>
                  </div>

                  {/* Dual-Line SVG Chart */}
                  <div className="w-full h-52 relative pt-2">
                    <svg viewBox="0 0 520 170" className="w-full h-full overflow-visible">
                      <defs>
                        <linearGradient id="hotelGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#4F3FE5" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#4F3FE5" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>

                      {/* Horizontal Grid Lines */}
                      {[30, 65, 100, 135].map((y, idx) => (
                        <g key={idx}>
                          <line x1="36" y1={y} x2="500" y2={y} stroke="var(--cms-divider)" strokeDasharray="3 3" />
                          <text
                            x="4"
                            y={y + 4}
                            fill="var(--cms-text-secondary)"
                            fontSize="10"
                            fontFamily="JetBrains Mono, monospace"
                          >
                            {200 - idx * 50}
                          </text>
                        </g>
                      ))}

                      {/* Line 1: Hotel Content */}
                      <path
                        d="M 50 120 L 125 95 L 200 68 L 275 80 L 350 50 L 425 25 L 500 42 L 500 135 L 50 135 Z"
                        fill="url(#hotelGrad)"
                      />
                      <path
                        d="M 50 120 L 125 95 L 200 68 L 275 80 L 350 50 L 425 25 L 500 42"
                        fill="none"
                        stroke="#4F3FE5"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="animate-chart-line"
                      />

                      {/* Line 2: Live TV */}
                      <path
                        d="M 50 130 L 125 120 L 200 105 L 275 108 L 350 98 L 425 90 L 500 95"
                        fill="none"
                        stroke="#FF5E70"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeDasharray="4 2"
                        className="animate-chart-line"
                      />

                      {/* Dots and Labels */}
                      {[
                        { x: 50, y1: 120, y2: 130, label: '25 Oct' },
                        { x: 125, y1: 95, y2: 120, label: '26 Oct' },
                        { x: 200, y1: 68, y2: 105, label: '27 Oct' },
                        { x: 275, y1: 80, y2: 108, label: '28 Oct' },
                        { x: 350, y1: 50, y2: 98, label: '29 Oct' },
                        { x: 425, y1: 25, y2: 90, label: '30 Oct' },
                        { x: 500, y1: 42, y2: 95, label: '31 Oct' },
                      ].map((pt, i) => (
                        <g key={i}>
                          <circle cx={pt.x} cy={pt.y1} r="4" fill="#4F3FE5" stroke="white" strokeWidth="2" />
                          <circle cx={pt.x} cy={pt.y2} r="3.5" fill="#FF5E70" stroke="white" strokeWidth="1.5" />
                          <text
                            x={pt.x}
                            y="155"
                            textAnchor="middle"
                            fill="var(--cms-text-secondary)"
                            fontSize="9"
                            fontFamily="JetBrains Mono, monospace"
                          >
                            {pt.label}
                          </text>
                        </g>
                      ))}
                    </svg>
                  </div>

                  {/* Legend & Footnote */}
                  <div className="pt-2 border-t border-[var(--cms-divider)] flex items-center justify-between text-[11px] text-[var(--cms-text-secondary)]">
                    <div className="flex items-center gap-4">
                      <span className="inline-flex items-center gap-1.5 font-medium text-[var(--cms-text)]">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#4F3FE5]" />
                        Hotel content
                      </span>
                      <span className="inline-flex items-center gap-1.5 font-medium text-[var(--cms-text)]">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#FF5E70]" />
                        Live TV
                      </span>
                    </div>
                    <span>Playback events, not guest counts.</span>
                  </div>
                </div>
              </div>

              {/* Supporting Row: 3 Equal Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 1. Brand & Welcome */}
                <div className="p-5 rounded-2xl bg-[var(--cms-surface)] border border-[var(--cms-divider)] flex flex-col justify-between shadow-xs space-y-4">
                  <div className="space-y-3">
                    <div className="text-xs font-bold uppercase tracking-wider text-[var(--cms-text-secondary)]">
                      {ct.brandWelcomeCard}
                    </div>
                    <div className="relative rounded-xl overflow-hidden h-28 border border-[var(--cms-divider)] group">
                      <img
                        src="/assets/aistudio/file_00000000a6b08211935c3a540293bf6c_74821162.png"
                        alt="Brand preview"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/45 p-3 flex flex-col justify-between text-white">
                        <GojjaWordmark size="sm" showDescriptor={false} variant="reverse" />
                        <div>
                          <div className="text-xs font-bold">Welcome to {activeProperty.name}</div>
                          <div className="text-[10px] text-slate-300">ID · EN · 中文 · 日本語</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[var(--cms-text-secondary)]">Experience status:</span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-semibold text-[11px]">
                        Published
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab('branding')}
                    className="w-full py-2.5 px-3 rounded-xl bg-[var(--cms-bg)] hover:border-[var(--brand-indigo)] border border-[var(--cms-divider)] text-xs font-semibold text-[var(--cms-text)] inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>{ct.openBrandStudioBtn}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* 2. Update Approvals */}
                <div className="p-5 rounded-2xl bg-[var(--cms-surface)] border border-[var(--cms-divider)] flex flex-col justify-between shadow-xs space-y-4">
                  <div className="space-y-3">
                    <div className="text-xs font-bold uppercase tracking-wider text-[var(--cms-text-secondary)]">
                      {ct.updateApprovalsCard}
                    </div>
                    <div className="p-4 rounded-xl bg-[var(--cms-bg)] border border-[var(--cms-divider)] flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-500/15 text-[#7C35E0] flex items-center justify-center shrink-0">
                        <Download className="w-5 h-5" />
                      </div>
                      <div className="space-y-0.5">
                        <div className="text-sm font-bold text-[var(--cms-text)]">TV App v1.0.4</div>
                        <div className="text-xs text-amber-600 dark:text-amber-400 font-semibold">
                          2 devices pending approval
                        </div>
                        <div className="text-[10px] text-[var(--cms-text-secondary)] pt-1">
                          ⓘ Install only when eligible and approved.
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab('updates')}
                    className="w-full py-2.5 px-3 rounded-xl bg-[var(--cms-bg)] hover:border-[var(--brand-indigo)] border border-[var(--cms-divider)] text-xs font-semibold text-[var(--cms-text)] inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>{ct.reviewScheduleBtn}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* 3. Recent Activity */}
                <div className="p-5 rounded-2xl bg-[var(--cms-surface)] border border-[var(--cms-divider)] flex flex-col justify-between shadow-xs space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-[var(--cms-text-secondary)]">
                        {ct.recentActivityCard}
                      </span>
                      <button
                        onClick={() => setActiveTab('support-qa')}
                        className="text-xs font-semibold text-[var(--cms-link)] hover:underline inline-flex items-center gap-0.5"
                      >
                        <span>View all</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="space-y-2.5 text-xs">
                      <div className="flex items-start gap-2.5">
                        <span className="w-2 h-2 rounded-full bg-[#7C35E0] mt-1.5 shrink-0" />
                        <div className="min-w-0">
                          <div className="font-semibold text-[var(--cms-text)]">Welcome campaign published</div>
                          <div className="text-[10px] text-[var(--cms-text-secondary)]">12 min ago · Marketing Admin</div>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <span className="w-2 h-2 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                        <div className="min-w-0">
                          <div className="font-semibold text-[var(--cms-text)]">Room 202 device went offline</div>
                          <div className="text-[10px] text-[var(--cms-text-secondary)]">18 min ago · ARU-TV-202</div>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                        <div className="min-w-0">
                          <div className="font-semibold text-[var(--cms-text)]">Connector online · Front Office PC</div>
                          <div className="text-[10px] text-[var(--cms-text-secondary)]">24 min ago · Heartbeat OK</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[var(--cms-divider)] text-[10px] text-[var(--cms-text-secondary)] font-mono-tabular">
                    SSOT Audit Log · 3 events in last hour
                  </div>
                </div>
              </div>

              {/* Persistent Footer Bar (Exact V-12: Cloud connected, Connector online, Privacy, Help) */}
              <div className="pt-6 border-t border-[var(--cms-divider)] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[var(--cms-text-secondary)]">
                <div>© 2026 GOJJA SmartTV</div>
                <div className="flex flex-wrap items-center gap-4">
                  <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Cloud connected
                  </span>
                  <span>·</span>
                  <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Local connector online
                  </span>
                  <span>·</span>
                  <a href="#privacy" className="hover:text-[var(--cms-text)]">Privacy</a>
                  <span>·</span>
                  <a href="#help" onClick={(e) => { e.preventDefault(); setActiveTab('support-qa'); }} className="hover:text-[var(--cms-text)]">Help</a>
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* TAB 2: ROOMS, GUESTS & CORPORATE GROUPS                               */}
          {/* ===================================================================== */}
          {(activeTab === 'rooms' || activeTab === 'guests') && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="text-2xl font-bold">{ct.roomsHeaderTitle} — {activeProperty.name}</h1>
                  <p className="text-xs text-[var(--cms-text-secondary)]">
                    {ct.roomsHeaderSub}
                  </p>
                </div>

                {roomsSubNav === 'rooms' && (
                  /* Add Room Form (Validates Duplicate Room Code per Property — F-006) */
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      try {
                        await apiCall('/api/rooms/create', {
                          method: 'POST',
                          body: JSON.stringify({
                            propertyId: activeProperty.id,
                            code: newRoomCode,
                            roomClass: newRoomClass,
                            floor: 1,
                          }),
                        });
                        setNewRoomCode('');
                        await fetchBootstrap();
                        showNotice('success', `Room ${newRoomCode} added to ${activeProperty.name}.`);
                      } catch (err: unknown) {
                        showNotice('error', err instanceof Error ? err.message : 'Failed to create room');
                      }
                    }}
                    className="flex flex-wrap items-center gap-2 text-xs"
                  >
                    <input
                      type="text"
                      value={newRoomCode}
                      onChange={(e) => setNewRoomCode(e.target.value)}
                      placeholder="New Room Code (e.g. 104)"
                      className="px-3 py-2 rounded-xl bg-[var(--cms-surface)] border border-[var(--cms-control-border)] font-mono-tabular"
                    />
                    <select
                      value={newRoomClass}
                      onChange={(e) => setNewRoomClass(e.target.value as 'Standard' | 'Deluxe' | 'Suite' | 'Studio')}
                      className="px-3 py-2 rounded-xl bg-[var(--cms-surface)] border border-[var(--cms-control-border)]"
                    >
                      <option value="Standard">Standard</option>
                      <option value="Deluxe">Deluxe</option>
                      <option value="Suite">Suite</option>
                      <option value="Studio">Studio</option>
                    </select>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-[#0050F5] text-white font-semibold inline-flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{ct.addRoomBtn}</span>
                    </button>
                  </form>
                )}
              </div>

              {/* Sub-Navigation Bar for Rooms & Guests Suite */}
              <div className="flex items-center gap-2 border-b border-[var(--cms-divider)] pb-3 overflow-x-auto">
                <button
                  type="button"
                  onClick={() => setRoomsSubNav('rooms')}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-2 transition-all cursor-pointer ${
                    roomsSubNav === 'rooms'
                      ? 'bg-[#0050F5] text-white shadow-xs'
                      : 'text-[var(--cms-text-secondary)] hover:text-[var(--cms-text)] hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  <Bed className="w-4 h-4" />
                  <span>Kamar & TV ({propRooms.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRoomsSubNav('guests')}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-2 transition-all cursor-pointer ${
                    roomsSubNav === 'guests'
                      ? 'bg-[#0050F5] text-white shadow-xs'
                      : 'text-[var(--cms-text-secondary)] hover:text-[var(--cms-text)] hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>Daftar Tamu & Check-In ({propStays.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRoomsSubNav('groups')}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-2 transition-all cursor-pointer ${
                    roomsSubNav === 'groups'
                      ? 'bg-[#0050F5] text-white shadow-xs'
                      : 'text-[var(--cms-text-secondary)] hover:text-[var(--cms-text)] hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Grup Tour & Korporat VIP ({data.corporateGroups.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRoomsSubNav('pms')}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-2 transition-all cursor-pointer ${
                    roomsSubNav === 'pms'
                      ? 'bg-[#0050F5] text-white shadow-xs'
                      : 'text-[var(--cms-text-secondary)] hover:text-[var(--cms-text)] hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span>Integrasi PMS Hotel</span>
                </button>
              </div>

              {/* VIEW 1: KAMAR & TV (Rooms Table & Endpoint Binding) */}
              {roomsSubNav === 'rooms' && (
                <div className="p-5 rounded-2xl bg-[var(--cms-surface)] border border-[var(--cms-divider)] overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-[var(--cms-divider)] text-[var(--cms-text-secondary)]">
                        <th className="py-2.5 pr-3">Room</th>
                        <th className="py-2.5 px-3">Class</th>
                        <th className="py-2.5 px-3">Occupancy (Stay)</th>
                        <th className="py-2.5 px-3">{ct.roomTvLocaleLabel}</th>
                        <th className="py-2.5 px-3">Housekeeping Readiness</th>
                        <th className="py-2.5 px-3">Bound TV Endpoints</th>
                        <th className="py-2.5 pl-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--cms-divider)]">
                      {propRooms
                        .filter(
                          (r) =>
                            !searchQuery ||
                            r.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            r.roomClass.toLowerCase().includes(searchQuery.toLowerCase())
                        )
                        .map((room) => {
                          const stay = propStays.find((s) => s.roomId === room.id && s.status === 'InHouse');
                          const eps = propEndpoints.filter((e) => e.roomId === room.id);
                          const activeRoomLocale: GuestLocale = stay?.locale || activeProperty.defaultLocale || 'id';
                          const corpGroup = stay?.groupId ? data.corporateGroups.find((g) => g.id === stay.groupId) : null;
                          return (
                            <tr key={room.id} className="hover:bg-black/5 dark:hover:bg-white/5">
                              <td className="py-3 pr-3 font-mono-tabular font-bold text-sm">Room {room.code}</td>
                              <td className="py-3 px-3">{room.roomClass}</td>
                              <td className="py-3 px-3">
                                {stay ? (
                                  <div className="space-y-1">
                                    <div className="font-semibold text-blue-700 dark:text-blue-300">
                                      InHouse ({stay.displayName || 'Tamu Terhormat'})
                                    </div>
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400">
                                        TV: {stay.locale.toUpperCase()}
                                      </span>
                                      {corpGroup && (
                                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-700 dark:text-amber-300">
                                          🌟 {corpGroup.name}
                                        </span>
                                      )}
                                      <button
                                        type="button"
                                        onClick={async () => {
                                          try {
                                            await apiCall('/api/stays/checkout', {
                                              method: 'POST',
                                              body: JSON.stringify({
                                                stayId: stay.id,
                                                expectedContextVersion: stay.contextVersion,
                                              }),
                                            });
                                            await fetchBootstrap();
                                            showNotice('success', `Check-out ${stay.id} berhasil. PII tamu dibersihkan.`);
                                          } catch (err: unknown) {
                                            showNotice('error', err instanceof Error ? err.message : 'Check-out gagal');
                                          }
                                        }}
                                        className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-500/15 text-rose-700 dark:text-rose-300 hover:bg-rose-500/25 cursor-pointer"
                                      >
                                        Check-Out
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-2">
                                    <span className="text-[var(--cms-text-secondary)]">Vacant</span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setCheckInRoomId(room.id);
                                        setRoomsSubNav('guests');
                                      }}
                                      className="px-2 py-1 rounded-lg bg-[#0050F5]/10 hover:bg-[#0050F5]/20 text-[#0050F5] dark:text-[#C7B9FF] font-semibold text-[11px] inline-flex items-center gap-1 cursor-pointer"
                                    >
                                      <Plus className="w-3 h-3" />
                                      <span>Check-In Tamu</span>
                                    </button>
                                  </div>
                                )}
                              </td>
                              <td className="py-3 px-3">
                                <div className="inline-flex items-center gap-1 rounded-xl bg-[var(--cms-bg)] p-1 border border-[var(--cms-divider)]">
                                  {(
                                    [
                                      { code: 'en', short: 'EN' },
                                      { code: 'id', short: 'ID' },
                                      { code: 'zh-CN', short: '中文' },
                                      { code: 'ja-JP', short: '日本語' },
                                    ] as Array<{ code: GuestLocale; short: string }>
                                  ).map((loc) => (
                                    <button
                                      key={loc.code}
                                      type="button"
                                      onClick={async () => {
                                        try {
                                          const res = await apiCall('/api/stays/locale', {
                                            method: 'POST',
                                            body: JSON.stringify({
                                              propertyId: activeProperty.id,
                                              roomId: room.id,
                                              stayId: stay?.id,
                                              locale: loc.code,
                                              updatePropertyDefault: !stay,
                                            }),
                                          });
                                          setBrandLocaleTab(loc.code);
                                          await fetchBootstrap();
                                          showNotice('success', res.message || `Room ${room.code} TV language set to ${loc.short} (${loc.code}).`);
                                        } catch (err: unknown) {
                                          showNotice('error', err instanceof Error ? err.message : 'Failed to update TV language');
                                        }
                                      }}
                                      className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                                        activeRoomLocale === loc.code
                                          ? 'bg-[#0050F5] text-white shadow-xs'
                                          : 'text-[var(--cms-text-secondary)] hover:text-[var(--cms-text)]'
                                      }`}
                                      title={`Set Room ${room.code} SmartTV Language to ${loc.short} (${loc.code})`}
                                    >
                                      {loc.short}
                                    </button>
                                  ))}
                                </div>
                              </td>
                              <td className="py-3 px-3">
                                <button
                                  type="button"
                                  onClick={async () => {
                                    try {
                                      const nextHk = room.housekeeping === 'Ready' ? 'Dirty' : 'Ready';
                                      await apiCall('/api/rooms/readiness', {
                                        method: 'POST',
                                        body: JSON.stringify({
                                          roomId: room.id,
                                          housekeeping: nextHk,
                                          maintenanceAuthorized: nextHk === 'Ready',
                                        }),
                                      });
                                      await fetchBootstrap();
                                      showNotice('info', `Room ${room.code} housekeeping set to ${nextHk}.`);
                                    } catch (err: unknown) {
                                      showNotice('error', err instanceof Error ? err.message : 'Action denied');
                                    }
                                  }}
                                  className={`px-2.5 py-1 rounded-lg font-semibold cursor-pointer ${
                                    room.housekeeping === 'Ready'
                                      ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                                      : 'bg-amber-500/15 text-amber-800 dark:text-amber-300'
                                  }`}
                                >
                                  {room.housekeeping} (Click to Toggle)
                                </button>
                              </td>
                              <td className="py-3 px-3 space-y-1">
                                {eps.length === 0 ? (
                                  <div className="flex items-center gap-2">
                                    <span className="text-[var(--cms-text-secondary)]">Belum Ada TV Terikat</span>
                                    <button
                                      type="button"
                                      onClick={() => setActiveTab('discovery')}
                                      className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-700 dark:text-amber-300 font-semibold text-[10px] hover:bg-amber-500/25 cursor-pointer"
                                    >
                                      + Pasangkan TV
                                    </button>
                                  </div>
                                ) : (
                                  eps.map((ep) => (
                                    <div key={ep.id} className="flex items-center gap-2 font-mono-tabular">
                                      <span className="font-semibold">{ep.id}</span>
                                      <span>·</span>
                                      <span>{ep.label || ep.modelName}</span>
                                      <span>·</span>
                                      <span
                                        className={
                                          ep.connection === 'Online'
                                            ? 'text-emerald-700 dark:text-emerald-300 font-semibold'
                                            : 'text-rose-700 dark:text-rose-300 font-semibold'
                                        }
                                      >
                                        {ep.connection}
                                      </span>
                                      <span>·</span>
                                      <span className="text-[11px] text-[var(--cms-text-secondary)]">
                                        {ep.capabilityProfile} (v{ep.appVersion})
                                      </span>
                                    </div>
                                  ))
                                )}
                              </td>
                              <td className="py-3 pl-3 text-right">
                                {eps.map((ep) => (
                                  <button
                                    key={ep.id}
                                    type="button"
                                    onClick={() => {
                                      setBrandLocaleTab(activeRoomLocale);
                                      setTvModalEndpointId(ep.id);
                                    }}
                                    className="ml-1.5 px-2.5 py-1 rounded-lg bg-[#0050F5] text-white font-semibold hover:bg-[#0040C8] cursor-pointer"
                                  >
                                    Preview {ep.id}
                                  </button>
                                ))}
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* VIEW 2: DAFTAR TAMU & MANUAL CHECK-IN */}
              {roomsSubNav === 'guests' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold">Guest Stays & Check-In Mandiri (Front Office Lifecycle)</h2>
                    <p className="text-xs text-[var(--cms-text-secondary)]">
                      Front Office dapat melakukan check-in tamu, menentukan gelar/salutation sapaan TV, memilih bahasa antarmuka TV, serta menghubungkan tamu ke rombongan grup tour atau corporate VIP.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Manual Check-In Form */}
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        const fullDisplayName = checkInGuestName.trim()
                          ? (checkInSalutation ? `${checkInSalutation} ${checkInGuestName.trim()}` : checkInGuestName.trim())
                          : null;
                        try {
                          await apiCall('/api/stays/checkin', {
                            method: 'POST',
                            body: JSON.stringify({
                              propertyId: activeProperty.id,
                              roomId: checkInRoomId,
                              displayName: fullDisplayName,
                              locale: checkInLocale,
                              groupId: checkInGroupId || null,
                            }),
                          });
                          setCheckInGuestName('');
                          await fetchBootstrap();
                          showNotice('success', `Check-in berhasil untuk ${checkInRoomId}: ${fullDisplayName || 'Tamu Terhormat'} (Bahasa: ${checkInLocale.toUpperCase()}).`);
                        } catch (err: unknown) {
                          showNotice('error', err instanceof Error ? err.message : 'Check-in denied');
                        }
                      }}
                      className="lg:col-span-4 p-5 rounded-2xl bg-[var(--cms-surface)] border border-[var(--cms-divider)] space-y-3.5 text-xs"
                    >
                      <h3 className="text-base font-bold flex items-center gap-2">
                        <Users className="w-4 h-4 text-[#0050F5]" />
                        <span>Formulir Check-In Tamu (Front Desk)</span>
                      </h3>

                      <div>
                        <label className="block font-medium mb-1">Pilih Kamar Target</label>
                        <select
                          value={checkInRoomId}
                          onChange={(e) => setCheckInRoomId(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-[var(--cms-input)] border border-[var(--cms-control-border)] font-mono-tabular"
                        >
                          {propRooms.map((r) => (
                            <option key={r.id} value={r.id}>
                              Room {r.code} ({r.roomClass})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block font-medium mb-1">Gelar / Salutation</label>
                          <select
                            value={checkInSalutation}
                            onChange={(e) => setCheckInSalutation(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-[var(--cms-input)] border border-[var(--cms-control-border)] font-semibold"
                          >
                            <option value="Mr.">Mr. (Pria)</option>
                            <option value="Mrs.">Mrs. (Wanita Menikah)</option>
                            <option value="Ms.">Ms. (Wanita)</option>
                            <option value="Dr.">Dr. (Dokter/Akademisi)</option>
                            <option value="Bapak">Bapak (ID Formal)</option>
                            <option value="Ibu">Ibu (ID Formal)</option>
                            <option value="">(Tanpa Gelar)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block font-medium mb-1">Bahasa TV (4 Bahasa)</label>
                          <select
                            value={checkInLocale}
                            onChange={(e) => setCheckInLocale(e.target.value as GuestLocale)}
                            className="w-full px-3 py-2 rounded-xl bg-[var(--cms-input)] border border-[var(--cms-control-border)] font-bold"
                          >
                            <option value="id">🇮🇩 Indonesia</option>
                            <option value="en">🇬🇧 English</option>
                            <option value="zh-CN">🇨🇳 简体中文</option>
                            <option value="ja-JP">🇯🇵 日本語</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block font-medium mb-1">Nama Tamu (Guest Name)</label>
                        <input
                          type="text"
                          value={checkInGuestName}
                          onChange={(e) => setCheckInGuestName(e.target.value)}
                          placeholder="Contoh: David Wilson / Hendra Pratama"
                          className="w-full px-3 py-2 rounded-xl bg-[var(--cms-input)] border border-[var(--cms-control-border)] font-medium"
                        />
                      </div>

                      {/* Live TV Greeting Preview */}
                      <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-[11px] space-y-1">
                        <div className="font-semibold text-blue-900 dark:text-blue-200">Pratinjau Sapaan di Layar TV:</div>
                        <div className="font-bold text-sm text-[#0050F5] dark:text-[#C7B9FF]">
                          {checkInGuestName.trim()
                            ? `${checkInSalutation ? checkInSalutation + ' ' : ''}${checkInGuestName.trim()}`
                            : 'Selamat Datang di Arunika'}
                        </div>
                        {checkInGroupId && (
                          <div className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">
                            🌟 Terikat Rombongan: {data.corporateGroups.find((g) => g.id === checkInGroupId)?.name}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block font-medium mb-1">Rombongan / Grup Korporat (Opsional)</label>
                        <select
                          value={checkInGroupId}
                          onChange={(e) => setCheckInGroupId(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-[var(--cms-input)] border border-[var(--cms-control-border)]"
                        >
                          <option value="">Tidak Ada (Tamu Perorangan)</option>
                          {data.corporateGroups.map((g) => (
                            <option key={g.id} value={g.id}>
                              {g.name} ({g.badgeText})
                            </option>
                          ))}
                        </select>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 px-4 rounded-xl bg-[#0050F5] hover:bg-[#0040C8] text-white font-semibold cursor-pointer"
                      >
                        Selesaikan Check-In Tamu
                      </button>
                    </form>

                    {/* Active Stays Board */}
                    <div className="lg:col-span-8 p-5 rounded-2xl bg-[var(--cms-surface)] border border-[var(--cms-divider)] space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-bold">Daftar Tamu Menginap ({propStays.length} Sesi Aktif)</h3>
                        <span className="text-xs text-[var(--cms-text-secondary)]">
                          Masking PII: <strong>{currentRole.permissions.includes('guests.name.read') ? 'Akses Penuh' : 'Tersensor (Zero-PII)'}</strong>
                        </span>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="border-b border-[var(--cms-divider)] text-[var(--cms-text-secondary)]">
                              <th className="py-2 pr-3">Stay ID</th>
                              <th className="py-2 px-3">Room</th>
                              <th className="py-2 px-3">Nama Tamu & Gelar</th>
                              <th className="py-2 px-3">Bahasa TV</th>
                              <th className="py-2 px-3">Rombongan Grup</th>
                              <th className="py-2 px-3">Status</th>
                              <th className="py-2 pl-3 text-right">Aksi</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[var(--cms-divider)]">
                            {propStays.length === 0 ? (
                              <tr>
                                <td colSpan={7} className="py-8 text-center text-[var(--cms-text-secondary)]">
                                  Belum ada tamu menginap aktif saat ini.
                                </td>
                              </tr>
                            ) : (
                              propStays.map((st) => {
                                const rm = propRooms.find((r) => r.id === st.roomId);
                                const grp = data.corporateGroups.find((g) => g.id === st.groupId);
                                return (
                                  <tr key={st.id}>
                                    <td className="py-3 pr-3 font-mono-tabular font-semibold">{st.id}</td>
                                    <td className="py-3 px-3 font-mono-tabular">Room {rm?.code || st.roomId}</td>
                                    <td className="py-3 px-3 font-medium">
                                      {st.displayName || <span className="text-[var(--cms-text-secondary)]">Sapaan Standar</span>}
                                    </td>
                                    <td className="py-3 px-3">
                                      <select
                                        value={st.locale}
                                        onChange={async (e) => {
                                          const nextLoc = e.target.value as GuestLocale;
                                          try {
                                            const res = await apiCall('/api/stays/locale', {
                                              method: 'POST',
                                              body: JSON.stringify({
                                                propertyId: activeProperty.id,
                                                roomId: st.roomId,
                                                stayId: st.id,
                                                locale: nextLoc,
                                              }),
                                            });
                                            setBrandLocaleTab(nextLoc);
                                            await fetchBootstrap();
                                            showNotice('success', res.message || `Bahasa TV stay ${st.id} diubah ke ${nextLoc}.`);
                                          } catch (err: unknown) {
                                            showNotice('error', err instanceof Error ? err.message : 'Gagal update bahasa');
                                          }
                                        }}
                                        className="px-2 py-1 rounded-lg bg-[var(--cms-bg)] border border-[var(--cms-control-border)] font-mono-tabular text-xs font-bold"
                                      >
                                        <option value="id">ID (Indonesia)</option>
                                        <option value="en">EN (English)</option>
                                        <option value="zh-CN">ZH (中文)</option>
                                        <option value="ja-JP">JA (日本語)</option>
                                      </select>
                                    </td>
                                    <td className="py-3 px-3">
                                      {grp ? (
                                        <span className="font-semibold text-amber-700 dark:text-amber-300">
                                          🌟 {grp.name}
                                        </span>
                                      ) : (
                                        <span className="text-[var(--cms-text-secondary)]">—</span>
                                      )}
                                    </td>
                                    <td className="py-3 px-3 font-semibold">
                                      {st.status === 'InHouse' ? (
                                        <span className="text-emerald-700 dark:text-emerald-300">InHouse</span>
                                      ) : (
                                        <span className="text-[var(--cms-text-secondary)]">{st.status}</span>
                                      )}
                                    </td>
                                    <td className="py-3 pl-3 text-right">
                                      {st.status === 'InHouse' && (
                                        <button
                                          type="button"
                                          onClick={async () => {
                                            try {
                                              await apiCall('/api/stays/checkout', {
                                                method: 'POST',
                                                body: JSON.stringify({
                                                  stayId: st.id,
                                                  expectedContextVersion: st.contextVersion,
                                                }),
                                              });
                                              await fetchBootstrap();
                                              showNotice(
                                                'success',
                                                `Check-out ${st.id} selesai. Data PII dihapus, room diset Dirty untuk Housekeeping.`
                                              );
                                            } catch (err: unknown) {
                                              showNotice('error', err instanceof Error ? err.message : 'Checkout denied');
                                            }
                                          }}
                                          className="px-2.5 py-1 rounded-lg bg-rose-500/15 text-rose-700 dark:text-rose-300 font-semibold hover:bg-rose-500/25 cursor-pointer"
                                        >
                                          Check-Out & Purge
                                        </button>
                                      )}
                                    </td>
                                  </tr>
                                );
                              })
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* VIEW 3: GRUP TOUR & KORPORAT VIP */}
              {roomsSubNav === 'groups' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold">Grup Tour, Delegasi & Korporat VIP (Custom Welcome Messages)</h2>
                    <p className="text-xs text-[var(--cms-text-secondary)]">
                      Kelola rombongan tour travel dan tamu delegasi perusahaan. Anggota rombongan yang check-in akan mendapatkan lencana VIP khusus dan ucapan selamat datang personal dalam 4 bahasa di TV kamar.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Add Group Form */}
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        if (!newGroupName.trim()) return;
                        try {
                          await apiCall('/api/groups/create', {
                            method: 'POST',
                            body: JSON.stringify({
                              propertyId: activeProperty.id,
                              name: newGroupName,
                              badgeText: newGroupBadge,
                              message: {
                                id: newGroupMessageId,
                                en: newGroupMessageEn,
                                'zh-CN': `欢迎，${newGroupName} 代表团`,
                                'ja-JP': `${newGroupName} の皆様、ようこそ`,
                              },
                            }),
                          });
                          setNewGroupName('');
                          await fetchBootstrap();
                          showNotice('success', `Rombongan "${newGroupName}" berhasil didaftarkan.`);
                        } catch (err: unknown) {
                          showNotice('error', err instanceof Error ? err.message : 'Gagal membuat grup');
                        }
                      }}
                      className="lg:col-span-4 p-5 rounded-2xl bg-[var(--cms-surface)] border border-[var(--cms-divider)] space-y-3.5 text-xs"
                    >
                      <h3 className="text-base font-bold flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        <span>Daftarkan Rombongan / Grup Baru</span>
                      </h3>

                      <div>
                        <label className="block font-medium mb-1">Nama Grup / Event</label>
                        <input
                          type="text"
                          value={newGroupName}
                          onChange={(e) => setNewGroupName(e.target.value)}
                          placeholder="Contoh: Nusantara Executive Summit 2026"
                          className="w-full px-3 py-2 rounded-xl bg-[var(--cms-input)] border border-[var(--cms-control-border)]"
                          required
                        />
                      </div>

                      <div>
                        <label className="block font-medium mb-1">Badge Sapaan VIP di TV</label>
                        <input
                          type="text"
                          value={newGroupBadge}
                          onChange={(e) => setNewGroupBadge(e.target.value)}
                          placeholder="Contoh: Corporate Summit Delegation"
                          className="w-full px-3 py-2 rounded-xl bg-[var(--cms-input)] border border-[var(--cms-control-border)]"
                        />
                      </div>

                      <div>
                        <label className="block font-medium mb-1">Sambutan TV (Bahasa Indonesia)</label>
                        <input
                          type="text"
                          value={newGroupMessageId}
                          onChange={(e) => setNewGroupMessageId(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-[var(--cms-input)] border border-[var(--cms-control-border)]"
                        />
                      </div>

                      <div>
                        <label className="block font-medium mb-1">Sambutan TV (English)</label>
                        <input
                          type="text"
                          value={newGroupMessageEn}
                          onChange={(e) => setNewGroupMessageEn(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-[var(--cms-input)] border border-[var(--cms-control-border)]"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 px-4 rounded-xl bg-[#0050F5] hover:bg-[#0040C8] text-white font-semibold cursor-pointer"
                      >
                        Simpan Rombongan Baru
                      </button>
                    </form>

                    {/* Groups List */}
                    <div className="lg:col-span-8 space-y-4">
                      <h3 className="text-base font-bold">Rombongan Terdaftar ({data.corporateGroups.length})</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {data.corporateGroups.map((grp) => {
                          const activeInGroup = propStays.filter((s) => s.groupId === grp.id && s.status === 'InHouse');
                          return (
                            <div
                              key={grp.id}
                              className="p-4 rounded-2xl bg-[var(--cms-surface)] border border-[var(--cms-divider)] space-y-2.5 text-xs"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-sm text-[var(--cms-text)]">{grp.name}</span>
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-700 dark:text-amber-300">
                                  {grp.badgeText}
                                </span>
                              </div>
                              <div className="text-[11px] text-[var(--cms-text-secondary)] space-y-1">
                                <div>ID: <code className="font-mono-tabular">{grp.id}</code></div>
                                <div>Tamu Menginap Aktif: <strong className="text-emerald-600 dark:text-emerald-400">{activeInGroup.length} Kamar</strong></div>
                              </div>
                              <div className="p-2.5 rounded-xl bg-[var(--cms-bg)] border border-[var(--cms-divider)] space-y-1 text-[11px]">
                                <div className="font-semibold text-[var(--cms-text)]">Pesan Sambutan Layar TV:</div>
                                <div className="italic text-[var(--cms-text-secondary)]">🇮🇩 "{grp.message?.id}"</div>
                                <div className="italic text-[var(--cms-text-secondary)]">🇬🇧 "{grp.message?.en}"</div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* VIEW 4: INTEGRASI PMS HOTEL */}
              {roomsSubNav === 'pms' && (
                <div className="p-6 rounded-2xl bg-[var(--cms-surface)] border border-[var(--cms-divider)] space-y-5 text-xs">
                  <div className="flex items-center gap-3">
                    <Building2 className="w-6 h-6 text-[#0050F5]" />
                    <div>
                      <h2 className="text-base font-bold">Integrasi PMS (Property Management System) & POS Hotel</h2>
                      <p className="text-[var(--cms-text-secondary)]">
                        Arsitektur penghubung sistem operasional hotel (Opera Cloud, Cloudbeds, VHP, Mews, Realta) dengan GOJJA SmartTV secara realtime.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                    <div className="p-4 rounded-xl bg-[var(--cms-bg)] border border-[var(--cms-divider)] space-y-2">
                      <div className="font-bold text-sm text-[#0050F5]">1. Check-In Otomatis</div>
                      <p className="text-[var(--cms-text-secondary)] leading-relaxed">
                        Saat front desk memproses check-in di Opera / Cloudbeds / VHP, webhook mengirimkan event <code>CHECK_IN</code> ke <code>/api/stays/checkin</code> dengan data kamar, nama tamu, gelar (Mr./Mrs./Bapak/Ibu), dan preferensi bahasa. Layar TV kamar otomatis menampilkan sambutan personal dalam hitungan detik.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-[var(--cms-bg)] border border-[var(--cms-divider)] space-y-2">
                      <div className="font-bold text-sm text-emerald-600 dark:text-emerald-400">2. Zero-PII Context Purge</div>
                      <p className="text-[var(--cms-text-secondary)] leading-relaxed">
                        Saat tamu menyelesaikan settlement folio di kasir (event <code>CHECK_OUT</code>), endpoint <code>/api/stays/checkout</code> langsung menghapus seluruh nama tamu, riwayat tontonan, dan sesi OTT dari memori TV. TV kembali ke mode hotel default dan status housekeeping berubah menjadi <strong>Dirty</strong>.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-[var(--cms-bg)] border border-[var(--cms-divider)] space-y-2">
                      <div className="font-bold text-sm text-amber-600 dark:text-amber-400">3. Fallback Front Office Mandiri</div>
                      <p className="text-[var(--cms-text-secondary)] leading-relaxed">
                        Jika hotel belum memiliki middleware PMS atau terjadi gangguan jaringan pihak ketiga, resepsionis hotel tetap dapat menginput check-in tamu walk-in langsung dari tab <strong>Daftar Tamu & Check-In</strong> tanpa kendala.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[var(--cms-bg)] border border-[var(--cms-divider)] space-y-2 font-mono-tabular text-[11px]">
                    <div className="font-bold font-sans text-xs text-[var(--cms-text)]">Format Payload Integrasi Webhook PMS:</div>
                    <pre className="p-3 rounded-lg bg-black/80 text-emerald-400 overflow-x-auto text-[11px]">
{`POST /api/stays/checkin
Headers: Content-Type: application/json, X-Gojja-Secret: <hotel_pms_secret>
{
  "propertyId": "${activeProperty.id}",
  "roomId": "ROOM-101",
  "displayName": "Mr. David Wilson",
  "locale": "en",
  "groupId": "G-CORP"
}`}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ===================================================================== */}
          {/* TAB 4: BRAND STUDIO + REAL MEDIA UPLOADS + GOJJACLEANTV ADB LAUNCHER  */}
          {/* ===================================================================== */}
          {activeTab === 'branding' && (
            <div className="brand-studio space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{ct.brandStudioTitle}</h1>
                  <p className="text-sm text-[var(--cms-text-secondary)]">
                    {ct.brandStudioSub}
                  </p>
                </div>
                <div className="text-xs font-mono-tabular text-[var(--cms-text-secondary)]">
                  Draft Resource v{activeProperty.resourceVersion} · Applied Manifest v{data.publications[0]?.version || 4}
                </div>
              </div>

              {/* Two-Column Split Editor + Live Embedded TV Home Preview */}
              <div className="studio-grid">
                {/* Left Column: Real Media Uploaders (Logo, Hero Background Video/Image, Promo Video/Image, Colors, Locales) */}
                <div className="studio-editor space-y-4">
                  {/* 1. REAL HOTEL LOGO UPLOAD + PRESETS + WORDMARK */}
                  <StudioSection title={ct.brandStep1} initialOpen>
                    <div className="flex items-center justify-between">

                      {brandLogoImageUrl && (
                        <button
                          type="button"
                          onClick={() => setBrandLogoImageUrl('')}
                          className="text-[11px] text-rose-600 dark:text-rose-400 hover:underline inline-flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Clear Image</span>
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="w-32 h-24 rounded-xl border border-dashed border-[var(--cms-control-border)] bg-[#10151C] flex flex-col items-center justify-center p-2.5 text-center shrink-0 relative overflow-hidden">
                        {brandLogoImageUrl ? (
                          <img
                            src={brandLogoImageUrl}
                            alt="Uploaded Hotel Logo"
                            referrerPolicy="no-referrer"
                            className="w-12 h-12 object-contain mb-1"
                          />
                        ) : (
                          <Sparkles className="w-5 h-5 text-[#DCC6A1] mb-1" />
                        )}
                        <div className="text-[11px] font-bold tracking-wider text-[#F8F5EE] truncate w-full">{brandLogoText}</div>
                        <div className="text-[9px] tracking-widest text-[#DCC6A1] truncate w-full">{brandLogoSubtitle}</div>
                      </div>

                      <div className="flex-1 space-y-2 text-xs">
                        <label className="w-full py-2 px-3 rounded-xl bg-[#0050F5] hover:bg-[#0040C8] text-white font-semibold inline-flex items-center justify-center gap-2 cursor-pointer transition-colors">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload Logo File (PNG/SVG/JPG)</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              handleUploadFileToDataUrl(file, 10, (dataUrl) => {
                                setBrandLogoImageUrl(dataUrl);
                              });
                            }}
                          />
                        </label>
                        <input
                          type="text"
                          value={brandLogoImageUrl}
                          onChange={(e) => setBrandLogoImageUrl(e.target.value)}
                          placeholder="Or paste Logo Image / SVG URL..."
                          className="w-full px-3 py-1.5 rounded-lg bg-[var(--cms-input)] border border-[var(--cms-control-border)] text-[11px]"
                        />
                        <div className="grid grid-cols-2 gap-1.5">
                          <input
                            type="text"
                            value={brandLogoText}
                            onChange={(e) => setBrandLogoText(e.target.value)}
                            placeholder="Hotel Brand Title"
                            className="w-full px-2.5 py-1.5 rounded-lg bg-[var(--cms-input)] border border-[var(--cms-control-border)] font-semibold text-xs"
                          />
                          <input
                            type="text"
                            value={brandLogoSubtitle}
                            onChange={(e) => setBrandLogoSubtitle(e.target.value)}
                            placeholder="Location Subtitle"
                            className="w-full px-2.5 py-1.5 rounded-lg bg-[var(--cms-input)] border border-[var(--cms-control-border)] text-xs"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Curated Hotel Logo Crest Presets */}
                    <div className="space-y-1">
                      <span className="text-[11px] text-[var(--cms-text-secondary)] block">Quick-Test Hotel Crest Presets:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {CURATED_BRAND_MEDIA_PRESETS.logos.map((preset) => (
                          <button
                            key={preset.id}
                            type="button"
                            onClick={() => setBrandLogoImageUrl(preset.url)}
                            className={`px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-colors ${
                              brandLogoImageUrl === preset.url
                                ? 'bg-[#0050F5]/15 border-[#0050F5] text-[#0050F5] dark:text-[#C7B9FF]'
                                : 'bg-[var(--cms-bg)] border-[var(--cms-divider)] text-[var(--cms-text-secondary)] hover:text-[var(--cms-text)]'
                            }`}
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </StudioSection>

                  {/* 2. HERO WELCOME BACKGROUND: IMAGE OR LOOPING VIDEO UPLOAD */}
                  <StudioSection title={ct.brandStep2}>
                    <div className="flex items-center justify-between">

                      <div className="inline-flex rounded-lg bg-[var(--cms-bg)] p-0.5 border border-[var(--cms-divider)] text-[11px]">
                        <button
                          type="button"
                          onClick={() => setBrandHeroMediaType('image')}
                          className={`px-2.5 py-1 rounded-md font-semibold inline-flex items-center gap-1 ${
                            brandHeroMediaType === 'image' ? 'bg-[#0050F5] text-white' : 'text-[var(--cms-text-secondary)]'
                          }`}
                        >
                          <ImageIcon className="w-3 h-3" />
                          <span>Photo</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setBrandHeroMediaType('video')}
                          className={`px-2.5 py-1 rounded-md font-semibold inline-flex items-center gap-1 ${
                            brandHeroMediaType === 'video' ? 'bg-[#0050F5] text-white' : 'text-[var(--cms-text-secondary)]'
                          }`}
                        >
                          <Video className="w-3 h-3" />
                          <span>Video Loop</span>
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-28 h-16 rounded-xl overflow-hidden bg-slate-900 border border-[var(--cms-divider)] shrink-0 relative">
                        {brandHeroMediaType === 'video' && brandHeroVideoUrl ? (
                          <video src={brandHeroVideoUrl} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                        ) : (
                          <img src={brandHeroImageUrl} alt="Hero Backdrop" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="flex-1 space-y-1.5 text-xs">
                        <label className="w-full py-1.5 px-3 rounded-xl bg-[var(--cms-bg)] hover:bg-black/5 dark:hover:bg-white/5 border border-[var(--cms-control-border)] font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer">
                          <Upload className="w-3.5 h-3.5 text-[#0050F5]" />
                          <span>Upload {brandHeroMediaType === 'video' ? 'MP4/WebM Video' : '4K Background Photo'}</span>
                          <input
                            type="file"
                            accept={brandHeroMediaType === 'video' ? 'video/*,image/*' : 'image/*,video/*'}
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              handleUploadFileToDataUrl(file, 22, (dataUrl, detectedType) => {
                                setBrandHeroMediaType(detectedType);
                                if (detectedType === 'video') {
                                  setBrandHeroVideoUrl(dataUrl);
                                } else {
                                  setBrandHeroImageUrl(dataUrl);
                                }
                              });
                            }}
                          />
                        </label>
                        <input
                          type="text"
                          value={brandHeroMediaType === 'video' ? brandHeroVideoUrl : brandHeroImageUrl}
                          onChange={(e) =>
                            brandHeroMediaType === 'video'
                              ? setBrandHeroVideoUrl(e.target.value)
                              : setBrandHeroImageUrl(e.target.value)
                          }
                          placeholder={brandHeroMediaType === 'video' ? 'Paste MP4/WebM video URL...' : 'Paste 4K image URL...'}
                          className="w-full px-2.5 py-1 rounded-lg bg-[var(--cms-input)] border border-[var(--cms-control-border)] text-[11px]"
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {CURATED_BRAND_MEDIA_PRESETS.heroBackgrounds.map((bg) => (
                        <button
                          key={bg.id}
                          type="button"
                          onClick={() => {
                            setBrandHeroMediaType(bg.type);
                            if (bg.type === 'video') setBrandHeroVideoUrl(bg.url);
                            else setBrandHeroImageUrl(bg.url);
                          }}
                          className={`px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-colors ${
                            (bg.type === 'video' && brandHeroMediaType === 'video' && brandHeroVideoUrl === bg.url) ||
                            (bg.type === 'image' && brandHeroMediaType === 'image' && brandHeroImageUrl === bg.url)
                              ? 'bg-[#0050F5]/15 border-[#0050F5] text-[#0050F5] dark:text-[#C7B9FF]'
                              : 'bg-[var(--cms-bg)] border-[var(--cms-divider)] text-[var(--cms-text-secondary)]'
                          }`}
                        >
                          {bg.type === 'video' ? '🎬 ' : '🖼️ '}
                          {bg.label}
                        </button>
                      ))}
                    </div>
                  </StudioSection>

                  {/* 3. PROMOTIONAL VIDEO OR IMAGE SHOWCASE UPLOAD (Syncs with 04 Promo Screen) */}
                  <StudioSection title={ct.brandStep3}>
                    <div className="flex items-center justify-between">

                      <div className="inline-flex rounded-lg bg-[var(--cms-bg)] p-0.5 border border-[var(--cms-divider)] text-[11px]">
                        <button
                          type="button"
                          onClick={() => setBrandPromoMediaType('video')}
                          className={`px-2.5 py-1 rounded-md font-semibold ${
                            brandPromoMediaType === 'video' ? 'bg-[#0050F5] text-white' : 'text-[var(--cms-text-secondary)]'
                          }`}
                        >
                          Promo Video
                        </button>
                        <button
                          type="button"
                          onClick={() => setBrandPromoMediaType('image')}
                          className={`px-2.5 py-1 rounded-md font-semibold ${
                            brandPromoMediaType === 'image' ? 'bg-[#0050F5] text-white' : 'text-[var(--cms-text-secondary)]'
                          }`}
                        >
                          Promo Image
                        </button>
                      </div>
                    </div>

                    <input
                      type="text"
                      value={brandPromoTitle}
                      onChange={(e) => setBrandPromoTitle(e.target.value)}
                      placeholder="Promotion Headline (e.g., Royal Javanese Spa • 30-Min Ritual)"
                      className="w-full px-3 py-1.5 rounded-lg bg-[var(--cms-input)] border border-[var(--cms-control-border)] text-xs font-semibold"
                    />

                    <div className="flex items-center gap-3">
                      <div className="w-28 h-16 rounded-xl overflow-hidden bg-slate-900 border border-[var(--cms-divider)] shrink-0">
                        {brandPromoMediaType === 'video' ? (
                          <video src={brandPromoMediaUrl} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                        ) : (
                          <img src={brandPromoMediaUrl} alt="Promo Preview" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="flex-1 space-y-1.5 text-xs">
                        <label className="w-full py-1.5 px-3 rounded-xl bg-[var(--cms-bg)] hover:bg-black/5 dark:hover:bg-white/5 border border-[var(--cms-control-border)] font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer">
                          <Upload className="w-3.5 h-3.5 text-[#0050F5]" />
                          <span>Upload Promo Video / Image</span>
                          <input
                            type="file"
                            accept="video/*,image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              handleUploadFileToDataUrl(file, 22, (dataUrl, detectedType, fileName) => {
                                setBrandPromoMediaType(detectedType);
                                setBrandPromoMediaUrl(dataUrl);
                                if (!brandPromoTitle) setBrandPromoTitle(fileName.replace(/\.[^.]+$/, ''));
                              });
                            }}
                          />
                        </label>
                        <input
                          type="text"
                          value={brandPromoMediaUrl}
                          onChange={(e) => setBrandPromoMediaUrl(e.target.value)}
                          placeholder="Or paste Promo Video (.mp4) / Image URL..."
                          className="w-full px-2.5 py-1 rounded-lg bg-[var(--cms-input)] border border-[var(--cms-control-border)] text-[11px]"
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {CURATED_BRAND_MEDIA_PRESETS.promoMedia.map((pm) => (
                        <button
                          key={pm.id}
                          type="button"
                          onClick={() => {
                            setBrandPromoMediaType(pm.type);
                            setBrandPromoMediaUrl(pm.url);
                            setBrandPromoTitle(pm.title);
                          }}
                          className={`px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-colors ${
                            brandPromoMediaUrl === pm.url
                              ? 'bg-[#0050F5]/15 border-[#0050F5] text-[#0050F5] dark:text-[#C7B9FF]'
                              : 'bg-[var(--cms-bg)] border-[var(--cms-divider)] text-[var(--cms-text-secondary)]'
                          }`}
                        >
                          {pm.type === 'video' ? '▶ ' : '🖼️ '}
                          {pm.label}
                        </button>
                      ))}
                    </div>
                  </StudioSection>

                  {/* 4. Theme Colors & 4-Locale SmartTV Guest Setup */}
                  <StudioSection title={ct.brandStep4}>

                    <p className="text-[11px] text-[var(--cms-text-secondary)] leading-relaxed">
                      {ct.tvLocaleControlSub}
                    </p>
                    <div className="flex items-center gap-3">
                      {[
                        { primary: '#1E3A2F', accent: '#DCC6A1', name: 'Javanese Sanctuary' },
                        { primary: '#173753', accent: '#C8A97E', name: 'Oceanfront Gold' },
                        { primary: '#2B2118', accent: '#E5C185', name: 'Royal Heritage' },
                        { primary: '#0F172A', accent: '#94A3B8', name: 'Urban Slate' },
                      ].map((swatch, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setBrandPrimaryColor(swatch.primary);
                            setBrandAccentColor(swatch.accent);
                          }}
                          title={swatch.name}
                          className={`w-8 h-8 rounded-full border-2 transition-transform ${
                            brandAccentColor === swatch.accent ? 'scale-110 border-[#0050F5]' : 'border-transparent'
                          }`}
                          style={{ background: `linear-gradient(135deg, ${swatch.primary} 50%, ${swatch.accent} 50%)` }}
                        />
                      ))}
                      <input
                        type="color"
                        value={brandAccentColor}
                        onChange={(e) => setBrandAccentColor(e.target.value)}
                        className="w-8 h-8 rounded-lg cursor-pointer border border-[var(--cms-divider)]"
                        title="Custom Accent Color"
                      />
                    </div>

                    <div className="grid grid-cols-4 gap-1.5 pt-1">
                      {(
                        [
                          { code: 'en', label: 'EN · English' },
                          { code: 'id', label: 'ID · Indonesia' },
                          { code: 'zh-CN', label: '中文 · Chinese' },
                          { code: 'ja-JP', label: '日本語 · Japanese' },
                        ] as Array<{ code: GuestLocale; label: string }>
                      ).map((loc) => (
                        <button
                          key={loc.code}
                          type="button"
                          onClick={() => setBrandLocaleTab(loc.code)}
                          className={`py-2 px-1.5 rounded-xl text-[11px] font-bold border transition-colors cursor-pointer ${
                            brandLocaleTab === loc.code
                              ? 'bg-[#0050F5] text-white border-[#0050F5] shadow-xs'
                              : 'bg-[var(--cms-bg)] border-[var(--cms-divider)] text-[var(--cms-text-secondary)] hover:text-[var(--cms-text)]'
                          }`}
                        >
                          {loc.label}
                        </button>
                      ))}
                    </div>

                    <div>
                      <label className="block text-[11px] text-[var(--cms-text-secondary)] mb-1">
                        Welcome Headline ({brandLocaleTab})
                      </label>
                      <input
                        type="text"
                        value={brandHeadline[brandLocaleTab] || ''}
                        onChange={(e) =>
                          setBrandHeadline({ ...brandHeadline, [brandLocaleTab]: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-[var(--cms-input)] border border-[var(--cms-control-border)] text-xs"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          const res = await apiCall('/api/stays/locale', {
                            method: 'POST',
                            body: JSON.stringify({
                              propertyId: activeProperty.id,
                              locale: brandLocaleTab,
                              updatePropertyDefault: true,
                              applyToAllRooms: true,
                            }),
                          });
                          await fetchBootstrap();
                          showNotice('success', res.message || `Applied TV language (${brandLocaleTab}) across ${activeProperty.name}.`);
                        } catch (err: unknown) {
                          showNotice('error', err instanceof Error ? err.message : 'Failed to push TV language');
                        }
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>{ct.applyTvLocaleBtn}: {brandLocaleTab.toUpperCase()}</span>
                    </button>
                  </StudioSection>
                <TvStudioSettings
                    canManageApps={['R-01','R-02','R-10','R-11'].includes(currentRole.id)}
                    entertainmentLicensed={entertainmentLicensed}
                    value={brandTvExperience}
                    onChange={setBrandTvExperience}
                    locale={brandLocaleTab}
                    propertyId={activeProperty.id}
                    items={data.marketplaceItems || []}
                    onSaveItem={async (item) => {
                      const result = await apiCall('/api/marketplace/services/upsert-item', {method:'POST', body:JSON.stringify({propertyId:activeProperty.id, item})});
                      setBootstrap(prev => prev ? {...prev, data:{...prev.data, marketplaceItems:[result.item, ...(prev.data.marketplaceItems || []).filter(existing => existing.id !== result.item.id)]}} : prev);
                    }}
                  />
                </div>

                {/* Right Column: Live Interactive TV Home Preview + GojjaCleanTV ADB Launcher Takeover Panel */}
                <div className="studio-preview space-y-4">


                  <div className="p-6 rounded-2xl bg-[var(--cms-surface)] border border-[var(--cms-divider)] space-y-5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <h2 className="text-base font-bold">{ct.tvPreviewHeader}</h2>
                        <p className="text-xs text-[var(--cms-text-secondary)]">
                          {ct.tvPreviewSub}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setTvModalEndpointId(propEndpoints[0]?.id || 'E-01')}
                        className="px-3.5 py-1.5 rounded-xl bg-[var(--cms-bg)] border border-[var(--cms-control-border)] text-xs font-semibold hover:bg-[#0050F5] hover:text-white transition-colors inline-flex items-center gap-1.5"
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>{ct.fullScreenTvBtn}</span>
                      </button>
                    </div>

                    <TvGuestAppView
                      {...tvExperienceBindings}
                      embedded={true}
                      forcedLocale={brandLocaleTab}
                      onSelectLocale={(loc) => setBrandLocaleTab(loc)}
                      property={{
                        ...activeProperty,
                        defaultLocale: brandLocaleTab,
                        logoText: brandLogoText,
                        logoSubtitle: brandLogoSubtitle,
                        logoImageUrl: brandLogoImageUrl || undefined,
                        heroMediaType: brandHeroMediaType,
                        heroImageUrl: brandHeroImageUrl || activeProperty.heroImageUrl,
                        heroVideoUrl: brandHeroVideoUrl || undefined,
                        promoMediaType: brandPromoMediaType,
                        promoMediaUrl: brandPromoMediaUrl || undefined,
                        promoTitle: brandPromoTitle || undefined,
                        tvExperience: brandTvExperience,
                        accentColor: brandAccentColor,
                        primaryColor: brandPrimaryColor,
                        welcomeHeadline: brandHeadline,
                      }}
                      room={modalRoom}
                      endpoint={modalEndpoint}
                      stay={modalStay ? { ...modalStay, locale: brandLocaleTab } : undefined}
                      corporateGroup={modalGroup}
                      channels={data.channels}
                      campaigns={data.campaigns}
                      onOpenChannelCheck={async (epId, chId) => {
                        try {
                          return await apiCall('/api/tv/open-channel', {
                            method: 'POST',
                            body: JSON.stringify({ endpointId: epId, channelId: chId }),
                          });
                        } catch (err: unknown) {
                          return { allowed: false, code:err instanceof ApiRequestError?err.code:undefined, message: err instanceof Error ? err.message : 'Access restricted' };
                        }
                      }}
                    />

                    {/* Bottom Sticky Action Row: Save Draft (branding.edit) vs Publish Changes (branding.publish) */}
                    <div className="pt-3 border-t border-[var(--cms-divider)] flex flex-wrap items-center justify-between gap-3">
                      <div className="text-xs text-[var(--cms-text-secondary)]">
                        Active Role: <strong>{currentRole.name}</strong> · Publish Authority:{' '}
                        <strong>{currentRole.permissions.includes('branding.publish') ? 'Granted' : 'Denied (Editor Only)'}</strong>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={async () => {
                            try {
                              const res = await apiCall('/api/branding/draft', {
                                method: 'POST',
                                body: JSON.stringify({
                                  propertyId: activeProperty.id,
                                  logoText: brandLogoText,
                                  logoSubtitle: brandLogoSubtitle,
                                  logoImageUrl: brandLogoImageUrl,
                                  heroMediaType: brandHeroMediaType,
                                  heroImageUrl: brandHeroImageUrl,
                                  heroVideoUrl: brandHeroVideoUrl,
                                  promoMediaType: brandPromoMediaType,
                                  promoMediaUrl: brandPromoMediaUrl,
                                  promoTitle: brandPromoTitle,
                                  tvExperience: brandTvExperience,
                                  accentColor: brandAccentColor,
                                  primaryColor: brandPrimaryColor,
                                  welcomeHeadline: brandHeadline,
                                }),
                              });
                              await fetchBootstrap();
                              showNotice('info', res.message);
                            } catch (err: unknown) {
                              showNotice('error', err instanceof Error ? err.message : 'Save draft denied');
                            }
                          }}
                          className="px-5 py-2.5 rounded-xl bg-[var(--cms-bg)] hover:opacity-90 border border-[var(--cms-control-border)] text-xs font-semibold"
                        >
                          {ct.saveDraftBtn}
                        </button>

                        <button
                          type="button"
                          onClick={async () => {
                            try {
                              await apiCall('/api/branding/draft', {
                                method: 'POST',
                                body: JSON.stringify({
                                  propertyId: activeProperty.id,
                                  logoText: brandLogoText,
                                  logoSubtitle: brandLogoSubtitle,
                                  logoImageUrl: brandLogoImageUrl,
                                  heroMediaType: brandHeroMediaType,
                                  heroImageUrl: brandHeroImageUrl,
                                  heroVideoUrl: brandHeroVideoUrl,
                                  promoMediaType: brandPromoMediaType,
                                  promoMediaUrl: brandPromoMediaUrl,
                                  promoTitle: brandPromoTitle,
                                  tvExperience: brandTvExperience,
                                  accentColor: brandAccentColor,
                                  primaryColor: brandPrimaryColor,
                                  welcomeHeadline: brandHeadline,
                                }),
                              });
                              const pubRes = await apiCall('/api/branding/publish', {
                                method: 'POST',
                                body: JSON.stringify({
                                  propertyId: activeProperty.id,
                                  title: `${brandLogoText} Media, Video & GojjaLauncher Manifest`,
                                }),
                              });
                              await fetchBootstrap();
                              showNotice('success', pubRes.message);
                            } catch (err: unknown) {
                              showNotice('error', err instanceof Error ? err.message : 'Publish denied by RBAC');
                            }
                          }}
                          className="px-6 py-2.5 rounded-xl bg-[#0050F5] hover:bg-[#0040C8] text-white text-xs font-semibold inline-flex items-center gap-2"
                        >
                          <span>{ct.publishToTvsBtn}</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* =================================================================== */}
                  {/* GOJJACLEANTV (GOJJALAUNCHER) NON-ROOT ADB SMARTTV TAKEOVER PANEL    */}
                  {/* =================================================================== */}
                  <StudioSection title="Lanjutan · launcher & perangkat" description="Pengaturan teknis untuk administrator perangkat.">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--cms-divider)] pb-3">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <Terminal className="w-4 h-4 text-[#0050F5]" />
                          <h3 className="text-base font-bold">
                            GojjaCleanTV (`GojjaLauncher`) — Non-Root ADB SmartTV Replacement
                          </h3>
                        </div>
                        <p className="text-[var(--cms-text-secondary)]">
                          Replaces existing Android TV / Google TV stock ad-heavy launchers (`pm disable-user --user 0`) and locks `GojjaLauncher` as the default HOME screen (`cmd package set-home-activity`) with 100% reversible restore.
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full font-mono-tabular font-bold text-[11px] shrink-0 ${
                          activeProperty.launcherConfig?.mode === 'STOCK_TV_LAUNCHER'
                            ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                            : 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                        }`}
                      >
                        {activeProperty.launcherConfig?.mode === 'STOCK_TV_LAUNCHER'
                          ? 'Stock OEM Launcher Active'
                          : 'GojjaLauncher v4.2 Active'}
                      </span>
                    </div>

                    {/* Profile Presets */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {[
                        {
                          id: 'CLEAN_WITH_OTT' as const,
                          title: 'Clean Launcher + Keep OTT',
                          desc: 'Disables Google TV stock launcher & ads; keeps YouTube/Netflix available.',
                        },
                        {
                          id: 'STRICT_KIOSK' as const,
                          title: 'Strict Hospitality Kiosk',
                          desc: 'Disables stock launcher, recommendations, and preloaded consumer OTT apps.',
                        },
                        {
                          id: 'CUSTOM' as const,
                          title: 'Custom ADB Package List',
                          desc: 'Manually toggle which Android TV packages to disable via ADB.',
                        },
                      ].map((prof) => (
                        <button
                          key={prof.id}
                          type="button"
                          onClick={() => {
                            setCleanTvProfile(prof.id);
                            if (prof.id === 'STRICT_KIOSK') {
                              setCleanTvDisabledPackages(
                                GOJJA_CLEANTV_PACKAGES.filter((p) => p.defaultInStrict).map((p) => p.pkg)
                              );
                            } else if (prof.id === 'CLEAN_WITH_OTT') {
                              setCleanTvDisabledPackages(
                                GOJJA_CLEANTV_PACKAGES.filter((p) => p.defaultInOttKeep).map((p) => p.pkg)
                              );
                            }
                          }}
                          className={`p-3 rounded-xl border text-left transition-all ${
                            cleanTvProfile === prof.id
                              ? 'bg-[#0050F5]/10 border-[#0050F5]'
                              : 'bg-[var(--cms-bg)] border-[var(--cms-divider)]'
                          }`}
                        >
                          <div className="font-bold">{prof.title}</div>
                          <div className="text-[11px] text-[var(--cms-text-secondary)] mt-0.5">{prof.desc}</div>
                        </button>
                      ))}
                    </div>

                    {/* Selectable Package Checklist */}
                    <div className="space-y-1.5 max-h-48 overflow-y-auto luxury-scrollbar pr-1">
                      {GOJJA_CLEANTV_PACKAGES.map((item) => {
                        const checked = cleanTvDisabledPackages.includes(item.pkg);
                        return (
                          <label
                            key={item.pkg}
                            className="p-2.5 rounded-xl bg-[var(--cms-bg)] border border-[var(--cms-divider)] flex items-start gap-2.5 cursor-pointer hover:border-[#0050F5]/50"
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={(e) => {
                                setCleanTvProfile('CUSTOM');
                                if (e.target.checked) {
                                  setCleanTvDisabledPackages([...cleanTvDisabledPackages, item.pkg]);
                                } else {
                                  setCleanTvDisabledPackages(cleanTvDisabledPackages.filter((p) => p !== item.pkg));
                                }
                              }}
                              className="mt-0.5 rounded"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-semibold">{item.label}</span>
                                <code className="text-[10px] font-mono-tabular text-[#0050F5] dark:text-[#C7B9FF] shrink-0">
                                  {item.pkg}
                                </code>
                              </div>
                              <div className="text-[11px] text-[var(--cms-text-secondary)]">{item.description}</div>
                            </div>
                          </label>
                        );
                      })}
                    </div>

                    {/* Action Buttons: Apply Takeover, Restore Stock Launcher, Download Script */}
                    <div className="flex flex-wrap items-center gap-2.5 pt-2">
                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            const res = await apiCall('/api/branding/launcher-takeover', {
                              method: 'POST',
                              body: JSON.stringify({
                                propertyId: activeProperty.id,
                                action: 'APPLY_GOJJA_LAUNCHER',
                                profile: cleanTvProfile,
                                disabledPackages: cleanTvDisabledPackages,
                              }),
                            });
                            if (res.transcript) setCleanTvTranscript(res.transcript);
                            await fetchBootstrap();
                            showNotice('success', res.message);
                          } catch (err: unknown) {
                            showNotice('error', err instanceof Error ? err.message : 'ADB takeover denied');
                          }
                        }}
                        className="px-4 py-2.5 rounded-xl bg-[#0050F5] hover:bg-[#0040C8] text-white font-semibold inline-flex items-center gap-2"
                      >
                        <Terminal className="w-3.5 h-3.5" />
                        <span>Apply GojjaLauncher Takeover ({propEndpoints.filter((e) => e.connection === 'Online').length} Online TVs)</span>
                      </button>

                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            const res = await apiCall('/api/branding/launcher-takeover', {
                              method: 'POST',
                              body: JSON.stringify({
                                propertyId: activeProperty.id,
                                action: 'RESTORE_STOCK_LAUNCHER',
                                profile: cleanTvProfile,
                                disabledPackages: cleanTvDisabledPackages,
                              }),
                            });
                            if (res.transcript) setCleanTvTranscript(res.transcript);
                            await fetchBootstrap();
                            showNotice('info', res.message);
                          } catch (err: unknown) {
                            showNotice('error', err instanceof Error ? err.message : 'Restore failed');
                          }
                        }}
                        className="px-3.5 py-2.5 rounded-xl bg-[var(--cms-bg)] hover:opacity-90 border border-[var(--cms-control-border)] font-semibold inline-flex items-center gap-1.5"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Restore Stock TV Launcher (`pm enable`)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDownloadGojjaCleanTvScript(activeProperty, propEndpoints, cleanTvDisabledPackages)
                        }
                        className="px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold inline-flex items-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download `gojja-cleantv.sh` Script</span>
                      </button>
                    </div>

                    {/* Live ADB Transcript Console */}
                    {cleanTvTranscript.length > 0 && (
                      <div className="p-3.5 rounded-xl bg-[#0B0F17] text-emerald-300 font-mono-tabular text-[11px] space-y-1 max-h-40 overflow-y-auto luxury-scrollbar border border-white/10">
                        <div className="text-slate-400 font-bold mb-1">
                          # GojjaCleanTV Non-Root ADB Execution Log ({activeProperty.name})
                        </div>
                        {cleanTvTranscript.map((line, idx) => (
                          <div key={idx} className="truncate">
                            {line}
                          </div>
                        ))}
                      </div>
                    )}
                  </StudioSection>
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* TAB 5: DEVICE DISCOVERY & DEPLOYMENT (IN-01..08 & LB-01..04)          */}
          {/* ===================================================================== */}
          {activeTab === 'discovery' && (
            <DeviceDiscoveryView
              environmentId={environmentId}
              activeProperty={activeProperty}
              properties={data.properties}
              rooms={data.rooms}
              connectors={data.connectors}
              candidates={data.candidates}
              discoveryRuns={data.discoveryRuns}
              scenarios={bootstrap.scenariosCatalog}
              hostRuntime={hostRuntime}
              statusBanner={statusBanner}
              onRegisterConnector={async (payload) => {
                try {
                  await apiCall('/api/live-lab/connector/register', {
                    method: 'POST',
                    body: JSON.stringify(payload),
                  });
                  await fetchBootstrap();
                  showNotice('success', `Connector enrolled and subnet ${payload.subnetCidr} authorized.`);
                } catch (err: unknown) {
                  showNotice('error', err instanceof Error ? err.message : 'Failed to enroll connector');
                }
              }}
              onRunScan={async (payload) => {
                try {
                  const res = await apiCall('/api/live-lab/scan', {
                    method: 'POST',
                    body: JSON.stringify(payload),
                  });
                  await fetchBootstrap();
                  showNotice('info', res?.run?.summaryText || res?.message || 'Pemeriksaan jaringan selesai.');
                } catch (err: unknown) {
                  showNotice('error', err instanceof Error ? err.message : 'Network scan failed or blocked');
                }
              }}
              onAddManualTarget={async (payload) => {
                try {
                  const res = await apiCall('/api/live-lab/manual-target', {
                    method: 'POST',
                    body: JSON.stringify(payload),
                  });
                  await fetchBootstrap();
                  showNotice('info', res?.candidate?.notes || res?.message || 'Manual target added.');
                } catch (err: unknown) {
                  showNotice('error', err instanceof Error ? err.message : 'Failed to add manual target');
                }
              }}
              onAdbPair={async (payload) => {
                try {
                  const res = await apiCall('/api/live-lab/adb-pair', {
                    method: 'POST',
                    body: JSON.stringify(payload),
                  });
                  await fetchBootstrap();
                  showNotice('success', res?.message || 'ADB pairing succeeded.');
                } catch (err: unknown) {
                  showNotice('error', err instanceof Error ? err.message : 'ADB pair failed');
                }
              }}
              onAdbConnect={async (payload) => {
                try {
                  const res = await apiCall('/api/live-lab/adb-connect', {
                    method: 'POST',
                    body: JSON.stringify(payload),
                  });
                  await fetchBootstrap();
                  showNotice('success', res?.message || 'ADB connect succeeded.');
                } catch (err: unknown) {
                  showNotice('error', err instanceof Error ? err.message : 'ADB connect / verification failed');
                }
              }}
              onAdbProbe={async (candidateId) => {
                try {
                  const res = await apiCall('/api/live-lab/adb-probe', {
                    method: 'POST',
                    body: JSON.stringify({ candidateId }),
                  });
                  await fetchBootstrap();
                  showNotice('success', res?.message || 'Perangkat berhasil di-probe & dikenali.');
                  return res;
                } catch (err: unknown) {
                  showNotice('error', err instanceof Error ? err.message : 'Probe perangkat gagal');
                  throw err;
                }
              }}
              onAdbScreenshot={async (candidateId) => {
                try {
                  const res = await apiCall('/api/live-lab/adb-screenshot', {
                    method: 'POST',
                    body: JSON.stringify({ candidateId }),
                  });
                  await fetchBootstrap();
                  showNotice('success', res?.message || 'Tangkapan layar realtime berhasil diambil.');
                  return res;
                } catch (err: unknown) {
                  showNotice('error', err instanceof Error ? err.message : 'Gagal mengambil screenshot');
                  throw err;
                }
              }}
              onAssignDevice={async (payload) => {
                try {
                  const res = await apiCall('/api/live-lab/assign-device', {
                    method: 'POST',
                    body: JSON.stringify(payload),
                  });
                  await fetchBootstrap();
                  showNotice('success', res?.message || 'Perangkat berhasil ditugaskan.');
                } catch (err: unknown) {
                  showNotice('error', err instanceof Error ? err.message : 'Device assignment denied');
                }
              }}
              onRunScenario={async (scenarioId) => {
                try {
                  const res = await apiCall('/api/demo/scenario', {
                    method: 'POST',
                    body: JSON.stringify({ scenarioId }),
                  });
                  await fetchBootstrap();
                  showNotice('info', res?.message || 'Scenario executed.');
                } catch (err: unknown) {
                  showNotice('error', err instanceof Error ? err.message : 'Scenario failed');
                }
              }}
            />
          )}

          {/* ===================================================================== */}
          {/* TAB 6: TV SERVICES, PROVIDER CONTRACTS & LINEUP (PR-15..18)           */}
          {/* ===================================================================== */}
          {activeTab === 'tv-services' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold">TV Services, Provider Contracts & Channel Entitlements</h1>
                <p className="text-xs text-[var(--cms-text-secondary)]">
                  Software subscriptions (M02) do not grant broadcast rights (M07). Channel playback enforces contract verification status, room vs. endpoint allocation basis, and connection readiness.
                </p>
              </div>

              <TvEntertainmentSettings canManage={['R-01','R-02','R-10','R-11'].includes(currentRole.id)} value={brandTvExperience} onChange={setBrandTvExperience} licensed={entertainmentLicensed}/>
              <div className="flex flex-wrap items-center gap-3">
                <button className="rounded-lg bg-violet-700 px-4 py-2 text-sm text-white" onClick={async()=>{
                  try{await apiCall('/api/branding/draft',{method:'POST',body:JSON.stringify({propertyId:activeProperty.id,tvExperience:brandTvExperience})});await fetchBootstrap();showNotice('success','Konfigurasi aplikasi Hiburan tersimpan pada draft.');}catch(error){showNotice('error',error instanceof Error?error.message:'Tidak dapat menyimpan konfigurasi.');}
                }}>Simpan pengaturan Hiburan</button>
                {environmentId === 'DEMO' && ['R-01','R-02'].includes(currentRole.id) ? <button className="rounded-lg border border-[var(--cms-control-border)] px-4 py-2 text-sm" onClick={async()=>{
                  try{await apiCall('/api/properties/entertainment/license',{method:'POST',body:JSON.stringify({propertyId:activeProperty.id,status:entertainmentLicensed?'Inactive':'Active',reference:'DEMO-ADDON-PREVIEW'})});await fetchBootstrap();showNotice('info','Lisensi add-on demo diperbarui. Tidak ada penagihan nyata.');}catch(error){showNotice('error',error instanceof Error?error.message:'Lisensi tidak dapat diubah.');}
                }}>{entertainmentLicensed?'Nonaktifkan':'Aktifkan'} lisensi demo (HQ)</button>:null}
              </div>

              {/* Provider Contracts List */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {data.contracts.map((ct) => (
                  <div
                    key={ct.id}
                    className="p-5 rounded-2xl bg-[var(--cms-surface)] border border-[var(--cms-divider)] flex flex-col justify-between gap-4 text-xs"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono-tabular font-bold text-[#0050F5] dark:text-[#C7B9FF]">
                          {ct.id} · {ct.propertyId}
                        </span>
                        <span
                          className={`font-semibold ${
                            ct.status === 'Active'
                              ? 'text-emerald-700 dark:text-emerald-300'
                              : 'text-amber-700 dark:text-amber-300'
                          }`}
                        >
                          Contract: {ct.status}
                        </span>
                      </div>
                      <div className="text-sm font-bold">{ct.providerName}</div>
                      <div className="text-[var(--cms-text-secondary)]">{ct.holderName}</div>
                      <div className="pt-2 space-y-1 font-mono-tabular text-[11px]">
                        <div>Basis: {ct.quantity} × {ct.basis}(s)</div>
                        <div>Packages: {ct.packages.join(', ')}</div>
                        <div>Multi-TV Suite Included: {ct.multiTvIncluded ? 'Yes (Room 301/502)' : 'No'}</div>
                        <div>Connection State: <strong>{ct.connectionStatus}</strong></div>
                      </div>
                    </div>

                    {ct.status !== 'Active' || ct.connectionStatus !== 'Ready' ? (
                      <button
                        onClick={async () => {
                          try {
                            await apiCall('/api/contracts/verify', {
                              method: 'POST',
                              body: JSON.stringify({ contractId: ct.id }),
                            });
                            await fetchBootstrap();
                            showNotice('success', `Contract ${ct.id} verified and connection refreshed (requires R-02 Platform Admin).`);
                          } catch (err: unknown) {
                            showNotice('error', err instanceof Error ? err.message : 'Contract verification denied');
                          }
                        }}
                        className="w-full py-2 px-3 rounded-xl bg-[#0050F5] text-white font-semibold"
                      >
                        Verify Rights / Refresh Token (R-02)
                      </button>
                    ) : (
                      <div className="py-2 px-3 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-center font-semibold">
                        Rights Active & Stream Ready
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Channel Lineup Table */}
              <div className="p-5 rounded-2xl bg-[var(--cms-surface)] border border-[var(--cms-divider)] space-y-3">
                <h2 className="text-base font-bold">Channel Lineup & Package Entitlement Map</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-[var(--cms-divider)] text-[var(--cms-text-secondary)]">
                        <th className="py-2 pr-3">No.</th>
                        <th className="py-2 px-3">Channel Name</th>
                        <th className="py-2 px-3">Category</th>
                        <th className="py-2 px-3">Required Package</th>
                        <th className="py-2 px-3">Current Program (ID / EN)</th>
                        <th className="py-2 pl-3 text-right">Test Entitlement on TV</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--cms-divider)]">
                      {data.channels.map((ch) => (
                        <tr key={ch.id}>
                          <td className="py-3 pr-3 font-mono-tabular font-bold">{ch.number}</td>
                          <td className="py-3 px-3 font-semibold">{ch.name}</td>
                          <td className="py-3 px-3">{ch.category}</td>
                          <td className="py-3 px-3 font-mono-tabular">{ch.packageId}</td>
                          <td className="py-3 px-3">{ch.currentProgram.en}</td>
                          <td className="py-3 pl-3 text-right">
                            <button
                              onClick={async () => {
                                try {
                                  const targetEp = propEndpoints[0]?.id || 'E-01';
                                  await apiCall('/api/tv/open-channel', {
                                    method: 'POST',
                                    body: JSON.stringify({ endpointId: targetEp, channelId: ch.id }),
                                  });
                                  showNotice('success', `Playback allowed for ${ch.name} on ${targetEp}.`);
                                } catch (err: unknown) {
                                  showNotice('error', err instanceof Error ? err.message : 'Playback denied');
                                }
                              }}
                              className="px-3 py-1 rounded-lg bg-[var(--cms-bg)] border border-[var(--cms-control-border)] font-semibold hover:bg-[#0050F5] hover:text-white transition-colors"
                            >
                              Test Play on {propEndpoints[0]?.id || 'E-01'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* TAB 7: CAMPAIGNS & PROMOTIONS (PR-19..22)                             */}
          {/* ===================================================================== */}
          {/* TAB 7: CAMPAIGNS & PROMOTIONS (PR-19..22 + Real Video/Image Upload)   */}
          {/* ===================================================================== */}
          {activeTab === 'campaigns' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h1 className="text-2xl font-bold">Hotel Promotions & Video Signage Placements (M13)</h1>
                  <p className="text-xs text-[var(--cms-text-secondary)]">
                    Upload promotional videos (`.mp4`/`.webm`) or HD banners for the in-room TV Home Hero and 04 Promo showcase.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setTvModalEndpointId(propEndpoints[0]?.id || 'E-01')}
                  className="px-4 py-2 rounded-xl bg-[#0050F5] text-white text-xs font-semibold inline-flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Preview Promo on TV</span>
                </button>
              </div>

              {/* Create & Upload Promotional Video / Image Campaign Card */}
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    const res = await apiCall('/api/campaigns/create', {
                      method: 'POST',
                      body: JSON.stringify({
                        propertyId: activeProperty.id,
                        name: newCmpName || 'Signature Resort Experience',
                        category: newCmpCategory,
                        placement: newCmpPlacement,
                        mediaType: newCmpMediaType,
                        mediaUrl: newCmpMediaUrl,
                        headlineEn: newCmpName || 'Signature Resort Experience',
                        headlineId: newCmpName || 'Pengalaman Istimewa Resort',
                        ctaLabel: newCmpCta || 'Explore Offer',
                      }),
                    });
                    setNewCmpName('');
                    await fetchBootstrap();
                    showNotice('success', res.message);
                  } catch (err: unknown) {
                    showNotice('error', err instanceof Error ? err.message : 'Failed to publish campaign');
                  }
                }}
                className="p-5 rounded-2xl bg-[var(--cms-surface)] border border-[var(--cms-divider)] space-y-4 text-xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-base font-bold">Upload New Promotional Video or Banner Campaign</h2>
                  <div className="flex flex-wrap gap-1.5">
                    {CURATED_BRAND_MEDIA_PRESETS.promoMedia.map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => {
                          setNewCmpMediaType(preset.type);
                          setNewCmpMediaUrl(preset.url);
                          setNewCmpName(preset.title);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-[var(--cms-bg)] border border-[var(--cms-divider)] text-[11px] font-medium hover:border-[#0050F5]"
                      >
                        {preset.type === 'video' ? '🎬 ' : '🖼️ '}
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  <div className="md:col-span-4 space-y-2">
                    <input
                      type="text"
                      value={newCmpName}
                      onChange={(e) => setNewCmpName(e.target.value)}
                      placeholder="Campaign Title (e.g., Sunset Infinity Dining)"
                      className="w-full px-3 py-2 rounded-xl bg-[var(--cms-input)] border border-[var(--cms-control-border)] font-semibold"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <select
                        value={newCmpCategory}
                        onChange={(e) => setNewCmpCategory(e.target.value as Campaign['category'])}
                        className="w-full px-2.5 py-2 rounded-xl bg-[var(--cms-input)] border border-[var(--cms-control-border)]"
                      >
                        <option value="Spa & Wellness">Spa & Wellness</option>
                        <option value="Fine Dining">Fine Dining</option>
                        <option value="Pool & Leisure">Pool & Leisure</option>
                        <option value="Corporate Welcome">Corporate Welcome</option>
                      </select>
                      <select
                        value={newCmpPlacement}
                        onChange={(e) => setNewCmpPlacement(e.target.value as Campaign['placement'])}
                        className="w-full px-2.5 py-2 rounded-xl bg-[var(--cms-input)] border border-[var(--cms-control-border)]"
                      >
                        <option value="home_hero">home_hero</option>
                        <option value="welcome_screen">welcome_screen</option>
                        <option value="service_detail">service_detail</option>
                      </select>
                    </div>
                  </div>

                  <div className="md:col-span-5 space-y-2">
                    <div className="flex items-center gap-2">
                      <label className="py-2 px-3 rounded-xl bg-[#0050F5] hover:bg-[#0040C8] text-white font-semibold inline-flex items-center gap-1.5 cursor-pointer shrink-0">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Video / Image</span>
                        <input
                          type="file"
                          accept="video/*,image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            handleUploadFileToDataUrl(file, 22, (dataUrl, detectedType, fileName) => {
                              setNewCmpMediaType(detectedType);
                              setNewCmpMediaUrl(dataUrl);
                              if (!newCmpName) setNewCmpName(fileName.replace(/\.[^.]+$/, ''));
                            });
                          }}
                        />
                      </label>
                      <input
                        type="text"
                        value={newCmpMediaUrl}
                        onChange={(e) => setNewCmpMediaUrl(e.target.value)}
                        placeholder="Or paste MP4 video / image URL..."
                        className="w-full px-3 py-2 rounded-xl bg-[var(--cms-input)] border border-[var(--cms-control-border)]"
                      />
                    </div>
                    <input
                      type="text"
                      value={newCmpCta}
                      onChange={(e) => setNewCmpCta(e.target.value)}
                      placeholder="CTA Button Label (e.g., Book via Concierge)"
                      className="w-full px-3 py-1.5 rounded-xl bg-[var(--cms-input)] border border-[var(--cms-control-border)]"
                    />
                  </div>

                  <div className="md:col-span-3 flex items-center gap-3">
                    <div className="w-24 h-16 rounded-xl overflow-hidden bg-slate-900 border border-[var(--cms-divider)] shrink-0">
                      {newCmpMediaType === 'video' ? (
                        <video src={newCmpMediaUrl} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                      ) : (
                        <img src={newCmpMediaUrl} alt="Preview" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                      )}
                    </div>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold"
                    >
                      Publish Promo
                    </button>
                  </div>
                </div>
              </form>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {data.campaigns.map((cmp) => {
                  const isVideo =
                    cmp.mediaType === 'video' ||
                    cmp.mediaUrl?.endsWith('.mp4') ||
                    cmp.mediaUrl?.startsWith('data:video/');
                  return (
                    <div
                      key={cmp.id}
                      className="p-5 rounded-2xl bg-[var(--cms-surface)] border border-[var(--cms-divider)] flex flex-col justify-between gap-4 text-xs"
                    >
                      <div className="flex gap-4">
                        <div className="w-32 h-20 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-[var(--cms-divider)]">
                          {isVideo && cmp.mediaUrl ? (
                            <video src={cmp.mediaUrl} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                          ) : (
                            <img
                              src={cmp.mediaUrl || cmp.imageUrl}
                              alt={cmp.name}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono-tabular font-bold text-[#0050F5] dark:text-[#C7B9FF]">{cmp.id}</span>
                            <span>·</span>
                            <span className="font-semibold">{cmp.status}</span>
                            <span>·</span>
                            <span className="px-2 py-0.5 rounded bg-[var(--cms-bg)] font-mono-tabular text-[10px] uppercase">
                              {isVideo ? '🎬 VIDEO' : '🖼️ IMAGE'}
                            </span>
                          </div>
                          <div className="text-sm font-bold">{cmp.name}</div>
                          <div className="text-[var(--cms-text-secondary)]">
                            Placement: <code className="font-mono-tabular">{cmp.placement}</code> · Priority: {cmp.priority} · Cap: {cmp.frequencyCapPerStay}/stay
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-4 gap-2 pt-3 border-t border-[var(--cms-divider)] font-mono-tabular">
                        <div>
                          <span className="text-[var(--cms-text-secondary)] block">Starts</span>
                          <strong>{cmp.startsCount}</strong>
                        </div>
                        <div>
                          <span className="text-[var(--cms-text-secondary)] block">Completed</span>
                          <strong>{cmp.completedCount}</strong>
                        </div>
                        <div>
                          <span className="text-[var(--cms-text-secondary)] block">Skipped</span>
                          <strong>{cmp.skippedCount}</strong>
                        </div>
                        <div>
                          <span className="text-[var(--cms-text-secondary)] block">Played Secs</span>
                          <strong>{cmp.totalPlaySeconds}s</strong>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* TAB: MARKETPLACE & EXTERNAL AD NETWORK (POIN 13 / M13 / FR17)         */}
          {/* ===================================================================== */}
          {activeTab === 'marketplace' && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="text-2xl font-bold">Marketplace & External Ad Network Foundation (M13 / FR17)</h1>
                  <p className="text-xs text-[var(--cms-text-secondary)]">
                    External paid ad offers with explicit hotel opt-in and creative version control; in-room concierge marketplace with privacy-redacted guest order tracking.
                  </p>
                </div>
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setTvModalEndpointId(propEndpoints[0]?.id || 'E-01')}
                    className="px-4 py-2 rounded-xl bg-[#0050F5] text-white text-xs font-semibold inline-flex items-center gap-1.5 shadow-sm hover:bg-[#0040D0] transition-colors"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Pratinjau Layanan di TV</span>
                  </button>
                </div>
              </div>

              {/* Subtabs Switcher */}
              <div className="flex items-center gap-2 border-b border-[var(--cms-divider)] pb-3 overflow-x-auto">
                <button
                  type="button"
                  onClick={() => setMarketplaceSubTab('OFFERS')}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-2 transition-all ${
                    marketplaceSubTab === 'OFFERS'
                      ? 'bg-[var(--cms-text)] text-[var(--cms-bg)] shadow-xs'
                      : 'text-[var(--cms-text-secondary)] hover:text-[var(--cms-text)] hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  <Handshake className="w-4 h-4" />
                  <span>Jaringan Iklan Brand Eksternal</span>
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-blue-500/10 text-blue-600 dark:text-blue-400 font-mono-tabular">
                    {(data.adOffers || []).length}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setMarketplaceSubTab('ORDERS')}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-2 transition-all ${
                    marketplaceSubTab === 'ORDERS'
                      ? 'bg-[var(--cms-text)] text-[var(--cms-bg)] shadow-xs'
                      : 'text-[var(--cms-text-secondary)] hover:text-[var(--cms-text)] hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Katalog Layanan & Meja Concierge</span>
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-500/10 text-amber-600 dark:text-amber-400 font-mono-tabular">
                    {(data.serviceOrders || []).filter((o) => o.status === 'Requested').length} Baru
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setMarketplaceSubTab('FUNNEL')}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-2 transition-all ${
                    marketplaceSubTab === 'FUNNEL'
                      ? 'bg-[var(--cms-text)] text-[var(--cms-bg)] shadow-xs'
                      : 'text-[var(--cms-text-secondary)] hover:text-[var(--cms-text)] hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Corong Komersial & Monetisasi</span>
                </button>
              </div>

              {/* SUBTAB 1: EXTERNAL AD NETWORK & OPT-IN */}
              {marketplaceSubTab === 'OFFERS' && (
                <div className="space-y-6">
                  {/* Privacy & Governance Notice */}
                  <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-blue-900 dark:text-blue-200">
                          Fondasi Jaringan Iklan Berbayar & Jaminan Privasi Nol PII (BR19 / FR13)
                        </div>
                        <p className="text-blue-700 dark:text-blue-300 text-[11px] mt-0.5 leading-relaxed">
                          Hotel memegang kendali penuh atas brand yang tampil. Tawaran hanya tayang setelah opt-in eksplisit oleh Property Manager. Jika brand melakukan perubahan material pada kreatif/syarat, status persetujuan otomatis menjadi <strong>Superceded</strong> dan penayangan dijeda sampai disetujui ulang. Advertiser <strong>tidak pernah</strong> menerima identitas atau nomor kamar tamu.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Summary Metric Pills */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono-tabular">
                    <div className="p-3.5 rounded-xl bg-[var(--cms-surface)] border border-[var(--cms-divider)]">
                      <div className="text-[10px] uppercase font-bold text-[var(--cms-text-secondary)]">Total Usulan Brand</div>
                      <div className="text-lg font-bold mt-1">{(data.adOffers || []).length} Tawaran</div>
                    </div>
                    <div className="p-3.5 rounded-xl bg-[var(--cms-surface)] border border-[var(--cms-divider)]">
                      <div className="text-[10px] uppercase font-bold text-[var(--cms-text-secondary)]">Disetujui Properti</div>
                      <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                        {(data.propertyAdAcceptances || []).filter((a) => a.status === 'Accepted').length} Aktif
                      </div>
                    </div>
                    <div className="p-3.5 rounded-xl bg-[var(--cms-surface)] border border-[var(--cms-divider)]">
                      <div className="text-[10px] uppercase font-bold text-[var(--cms-text-secondary)]">Menunggu Tinjauan</div>
                      <div className="text-lg font-bold text-amber-600 dark:text-amber-400 mt-1">
                        {(data.adOffers || []).filter(
                          (o) =>
                            !(data.propertyAdAcceptances || []).some(
                              (a) => a.offerId === o.id && (a.status === 'Accepted' || a.status === 'Rejected')
                            )
                        ).length} Pending
                      </div>
                    </div>
                    <div className="p-3.5 rounded-xl bg-[var(--cms-surface)] border border-[var(--cms-divider)]">
                      <div className="text-[10px] uppercase font-bold text-[var(--cms-text-secondary)]">Kreatif Superceded</div>
                      <div className="text-lg font-bold text-rose-600 dark:text-rose-400 mt-1">
                        {(data.propertyAdAcceptances || []).filter((a) => a.status === 'Superceded').length} Perlu Re-Accept
                      </div>
                    </div>
                  </div>

                  {/* Ad Offers List */}
                  <div className="space-y-4">
                    {(data.adOffers || []).map((offer) => {
                      const acceptance = (data.propertyAdAcceptances || []).find(
                        (a) => a.offerId === offer.id && a.propertyId === activeProperty.id
                      );
                      const isAccepted = acceptance?.status === 'Accepted' && acceptance.offerVersion === offer.currentVersion;
                      const isSuperceded = acceptance?.status === 'Superceded' || (acceptance?.status === 'Accepted' && acceptance.offerVersion < offer.currentVersion);
                      const isRejected = acceptance?.status === 'Rejected';
                      const isPending = !acceptance || acceptance.status === 'PendingReview';
                      const activeCreative = offer.creativeVersions[0];

                      return (
                        <div
                          key={offer.id}
                          className={`p-5 rounded-2xl bg-[var(--cms-surface)] border transition-all space-y-4 ${
                            isSuperceded
                              ? 'border-rose-400/60 dark:border-rose-500/50 shadow-xs'
                              : isAccepted
                              ? 'border-emerald-400/60 dark:border-emerald-500/50'
                              : 'border-[var(--cms-divider)]'
                          }`}
                        >
                          {/* Offer Header Bar */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--cms-divider)] pb-3">
                            <div className="flex items-center gap-2.5 flex-wrap">
                              <span className="font-mono-tabular font-bold text-[#0050F5] dark:text-[#C7B9FF] text-xs">
                                {offer.id}
                              </span>
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400">
                                {offer.category}
                              </span>
                              <span className="px-2 py-0.5 rounded bg-[var(--cms-bg)] border border-[var(--cms-divider)] font-mono-tabular text-[10px] font-semibold">
                                Versi Kreatif: v{offer.currentVersion}
                              </span>
                              <span className="font-semibold text-xs text-[var(--cms-text-secondary)]">
                                Advertiser: <strong>{offer.advertiserName}</strong>
                              </span>
                            </div>

                            {/* Opt-In Status Badge */}
                            <div>
                              {isAccepted && (
                                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 inline-flex items-center gap-1.5">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>Opted-In & Aktif Tayang (v{acceptance.offerVersion})</span>
                                </span>
                              )}
                              {isSuperceded && (
                                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-500/20 inline-flex items-center gap-1.5 animate-pulse">
                                  <AlertTriangle className="w-3.5 h-3.5" />
                                  <span>Superceded — Revisi Kreatif Memerlukan Re-Approve</span>
                                </span>
                              )}
                              {isRejected && (
                                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-500/10 text-slate-700 dark:text-slate-300 border border-slate-500/20 inline-flex items-center gap-1.5">
                                  <XCircle className="w-3.5 h-3.5" />
                                  <span>Ditolak oleh Properti</span>
                                </span>
                              )}
                              {isPending && (
                                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 inline-flex items-center gap-1.5">
                                  <span>⏳ Menunggu Tinjauan Properti</span>
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Content Grid: Creative Preview + Commercial Terms */}
                          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
                            {/* Creative Preview Canvas */}
                            <div className="md:col-span-5 rounded-xl border border-[var(--cms-divider)] p-3 bg-[var(--cms-bg)] space-y-2">
                              <div className="text-[10px] uppercase font-bold text-[var(--cms-text-secondary)] flex items-center justify-between">
                                <span>Pratinjau Kreatif Saat Ini</span>
                                <span className="font-mono-tabular">v{activeCreative?.version}</span>
                              </div>
                              <div className="aspect-video w-full rounded-lg overflow-hidden relative bg-black/80 flex items-center justify-center">
                                {activeCreative?.mediaUrl ? (
                                  <img
                                    src={activeCreative.mediaUrl}
                                    alt={activeCreative.headline}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="text-slate-400 text-xs">Media Visual Ad</div>
                                )}
                                <div className="absolute bottom-2 left-2 right-2 p-2 rounded bg-black/75 backdrop-blur-xs text-white">
                                  <div className="text-xs font-bold truncate">{activeCreative?.headline}</div>
                                  <div className="text-[10px] text-slate-300 line-clamp-1">{activeCreative?.subline}</div>
                                </div>
                              </div>
                              <div className="flex items-center justify-between text-[11px] pt-1">
                                <span className="text-[var(--cms-text-secondary)]">Call to Action:</span>
                                <span className="px-2 py-0.5 rounded bg-black/10 dark:bg-white/10 font-bold text-xs">
                                  {activeCreative?.callToAction || 'Claim Offer'}
                                </span>
                              </div>
                            </div>

                            {/* Commercial Terms & Controls */}
                            <div className="md:col-span-7 space-y-3 text-xs">
                              <div>
                                <h3 className="text-sm font-bold">{offer.title}</h3>
                                <p className="text-[11px] text-[var(--cms-text-secondary)] mt-0.5">
                                  {offer.targetingNotes || 'Penawaran brand premium untuk tamu menginap.'}
                                </p>
                              </div>

                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 font-mono-tabular">
                                <div className="p-2.5 rounded-lg bg-[var(--cms-bg)] border border-[var(--cms-divider)]">
                                  <div className="text-[10px] text-[var(--cms-text-secondary)]">Skema Model</div>
                                  <div className="font-bold text-xs mt-0.5">{offer.pricingModel}</div>
                                </div>
                                <div className="p-2.5 rounded-lg bg-[var(--cms-bg)] border border-[var(--cms-divider)]">
                                  <div className="text-[10px] text-[var(--cms-text-secondary)]">Nilai Penawaran</div>
                                  <div className="font-bold text-xs text-[#0050F5] dark:text-[#C7B9FF] mt-0.5">
                                    Rp {offer.proposedRateIdr.toLocaleString('id-ID')}
                                  </div>
                                </div>
                                <div className="p-2.5 rounded-lg bg-[var(--cms-bg)] border border-[var(--cms-divider)]">
                                  <div className="text-[10px] text-[var(--cms-text-secondary)]">Frekuensi Cap</div>
                                  <div className="font-bold text-xs mt-0.5">Maks {offer.proposedCapPerStay}× / Stay</div>
                                </div>
                              </div>

                              <div className="space-y-1 text-[11px]">
                                <div>
                                  <span className="text-[var(--cms-text-secondary)]">Penempatan yang Diminta: </span>
                                  {offer.requestedPlacements.map((p) => (
                                    <span key={p} className="mr-1 px-1.5 py-0.5 rounded bg-[var(--cms-bg)] border border-[var(--cms-divider)] font-mono-tabular text-[10px]">
                                      {p}
                                    </span>
                                  ))}
                                </div>
                                <div>
                                  <span className="text-[var(--cms-text-secondary)]">Periode Usulan: </span>
                                  <span className="font-mono-tabular">
                                    {offer.proposedPeriod.startUtc.slice(0, 10)} s/d {offer.proposedPeriod.endUtc.slice(0, 10)}
                                  </span>
                                </div>
                                {acceptance?.commercialTermsRef && (
                                  <div>
                                    <span className="text-[var(--cms-text-secondary)]">Referensi Kontrak Komersial: </span>
                                    <span className="font-mono-tabular font-bold">{acceptance.commercialTermsRef}</span>
                                  </div>
                                )}
                              </div>

                              {/* Superceded Warning Box */}
                              {isSuperceded && (
                                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-800 dark:text-rose-200 text-xs space-y-1">
                                  <div className="font-bold flex items-center gap-1.5">
                                    <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                                    <span>Penayangan Otomatis Dijeda (Rule M13 / BR19)</span>
                                  </div>
                                  <p className="text-[11px] leading-snug">
                                    {acceptance?.supercededReason || `Kreatif telah diubah ke versi ${offer.currentVersion}. Persetujuan properti sebelumnya tidak berlaku lagi untuk materi baru.`}
                                  </p>
                                </div>
                              )}

                              {/* Governance Action Buttons */}
                              <div className="pt-2 flex flex-wrap items-center gap-2">
                                {isSuperceded ? (
                                  <button
                                    type="button"
                                    onClick={async () => {
                                      try {
                                        const res = await apiCall('/api/marketplace/offers/accept', {
                                          method: 'POST',
                                          body: JSON.stringify({
                                            offerId: offer.id,
                                            propertyId: activeProperty.id,
                                          }),
                                        });
                                        await fetchBootstrap();
                                        showNotice('success', res.message || `Revisi v${offer.currentVersion} berhasil disetujui.`);
                                      } catch (err: unknown) {
                                        showNotice('error', err instanceof Error ? err.message : 'Gagal menyetujui tawaran');
                                      }
                                    }}
                                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-sm transition-colors"
                                  >
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    <span>Setujui Materi Revisi (v{offer.currentVersion}) & Aktifkan Kembali</span>
                                  </button>
                                ) : isAccepted ? (
                                  <button
                                    type="button"
                                    onClick={async () => {
                                      try {
                                        const res = await apiCall('/api/marketplace/offers/reject', {
                                          method: 'POST',
                                          body: JSON.stringify({
                                            offerId: offer.id,
                                            propertyId: activeProperty.id,
                                            rejectionReason: 'Property Manager mencabut persetujuan penayangan.',
                                          }),
                                        });
                                        await fetchBootstrap();
                                        showNotice('info', res.message || 'Persetujuan tawaran dicabut.');
                                      } catch (err: unknown) {
                                        showNotice('error', err instanceof Error ? err.message : 'Gagal mencabut persetujuan');
                                      }
                                    }}
                                    className="px-3.5 py-1.5 rounded-xl border border-rose-400 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-xs font-semibold transition-colors"
                                  >
                                    Cabut Persetujuan / Jeda
                                  </button>
                                ) : (
                                  <>
                                    <button
                                      type="button"
                                      onClick={async () => {
                                        try {
                                          const res = await apiCall('/api/marketplace/offers/accept', {
                                            method: 'POST',
                                            body: JSON.stringify({
                                              offerId: offer.id,
                                              propertyId: activeProperty.id,
                                            }),
                                          });
                                          await fetchBootstrap();
                                          showNotice('success', res.message || `Tawaran '${offer.title}' disetujui.`);
                                        } catch (err: unknown) {
                                          showNotice('error', err instanceof Error ? err.message : 'Gagal menyetujui tawaran');
                                        }
                                      }}
                                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-sm transition-colors"
                                    >
                                      <CheckCircle2 className="w-3.5 h-3.5" />
                                      <span>Setujui Penawaran (Opt-In Hotel)</span>
                                    </button>
                                    {!isRejected && (
                                      <button
                                        type="button"
                                        onClick={async () => {
                                          try {
                                            const res = await apiCall('/api/marketplace/offers/reject', {
                                              method: 'POST',
                                              body: JSON.stringify({
                                                offerId: offer.id,
                                                propertyId: activeProperty.id,
                                                rejectionReason: 'Tidak sesuai dengan profil tamu properti.',
                                              }),
                                            });
                                            await fetchBootstrap();
                                            showNotice('info', res.message || 'Tawaran ditolak.');
                                          } catch (err: unknown) {
                                            showNotice('error', err instanceof Error ? err.message : 'Gagal menolak tawaran');
                                          }
                                        }}
                                        className="px-3.5 py-2 rounded-xl border border-[var(--cms-divider)] hover:bg-black/5 dark:hover:bg-white/5 text-xs font-semibold transition-colors"
                                      >
                                        Tolak Tawaran
                                      </button>
                                    )}
                                  </>
                                )}

                                <button
                                  type="button"
                                  onClick={() => {
                                    setRevisingOfferId(revisingOfferId === offer.id ? null : offer.id);
                                    setRevisionHeadline(`${offer.advertiserName} Platinum Year-End Promo`);
                                    setRevisionSubline('Diskon eksklusif hingga 35% dan fasilitas jalur cepat untuk tamu hotel.');
                                  }}
                                  className="px-3 py-1.5 rounded-xl border border-[var(--cms-divider)] text-[var(--cms-text-secondary)] hover:text-[var(--cms-text)] text-xs font-medium inline-flex items-center gap-1 ml-auto"
                                >
                                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                                  <span>Simulasi Revisi Materi Kreatif</span>
                                </button>
                              </div>

                              {/* Material Revision Simulation Drawer */}
                              {revisingOfferId === offer.id && (
                                <form
                                  onSubmit={async (e) => {
                                    e.preventDefault();
                                    try {
                                      const res = await apiCall('/api/marketplace/offers/update-creative', {
                                        method: 'POST',
                                        body: JSON.stringify({
                                          offerId: offer.id,
                                          headline: revisionHeadline,
                                          subline: revisionSubline,
                                          mediaUrl: '/assets/aistudio/file_00000000a6b08211935c3a540293bf6c_74821162.png',
                                          callToAction: 'Lihat Ketentuan Baru',
                                        }),
                                      });
                                      setRevisingOfferId(null);
                                      await fetchBootstrap();
                                      showNotice('info', res.message || 'Kreatif diperbarui. Acceptance otomatis Superceded!');
                                    } catch (err: unknown) {
                                      showNotice('error', err instanceof Error ? err.message : 'Gagal merevisi kreatif');
                                    }
                                  }}
                                  className="mt-3 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2.5"
                                >
                                  <div className="text-[11px] font-bold text-amber-900 dark:text-amber-200 flex items-center justify-between">
                                    <span>Simulasi Advertiser Mengunggah Revisi Materi Kreatif (Naik ke v{offer.currentVersion + 1})</span>
                                    <button
                                      type="button"
                                      onClick={() => setRevisingOfferId(null)}
                                      className="text-amber-700 dark:text-amber-300 hover:underline text-[10px]"
                                    >
                                      Batal
                                    </button>
                                  </div>
                                  <div className="space-y-1.5">
                                    <input
                                      type="text"
                                      value={revisionHeadline}
                                      onChange={(e) => setRevisionHeadline(e.target.value)}
                                      placeholder="Headline materi baru..."
                                      className="w-full px-3 py-1.5 rounded-lg bg-[var(--cms-surface)] border border-[var(--cms-divider)] text-xs"
                                      required
                                    />
                                    <input
                                      type="text"
                                      value={revisionSubline}
                                      onChange={(e) => setRevisionSubline(e.target.value)}
                                      placeholder="Subline materi baru..."
                                      className="w-full px-3 py-1.5 rounded-lg bg-[var(--cms-surface)] border border-[var(--cms-divider)] text-xs"
                                      required
                                    />
                                  </div>
                                  <button
                                    type="submit"
                                    className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs inline-flex items-center gap-1.5 transition-colors"
                                  >
                                    <span>Simulasikan Perubahan Materi (Picu Superceded)</span>
                                  </button>
                                </form>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* SUBTAB 2: MARKETPLACE CATALOG & SERVICE ORDERS */}
              {marketplaceSubTab === 'ORDERS' && (
                <div className="space-y-6">
                  {/* Catalog Services Grid */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-base font-bold">Katalog Layanan & Fasilitas Kamar</h2>
                        <p className="text-xs text-[var(--cms-text-secondary)]">
                          Ditampilkan pada Layanan Tamu SmartTV (Screen 05). Tamu dapat meminta layanan langsung via remote TV.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                      {(data.marketplaceItems || []).map((item) => (
                        <div
                          key={item.id}
                          className="p-4 rounded-2xl bg-[var(--cms-surface)] border border-[var(--cms-divider)] flex flex-col justify-between gap-3 text-xs"
                        >
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400">
                                {item.type}
                              </span>
                              <span className="font-mono-tabular text-[10px] text-[var(--cms-text-secondary)]">
                                {item.fulfilmentType}
                              </span>
                            </div>
                            <div className="font-bold text-sm leading-snug">{item.title}</div>
                            <p className="text-[11px] text-[var(--cms-text-secondary)] line-clamp-2">
                              {item.description}
                            </p>
                            <div className="pt-1 flex items-center justify-between text-[11px] font-mono-tabular">
                              <span className="font-bold text-[#0050F5] dark:text-[#C7B9FF]">{item.priceHint || 'Included'}</span>
                              <span className="text-[var(--cms-text-secondary)]">{item.availabilitySchedule}</span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={async () => {
                              try {
                                const res = await apiCall('/api/marketplace/services/create-order', {
                                  method: 'POST',
                                  body: JSON.stringify({
                                    itemId: item.id,
                                    propertyId: activeProperty.id,
                                    roomId: propRooms[0]?.id || 'R-01-201',
                                    stayId: propStays[0]?.id || 'S-01',
                                    notes: `Simulated order for '${item.title}' via CMS testing button`,
                                  }),
                                });
                                await fetchBootstrap();
                                showNotice('success', res.message || `Pesanan '${item.title}' berhasil dibuat.`);
                              } catch (err: unknown) {
                                showNotice('error', err instanceof Error ? err.message : 'Gagal membuat pesanan');
                              }
                            }}
                            className="w-full py-1.5 px-3 rounded-xl bg-[var(--cms-bg)] hover:bg-black/5 dark:hover:bg-white/5 border border-[var(--cms-divider)] text-xs font-semibold text-center transition-colors cursor-pointer"
                          >
                            + Pesan Uji (Simulasi Tamu)
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Service Order Fulfillment Board */}
                  <div className="space-y-3 pt-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--cms-divider)] pb-2.5">
                      <div>
                        <h2 className="text-base font-bold">Meja Pemenuhan Pesanan Front Desk (Service Order Flow)</h2>
                        <p className="text-xs text-[var(--cms-text-secondary)]">
                          Alur pelacakan: <strong>Requested → Confirmed → InFulfilment → Fulfilled</strong> (FR17).
                        </p>
                      </div>

                      {/* Guest PII Redaction Toggle */}
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setShowRawGuestNames(!showRawGuestNames)}
                          className="px-3 py-1.5 rounded-xl border border-[var(--cms-divider)] bg-[var(--cms-surface)] hover:bg-black/5 dark:hover:bg-white/5 text-xs font-medium inline-flex items-center gap-1.5 transition-colors"
                        >
                          {showRawGuestNames ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          <span>{showRawGuestNames ? 'Sembunyikan Nama Tamu (Masked PII)' : 'Buka Nama Tamu (Front Desk)'}</span>
                        </button>
                      </div>
                    </div>

                    <div className="overflow-x-auto rounded-2xl border border-[var(--cms-divider)] bg-[var(--cms-surface)]">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="border-b border-[var(--cms-divider)] text-[var(--cms-text-secondary)]">
                            <th className="py-2.5 px-4 font-semibold">Order ID</th>
                            <th className="py-2.5 px-3 font-semibold">Layanan Diminta</th>
                            <th className="py-2.5 px-3 font-semibold">Referensi Tamu (Redacted PII)</th>
                            <th className="py-2.5 px-3 font-semibold">Catatan / Waktu</th>
                            <th className="py-2.5 px-3 font-semibold">Petugas (Assigned)</th>
                            <th className="py-2.5 px-3 font-semibold">Status</th>
                            <th className="py-2.5 pr-4 text-right font-semibold">Aksi Pemenuhan</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--cms-divider)]">
                          {(data.serviceOrders || []).length === 0 ? (
                            <tr>
                              <td colSpan={7} className="py-8 text-center text-[var(--cms-text-secondary)]">
                                Belum ada pesanan layanan dari kamar tamu.
                              </td>
                            </tr>
                          ) : (
                            (data.serviceOrders || []).map((order) => {
                              const displayGuest =
                                showRawGuestNames && order.rawGuestName
                                  ? `${order.guestDisplayRef.split('·')[0]} · ${order.rawGuestName} (Unmasked)`
                                  : order.guestDisplayRef;

                              return (
                                <tr key={order.id} className="hover:bg-black/2 dark:hover:bg-white/2 transition-colors">
                                  <td className="py-3 px-4 font-mono-tabular font-bold text-[#0050F5] dark:text-[#C7B9FF]">
                                    {order.id}
                                  </td>
                                  <td className="py-3 px-3">
                                    <div className="font-semibold text-xs">{order.itemTitle}</div>
                                    <div className="text-[10px] text-[var(--cms-text-secondary)] font-mono-tabular">
                                      Tipe: {order.fulfilmentType}
                                    </div>
                                  </td>
                                  <td className="py-3 px-3">
                                    <div className="font-mono-tabular text-xs font-semibold">{displayGuest}</div>
                                    <div className="text-[10px] text-[var(--cms-text-secondary)]">
                                      {new Date(order.requestedAtUtc).toLocaleTimeString()} · FR17 Redacted
                                    </div>
                                  </td>
                                  <td className="py-3 px-3 text-[11px] max-w-[200px] truncate text-[var(--cms-text-secondary)]">
                                    {order.notes || '—'}
                                  </td>
                                  <td className="py-3 px-3 text-xs">
                                    {order.assignedTo || <span className="text-[var(--cms-text-secondary)]">Belum ditugaskan</span>}
                                  </td>
                                  <td className="py-3 px-3">
                                    {order.status === 'Requested' && (
                                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
                                        Requested
                                      </span>
                                    )}
                                    {order.status === 'Confirmed' && (
                                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20">
                                        Confirmed
                                      </span>
                                    )}
                                    {order.status === 'InFulfilment' && (
                                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20">
                                        In Fulfilment
                                      </span>
                                    )}
                                    {order.status === 'Fulfilled' && (
                                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                                        Fulfilled
                                      </span>
                                    )}
                                    {order.status === 'Cancelled' && (
                                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-500/20">
                                        Cancelled
                                      </span>
                                    )}
                                  </td>
                                  <td className="py-3 pr-4 text-right">
                                    <div className="flex items-center justify-end gap-1.5">
                                      {order.status === 'Requested' && (
                                        <button
                                          type="button"
                                          onClick={async () => {
                                            try {
                                              const res = await apiCall('/api/marketplace/services/update-order-status', {
                                                method: 'POST',
                                                body: JSON.stringify({
                                                  orderId: order.id,
                                                  newStatus: 'Confirmed',
                                                  assignedTo: `${currentUser.alias} (Front Desk)`,
                                                }),
                                              });
                                              await fetchBootstrap();
                                              showNotice('success', res.message || 'Pesanan dikonfirmasi.');
                                            } catch (err: unknown) {
                                              showNotice('error', err instanceof Error ? err.message : 'Gagal konfirmasi');
                                            }
                                          }}
                                          className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] transition-colors"
                                        >
                                          Konfirmasi
                                        </button>
                                      )}
                                      {order.status === 'Confirmed' && (
                                        <button
                                          type="button"
                                          onClick={async () => {
                                            try {
                                              const res = await apiCall('/api/marketplace/services/update-order-status', {
                                                method: 'POST',
                                                body: JSON.stringify({
                                                  orderId: order.id,
                                                  newStatus: 'InFulfilment',
                                                }),
                                              });
                                              await fetchBootstrap();
                                              showNotice('success', res.message || 'Status diubah ke In Fulfilment.');
                                            } catch (err: unknown) {
                                              showNotice('error', err instanceof Error ? err.message : 'Gagal update status');
                                            }
                                          }}
                                          className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-[11px] transition-colors"
                                        >
                                          Mulai Kerjakan
                                        </button>
                                      )}
                                      {order.status === 'InFulfilment' && (
                                        <button
                                          type="button"
                                          onClick={async () => {
                                            try {
                                              const res = await apiCall('/api/marketplace/services/update-order-status', {
                                                method: 'POST',
                                                body: JSON.stringify({
                                                  orderId: order.id,
                                                  newStatus: 'Fulfilled',
                                                }),
                                              });
                                              await fetchBootstrap();
                                              showNotice('success', res.message || 'Layanan selesai terpenuhi.');
                                            } catch (err: unknown) {
                                              showNotice('error', err instanceof Error ? err.message : 'Gagal update status');
                                            }
                                          }}
                                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition-colors"
                                        >
                                          Selesai
                                        </button>
                                      )}
                                      {order.status !== 'Fulfilled' && order.status !== 'Cancelled' && (
                                        <button
                                          type="button"
                                          onClick={async () => {
                                            try {
                                              const res = await apiCall('/api/marketplace/services/update-order-status', {
                                                method: 'POST',
                                                body: JSON.stringify({
                                                  orderId: order.id,
                                                  newStatus: 'Cancelled',
                                                  notes: 'Dibatalkan oleh staf front desk.',
                                                }),
                                              });
                                              await fetchBootstrap();
                                              showNotice('info', res.message || 'Pesanan dibatalkan.');
                                            } catch (err: unknown) {
                                              showNotice('error', err instanceof Error ? err.message : 'Gagal batalkan');
                                            }
                                          }}
                                          className="px-2 py-1 rounded-lg border border-[var(--cms-divider)] hover:bg-rose-50 text-rose-600 text-[10px] transition-colors"
                                        >
                                          Batal
                                        </button>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* SUBTAB 3: COMMERCIAL FUNNEL & MONETIZATION ANALYTICS */}
              {marketplaceSubTab === 'FUNNEL' && (
                <div className="space-y-6">
                  {/* Three-Column Funnel Matrix */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* Column 1: Internal Hotel Promotions */}
                    <div className="p-5 rounded-2xl bg-[var(--cms-surface)] border border-[var(--cms-divider)] space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[var(--cms-text-secondary)] uppercase tracking-wider">
                          1. Kampanye Internal Hotel
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400">
                          In-House
                        </span>
                      </div>
                      <div className="space-y-2 font-mono-tabular">
                        <div className="p-3 rounded-xl bg-[var(--cms-bg)] border border-[var(--cms-divider)] flex items-center justify-between text-xs">
                          <span className="text-[var(--cms-text-secondary)]">Percobaan Tayang:</span>
                          <span className="font-bold">42 Impression</span>
                        </div>
                        <div className="p-3 rounded-xl bg-[var(--cms-bg)] border border-[var(--cms-divider)] flex items-center justify-between text-xs">
                          <span className="text-[var(--cms-text-secondary)]">Pemutaran Dimulai:</span>
                          <span className="font-bold text-[#0050F5] dark:text-[#C7B9FF]">38 Starts</span>
                        </div>
                        <div className="p-3 rounded-xl bg-[var(--cms-bg)] border border-[var(--cms-divider)] flex items-center justify-between text-xs">
                          <span className="text-[var(--cms-text-secondary)]">Selesai Menonton:</span>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">26 Selesai (68%)</span>
                        </div>
                        <div className="p-3 rounded-xl bg-[var(--cms-bg)] border border-[var(--cms-divider)] flex items-center justify-between text-xs">
                          <span className="text-[var(--cms-text-secondary)]">Total Durasi Paparan:</span>
                          <span className="font-bold">780 Detik</span>
                        </div>
                      </div>
                    </div>

                    {/* Column 2: External Paid Ad Network */}
                    <div className="p-5 rounded-2xl bg-[var(--cms-surface)] border border-[var(--cms-divider)] space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[var(--cms-text-secondary)] uppercase tracking-wider">
                          2. Jaringan Iklan Berbayar
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400">
                          B2B Network
                        </span>
                      </div>
                      <div className="space-y-2 font-mono-tabular">
                        <div className="p-3 rounded-xl bg-[var(--cms-bg)] border border-[var(--cms-divider)] flex items-center justify-between text-xs">
                          <span className="text-[var(--cms-text-secondary)]">Tawaran Disetujui (Opt-In):</span>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">
                            {(data.propertyAdAcceptances || []).filter((a) => a.status === 'Accepted').length} Aktif
                          </span>
                        </div>
                        <div className="p-3 rounded-xl bg-[var(--cms-bg)] border border-[var(--cms-divider)] flex items-center justify-between text-xs">
                          <span className="text-[var(--cms-text-secondary)]">Pemutaran Iklan Eksternal:</span>
                          <span className="font-bold text-[#0050F5] dark:text-[#C7B9FF]">8 Starts</span>
                        </div>
                        <div className="p-3 rounded-xl bg-[var(--cms-bg)] border border-[var(--cms-divider)] flex items-center justify-between text-xs">
                          <span className="text-[var(--cms-text-secondary)]">Kepatuhan Privasi:</span>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">100% Zero-PII</span>
                        </div>
                        <div className="p-3 rounded-xl bg-[var(--cms-bg)] border border-[var(--cms-divider)] flex items-center justify-between text-xs">
                          <span className="text-[var(--cms-text-secondary)]">Kejadian Superceded:</span>
                          <span className="font-bold text-rose-600 dark:text-rose-400">
                            {(data.propertyAdAcceptances || []).filter((a) => a.status === 'Superceded').length} Insiden
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Column 3: In-Room Marketplace Orders */}
                    <div className="p-5 rounded-2xl bg-[var(--cms-surface)] border border-[var(--cms-divider)] space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[var(--cms-text-secondary)] uppercase tracking-wider">
                          3. Marketplace Layanan Kamar
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400">
                          Concierge
                        </span>
                      </div>
                      <div className="space-y-2 font-mono-tabular">
                        <div className="p-3 rounded-xl bg-[var(--cms-bg)] border border-[var(--cms-divider)] flex items-center justify-between text-xs">
                          <span className="text-[var(--cms-text-secondary)]">Total Permintaan Tamu:</span>
                          <span className="font-bold">{(data.serviceOrders || []).length} Pesanan</span>
                        </div>
                        <div className="p-3 rounded-xl bg-[var(--cms-bg)] border border-[var(--cms-divider)] flex items-center justify-between text-xs">
                          <span className="text-[var(--cms-text-secondary)]">Dikonfirmasi Front Desk:</span>
                          <span className="font-bold text-blue-600 dark:text-blue-400">
                            {(data.serviceOrders || []).filter((o) => o.status === 'Confirmed' || o.status === 'InFulfilment' || o.status === 'Fulfilled').length} Pesanan
                          </span>
                        </div>
                        <div className="p-3 rounded-xl bg-[var(--cms-bg)] border border-[var(--cms-divider)] flex items-center justify-between text-xs">
                          <span className="text-[var(--cms-text-secondary)]">Terselesaikan (Fulfilled):</span>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">
                            {(data.serviceOrders || []).filter((o) => o.status === 'Fulfilled').length} Selesai
                          </span>
                        </div>
                        <div className="p-3 rounded-xl bg-[var(--cms-bg)] border border-[var(--cms-divider)] flex items-center justify-between text-xs">
                          <span className="text-[var(--cms-text-secondary)]">Saluran Pemenuhan:</span>
                          <span className="font-bold text-xs">Staff Ticket & Partner API</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Non-Audience & Financial Disclaimer Box */}
                  <div className="p-4 rounded-2xl bg-[var(--cms-surface)] border border-[var(--cms-divider)] text-xs space-y-1.5 text-[var(--cms-text-secondary)]">
                    <div className="font-bold text-[var(--cms-text)] flex items-center gap-1.5">
                      <LifeBuoy className="w-4 h-4 text-[#0050F5] dark:text-[#C7B9FF]" />
                      <span>Catatan Batas Lingkup Fondasi Fase 1 (Implementation Plan §13.2 & §13.6):</span>
                    </div>
                    <p className="leading-relaxed">
                      1. Metrik tayangan dan durasi paparan dihitung berdasarkan pemutaran teknis pemutar video (BR19 PlaybackFact Ledger), bukan klaim pemirsa manusia (no unverified human audience claims).<br />
                      2. Tidak ada penagihan kartu kredit otomatis (payment gateway capture) di dalam sistem GOJJA SmartTV pada fase ini. Semua pesanan tamu ditagihkan melalui folio kamar hotel (PMS) atau QR handoff partner eksternal.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ===================================================================== */}
          {/* TAB 8: UPDATES & RELEASES (PR-23..24 / GA-09..10)                     */}
          {/* ===================================================================== */}
          {activeTab === 'updates' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold">Release Registry, Dual Approval & Room Readiness Matrix (M09)</h1>
                <p className="text-xs text-[var(--cms-text-secondary)]">
                  Rule BR14: GOJJA Technical Approval (R-03) and Property Installation Permission (R-10/R-11) are two separate decisions. Rule BR06: Checkout alone does not prove a room is physically ready for maintenance.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {data.releases.map((rel) => {
                  const propApp = data.updateApprovals.find(
                    (a) => a.propertyId === activeProperty.id && a.releaseId === rel.id
                  );
                  return (
                    <div
                      key={rel.id}
                      className="p-5 rounded-2xl bg-[var(--cms-surface)] border border-[var(--cms-divider)] space-y-4 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono-tabular font-bold text-sm">
                          {rel.id} · v{rel.versionName} ({rel.packageName})
                        </span>
                        <span className="font-semibold text-[#0050F5] dark:text-[#C7B9FF]">{rel.status}</span>
                      </div>
                      <p className="text-[var(--cms-text-secondary)]">{rel.releaseNotes}</p>
                      <div className="p-3 rounded-xl bg-[var(--cms-bg)] font-mono-tabular text-[11px] space-y-1">
                        <div>SHA-256: {rel.sha256.slice(0, 32)}...</div>
                        <div>Technical Approver: {rel.technicallyApprovedBy || 'Pending R-03 Review'}</div>
                        <div>
                          Property ({activeProperty.id}) Window: {propApp?.status || 'Not Approved'} ({propApp?.windowStartLocal}–{propApp?.windowEndLocal})
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <button
                          onClick={async () => {
                            try {
                              await apiCall('/api/releases/technical-approve', {
                                method: 'POST',
                                body: JSON.stringify({ releaseId: rel.id }),
                              });
                              await fetchBootstrap();
                              showNotice('success', `Release ${rel.versionName} Technically Approved by ${currentUser.name}.`);
                            } catch (err: unknown) {
                              showNotice('error', err instanceof Error ? err.message : 'Technical approval denied');
                            }
                          }}
                          className="px-3.5 py-2 rounded-xl bg-[var(--cms-bg)] border border-[var(--cms-control-border)] font-semibold hover:bg-[#0050F5] hover:text-white transition-colors"
                        >
                          1. Technical Approve (R-03 Only)
                        </button>

                        <button
                          onClick={async () => {
                            try {
                              await apiCall('/api/updates/property-approve', {
                                method: 'POST',
                                body: JSON.stringify({
                                  propertyId: activeProperty.id,
                                  releaseId: rel.id,
                                  windowStartLocal: '02:00 WIB',
                                  windowEndLocal: '05:00 WIB',
                                }),
                              });
                              await fetchBootstrap();
                              showNotice('success', `Property installation window approved for ${rel.versionName}.`);
                            } catch (err: unknown) {
                              showNotice('error', err instanceof Error ? err.message : 'Property approval denied');
                            }
                          }}
                          className="px-3.5 py-2 rounded-xl bg-[#0050F5] text-white font-semibold hover:bg-[#0040C8]"
                        >
                          2. Grant Property Window (R-10 / R-11)
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Per-Endpoint Update Jobs & OutcomeUnknown Reconcile */}
              <div className="p-5 rounded-2xl bg-[var(--cms-surface)] border border-[var(--cms-divider)] space-y-3">
                <h2 className="text-base font-bold">Update Job Queue & Readiness Guards</h2>
                <div className="space-y-2.5 text-xs">
                  {data.updateJobs.map((job) => (
                    <div
                      key={job.id}
                      className="p-3.5 rounded-xl bg-[var(--cms-bg)] border border-[var(--cms-divider)] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="font-mono-tabular font-bold">
                          {job.id} · Endpoint {job.endpointId} ({job.roomId}) · Target {job.releaseId}
                        </div>
                        <div className="text-[var(--cms-text-secondary)]">{job.reason}</div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="px-2.5 py-1 rounded-lg bg-amber-500/15 text-amber-800 dark:text-amber-300 font-semibold">
                          {job.stage}
                        </span>
                        <button
                          onClick={async () => {
                            try {
                              const res = await apiCall('/api/updates/reconcile-job', {
                                method: 'POST',
                                body: JSON.stringify({ jobId: job.id }),
                              });
                              await fetchBootstrap();
                              showNotice('info', res.job.reason);
                            } catch (err: unknown) {
                              showNotice('error', err instanceof Error ? err.message : 'Reconcile failed');
                            }
                          }}
                          className="px-3 py-1.5 rounded-lg bg-[#0050F5] text-white font-semibold"
                        >
                          Reconcile Job
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* TAB 9: ANALYTICS & MEASUREMENT (PR-25, Exact Fixture Arithmetic)      */}
          {/* ===================================================================== */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold">Playback Measurement, Channel QoE & Service Funnel (M25)</h1>
                <p className="text-xs text-[var(--cms-text-secondary)]">
                  All figures include explicit denominators, units, and source provenance. Technical playback starts are never presented as human audience counts (BR19).
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
                {/* Campaign Fixture Card (F-029) */}
                <div className="p-5 rounded-2xl bg-[var(--cms-surface)] border border-[var(--cms-divider)] space-y-3">
                  <div className="text-[var(--cms-text-secondary)] font-semibold">
                    CAMPAIGN FIXTURE • {analyticsFixture.campaignSummary.campaignId}
                  </div>
                  <div className="text-2xl font-bold font-mono-tabular">
                    {analyticsFixture.campaignSummary.totalPlaySeconds}s played ({analyticsFixture.campaignSummary.completionRatePercent}% complete)
                  </div>
                  <div className="space-y-1 font-mono-tabular text-[11px] pt-2 border-t border-[var(--cms-divider)]">
                    <div>Starts: {analyticsFixture.campaignSummary.starts}</div>
                    <div>Completed (6 × 30s): {analyticsFixture.campaignSummary.completed} (180s)</div>
                    <div>Skipped (2 × 5s): {analyticsFixture.campaignSummary.skipped} (10s)</div>
                    <div>Interrupted (1 × 20s): {analyticsFixture.campaignSummary.interrupted} (20s)</div>
                    <div>Failed after start (1 × 2s): {analyticsFixture.campaignSummary.failedAfterStart} (2s)</div>
                  </div>
                </div>

                {/* Channel Playback Fixture Card (F-029) */}
                <div className="p-5 rounded-2xl bg-[var(--cms-surface)] border border-[var(--cms-divider)] space-y-3">
                  <div className="text-[var(--cms-text-secondary)] font-semibold">
                    CHANNEL SESSION QOE • {analyticsFixture.channelSummary.propertyId}
                  </div>
                  <div className="text-2xl font-bold font-mono-tabular">
                    {analyticsFixture.channelSummary.totalPlaySeconds}s ({analyticsFixture.channelSummary.totalPlayMinutes} mins)
                  </div>
                  <div className="space-y-1 font-mono-tabular text-[11px] pt-2 border-t border-[var(--cms-divider)]">
                    <div>Attempts / Starts: {analyticsFixture.channelSummary.attempts} attempts / {analyticsFixture.channelSummary.starts} starts</div>
                    <div>Failed before first frame: {analyticsFixture.channelSummary.failedBeforeStart}</div>
                    <div>Median Valid Session: {analyticsFixture.channelSummary.medianSessionSeconds}s</div>
                    <div>
                      Reporting Coverage: {analyticsFixture.channelSummary.uniqueReportingEndpoints}/{analyticsFixture.channelSummary.targetEndpoints} endpoints ({analyticsFixture.channelSummary.reportingCoveragePercent}%)
                    </div>
                  </div>
                </div>

                {/* Service Request Funnel Card */}
                <div className="p-5 rounded-2xl bg-[var(--cms-surface)] border border-[var(--cms-divider)] space-y-3">
                  <div className="text-[var(--cms-text-secondary)] font-semibold">
                    IN-ROOM SERVICE & QR FUNNEL
                  </div>
                  <div className="text-2xl font-bold font-mono-tabular">
                    {analyticsFixture.serviceFunnel.confirmedBookings} Confirmed / {analyticsFixture.serviceFunnel.fulfilledPaid} Paid
                  </div>
                  <div className="space-y-1 font-mono-tabular text-[11px] pt-2 border-t border-[var(--cms-divider)]">
                    <div>Tile Exposures: {analyticsFixture.serviceFunnel.tileExposures}</div>
                    <div>Detail Opens: {analyticsFixture.serviceFunnel.detailOpens}</div>
                    <div>QR Landing Sessions: {analyticsFixture.serviceFunnel.qrLandingSessions}</div>
                    <div>Service Requests Submitted: {analyticsFixture.serviceFunnel.serviceRequests}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* TAB 10: BILLING & INVOICES (GA-11..12, Exact Tabular IDR & Idempotency)*/}
          {/* ===================================================================== */}
          {activeTab === 'billing' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="text-2xl font-bold">Subscriptions, Seat Ledger & Invoice Reconciliation (M02)</h1>
                  <p className="text-xs text-[var(--cms-text-secondary)]">
                    Wholesale hypothesis Rp15,000/seat, Direct demo Rp25,000/seat. Offline TVs do not reduce contracted seat billing. Payment verification is idempotent by transaction reference (F-031).
                  </p>
                </div>
              </div>

              {/* Financial Summary Strip (Exact un-animated figures per UI/UX R1 §12.7) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono-tabular">
                <div className="p-4 rounded-2xl bg-[var(--cms-surface)] border border-[var(--cms-divider)]">
                  <div className="text-xs text-[var(--cms-text-secondary)]">Total Issued (Scoped)</div>
                  <div className="text-2xl font-bold mt-1">Rp{kpis.totalIssuedIdr.toLocaleString('id-ID')}</div>
                </div>
                <div className="p-4 rounded-2xl bg-[var(--cms-surface)] border border-[var(--cms-divider)]">
                  <div className="text-xs text-[var(--cms-text-secondary)]">Total Verified Paid</div>
                  <div className="text-2xl font-bold mt-1 text-emerald-700 dark:text-emerald-300">
                    Rp{kpis.totalPaidIdr.toLocaleString('id-ID')}
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-[var(--cms-surface)] border border-[var(--cms-divider)]">
                  <div className="text-xs text-[var(--cms-text-secondary)]">Total Outstanding Balance</div>
                  <div className="text-2xl font-bold mt-1 text-amber-700 dark:text-amber-300">
                    Rp{kpis.totalOutstandingIdr.toLocaleString('id-ID')}
                  </div>
                </div>
              </div>

              {/* Invoices Table + Idempotent Payment Verification */}
              <div className="p-5 rounded-2xl bg-[var(--cms-surface)] border border-[var(--cms-divider)] space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-base font-bold">Issued Invoices (Immutable Snapshots)</h2>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-[var(--cms-text-secondary)]">Transaction Ref for Verification:</span>
                    <input
                      type="text"
                      value={paymentTxRef}
                      onChange={(e) => setPaymentTxRef(e.target.value)}
                      className="px-3 py-1.5 rounded-lg bg-[var(--cms-input)] border border-[var(--cms-control-border)] font-mono-tabular"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-[var(--cms-divider)] text-[var(--cms-text-secondary)]">
                        <th className="py-2 pr-3">Invoice ID</th>
                        <th className="py-2 px-3">Buyer / Payer</th>
                        <th className="py-2 px-3">Line Item</th>
                        <th className="py-2 px-3 text-right">Total (IDR)</th>
                        <th className="py-2 px-3 text-right">Paid (IDR)</th>
                        <th className="py-2 px-3">Status</th>
                        <th className="py-2 pl-3 text-right">Action (R-05 GOJJA Finance)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--cms-divider)]">
                      {data.invoices.map((inv) => (
                        <tr key={inv.id}>
                          <td className="py-3 pr-3 font-mono-tabular font-bold">{inv.id}</td>
                          <td className="py-3 px-3">{inv.buyerName}</td>
                          <td className="py-3 px-3">{inv.lineDescription}</td>
                          <td className="py-3 px-3 text-right font-mono-tabular font-semibold">
                            Rp{inv.totalIdr.toLocaleString('id-ID')}
                          </td>
                          <td className="py-3 px-3 text-right font-mono-tabular text-emerald-700 dark:text-emerald-300">
                            Rp{inv.paidIdr.toLocaleString('id-ID')}
                          </td>
                          <td className="py-3 px-3 font-semibold">{inv.status}</td>
                          <td className="py-3 pl-3 text-right">
                            <button
                              onClick={async () => {
                                try {
                                  const res = await apiCall('/api/finance/verify-payment', {
                                    method: 'POST',
                                    body: JSON.stringify({
                                      invoiceId: inv.id,
                                      transactionRef: paymentTxRef,
                                      amountIdr: inv.totalIdr,
                                    }),
                                  });
                                  await fetchBootstrap();
                                  showNotice('success', res.message);
                                } catch (err: unknown) {
                                  showNotice('error', err instanceof Error ? err.message : 'Payment verification denied');
                                }
                              }}
                              className="px-3 py-1.5 rounded-lg bg-[#0050F5] text-white font-semibold hover:bg-[#0040C8]"
                            >
                              Verify Payment ({paymentTxRef})
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* TAB 11: SUPPORT, AUDIT & LIVE ACCEPTANCE SUITE RUNNER                 */}
          {/* ===================================================================== */}
          {activeTab === 'support-qa' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="text-2xl font-bold">Support Triage, Audit Log & Acceptance Verification Runner</h1>
                  <p className="text-xs text-[var(--cms-text-secondary)]">
                    Run automated verification across Functional, RBAC/Security, Live LAN/ADB, and UI/UX/Motion acceptance criteria and inspect actual results.
                  </p>
                </div>
                <button
                  onClick={async () => {
                    try {
                      const rep = await apiCall('/api/acceptance/run', { method: 'POST' });
                      setAcceptanceReport(rep);
                      showNotice(
                        'success',
                        `Acceptance check completed: ${rep.summary.passed} Passed, ${rep.summary.blockedHardware} Blocked (Hardware Not Attached), ${rep.summary.failed} Failed.`
                      );
                    } catch (err: unknown) {
                      showNotice('error', err instanceof Error ? err.message : 'Acceptance run failed');
                    }
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#0050F5] hover:bg-[#0040C8] text-white text-xs font-semibold inline-flex items-center gap-2 shrink-0"
                >
                  <FileCheck2 className="w-4 h-4" />
                  <span>Run Live Acceptance Checks</span>
                </button>
              </div>

              {/* Acceptance Report Results Table */}
              {acceptanceReport && (
                <div className="p-5 rounded-2xl bg-[var(--cms-surface)] border border-[var(--cms-divider)] space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h2 className="text-base font-bold">
                      Actual Acceptance Verification Report (Executed {new Date(acceptanceReport.executedAtUtc).toLocaleTimeString()})
                    </h2>
                    <div className="flex items-center gap-3 text-xs font-mono-tabular font-semibold">
                      <span className="text-emerald-700 dark:text-emerald-300">
                        Passed: {acceptanceReport.summary.passed}
                      </span>
                      <span className="text-amber-700 dark:text-amber-300">
                        Blocked (Physical TV Required): {acceptanceReport.summary.blockedHardware}
                      </span>
                      <span className="text-rose-700 dark:text-rose-300">
                        Failed: {acceptanceReport.summary.failed}
                      </span>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-[var(--cms-divider)] text-[var(--cms-text-secondary)]">
                          <th className="py-2 pr-3">ID</th>
                          <th className="py-2 px-3">Suite</th>
                          <th className="py-2 px-3">Requirement</th>
                          <th className="py-2 px-3">Status</th>
                          <th className="py-2 pl-3">Actual Observed Evidence</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--cms-divider)]">
                        {acceptanceReport.results.map((r) => (
                          <tr key={r.id}>
                            <td className="py-2.5 pr-3 font-mono-tabular font-bold">{r.id}</td>
                            <td className="py-2.5 px-3 whitespace-nowrap">{r.suite}</td>
                            <td className="py-2.5 px-3 font-semibold">{r.title}</td>
                            <td className="py-2.5 px-3 font-bold">
                              {r.status === 'Pass' ? (
                                <span className="text-emerald-700 dark:text-emerald-300">Pass</span>
                              ) : r.status === 'Blocked' ? (
                                <span className="text-amber-700 dark:text-amber-300">Blocked</span>
                              ) : (
                                <span className="text-rose-700 dark:text-rose-300">{r.status}</span>
                              )}
                            </td>
                            <td className="py-2.5 pl-3 text-[var(--cms-text-secondary)] font-mono-tabular text-[11px]">
                              {r.actual}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Support Tickets with Read-Only Diagnostic Assistant (M11 / M12) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {data.tickets.map((tk) => (
                  <div
                    key={tk.id}
                    className="p-5 rounded-2xl bg-[var(--cms-surface)] border border-[var(--cms-divider)] space-y-3 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono-tabular font-bold text-[#0050F5] dark:text-[#C7B9FF]">
                        {tk.id} · Endpoint {tk.endpointId} ({tk.propertyId})
                      </span>
                      <span className="font-semibold">{tk.severity} · {tk.status}</span>
                    </div>
                    <div className="text-sm font-bold">{tk.title}</div>
                    <p className="text-[var(--cms-text-secondary)]">{tk.symptom}</p>
                    <div className="p-3 rounded-xl bg-[var(--cms-bg)] space-y-1.5">
                      <div className="font-bold">Observed Telemetry Facts (M12 Read-Only Triage):</div>
                      <ul className="list-disc list-inside text-[11px] text-[var(--cms-text-secondary)] space-y-0.5">
                        {tk.observedFacts.map((f, i) => (
                          <li key={i}>{f}</li>
                        ))}
                      </ul>
                      <div className="pt-1 text-[11px]">
                        <strong>Inference:</strong> {tk.diagnosticInference}
                      </div>
                      <div className="text-[11px] text-[#0050F5] dark:text-[#C7B9FF]">
                        <strong>Recommended Action:</strong> {tk.suggestedNextAction}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Append-Only Security & Domain Audit Log (M26 / LB-04) */}
              <div className="p-5 rounded-2xl bg-[var(--cms-surface)] border border-[var(--cms-divider)] space-y-3">
                <h2 className="text-base font-bold">Append-Only Security & Domain Audit Explorer (LB-04)</h2>
                <div className="overflow-x-auto max-h-72">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-[var(--cms-divider)] text-[var(--cms-text-secondary)]">
                        <th className="py-2 pr-3">Timestamp</th>
                        <th className="py-2 px-3">Actor / Role</th>
                        <th className="py-2 px-3">Action</th>
                        <th className="py-2 px-3">Target</th>
                        <th className="py-2 px-3">Outcome</th>
                        <th className="py-2 pl-3">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--cms-divider)] font-mono-tabular text-[11px]">
                      {data.auditEvents.slice(0, 15).map((aud) => (
                        <tr key={aud.id}>
                          <td className="py-2 pr-3 whitespace-nowrap">{aud.timestampUtc.slice(0, 19)}Z</td>
                          <td className="py-2 px-3 whitespace-nowrap">
                            {aud.actorAlias} ({aud.actorRole})
                          </td>
                          <td className="py-2 px-3 font-semibold">{aud.action}</td>
                          <td className="py-2 px-3">{aud.targetRef}</td>
                          <td className="py-2 px-3 font-bold">
                            <span
                              className={
                                aud.outcome === 'ALLOW'
                                  ? 'text-emerald-700 dark:text-emerald-300'
                                  : aud.outcome === 'DENY'
                                  ? 'text-rose-700 dark:text-rose-300'
                                  : 'text-amber-700 dark:text-amber-300'
                              }
                            >
                              {aud.outcome} ({aud.reasonCode})
                            </span>
                          </td>
                          <td className="py-2 pl-3 font-sans text-[var(--cms-text-secondary)]">{aud.details}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* DEDICATED TAB: DEVICES (Hardware Fleet & ADB Endpoints)               */}
          {/* ===================================================================== */}
          {activeTab === 'devices' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">TV Devices & Fleet Inventory — {activeProperty.name}</h1>
                  <p className="text-xs text-[var(--cms-text-secondary)]">
                    Real-time endpoint connectivity, Android TV hardware models, ADB pairing status, and remote TV preview.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('discovery')}
                    className="px-3.5 py-2 rounded-xl bg-[var(--brand-indigo)] hover:bg-[#3B27EB] text-white font-semibold text-xs inline-flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <Radar className="w-3.5 h-3.5" />
                    <span>Scan LAN / Pair Device</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-[var(--cms-surface)] border border-[var(--cms-divider)]">
                  <div className="text-xs text-[var(--cms-text-secondary)]">Total Registered Endpoints</div>
                  <div className="text-2xl font-extrabold font-mono-tabular mt-1">{propEndpoints.length}</div>
                  <div className="text-[11px] text-[var(--cms-text-secondary)] mt-1">
                    Licensed pool: {propSubscription?.seats ?? 12} TVs
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-[var(--cms-surface)] border border-[var(--cms-divider)]">
                  <div className="text-xs text-[var(--cms-text-secondary)]">Online Endpoints</div>
                  <div className="text-2xl font-extrabold font-mono-tabular text-emerald-600 dark:text-emerald-400 mt-1">
                    {propOnlineCount}
                  </div>
                  <div className="text-[11px] text-[var(--cms-text-secondary)] mt-1">Active heartbeat &lt; 60s</div>
                </div>
                <div className="p-4 rounded-2xl bg-[var(--cms-surface)] border border-[var(--cms-divider)]">
                  <div className="text-xs text-[var(--cms-text-secondary)]">Offline / Attention</div>
                  <div className="text-2xl font-extrabold font-mono-tabular text-rose-600 dark:text-rose-400 mt-1">
                    {propOfflineCount}
                  </div>
                  <div className="text-[11px] text-[var(--cms-text-secondary)] mt-1">Cached fallback active</div>
                </div>
                <div className="p-4 rounded-2xl bg-[var(--cms-surface)] border border-[var(--cms-divider)]">
                  <div className="text-xs text-[var(--cms-text-secondary)]">Active Bundle Version</div>
                  <div className="text-2xl font-extrabold font-mono-tabular text-[var(--brand-indigo)] dark:text-[#C7B9FF] mt-1">
                    v{activeProperty.resourceVersion}
                  </div>
                  <div className="text-[11px] text-[var(--cms-text-secondary)] mt-1">Signed OTA manifest</div>
                </div>
              </div>

              {/* Unassigned Discovered Candidates (Ready for Room Assignment) */}
              {(() => {
                const pendingCandidates = data.candidates.filter(
                  (c) => c.authState !== 'Enrolled' && !c.assignedRoomId
                );
                if (pendingCandidates.length === 0) return null;
                return (
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Radar className="w-5 h-5 text-amber-500 animate-pulse" />
                        <div>
                          <h3 className="text-sm font-bold text-amber-900 dark:text-amber-200">
                            📡 Perangkat TV Terdeteksi di Jaringan ({pendingCandidates.length} Siap Dimasukkan ke Kamar)
                          </h3>
                          <p className="text-xs text-[var(--cms-text-secondary)]">
                            TV fisik telah ditemukan melalui scan LAN / ADB. Pilih kamar target untuk memasukkan perangkat ini ke inventaris kamar hotel.
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setActiveTab('discovery')}
                        className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs inline-flex items-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        <span>Buka Wizard Discovery</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
                      {pendingCandidates.map((cand) => (
                        <div
                          key={cand.id}
                          className="p-3.5 rounded-xl bg-[var(--cms-surface)] border border-[var(--cms-divider)] space-y-2 text-xs"
                        >
                          <div className="flex items-center justify-between">
                            <div className="font-bold text-[var(--cms-text)]">{cand.friendlyName || cand.observedModel || 'Android Smart TV'}</div>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
                              {cand.authState}
                            </span>
                          </div>
                          <div className="font-mono-tabular text-[11px] text-[var(--cms-text-secondary)] space-y-0.5">
                            <div>IP: {cand.ip}:{cand.port}</div>
                            <div>OS: Android TV {cand.observedAndroidVersion || '12'} (SDK {cand.observedSdkInt || 31})</div>
                          </div>
                          <div className="pt-1 flex items-center gap-2">
                            <select
                              id={`device-assign-room-${cand.id}`}
                              defaultValue={propRooms[0]?.id || ''}
                              className="flex-1 px-2 py-1.5 rounded-lg bg-[var(--cms-bg)] border border-[var(--cms-control-border)] text-xs font-mono-tabular"
                            >
                              {propRooms.map((r) => (
                                <option key={r.id} value={r.id}>
                                  Room {r.code} ({r.roomClass})
                                </option>
                              ))}
                            </select>
                            <button
                              type="button"
                              onClick={async () => {
                                const sel = document.getElementById(`device-assign-room-${cand.id}`) as HTMLSelectElement;
                                const targetRoom = sel?.value || propRooms[0]?.id;
                                if (!targetRoom) return;
                                try {
                                  const res = await apiCall('/api/live-lab/assign-device', {
                                    method: 'POST',
                                    body: JSON.stringify({
                                      candidateId: cand.id,
                                      propertyId: activeProperty.id,
                                      roomId: targetRoom,
                                      endpointLabel: `${cand.observedModel || 'MediaTek Smart TV'}`,
                                    }),
                                  });
                                  await fetchBootstrap();
                                  showNotice('success', res.message || `Perangkat berhasil dimasukkan ke kamar.`);
                                } catch (err: unknown) {
                                  showNotice('error', err instanceof Error ? err.message : 'Gagal menugaskan kamar');
                                }
                              }}
                              className="px-3 py-1.5 rounded-lg bg-[#0050F5] hover:bg-[#0040C8] text-white font-semibold text-xs whitespace-nowrap cursor-pointer"
                            >
                              Tugaskan ke Kamar
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {propEndpoints.length === 0 ? (
                <div className="p-10 text-center rounded-2xl bg-[var(--cms-surface)] border border-[var(--cms-divider)] space-y-3">
                  <Tv className="w-12 h-12 mx-auto text-[var(--cms-text-secondary)] opacity-50" />
                  <h3 className="text-base font-bold">Belum Ada TV Terdaftar di Inventaris</h3>
                  <p className="text-xs text-[var(--cms-text-secondary)] max-w-md mx-auto">
                    Pindai jaringan LAN hotel untuk mendeteksi perangkat SmartTV atau hubungkan perangkat Android TV menggunakan wizard discovery.
                  </p>
                  <button
                    onClick={() => setActiveTab('discovery')}
                    className="px-4 py-2 rounded-xl bg-[#0050F5] hover:bg-[#0040C8] text-white font-semibold text-xs inline-flex items-center gap-2 shadow-xs cursor-pointer"
                  >
                    <Radar className="w-4 h-4" />
                    <span>Scan Jaringan LAN / Pasangkan TV</span>
                  </button>
                </div>
              ) : (
                <div className="p-5 rounded-2xl bg-[var(--cms-surface)] border border-[var(--cms-divider)] overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-[var(--cms-divider)] text-[var(--cms-text-secondary)] font-semibold">
                        <th className="py-2.5 pr-4">Endpoint ID</th>
                        <th className="py-2.5 px-4">Hardware Model & OS</th>
                        <th className="py-2.5 px-4">Assigned Room</th>
                        <th className="py-2.5 px-4">IP / Serial Ref</th>
                        <th className="py-2.5 px-4">Connection</th>
                        <th className="py-2.5 px-4">Config Sync</th>
                        <th className="py-2.5 pl-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--cms-divider)]">
                      {propEndpoints.map((ep) => {
                        const assignedRoom = propRooms.find((r) => r.id === ep.roomId);
                        return (
                          <tr key={ep.id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
                            <td className="py-3 pr-4 font-mono-tabular font-bold">{ep.id}</td>
                            <td className="py-3 px-4">
                              <div className="font-semibold">{ep.manufacturer} · {ep.modelName}</div>
                              <div className="text-[11px] text-[var(--cms-text-secondary)]">
                                Android TV {ep.androidVersion} · App {ep.appVersion}
                              </div>
                            </td>
                            <td className="py-3 px-4 font-mono-tabular">
                              {assignedRoom ? `Room ${assignedRoom.code} (${assignedRoom.roomClass})` : 'Unassigned'}
                            </td>
                            <td className="py-3 px-4 font-mono-tabular text-[11px]">
                              <div>{ep.ipHint}:{ep.portHint}</div>
                              <div className="text-[var(--cms-text-secondary)]">{ep.serialRef}</div>
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`inline-flex items-center gap-1.5 font-semibold ${
                                  ep.connection === 'Online'
                                    ? 'text-emerald-700 dark:text-emerald-300'
                                    : 'text-rose-700 dark:text-rose-300'
                                }`}
                              >
                                <span
                                  className={`w-2 h-2 rounded-full ${
                                    ep.connection === 'Online' ? 'bg-emerald-500' : 'bg-rose-500'
                                  }`}
                                />
                                {ep.connection}
                              </span>
                            </td>
                            <td className="py-3 px-4 font-mono-tabular">
                              v{ep.appliedConfigVersion} · {ep.verificationLevel}
                            </td>
                            <td className="py-3 pl-4 text-right space-x-2 whitespace-nowrap">
                              <button
                                onClick={() => setTvModalEndpointId(ep.id)}
                                className="px-2.5 py-1.5 rounded-lg bg-[var(--brand-indigo)] text-white font-semibold text-[11px] hover:opacity-90 cursor-pointer"
                              >
                                Open TV Preview
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ===================================================================== */}
          {/* DEDICATED TAB: CHANNELS & PACKAGES (IPTV Lineup & Room Entitlements)  */}
          {/* ===================================================================== */}
          {activeTab === 'channels' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">Channels & IPTV Packages — {activeProperty.name}</h1>
                  <p className="text-xs text-[var(--cms-text-secondary)]">
                    Manage licensed HLS/DASH live TV channels, provider feed contracts, and room-tier package entitlements.
                  </p>
                </div>
                <button
                  onClick={() => setTvModalEndpointId(propEndpoints[0]?.id || 'E-01')}
                  className="px-3.5 py-2 rounded-xl bg-[var(--brand-indigo)] hover:bg-[#3B27EB] text-white font-semibold text-xs inline-flex items-center gap-1.5 shadow-sm cursor-pointer self-start sm:self-auto"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Test Live EPG on TV</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-[var(--cms-surface)] border border-[var(--cms-divider)] space-y-1">
                  <div className="text-xs font-bold text-emerald-700 dark:text-emerald-300">Package Tier 1 · PKG-BASIC</div>
                  <div className="text-lg font-extrabold">Standard Rooms</div>
                  <p className="text-xs text-[var(--cms-text-secondary)]">
                    Includes National News, Nusantara Culture, and Hotel Concierge channels.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-[var(--cms-surface)] border border-[var(--cms-divider)] space-y-1">
                  <div className="text-xs font-bold text-blue-700 dark:text-blue-300">Package Tier 2 · PKG-INTL</div>
                  <div className="text-lg font-extrabold">Deluxe Rooms</div>
                  <p className="text-xs text-[var(--cms-text-secondary)]">
                    Adds Global Financial News, NHK World Japan, and international entertainment.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-[var(--cms-surface)] border border-[var(--cms-divider)] space-y-1">
                  <div className="text-xs font-bold text-purple-700 dark:text-purple-300">Package Tier 3 · PKG-SPORTS</div>
                  <div className="text-lg font-extrabold">Executive Suites</div>
                  <p className="text-xs text-[var(--cms-text-secondary)]">
                    Unlocks Premier Sports HD 1 &amp; 2 and full 4K hospitality showcase feeds.
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[var(--cms-surface)] border border-[var(--cms-divider)] overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-[var(--cms-divider)] text-[var(--cms-text-secondary)] font-semibold">
                      <th className="py-2.5 pr-4">CH #</th>
                      <th className="py-2.5 px-4">Channel Name</th>
                      <th className="py-2.5 px-4">Category & Language</th>
                      <th className="py-2.5 px-4">Package ID</th>
                      <th className="py-2.5 px-4">Now Playing EPG</th>
                      <th className="py-2.5 pl-4">Stream Feed</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--cms-divider)]">
                    {data.channels.map((ch) => (
                      <tr key={ch.id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
                        <td className="py-3 pr-4 font-mono-tabular font-bold text-sm">CH {ch.number}</td>
                        <td className="py-3 px-4 font-bold">{ch.name}</td>
                        <td className="py-3 px-4 text-[var(--cms-text-secondary)]">
                          {ch.category} · {ch.language}
                        </td>
                        <td className="py-3 px-4 font-mono-tabular font-semibold">{ch.packageId}</td>
                        <td className="py-3 px-4">
                          <div className="font-medium">{ch.currentProgram.en}</div>
                          <div className="text-[11px] text-[var(--cms-text-secondary)]">{ch.programTime}</div>
                        </td>
                        <td className="py-3 pl-4 font-mono-tabular text-[11px] text-emerald-700 dark:text-emerald-300 font-semibold">
                          {ch.providerId} · Ready
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* DEDICATED TAB: TENANTS & ISPs (Multi-Tenant Hierarchy & Onboarding)   */}
          {/* ===================================================================== */}
          {activeTab === 'tenants' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[var(--brand-indigo)] dark:text-[#C7B9FF]">
                    {currentRole.category === 'GOJJA_ADMIN'
                      ? 'TIER 1 · GOJJA PLATFORM HQ GOVERNANCE'
                      : `TIER 2 · ISP PARTNER CONSOLE (${currentUser.partnerId})`}
                  </div>
                  <h1 className="text-2xl font-bold tracking-tight mt-0.5">
                    Multi-Tenant Properties & ISP Reseller Hierarchy
                  </h1>
                  <p className="text-xs text-[var(--cms-text-secondary)]">
                    Onboard ISP Reseller Partners and Hospitality Property Tenants with automatic starter rooms, TV endpoints, and scoped login accounts.
                  </p>
                </div>
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span className="text-xs font-mono-tabular text-[var(--cms-text-secondary)]">
                    Active Actor: <strong className="text-[var(--cms-text)]">{currentUser.name}</strong> ({currentRole.id})
                  </span>
                </div>
              </div>

              {/* Hierarchy KPI Summary */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-[var(--cms-surface)] border border-[var(--cms-divider)]">
                  <div className="text-xs text-[var(--cms-text-secondary)]">ISP Reseller Partners</div>
                  <div className="text-2xl font-extrabold font-mono-tabular mt-1">{data.partners.length}</div>
                  <div className="text-[11px] text-[var(--cms-text-secondary)] mt-1">
                    {currentUser.partnerId ? `Scoped to ${currentUser.partnerId}` : 'Global platform scope'}
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-[var(--cms-surface)] border border-[var(--cms-divider)]">
                  <div className="text-xs text-[var(--cms-text-secondary)]">Tenant Properties in Scope</div>
                  <div className="text-2xl font-extrabold font-mono-tabular text-[var(--brand-indigo)] dark:text-[#C7B9FF] mt-1">
                    {data.properties.length}
                  </div>
                  <div className="text-[11px] text-[var(--cms-text-secondary)] mt-1">
                    {data.customers.length} Customer Organizations
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-[var(--cms-surface)] border border-[var(--cms-divider)]">
                  <div className="text-xs text-[var(--cms-text-secondary)]">Contracted TV Seats</div>
                  <div className="text-2xl font-extrabold font-mono-tabular text-emerald-600 dark:text-emerald-400 mt-1">
                    {kpis.totalContractedSeats}
                  </div>
                  <div className="text-[11px] text-[var(--cms-text-secondary)] mt-1">
                    {kpis.totalAllocatedSeats} allocated · {kpis.totalAvailableSeats} available
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-[var(--cms-surface)] border border-[var(--cms-divider)]">
                  <div className="text-xs text-[var(--cms-text-secondary)]">Provisioned Login Accounts</div>
                  <div className="text-2xl font-extrabold font-mono-tabular mt-1">
                    {bootstrap.userAccounts.length}
                  </div>
                  <div className="text-[11px] text-[var(--cms-text-secondary)] mt-1">
                    Across 16 RBAC personas
                  </div>
                </div>
              </div>

              {/* Onboarding Forms Grid: 1) Add ISP Partner (GOJJA Admin only) + 2) Add Tenant Property (GOJJA Admin & ISP Admin) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Form: Add New ISP Partner (Visible to GOJJA Platform Owner/Admin) */}
                {currentRole.permissions.includes('partners.manage') && (
                  <div className="lg:col-span-5 p-5 rounded-2xl bg-[var(--cms-surface)] border border-[var(--cms-divider)] space-y-4">
                    <div>
                      <div className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--brand-indigo)] dark:text-[#C7B9FF]">
                        STEP 1 · PLATFORM OWNER ACTION
                      </div>
                      <h2 className="text-base font-bold mt-0.5">Add New ISP Reseller Partner</h2>
                      <p className="text-xs text-[var(--cms-text-secondary)]">
                        Provisions a new ISP Partner organization and automatically creates an <code className="font-mono-tabular">R-08 ISP Partner Admin</code> login account.
                      </p>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="block font-semibold mb-1">ISP Partner Organization Name</label>
                        <input
                          type="text"
                          value={newIspName}
                          onChange={(e) => setNewIspName(e.target.value)}
                          placeholder="e.g., Gamma Fiber Hospitality"
                          className="w-full px-3 py-2 rounded-xl bg-[var(--cms-bg)] border border-[var(--cms-divider)]"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-semibold mb-1">Operating Region</label>
                          <input
                            type="text"
                            value={newIspRegion}
                            onChange={(e) => setNewIspRegion(e.target.value)}
                            placeholder="Bali & Nusa Tenggara"
                            className="w-full px-3 py-2 rounded-xl bg-[var(--cms-bg)] border border-[var(--cms-divider)]"
                          />
                        </div>
                        <div>
                          <label className="block font-semibold mb-1">ISP Admin Full Name</label>
                          <input
                            type="text"
                            value={newIspAdminName}
                            onChange={(e) => setNewIspAdminName(e.target.value)}
                            placeholder="e.g., Putu Wijaya"
                            className="w-full px-3 py-2 rounded-xl bg-[var(--cms-bg)] border border-[var(--cms-divider)]"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block font-semibold mb-1">ISP Admin Login Email</label>
                        <input
                          type="email"
                          value={newIspEmail}
                          onChange={(e) => setNewIspEmail(e.target.value)}
                          placeholder="admin@gammafiber.net.id"
                          className="w-full px-3 py-2 rounded-xl bg-[var(--cms-bg)] border border-[var(--cms-divider)]"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            const res = await apiCall('/api/partners/create', {
                              method: 'POST',
                              body: JSON.stringify({
                                name: newIspName,
                                region: newIspRegion,
                                contactEmail: newIspEmail,
                                adminName: newIspAdminName,
                              }),
                            });
                            setNewIspName('');
                            setNewIspEmail('');
                            setNewIspAdminName('');
                            await fetchBootstrap();
                            if (res.partner?.id) {
                              setNewTenantPartnerId(res.partner.id);
                            }
                            showNotice('success', res.message);
                          } catch (err: unknown) {
                            showNotice('error', err instanceof Error ? err.message : 'Failed to create ISP Partner');
                          }
                        }}
                        className="w-full py-2.5 px-4 rounded-xl bg-[var(--brand-indigo)] hover:bg-[#3B27EB] text-white font-semibold text-xs shadow-sm cursor-pointer transition-colors"
                      >
                        + Create ISP Partner &amp; Auto-Provision ISP Admin Login
                      </button>
                    </div>
                  </div>
                )}

                {/* Right Form: Onboard New Tenant Property (Available to GOJJA Admin & ISP Partner Admin) */}
                {currentRole.permissions.includes('properties.manage') && (
                  <div
                    className={`${
                      currentRole.permissions.includes('partners.manage') ? 'lg:col-span-7' : 'lg:col-span-12'
                    } p-5 rounded-2xl bg-[var(--cms-surface)] border border-[var(--cms-divider)] space-y-4`}
                  >
                    <div>
                      <div className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                        {currentUser.partnerId
                          ? `STEP 2 · ISP PARTNER (${currentUser.partnerId}) DOWNSTREAM TENANT ONBOARDING`
                          : 'STEP 2 · ONBOARD NEW TENANT PROPERTY (DIRECT OR UNDER ISP)'}
                      </div>
                      <h2 className="text-base font-bold mt-0.5">Onboard New Hospitality Property Tenant</h2>
                      <p className="text-xs text-[var(--cms-text-secondary)]">
                        Automatically provisions the Property workspace, TV seat license, <strong>3 starter rooms (101, 102, 201) with online TVs</strong>, and default <strong>Property Manager (<code className="font-mono-tabular">R-11</code>) &amp; Front Office (<code className="font-mono-tabular">R-13</code>)</strong> login accounts.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                      <div>
                        <label className="block font-semibold mb-1">Property / Hotel Name</label>
                        <input
                          type="text"
                          value={newTenantName}
                          onChange={(e) => setNewTenantName(e.target.value)}
                          placeholder="e.g., Resort Mandala Ubud"
                          className="w-full px-3 py-2 rounded-xl bg-[var(--cms-bg)] border border-[var(--cms-divider)]"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold mb-1">City / Destination</label>
                        <input
                          type="text"
                          value={newTenantCity}
                          onChange={(e) => setNewTenantCity(e.target.value)}
                          placeholder="Ubud, Bali"
                          className="w-full px-3 py-2 rounded-xl bg-[var(--cms-bg)] border border-[var(--cms-divider)]"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold mb-1">Managing ISP / Route</label>
                        {currentUser.roleId === 'R-08' ? (
                          <input
                            type="text"
                            disabled
                            value={`${currentUser.partnerId} (Locked to Your ISP)`}
                            className="w-full px-3 py-2 rounded-xl bg-[var(--cms-bg)] border border-[var(--cms-divider)] opacity-75 font-mono-tabular"
                          />
                        ) : (
                          <select
                            value={newTenantPartnerId}
                            onChange={(e) => setNewTenantPartnerId(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-[var(--cms-bg)] border border-[var(--cms-divider)]"
                          >
                            {data.partners.map((isp) => (
                              <option key={isp.id} value={isp.id}>
                                {isp.id} · {isp.name} (ISP Reseller)
                              </option>
                            ))}
                            <option value="DIRECT">DIRECT · Direct to GOJJA HQ</option>
                          </select>
                        )}
                      </div>
                      <div>
                        <label className="block font-semibold mb-1">Contracted TV Seats</label>
                        <input
                          type="number"
                          min={3}
                          max={500}
                          value={newTenantSeats}
                          onChange={(e) => setNewTenantSeats(Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl bg-[var(--cms-bg)] border border-[var(--cms-divider)] font-mono-tabular"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold mb-1">Property Manager Name</label>
                        <input
                          type="text"
                          value={newTenantAdminName}
                          onChange={(e) => setNewTenantAdminName(e.target.value)}
                          placeholder="e.g., Dewi Lestari"
                          className="w-full px-3 py-2 rounded-xl bg-[var(--cms-bg)] border border-[var(--cms-divider)]"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold mb-1">Property Manager Login Email</label>
                        <input
                          type="email"
                          value={newTenantAdminEmail}
                          onChange={(e) => setNewTenantAdminEmail(e.target.value)}
                          placeholder="gm@mandalaubud.com"
                          className="w-full px-3 py-2 rounded-xl bg-[var(--cms-bg)] border border-[var(--cms-divider)]"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                      <div className="text-[11px] text-[var(--cms-text-secondary)]">
                        Guest Wi-Fi SSID auto-configured · Starter rooms <span className="font-mono-tabular font-semibold">101, 102, 201</span> &amp; TV endpoints ready on creation.
                      </div>
                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            const res = await apiCall('/api/tenants/create', {
                              method: 'POST',
                              body: JSON.stringify({
                                propertyName: newTenantName,
                                city: newTenantCity,
                                partnerId: currentUser.roleId === 'R-08' ? currentUser.partnerId : newTenantPartnerId,
                                seats: newTenantSeats,
                                wifiSsid: newTenantWifi || undefined,
                                adminName: newTenantAdminName,
                                adminEmail: newTenantAdminEmail,
                              }),
                            });
                            setNewTenantName('');
                            setNewTenantAdminName('');
                            setNewTenantAdminEmail('');
                            await fetchBootstrap();
                            if (res.property?.id) {
                              setSelectedPropertyId(res.property.id);
                            }
                            showNotice('success', res.message);
                          } catch (err: unknown) {
                            showNotice('error', err instanceof Error ? err.message : 'Failed to onboard tenant property');
                          }
                        }}
                        className="py-2.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-sm cursor-pointer transition-colors shrink-0"
                      >
                        + Onboard Property Tenant &amp; Provision Login
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Multi-Tenant Hierarchy Tree: ISP Partners -> Tenant Properties -> Scoped Logins */}
              <div className="p-5 rounded-2xl bg-[var(--cms-surface)] border border-[var(--cms-divider)] space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h2 className="text-base font-bold">End-to-End Multi-Tenant Hierarchy &amp; One-Click Tenant Login</h2>
                    <p className="text-xs text-[var(--cms-text-secondary)]">
                      Inspect every ISP Partner and downstream Property Tenant. Click any <strong>Login as...</strong> button to immediately enter that ISP or Property workspace with its scoped RBAC menu.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {data.partners.map((isp) => {
                    const ispProps = data.properties.filter((p) => p.partnerId === isp.id);
                    const ispUsers = bootstrap.userAccounts.filter(
                      (u) => u.partnerId === isp.id && (u.roleId === 'R-08' || u.roleId === 'R-09')
                    );
                    return (
                      <div
                        key={isp.id}
                        className="p-4 rounded-2xl bg-[var(--cms-bg)] border border-[var(--cms-divider)] space-y-4"
                      >
                        {/* ISP Header Row */}
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-[var(--cms-divider)]">
                          <div>
                            <div className="flex items-center gap-2 text-xs">
                              <span className="font-mono-tabular font-extrabold text-[var(--brand-indigo)] dark:text-[#C7B9FF]">
                                {isp.id}
                              </span>
                              <span>·</span>
                              <span className="font-bold text-sm">{isp.name}</span>
                              <span>·</span>
                              <span className="text-emerald-700 dark:text-emerald-300 font-semibold">{isp.status}</span>
                            </div>
                            <div className="text-xs text-[var(--cms-text-secondary)] mt-0.5">
                              Region: {isp.region} · SLA: {isp.supportTier} · Contact: {isp.contactEmail} · Downstream Properties: {ispProps.length}
                            </div>
                          </div>

                          {/* Switch into ISP Admin / Installer */}
                          <div className="flex flex-wrap items-center gap-2">
                            {ispUsers.map((u) => (
                              <button
                                key={u.id}
                                onClick={async () => {
                                  await handleLoginSuccess(u, environmentId);
                                }}
                                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                                  u.alias === personaAlias
                                    ? 'bg-[var(--brand-indigo)] text-white border-[var(--brand-indigo)]'
                                    : 'bg-[var(--cms-surface)] text-[var(--cms-text)] border-[var(--cms-divider)] hover:border-[var(--brand-indigo)]'
                                }`}
                              >
                                Login as {u.roleId} · {u.name}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Downstream Properties under this ISP */}
                        {ispProps.length === 0 ? (
                          <div className="text-xs text-[var(--cms-text-secondary)] py-2">
                            No downstream properties onboarded under {isp.name} yet. Use the form above to add a property under {isp.id}.
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {ispProps.map((prop) => {
                              const sub = data.subscriptions.find((s) => s.propertyId === prop.id);
                              const pRooms = data.rooms.filter((r) => r.propertyId === prop.id);
                              const pEps = data.endpoints.filter((e) => e.propertyId === prop.id);
                              const propAccounts = bootstrap.userAccounts.filter(
                                (u) =>
                                  u.propertyIds.length === 1 &&
                                  u.propertyIds[0] === prop.id &&
                                  u.organizationId !== 'GOJJA-HQ' &&
                                  u.roleId !== 'R-08' &&
                                  u.roleId !== 'R-09'
                              );
                              return (
                                <div
                                  key={prop.id}
                                  className="p-3.5 rounded-xl bg-[var(--cms-surface)] border border-[var(--cms-divider)] flex flex-col justify-between gap-3"
                                >
                                  <div>
                                    <div className="flex items-center justify-between gap-2">
                                      <span className="font-mono-tabular font-bold text-xs text-[var(--brand-indigo)] dark:text-[#C7B9FF]">
                                        {prop.id} · {prop.city}
                                      </span>
                                      <span className="text-[11px] font-mono-tabular text-[var(--cms-text-secondary)]">
                                        {pRooms.length} Rooms · {pEps.length}/{sub?.seats ?? 12} TVs
                                      </span>
                                    </div>
                                    <div className="font-bold text-sm mt-0.5">{prop.name}</div>
                                    <div className="text-[11px] text-[var(--cms-text-secondary)] mt-0.5">
                                      Wi-Fi: <span className="font-mono-tabular">{prop.wifiSsid}</span> · Plan: {sub?.planName || 'Active'}
                                    </div>
                                  </div>

                                  <div className="pt-2 border-t border-[var(--cms-divider)] space-y-2">
                                    <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--cms-text-secondary)]">
                                      Property-Scoped Login Accounts:
                                    </div>
                                    <div className="flex flex-wrap items-center gap-1.5">
                                      {propAccounts.map((pa) => (
                                        <button
                                          key={pa.id}
                                          onClick={async () => {
                                            await handleLoginSuccess(pa, environmentId);
                                          }}
                                          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-colors cursor-pointer ${
                                            pa.alias === personaAlias
                                              ? 'bg-emerald-600 text-white border-emerald-600'
                                              : 'bg-[var(--cms-bg)] text-[var(--cms-text)] border-[var(--cms-divider)] hover:border-emerald-500'
                                          }`}
                                          title={`Login as ${pa.email} (Scoped only to ${prop.name})`}
                                        >
                                          Login {pa.roleId} · {pa.name.split(' (')[0]}
                                        </button>
                                      ))}
                                      <button
                                        onClick={() => {
                                          setSelectedPropertyId(prop.id);
                                          setActiveTab('rooms');
                                        }}
                                        className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-[var(--brand-indigo)]/10 text-[var(--brand-indigo)] dark:text-[#C7B9FF] hover:bg-[var(--brand-indigo)]/20 cursor-pointer"
                                      >
                                        Manage Rooms →
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Direct Customer Properties (Managed directly by GOJJA HQ without ISP Reseller) */}
                  {data.properties.some((p) => !p.partnerId) && (
                    <div className="p-4 rounded-2xl bg-[var(--cms-bg)] border border-[var(--cms-divider)] space-y-3">
                      <div className="text-xs font-bold uppercase tracking-wider text-[var(--cms-text-secondary)]">
                        DIRECT ENTERPRISE TENANTS (Managed Directly by GOJJA HQ · No ISP Intermediary)
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {data.properties
                          .filter((p) => !p.partnerId)
                          .map((prop) => {
                            const sub = data.subscriptions.find((s) => s.propertyId === prop.id);
                            const pRooms = data.rooms.filter((r) => r.propertyId === prop.id);
                            const pEps = data.endpoints.filter((e) => e.propertyId === prop.id);
                            const propAccounts = bootstrap.userAccounts.filter(
                              (u) =>
                                u.propertyIds.length === 1 &&
                                u.propertyIds[0] === prop.id &&
                                u.organizationId !== 'GOJJA-HQ'
                            );
                            return (
                              <div
                                key={prop.id}
                                className="p-3.5 rounded-xl bg-[var(--cms-surface)] border border-[var(--cms-divider)] flex flex-col justify-between gap-3"
                              >
                                <div>
                                  <div className="flex items-center justify-between gap-2">
                                    <span className="font-mono-tabular font-bold text-xs text-[var(--brand-indigo)] dark:text-[#C7B9FF]">
                                      {prop.id} · DIRECT · {prop.city}
                                    </span>
                                    <span className="text-[11px] font-mono-tabular text-[var(--cms-text-secondary)]">
                                      {pRooms.length} Rooms · {pEps.length}/{sub?.seats ?? 6} TVs
                                    </span>
                                  </div>
                                  <div className="font-bold text-sm mt-0.5">{prop.name}</div>
                                </div>
                                <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-[var(--cms-divider)]">
                                  {propAccounts.map((pa) => (
                                    <button
                                      key={pa.id}
                                      onClick={async () => {
                                        await handleLoginSuccess(pa, environmentId);
                                      }}
                                      className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-[var(--cms-bg)] border border-[var(--cms-divider)] hover:border-emerald-500 cursor-pointer"
                                    >
                                      Login {pa.roleId} · {pa.name.split(' (')[0]}
                                    </button>
                                  ))}
                                  <button
                                    onClick={() => {
                                      setSelectedPropertyId(prop.id);
                                      setActiveTab('rooms');
                                    }}
                                    className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-[var(--brand-indigo)]/10 text-[var(--brand-indigo)] dark:text-[#C7B9FF] cursor-pointer"
                                  >
                                    Manage Rooms →
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* DEDICATED TAB: USERS & ACCESS (16-Role RBAC Matrix & Active Persona)  */}
          {/* ===================================================================== */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Users &amp; Role-Based Access Control (RBAC)</h1>
                <p className="text-xs text-[var(--cms-text-secondary)]">
                  Switch active session role across all 16 hospitality &amp; platform personas (including newly onboarded ISP &amp; Property accounts). Sidebar menus filter dynamically per role.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[var(--cms-surface)] border border-[var(--cms-divider)] space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h2 className="text-base font-bold">
                      Active Session Persona: {currentUser.name} ({currentRole.id} · {currentRole.name})
                    </h2>
                    <p className="text-xs text-[var(--cms-text-secondary)]">{currentRole.description}</p>
                    <p className="text-[11px] text-[var(--brand-indigo)] dark:text-[#C7B9FF] font-mono-tabular mt-1">
                      Visible Sidebar Menus ({allowedTabs.length}): {allowedTabs.join(' · ')}
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[var(--nav-selected-bg)] text-[var(--nav-selected-fg)] font-mono-tabular font-bold text-xs self-start">
                    Category: {currentRole.category}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
                  {bootstrap.userAccounts.map((acc) => {
                    const roleDef = bootstrap.rolesCatalog.find((r) => r.id === acc.roleId);
                    const isSelected = acc.alias === personaAlias;
                    const accMenus = getAllowedTabsForRole(acc.roleId);
                    return (
                      <button
                        key={acc.id}
                        onClick={async () => {
                          await handleLoginSuccess(acc, environmentId);
                        }}
                        className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                          isSelected
                            ? 'border-[var(--brand-indigo)] bg-[var(--nav-selected-bg)] shadow-xs'
                            : 'border-[var(--cms-divider)] bg-[var(--cms-bg)] hover:border-[var(--brand-indigo)]/50'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between text-xs font-bold">
                            <span className="font-mono-tabular text-[var(--brand-indigo)] dark:text-[#C7B9FF]">{acc.roleId}</span>
                            <span className="text-[10px] text-[var(--cms-text-secondary)]">{acc.badgeLabel}</span>
                          </div>
                          <div className="font-bold text-xs mt-1">{acc.name}</div>
                          <div className="text-[10px] font-mono-tabular text-[var(--cms-text-secondary)] mt-0.5">
                            {acc.email} · Scope: {acc.propertyIds.join(', ') || acc.partnerId || 'GLOBAL'}
                          </div>
                          <div className="text-[11px] text-[var(--cms-text-secondary)] line-clamp-2 mt-1">
                            {roleDef?.description || acc.email}
                          </div>
                        </div>
                        <div className="pt-1.5 border-t border-[var(--cms-divider)] text-[10px] font-mono-tabular text-[var(--cms-text-secondary)]">
                          Menus ({accMenus.length}): {accMenus.slice(0, 4).join(', ')}
                          {accMenus.length > 4 ? ` +${accMenus.length - 4}` : ''}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* DEDICATED TAB: SETTINGS (Property Configuration & Environment Mode)   */}
          {/* ===================================================================== */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Property & Workspace Settings — {activeProperty.name}</h1>
                <p className="text-xs text-[var(--cms-text-secondary)]">
                  Configure property network parameters, guest Wi-Fi onboarding, 2-language CMS vs. 4-language SmartTV localization, and runtime environment mode.
                </p>
              </div>

              {/* Language Architecture Control Card (2-Locale CMS vs 4-Locale SmartTV) */}
              <div className="p-6 rounded-2xl bg-[var(--cms-surface)] border border-[var(--cms-divider)] space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--cms-divider)] pb-3">
                  <div>
                    <h2 className="text-base font-bold flex items-center gap-2">
                      <Globe className="w-4 h-4 text-[#0050F5]" />
                      <span>{ct.tvLocaleControlTitle}</span>
                    </h2>
                    <p className="text-xs text-[var(--cms-text-secondary)] mt-0.5">
                      {ct.tvLocaleControlSub}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                  {/* Left: 2-Language Login & CMS Dashboard UI */}
                  <div className="p-4 rounded-xl bg-[var(--cms-bg)] border border-[var(--cms-divider)] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm">1. Login & CMS Dashboard UI (2 Languages)</span>
                      <span className="px-2 py-0.5 rounded-md bg-[#0050F5]/10 text-[#0050F5] dark:text-[#C7B9FF] font-mono-tabular font-bold text-[10px]">
                        Active: {cmsLocale.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-[11px] text-[var(--cms-text-secondary)]">
                      Halaman Login dan Dashboard Admin hanya menggunakan 2 bahasa operasional: <strong>Bahasa Indonesia (ID)</strong> dan <strong>English (EN)</strong>.
                    </p>
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => handleChangeCmsLocale('id')}
                        className={`py-2.5 px-3 rounded-xl font-bold border transition-all cursor-pointer ${
                          cmsLocale === 'id'
                            ? 'bg-[#0050F5] text-white border-[#0050F5] shadow-xs'
                            : 'bg-[var(--cms-surface)] text-[var(--cms-text)] border-[var(--cms-divider)]'
                        }`}
                      >
                        🇮🇩 Bahasa Indonesia (ID)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleChangeCmsLocale('en')}
                        className={`py-2.5 px-3 rounded-xl font-bold border transition-all cursor-pointer ${
                          cmsLocale === 'en'
                            ? 'bg-[#0050F5] text-white border-[#0050F5] shadow-xs'
                            : 'bg-[var(--cms-surface)] text-[var(--cms-text)] border-[var(--cms-divider)]'
                        }`}
                      >
                        🇬🇧 English (EN)
                      </button>
                    </div>
                  </div>

                  {/* Right: 4-Language SmartTV Guest Interface Setup */}
                  <div className="p-4 rounded-xl bg-[var(--cms-bg)] border border-[var(--cms-divider)] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm">2. SmartTV Guest Interface (4 Languages)</span>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-mono-tabular font-bold text-[10px]">
                        TV Default: {(activeProperty.defaultLocale || brandLocaleTab).toUpperCase()}
                      </span>
                    </div>
                    <p className="text-[11px] text-[var(--cms-text-secondary)]">
                      Tampilan layar TV tamu di kamar mendukung 4 bahasa penuh: <strong>English (EN)</strong>, <strong>Indonesia (ID)</strong>, <strong>Chinese (中文)</strong>, dan <strong>Japanese (日本語)</strong>.
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                      {(
                        [
                          { code: 'en', label: 'EN · English' },
                          { code: 'id', label: 'ID · Indonesia' },
                          { code: 'zh-CN', label: '中文 · Chinese' },
                          { code: 'ja-JP', label: '日本語 · Japanese' },
                        ] as Array<{ code: GuestLocale; label: string }>
                      ).map((loc) => (
                        <button
                          key={loc.code}
                          type="button"
                          onClick={async () => {
                            try {
                              setBrandLocaleTab(loc.code);
                              const res = await apiCall('/api/stays/locale', {
                                method: 'POST',
                                body: JSON.stringify({
                                  propertyId: activeProperty.id,
                                  locale: loc.code,
                                  updatePropertyDefault: true,
                                  applyToAllRooms: true,
                                }),
                              });
                              await fetchBootstrap();
                              showNotice('success', res.message || `SmartTV language set to ${loc.label}`);
                            } catch (err: unknown) {
                              showNotice('error', err instanceof Error ? err.message : 'Failed to update SmartTV locale');
                            }
                          }}
                          className={`py-2 px-2 rounded-xl font-bold border text-[11px] transition-all cursor-pointer ${
                            (activeProperty.defaultLocale || brandLocaleTab) === loc.code
                              ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                              : 'bg-[var(--cms-surface)] text-[var(--cms-text)] border-[var(--cms-divider)]'
                          }`}
                        >
                          {loc.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-[var(--cms-surface)] border border-[var(--cms-divider)] space-y-4">
                  <h2 className="text-base font-bold">Hospitality Property Profile</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-3.5 rounded-xl bg-[var(--cms-bg)] border border-[var(--cms-divider)]">
                      <div className="text-[var(--cms-text-secondary)]">Property Name</div>
                      <div className="font-bold text-sm mt-0.5">{activeProperty.name}</div>
                    </div>
                    <div className="p-3.5 rounded-xl bg-[var(--cms-bg)] border border-[var(--cms-divider)]">
                      <div className="text-[var(--cms-text-secondary)]">Location & Timezone</div>
                      <div className="font-bold text-sm mt-0.5">{activeProperty.city} ({activeProperty.timezone})</div>
                    </div>
                    <div className="p-3.5 rounded-xl bg-[var(--cms-bg)] border border-[var(--cms-divider)]">
                      <div className="text-[var(--cms-text-secondary)]">Guest Wi-Fi SSID</div>
                      <div className="font-mono-tabular font-bold text-sm mt-0.5">{activeProperty.wifiSsid}</div>
                    </div>
                    <div className="p-3.5 rounded-xl bg-[var(--cms-bg)] border border-[var(--cms-divider)]">
                      <div className="text-[var(--cms-text-secondary)]">Front Desk Dial Extension</div>
                      <div className="font-mono-tabular font-bold text-sm mt-0.5">Ext. {activeProperty.frontDeskExt}</div>
                    </div>
                  </div>
                  <div className="pt-2">
                    <button
                      onClick={() => setActiveTab('branding')}
                      className="px-4 py-2 rounded-xl bg-[var(--brand-indigo)] text-white font-semibold text-xs hover:opacity-90 cursor-pointer"
                    >
                      Open Brand Studio Theme Editor
                    </button>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-[var(--cms-surface)] border border-[var(--cms-divider)] space-y-4">
                  <h2 className="text-base font-bold">Workspace Runtime Environment</h2>
                  <p className="text-xs text-[var(--cms-text-secondary)]">
                    Switch between self-contained DEMO_SEED_ENV data or connect to a real local Android TV ADB connector in LIVE_LAB mode.
                  </p>
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      onClick={async () => {
                        setEnvironmentId('DEMO');
                        await fetchBootstrap(personaAlias, 'DEMO');
                        showNotice('info', 'Switched workspace runtime to DEMO_SEED_ENV.');
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-bold border cursor-pointer ${
                        environmentId === 'DEMO'
                          ? 'bg-[var(--brand-indigo)] text-white border-[var(--brand-indigo)]'
                          : 'bg-[var(--cms-bg)] text-[var(--cms-text)] border-[var(--cms-divider)]'
                      }`}
                    >
                      DEMO_SEED_ENV (Simulated Fleet)
                    </button>
                    <button
                      onClick={async () => {
                        setEnvironmentId('LIVE_LAB');
                        await fetchBootstrap(personaAlias, 'LIVE_LAB');
                        showNotice('info', 'Switched workspace runtime to LIVE_LAB.');
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-bold border cursor-pointer ${
                        environmentId === 'LIVE_LAB'
                          ? 'bg-[var(--brand-indigo)] text-white border-[var(--brand-indigo)]'
                          : 'bg-[var(--cms-bg)] text-[var(--cms-text)] border-[var(--cms-divider)]'
                      }`}
                    >
                      LIVE_LAB (Real Local Connector)
                    </button>
                  </div>
                  <div className="pt-2 border-t border-[var(--cms-divider)] flex items-center justify-between">
                    <span className="text-xs text-[var(--cms-text-secondary)]">
                      Restore all demo rooms, stays, and campaigns to factory seed:
                    </span>
                    <button
                      onClick={async () => {
                        await apiCall('/api/demo/reset', { method: 'POST' });
                        await fetchBootstrap();
                        showNotice('success', 'Reset DEMO workspace to pristine seed.');
                      }}
                      className="px-3.5 py-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 font-semibold text-xs hover:bg-rose-500/20 cursor-pointer"
                    >
                      Reset DEMO Data
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          </div>
        </main>
      </div>

      {/* Full-Screen 16:9 TV Guest App Modal when triggered */}
      {tvModalEndpointId && modalEndpoint && (
        <TvGuestAppView
                      {...tvExperienceBindings}
          forcedLocale={activeTab === 'branding' ? brandLocaleTab : modalStay?.locale || brandLocaleTab}
          onSelectLocale={async (loc) => {
            setBrandLocaleTab(loc);
            if (activeTab === 'branding') return;
            try {
              const res = await apiCall('/api/stays/locale', {
                method: 'POST',
                body: JSON.stringify({
                  propertyId: activeProperty.id,
                  roomId: modalRoom?.id,
                  stayId: modalStay?.id,
                  locale: loc,
                  updatePropertyDefault: !modalStay,
                }),
              });
              await fetchBootstrap();
              showNotice('success', res.message || `TV language updated to ${loc}.`);
            } catch {
              // ignore non-fatal
            }
          }}
          property={{
            ...activeProperty,
            defaultLocale: modalStay?.locale || brandLocaleTab,
            logoText: brandLogoText,
            logoSubtitle: brandLogoSubtitle,
            logoImageUrl: brandLogoImageUrl || undefined,
            heroMediaType: brandHeroMediaType,
            heroImageUrl: brandHeroImageUrl || activeProperty.heroImageUrl,
            heroVideoUrl: brandHeroVideoUrl || undefined,
            promoMediaType: brandPromoMediaType,
            promoMediaUrl: brandPromoMediaUrl || undefined,
            promoTitle: brandPromoTitle || undefined,
                        tvExperience: brandTvExperience,
            accentColor: brandAccentColor,
            primaryColor: brandPrimaryColor,
            welcomeHeadline: brandHeadline,
          }}
          room={modalRoom}
          endpoint={modalEndpoint}
          stay={modalStay}
          corporateGroup={modalGroup}
          channels={data.channels}
          campaigns={data.campaigns}
          marketplaceItems={data.marketplaceItems || []}

          onClose={() => setTvModalEndpointId(null)}
          onOpenChannelCheck={async (epId, chId) => {
            try {
              return await apiCall('/api/tv/open-channel', {
                method: 'POST',
                body: JSON.stringify({ endpointId: epId, channelId: chId }),
              });
            } catch (err: unknown) {
              return { allowed: false, code:err instanceof ApiRequestError?err.code:undefined, message: err instanceof Error ? err.message : 'Access restricted' };
            }
          }}
        />
      )}
    </div>
  );
}
