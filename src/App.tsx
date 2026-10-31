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
} from 'lucide-react';
import {
  EnvironmentId,
  GuestLocale,
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
} from './data/mockData';
import { GojjaWordmark, RollingKpiValue } from './components/GojjaWordmark';
import { TvGuestAppView } from './components/TvGuestAppModal';
import { DeviceDiscoveryView } from './components/DeviceDiscoveryView';
import { LoginLandingView } from './components/LoginLandingView';

type NavTabId =
  | 'overview'
  | 'rooms'
  | 'guests'
  | 'branding'
  | 'discovery'
  | 'tv-services'
  | 'campaigns'
  | 'updates'
  | 'analytics'
  | 'billing'
  | 'support-qa';

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

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('gojja_cms_theme');
    return saved === 'dark' ? 'dark' : 'light';
  });
  const [viewMode, setViewMode] = useState<'landing' | 'dashboard'>('landing');
  const [personaAlias, setPersonaAlias] = useState<string>('property-manager');
  const [environmentId, setEnvironmentId] = useState<EnvironmentId>('DEMO');
  const [activeTab, setActiveTab] = useState<NavTabId>('overview');
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>('P-01');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [bootstrap, setBootstrap] = useState<BootstrapPayload | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusBanner, setStatusBanner] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  // TV Guest App Modal state
  const [tvModalEndpointId, setTvModalEndpointId] = useState<string | null>(null);

  // Branding Editor local form state
  const [brandLogoText, setBrandLogoText] = useState<string>('HOTEL ARUNIKA');
  const [brandLogoSubtitle, setBrandLogoSubtitle] = useState<string>('YOGYAKARTA');
  const [brandAccentColor, setBrandAccentColor] = useState<string>('#DCC6A1');
  const [brandPrimaryColor, setBrandPrimaryColor] = useState<string>('#1E3A2F');
  const [brandLocaleTab, setBrandLocaleTab] = useState<GuestLocale>('en');
  const [brandHeadline, setBrandHeadline] = useState<Record<GuestLocale, string>>({
    id: 'Selamat malam',
    en: 'A Sanctuary in the Heart of Yogyakarta',
    'zh-CN': '欢迎下榻日惹阿鲁尼卡酒店',
    'ja-JP': 'ジョグジャカルタの静寂なサンクチュアリへようこそ',
  });

  // Room & Stay creation state
  const [newRoomCode, setNewRoomCode] = useState<string>('');
  const [newRoomClass, setNewRoomClass] = useState<'Standard' | 'Deluxe' | 'Suite' | 'Studio'>('Standard');
  const [checkInRoomId, setCheckInRoomId] = useState<string>('ROOM-201');
  const [checkInGuestName, setCheckInGuestName] = useState<string>('');
  const [checkInLocale, setCheckInLocale] = useState<GuestLocale>('id');
  const [checkInGroupId, setCheckInGroupId] = useState<string>('');

  // Finance Payment Verification form state
  const [paymentTxRef, setPaymentTxRef] = useState<string>('TRX-ALPHA-20261102-901');

  // Acceptance Test Runner state
  const [acceptanceReport, setAcceptanceReport] = useState<{
    executedAtUtc: string;
    summary: { totalChecked: number; passed: number; blockedHardware: number; failed: number };
    results: Array<{ id: string; suite: string; title: string; status: string; expected: string; actual: string }>;
  } | null>(null);

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

  const apiCall = useCallback(
    async (pathUrl: string, options: RequestInit = {}, overridePersona?: string, overrideEnv?: EnvironmentId) => {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'X-Gojja-Persona': overridePersona || personaAlias,
        'X-Gojja-Env': overrideEnv || environmentId,
        ...(options.headers as Record<string, string>),
      };
      const res = await fetch(pathUrl, { ...options, headers });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || data.code || 'Request denied by server policy');
      }
      return data;
    },
    [personaAlias, environmentId]
  );

  const fetchBootstrap = useCallback(
    async (overridePersona?: string, overrideEnv?: EnvironmentId) => {
      try {
        const payload: BootstrapPayload = await apiCall('/api/bootstrap', { method: 'GET' }, overridePersona, overrideEnv);
        setBootstrap(payload);
        // Ensure selectedPropertyId is within user's allowed properties
        const allowedProps = payload.data.properties;
        const propToUse =
          allowedProps.find((p) => p.id === selectedPropertyId) || allowedProps[0] || null;
        if (propToUse) {
          setSelectedPropertyId(propToUse.id);
          setBrandLogoText(propToUse.logoText);
          setBrandLogoSubtitle(propToUse.logoSubtitle);
          setBrandAccentColor(propToUse.accentColor);
          setBrandPrimaryColor(propToUse.primaryColor);
          setBrandHeadline(propToUse.welcomeHeadline);
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to load workspace';
        setStatusBanner({ type: 'error', text: msg });
      } finally {
        setLoading(false);
      }
    },
    [apiCall, selectedPropertyId]
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

  const handleLoginSuccess = async (account: UserAccount, env: EnvironmentId) => {
    setPersonaAlias(account.alias);
    setEnvironmentId(env);
    await fetchBootstrap(account.alias, env);
    if (account.roleId === 'R-16') {
      setTvModalEndpointId('E-01');
    } else if (account.roleId === 'R-09') {
      setActiveTab('discovery');
    } else if (account.roleId === 'R-05' || account.roleId === 'R-15') {
      setActiveTab('billing');
    } else if (account.roleId === 'R-12') {
      setActiveTab('branding');
    } else if (account.roleId === 'R-13') {
      setActiveTab('guests');
    } else if (account.roleId === 'R-14') {
      setActiveTab('analytics');
    } else {
      setActiveTab('overview');
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

  // TV Modal lookup
  const modalEndpoint = data.endpoints.find((e) => e.id === tvModalEndpointId) || propEndpoints[0] || data.endpoints[0];
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

  if (viewMode === 'landing') {
    return (
      <>
        <LoginLandingView
          userAccounts={bootstrap.userAccounts}
          rolesCatalog={bootstrap.rolesCatalog}
          theme={theme}
          onToggleTheme={handleToggleTheme}
          onLoginSuccess={handleLoginSuccess}
          onOpenTvShowcase={() => setTvModalEndpointId('E-01')}
        />
        {tvModalEndpointId && modalEndpoint && (
          <TvGuestAppView
            property={activeProperty}
            room={modalRoom}
            endpoint={modalEndpoint}
            stay={modalStay}
            corporateGroup={modalGroup}
            channels={data.channels}
            campaigns={data.campaigns}
            onClose={() => setTvModalEndpointId(null)}
            onOpenChannelCheck={async (epId, chId) => {
              try {
                return await apiCall('/api/tv/open-channel', {
                  method: 'POST',
                  body: JSON.stringify({ endpointId: epId, channelId: chId }),
                });
              } catch (err: unknown) {
                return { allowed: false, message: err instanceof Error ? err.message : 'Access restricted' };
              }
            }}
          />
        )}
      </>
    );
  }

  const navItems: Array<{ id: NavTabId; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'rooms', label: 'Rooms & TVs', icon: Tv },
    { id: 'guests', label: 'Guests', icon: Users },
    { id: 'branding', label: 'Branding', icon: Palette },
    { id: 'discovery', label: 'Device Discovery', icon: Radar },
    { id: 'tv-services', label: 'TV Services', icon: Radio },
    { id: 'campaigns', label: 'Campaigns', icon: Megaphone },
    { id: 'updates', label: 'Updates', icon: Bell },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'support-qa', label: 'Support & QA', icon: LifeBuoy },
  ];

  return (
    <div className="min-h-screen bg-[var(--cms-bg)] text-[var(--cms-text)] flex flex-col">
      {/* Top Shell Header (Matches 02 / PROPERTY OVERVIEW in Linen Hospitality Mockup) */}
      <header className="sticky top-0 z-30 h-[72px] px-4 md:px-6 bg-[var(--cms-header)] border-b border-[var(--cms-divider)] flex items-center justify-between gap-4">
        {/* Left: Wordmark + Property Context Switcher */}
        <div className="flex items-center gap-4 min-w-0">
          <button
            onClick={() => setViewMode('landing')}
            className="shrink-0 text-left"
            title="Return to Executive Landing & Login"
          >
            <GojjaWordmark size="sm" showDescriptor={true} variant={theme === 'dark' ? 'reverse' : 'color'} />
          </button>

          <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-[var(--cms-divider)]">
            <Building2 className="w-4 h-4 text-[var(--cms-text-secondary)] shrink-0" />
            <select
              value={activeProperty.id}
              onChange={(e) => {
                const pid = e.target.value;
                setSelectedPropertyId(pid);
                const p = data.properties.find((x) => x.id === pid);
                if (p) {
                  setBrandLogoText(p.logoText);
                  setBrandLogoSubtitle(p.logoSubtitle);
                  setBrandAccentColor(p.accentColor);
                  setBrandPrimaryColor(p.primaryColor);
                  setBrandHeadline(p.welcomeHeadline);
                }
              }}
              aria-label="Select active property scope"
              className="px-2.5 py-1.5 rounded-xl bg-[var(--cms-bg)] border border-[var(--cms-divider)] text-xs font-semibold cursor-pointer"
            >
              {data.properties.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.id})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Center: Global Search Input */}
        <div className="hidden lg:flex items-center flex-1 max-w-md relative">
          <Search className="w-4 h-4 text-[var(--cms-text-secondary)] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search rooms, guests, endpoints, channels..."
            className="w-full pl-9 pr-4 py-2 rounded-full bg-[var(--cms-bg)] border border-[var(--cms-divider)] text-xs focus:outline-2 focus:outline-[#0050F5]"
          />
        </div>

        {/* Right: Workspace Toggle + Persona Switcher + Theme Reveal Control */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* DEMO vs LIVE_LAB Mode Switcher */}
          <div className="hidden md:inline-flex items-center gap-1 p-1 rounded-xl bg-[var(--cms-bg)] border border-[var(--cms-divider)] text-[11px] font-semibold">
            <button
              onClick={async () => {
                setEnvironmentId('DEMO');
                await fetchBootstrap(personaAlias, 'DEMO');
                showNotice('info', 'Switched to DEMO workspace (seeded synthetic data).');
              }}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                environmentId === 'DEMO' ? 'bg-[#0050F5] text-white' : 'text-[var(--cms-text-secondary)]'
              }`}
            >
              DEMO
            </button>
            <button
              onClick={async () => {
                if (!currentUser.allowedEnvironments.includes('LIVE_LAB')) {
                  showNotice(
                    'error',
                    `Role ${currentRole.name} (${currentRole.id}) is not authorized for LIVE_LAB. Switch to Field Installer (R-09) or Property Manager (R-11).`
                  );
                  return;
                }
                setEnvironmentId('LIVE_LAB');
                await fetchBootstrap(personaAlias, 'LIVE_LAB');
                setActiveTab('discovery');
                showNotice('success', 'Switched to LIVE_LAB workspace (zero fake devices; real LAN/ADB execution).');
              }}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                environmentId === 'LIVE_LAB' ? 'bg-emerald-600 text-white' : 'text-[var(--cms-text-secondary)]'
              }`}
            >
              LIVE_LAB
            </button>
          </div>

          {/* 16-Role Persona Selector */}
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-[var(--cms-bg)] border border-[var(--cms-divider)]">
            <span className="w-6 h-6 rounded-full bg-[#EEF0FF] text-[#0050F5] font-bold text-[11px] flex items-center justify-center shrink-0">
              {currentUser.avatarInitials}
            </span>
            <select
              value={personaAlias}
              onChange={async (e) => {
                const nextAlias = e.target.value;
                const acc = bootstrap.userAccounts.find((u) => u.alias === nextAlias)!;
                const nextEnv =
                  environmentId === 'LIVE_LAB' && !acc.allowedEnvironments.includes('LIVE_LAB')
                    ? 'DEMO'
                    : environmentId;
                setPersonaAlias(nextAlias);
                setEnvironmentId(nextEnv);
                await fetchBootstrap(nextAlias, nextEnv);
                showNotice('info', `Switched active role to ${acc.roleId} — ${acc.badgeLabel} (${acc.name}).`);
              }}
              aria-label="Switch active role persona"
              className="bg-transparent text-xs font-semibold cursor-pointer focus:outline-none max-w-[155px] truncate"
            >
              {bootstrap.userAccounts.map((u) => (
                <option key={u.alias} value={u.alias} className="text-slate-900">
                  {u.roleId} · {u.badgeLabel}
                </option>
              ))}
            </select>
          </div>

          {/* Light / Warm Graphite Dark Mode Toggle */}
          <button
            onClick={handleToggleTheme}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--cms-bg)] border border-[var(--cms-divider)] text-xs hover:opacity-90 transition-all"
            title="Toggle Light / Warm Graphite Dark Mode"
          >
            <Sun className={`w-3.5 h-3.5 ${theme === 'light' ? 'text-amber-500 fill-amber-400' : 'text-[var(--cms-text-secondary)]'}`} />
            <Moon className={`w-3.5 h-3.5 ${theme === 'dark' ? 'text-[#C7B9FF] fill-[#C7B9FF]' : 'text-[var(--cms-text-secondary)]'}`} />
          </button>

          <button
            onClick={() => setViewMode('landing')}
            className="p-2 rounded-xl bg-[var(--cms-bg)] border border-[var(--cms-divider)] text-[var(--cms-text-secondary)] hover:text-[var(--cms-text)]"
            title="Return to Login & Role Showcase"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Workspace Body: Sidebar + Viewport */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Left Sidebar (Always Light White in Light Mode, Warm Graphite #4B4A47 in Dark Mode per UI/UX R1 §6.4) */}
        <aside className="w-full md:w-[240px] shrink-0 bg-[var(--cms-sidebar)] border-b md:border-b-0 md:border-r border-[var(--cms-divider)] p-4 flex flex-col justify-between">
          <nav className="flex md:flex-col gap-1 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  aria-current={isActive ? 'page' : undefined}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-300 whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-[var(--nav-selected-bg)] text-[var(--nav-selected-fg)]'
                      : 'text-[var(--cms-text-secondary)] hover:text-[var(--cms-text)] hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  {isActive && (
                    <span className="hidden md:block absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-[#0050F5] dark:bg-[#C7B9FF] transition-all duration-300" />
                  )}
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Bottom Sidebar Action: Launch TV Preview & Reset DEMO */}
          <div className="hidden md:flex flex-col gap-2 pt-4 border-t border-[var(--cms-divider)]">
            <button
              onClick={() => setTvModalEndpointId(propEndpoints[0]?.id || 'E-01')}
              className="w-full py-2.5 px-3 rounded-xl bg-[#0050F5] hover:bg-[#0040C8] text-white text-xs font-semibold inline-flex items-center justify-center gap-2 transition-colors"
            >
              <Tv className="w-3.5 h-3.5" />
              <span>Open Guest TV Preview</span>
            </button>

            {environmentId === 'DEMO' && (
              <button
                onClick={async () => {
                  await apiCall('/api/demo/reset', { method: 'POST' });
                  await fetchBootstrap();
                  showNotice('success', 'Restored DEMO workspace to clean initial seed (30 seats, 14 allocated, 16 available).');
                }}
                className="w-full py-2 px-3 rounded-xl bg-[var(--cms-bg)] hover:opacity-90 border border-[var(--cms-divider)] text-xs font-medium inline-flex items-center justify-center gap-1.5 text-[var(--cms-text-secondary)]"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset DEMO Seed</span>
              </button>
            )}

            <div className="p-2.5 rounded-xl bg-[var(--cms-bg)] text-[11px] text-[var(--cms-text-secondary)] space-y-0.5">
              <div className="font-semibold text-[var(--cms-text)]">
                {currentRole.id} · {currentRole.name}
              </div>
              <div className="font-mono-tabular">
                Scope: {currentUser.propertyIds.join(', ')} ({environmentId})
              </div>
            </div>
          </div>
        </aside>

        {/* Main Viewport Content */}
        <main className="flex-1 p-5 md:p-8 max-w-[1440px] w-full mx-auto space-y-6 overflow-x-hidden">
          {/* Global Status Toast / Feedback Banner */}
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
          {/* TAB 1: OVERVIEW (Matches 02 / PROPERTY OVERVIEW Light & 04 / Dark)    */}
          {/* ===================================================================== */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Page Title & Date Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Property overview</h1>
                  <p className="text-sm text-[var(--cms-text-secondary)] mt-0.5">
                    Welcome back, {currentUser.name}! Here’s what’s happening at {activeProperty.name}.
                  </p>
                </div>
                <div className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-[var(--cms-surface)] border border-[var(--cms-divider)] text-xs">
                  <Calendar className="w-4 h-4 text-[var(--cms-text-secondary)]" />
                  <div className="text-right">
                    <div className="text-[10px] text-[var(--cms-text-secondary)]">Demo Clock ({activeProperty.timezone})</div>
                    <div className="font-semibold font-mono-tabular">2 Nov 2026 · 14:00</div>
                  </div>
                </div>
              </div>

              {/* Property Hero Card + 4 Rolling KPI Cards (Exact Layout from 02 / PROPERTY OVERVIEW) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
                {/* Left Property Banner Card */}
                <div className="lg:col-span-5 relative rounded-2xl overflow-hidden border border-[var(--cms-divider)] bg-[var(--cms-surface)] min-h-[124px] flex items-center justify-between p-5">
                  <img
                    src={activeProperty.heroImageUrl}
                    alt={activeProperty.name}
                    referrerPolicy="no-referrer"
                    className="absolute inset-0 w-full h-full object-cover opacity-35"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[var(--cms-surface)] via-[var(--cms-surface)]/85 to-transparent" />
                  <div className="relative z-10 space-y-1">
                    <div className="text-lg font-bold leading-snug">{activeProperty.name}</div>
                    <div className="text-xs text-[var(--cms-text-secondary)]">{activeProperty.categoryLabel}</div>
                    <div className="text-[11px] font-mono-tabular text-[#0050F5] dark:text-[#C7B9FF] pt-1">
                      Sales Route: {activeProperty.partnerId ? `Reseller (${activeProperty.partnerId})` : 'Direct Customer'}
                    </div>
                  </div>
                  <button
                    onClick={() => setTvModalEndpointId(propEndpoints[0]?.id || 'E-01')}
                    className="relative z-10 w-28 h-16 rounded-xl overflow-hidden border-2 border-white/80 shadow-md shrink-0 group"
                    title="Click to launch interactive 16:9 TV Guest App"
                  >
                    <img
                      src={activeProperty.heroImageUrl}
                      alt="TV Preview"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/35 flex items-center justify-center">
                      <Play className="w-5 h-5 text-white fill-white" />
                    </div>
                  </button>
                </div>

                {/* Right 4 Rolling KPI Cards */}
                <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                  <div className="p-4 rounded-2xl bg-[var(--cms-surface)] border border-[var(--cms-divider)] flex flex-col justify-between">
                    <div className="flex items-center justify-between text-xs text-[var(--cms-text-secondary)]">
                      <span>Licensed TVs</span>
                      <Tv className="w-4 h-4 text-[#0050F5]" />
                    </div>
                    <div className="text-2xl md:text-3xl font-bold mt-2">
                      <RollingKpiValue value={propSubscription?.seats || 12} />
                    </div>
                    <div className="text-[11px] text-[var(--cms-text-secondary)] mt-1">
                      Global Pool: {kpis.totalContractedSeats} seats
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[var(--cms-surface)] border border-[var(--cms-divider)] flex flex-col justify-between">
                    <div className="flex items-center justify-between text-xs text-[var(--cms-text-secondary)]">
                      <span>Assigned</span>
                      <Layers className="w-4 h-4 text-[#4F3FE5]" />
                    </div>
                    <div className="text-2xl md:text-3xl font-bold mt-2">
                      <RollingKpiValue value={propEndpoints.length} />
                    </div>
                    <div className="text-[11px] text-[var(--cms-text-secondary)] mt-1">
                      Global Allocated: {kpis.totalAllocatedSeats} ({kpis.totalAvailableSeats} free)
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[var(--cms-surface)] border border-[var(--cms-divider)] flex flex-col justify-between">
                    <div className="flex items-center justify-between text-xs text-[var(--cms-text-secondary)]">
                      <span>Online</span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="text-2xl md:text-3xl font-bold mt-2 text-emerald-700 dark:text-emerald-300">
                      <RollingKpiValue value={propOnlineCount} />
                    </div>
                    <div className="text-[11px] text-[var(--cms-text-secondary)] mt-1">
                      Global Online: {kpis.onlineEndpointsCount} TVs
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[var(--cms-surface)] border border-[var(--cms-divider)] flex flex-col justify-between">
                    <div className="flex items-center justify-between text-xs text-[var(--cms-text-secondary)]">
                      <span>Offline</span>
                      <AlertTriangle className="w-4 h-4 text-rose-600" />
                    </div>
                    <div className="text-2xl md:text-3xl font-bold mt-2 text-rose-700 dark:text-rose-300">
                      <RollingKpiValue value={propOfflineCount} />
                    </div>
                    <div className="text-[11px] text-[var(--cms-text-secondary)] mt-1">
                      Global Offline: {kpis.offlineEndpointsCount} TVs
                    </div>
                  </div>
                </div>
              </div>

              {/* Middle Row: SVG Animated Playback Trend Chart + Updates Awaiting Approval */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left: Playback Trend SVG Line Chart (900ms stroke-dasharray reveal) */}
                <div className="lg:col-span-7 p-5 rounded-2xl bg-[var(--cms-surface)] border border-[var(--cms-divider)] flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-base font-bold">Playback trend</h2>
                      <p className="text-xs text-[var(--cms-text-secondary)]">
                        Verified technical playback starts & session minutes (Proof of play ≠ human viewers — BR19)
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-lg bg-[var(--cms-bg)] border border-[var(--cms-divider)] text-xs font-medium">
                      Last 7 days
                    </span>
                  </div>

                  {/* SVG Line Chart */}
                  <div className="w-full h-48 relative">
                    <svg viewBox="0 0 600 170" className="w-full h-full overflow-visible">
                      <defs>
                        <linearGradient id="gojjaChartFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="var(--chart-primary)" stopOpacity="0.28" />
                          <stop offset="100%" stopColor="var(--chart-primary)" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      {/* Horizontal grid lines */}
                      {[25, 65, 105, 145].map((y, idx) => (
                        <g key={idx}>
                          <line x1="36" y1={y} x2="580" y2={y} stroke="var(--cms-divider)" strokeDasharray="3 3" />
                          <text
                            x="4"
                            y={y + 4}
                            fill="var(--cms-text-secondary)"
                            fontSize="10"
                            fontFamily="JetBrains Mono, monospace"
                          >
                            {150 - idx * 50}
                          </text>
                        </g>
                      ))}

                      {/* Area fill */}
                      <path
                        d="M 55 110 L 140 82 L 225 60 L 310 78 L 395 48 L 480 56 L 565 25 L 565 145 L 55 145 Z"
                        fill="url(#gojjaChartFill)"
                      />

                      {/* Animated Curve */}
                      <path
                        d="M 55 110 L 140 82 L 225 60 L 310 78 L 395 48 L 480 56 L 565 25"
                        fill="none"
                        stroke="var(--chart-primary)"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="animate-chart-line"
                      />

                      {/* Data points & X-axis labels */}
                      {[
                        { x: 55, y: 110, label: '25 Oct', val: 48 },
                        { x: 140, y: 82, label: '26 Oct', val: 76 },
                        { x: 225, y: 60, label: '27 Oct', val: 98 },
                        { x: 310, y: 78, label: '28 Oct', val: 82 },
                        { x: 395, y: 48, label: '29 Oct', val: 112 },
                        { x: 480, y: 56, label: '30 Oct', val: 105 },
                        { x: 565, y: 25, label: '31 Oct', val: 138 },
                      ].map((pt, i) => (
                        <g key={i}>
                          <circle
                            cx={pt.x}
                            cy={pt.y}
                            r="4.5"
                            fill="var(--cms-surface)"
                            stroke="var(--chart-primary)"
                            strokeWidth="2.5"
                          />
                          <text
                            x={pt.x}
                            y="164"
                            textAnchor="middle"
                            fill="var(--cms-text-secondary)"
                            fontSize="10"
                            fontFamily="JetBrains Mono, monospace"
                          >
                            {pt.label}
                          </text>
                        </g>
                      ))}
                    </svg>
                  </div>
                </div>

                {/* Right: Updates Awaiting Approval Card */}
                <div className="lg:col-span-5 p-5 rounded-2xl bg-[var(--cms-surface)] border border-[var(--cms-divider)] flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <h2 className="text-base font-bold">Updates awaiting approval</h2>
                      <Bell className="w-4 h-4 text-[#0050F5] dark:text-[#C7B9FF]" />
                    </div>
                    <p className="text-xs text-[var(--cms-text-secondary)] mt-1">
                      Requires both GOJJA Technical Approval and Property Window Permission + Room Readiness (BR06 / BR14).
                    </p>

                    <div className="mt-4 space-y-2.5 text-sm">
                      <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--cms-bg)]">
                        <span className="font-semibold">Ready for review (REL-01 / REL-02)</span>
                        <span className="font-mono-tabular font-bold text-[#0050F5] dark:text-[#C7B9FF]">
                          {data.releases.length} releases
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--cms-bg)]">
                        <span className="font-semibold">Deferred / Awaiting Room Readiness</span>
                        <span className="font-mono-tabular font-bold text-amber-600 dark:text-amber-300">
                          {data.updateJobs.filter((j) => j.stage !== 'Healthy').length} endpoints
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab('updates')}
                    className="w-full py-3 px-4 rounded-xl bg-[#0050F5] hover:bg-[#0040C8] text-white text-xs font-semibold inline-flex items-center justify-center gap-2 transition-colors"
                  >
                    <span>Review update</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Bottom Row: Active Campaigns + Rooms & TVs Table */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Active Campaigns Card */}
                <div className="lg:col-span-6 p-5 rounded-2xl bg-[var(--cms-surface)] border border-[var(--cms-divider)] space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-base font-bold">Active campaigns</h2>
                    <button
                      onClick={() => setActiveTab('campaigns')}
                      className="text-xs font-semibold text-[var(--cms-link)] hover:underline"
                    >
                      Manage all
                    </button>
                  </div>

                  <div className="space-y-3">
                    {propCampaigns.slice(0, 2).map((cmp) => (
                      <div
                        key={cmp.id}
                        onClick={() => setActiveTab('campaigns')}
                        className="p-3.5 rounded-xl bg-[var(--cms-bg)] border border-[var(--cms-divider)] flex items-center justify-between gap-3 cursor-pointer hover:border-[#0050F5] transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={cmp.imageUrl}
                            alt={cmp.name}
                            referrerPolicy="no-referrer"
                            className="w-14 h-11 rounded-lg object-cover shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="text-sm font-bold truncate">{cmp.name}</div>
                            <div className="text-xs text-[var(--cms-text-secondary)]">
                              1 Nov – 30 Nov 2026 · {cmp.placement} · {cmp.totalPlaySeconds}s played
                            </div>
                          </div>
                        </div>
                        <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 shrink-0">
                          {cmp.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Rooms & TVs Quick Status Table */}
                <div className="lg:col-span-6 p-5 rounded-2xl bg-[var(--cms-surface)] border border-[var(--cms-divider)] space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-base font-bold">Rooms & TVs</h2>
                    <button
                      onClick={() => setActiveTab('rooms')}
                      className="text-xs font-semibold text-[var(--cms-link)] hover:underline"
                    >
                      View all ({propEndpoints.length})
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-[var(--cms-divider)] text-[var(--cms-text-secondary)]">
                          <th className="py-2 pr-3 font-medium">Room</th>
                          <th className="py-2 px-3 font-medium">TV Endpoint</th>
                          <th className="py-2 px-3 font-medium">Status</th>
                          <th className="py-2 px-3 font-medium">Version</th>
                          <th className="py-2 pl-3 text-right font-medium">Preview</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--cms-divider)]">
                        {propEndpoints.slice(0, 5).map((ep) => {
                          const r = propRooms.find((rm) => rm.id === ep.roomId);
                          return (
                            <tr key={ep.id} className="hover:bg-black/5 dark:hover:bg-white/5">
                              <td className="py-2.5 pr-3 font-mono-tabular font-semibold">{r?.code || ep.roomId}</td>
                              <td className="py-2.5 px-3">{ep.label} ({ep.id})</td>
                              <td className="py-2.5 px-3 font-semibold">
                                {ep.connection === 'Online' ? (
                                  <span className="text-emerald-700 dark:text-emerald-300">Online</span>
                                ) : (
                                  <span className="text-rose-700 dark:text-rose-300">Offline</span>
                                )}
                              </td>
                              <td className="py-2.5 px-3 font-mono-tabular">v{ep.appVersion}</td>
                              <td className="py-2.5 pl-3 text-right">
                                <button
                                  onClick={() => setTvModalEndpointId(ep.id)}
                                  className="px-2.5 py-1 rounded-lg bg-[#0050F5]/10 text-[#0050F5] dark:text-[#C7B9FF] font-semibold hover:bg-[#0050F5] hover:text-white transition-colors"
                                >
                                  Open TV
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* TAB 2: ROOMS & TVs (PR-02..05, Multi-TV Suite & Housekeeping Matrix) */}
          {/* ===================================================================== */}
          {activeTab === 'rooms' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="text-2xl font-bold">Rooms & TV Endpoints — {activeProperty.name}</h1>
                  <p className="text-xs text-[var(--cms-text-secondary)]">
                    Occupancy, Housekeeping readiness, Maintenance authorization, and Endpoint online state are tracked as 4 separate facts.
                  </p>
                </div>

                {/* Add Room Form (Validates Duplicate Room Code per Property — F-006) */}
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
                    <span>Add Room</span>
                  </button>
                </form>
              </div>

              <div className="p-5 rounded-2xl bg-[var(--cms-surface)] border border-[var(--cms-divider)] overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-[var(--cms-divider)] text-[var(--cms-text-secondary)]">
                      <th className="py-2.5 pr-3">Room</th>
                      <th className="py-2.5 px-3">Class</th>
                      <th className="py-2.5 px-3">Occupancy (Stay)</th>
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
                        return (
                          <tr key={room.id} className="hover:bg-black/5 dark:hover:bg-white/5">
                            <td className="py-3 pr-3 font-mono-tabular font-bold text-sm">Room {room.code}</td>
                            <td className="py-3 px-3">{room.roomClass}</td>
                            <td className="py-3 px-3">
                              {stay ? (
                                <span className="font-semibold text-blue-700 dark:text-blue-300">
                                  InHouse ({stay.displayName || 'Anonymous Guest'} · {stay.locale})
                                </span>
                              ) : (
                                <span className="text-[var(--cms-text-secondary)]">Vacant</span>
                              )}
                            </td>
                            <td className="py-3 px-3">
                              <button
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
                                className={`px-2.5 py-1 rounded-lg font-semibold ${
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
                                <span className="text-[var(--cms-text-secondary)]">No Endpoint Bound</span>
                              ) : (
                                eps.map((ep) => (
                                  <div key={ep.id} className="flex items-center gap-2 font-mono-tabular">
                                    <span className="font-semibold">{ep.id}</span>
                                    <span>·</span>
                                    <span>{ep.label}</span>
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
                                  onClick={() => setTvModalEndpointId(ep.id)}
                                  className="ml-1.5 px-2.5 py-1 rounded-lg bg-[#0050F5] text-white font-semibold hover:bg-[#0040C8]"
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
            </div>
          )}

          {/* ===================================================================== */}
          {/* TAB 3: GUESTS & CORPORATE GROUPS (PR-12..14, Manual Stay Lifecycle)  */}
          {/* ===================================================================== */}
          {activeTab === 'guests' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold">Guest Stays & Corporate Groups (No PMS Required)</h1>
                <p className="text-xs text-[var(--cms-text-secondary)]">
                  Front Office can manage check-in, corporate group greetings, and checkout session resets directly. Guest names are optional and masked for unauthorized roles (BR08).
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Manual Check-In Form */}
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    try {
                      await apiCall('/api/stays/checkin', {
                        method: 'POST',
                        body: JSON.stringify({
                          propertyId: activeProperty.id,
                          roomId: checkInRoomId,
                          displayName: checkInGuestName || null,
                          locale: checkInLocale,
                          groupId: checkInGroupId || null,
                        }),
                      });
                      setCheckInGuestName('');
                      await fetchBootstrap();
                      showNotice('success', `Checked in guest to ${checkInRoomId} with locale ${checkInLocale}.`);
                    } catch (err: unknown) {
                      showNotice('error', err instanceof Error ? err.message : 'Check-in denied');
                    }
                  }}
                  className="lg:col-span-4 p-5 rounded-2xl bg-[var(--cms-surface)] border border-[var(--cms-divider)] space-y-3.5 text-xs"
                >
                  <h2 className="text-base font-bold">Manual Guest Check-In (FR06-01)</h2>
                  <div>
                    <label className="block font-medium mb-1">Target Room</label>
                    <select
                      value={checkInRoomId}
                      onChange={(e) => setCheckInRoomId(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[var(--cms-input)] border border-[var(--cms-control-border)]"
                    >
                      {propRooms.map((r) => (
                        <option key={r.id} value={r.id}>
                          Room {r.code} ({r.roomClass})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-medium mb-1">Optional Guest Display Name (Safe Greeting)</label>
                    <input
                      type="text"
                      value={checkInGuestName}
                      onChange={(e) => setCheckInGuestName(e.target.value)}
                      placeholder="Leave blank for anonymous welcome"
                      className="w-full px-3 py-2 rounded-xl bg-[var(--cms-input)] border border-[var(--cms-control-border)]"
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-1">Initial Guest TV Locale (4 Languages)</label>
                    <select
                      value={checkInLocale}
                      onChange={(e) => setCheckInLocale(e.target.value as GuestLocale)}
                      className="w-full px-3 py-2 rounded-xl bg-[var(--cms-input)] border border-[var(--cms-control-border)]"
                    >
                      <option value="id">Bahasa Indonesia (id)</option>
                      <option value="en">English (en)</option>
                      <option value="zh-CN">简体中文 Mandarin (zh-CN)</option>
                      <option value="ja-JP">日本語 Japanese (ja-JP)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-medium mb-1">Corporate Group Assignment (Optional)</label>
                    <select
                      value={checkInGroupId}
                      onChange={(e) => setCheckInGroupId(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[var(--cms-input)] border border-[var(--cms-control-border)]"
                    >
                      <option value="">None (Individual Stay)</option>
                      {data.corporateGroups.map((g) => (
                        <option key={g.id} value={g.id}>
                          {g.id} — {g.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 rounded-xl bg-[#0050F5] hover:bg-[#0040C8] text-white font-semibold"
                  >
                    Commit Check-In
                  </button>
                </form>

                {/* Active Stays Board */}
                <div className="lg:col-span-8 p-5 rounded-2xl bg-[var(--cms-surface)] border border-[var(--cms-divider)] space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-base font-bold">Active Stays & Context Versions ({propStays.length})</h2>
                    <span className="text-xs text-[var(--cms-text-secondary)]">
                      Role <code className="font-mono-tabular">{currentRole.id}</code> Guest Name Read:{' '}
                      <strong>{currentRole.permissions.includes('guests.name.read') ? 'Permitted' : 'Redacted'}</strong>
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-[var(--cms-divider)] text-[var(--cms-text-secondary)]">
                          <th className="py-2 pr-3">Stay ID</th>
                          <th className="py-2 px-3">Room</th>
                          <th className="py-2 px-3">Display Name</th>
                          <th className="py-2 px-3">Locale</th>
                          <th className="py-2 px-3">Group</th>
                          <th className="py-2 px-3">Context Ver</th>
                          <th className="py-2 px-3">Status</th>
                          <th className="py-2 pl-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--cms-divider)]">
                        {propStays.map((st) => {
                          const rm = propRooms.find((r) => r.id === st.roomId);
                          return (
                            <tr key={st.id}>
                              <td className="py-3 pr-3 font-mono-tabular font-semibold">{st.id}</td>
                              <td className="py-3 px-3 font-mono-tabular">Room {rm?.code || st.roomId}</td>
                              <td className="py-3 px-3 font-medium">
                                {st.displayName || <span className="text-[var(--cms-text-secondary)]">Generic Greeting</span>}
                              </td>
                              <td className="py-3 px-3 font-mono-tabular uppercase">{st.locale}</td>
                              <td className="py-3 px-3">{st.groupId || '—'}</td>
                              <td className="py-3 px-3 font-mono-tabular">v{st.contextVersion}</td>
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
                                          `Checked out ${st.id}. Personal GOJJA context purged; room marked Dirty until housekeeping Ready.`
                                        );
                                      } catch (err: unknown) {
                                        showNotice('error', err instanceof Error ? err.message : 'Checkout denied');
                                      }
                                    }}
                                    className="px-2.5 py-1 rounded-lg bg-rose-500/15 text-rose-700 dark:text-rose-300 font-semibold hover:bg-rose-500/25"
                                  >
                                    Checkout & Purge
                                  </button>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* TAB 4: BRANDING & CONTENT (Matches 03 / BRANDING & CAMPAIGNS Mockup) */}
          {/* ===================================================================== */}
          {activeTab === 'branding' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Branding & content</h1>
                  <p className="text-sm text-[var(--cms-text-secondary)]">
                    Personalise the guest experience with your hotel’s identity and curated content.
                  </p>
                </div>
                <div className="text-xs font-mono-tabular text-[var(--cms-text-secondary)]">
                  Draft Resource v{activeProperty.resourceVersion} · Applied Manifest v{data.publications[0]?.version || 4}
                </div>
              </div>

              {/* Two-Column Split Editor + Live Embedded TV Home Preview (Matches 03 / BRANDING & CAMPAIGNS) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left Column: Hotel Logo, Theme Colors, Welcome Video, Guest Locale */}
                <div className="lg:col-span-5 p-6 rounded-2xl bg-[var(--cms-surface)] border border-[var(--cms-divider)] space-y-5">
                  {/* Hotel Logo Slot */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold">Hotel logo</label>
                    <div className="flex items-center gap-4">
                      <div className="w-36 h-24 rounded-xl border border-dashed border-[var(--cms-control-border)] bg-[var(--cms-bg)] flex flex-col items-center justify-center p-3 text-center">
                        <Sparkles className="w-5 h-5 text-[#DCC6A1] mb-1" />
                        <div className="text-xs font-bold tracking-wider">{brandLogoText}</div>
                        <div className="text-[9px] tracking-widest text-[var(--cms-text-secondary)]">
                          {brandLogoSubtitle}
                        </div>
                      </div>
                      <div className="flex-1 space-y-2 text-xs">
                        <input
                          type="text"
                          value={brandLogoText}
                          onChange={(e) => setBrandLogoText(e.target.value)}
                          placeholder="Hotel Brand Title"
                          className="w-full px-3 py-1.5 rounded-lg bg-[var(--cms-input)] border border-[var(--cms-control-border)] font-semibold"
                        />
                        <input
                          type="text"
                          value={brandLogoSubtitle}
                          onChange={(e) => setBrandLogoSubtitle(e.target.value)}
                          placeholder="Location Subtitle"
                          className="w-full px-3 py-1.5 rounded-lg bg-[var(--cms-input)] border border-[var(--cms-control-border)]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Theme Colors Swatches */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold">Theme colors (Property Override Layer)</label>
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
                          className={`w-9 h-9 rounded-full border-2 transition-transform ${
                            brandAccentColor === swatch.accent ? 'scale-110 border-[#0050F5]' : 'border-transparent'
                          }`}
                          style={{ background: `linear-gradient(135deg, ${swatch.primary} 50%, ${swatch.accent} 50%)` }}
                        />
                      ))}
                      <input
                        type="color"
                        value={brandAccentColor}
                        onChange={(e) => setBrandAccentColor(e.target.value)}
                        className="w-9 h-9 rounded-lg cursor-pointer border border-[var(--cms-divider)]"
                        title="Custom Accent Color"
                      />
                    </div>
                  </div>

                  {/* Welcome Video Asset Slot */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold">Welcome video (Verified Checksum & Quota)</label>
                    <div className="p-3 rounded-xl bg-[var(--cms-bg)] border border-[var(--cms-divider)] flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={activeProperty.heroImageUrl}
                          alt="Welcome Video Thumbnail"
                          referrerPolicy="no-referrer"
                          className="w-16 h-10 rounded-lg object-cover"
                        />
                        <div className="text-xs">
                          <div className="font-semibold">welcome-arunika.mp4</div>
                          <div className="text-[11px] text-[var(--cms-text-secondary)] font-mono-tabular">
                            120 MB • 00:45 • Ready
                          </div>
                        </div>
                      </div>
                      <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">In Use</span>
                    </div>
                  </div>

                  {/* 4-Locale Guest Copy Tabs (EN / ID / 中文 / 日本語) */}
                  <div className="space-y-2.5">
                    <label className="block text-xs font-bold">Guest locale (4 Mandatory Guest Languages)</label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {(
                        [
                          { code: 'en', label: 'EN' },
                          { code: 'id', label: 'ID' },
                          { code: 'zh-CN', label: '中文' },
                          { code: 'ja-JP', label: '日本語' },
                        ] as Array<{ code: GuestLocale; label: string }>
                      ).map((loc) => (
                        <button
                          key={loc.code}
                          type="button"
                          onClick={() => setBrandLocaleTab(loc.code)}
                          className={`py-2 rounded-xl text-xs font-semibold border transition-colors ${
                            brandLocaleTab === loc.code
                              ? 'bg-[#0050F5] text-white border-[#0050F5]'
                              : 'bg-[var(--cms-bg)] border-[var(--cms-divider)] text-[var(--cms-text-secondary)]'
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
                  </div>

                  {/* Field Inheritance Provenance Inspector (C-36) */}
                  <div className="p-3.5 rounded-xl bg-[var(--cms-bg)] border border-[var(--cms-divider)] text-xs space-y-1.5">
                    <div className="font-bold">Effective Inheritance Provenance (C-36)</div>
                    {data.profileOverrides.map((ovr) => (
                      <div key={ovr.id} className="flex items-center justify-between text-[11px] font-mono-tabular">
                        <span>
                          {ovr.layer} ({ovr.targetId}) → {ovr.field}
                        </span>
                        <span className="font-semibold text-[#0050F5] dark:text-[#C7B9FF]">
                          {ovr.value.slice(0, 22)} (v{ovr.version})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Column: Live Interactive TV Home Preview + Save Draft & Publish Actions */}
                <div className="lg:col-span-7 p-6 rounded-2xl bg-[var(--cms-surface)] border border-[var(--cms-divider)] space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-bold">TV home preview (Live Interactive Canvas)</h2>
                      <p className="text-xs text-[var(--cms-text-secondary)]">
                        Click tiles inside the TV screen below or use the D-pad controls to test the guest journey.
                      </p>
                    </div>
                  </div>

                  <TvGuestAppView
                    embedded={true}
                    property={{
                      ...activeProperty,
                      logoText: brandLogoText,
                      logoSubtitle: brandLogoSubtitle,
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
                    onOpenChannelCheck={async (epId, chId) => {
                      try {
                        return await apiCall('/api/tv/open-channel', {
                          method: 'POST',
                          body: JSON.stringify({ endpointId: epId, channelId: chId }),
                        });
                      } catch (err: unknown) {
                        return { allowed: false, message: err instanceof Error ? err.message : 'Access restricted' };
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
                        Save draft
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
                                accentColor: brandAccentColor,
                                primaryColor: brandPrimaryColor,
                                welcomeHeadline: brandHeadline,
                              }),
                            });
                            const pubRes = await apiCall('/api/branding/publish', {
                              method: 'POST',
                              body: JSON.stringify({
                                propertyId: activeProperty.id,
                                title: `${brandLogoText} Theme & Locale Manifest`,
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
                        <span>Publish changes</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
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
                  showNotice('info', res.run.summaryText);
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
                  showNotice('info', res.candidate.notes);
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
                  showNotice('success', res.message);
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
                  showNotice('success', res.message);
                } catch (err: unknown) {
                  showNotice('error', err instanceof Error ? err.message : 'ADB connect / verification failed');
                }
              }}
              onAssignDevice={async (payload) => {
                try {
                  const res = await apiCall('/api/live-lab/assign-device', {
                    method: 'POST',
                    body: JSON.stringify(payload),
                  });
                  await fetchBootstrap();
                  showNotice('success', res.message);
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
                  showNotice('info', res.message);
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
          {activeTab === 'campaigns' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold">Hotel Promotions & Signage Placements (M13)</h1>
                <p className="text-xs text-[var(--cms-text-secondary)]">
                  Pre-TV interstitial is off by default; promotions enforce per-stay frequency caps and never inject into third-party OTT streams or rapid channel zapping.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {data.campaigns.map((cmp) => (
                  <div
                    key={cmp.id}
                    className="p-5 rounded-2xl bg-[var(--cms-surface)] border border-[var(--cms-divider)] flex flex-col justify-between gap-4 text-xs"
                  >
                    <div className="flex gap-4">
                      <img
                        src={cmp.imageUrl}
                        alt={cmp.name}
                        referrerPolicy="no-referrer"
                        className="w-28 h-20 rounded-xl object-cover shrink-0"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono-tabular font-bold text-[#0050F5] dark:text-[#C7B9FF]">{cmp.id}</span>
                          <span>·</span>
                          <span className="font-semibold">{cmp.status}</span>
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
                ))}
              </div>
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
        </main>
      </div>

      {/* Full-Screen 16:9 TV Guest App Modal when triggered */}
      {tvModalEndpointId && modalEndpoint && (
        <TvGuestAppView
          property={{
            ...activeProperty,
            logoText: brandLogoText,
            logoSubtitle: brandLogoSubtitle,
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
          onClose={() => setTvModalEndpointId(null)}
          onOpenChannelCheck={async (epId, chId) => {
            try {
              return await apiCall('/api/tv/open-channel', {
                method: 'POST',
                body: JSON.stringify({ endpointId: epId, channelId: chId }),
              });
            } catch (err: unknown) {
              return { allowed: false, message: err instanceof Error ? err.message : 'Access restricted' };
            }
          }}
        />
      )}
    </div>
  );
}
