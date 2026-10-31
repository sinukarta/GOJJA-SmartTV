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
  Building2,
  Network,
  Sparkles,
  CheckCircle2,
  Layers,
} from 'lucide-react';
import {
  EnvironmentId,
  UserAccount,
  RoleDefinition,
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
  const [portalTab, setPortalTab] = useState<'Property' | 'ISP' | 'GOJJA'>('Property');
  const [emailInput, setEmailInput] = useState<string>('you@hotelarunika.com');
  const [passwordInput, setPasswordInput] = useState<string>('••••••••••••');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [selectedEnv, setSelectedEnv] = useState<EnvironmentId>('DEMO');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [activeBoardIdx, setActiveBoardIdx] = useState<number>(0);

  const handlePortalTabSelect = (tab: 'Property' | 'ISP' | 'GOJJA') => {
    setPortalTab(tab);
    setLoginError(null);
    if (tab === 'Property') setEmailInput('you@hotelarunika.com');
    else if (tab === 'ISP') setEmailInput('admin@alphahospitality.net.id');
    else setEmailInput('platform.admin@gojja.tv');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    const q = emailInput.trim().toLowerCase();
    const matched =
      userAccounts.find((u) => u.email.toLowerCase() === q || u.alias.toLowerCase() === q) ||
      userAccounts.find((u) => u.alias === 'property-manager')!;

    if (selectedEnv === 'LIVE_LAB' && !matched.allowedEnvironments.includes('LIVE_LAB')) {
      setLoginError(
        `Role ${matched.badgeLabel} (${matched.roleId}) is scoped to DEMO only. Choose Property Manager, Field Installer, ISP Alpha Admin, or Platform Admin for LIVE_LAB.`
      );
      return;
    }
    onLoginSuccess(matched, selectedEnv);
  };

  const referenceBoards = [
    {
      title: 'V-06 • Linen Hospitality CMS & Dark Mode Suite',
      caption: 'Split-panel login, property overview, branding & content editor, and Warm Graphite Dark mode.',
      src: '/assets/aistudio/GOJJA_SmartTV_linen_hospitality_dashboard_886c6353.png',
    },
    {
      title: 'V-05 • GOJJA Open Future Brand & Digital Experience System v1.0',
      caption: 'Custom lowercase gojja wordmark geometry, 5-color spectrum, typography scales, and Corbel motion language.',
      src: '/assets/aistudio/GOJJA_SmartTV_open_future_design_system_c976ac35.png',
    },
    {
      title: 'V-04 • Hospitality 10-Foot Guest TV Experience Showcase',
      caption: 'Splash & Welcome, Personalized Home, Live TV Guide, Spa Promotion, Dining & QR, and 4-Locale Selector.',
      src: '/assets/aistudio/Hotel_Tentrem_SmartTV_App_Showcase_62a23bd8.png',
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--cms-bg)] text-[var(--cms-text)] flex flex-col">
      {/* Top 3-Zone Navigation Bar (Follows Top Bar Contract) */}
      <header className="flex items-center justify-between gap-8 px-6 md:px-10 py-4 bg-[var(--cms-header)] border-b border-[var(--cms-divider)]">
        <a href="#top" className="whitespace-nowrap shrink-0">
          <GojjaWordmark size="sm" showDescriptor={true} variant={theme === 'dark' ? 'reverse' : 'color'} />
        </a>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[var(--cms-text-secondary)]">
          <a href="#login-split" className="hover:text-[var(--cms-text)] transition-colors whitespace-nowrap shrink-0">
            Workspace Sign In
          </a>
          <a href="#rbac-personas" className="hover:text-[var(--cms-text)] transition-colors whitespace-nowrap shrink-0">
            16 Role Personas
          </a>
          <a href="#architecture" className="hover:text-[var(--cms-text)] transition-colors whitespace-nowrap shrink-0">
            Platform Architecture
          </a>
          <a href="#design-boards" className="hover:text-[var(--cms-text)] transition-colors whitespace-nowrap shrink-0">
            Design System & TV Mockups
          </a>
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenTvShowcase}
            className="px-4 py-2 rounded-xl bg-[#0050F5] hover:bg-[#0040C8] text-white text-xs font-semibold transition-colors whitespace-nowrap shrink-0 inline-flex items-center gap-2"
          >
            <Tv className="w-3.5 h-3.5" />
            <span>Launch TV Guest App</span>
          </button>
        </div>
      </header>

      {/* Main Split-Panel Login & Hospitality Hero (Matches 01 / LOGIN in Linen Hospitality Mockup) */}
      <main id="login-split" className="max-w-7xl w-full mx-auto px-4 md:px-8 py-8 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 rounded-3xl overflow-hidden border border-[var(--cms-divider)] bg-[var(--cms-surface)] shadow-sm items-stretch">
          {/* Left Hospitality Photography Panel */}
          <div className="lg:col-span-6 relative min-h-[360px] lg:min-h-[600px] flex flex-col justify-between p-8 md:p-10 overflow-hidden">
            <img
              src="/assets/aistudio/GOJJA_SmartTV_linen_hospitality_dashboard_886c6353.png"
              alt="Hospitality Resort Sanctuary Pool"
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover object-left-top scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#10172F]/90 via-[#10172F]/45 to-[#10172F]/25" />

            <div className="relative z-10 flex items-center justify-between">
              <span className="text-xs font-semibold tracking-widest uppercase text-[#F8F5EE]/90">
                OPEN FUTURE • HOSPITALITY CORE P1
              </span>
              <span className="text-xs font-mono-tabular text-[#F8F5EE]/80">
                SSOT Seed v1.0 • 3 Properties · 14 TVs
              </span>
            </div>

            <div className="relative z-10 space-y-4 max-w-md mt-auto">
              <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight tracking-tight" style={{ textWrap: 'balance' }}>
                A more connected, more human tomorrow.
              </h1>
              <p className="text-sm text-slate-200 leading-relaxed">
                Centralize guest welcome experiences, multi-layer property branding, provider channel packages, and authorized local ADB device onboarding across direct hotels and ISP partner fleets.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-amber-200/95">
                <span>30 Contracted Seats</span>
                <span>·</span>
                <span>14 Allocated TVs</span>
                <span>·</span>
                <span>4 Guest Locales (ID/EN/中文/日本語)</span>
              </div>
            </div>
          </div>

          {/* Right Authentication & Workspace Form Panel */}
          <div className="lg:col-span-6 p-8 md:p-12 flex flex-col justify-between bg-[var(--cms-surface)]">
            {/* Top Theme Mode Control (Sun / Moon Pill matching Linen Hospitality 01 / LOGIN) */}
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-[var(--cms-bg)] border border-[var(--cms-divider)] text-xs">
                <button
                  type="button"
                  onClick={() => setSelectedEnv('DEMO')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                    selectedEnv === 'DEMO'
                      ? 'bg-[#0050F5] text-white'
                      : 'text-[var(--cms-text-secondary)] hover:text-[var(--cms-text)]'
                  }`}
                >
                  DEMO Workspace
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedEnv('LIVE_LAB')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                    selectedEnv === 'LIVE_LAB'
                      ? 'bg-emerald-600 text-white'
                      : 'text-[var(--cms-text-secondary)] hover:text-[var(--cms-text)]'
                  }`}
                >
                  LIVE_LAB (Real ADB)
                </button>
              </div>

              <button
                type="button"
                onClick={onToggleTheme}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--cms-bg)] border border-[var(--cms-divider)] text-xs font-medium hover:opacity-90 transition-all"
                title="Toggle Light / Warm Graphite Dark Mode (620ms circular reveal)"
              >
                <Sun className={`w-4 h-4 ${theme === 'light' ? 'text-amber-500 fill-amber-400' : 'text-[var(--cms-text-secondary)]'}`} />
                <Moon className={`w-4 h-4 ${theme === 'dark' ? 'text-[#C7B9FF] fill-[#C7B9FF]' : 'text-[var(--cms-text-secondary)]'}`} />
              </button>
            </div>

            {/* Center Wordmark & Form */}
            <div className="my-8 max-w-md mx-auto w-full space-y-6">
              <div className="text-center space-y-2">
                <div className="flex justify-center">
                  <GojjaWordmark size="lg" showDescriptor={true} variant={theme === 'dark' ? 'reverse' : 'color'} />
                </div>
                <h2 className="text-xl font-bold pt-2">Welcome to GOJJA SmartTV</h2>
                <p className="text-sm text-[var(--cms-text-secondary)]">
                  Hospitality entertainment. Made human.
                </p>
              </div>

              {/* Property / ISP / GOJJA Segmented Switcher */}
              <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-[var(--cms-bg)] border border-[var(--cms-divider)] text-xs font-semibold">
                {(['Property', 'ISP', 'GOJJA'] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => handlePortalTabSelect(tab)}
                    className={`py-2 rounded-lg transition-all ${
                      portalTab === tab
                        ? 'bg-[var(--cms-surface)] text-[var(--cms-text)] shadow-xs'
                        : 'text-[var(--cms-text-secondary)] hover:text-[var(--cms-text)]'
                    }`}
                  >
                    {tab === 'GOJJA' ? 'GOJJA Central' : tab}
                  </button>
                ))}
              </div>

              {loginError && (
                <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-800 dark:text-rose-200 text-xs">
                  {loginError}
                </div>
              )}

              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[var(--cms-text-secondary)] mb-1">
                    Work Email or Role Alias
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[var(--cms-text-secondary)] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--cms-input)] border border-[var(--cms-control-border)] text-sm focus:outline-2 focus:outline-[#0050F5]"
                      placeholder="you@hotelarunika.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[var(--cms-text-secondary)] mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[var(--cms-text-secondary)] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      required
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[var(--cms-input)] border border-[var(--cms-control-border)] text-sm focus:outline-2 focus:outline-[#0050F5]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--cms-text-secondary)] hover:text-[var(--cms-text)]"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-[var(--cms-control-border)] accent-[#0050F5]"
                    />
                    <span>Remember me</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setEmailInput('you@hotelarunika.com')}
                    className="text-[var(--cms-link)] font-medium hover:underline"
                  >
                    Reset to default account
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-5 rounded-xl bg-[#0050F5] hover:bg-[#0040C8] text-white font-semibold text-sm inline-flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <span>Sign in to {selectedEnv}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>

            {/* Bottom Quick Access Bar */}
            <div className="pt-4 border-t border-[var(--cms-divider)] flex flex-wrap items-center justify-between gap-2 text-xs text-[var(--cms-text-secondary)]">
              <span>Quick Entry:</span>
              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { alias: 'property-manager', label: 'Property Manager (P-01)' },
                  { alias: 'alpha-admin', label: 'ISP Alpha Admin' },
                  { alias: 'alpha-installer', label: 'Field Installer (ADB)' },
                  { alias: 'demo-platform-admin', label: 'GOJJA Platform Admin' },
                  { alias: 'demo-finance', label: 'GOJJA Finance' },
                ].map((quick) => (
                  <button
                    key={quick.alias}
                    type="button"
                    onClick={() => {
                      const acc = userAccounts.find((u) => u.alias === quick.alias)!;
                      onLoginSuccess(acc, selectedEnv === 'LIVE_LAB' && acc.allowedEnvironments.includes('LIVE_LAB') ? 'LIVE_LAB' : 'DEMO');
                    }}
                    className="px-2.5 py-1 rounded-lg bg-[var(--cms-bg)] hover:bg-[#0050F5] hover:text-white border border-[var(--cms-divider)] font-medium transition-colors"
                  >
                    {quick.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: Interactive 16-Role Server-Side RBAC Persona Matrix */}
        <section id="rbac-personas" className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#0050F5] dark:text-[#C7B9FF]">
                01. SERVER-SIDE RBAC & LEAST-PRIVILEGE PERSONAS
              </span>
              <h2 className="text-2xl font-bold mt-1">
                One-Click Role & Scope Inspector (R-01 through R-16)
              </h2>
            </div>
            <p className="text-xs text-[var(--cms-text-secondary)] max-w-md">
              Select any persona below to launch directly into their scoped surface. Every API mutation and query enforces role grants, partner relationships, and property ownership on the server.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {userAccounts.map((acc) => {
              const role = rolesCatalog.find((r) => r.id === acc.roleId);
              return (
                <div
                  key={acc.id}
                  className="p-4 rounded-2xl bg-[var(--cms-surface)] border border-[var(--cms-divider)] flex flex-col justify-between gap-3 hover:border-[#0050F5] transition-colors"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono-tabular font-bold text-[#0050F5] dark:text-[#C7B9FF]">
                        {acc.roleId} · {acc.badgeLabel}
                      </span>
                      <span className="text-[11px] text-[var(--cms-text-secondary)] font-mono-tabular">
                        Scope: {acc.propertyIds.join(', ')}
                      </span>
                    </div>
                    <div className="text-sm font-bold">{acc.name}</div>
                    <div className="text-[11px] text-[var(--cms-text-secondary)] font-mono-tabular truncate">
                      {acc.email}
                    </div>
                    <p className="text-xs text-[var(--cms-text-secondary)] line-clamp-2 pt-1">
                      {role?.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[var(--cms-divider)] flex items-center justify-between gap-2">
                    <span className="text-[11px] text-[var(--cms-text-secondary)]">
                      {role?.permissions.length || 0} grants · {role?.exclusions.length || 0} exclusions
                    </span>
                    <button
                      onClick={() => onLoginSuccess(acc, 'DEMO')}
                      className="px-3 py-1.5 rounded-lg bg-[#0050F5] hover:bg-[#0040C8] text-white text-xs font-semibold inline-flex items-center gap-1 transition-colors"
                    >
                      <span>Enter as {acc.roleId}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION 3: Visual Design Boards & TV Guest App Reference Gallery */}
        <section id="design-boards" className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#0050F5] dark:text-[#C7B9FF]">
                02. OFFICIAL DESIGN SYSTEM & HOSPITALITY SHOWCASE BOARDS
              </span>
              <h2 className="text-2xl font-bold mt-1">
                Visual Reference Gallery (V-04, V-05 & V-06)
              </h2>
            </div>

            <div className="flex items-center gap-1.5">
              {referenceBoards.map((b, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveBoardIdx(idx)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                    activeBoardIdx === idx
                      ? 'bg-[#0050F5] text-white'
                      : 'bg-[var(--cms-surface)] border border-[var(--cms-divider)] text-[var(--cms-text-secondary)]'
                  }`}
                >
                  Board 0{idx + 1}
                </button>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-[var(--cms-surface)] border border-[var(--cms-divider)] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-bold">{referenceBoards[activeBoardIdx].title}</h3>
                <p className="text-xs text-[var(--cms-text-secondary)]">
                  {referenceBoards[activeBoardIdx].caption}
                </p>
              </div>
              <button
                onClick={onOpenTvShowcase}
                className="px-4 py-2 rounded-xl bg-[#0050F5] text-white text-xs font-semibold inline-flex items-center gap-2 shrink-0"
              >
                <Tv className="w-3.5 h-3.5" />
                <span>Open Interactive 16:9 TV Guest Simulator</span>
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden border border-[var(--cms-divider)] bg-black/5">
              <img
                src={referenceBoards[activeBoardIdx].src}
                alt={referenceBoards[activeBoardIdx].title}
                referrerPolicy="no-referrer"
                className="w-full h-auto object-contain max-h-[620px] mx-auto"
              />
            </div>
          </div>
        </section>

        {/* SECTION 4: Architectural Pillars */}
        <section id="architecture" className="grid grid-cols-1 md:grid-cols-3 gap-5 pb-8">
          <div className="p-5 rounded-2xl bg-[var(--cms-surface)] border border-[var(--cms-divider)] space-y-2">
            <Layers className="w-5 h-5 text-[#0050F5]" />
            <h3 className="text-base font-bold">01. Multi-Layer Branding & Inheritance</h3>
            <p className="text-xs text-[var(--cms-text-secondary)] leading-relaxed">
              Platform → Customer → Property → Room Class → Room → Stay resolution with field-level provenance, 4 guest locales, and atomic manifest publication.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-[var(--cms-surface)] border border-[var(--cms-divider)] space-y-2">
            <Network className="w-5 h-5 text-[#0050F5]" />
            <h3 className="text-base font-bold">02. Real Local Connector & ADB Lab</h3>
            <p className="text-xs text-[var(--cms-text-secondary)] leading-relaxed">
              Explicit local network consent, bounded /24 RFC1918 discovery, port 5555 and wireless TLS pairing routes, and verified read-only getprop device inventory.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-[var(--cms-surface)] border border-[var(--cms-divider)] space-y-2">
            <ShieldCheck className="w-5 h-5 text-[#0050F5]" />
            <h3 className="text-base font-bold">03. Two-Stage Update & Financial Integrity</h3>
            <p className="text-xs text-[var(--cms-text-secondary)] leading-relaxed">
              Separates GOJJA technical artifact approval from hotel maintenance windows and room housekeeping readiness, alongside idempotent wholesale/direct invoicing.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};
