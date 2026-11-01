import React, { useEffect, useState, useCallback } from 'react';
import {
  Tv,
  Utensils,
  Sparkles,
  Building2,
  Headphones,
  Globe,
  Play,
  ChevronRight,
  ArrowLeft,
  QrCode,
  Volume2,
  VolumeX,
  Wifi,
  WifiOff,
  AlertTriangle,
  CheckCircle2,
  X,
  Gamepad2,
} from 'lucide-react';
import {
  Property,
  Room,
  Endpoint,
  Stay,
  CorporateGroup,
  Channel,
  Campaign,
  GuestLocale,
} from '../data/mockData';
import { GojjaWordmark } from './GojjaWordmark';

export type TvScreenId =
  | 'TV-01-SPLASH'
  | 'TV-02-WELCOME'
  | 'TV-03-HOME'
  | 'TV-04-GUIDE'
  | 'TV-06-SERVICES'
  | 'TV-07-PROMO'
  | 'TV-08-LANGUAGE'
  | 'TV-09-MAINTENANCE';

interface TvGuestAppProps {
  property: Property;
  room: Room;
  endpoint: Endpoint;
  stay: Stay | undefined;
  corporateGroup: CorporateGroup | undefined;
  channels: Channel[];
  campaigns: Campaign[];
  onClose?: () => void;
  embedded?: boolean;
  onOpenChannelCheck: (endpointId: string, channelId: string) => Promise<{ allowed: boolean; message?: string; code?: string }>;
}

const TV_UI_STRINGS: Record<
  GuestLocale,
  {
    welcomeTitle: string;
    startStayBtn: string;
    roomLabel: string;
    menuTv: string;
    menuDining: string;
    menuSpa: string;
    menuFacilities: string;
    menuHelp: string;
    discoverBtn: string;
    liveTvTitle: string;
    catAll: string;
    catNews: string;
    catSports: string;
    catMovies: string;
    catHotel: string;
    promoTag: string;
    skipBtn: string;
    diningTitle: string;
    diningSubtitle: string;
    scanPhone: string;
    chooseLangTitle: string;
    chooseLangSub: string;
    backLabel: string;
    selectLabel: string;
    requestSent: string;
  }
> = {
  id: {
    welcomeTitle: 'Selamat Datang',
    startStayBtn: 'Mulai Menginap',
    roomLabel: 'Kamar',
    menuTv: 'Televisi',
    menuDining: 'Kuliner',
    menuSpa: 'Spa',
    menuFacilities: 'Fasilitas',
    menuHelp: 'Bantuan',
    discoverBtn: 'Temukan pengalaman istimewa di hotel kami',
    liveTvTitle: 'Televisi & Saluran Langsung',
    catAll: 'Semua',
    catNews: 'Berita',
    catSports: 'Olahraga',
    catMovies: 'Hiburan',
    catHotel: 'Hotel',
    promoTag: 'PROMO HOTEL',
    skipBtn: 'Lewati',
    diningTitle: 'Kuliner & Layanan Kamar',
    diningSubtitle: 'Cita rasa istimewa, pelayanan penuh makna di kenyamanan kamar Anda',
    scanPhone: 'Lanjutkan di Ponsel',
    chooseLangTitle: 'Pilih Bahasa',
    chooseLangSub: 'Pilih bahasa untuk pengalaman menginap terbaik selama Anda berada di properti.',
    backLabel: 'Kembali',
    selectLabel: 'Pilih',
    requestSent: 'Permintaan layanan diterima oleh Concierge (Status: Received — bukan transaksi berbayar).',
  },
  en: {
    welcomeTitle: 'Welcome to Your Sanctuary',
    startStayBtn: 'Begin Experience',
    roomLabel: 'Room',
    menuTv: 'Television',
    menuDining: 'Dining',
    menuSpa: 'Spa & Wellness',
    menuFacilities: 'Facilities',
    menuHelp: 'Assistance',
    discoverBtn: 'Discover curated experiences during your stay',
    liveTvTitle: 'Live TV & Channel Guide',
    catAll: 'All',
    catNews: 'News',
    catSports: 'Sports',
    catMovies: 'Movies',
    catHotel: 'Hotel Info',
    promoTag: 'HOTEL FEATURE',
    skipBtn: 'Skip',
    diningTitle: 'Culinary & Guest Services',
    diningSubtitle: 'Signature Indonesian gastronomy and 24-hour in-room dining',
    scanPhone: 'Continue on Mobile',
    chooseLangTitle: 'Select Language',
    chooseLangSub: 'Choose your preferred language for your in-room television experience.',
    backLabel: 'Back',
    selectLabel: 'Select',
    requestSent: 'Service request received by Concierge (Status: Received — non-billable demo request).',
  },
  'zh-CN': {
    welcomeTitle: '欢迎光临',
    startStayBtn: '开始入住体验',
    roomLabel: '房间',
    menuTv: '电视直播',
    menuDining: '餐饮美食',
    menuSpa: '水疗康体',
    menuFacilities: '酒店设施',
    menuHelp: '礼宾协助',
    discoverBtn: '探索酒店精选礼遇与当地文化',
    liveTvTitle: '电视直播与频道指南',
    catAll: '全部',
    catNews: '新闻',
    catSports: '体育',
    catMovies: '影视',
    catHotel: '酒店频道',
    promoTag: '酒店礼遇',
    skipBtn: '跳过',
    diningTitle: '美馔与客房服务',
    diningSubtitle: '精选印尼传统美食与24小时客房送餐服务',
    scanPhone: '在手机上继续',
    chooseLangTitle: '选择语言',
    chooseLangSub: '请选择您在入住期间偏好的客房电视显示语言。',
    backLabel: '返回',
    selectLabel: '确认',
    requestSent: '礼宾部已收到您的服务请求（状态：已接收）。',
  },
  'ja-JP': {
    welcomeTitle: 'ようこそ',
    startStayBtn: '滞在を開始する',
    roomLabel: '客室',
    menuTv: 'テレビ放送',
    menuDining: 'ダイニング',
    menuSpa: 'スパ＆ウェルネス',
    menuFacilities: '館内施設',
    menuHelp: 'コンシェルジュ',
    discoverBtn: '当ホテルならではの特別な体験をご覧ください',
    liveTvTitle: 'ライブTV＆チャンネルガイド',
    catAll: 'すべて',
    catNews: 'ニュース',
    catSports: 'スポーツ',
    catMovies: '映画',
    catHotel: 'ホテル案内',
    promoTag: 'ホテル特典',
    skipBtn: 'スキップ',
    diningTitle: 'ダイニング＆ゲストサービス',
    diningSubtitle: '伝統のインドネシア料理と24時間ルームサービス',
    scanPhone: 'スマートフォンで開く',
    chooseLangTitle: '言語を選択',
    chooseLangSub: 'ご滞在中の客室テレビ表示言語をお選びください。',
    backLabel: '戻る',
    selectLabel: '決定',
    requestSent: 'コンシェルジュがリクエストを受付ました（ステータス：受付済）。',
  },
};

export const TvGuestAppView: React.FC<TvGuestAppProps> = ({
  property,
  room,
  endpoint,
  stay,
  corporateGroup,
  channels,
  campaigns,
  onClose,
  embedded = false,
  onOpenChannelCheck,
}) => {
  const [activeScreen, setActiveScreen] = useState<TvScreenId>('TV-03-HOME');
  const [guestLocale, setGuestLocale] = useState<GuestLocale>(stay?.locale || property.defaultLocale || 'id');
  const [focusIndex, setFocusIndex] = useState<number>(0);
  const [selectedChannel, setSelectedChannel] = useState<Channel>(channels[0]);
  const [channelAccessState, setChannelAccessState] = useState<{
    loading: boolean;
    allowed: boolean;
    errorMsg: string | null;
  }>({ loading: false, allowed: true, errorMsg: null });
  const [muted, setMuted] = useState<boolean>(true);
  const [serviceToast, setServiceToast] = useState<string | null>(null);

  useEffect(() => {
    setGuestLocale(stay?.locale || property.defaultLocale || 'id');
  }, [stay?.locale, property.defaultLocale]);

  const t = TV_UI_STRINGS[guestLocale];
  const activePromo = campaigns.find((c) => c.propertyId === property.id && c.status === 'Active') || campaigns[0];

  const handleSelectChannel = useCallback(
    async (ch: Channel) => {
      setSelectedChannel(ch);
      setChannelAccessState({ loading: true, allowed: true, errorMsg: null });
      const res = await onOpenChannelCheck(endpoint.id, ch.id);
      setChannelAccessState({
        loading: false,
        allowed: res.allowed,
        errorMsg: res.allowed ? null : res.message || 'Channel access denied by entitlement policy.',
      });
    },
    [endpoint.id, onOpenChannelCheck]
  );

  // D-Pad remote keyboard handler
  const triggerDpadKey = useCallback(
    (key: 'ArrowLeft' | 'ArrowRight' | 'ArrowUp' | 'ArrowDown' | 'Enter' | 'Back') => {
      if (activeScreen === 'TV-02-WELCOME') {
        if (key === 'Enter') {
          setActiveScreen('TV-03-HOME');
          setFocusIndex(0);
        }
        return;
      }

      if (activeScreen === 'TV-03-HOME') {
        // 0..4 are bottom rail tiles, 5 is language button, 6 is hero promo banner
        if (key === 'ArrowRight') setFocusIndex((prev) => (prev < 5 ? prev + 1 : 0));
        if (key === 'ArrowLeft') setFocusIndex((prev) => (prev > 0 ? prev - 1 : 5));
        if (key === 'ArrowUp') setFocusIndex(6);
        if (key === 'ArrowDown') setFocusIndex(0);
        if (key === 'Enter') {
          if (focusIndex === 0) {
            setActiveScreen('TV-04-GUIDE');
            handleSelectChannel(channels[0]);
            setFocusIndex(0);
          } else if (focusIndex === 1 || focusIndex === 3 || focusIndex === 4) {
            setActiveScreen('TV-06-SERVICES');
            setFocusIndex(0);
          } else if (focusIndex === 2 || focusIndex === 6) {
            setActiveScreen('TV-07-PROMO');
            setFocusIndex(0);
          } else if (focusIndex === 5) {
            setActiveScreen('TV-08-LANGUAGE');
            setFocusIndex(['id', 'en', 'zh-CN', 'ja-JP'].indexOf(guestLocale));
          }
        }
        return;
      }

      if (activeScreen === 'TV-04-GUIDE') {
        if (key === 'Back') {
          setActiveScreen('TV-03-HOME');
          setFocusIndex(0);
          return;
        }
        if (key === 'ArrowDown') {
          const next = (focusIndex + 1) % channels.length;
          setFocusIndex(next);
          handleSelectChannel(channels[next]);
        }
        if (key === 'ArrowUp') {
          const prev = (focusIndex - 1 + channels.length) % channels.length;
          setFocusIndex(prev);
          handleSelectChannel(channels[prev]);
        }
        return;
      }

      if (activeScreen === 'TV-06-SERVICES') {
        if (key === 'Back') {
          setActiveScreen('TV-03-HOME');
          setFocusIndex(1);
          return;
        }
        if (key === 'ArrowRight') setFocusIndex((p) => (p + 1) % 3);
        if (key === 'ArrowLeft') setFocusIndex((p) => (p - 1 + 3) % 3);
        if (key === 'Enter') {
          setServiceToast(t.requestSent);
          setTimeout(() => setServiceToast(null), 4000);
        }
        return;
      }

      if (activeScreen === 'TV-07-PROMO') {
        if (key === 'Back') {
          setActiveScreen('TV-03-HOME');
          setFocusIndex(2);
          return;
        }
        if (key === 'ArrowDown' || key === 'ArrowUp') setFocusIndex((p) => (p === 0 ? 1 : 0));
        if (key === 'Enter') {
          if (focusIndex === 0) {
            setActiveScreen('TV-06-SERVICES');
            setFocusIndex(0);
          } else {
            setActiveScreen('TV-03-HOME');
            setFocusIndex(0);
          }
        }
        return;
      }

      if (activeScreen === 'TV-08-LANGUAGE') {
        if (key === 'Back') {
          setActiveScreen('TV-03-HOME');
          setFocusIndex(5);
          return;
        }
        const locales: GuestLocale[] = ['id', 'en', 'zh-CN', 'ja-JP'];
        if (key === 'ArrowDown') setFocusIndex((p) => (p + 1) % 4);
        if (key === 'ArrowUp') setFocusIndex((p) => (p - 1 + 4) % 4);
        if (key === 'Enter') {
          setGuestLocale(locales[focusIndex] || 'id');
          setActiveScreen('TV-03-HOME');
          setFocusIndex(0);
        }
        return;
      }

      if (key === 'Back') {
        setActiveScreen('TV-03-HOME');
        setFocusIndex(0);
      }
    },
    [activeScreen, focusIndex, channels, guestLocale, handleSelectChannel, t.requestSent]
  );

  useEffect(() => {
    if (embedded) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter', 'Escape', 'Backspace'].includes(e.key)) {
        e.preventDefault();
        if (e.key === 'Escape' || e.key === 'Backspace') {
          triggerDpadKey('Back');
        } else {
          triggerDpadKey(e.key as 'ArrowLeft' | 'ArrowRight' | 'ArrowUp' | 'ArrowDown' | 'Enter');
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [embedded, triggerDpadKey]);

  // Compute safe guest greeting: offline or checked out uses generic welcome (FR06-09 / UAT19)
  const isOnline = endpoint.connection === 'Online';
  const resolvedGreetingName =
    isOnline && stay && stay.status === 'InHouse'
      ? stay.displayName || (corporateGroup ? corporateGroup.name : null)
      : null;

  const screenTabs: Array<{ id: TvScreenId; label: string }> = [
    { id: 'TV-02-WELCOME', label: '01 Welcome' },
    { id: 'TV-03-HOME', label: '02 Home' },
    { id: 'TV-04-GUIDE', label: '03 Live TV' },
    { id: 'TV-07-PROMO', label: '04 Promo' },
    { id: 'TV-06-SERVICES', label: '05 Dining & QR' },
    { id: 'TV-08-LANGUAGE', label: '06 Language (4)' },
    { id: 'TV-09-MAINTENANCE', label: '07 Maintenance' },
  ];

  const cleanBackdropUrl =
    !property.heroImageUrl ||
    property.heroImageUrl.includes('Hotel_Tentrem') ||
    property.heroImageUrl.includes('GOJJA_SmartTV')
      ? '/assets/aistudio/file_00000000a6b08211935c3a540293bf6c_74821162.png'
      : property.heroImageUrl;

  return (
    <div
      className={
        embedded
          ? 'w-full'
          : 'fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex flex-col items-center justify-center p-2 sm:p-3 md:p-4 h-[100dvh] overflow-hidden'
      }
    >
      <div
        className={
          embedded
            ? 'w-full flex flex-col gap-2'
            : 'w-full max-w-5xl h-full max-h-[calc(100dvh-16px)] sm:max-h-[calc(100dvh-24px)] flex flex-col justify-between gap-2 overflow-hidden'
        }
      >
        {/* Top Reviewer / Remote Control Bar (Pinned at top, shrink-0 so Close button is NEVER clipped) */}
        <div className="shrink-0 flex flex-col gap-1.5 px-3 py-2 rounded-xl bg-[#181C24] border border-white/15 text-xs text-slate-200 shadow-lg">
          {/* Top Line: App title, room info, status, and prominent CLOSE button */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0 truncate">
              <span className="font-bold text-white shrink-0">TV Guest App</span>
              <span className="text-slate-500">·</span>
              <span className="font-mono-tabular text-amber-300 truncate">
                Room {room.code} ({endpoint.id})
              </span>
              <span className="text-slate-500 hidden xs:inline">·</span>
              <span className="hidden xs:inline-flex items-center gap-1 shrink-0">
                {isOnline ? <Wifi className="w-3.5 h-3.5 text-emerald-400" /> : <WifiOff className="w-3.5 h-3.5 text-rose-400" />}
                <span className="hidden sm:inline">{endpoint.connection}</span>
              </span>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs inline-flex items-center gap-1.5 transition-colors shrink-0 shadow-md cursor-pointer"
                title="Close TV Preview"
              >
                <X className="w-4 h-4 stroke-[2.5]" />
                <span>Close</span>
              </button>
            )}
          </div>

          {/* Bottom Line: Horizontally scrollable Screen Switcher Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 -mx-1 px-1">
            {screenTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveScreen(tab.id);
                  setFocusIndex(0);
                  if (tab.id === 'TV-04-GUIDE') handleSelectChannel(channels[0]);
                }}
                className={`px-2.5 py-1 rounded-md text-[11px] sm:text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  activeScreen === tab.id ? 'bg-[#0050F5] text-white shadow-xs' : 'bg-white/5 text-slate-300 hover:bg-white/15'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 16:9 10-Foot TV Scene Canvas (Fits flexibly inside remaining viewport height so top & bottom bars stay visible) */}
        <div
          className={`tv-scene relative w-full ${
            embedded
              ? 'min-h-[460px] md:aspect-video'
              : 'flex-1 min-h-0 max-h-[calc(100dvh-150px)]'
          } rounded-2xl overflow-hidden border-2 border-[#2D3545] shadow-2xl select-none flex flex-col justify-between`}
        >
          {/* Background Hospitality Photography + Measured Contrast Scrim */}
          <img
            src={cleanBackdropUrl}
            alt={property.name}
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover opacity-50 transition-opacity duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#10151C] via-[#10151C]/75 to-[#10151C]/45" />

          {/* TV Safe Region Header */}
          <div className="relative z-10 flex items-center justify-between px-4 sm:px-6 md:px-8 pt-3 sm:pt-4 md:pt-6">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0">
              <div
                className="px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-lg border border-[#DCC6A1]/40 bg-black/40 backdrop-blur-md shrink-0"
                style={{ borderColor: `${property.accentColor}66` }}
              >
                <div className="text-xs sm:text-sm font-bold tracking-widest text-[#F8F5EE]">{property.logoText}</div>
                <div className="text-[9px] sm:text-[10px] tracking-[0.2em] text-[#DCC6A1]">{property.logoSubtitle}</div>
              </div>
              {!isOnline && (
                <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/20 border border-amber-400/40 text-amber-200 text-xs">
                  <WifiOff className="w-3.5 h-3.5" />
                  <span>Offline Ready Shell (v{endpoint.appliedConfigVersion})</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-[#F8F5EE]/90 font-mono-tabular shrink-0">
              <span>18:30</span>
              <span>•</span>
              <span>
                {t.roomLabel} {room.code}
              </span>
              <button
                onClick={() => setMuted(!muted)}
                className="p-1 sm:p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                title={muted ? 'Unmute TV Audio' : 'Mute TV Audio'}
              >
                {muted ? <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
              </button>
            </div>
          </div>

          {/* Toast for Service Request */}
          {serviceToast && (
            <div className="relative z-30 mx-4 sm:mx-8 mt-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-emerald-950/90 border border-emerald-400/50 text-emerald-100 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{serviceToast}</span>
            </div>
          )}

          {/* MAIN TV SCREEN CONTENT */}
          <div className="relative z-10 flex-1 flex flex-col justify-center px-4 sm:px-6 md:px-8 py-2 sm:py-4 overflow-y-auto md:overflow-hidden">
            {/* SCREEN 01: WELCOME */}
            {activeScreen === 'TV-02-WELCOME' && (
              <div className="max-w-2xl mx-auto text-center space-y-3 sm:space-y-4 my-auto">
                <div className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-[#DCC6A1] font-semibold">
                  {property.name}
                </div>
                <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-[#F8F5EE] tracking-tight">
                  {t.welcomeTitle}
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-[#DCC6A1] font-medium">
                  {resolvedGreetingName ? `${resolvedGreetingName} • ${t.roomLabel} ${room.code}` : `${t.roomLabel} ${room.code}`}
                </p>
                {corporateGroup && stay?.groupId === corporateGroup.id && (
                  <p className="text-xs sm:text-sm text-amber-200/90 bg-amber-500/15 border border-amber-400/30 rounded-lg px-3 py-1.5 sm:px-4 sm:py-2 inline-block">
                    {corporateGroup.message[guestLocale]}
                  </p>
                )}
                <p className="text-xs sm:text-sm text-[#CDD3DD] max-w-lg mx-auto">
                  {property.welcomeSubline[guestLocale]}
                </p>
                <div className="pt-2 sm:pt-3">
                  <button
                    data-focused="true"
                    onClick={() => {
                      setActiveScreen('TV-03-HOME');
                      setFocusIndex(0);
                    }}
                    className="tv-focusable inline-flex items-center gap-2 sm:gap-3 px-5 py-2.5 sm:px-7 sm:py-3.5 rounded-xl bg-[#1E2530]/90 border border-[#DCC6A1] text-[#F8F5EE] font-semibold text-xs sm:text-base transition-all"
                  >
                    <span>{t.startStayBtn}</span>
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-[#DCC6A1]" />
                  </button>
                </div>
              </div>
            )}

            {/* SCREEN 02: PERSONALIZED HOME */}
            {activeScreen === 'TV-03-HOME' && (
              <div className="flex flex-col justify-between h-full py-1 sm:py-2">
                <div className="max-w-xl space-y-1.5 sm:space-y-2 my-auto">
                  <p className="text-sm sm:text-lg md:text-xl text-[#CDD3DD] font-medium">
                    {property.welcomeHeadline[guestLocale]},
                  </p>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#F8F5EE] tracking-tight">
                    {resolvedGreetingName || `${t.roomLabel} ${room.code}`}
                  </h2>
                  <p className="text-xs sm:text-sm text-[#CDD3DD]/90 line-clamp-2">
                    {corporateGroup && stay?.groupId === corporateGroup.id
                      ? corporateGroup.message[guestLocale]
                      : property.welcomeSubline[guestLocale]}
                  </p>
                  <div className="pt-1.5 sm:pt-2">
                    <button
                      data-focused={focusIndex === 6 ? 'true' : 'false'}
                      onClick={() => setActiveScreen('TV-07-PROMO')}
                      className="tv-focusable inline-flex items-center gap-2 sm:gap-3 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-black/55 border border-[#DCC6A1]/50 text-left text-xs text-[#F8F5EE] hover:bg-black/70 transition-all"
                    >
                      <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#DCC6A1] shrink-0" />
                      <span className="truncate">{t.discoverBtn}</span>
                      <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#DCC6A1] shrink-0" />
                    </button>
                  </div>
                </div>

                {/* Bottom D-Pad Navigation Rail */}
                <div className="grid grid-cols-5 gap-1.5 sm:gap-2.5 md:gap-3 pt-2 sm:pt-4">
                  {[
                    { icon: Tv, label: t.menuTv, idx: 0 },
                    { icon: Utensils, label: t.menuDining, idx: 1 },
                    { icon: Sparkles, label: t.menuSpa, idx: 2 },
                    { icon: Building2, label: t.menuFacilities, idx: 3 },
                    { icon: Headphones, label: t.menuHelp, idx: 4 },
                  ].map((item) => {
                    const Icon = item.icon;
                    const isFocused = focusIndex === item.idx;
                    return (
                      <button
                        key={item.idx}
                        data-focused={isFocused ? 'true' : 'false'}
                        onClick={() => {
                          setFocusIndex(item.idx);
                          if (item.idx === 0) {
                            setActiveScreen('TV-04-GUIDE');
                            handleSelectChannel(channels[0]);
                          } else if (item.idx === 2) {
                            setActiveScreen('TV-07-PROMO');
                          } else {
                            setActiveScreen('TV-06-SERVICES');
                          }
                        }}
                        className={`tv-focusable flex flex-col items-center justify-center gap-1 sm:gap-2 py-2 sm:py-3.5 px-1 sm:px-2 md:py-4 md:px-3 rounded-xl border transition-all ${
                          isFocused
                            ? 'bg-[#2A2622]/95 border-[#DCC6A1] text-[#F8F5EE]'
                            : 'bg-black/50 border-white/15 text-[#CDD3DD] hover:bg-black/65'
                        }`}
                      >
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" style={{ color: isFocused ? property.accentColor : '#CDD3DD' }} />
                        <span className="text-[9px] sm:text-xs md:text-sm font-semibold truncate text-center w-full">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* SCREEN 03: LIVE TV & CHANNEL GUIDE */}
            {activeScreen === 'TV-04-GUIDE' && (
              <div className="flex flex-col md:grid md:grid-cols-12 gap-3 sm:gap-5 h-full items-stretch overflow-y-auto md:overflow-visible">
                {/* Left/Bottom Channel List */}
                <div className="order-2 md:order-1 md:col-span-5 flex flex-col justify-between bg-black/55 border border-white/15 rounded-xl p-3 sm:p-4">
                  <div>
                    <div className="flex items-center justify-between mb-2 sm:mb-3">
                      <h2 className="text-sm sm:text-lg font-bold text-[#F8F5EE]">{t.liveTvTitle}</h2>
                      <span className="text-[10px] sm:text-[11px] text-[#DCC6A1]">{t.catAll}</span>
                    </div>
                    <div className="space-y-1 sm:space-y-1.5 max-h-40 md:max-h-none overflow-y-auto">
                      {channels.map((ch, idx) => {
                        const isFocused = focusIndex === idx;
                        return (
                          <button
                            key={ch.id}
                            data-focused={isFocused ? 'true' : 'false'}
                            onClick={() => {
                              setFocusIndex(idx);
                              handleSelectChannel(ch);
                            }}
                            className={`tv-focusable w-full flex items-center justify-between px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg text-left text-xs transition-all ${
                              isFocused
                                ? 'bg-[#2B2620] border border-[#DCC6A1] text-white'
                                : 'bg-white/5 text-[#CDD3DD] hover:bg-white/10'
                            }`}
                          >
                            <div className="flex items-center gap-2 truncate">
                              <span className="font-mono-tabular text-[#DCC6A1] font-semibold text-xs">{ch.number}</span>
                              <span className="font-semibold truncate text-xs">{ch.name}</span>
                            </div>
                            <span className="text-[10px] text-slate-400 shrink-0 ml-1.5">{ch.category}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-slate-400 pt-2 border-t border-white/10 mt-2">
                    Entitlement checked per room class & provider contract status.
                  </div>
                </div>

                {/* Right/Top Live Player Preview Frame */}
                <div className="order-1 md:order-2 md:col-span-7 flex flex-col justify-between bg-black/70 border border-white/15 rounded-xl p-3 sm:p-4 relative overflow-hidden min-h-[160px] sm:min-h-[220px] md:min-h-0">
                  {channelAccessState.allowed ? (
                    <>
                      <div className="relative flex-1 min-h-[110px] sm:min-h-[140px] rounded-lg overflow-hidden bg-slate-900 flex items-center justify-center">
                        <img
                          src={selectedChannel.thumbnailUrl}
                          alt={selectedChannel.name}
                          referrerPolicy="no-referrer"
                          className="absolute inset-0 w-full h-full object-cover opacity-75"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
                        <div className="relative z-10 flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-black/65 border border-white/20 text-white text-[11px] sm:text-xs">
                          <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-400 fill-emerald-400" />
                          <span className="truncate">Playing Stream • {selectedChannel.name}</span>
                        </div>
                      </div>
                      <div className="pt-2 sm:pt-3 flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
                            <span>● Live Broadcast</span>
                            <span>•</span>
                            <span className="font-mono-tabular">{selectedChannel.programTime}</span>
                          </div>
                          <div className="text-xs sm:text-sm font-semibold text-white mt-0.5 truncate">
                            {selectedChannel.currentProgram[guestLocale]}
                          </div>
                        </div>
                        <span className="text-xs font-mono-tabular text-slate-400 shrink-0">{selectedChannel.packageId}</span>
                      </div>
                    </>
                  ) : (
                    <div className="m-auto text-center max-w-md space-y-2 p-3 sm:p-4">
                      <AlertTriangle className="w-8 h-8 sm:w-10 sm:h-10 text-amber-400 mx-auto" />
                      <h3 className="text-sm sm:text-base font-bold text-white">Channel Not Included / Access Restricted</h3>
                      <p className="text-xs text-slate-300 leading-relaxed">{channelAccessState.errorMsg}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* SCREEN 04: HOTEL PROMOTION */}
            {activeScreen === 'TV-07-PROMO' && activePromo && (
              <div className="max-w-lg space-y-2.5 sm:space-y-3 my-auto">
                <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.2em] text-[#DCC6A1] uppercase">
                  {t.promoTag} • {activePromo.category}
                </span>
                <h2 className="text-xl sm:text-3xl md:text-4xl font-bold text-white leading-tight">
                  {activePromo.headline[guestLocale]}
                </h2>
                <p className="text-xs sm:text-sm text-[#CDD3DD]">
                  Frequency Cap: Max {activePromo.frequencyCapPerStay}× per stay • Skippable after {activePromo.skippableAfterSeconds}s.
                </p>
                <div className="flex items-center gap-2 sm:gap-3 pt-2">
                  <button
                    data-focused={focusIndex === 0 ? 'true' : 'false'}
                    onClick={() => setActiveScreen('TV-06-SERVICES')}
                    className="tv-focusable px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-[#2A241E] border border-[#DCC6A1] text-white text-xs sm:text-sm font-semibold inline-flex items-center gap-2"
                  >
                    <span>{activePromo.ctaLabel[guestLocale]}</span>
                    <ChevronRight className="w-4 h-4 text-[#DCC6A1]" />
                  </button>
                  <button
                    data-focused={focusIndex === 1 ? 'true' : 'false'}
                    onClick={() => setActiveScreen('TV-03-HOME')}
                    className="tv-focusable px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-black/55 border border-white/20 text-slate-200 text-xs sm:text-sm font-medium"
                  >
                    {t.skipBtn}
                  </button>
                </div>
              </div>
            )}

            {/* SCREEN 05: DINING & GUEST SERVICES + QR */}
            {activeScreen === 'TV-06-SERVICES' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-2.5 sm:gap-4 items-stretch my-auto max-h-[340px] sm:max-h-none overflow-y-auto md:overflow-visible">
                {[
                  {
                    title: 'Kayumanis Restaurant',
                    sub: 'Heritage Indonesian Gastronomy • 06:00 – 23:00',
                    action: 'Request Table / Menu',
                  },
                  {
                    title: 'Royal Javanese Spa',
                    sub: 'Aromatherapy & Signature Wellness • 09:00 – 22:00',
                    action: 'Request Spa Slot',
                  },
                  {
                    title: '24-Hour In-Room Dining',
                    sub: 'Delivered to Room ' + room.code + ' • Ext. ' + property.frontDeskExt,
                    action: 'Request Concierge Callback',
                  },
                ].map((svc, idx) => (
                  <div
                    key={idx}
                    data-focused={focusIndex === idx ? 'true' : 'false'}
                    onClick={() => {
                      setFocusIndex(idx);
                      setServiceToast(t.requestSent);
                      setTimeout(() => setServiceToast(null), 4000);
                    }}
                    className={`tv-focusable md:col-span-3 rounded-xl p-3 sm:p-4 flex flex-col justify-between cursor-pointer border transition-all ${
                      focusIndex === idx
                        ? 'bg-[#2A241E]/95 border-[#DCC6A1]'
                        : 'bg-black/60 border-white/15 hover:bg-black/75'
                    }`}
                  >
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-white">{svc.title}</div>
                      <p className="text-[11px] sm:text-xs text-[#CDD3DD] mt-0.5 sm:mt-1">{svc.sub}</p>
                    </div>
                    <div className="mt-2.5 sm:mt-4 pt-2 border-t border-white/10 flex items-center justify-between text-xs text-[#DCC6A1] font-semibold">
                      <span>{svc.action}</span>
                      <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </div>
                  </div>
                ))}

                {/* Scoped Non-PII QR Handoff Card */}
                <div className="md:col-span-3 rounded-xl p-3 sm:p-4 bg-black/75 border border-[#DCC6A1]/40 flex flex-col items-center justify-center text-center">
                  <div className="text-xs font-semibold text-[#DCC6A1] mb-1 sm:mb-2">{t.scanPhone}</div>
                  <div className="p-2 sm:p-2.5 bg-white rounded-xl mb-1.5 sm:mb-2">
                    <QrCode className="w-10 h-10 sm:w-14 sm:h-14 text-slate-900" />
                  </div>
                  <div className="text-[9px] sm:text-[10px] text-slate-300 leading-snug">
                    Scoped Ephemeral Token (No guest name or PII in URL — FR17-02)
                  </div>
                </div>
              </div>
            )}

            {/* SCREEN 06: 4-LOCALE SELECTOR */}
            {activeScreen === 'TV-08-LANGUAGE' && (
              <div className="max-w-md mx-auto w-full bg-black/75 border border-white/20 rounded-2xl p-4 sm:p-5 space-y-2.5 sm:space-y-3 my-auto">
                <div className="text-center">
                  <h2 className="text-base sm:text-lg font-bold text-white">{t.chooseLangTitle}</h2>
                  <p className="text-[11px] sm:text-xs text-[#CDD3DD] mt-0.5">{t.chooseLangSub}</p>
                </div>
                <div className="space-y-1.5 sm:space-y-2">
                  {(
                    [
                      { code: 'id', label: 'Bahasa Indonesia', tag: 'ID' },
                      { code: 'en', label: 'English', tag: 'EN' },
                      { code: 'zh-CN', label: '简体中文 (Mandarin Simplified)', tag: '中文' },
                      { code: 'ja-JP', label: '日本語 (Japanese)', tag: '日本語' },
                    ] as Array<{ code: GuestLocale; label: string; tag: string }>
                  ).map((loc, idx) => {
                    const isFocused = focusIndex === idx;
                    const isCurrent = guestLocale === loc.code;
                    return (
                      <button
                        key={loc.code}
                        data-focused={isFocused ? 'true' : 'false'}
                        onClick={() => {
                          setGuestLocale(loc.code);
                          setFocusIndex(idx);
                          setActiveScreen('TV-03-HOME');
                        }}
                        className={`tv-focusable w-full flex items-center justify-between px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border text-xs sm:text-sm font-medium transition-all ${
                          isFocused
                            ? 'bg-[#2B251F] border-[#DCC6A1] text-white'
                            : 'bg-white/5 border-white/10 text-slate-200 hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 sm:gap-3">
                          <span className="px-1.5 sm:px-2 py-0.5 rounded bg-white/10 font-mono-tabular text-[11px] sm:text-xs text-[#DCC6A1]">
                            {loc.tag}
                          </span>
                          <span>{loc.label}</span>
                        </div>
                        {isCurrent && <span className="text-[10px] sm:text-[11px] text-emerald-400 font-semibold">Active</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* SCREEN 07: HONEST MAINTENANCE / UPDATE STAGE */}
            {activeScreen === 'TV-09-MAINTENANCE' && (
              <div className="max-w-lg mx-auto text-center bg-black/75 border border-white/20 rounded-2xl p-4 sm:p-6 space-y-2.5 sm:space-y-3 my-auto">
                <div className="text-[10px] sm:text-xs uppercase tracking-widest text-amber-300 font-semibold">
                  Scheduled Property Maintenance Window
                </div>
                <h2 className="text-base sm:text-xl font-bold text-white">
                  Pembaruan sedang berlangsung. Mohon jangan memutus listrik perangkat.
                </h2>
                <p className="text-[11px] sm:text-xs text-slate-300">
                  Update in progress (Stage: Verifying Package Checksum • Target v{endpoint.desiredVersion}). Keycard power cut cannot be prevented by software; atomic manifest rollback protects current theme.
                </p>
              </div>
            )}
          </div>

          {/* TV Safe Region Footer: Language Shortcut & Co-Branding */}
          <div className="relative z-10 flex items-center justify-between px-4 sm:px-6 md:px-8 pb-3 sm:pb-5 text-[11px] sm:text-xs text-[#CDD3DD]">
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                data-focused={activeScreen === 'TV-03-HOME' && focusIndex === 5 ? 'true' : 'false'}
                onClick={() => setActiveScreen('TV-08-LANGUAGE')}
                className="tv-focusable inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg bg-black/50 border border-white/15 hover:bg-black/70 text-[#F8F5EE] text-[11px] sm:text-xs"
              >
                <Globe className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#DCC6A1]" />
                <span>
                  {guestLocale === 'id'
                    ? 'Bahasa Indonesia'
                    : guestLocale === 'en'
                    ? 'English'
                    : guestLocale === 'zh-CN'
                    ? '简体中文'
                    : '日本語'}
                </span>
              </button>
              {activeScreen !== 'TV-03-HOME' && (
                <button
                  onClick={() => setActiveScreen('TV-03-HOME')}
                  className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] sm:text-xs"
                >
                  <ArrowLeft className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span>{t.backLabel}</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-[10px] sm:text-[11px] text-[#CDD3DD]/80">Powered by</span>
              <GojjaWordmark size="sm" showDescriptor={true} variant="reverse" />
            </div>
          </div>
        </div>

        {/* Interactive D-Pad Remote Control Strip for Mouse/Touch Reviewers */}
        <div className="shrink-0 flex flex-col sm:flex-row items-center justify-between gap-2 px-3 py-2 sm:px-4 rounded-xl bg-[#181C24] border border-white/10 text-xs text-slate-300">
          <div className="flex items-center gap-2 self-start sm:self-center">
            <Gamepad2 className="w-4 h-4 text-[#0050F5] shrink-0" />
            <span className="text-[11px] sm:text-xs">D-Pad Remote Simulator:</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto w-full sm:w-auto justify-center pb-0.5 sm:pb-0">
            <button
              onClick={() => triggerDpadKey('ArrowLeft')}
              className="px-2 sm:px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white font-mono-tabular text-[11px] sm:text-xs"
            >
              ◀ Left
            </button>
            <button
              onClick={() => triggerDpadKey('ArrowUp')}
              className="px-2 sm:px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white font-mono-tabular text-[11px] sm:text-xs"
            >
              ▲ Up
            </button>
            <button
              onClick={() => triggerDpadKey('ArrowDown')}
              className="px-2 sm:px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white font-mono-tabular text-[11px] sm:text-xs"
            >
              ▼ Down
            </button>
            <button
              onClick={() => triggerDpadKey('ArrowRight')}
              className="px-2 sm:px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white font-mono-tabular text-[11px] sm:text-xs"
            >
              Right ▶
            </button>
            <button
              onClick={() => triggerDpadKey('Enter')}
              className="px-2.5 sm:px-3 py-1 rounded bg-[#0050F5] hover:bg-[#0040C8] text-white font-semibold text-[11px] sm:text-xs"
            >
              OK
            </button>
            <button
              onClick={() => triggerDpadKey('Back')}
              className="px-2.5 sm:px-3 py-1 rounded bg-white/15 hover:bg-white/25 text-white text-[11px] sm:text-xs"
            >
              ↩ Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
