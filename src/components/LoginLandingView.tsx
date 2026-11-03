import React, { useState } from 'react';
import {
  Sun,
  Moon,
  ArrowRight,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  Tv,
  Palette,
  Megaphone,
  BarChart3,
  HelpCircle,
  ChevronDown,
  AlertTriangle,
  Globe,
} from 'lucide-react';
import {
  EnvironmentId,
  UserAccount,
  RoleDefinition,
  CmsLocale,
} from '../data/mockData';
import { GojjaWordmark } from './GojjaWordmark';

interface LoginLandingViewProps {
  userAccounts: UserAccount[];
  rolesCatalog: RoleDefinition[];
  theme: 'light' | 'dark';
  cmsLocale: CmsLocale;
  onChangeCmsLocale: (locale: CmsLocale) => void;
  onToggleTheme: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onLoginSuccess: (account: UserAccount, env: EnvironmentId) => void;
  onOpenTvShowcase: () => void;
}

const LOGIN_STRINGS: Record<
  CmsLocale,
  {
    heroTitle: string;
    heroSubtitle: string;
    heroDesc: string;
    card1Title: string;
    card1Sub: string;
    card2Title: string;
    card2Sub: string;
    card3Title: string;
    card3Sub: string;
    card4Title: string;
    card4Sub: string;
    launchTvBtn: string;
    launchTvShort: string;
    testRolesBtn: string;
    testRolesShort: string;
    helpBtn: string;
    welcomeBack: string;
    signInSub: string;
    demoWorkspace: string;
    liveLabWorkspace: string;
    workEmailLabel: string;
    passwordLabel: string;
    rememberMe: string;
    forgotPassword: string;
    signInBtn: string;
    orDivider: string;
    continueGoogle: string;
    secureAccess: string;
    needAccess: string;
    contactAdmin: string;
    systemsOperational: string;
    drawerTitle: string;
    drawerSub: string;
    closeBtn: string;
    groupPropertyOps: string;
    groupIspPartner: string;
    groupCentralOps: string;
    drawerFooterTip: string;
    helpModalTitle: string;
    helpDemoDesc: string;
    helpLiveDesc: string;
    helpAccountDesc: string;
  }
> = {
  id: {
    heroTitle: 'Pengalaman menginap yang lebih terhubung.',
    heroSubtitle: 'Satu platform. Setiap pengalaman tamu.',
    heroDesc:
      'Kelola properti hotel, layar SmartTV kamar, dan layanan perhotelan Anda dari satu ruang kerja terpadu yang aman.',
    card1Title: 'SmartTV & Kamar',
    card1Sub: 'Layar kamar & suite tamu',
    card2Title: 'Brand & Konten',
    card2Sub: 'Identitas hotel & media',
    card3Title: 'Saluran & Kampanye',
    card3Sub: 'Saluran IPTV & promo hotel',
    card4Title: 'Armada & Analitik',
    card4Sub: 'Kesehatan ADB & tayangan',
    launchTvBtn: 'Buka Pratinjau Interaktif TV Tamu (4 Bahasa)',
    launchTvShort: 'Pratinjau TV',
    testRolesBtn: 'Uji 16 Role Persona & Hak Akses RBAC',
    testRolesShort: '16 Role',
    helpBtn: 'Bantuan',
    welcomeBack: 'Selamat datang kembali',
    signInSub: 'Masuk ke ruang kerja CMS GOJJA Anda.',
    demoWorkspace: 'Ruang Kerja DEMO',
    liveLabWorkspace: 'LIVE_LAB (ADB Nyata)',
    workEmailLabel: 'Email kerja',
    passwordLabel: 'Kata sandi',
    rememberMe: 'Ingat saya',
    forgotPassword: 'Lupa kata sandi?',
    signInBtn: 'Masuk ke Dashboard',
    orDivider: 'atau',
    continueGoogle: 'Lanjutkan dengan Google',
    secureAccess: 'Akses aman terenkripsi untuk organisasi Anda.',
    needAccess: 'Butuh akses akun?',
    contactAdmin: 'Hubungi administrator Anda.',
    systemsOperational: 'Semua sistem beroperasi normal',
    drawerTitle: 'Katalog 16 Role Persona & RBAC',
    drawerSub: 'Pilih salah satu persona untuk mengisi otomatis email login dan menguji hak akses menu',
    closeBtn: '✕ Tutup',
    groupPropertyOps: 'Operasional Properti Hotel (Langsung)',
    groupIspPartner: 'Mitra ISP & Reseller',
    groupCentralOps: 'GOJJA HQ Central & Teknisi Lapangan',
    drawerFooterTip: 'Klik salah satu persona untuk mengisi otomatis formulir login.',
    helpModalTitle: 'Bantuan Ruang Kerja GOJJA',
    helpDemoDesc:
      'Ruang Kerja DEMO: Sandbox aman dengan 3 properti hotel, 14 perangkat TV, 4 bahasa layar TV (ID, EN, 中文, 日本語), dan telemetri lengkap.',
    helpLiveDesc:
      'Ruang Kerja LIVE_LAB: Pemindai LAN lokal & jembatan ADB nyata. Membutuhkan skrip pendamping gojja-connector.mjs di jaringan lokal Anda.',
    helpAccountDesc:
      'Butuh akun? Hubungi administrator properti Anda atau tim operasional platform GOJJA di support@gojja.tv.',
  },
  en: {
    heroTitle: 'A more connected stay.',
    heroSubtitle: 'One platform. Every guest experience.',
    heroDesc:
      'Manage your properties, screens and hospitality experiences from one secure workspace.',
    card1Title: 'SmartTV & Rooms',
    card1Sub: 'Living room & suite screens',
    card2Title: 'Brand & Content',
    card2Sub: 'Identity & media library',
    card3Title: 'Channels & Campaigns',
    card3Sub: 'IPTV line-up & offers',
    card4Title: 'Fleet & Insights',
    card4Sub: 'ADB health & playback',
    launchTvBtn: 'Launch Interactive TV Guest Experience (4 Languages)',
    launchTvShort: 'TV Preview',
    testRolesBtn: 'Test 16 Role Personas & RBAC',
    testRolesShort: '16 Roles',
    helpBtn: 'Help',
    welcomeBack: 'Welcome back',
    signInSub: 'Sign in to your GOJJA workspace.',
    demoWorkspace: 'DEMO Workspace',
    liveLabWorkspace: 'LIVE_LAB (Real ADB)',
    workEmailLabel: 'Work email',
    passwordLabel: 'Password',
    rememberMe: 'Remember me',
    forgotPassword: 'Forgot password?',
    signInBtn: 'Sign in',
    orDivider: 'or',
    continueGoogle: 'Continue with Google',
    secureAccess: 'Secure access for your organization.',
    needAccess: 'Need access?',
    contactAdmin: 'Contact your administrator.',
    systemsOperational: 'All systems operational',
    drawerTitle: 'Role Personas & RBAC Catalog',
    drawerSub: 'Select any persona to pre-fill credentials and test authorization scopes',
    closeBtn: '✕ Close',
    groupPropertyOps: 'Property Operations (Direct)',
    groupIspPartner: 'ISP & Reseller Partner',
    groupCentralOps: 'GOJJA Central & Field Ops',
    drawerFooterTip: 'Click any persona to auto-fill the login form with their email.',
    helpModalTitle: 'GOJJA Workspace Help',
    helpDemoDesc:
      'DEMO Workspace: Safe sandbox pre-seeded with 3 properties, 14 endpoints, 4 TV guest locales (EN, ID, 中文, 日本語), and full synthetic telemetry.',
    helpLiveDesc:
      'LIVE_LAB Workspace: Real local LAN scanner & real ADB bridge. Requires running the companion gojja-connector.mjs on your workstation or LAN.',
    helpAccountDesc:
      'Need an account? Contact your property administrator or GOJJA platform operations at support@gojja.tv.',
  },
};

export const LoginLandingView: React.FC<LoginLandingViewProps> = ({
  userAccounts,
  theme,
  cmsLocale,
  onChangeCmsLocale,
  onToggleTheme,
  onLoginSuccess,
  onOpenTvShowcase,
}) => {
  const [emailInput, setEmailInput] = useState<string>('hello@hotel.com');
  const [passwordInput, setPasswordInput] = useState<string>('••••••••••••');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [selectedEnv, setSelectedEnv] = useState<EnvironmentId>('DEMO');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [showLocaleMenu, setShowLocaleMenu] = useState<boolean>(false);
  const [showPersonaDrawer, setShowPersonaDrawer] = useState<boolean>(false);
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);
  const [selectedPersona, setSelectedPersona] = useState<UserAccount>(
    userAccounts.find((u) => u.alias === 'property-admin') ||
      userAccounts.find((u) => u.alias === 'property-manager') ||
      userAccounts[0]
  );

  const t = LOGIN_STRINGS[cmsLocale];

  // Strictly 2 languages on Login & CMS Dashboard: Bahasa Indonesia (ID) & English (EN)
  const cmsLocales: { id: CmsLocale; label: string; code: string }[] = [
    { id: 'id', label: 'Bahasa Indonesia', code: 'ID' },
    { id: 'en', label: 'English', code: 'EN' },
  ];

  const handlePersonaSelect = (acc: UserAccount) => {
    setSelectedPersona(acc);
    setEmailInput(acc.email);
    setLoginError(null);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    const q = emailInput.trim().toLowerCase();
    const matched =
      userAccounts.find((u) => u.email.toLowerCase() === q || u.alias.toLowerCase() === q) ||
      selectedPersona;

    if (selectedEnv === 'LIVE_LAB' && !matched.allowedEnvironments.includes('LIVE_LAB')) {
      setLoginError(
        cmsLocale === 'id'
          ? `Role ${matched.badgeLabel} (${matched.roleId}) hanya diizinkan di mode DEMO. Pilih Property Manager, Field Installer, ISP Alpha Admin, atau Platform Admin untuk LIVE_LAB.`
          : `Role ${matched.badgeLabel} (${matched.roleId}) is scoped to DEMO only. Choose Property Manager, Field Installer, ISP Alpha Admin, or Platform Admin for LIVE_LAB.`
      );
      return;
    }
    onLoginSuccess(matched, selectedEnv);
  };

  const handleGoogleSignIn = () => {
    onLoginSuccess(selectedPersona, selectedEnv);
  };

  return (
    <div className="relative h-[100dvh] w-full bg-[var(--cms-bg)] text-[var(--cms-text)] flex flex-col justify-between overflow-hidden font-sans select-none">
      {/* Clean Background Resort Photography Layer (Zero baked-in text) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img
          src="/assets/aistudio/file_0000000043808207bbdf250e0b1586c7_702e345a.png"
          alt="Luxury Resort Cliffside Infinity Pool"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center"
        />
        {/* Measured Scrim Overlay tuned for crisp text contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/15 dark:from-black/80 dark:via-black/55 dark:to-black/35" />
      </div>

      {/* Main Split-Panel Presentation (Locked to 100dvh without scrolling on both Mobile & Desktop) */}
      <div className="relative z-10 w-full h-full flex flex-col lg:flex-row items-stretch justify-between overflow-hidden">
        {/* Mobile Compact Resort Header (Fits cleanly above auth card in 100dvh, feature cards hidden per user preference) */}
        <div className="lg:hidden px-4 pt-3 pb-2.5 text-white flex flex-col gap-1.5 shrink-0 relative z-10">
          <div className="flex items-center justify-between">
            <GojjaWordmark size="sm" showDescriptor={true} variant="reverse" />
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={onOpenTvShowcase}
                className="px-2.5 py-1 rounded-lg bg-white/20 backdrop-blur-md border border-white/30 text-white text-[11px] font-semibold inline-flex items-center gap-1 shadow-xs"
              >
                <Tv className="w-3 h-3 text-amber-300" />
                <span>{t.launchTvShort}</span>
              </button>
              <button
                type="button"
                onClick={() => setShowPersonaDrawer(true)}
                className="px-2.5 py-1 rounded-lg bg-black/40 backdrop-blur-md border border-white/25 text-white text-[11px] font-semibold inline-flex items-center gap-1 shadow-xs"
                title={t.testRolesBtn}
              >
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>{t.testRolesShort}</span>
              </button>
            </div>
          </div>
          <div className="flex items-baseline justify-between gap-2">
            <div className="text-base sm:text-lg font-extrabold tracking-tight text-white drop-shadow-sm truncate">
              {t.heroTitle}
            </div>
            <div className="text-[11px] text-slate-200 truncate hidden xs:block">
              {t.heroSubtitle}
            </div>
          </div>
        </div>

        {/* Desktop Left Side: Brand Identity, Headlines, 4 Highlight Cards & Heritage Footer */}
        <div className="hidden lg:flex lg:w-[58%] xl:w-[60%] h-full py-6 xl:py-10 px-10 xl:px-14 flex-col justify-between text-white overflow-hidden">
          {/* Top Logo */}
          <div className="shrink-0">
            <GojjaWordmark size="lg" showDescriptor={true} variant="reverse" />
          </div>

          {/* Center Brand Statements & 4 Feature Highlights */}
          <div className="my-auto space-y-5 xl:space-y-6 max-w-2xl">
            <div className="space-y-2">
              <h1 className="text-4xl xl:text-[46px] font-extrabold tracking-tight leading-[1.08] text-white drop-shadow-md">
                {t.heroTitle}
              </h1>
              <p className="text-lg xl:text-2xl font-medium text-slate-100/95 tracking-tight">
                {t.heroSubtitle}
              </p>
              <p className="text-xs xl:text-sm text-slate-200/90 leading-relaxed max-w-xl">
                {t.heroDesc}
              </p>
            </div>

            {/* 4 Feature Highlight Cards in a Row (Desktop Only) */}
            <div className="grid grid-cols-4 gap-3">
              <div className="p-3 xl:p-3.5 rounded-2xl bg-black/35 backdrop-blur-md border border-white/20 flex flex-col items-start gap-2 shadow-lg">
                <div className="w-8 h-8 rounded-xl bg-[#0050F5]/30 border border-[#0050F5]/50 flex items-center justify-center text-blue-200">
                  <Tv className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white leading-tight">{t.card1Title}</div>
                  <div className="text-[10px] text-slate-300 mt-0.5">{t.card1Sub}</div>
                </div>
              </div>

              <div className="p-3 xl:p-3.5 rounded-2xl bg-black/35 backdrop-blur-md border border-white/20 flex flex-col items-start gap-2 shadow-lg">
                <div className="w-8 h-8 rounded-xl bg-[#7C35E0]/30 border border-[#7C35E0]/50 flex items-center justify-center text-purple-200">
                  <Palette className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white leading-tight">{t.card2Title}</div>
                  <div className="text-[10px] text-slate-300 mt-0.5">{t.card2Sub}</div>
                </div>
              </div>

              <div className="p-3 xl:p-3.5 rounded-2xl bg-black/35 backdrop-blur-md border border-white/20 flex flex-col items-start gap-2 shadow-lg">
                <div className="w-8 h-8 rounded-xl bg-[#CA3596]/30 border border-[#CA3596]/50 flex items-center justify-center text-pink-200">
                  <Megaphone className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white leading-tight">{t.card3Title}</div>
                  <div className="text-[10px] text-slate-300 mt-0.5">{t.card3Sub}</div>
                </div>
              </div>

              <div className="p-3 xl:p-3.5 rounded-2xl bg-black/35 backdrop-blur-md border border-white/20 flex flex-col items-start gap-2 shadow-lg">
                <div className="w-8 h-8 rounded-xl bg-[#FF5E70]/30 border border-[#FF5E70]/50 flex items-center justify-center text-rose-200">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white leading-tight">{t.card4Title}</div>
                  <div className="text-[10px] text-slate-300 mt-0.5">{t.card4Sub}</div>
                </div>
              </div>
            </div>

            {/* Quick TV Preview & Role Persona Triggers */}
            <div className="pt-1 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onOpenTvShowcase}
                className="px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/30 text-white text-xs font-semibold inline-flex items-center gap-2 transition-all shadow-md group cursor-pointer"
              >
                <Tv className="w-4 h-4 text-amber-300 group-hover:scale-110 transition-transform" />
                <span>{t.launchTvBtn}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowPersonaDrawer(!showPersonaDrawer)}
                className="px-4 py-2 rounded-xl bg-black/35 hover:bg-black/50 backdrop-blur-md border border-white/20 text-white text-xs font-semibold inline-flex items-center gap-2 transition-all cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>{t.testRolesBtn}</span>
              </button>
            </div>
          </div>

          {/* Bottom Left Heritage Tagline (Exact V-11) */}
          <div className="pt-3 border-t border-white/15 text-xs tracking-wider space-y-0.5 shrink-0">
            <div className="font-extrabold uppercase text-white/95 tracking-[0.2em] text-[11px]">
              OPEN. CONNECTED. FORWARD.
            </div>
            <div className="text-[10px] uppercase text-white/70 tracking-[0.16em]">
              INDONESIA · HOSPITALITY TECHNOLOGY
            </div>
          </div>
        </div>

        {/* Right Side: Organic Curved White/Pearl Auth Panel (Fits 100dvh with zero scroll) */}
        <div className="flex-1 lg:flex-none w-full lg:w-[42%] xl:w-[40%] lg:h-full bg-[var(--cms-surface)] rounded-t-[28px] lg:rounded-t-none lg:rounded-l-[44px] px-5 py-3.5 sm:px-8 sm:py-5 lg:px-10 lg:py-6 flex flex-col justify-between shadow-2xl relative z-20 overflow-hidden">
          {/* Top Utility Bar: 2-Language CMS Selector (ID | EN), Sun/Moon Pill, Help */}
          <div className="flex items-center justify-end gap-2 shrink-0">
            {/* Direct 2-Language Segmented Toggle + Dropdown (Strictly ID & EN for Login/CMS) */}
            <div className="relative flex items-center gap-1">
              <div className="inline-flex items-center p-0.5 rounded-full bg-[var(--cms-bg)] border border-[var(--cms-divider)] text-[11px] font-semibold">
                <button
                  type="button"
                  onClick={() => onChangeCmsLocale('id')}
                  className={`px-2.5 py-0.5 rounded-full transition-all cursor-pointer ${
                    cmsLocale === 'id'
                      ? 'bg-[var(--brand-indigo)] text-white shadow-xs'
                      : 'text-[var(--cms-text-secondary)] hover:text-[var(--cms-text)]'
                  }`}
                  title="Bahasa Indonesia (Login & CMS)"
                >
                  ID
                </button>
                <button
                  type="button"
                  onClick={() => onChangeCmsLocale('en')}
                  className={`px-2.5 py-0.5 rounded-full transition-all cursor-pointer ${
                    cmsLocale === 'en'
                      ? 'bg-[var(--brand-indigo)] text-white shadow-xs'
                      : 'text-[var(--cms-text-secondary)] hover:text-[var(--cms-text)]'
                  }`}
                  title="English (Login & CMS)"
                >
                  EN
                </button>
              </div>

              <button
                type="button"
                onClick={() => setShowLocaleMenu(!showLocaleMenu)}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[var(--cms-bg)] border border-[var(--cms-divider)] text-[11px] font-medium hover:border-[var(--brand-indigo)] transition-colors cursor-pointer"
                aria-label="Select CMS language"
              >
                <Globe className="w-3 h-3 text-[var(--cms-text-secondary)]" />
                <ChevronDown className="w-3 h-3 text-[var(--cms-text-secondary)]" />
              </button>

              {showLocaleMenu && (
                <div className="absolute right-0 top-full mt-1.5 w-48 rounded-xl bg-[var(--cms-surface)] border border-[var(--cms-divider)] shadow-xl p-1.5 z-50 text-xs">
                  <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--cms-text-secondary)]">
                    {cmsLocale === 'id' ? 'Bahasa Login & CMS (2 Bahasa)' : 'Login & CMS Language (2)'}
                  </div>
                  {cmsLocales.map((loc) => (
                    <button
                      key={loc.id}
                      type="button"
                      onClick={() => {
                        onChangeCmsLocale(loc.id);
                        setShowLocaleMenu(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-lg flex items-center justify-between cursor-pointer ${
                        cmsLocale === loc.id
                          ? 'bg-[#EEF0FF] dark:bg-white/10 text-[var(--brand-indigo)] font-semibold'
                          : 'text-[var(--cms-text)] hover:bg-[var(--cms-bg)]'
                      }`}
                    >
                      <span>{loc.label}</span>
                      <span className="text-[10px] font-mono-tabular text-[var(--cms-text-secondary)]">{loc.code}</span>
                    </button>
                  ))}
                  <div className="mt-1 pt-1 border-t border-[var(--cms-divider)] px-2.5 py-1 text-[10px] text-[var(--cms-text-secondary)] leading-tight">
                    {cmsLocale === 'id'
                      ? '💡 Antarmuka TV Tamu mendukung 4 bahasa (ID, EN, 中文, 日本語) di dalam Dashboard.'
                      : '💡 TV Guest Interface supports 4 languages (EN, ID, 中文, 日本語) inside Dashboard.'}
                  </div>
                </div>
              )}
            </div>

            {/* Circular Sun/Moon Toggle */}
            <button
              type="button"
              onClick={onToggleTheme}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--cms-bg)] border border-[var(--cms-divider)] text-[11px] font-medium hover:opacity-90 transition-all cursor-pointer"
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

            {/* Help Button */}
            <button
              type="button"
              onClick={() => setShowHelpModal(true)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[var(--cms-bg)] border border-[var(--cms-divider)] text-[11px] font-medium hover:border-[var(--brand-indigo)] text-[var(--cms-text-secondary)] hover:text-[var(--cms-text)] transition-colors cursor-pointer"
            >
              <HelpCircle className="w-3 h-3" />
              <span>{t.helpBtn}</span>
            </button>
          </div>

          {/* Form Container (Compact & Centered to fit 100dvh without scroll) */}
          <div className="w-full max-w-sm mx-auto my-auto space-y-3 sm:space-y-3.5">
            {/* Centered Logo & Greeting */}
            <div className="text-center space-y-1">
              <div className="flex justify-center">
                <GojjaWordmark size="md" showDescriptor={true} variant={theme === 'dark' ? 'reverse' : 'color'} />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--cms-text)]">
                {t.welcomeBack}
              </h2>
              <p className="text-[11px] text-[var(--cms-text-secondary)]">
                {t.signInSub}
              </p>
            </div>

            {/* DEMO / LIVE_LAB Environment Selector */}
            <div className="p-1 rounded-xl bg-[var(--cms-bg)] border border-[var(--cms-divider)] grid grid-cols-2 gap-1 text-[11px] font-semibold">
              <button
                type="button"
                onClick={() => setSelectedEnv('DEMO')}
                className={`py-1.5 rounded-lg transition-all cursor-pointer ${
                  selectedEnv === 'DEMO'
                    ? 'bg-[var(--brand-indigo)] text-white shadow-xs'
                    : 'text-[var(--cms-text-secondary)] hover:text-[var(--cms-text)]'
                }`}
              >
                {t.demoWorkspace}
              </button>
              <button
                type="button"
                onClick={() => setSelectedEnv('LIVE_LAB')}
                className={`py-1.5 rounded-lg transition-all cursor-pointer ${
                  selectedEnv === 'LIVE_LAB'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-[var(--cms-text-secondary)] hover:text-[var(--cms-text)]'
                }`}
              >
                {t.liveLabWorkspace}
              </button>
            </div>

            {/* Error Banner */}
            {loginError && (
              <div className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-800 dark:text-rose-200 text-[11px] flex items-start gap-2">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>{loginError}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleFormSubmit} className="space-y-2.5 sm:space-y-3">
              {/* Work email */}
              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-[var(--cms-text)]">
                  {t.workEmailLabel}
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-[var(--cms-text-secondary)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="hello@hotel.com"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-[var(--cms-bg)] border border-[var(--cms-divider)] text-xs text-[var(--cms-text)] focus:outline-2 focus:outline-[var(--brand-indigo)] transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-[var(--cms-text)]">
                  {t.passwordLabel}
                </label>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 text-[var(--cms-text-secondary)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-9 py-2 rounded-xl bg-[var(--cms-bg)] border border-[var(--cms-divider)] text-xs text-[var(--cms-text)] focus:outline-2 focus:outline-[var(--brand-indigo)] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--cms-text-secondary)] hover:text-[var(--cms-text)]"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Remember me & Forgot password */}
              <div className="flex items-center justify-between text-[11px] pt-0.5">
                <label className="inline-flex items-center gap-1.5 cursor-pointer select-none text-[var(--cms-text)] font-medium">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 rounded text-[var(--brand-indigo)] border-[var(--cms-divider)] focus:ring-0"
                  />
                  <span>{t.rememberMe}</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowHelpModal(true)}
                  className="font-medium text-[var(--cms-link)] hover:underline cursor-pointer"
                >
                  {t.forgotPassword}
                </button>
              </div>

              {/* Primary Action Button */}
              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl btn-luxury-indigo text-white text-xs font-bold inline-flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.99] cursor-pointer"
              >
                <span>{t.signInBtn}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Divider 'or' / 'atau' */}
            <div className="relative flex items-center justify-center my-2">
              <div className="border-t border-[var(--cms-divider)] w-full" />
              <span className="bg-[var(--cms-surface)] px-2.5 text-[10px] text-[var(--cms-text-secondary)] uppercase tracking-wider">
                {t.orDivider}
              </span>
            </div>

            {/* Continue with Google */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full py-2 px-4 rounded-xl bg-[var(--cms-bg)] hover:bg-black/5 dark:hover:bg-white/5 border border-[var(--cms-divider)] text-xs font-semibold text-[var(--cms-text)] inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{t.continueGoogle}</span>
            </button>

            {/* Security Note & Support Link */}
            <div className="pt-1 text-center space-y-1">
              <div className="inline-flex items-center gap-1.5 text-[11px] text-[var(--cms-text-secondary)]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>{t.secureAccess}</span>
              </div>
              <div className="text-[11px] text-[var(--cms-text-secondary)]">
                {t.needAccess}{' '}
                <button
                  type="button"
                  onClick={() => setShowHelpModal(true)}
                  className="font-semibold text-[var(--cms-link)] hover:underline cursor-pointer"
                >
                  {t.contactAdmin}
                </button>
              </div>
            </div>
          </div>

          {/* Footer inside Right Panel */}
          <div className="pt-2.5 border-t border-[var(--cms-divider)] flex items-center justify-between gap-2 text-[10px] sm:text-[11px] text-[var(--cms-text-secondary)] shrink-0">
            <span>© 2026 GOJJA SmartTV</span>
            <div className="flex items-center gap-2">
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                {t.systemsOperational}
              </span>
              <span>·</span>
              <span className="font-mono-tabular">31 Oct 2026</span>
            </div>
          </div>
        </div>
      </div>

      {/* Slide-out Tester Drawer: Quick Persona Switcher (Allows testing all 16 RBAC roles without typing) */}
      {showPersonaDrawer && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-md bg-[var(--cms-surface)] h-full p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[var(--cms-divider)]">
                <div>
                  <h3 className="text-base font-bold text-[var(--cms-text)]">{t.drawerTitle}</h3>
                  <p className="text-xs text-[var(--cms-text-secondary)]">{t.drawerSub}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPersonaDrawer(false)}
                  className="px-2.5 py-1 rounded-lg bg-[var(--cms-bg)] text-xs font-semibold hover:opacity-80 cursor-pointer"
                >
                  {t.closeBtn}
                </button>
              </div>

              {/* Grouped Personas */}
              <div className="space-y-3">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--cms-text-secondary)]">
                  {t.groupPropertyOps}
                </div>
                {userAccounts
                  .filter((u) => u.propertyIds.length > 0 && !u.partnerId)
                  .map((acc) => (
                    <button
                      key={acc.alias}
                      type="button"
                      onClick={() => {
                        handlePersonaSelect(acc);
                        setShowPersonaDrawer(false);
                      }}
                      className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-center justify-between cursor-pointer ${
                        selectedPersona.alias === acc.alias
                          ? 'bg-[#EEF0FF] dark:bg-white/10 border-[var(--brand-indigo)] font-bold'
                          : 'bg-[var(--cms-bg)] border-[var(--cms-divider)] hover:border-[var(--brand-indigo)]'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="font-semibold text-[var(--cms-text)]">
                          {acc.name} <span className="text-[10px] text-[var(--cms-text-secondary)]">({acc.roleId})</span>
                        </div>
                        <div className="text-[11px] text-[var(--cms-text-secondary)]">{acc.badgeLabel}</div>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                        {acc.allowedEnvironments.join(' · ')}
                      </span>
                    </button>
                  ))}

                <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--cms-text-secondary)] pt-2">
                  {t.groupIspPartner}
                </div>
                {userAccounts
                  .filter((u) => u.partnerId)
                  .map((acc) => (
                    <button
                      key={acc.alias}
                      type="button"
                      onClick={() => {
                        handlePersonaSelect(acc);
                        setShowPersonaDrawer(false);
                      }}
                      className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-center justify-between cursor-pointer ${
                        selectedPersona.alias === acc.alias
                          ? 'bg-[#EEF0FF] dark:bg-white/10 border-[var(--brand-indigo)] font-bold'
                          : 'bg-[var(--cms-bg)] border-[var(--cms-divider)] hover:border-[var(--brand-indigo)]'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="font-semibold text-[var(--cms-text)]">
                          {acc.name} <span className="text-[10px] text-[var(--cms-text-secondary)]">({acc.roleId})</span>
                        </div>
                        <div className="text-[11px] text-[var(--cms-text-secondary)]">{acc.badgeLabel}</div>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                        {acc.allowedEnvironments.join(' · ')}
                      </span>
                    </button>
                  ))}

                <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--cms-text-secondary)] pt-2">
                  {t.groupCentralOps}
                </div>
                {userAccounts
                  .filter((u) => !u.propertyIds.length && !u.partnerId)
                  .map((acc) => (
                    <button
                      key={acc.alias}
                      type="button"
                      onClick={() => {
                        handlePersonaSelect(acc);
                        setShowPersonaDrawer(false);
                      }}
                      className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-center justify-between cursor-pointer ${
                        selectedPersona.alias === acc.alias
                          ? 'bg-[#EEF0FF] dark:bg-white/10 border-[var(--brand-indigo)] font-bold'
                          : 'bg-[var(--cms-bg)] border-[var(--cms-divider)] hover:border-[var(--brand-indigo)]'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="font-semibold text-[var(--cms-text)]">
                          {acc.name} <span className="text-[10px] text-[var(--cms-text-secondary)]">({acc.roleId})</span>
                        </div>
                        <div className="text-[11px] text-[var(--cms-text-secondary)]">{acc.badgeLabel}</div>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                        {acc.allowedEnvironments.join(' · ')}
                      </span>
                    </button>
                  ))}
              </div>
            </div>

            <div className="pt-4 border-t border-[var(--cms-divider)] text-xs text-[var(--cms-text-secondary)]">
              {t.drawerFooterTip}
            </div>
          </div>
        </div>
      )}

      {/* Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[var(--cms-surface)] rounded-2xl p-6 shadow-2xl border border-[var(--cms-divider)] space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--cms-divider)]">
              <h3 className="font-bold text-base text-[var(--cms-text)]">{t.helpModalTitle}</h3>
              <button
                type="button"
                onClick={() => setShowHelpModal(false)}
                className="text-xs px-2 py-1 rounded bg-[var(--cms-bg)] cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="text-xs text-[var(--cms-text-secondary)] space-y-2 leading-relaxed">
              <p>{t.helpDemoDesc}</p>
              <p>{t.helpLiveDesc}</p>
              <p>{t.helpAccountDesc}</p>
            </div>
            <button
              type="button"
              onClick={() => setShowHelpModal(false)}
              className="w-full py-2.5 rounded-xl bg-[var(--brand-indigo)] text-white text-xs font-bold cursor-pointer"
            >
              {t.closeBtn.replace('✕ ', '')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
