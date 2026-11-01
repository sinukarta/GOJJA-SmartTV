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
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Radio,
  Layers,
  Wrench,
  Globe,
} from 'lucide-react';
import {
  EnvironmentId,
  UserAccount,
  RoleDefinition,
  GuestLocale,
} from '../data/mockData';
import { GojjaWordmark } from './GojjaWordmark';

interface LoginLandingViewProps {
  userAccounts: UserAccount[];
  rolesCatalog: RoleDefinition[];
  theme: 'light' | 'dark';
  onToggleTheme: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onLoginSuccess: (account: UserAccount, env: EnvironmentId) => void;
  onOpenTvShowcase: () => void;
}

export const LoginLandingView: React.FC<LoginLandingViewProps> = ({
  userAccounts,
  rolesCatalog,
  theme,
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
  const [activeLocale, setActiveLocale] = useState<GuestLocale>('en');
  const [showLocaleMenu, setShowLocaleMenu] = useState<boolean>(false);
  const [showPersonaDrawer, setShowPersonaDrawer] = useState<boolean>(false);
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);
  const [selectedPersona, setSelectedPersona] = useState<UserAccount>(
    userAccounts.find((u) => u.alias === 'property-admin') ||
      userAccounts.find((u) => u.alias === 'property-manager') ||
      userAccounts[0]
  );

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
        `Role ${matched.badgeLabel} (${matched.roleId}) is scoped to DEMO only. Choose Property Manager, Field Installer, ISP Alpha Admin, or Platform Admin for LIVE_LAB.`
      );
      return;
    }
    onLoginSuccess(matched, selectedEnv);
  };

  const handleGoogleSignIn = () => {
    // Authenticate with active selected persona in DEMO or current verified account
    onLoginSuccess(selectedPersona, selectedEnv);
  };

  const locales: { id: GuestLocale; label: string; code: string }[] = [
    { id: 'en', label: 'English', code: 'EN' },
    { id: 'id', label: 'Bahasa Indonesia', code: 'ID' },
    { id: 'zh-CN', label: '简体中文', code: '中文' },
    { id: 'ja-JP', label: '日本語', code: '日本語' },
  ];

  return (
    <div className="relative min-h-screen w-full bg-[var(--cms-bg)] text-[var(--cms-text)] flex flex-col justify-between overflow-x-hidden font-sans">
      {/* Background Resort Photography Layer (Exact V-11 Reference) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img
          src="/assets/aistudio/file_000000007f6882118a6641812590e14f_11e44e63.png"
          alt="Luxury Resort Cliffside Infinity Pool"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center"
        />
        {/* Scrim Overlay tuned for crisp text contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/25 to-transparent dark:from-black/75 dark:via-black/45 dark:to-black/30" />
      </div>

      {/* Main Split-Panel Presentation (Desktop 60:40 / Mobile Compact Header + Priority Card) */}
      <div className="relative z-10 w-full min-h-screen flex flex-col lg:flex-row items-stretch justify-between">
        {/* Mobile Compact Resort Header (Exact User Preference: Compact header, prioritized auth form) */}
        <div className="lg:hidden p-5 text-white flex flex-col gap-3 relative z-10">
          <div className="flex items-center justify-between">
            <GojjaWordmark size="sm" showDescriptor={true} variant="color" />
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onOpenTvShowcase}
                className="px-3 py-1.5 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 text-white text-[11px] font-semibold inline-flex items-center gap-1.5 shadow-xs"
              >
                <Tv className="w-3.5 h-3.5 text-amber-300" />
                <span>TV Preview</span>
              </button>
              <button
                type="button"
                onClick={() => setShowPersonaDrawer(true)}
                className="px-2.5 py-1.5 rounded-xl bg-black/35 backdrop-blur-md border border-white/20 text-white text-[11px] font-semibold inline-flex items-center gap-1 shadow-xs"
                title="Test 16 Role Personas"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>16 Roles</span>
              </button>
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-extrabold tracking-tight text-white drop-shadow-sm">
              A more connected stay.
            </div>
            <div className="text-xs text-slate-200">
              One platform. Every guest experience.
            </div>
          </div>
        </div>

        {/* Desktop Left Side: Brand Identity, Headlines, 4 Highlight Cards & Heritage Footer */}
        <div className="hidden lg:flex lg:w-[58%] xl:w-[60%] p-8 lg:p-14 xl:p-16 flex-col justify-between text-white">
          {/* Top Logo */}
          <div className="space-y-2">
            <GojjaWordmark size="xl" showDescriptor={true} variant="color" />
          </div>

          {/* Center Brand Statements & 4 Feature Highlights */}
          <div className="my-10 lg:my-auto space-y-8 max-w-2xl">
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold tracking-tight leading-[1.08] text-white drop-shadow-md">
                A more connected stay.
              </h1>
              <p className="text-xl sm:text-2xl font-medium text-slate-100/95 tracking-tight">
                One platform. Every guest experience.
              </p>
              <p className="text-sm sm:text-base text-slate-200/90 leading-relaxed max-w-xl pt-1">
                Manage your properties, screens and hospitality experiences from one secure workspace.
              </p>
            </div>

            {/* 4 Feature Highlight Cards in a Row (Exact V-11) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-2">
              <div className="p-3.5 sm:p-4 rounded-2xl bg-white/10 dark:bg-black/30 backdrop-blur-md border border-white/20 flex flex-col items-start gap-2.5 shadow-lg">
                <div className="w-9 h-9 rounded-xl bg-[#0050F5]/25 border border-[#0050F5]/40 flex items-center justify-center text-blue-200">
                  <Tv className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-white leading-tight">SmartTV & Rooms</div>
                  <div className="text-[10px] text-slate-300">Living room & suite screens</div>
                </div>
              </div>

              <div className="p-3.5 sm:p-4 rounded-2xl bg-white/10 dark:bg-black/30 backdrop-blur-md border border-white/20 flex flex-col items-start gap-2.5 shadow-lg">
                <div className="w-9 h-9 rounded-xl bg-[#7C35E0]/25 border border-[#7C35E0]/40 flex items-center justify-center text-purple-200">
                  <Palette className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-white leading-tight">Brand & Content</div>
                  <div className="text-[10px] text-slate-300">Identity & media library</div>
                </div>
              </div>

              <div className="p-3.5 sm:p-4 rounded-2xl bg-white/10 dark:bg-black/30 backdrop-blur-md border border-white/20 flex flex-col items-start gap-2.5 shadow-lg">
                <div className="w-9 h-9 rounded-xl bg-[#CA3596]/25 border border-[#CA3596]/40 flex items-center justify-center text-pink-200">
                  <Megaphone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-white leading-tight">Channels & Campaigns</div>
                  <div className="text-[10px] text-slate-300">IPTV line-up & offers</div>
                </div>
              </div>

              <div className="p-3.5 sm:p-4 rounded-2xl bg-white/10 dark:bg-black/30 backdrop-blur-md border border-white/20 flex flex-col items-start gap-2.5 shadow-lg">
                <div className="w-9 h-9 rounded-xl bg-[#FF5E70]/25 border border-[#FF5E70]/40 flex items-center justify-center text-rose-200">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-white leading-tight">Fleet & Insights</div>
                  <div className="text-[10px] text-slate-300">ADB health & playback</div>
                </div>
              </div>
            </div>

            {/* Quick TV Preview Trigger */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={onOpenTvShowcase}
                className="px-5 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/30 text-white text-xs font-semibold inline-flex items-center gap-2 transition-all shadow-md group"
              >
                <Tv className="w-4 h-4 text-amber-300 group-hover:scale-110 transition-transform" />
                <span>Launch Interactive TV Guest Experience</span>
              </button>

              <button
                type="button"
                onClick={() => setShowPersonaDrawer(!showPersonaDrawer)}
                className="px-4 py-2.5 rounded-xl bg-black/25 hover:bg-black/40 backdrop-blur-md border border-white/20 text-white text-xs font-semibold inline-flex items-center gap-2 transition-all"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Test 16 Role Personas & RBAC</span>
              </button>
            </div>
          </div>

          {/* Bottom Left Heritage Tagline (Exact V-11) */}
          <div className="pt-6 border-t border-white/15 text-xs tracking-wider space-y-0.5">
            <div className="font-extrabold uppercase text-white/95 tracking-[0.2em]">
              OPEN. CONNECTED. FORWARD.
            </div>
            <div className="text-[11px] uppercase text-white/70 tracking-[0.16em]">
              INDONESIA · HOSPITALITY TECHNOLOGY
            </div>
          </div>
        </div>

        {/* Right Side: Organic Curved White/Pearl Auth Panel (Exact V-11) */}
        <div className="w-full lg:w-[42%] xl:w-[40%] bg-[var(--cms-surface)] rounded-t-[36px] lg:rounded-t-none lg:rounded-l-[48px] p-6 sm:p-10 lg:p-12 flex flex-col justify-between shadow-2xl relative z-20">
          {/* Top Utility Bar: Locale Selector, Sun/Moon Pill, Help */}
          <div className="flex items-center justify-end gap-3 pb-6">
            {/* Locale Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowLocaleMenu(!showLocaleMenu)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--cms-bg)] border border-[var(--cms-divider)] text-xs font-medium hover:border-[var(--brand-indigo)] transition-colors"
                aria-label="Select language"
              >
                <Globe className="w-3.5 h-3.5 text-[var(--cms-text-secondary)]" />
                <span>{locales.find((l) => l.id === activeLocale)?.code || 'EN'}</span>
                <ChevronDown className="w-3 h-3 text-[var(--cms-text-secondary)]" />
              </button>

              {showLocaleMenu && (
                <div className="absolute right-0 top-full mt-1.5 w-40 rounded-xl bg-[var(--cms-surface)] border border-[var(--cms-divider)] shadow-xl p-1 z-50 text-xs">
                  {locales.map((loc) => (
                    <button
                      key={loc.id}
                      type="button"
                      onClick={() => {
                        setActiveLocale(loc.id);
                        setShowLocaleMenu(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-lg flex items-center justify-between ${
                        activeLocale === loc.id
                          ? 'bg-[#EEF0FF] dark:bg-white/10 text-[var(--brand-indigo)] font-semibold'
                          : 'text-[var(--cms-text)] hover:bg-[var(--cms-bg)]'
                      }`}
                    >
                      <span>{loc.label}</span>
                      <span className="text-[10px] text-[var(--cms-text-secondary)]">{loc.code}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Circular Sun/Moon Toggle (Matches 620ms Circular Reveal Pill) */}
            <button
              type="button"
              onClick={onToggleTheme}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--cms-bg)] border border-[var(--cms-divider)] text-xs font-medium hover:opacity-90 transition-all"
              title="Toggle Light / Warm Graphite Dark Mode"
            >
              <Sun
                className={`w-4 h-4 ${
                  theme === 'light' ? 'text-amber-500 fill-amber-400' : 'text-[var(--cms-text-secondary)]'
                }`}
              />
              <span className="text-[var(--cms-divider)]">|</span>
              <Moon
                className={`w-4 h-4 ${
                  theme === 'dark' ? 'text-[#C7B9FF] fill-[#C7B9FF]' : 'text-[var(--cms-text-secondary)]'
                }`}
              />
            </button>

            {/* Help Button */}
            <button
              type="button"
              onClick={() => setShowHelpModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--cms-bg)] border border-[var(--cms-divider)] text-xs font-medium hover:border-[var(--brand-indigo)] text-[var(--cms-text-secondary)] hover:text-[var(--cms-text)] transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Help</span>
            </button>
          </div>

          {/* Form Container (Exact V-11 Layout) */}
          <div className="w-full max-w-sm mx-auto my-auto space-y-6">
            {/* Centered Logo & Greeting */}
            <div className="text-center space-y-2">
              <div className="flex justify-center pb-1">
                <GojjaWordmark size="lg" showDescriptor={true} variant={theme === 'dark' ? 'reverse' : 'color'} />
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-[var(--cms-text)]">
                Welcome back
              </h2>
              <p className="text-xs text-[var(--cms-text-secondary)]">
                Sign in to your GOJJA workspace.
              </p>
            </div>

            {/* DEMO / LIVE_LAB Environment Selector */}
            <div className="p-1 rounded-xl bg-[var(--cms-bg)] border border-[var(--cms-divider)] grid grid-cols-2 gap-1 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setSelectedEnv('DEMO')}
                className={`py-1.5 rounded-lg transition-all ${
                  selectedEnv === 'DEMO'
                    ? 'bg-[var(--brand-indigo)] text-white shadow-xs'
                    : 'text-[var(--cms-text-secondary)] hover:text-[var(--cms-text)]'
                }`}
              >
                DEMO Workspace
              </button>
              <button
                type="button"
                onClick={() => setSelectedEnv('LIVE_LAB')}
                className={`py-1.5 rounded-lg transition-all ${
                  selectedEnv === 'LIVE_LAB'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-[var(--cms-text-secondary)] hover:text-[var(--cms-text)]'
                }`}
              >
                LIVE_LAB (Real ADB)
              </button>
            </div>

            {/* Error Banner */}
            {loginError && (
              <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-800 dark:text-rose-200 text-xs flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{loginError}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleFormSubmit} className="space-y-4">
              {/* Work email */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[var(--cms-text)]">
                  Work email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[var(--cms-text-secondary)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="hello@hotel.com"
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[var(--cms-bg)] border border-[var(--cms-divider)] text-xs text-[var(--cms-text)] focus:outline-2 focus:outline-[var(--brand-indigo)] transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[var(--cms-text)]">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[var(--cms-text-secondary)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[var(--cms-bg)] border border-[var(--cms-divider)] text-xs text-[var(--cms-text)] focus:outline-2 focus:outline-[var(--brand-indigo)] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--cms-text-secondary)] hover:text-[var(--cms-text)]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember me & Forgot password */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="inline-flex items-center gap-2 cursor-pointer select-none text-[var(--cms-text)] font-medium">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-[var(--brand-indigo)] border-[var(--cms-divider)] focus:ring-0"
                  />
                  <span>Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={() =>
                    alert('Password reset link sent to registered administrator contact in DEMO workspace.')
                  }
                  className="font-medium text-[var(--cms-link)] hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              {/* Primary Action Button (Vivid Indigo Gradient .btn-luxury-indigo) */}
              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl btn-luxury-indigo text-white text-xs font-bold inline-flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.99]"
              >
                <span>Sign in</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Divider 'or' */}
            <div className="relative flex items-center justify-center my-4">
              <div className="border-t border-[var(--cms-divider)] w-full" />
              <span className="bg-[var(--cms-surface)] px-3 text-[11px] text-[var(--cms-text-secondary)] uppercase tracking-wider">
                or
              </span>
            </div>

            {/* Continue with Google */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full py-2.5 px-4 rounded-xl bg-[var(--cms-bg)] hover:bg-black/5 dark:hover:bg-white/5 border border-[var(--cms-divider)] text-xs font-semibold text-[var(--cms-text)] inline-flex items-center justify-center gap-2.5 transition-colors"
            >
              {/* Google 4-color SVG mark */}
              <svg className="w-4 h-4" viewBox="0 0 24 24">
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
              <span>Continue with Google</span>
            </button>

            {/* Security Note & Support Link (Exact V-11) */}
            <div className="pt-2 text-center space-y-2">
              <div className="inline-flex items-center gap-1.5 text-[11px] text-[var(--cms-text-secondary)]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Secure access for your organization.</span>
              </div>
              <div className="text-[11px] text-[var(--cms-text-secondary)]">
                Need access?{' '}
                <button
                  type="button"
                  onClick={() => setShowHelpModal(true)}
                  className="font-semibold text-[var(--cms-link)] hover:underline"
                >
                  Contact your administrator.
                </button>
              </div>
              <div className="text-[10px] text-[var(--cms-text-secondary)] pt-1">
                By continuing, you agree to our{' '}
                <a href="#terms" className="underline hover:text-[var(--cms-text)]">
                  Terms
                </a>{' '}
                and{' '}
                <a href="#privacy" className="underline hover:text-[var(--cms-text)]">
                  Privacy Policy
                </a>
                .
              </div>
            </div>
          </div>

          {/* Footer inside Right Panel (Exact V-11) */}
          <div className="pt-6 border-t border-[var(--cms-divider)] flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-[var(--cms-text-secondary)]">
            <span>© 2026 GOJJA SmartTV</span>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                All systems operational
              </span>
              <span>·</span>
              <span className="font-mono-tabular">31 October 2026</span>
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
                  <h3 className="text-base font-bold text-[var(--cms-text)]">Role Personas & RBAC Catalog</h3>
                  <p className="text-xs text-[var(--cms-text-secondary)]">
                    Select any persona to pre-fill credentials and test authorization scopes
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPersonaDrawer(false)}
                  className="px-2.5 py-1 rounded-lg bg-[var(--cms-bg)] text-xs font-semibold hover:opacity-80"
                >
                  ✕ Close
                </button>
              </div>

              {/* Grouped Personas */}
              <div className="space-y-3">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--cms-text-secondary)]">
                  Property Operations (Direct)
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
                      className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-center justify-between ${
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
                  ISP & Reseller Partner
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
                      className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-center justify-between ${
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
                  GOJJA Central & Field Ops
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
                      className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-center justify-between ${
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
              Click any persona to auto-fill the login form with their email.
            </div>
          </div>
        </div>
      )}

      {/* Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[var(--cms-surface)] rounded-2xl p-6 shadow-2xl border border-[var(--cms-divider)] space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--cms-divider)]">
              <h3 className="font-bold text-base text-[var(--cms-text)]">GOJJA Workspace Help</h3>
              <button
                type="button"
                onClick={() => setShowHelpModal(false)}
                className="text-xs px-2 py-1 rounded bg-[var(--cms-bg)]"
              >
                ✕
              </button>
            </div>
            <div className="text-xs text-[var(--cms-text-secondary)] space-y-2 leading-relaxed">
              <p>
                <strong>DEMO Workspace:</strong> Safe sandbox pre-seeded with 3 properties, 14 endpoints, 4 locales, and full synthetic telemetry.
              </p>
              <p>
                <strong>LIVE_LAB Workspace:</strong> Real local LAN scanner & real ADB bridge. Requires running the companion <code>gojja-connector.mjs</code> on your workstation or LAN. Zero fake devices will be shown.
              </p>
              <p>
                <strong>Need an account?</strong> Contact your property administrator or GOJJA platform operations at <code>support@gojja.tv</code>.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowHelpModal(false)}
              className="w-full py-2.5 rounded-xl bg-[var(--brand-indigo)] text-white text-xs font-bold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
