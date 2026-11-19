import React from 'react';
import { Film, Tv, ShieldCheck, CheckCircle2, AlertTriangle, Layers } from 'lucide-react';
import { ENTERTAINMENT_APPS, type TvExperienceSettings, type EntertainmentAppId } from '../data/tvExperience';

interface Props {
  canManage?: boolean;
  value: TvExperienceSettings;
  onChange: (value: TvExperienceSettings) => void;
  licensed: boolean;
  compact?: boolean;
}

const APP_BRAND_STYLES: Record<EntertainmentAppId, { bg: string; text: string; badge: string; desc: string }> = {
  netflix: {
    bg: 'bg-red-500/10 border-red-500/20',
    text: 'text-red-700 dark:text-red-400',
    badge: 'bg-red-600 text-white',
    desc: 'Movies, Series & Originals',
  },
  'hbo-max': {
    bg: 'bg-purple-500/10 border-purple-500/20',
    text: 'text-purple-700 dark:text-purple-300',
    badge: 'bg-purple-700 text-white',
    desc: 'Blockbusters & HBO Originals',
  },
  'apple-tv': {
    bg: 'bg-slate-500/10 border-slate-500/20',
    text: 'text-slate-800 dark:text-slate-200',
    badge: 'bg-slate-800 text-white',
    desc: 'Apple Original Stories & 4K HDR',
  },
  'prime-video': {
    bg: 'bg-sky-500/10 border-sky-500/20',
    text: 'text-sky-700 dark:text-sky-300',
    badge: 'bg-sky-600 text-white',
    desc: 'Amazon Prime Movies & Series',
  },
  'disney-plus': {
    bg: 'bg-blue-500/10 border-blue-500/20',
    text: 'text-blue-700 dark:text-blue-300',
    badge: 'bg-blue-700 text-white',
    desc: 'Disney, Pixar, Marvel, Star Wars',
  },
  youtube: {
    bg: 'bg-rose-500/10 border-rose-500/20',
    text: 'text-rose-700 dark:text-rose-400',
    badge: 'bg-rose-600 text-white',
    desc: 'Global Video Streaming & Music',
  },
};

export function TvEntertainmentSettings({ value, onChange, licensed, canManage = true, compact = false }: Props) {
  const enabledCount = ENTERTAINMENT_APPS.filter((app) => value.apps[app.id]).length;

  return (
    <section
      className={`rounded-2xl bg-[var(--cms-surface)] border border-[var(--cms-divider)] shadow-xs ${
        compact ? 'p-3.5 sm:p-4 space-y-3.5' : 'p-6 space-y-5'
      }`}
      aria-label="Aplikasi Hiburan berbayar"
    >
      {/* Header Bar */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--cms-divider)] ${
        compact ? 'pb-3' : 'pb-4'
      }`}>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Film className="w-5 h-5 text-[#0050F5]" />
            <h3 className={`font-bold text-[var(--cms-text)] ${compact ? 'text-sm' : 'text-base'}`}>
              Aplikasi Hiburan Streaming · Add-on GOJJA
            </h3>
          </div>
          <p className="text-xs text-[var(--cms-text-secondary)]">
            Televisi untuk siaran live/IPTV; Hiburan untuk aplikasi OTT streaming berlisensi hospitality di TV kamar tamu.
          </p>
        </div>

        <div className="shrink-0">
          {licensed ? (
            <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Lisensi Add-On Aktif</span>
            </span>
          ) : (
            <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/20 inline-flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Lisensi Belum Aktif / Ditangguhkan</span>
            </span>
          )}
        </div>
      </div>

      {/* Master Toggle Card */}
      <div
        className={`rounded-xl border transition-all ${
          compact ? 'p-3' : 'p-4'
        } ${
          value.appsEnabled
            ? 'bg-[#0050F5]/5 border-[#0050F5]/30'
            : 'bg-[var(--cms-bg)]/60 border-[var(--cms-divider)]'
        }`}
      >
        <label className="flex items-start sm:items-center justify-between gap-3 cursor-pointer">
          <div className="space-y-0.5">
            <div className="text-sm font-bold text-[var(--cms-text)] flex items-center gap-2">
              <Tv className="w-4 h-4 text-[#0050F5]" />
              <span>Tampilkan Menu Hiburan di Layar SmartTV Tamu</span>
            </div>
            <p className="text-xs text-[var(--cms-text-secondary)]">
              Saat diaktifkan, remote TV dapat mengakses menu &quot;03. Hiburan&quot; untuk meluncurkan aplikasi streaming.
            </p>
          </div>
          <input
            type="checkbox"
            checked={value.appsEnabled}
            disabled={!licensed || !canManage}
            onChange={(e) => onChange({ ...value, appsEnabled: e.target.checked })}
            className="w-5 h-5 rounded-md accent-[#0050F5] cursor-pointer mt-0.5 sm:mt-0 shrink-0"
          />
        </label>
      </div>

      {/* App Tiles Grid / List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="text-xs font-bold uppercase tracking-wider text-[var(--cms-text-secondary)] flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" />
            <span>Katalog Aplikasi Streaming ({enabledCount} dari {ENTERTAINMENT_APPS.length} Aktif)</span>
          </div>
          {!compact && (
            <span className="text-[11px] text-[var(--cms-text-secondary)]">
              Klik kartu aplikasi untuk menyalakan/mematikan
            </span>
          )}
        </div>

        {compact ? (
          /* Compact Studio Rail Mode: Stacked horizontal rows (zero clipping or column cramming) */
          <div className="flex flex-col space-y-2">
            {ENTERTAINMENT_APPS.map((app) => {
              const isEnabled = !!value.apps[app.id];
              const brand = APP_BRAND_STYLES[app.id];
              const isDisabled = !licensed || !value.appsEnabled || !canManage;

              return (
                <div
                  key={app.id}
                  onClick={() => {
                    if (isDisabled) return;
                    onChange({
                      ...value,
                      apps: { ...value.apps, [app.id]: !isEnabled },
                    });
                  }}
                  className={`p-2.5 rounded-xl border transition-all text-xs select-none flex items-center justify-between gap-2.5 ${
                    isDisabled
                      ? 'opacity-50 cursor-not-allowed bg-[var(--cms-bg)]/40 border-[var(--cms-divider)]'
                      : isEnabled
                      ? 'bg-[var(--cms-surface)] border-[#0050F5] shadow-xs cursor-pointer ring-1 ring-[#0050F5]/20'
                      : 'bg-[var(--cms-surface)] border-[var(--cms-divider)] hover:border-[var(--cms-control-border)] cursor-pointer'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center font-extrabold text-[11px] shadow-xs ${brand.badge}`}>
                      {app.name.slice(0, 2).toUpperCase()}
                    </span>
                    <div className="min-w-0">
                      <div className="font-bold text-xs text-[var(--cms-text)] truncate">{app.name}</div>
                      <div className="text-[10px] text-[var(--cms-text-secondary)] truncate">{brand.desc}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-[10px] font-semibold ${isEnabled ? 'text-emerald-600 dark:text-emerald-400' : 'text-[var(--cms-text-secondary)]'}`}>
                      {isEnabled ? '● Tayang' : '○ Nonaktif'}
                    </span>
                    <input
                      type="checkbox"
                      checked={isEnabled}
                      disabled={isDisabled}
                      onChange={(e) => {
                        e.stopPropagation();
                        onChange({
                          ...value,
                          apps: { ...value.apps, [app.id]: e.target.checked },
                        });
                      }}
                      className="w-4 h-4 rounded accent-[#0050F5] cursor-pointer"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Full Page Tab Mode: Multi-column grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3.5">
            {ENTERTAINMENT_APPS.map((app) => {
              const isEnabled = !!value.apps[app.id];
              const brand = APP_BRAND_STYLES[app.id];
              const isDisabled = !licensed || !value.appsEnabled || !canManage;

              return (
                <div
                  key={app.id}
                  onClick={() => {
                    if (isDisabled) return;
                    onChange({
                      ...value,
                      apps: { ...value.apps, [app.id]: !isEnabled },
                    });
                  }}
                  className={`p-4 rounded-xl border transition-all text-xs select-none ${
                    isDisabled
                      ? 'opacity-50 cursor-not-allowed bg-[var(--cms-bg)]/40 border-[var(--cms-divider)]'
                      : isEnabled
                      ? 'bg-[var(--cms-surface)] border-[#0050F5] shadow-xs cursor-pointer ring-1 ring-[#0050F5]/20'
                      : 'bg-[var(--cms-surface)] border-[var(--cms-divider)] hover:border-[var(--cms-control-border)] cursor-pointer'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2.5">
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <span className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center font-extrabold text-[11px] shadow-xs ${brand.badge}`}>
                        {app.name.slice(0, 2).toUpperCase()}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-sm text-[var(--cms-text)] truncate">{app.name}</div>
                        <div className="text-[10px] text-[var(--cms-text-secondary)] truncate">{brand.desc}</div>
                      </div>
                    </div>

                    <input
                      type="checkbox"
                      checked={isEnabled}
                      disabled={isDisabled}
                      onChange={(e) => {
                        e.stopPropagation();
                        onChange({
                          ...value,
                          apps: { ...value.apps, [app.id]: e.target.checked },
                        });
                      }}
                      className="w-4 h-4 rounded accent-[#0050F5] cursor-pointer shrink-0 mt-0.5"
                    />
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-[var(--cms-divider)] flex flex-wrap items-center justify-between gap-1.5 text-[11px]">
                    <span className="text-[var(--cms-text-secondary)] font-medium">Status TV:</span>
                    <span className={`inline-flex items-center gap-1.5 font-bold text-[10px] px-2 py-0.5 rounded-full ${
                      isEnabled 
                        ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300' 
                        : 'bg-black/5 dark:bg-white/5 text-[var(--cms-text-secondary)]'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${isEnabled ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                      <span>{isEnabled ? 'Tayang di TV' : 'Tidak Aktif'}</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Provisioning & Hotel Account Binding Section */}
      {enabledCount > 0 && (
        <div className="rounded-xl border border-[var(--cms-divider)] bg-[var(--cms-bg)]/50 p-4 space-y-3.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <div className="font-bold text-sm text-[var(--cms-text)]">
              Konfigurasi Kepemilikan Akun & Referensi Provisioning MDM
            </div>
            <span className="text-[11px] text-[var(--cms-text-secondary)]">
              Akun dikelola terpusat oleh Hotel / ISP dan tidak dapat diubah dari remote TV tamu
            </span>
          </div>

          <div className="space-y-2.5">
            {ENTERTAINMENT_APPS.filter((app) => value.apps[app.id]).map((app) => {
              if (compact) {
                return (
                  <div
                    key={app.id}
                    className="p-3 rounded-xl bg-[var(--cms-surface)] border border-[var(--cms-divider)] space-y-2.5 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-5 h-5 rounded-md flex items-center justify-center font-bold text-[9px] ${APP_BRAND_STYLES[app.id].badge}`}>
                        {app.name.slice(0, 2).toUpperCase()}
                      </span>
                      <span className="font-bold text-xs text-[var(--cms-text)]">{app.name}</span>
                    </div>

                    <div>
                      <label className="block text-[10px] text-[var(--cms-text-secondary)] font-medium mb-1">
                        Kepemilikan Akun
                      </label>
                      <select
                        aria-label={`Pemilik akun ${app.name}`}
                        disabled={!canManage}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-[var(--cms-input)] border border-[var(--cms-control-border)] text-xs font-semibold focus:ring-2 focus:ring-[#0050F5] outline-none"
                        value={value.appProfiles[app.id].owner}
                        onChange={(e) =>
                          onChange({
                            ...value,
                            appProfiles: {
                              ...value.appProfiles,
                              [app.id]: {
                                ...value.appProfiles[app.id],
                                owner: e.target.value as 'PROPERTY' | 'ISP',
                              },
                            },
                          })
                        }
                      >
                        <option value="PROPERTY">Properti / Hotel Mandiri</option>
                        <option value="ISP">ISP / Mitra Bundling Paket</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] text-[var(--cms-text-secondary)] font-medium mb-1">
                        Referensi Provisioning MDM
                      </label>
                      <input
                        aria-label={`Referensi akun ${app.name}`}
                        maxLength={120}
                        disabled={!canManage}
                        placeholder={`Contoh: ARUNIKA-${app.id.toUpperCase()}-SUITE`}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-[var(--cms-input)] border border-[var(--cms-control-border)] text-xs font-mono-tabular focus:ring-2 focus:ring-[#0050F5] outline-none"
                        value={value.appProfiles[app.id].reference}
                        onChange={(e) =>
                          onChange({
                            ...value,
                            appProfiles: {
                              ...value.appProfiles,
                              [app.id]: {
                                ...value.appProfiles[app.id],
                                reference: e.target.value,
                              },
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={app.id}
                  className="p-3 rounded-xl bg-[var(--cms-surface)] border border-[var(--cms-divider)] grid grid-cols-1 md:grid-cols-12 gap-3 items-center text-xs"
                >
                  <div className="md:col-span-3 flex items-center gap-2">
                    <span className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-[10px] ${APP_BRAND_STYLES[app.id].badge}`}>
                      {app.name.slice(0, 2).toUpperCase()}
                    </span>
                    <span className="font-bold text-sm text-[var(--cms-text)]">{app.name}</span>
                  </div>

                  <div className="md:col-span-4">
                    <label className="block text-[11px] text-[var(--cms-text-secondary)] font-medium mb-1">
                      Kepemilikan Akun
                    </label>
                    <select
                      aria-label={`Pemilik akun ${app.name}`}
                      disabled={!canManage}
                      className="w-full px-3 py-2 rounded-xl bg-[var(--cms-input)] border border-[var(--cms-control-border)] text-xs font-semibold focus:ring-2 focus:ring-[#0050F5] outline-none"
                      value={value.appProfiles[app.id].owner}
                      onChange={(e) =>
                        onChange({
                          ...value,
                          appProfiles: {
                            ...value.appProfiles,
                            [app.id]: {
                              ...value.appProfiles[app.id],
                              owner: e.target.value as 'PROPERTY' | 'ISP',
                            },
                          },
                        })
                      }
                    >
                      <option value="PROPERTY">Properti / Hotel Mandiri</option>
                      <option value="ISP">ISP / Mitra Bundling Paket</option>
                    </select>
                  </div>

                  <div className="md:col-span-5">
                    <label className="block text-[11px] text-[var(--cms-text-secondary)] font-medium mb-1">
                      Referensi Provisioning (MDM ID, Bukan Password)
                    </label>
                    <input
                      aria-label={`Referensi akun ${app.name}`}
                      maxLength={120}
                      disabled={!canManage}
                      placeholder={`Contoh: ARUNIKA-${app.id.toUpperCase()}-SUITE`}
                      className="w-full px-3 py-2 rounded-xl bg-[var(--cms-input)] border border-[var(--cms-control-border)] text-xs font-mono-tabular focus:ring-2 focus:ring-[#0050F5] outline-none"
                      value={value.appProfiles[app.id].reference}
                      onChange={(e) =>
                        onChange({
                          ...value,
                          appProfiles: {
                            ...value.appProfiles,
                            [app.id]: {
                              ...value.appProfiles[app.id],
                              reference: e.target.value,
                            },
                          },
                        })
                      }
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Security Architecture & MDM Sandbox Callout */}
      <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-bold text-blue-900 dark:text-blue-200">
            Jaminan Keamanan Sandboxed & Zero-Credential (Zero-PII Compliance)
          </div>
          <p className="text-[11px] text-blue-700 dark:text-blue-300 leading-relaxed">
            Perubahan konfigurasi langsung tercermin pada pratinjau TV. Simpan konfigurasi untuk menerapkan ke draft. Jangan pernah memasukkan password atau token sensitif pada kolom referensi. Aktivasi akun dan peluncuran terisolasi dikontrol oleh hospitality launcher pada hardware TV kamar, dan riwayat login otomatis dibersihkan saat tamu check-out.
          </p>
        </div>
      </div>
    </section>
  );
}
