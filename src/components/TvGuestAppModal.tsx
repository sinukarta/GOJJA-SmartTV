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
  forcedLocale?: GuestLocale;
  onSelectLocale?: (locale: GuestLocale) => void;
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
    entitlementNote: string;
    playingStream: string;
    liveBroadcast: string;
    channelRestricted: string;
    promoTag: string;
    freqCapPrefix: string;
    freqCapSuffix: string;
    skipBtn: string;
    diningTitle: string;
    diningSubtitle: string;
    svc1Title: string;
    svc1Sub: string;
    svc1Action: string;
    svc2Title: string;
    svc2Sub: string;
    svc2Action: string;
    svc3Title: string;
    svc3SubPrefix: string;
    svc3Action: string;
    scanPhone: string;
    qrTokenNote: string;
    chooseLangTitle: string;
    chooseLangSub: string;
    activeBadge: string;
    maintTag: string;
    maintTitle: string;
    maintDescPrefix: string;
    backLabel: string;
    selectLabel: string;
    requestSent: string;
    tabWelcome: string;
    tabHome: string;
    tabLiveTv: string;
    tabPromo: string;
    tabServices: string;
    tabLanguage: string;
    tabMaint: string;
  }
> = {
  id: {
    welcomeTitle: 'Selamat Datang di Ruang Istirahat Anda',
    startStayBtn: 'Mulai Pengalaman Menginap',
    roomLabel: 'Kamar',
    menuTv: 'Televisi',
    menuDining: 'Kuliner',
    menuSpa: 'Spa & Relaksasi',
    menuFacilities: 'Fasilitas',
    menuHelp: 'Bantuan Tamu',
    discoverBtn: 'Temukan pengalaman istimewa selama Anda menginap',
    liveTvTitle: 'Televisi & Panduan Saluran Langsung',
    catAll: 'Semua Saluran',
    catNews: 'Berita',
    catSports: 'Olahraga',
    catMovies: 'Hiburan',
    catHotel: 'Info Hotel',
    entitlementNote: 'Hak tayangan diverifikasi otomatis sesuai kelas kamar & kontrak penyedia.',
    playingStream: 'Memutar Siaran',
    liveBroadcast: '● Siaran Langsung',
    channelRestricted: 'Saluran Tidak Termasuk / Akses Dibatasi',
    promoTag: 'PROMO HOTEL',
    freqCapPrefix: 'Batas Tayang: Maks',
    freqCapSuffix: '× per menginap • Dapat dilewati setelah',
    skipBtn: 'Lewati',
    diningTitle: 'Kuliner & Layanan Kamar',
    diningSubtitle: 'Cita rasa istimewa Nusantara dan layanan bersantap di kamar 24 jam',
    svc1Title: 'Restoran Kayumanis',
    svc1Sub: 'Gastronomi Warisan Nusantara • 06:00 – 23:00',
    svc1Action: 'Pesan Meja / Buka Menu',
    svc2Title: 'Royal Javanese Spa',
    svc2Sub: 'Aromaterapi & Relaksasi Tradisional • 09:00 – 22:00',
    svc2Action: 'Jadwalkan Sesi Spa',
    svc3Title: 'Layanan Antar Kamar 24 Jam',
    svc3SubPrefix: 'Diantar ke Kamar',
    svc3Action: 'Hubungi Concierge',
    scanPhone: 'Lanjutkan di Ponsel',
    qrTokenNote: 'Token Sementara Terenkripsi (Tanpa nama tamu / PII di URL — FR17-02)',
    chooseLangTitle: 'Pilih Bahasa Layar TV (4 Bahasa)',
    chooseLangSub: 'Pilih bahasa tampilan televisi selama Anda menginap di properti kami.',
    activeBadge: 'Aktif',
    maintTag: 'Jendela Pemeliharaan Terjadwal Properti',
    maintTitle: 'Pembaruan sedang berlangsung. Mohon jangan memutus aliran listrik perangkat.',
    maintDescPrefix: 'Memverifikasi paket konfigurasi TV',
    backLabel: 'Kembali',
    selectLabel: 'Pilih',
    requestSent: 'Permintaan layanan diterima oleh Concierge (Status: Diterima — simulasi demo).',
    tabWelcome: '01 Sambutan',
    tabHome: '02 Beranda',
    tabLiveTv: '03 Siaran TV',
    tabPromo: '04 Promo',
    tabServices: '05 Kuliner & QR',
    tabLanguage: '06 Bahasa (4)',
    tabMaint: '07 Pemeliharaan',
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
    catAll: 'All Channels',
    catNews: 'News',
    catSports: 'Sports',
    catMovies: 'Movies',
    catHotel: 'Hotel Info',
    entitlementNote: 'Entitlement checked per room class & provider contract status.',
    playingStream: 'Playing Stream',
    liveBroadcast: '● Live Broadcast',
    channelRestricted: 'Channel Not Included / Access Restricted',
    promoTag: 'HOTEL FEATURE',
    freqCapPrefix: 'Frequency Cap: Max',
    freqCapSuffix: '× per stay • Skippable after',
    skipBtn: 'Skip',
    diningTitle: 'Culinary & Guest Services',
    diningSubtitle: 'Signature Indonesian gastronomy and 24-hour in-room dining',
    svc1Title: 'Kayumanis Restaurant',
    svc1Sub: 'Heritage Indonesian Gastronomy • 06:00 – 23:00',
    svc1Action: 'Request Table / Menu',
    svc2Title: 'Royal Javanese Spa',
    svc2Sub: 'Aromatherapy & Signature Wellness • 09:00 – 22:00',
    svc2Action: 'Request Spa Slot',
    svc3Title: '24-Hour In-Room Dining',
    svc3SubPrefix: 'Delivered to Room',
    svc3Action: 'Request Concierge Callback',
    scanPhone: 'Continue on Mobile',
    qrTokenNote: 'Scoped Ephemeral Token (No guest name or PII in URL — FR17-02)',
    chooseLangTitle: 'Select TV Interface Language (4 Languages)',
    chooseLangSub: 'Choose your preferred language for your in-room television experience.',
    activeBadge: 'Active',
    maintTag: 'Scheduled Property Maintenance Window',
    maintTitle: 'System update in progress. Please do not disconnect TV power.',
    maintDescPrefix: 'Verifying package checksum & atomic manifest',
    backLabel: 'Back',
    selectLabel: 'Select',
    requestSent: 'Service request received by Concierge (Status: Received — non-billable demo request).',
    tabWelcome: '01 Welcome',
    tabHome: '02 Home',
    tabLiveTv: '03 Live TV',
    tabPromo: '04 Promo',
    tabServices: '05 Dining & QR',
    tabLanguage: '06 Language (4)',
    tabMaint: '07 Maintenance',
  },
  'zh-CN': {
    welcomeTitle: '欢迎光临您的静谧雅居',
    startStayBtn: '开启入住体验',
    roomLabel: '客房',
    menuTv: '电视直播',
    menuDining: '餐饮美食',
    menuSpa: '水疗康体',
    menuFacilities: '酒店设施',
    menuHelp: '礼宾服务',
    discoverBtn: '探索酒店精选礼遇与当地文化体验',
    liveTvTitle: '电视直播与频道指南',
    catAll: '全部频道',
    catNews: '新闻',
    catSports: '体育',
    catMovies: '影视',
    catHotel: '酒店频道',
    entitlementNote: '频道权限根据客房等级与运营商合同状态自动核验。',
    playingStream: '正在播放频道',
    liveBroadcast: '● 实时直播',
    channelRestricted: '当前套餐不含此频道 / 访问受限',
    promoTag: '酒店专属礼遇',
    freqCapPrefix: '展示频次上限：每次入住最多',
    freqCapSuffix: '次 • 可在以下时间后跳过：',
    skipBtn: '跳过',
    diningTitle: '美馔与客房礼宾服务',
    diningSubtitle: '精选印尼传统美食与24小时客房送餐服务',
    svc1Title: 'Kayumanis 印尼传统餐厅',
    svc1Sub: '经典爪哇与印尼皇家美馔 • 06:00 – 23:00',
    svc1Action: '预订餐桌 / 浏览菜单',
    svc2Title: '皇家爪哇水疗中心 (Royal Spa)',
    svc2Sub: '草本芳香疗法与身心舒缓护理 • 09:00 – 22:00',
    svc2Action: '预约水疗时段',
    svc3Title: '24小时客房送餐服务',
    svc3SubPrefix: '专人送达客房',
    svc3Action: '呼叫礼宾部回电',
    scanPhone: '手机扫码继续操作',
    qrTokenNote: '安全临时令牌（二维码不含住客姓名或个人隐私信息 — FR17-02）',
    chooseLangTitle: '选择电视界面语言（4种语言）',
    chooseLangSub: '请选择您在入住期间偏好的客房智能电视显示语言。',
    activeBadge: '当前使用',
    maintTag: '酒店系统计划维护时段',
    maintTitle: '系统正在更新中，请勿断开电视电源。',
    maintDescPrefix: '正在校验固件与配置清单版本',
    backLabel: '返回',
    selectLabel: '确认',
    requestSent: '礼宾部已收到您的服务请求（状态：已接收 — 演示模式）。',
    tabWelcome: '01 欢迎屏',
    tabHome: '02 主页',
    tabLiveTv: '03 电视直播',
    tabPromo: '04 酒店优惠',
    tabServices: '05 餐饮与扫码',
    tabLanguage: '06 语言 (4)',
    tabMaint: '07 系统维护',
  },
  'ja-JP': {
    welcomeTitle: 'ようこそ、静寂のサンクチュアリへ',
    startStayBtn: '滞在エクスペリエンスを開始',
    roomLabel: '客室',
    menuTv: 'テレビ放送',
    menuDining: 'ダイニング',
    menuSpa: 'スパ＆ウェルネス',
    menuFacilities: '館内施設',
    menuHelp: 'コンシェルジュ',
    discoverBtn: '当ホテルならではの特別な体験をご覧ください',
    liveTvTitle: 'ライブTV＆チャンネルガイド',
    catAll: '全チャンネル',
    catNews: 'ニュース',
    catSports: 'スポーツ',
    catMovies: '映画',
    catHotel: 'ホテル案内',
    entitlementNote: '客室クラスおよび放送契約ステータスに基づき視聴権限を確認しています。',
    playingStream: 'ストリーム再生中',
    liveBroadcast: '● ライブ放送中',
    channelRestricted: '対象外チャンネル / アクセス制限',
    promoTag: 'ホテル特別優待',
    freqCapPrefix: '表示上限：1滞在につき最大',
    freqCapSuffix: '回 • スキップ可能秒数：',
    skipBtn: 'スキップ',
    diningTitle: 'ダイニング＆ゲストサービス',
    diningSubtitle: '伝統のインドネシア料理と24時間ルームサービス',
    svc1Title: 'カユマニス・レストラン',
    svc1Sub: 'インドネシア伝統ガストロノミー • 06:00 – 23:00',
    svc1Action: 'テーブル予約 / メニュー',
    svc2Title: 'ロイヤル・ジャワ・スパ',
    svc2Sub: 'アロマセラピー＆シグネチャー・スパ • 09:00 – 22:00',
    svc2Action: 'スパ予約をリクエスト',
    svc3Title: '24時間インルームダイニング',
    svc3SubPrefix: 'お届け先：客室',
    svc3Action: 'コンシェルジュへ折り返し依頼',
    scanPhone: 'スマートフォンで開く',
    qrTokenNote: '一時トークン（QRコードに宿泊者名や個人情報は含まれません — FR17-02）',
    chooseLangTitle: 'テレビ表示言語の選択（4ヶ国語対応）',
    chooseLangSub: 'ご滞在中の客室テレビ表示言語をお選びください。',
    activeBadge: '選択中',
    maintTag: '定期システムメンテナンス',
    maintTitle: 'システムアップデート中です。テレビの電源を切らないでください。',
    maintDescPrefix: 'パッケージ検証およびアトミックマニフェスト適用中',
    backLabel: '戻る',
    selectLabel: '決定',
    requestSent: 'コンシェルジュがリクエストを受付ました（ステータス：受付済）。',
    tabWelcome: '01 ウェルカム',
    tabHome: '02 ホーム',
    tabLiveTv: '03 ライブTV',
    tabPromo: '04 特典映像',
    tabServices: '05 ダイニング＆QR',
    tabLanguage: '06 言語設定 (4)',
    tabMaint: '07 メンテナンス',
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
  forcedLocale,
  onSelectLocale,
  onClose,
  embedded = false,
  onOpenChannelCheck,
}) => {
  const [activeScreen, setActiveScreen] = useState<TvScreenId>('TV-03-HOME');
  const [guestLocale, setGuestLocale] = useState<GuestLocale>(
    forcedLocale || stay?.locale || property.defaultLocale || 'id'
  );
  const [focusIndex, setFocusIndex] = useState<number>(0);
  const [selectedChannel, setSelectedChannel] = useState<Channel>(channels[0]);
  const [channelAccessState, setChannelAccessState] = useState<{
    loading: boolean;
    allowed: boolean;
    errorMsg: string | null;
  }>({ loading: false, allowed: true, errorMsg: null });
  const [muted, setMuted] = useState<boolean>(true);
  const [serviceToast, setServiceToast] = useState<string | null>(null);
  const [simulateStockLauncher, setSimulateStockLauncher] = useState<boolean>(
    property.launcherConfig?.mode === 'STOCK_TV_LAUNCHER'
  );

  useEffect(() => {
    setSimulateStockLauncher(property.launcherConfig?.mode === 'STOCK_TV_LAUNCHER');
  }, [property.launcherConfig?.mode]);

  // Immediately react when dashboard operator changes forcedLocale, stay.locale, or property.defaultLocale
  useEffect(() => {
    if (forcedLocale) {
      setGuestLocale(forcedLocale);
    } else if (stay?.locale) {
      setGuestLocale(stay.locale);
    } else if (property.defaultLocale) {
      setGuestLocale(property.defaultLocale);
    }
  }, [forcedLocale, stay?.locale, property.defaultLocale]);

  const handleLanguageChange = useCallback(
    (nextLoc: GuestLocale) => {
      setGuestLocale(nextLoc);
      if (onSelectLocale) {
        onSelectLocale(nextLoc);
      }
    },
    [onSelectLocale]
  );

  const t = TV_UI_STRINGS[guestLocale];
  const activePromo = campaigns.find((c) => c.propertyId === property.id && c.status === 'Active') || campaigns[0];
  const effectivePromoMediaUrl = property.promoMediaUrl || activePromo?.mediaUrl || activePromo?.imageUrl;
  const effectivePromoMediaType =
    property.promoMediaType ||
    activePromo?.mediaType ||
    (effectivePromoMediaUrl?.endsWith('.mp4') || effectivePromoMediaUrl?.startsWith('data:video/') ? 'video' : 'image');
  const effectivePromoTitle = activePromo?.headline?.[guestLocale] || property.promoTitle || activePromo?.name;

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
          handleLanguageChange(locales[focusIndex] || 'id');
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
    [activeScreen, focusIndex, channels, guestLocale, handleSelectChannel, handleLanguageChange, t.requestSent]
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

  const isOnline = endpoint.connection === 'Online';
  const resolvedGreetingName =
    isOnline && stay && stay.status === 'InHouse'
      ? stay.displayName || (corporateGroup ? corporateGroup.name : null)
      : null;

  const screenTabs: Array<{ id: TvScreenId; label: string }> = [
    { id: 'TV-02-WELCOME', label: t.tabWelcome },
    { id: 'TV-03-HOME', label: t.tabHome },
    { id: 'TV-04-GUIDE', label: t.tabLiveTv },
    { id: 'TV-07-PROMO', label: t.tabPromo },
    { id: 'TV-06-SERVICES', label: t.tabServices },
    { id: 'TV-08-LANGUAGE', label: t.tabLanguage },
    { id: 'TV-09-MAINTENANCE', label: t.tabMaint },
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
          {/* Top Line: App title, room info, 4-Language Direct TV Switcher, and prominent CLOSE button */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0 truncate">
              <span className="font-bold text-white shrink-0">TV Guest App</span>
              <span className="text-slate-500">·</span>
              <span className="font-mono-tabular text-amber-300 truncate">
                {t.roomLabel} {room.code} ({endpoint.id})
              </span>
              <span className="text-slate-500 hidden xs:inline">·</span>
              <span className="hidden xs:inline-flex items-center gap-1 shrink-0">
                {isOnline ? <Wifi className="w-3.5 h-3.5 text-emerald-400" /> : <WifiOff className="w-3.5 h-3.5 text-rose-400" />}
                <span className="hidden sm:inline">{endpoint.connection}</span>
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {/* Quick 4-Language TV Switcher right in the TV header */}
              <div className="inline-flex items-center gap-0.5 p-0.5 rounded-lg bg-black/40 border border-white/15">
                <Globe className="w-3 h-3 text-[#DCC6A1] ml-1.5 mr-0.5 shrink-0" />
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
                    onClick={() => handleLanguageChange(loc.code)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors cursor-pointer ${
                      guestLocale === loc.code
                        ? 'bg-[#0050F5] text-white shadow-xs'
                        : 'text-slate-300 hover:bg-white/10'
                    }`}
                    title={`Switch TV Interface to ${loc.label}`}
                  >
                    {loc.label}
                  </button>
                ))}
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
          </div>

          {/* Bottom Line: Horizontally scrollable Screen Switcher Pills + GojjaLauncher vs Stock TV Toggle */}
          <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar py-0.5 -mx-1 px-1">
            <div className="flex items-center gap-1.5 shrink-0">
              {screenTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setSimulateStockLauncher(false);
                    setActiveScreen(tab.id);
                    setFocusIndex(0);
                    if (tab.id === 'TV-04-GUIDE') handleSelectChannel(channels[0]);
                  }}
                  className={`px-2.5 py-1 rounded-md text-[11px] sm:text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    !simulateStockLauncher && activeScreen === tab.id
                      ? 'bg-[#0050F5] text-white shadow-xs'
                      : 'bg-white/5 text-slate-300 hover:bg-white/15'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setSimulateStockLauncher((prev) => !prev)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-mono-tabular font-semibold whitespace-nowrap shrink-0 cursor-pointer border transition-colors ${
                simulateStockLauncher
                  ? 'bg-amber-500/20 border-amber-400/50 text-amber-200'
                  : 'bg-emerald-500/15 border-emerald-400/40 text-emerald-300'
              }`}
              title="Toggle between GojjaLauncher (Clean Hospitality Home) and Stock Uncleaned Android TV Launcher"
            >
              {simulateStockLauncher ? '⚠️ Stock TV Launcher (Uncleaned Ads)' : '✓ GojjaLauncher Active (CleanTV)'}
            </button>
          </div>
        </div>

        {/* 16:9 10-Foot TV Scene Canvas */}
        <div
          className={`tv-scene relative w-full ${
            embedded
              ? 'min-h-[460px] md:aspect-video'
              : 'flex-1 min-h-0 max-h-[calc(100dvh-150px)]'
          } rounded-2xl overflow-hidden border-2 border-[#2D3545] shadow-2xl select-none flex flex-col justify-between`}
        >
          {/* Background Hospitality Video or Photography + Measured Contrast Scrim */}
          {property.heroMediaType === 'video' && property.heroVideoUrl ? (
            <video
              key={property.heroVideoUrl}
              src={property.heroVideoUrl}
              poster={cleanBackdropUrl}
              autoPlay
              loop
              muted={muted}
              playsInline
              className="absolute inset-0 w-full h-full object-cover opacity-60 transition-opacity duration-500"
            />
          ) : (
            <img
              src={cleanBackdropUrl}
              alt={property.name}
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover opacity-50 transition-opacity duration-500"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#10151C] via-[#10151C]/75 to-[#10151C]/45" />

          {/* TV Safe Region Header */}
          <div className="relative z-10 flex items-center justify-between px-4 sm:px-6 md:px-8 pt-3 sm:pt-4 md:pt-6">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0">
              <div
                className="px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-xl border border-[#DCC6A1]/40 bg-black/45 backdrop-blur-md shrink-0 flex items-center gap-2.5"
                style={{ borderColor: `${property.accentColor}66` }}
              >
                {property.logoImageUrl && (
                  <img
                    src={property.logoImageUrl}
                    alt={property.logoText}
                    referrerPolicy="no-referrer"
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg object-contain bg-black/20 p-0.5 shrink-0"
                  />
                )}
                <div>
                  <div className="text-xs sm:text-sm font-bold tracking-widest text-[#F8F5EE]">{property.logoText}</div>
                  <div className="text-[9px] sm:text-[10px] tracking-[0.2em] text-[#DCC6A1]">{property.logoSubtitle}</div>
                </div>
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
                className="p-1 sm:p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
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
            {/* SIMULATED UNCLEANED STOCK ANDROID TV / GOOGLE TV LAUNCHER */}
            {simulateStockLauncher ? (
              <div className="my-auto space-y-3 bg-slate-950/90 border border-rose-500/40 rounded-2xl p-4 sm:p-5 text-xs">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2.5">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="font-bold text-white">
                      Stock Consumer Google TV Launcher (`com.google.android.tvlauncher`)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSimulateStockLauncher(false)}
                    className="px-3 py-1 rounded-lg bg-[#0050F5] hover:bg-[#0040C8] text-white font-semibold text-[11px] cursor-pointer"
                  >
                    Switch to GojjaLauncher (CleanTV) →
                  </button>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-r from-rose-950/80 via-purple-950/70 to-slate-900 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="px-1.5 py-0.5 rounded bg-amber-500/30 text-amber-200 text-[10px] font-bold uppercase">
                      Sponsored Ad Carousel
                    </span>
                    <div className="text-sm sm:text-base font-bold text-white mt-1">
                      Watch Blockbuster Action Now — Rent for Rp49,000 on Personal Google Account
                    </div>
                    <p className="text-[11px] text-slate-300">
                      Unbranded consumer home screen: No hotel identity, previous guest Netflix login exposed, and paid ad clutter.
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {['Netflix (Guest Logged In!)', 'Prime Video Ads', 'YouTube Trending', 'Google Play Store'].map((bloat, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-center text-[11px] text-slate-300">
                      <div className="font-semibold text-white truncate">{bloat}</div>
                      <div className="text-[10px] text-rose-300 mt-0.5">Stock Bloatware</div>
                    </div>
                  ))}
                </div>
                <div className="text-[11px] text-emerald-300 font-mono-tabular">
                  💡 Tip: Use <strong>GojjaCleanTV (`GojjaLauncher`)</strong> in Brand Studio to run non-root ADB <code>pm disable-user</code> &amp; lock your hotel dashboard as the default HOME screen.
                </div>
              </div>
            ) : (
              <>
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
                        className="tv-focusable inline-flex items-center gap-2 sm:gap-3 px-5 py-2.5 sm:px-7 sm:py-3.5 rounded-xl bg-[#1E2530]/90 border border-[#DCC6A1] text-[#F8F5EE] font-semibold text-xs sm:text-base transition-all cursor-pointer"
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
                          className="tv-focusable inline-flex items-center gap-2 sm:gap-3 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-black/55 border border-[#DCC6A1]/50 text-left text-xs text-[#F8F5EE] hover:bg-black/70 transition-all cursor-pointer"
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
                            className={`tv-focusable flex flex-col items-center justify-center gap-1 sm:gap-2 py-2 sm:py-3.5 px-1 sm:px-2 md:py-4 md:px-3 rounded-xl border transition-all cursor-pointer ${
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
                                className={`tv-focusable w-full flex items-center justify-between px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg text-left text-xs transition-all cursor-pointer ${
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
                        {t.entitlementNote}
                      </div>
                    </div>

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
                              <span className="truncate">
                                {t.playingStream} • {selectedChannel.name}
                              </span>
                            </div>
                          </div>
                          <div className="pt-2 sm:pt-3 flex items-center justify-between gap-2">
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
                                <span>{t.liveBroadcast}</span>
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
                          <h3 className="text-sm sm:text-base font-bold text-white">{t.channelRestricted}</h3>
                          <p className="text-xs text-slate-300 leading-relaxed">{channelAccessState.errorMsg}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* SCREEN 04: HOTEL PROMOTION */}
                {activeScreen === 'TV-07-PROMO' && activePromo && (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 items-center my-auto">
                    <div className="md:col-span-6 space-y-2.5 sm:space-y-3">
                      <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.2em] text-[#DCC6A1] uppercase">
                        {t.promoTag} • {activePromo.category}
                      </span>
                      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white leading-tight">
                        {effectivePromoTitle || activePromo.headline[guestLocale]}
                      </h2>
                      <p className="text-xs sm:text-sm text-[#CDD3DD]">
                        {t.freqCapPrefix} {activePromo.frequencyCapPerStay}
                        {t.freqCapSuffix} {activePromo.skippableAfterSeconds}s.
                      </p>
                      <div className="flex items-center gap-2 sm:gap-3 pt-2">
                        <button
                          data-focused={focusIndex === 0 ? 'true' : 'false'}
                          onClick={() => setActiveScreen('TV-06-SERVICES')}
                          className="tv-focusable px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-[#2A241E] border border-[#DCC6A1] text-white text-xs sm:text-sm font-semibold inline-flex items-center gap-2 cursor-pointer"
                        >
                          <span>{activePromo.ctaLabel[guestLocale]}</span>
                          <ChevronRight className="w-4 h-4 text-[#DCC6A1]" />
                        </button>
                        <button
                          data-focused={focusIndex === 1 ? 'true' : 'false'}
                          onClick={() => setActiveScreen('TV-03-HOME')}
                          className="tv-focusable px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-black/55 border border-white/20 text-slate-200 text-xs sm:text-sm font-medium cursor-pointer"
                        >
                          {t.skipBtn}
                        </button>
                      </div>
                    </div>

                    <div className="md:col-span-6 rounded-2xl overflow-hidden border border-[#DCC6A1]/40 bg-black/80 shadow-xl relative aspect-video flex items-center justify-center">
                      {effectivePromoMediaType === 'video' && effectivePromoMediaUrl ? (
                        <video
                          key={effectivePromoMediaUrl}
                          src={effectivePromoMediaUrl}
                          autoPlay
                          loop
                          muted={muted}
                          controls
                          playsInline
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <img
                          src={effectivePromoMediaUrl || cleanBackdropUrl}
                          alt={effectivePromoTitle || 'Hotel Promotion'}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      )}
                      <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-md bg-black/70 border border-white/15 text-[10px] font-mono-tabular text-[#DCC6A1] uppercase pointer-events-none">
                        {effectivePromoMediaType === 'video' ? '▶ Promo Video Feed' : 'Promo Banner Asset'}
                      </div>
                    </div>
                  </div>
                )}

                {/* SCREEN 05: DINING & GUEST SERVICES + QR */}
                {activeScreen === 'TV-06-SERVICES' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-2.5 sm:gap-4 items-stretch my-auto max-h-[340px] sm:max-h-none overflow-y-auto md:overflow-visible">
                    {[
                      {
                        title: t.svc1Title,
                        sub: t.svc1Sub,
                        action: t.svc1Action,
                      },
                      {
                        title: t.svc2Title,
                        sub: t.svc2Sub,
                        action: t.svc2Action,
                      },
                      {
                        title: t.svc3Title,
                        sub: `${t.svc3SubPrefix} ${room.code} • Ext. ${property.frontDeskExt}`,
                        action: t.svc3Action,
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
                        {t.qrTokenNote}
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
                              handleLanguageChange(loc.code);
                              setFocusIndex(idx);
                              setActiveScreen('TV-03-HOME');
                            }}
                            className={`tv-focusable w-full flex items-center justify-between px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border text-xs sm:text-sm font-medium transition-all cursor-pointer ${
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
                            {isCurrent && (
                              <span className="text-[10px] sm:text-[11px] text-emerald-400 font-semibold">
                                {t.activeBadge}
                              </span>
                            )}
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
                      {t.maintTag}
                    </div>
                    <h2 className="text-base sm:text-xl font-bold text-white">{t.maintTitle}</h2>
                    <p className="text-[11px] sm:text-xs text-slate-300">
                      {t.maintDescPrefix} (Target v{endpoint.desiredVersion}).
                    </p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* TV Safe Region Footer: Language Shortcut & Co-Branding */}
          <div className="relative z-10 flex items-center justify-between px-4 sm:px-6 md:px-8 pb-3 sm:pb-5 text-[11px] sm:text-xs text-[#CDD3DD]">
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                data-focused={activeScreen === 'TV-03-HOME' && focusIndex === 5 ? 'true' : 'false'}
                onClick={() => setActiveScreen('TV-08-LANGUAGE')}
                className="tv-focusable inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg bg-black/50 border border-white/15 hover:bg-black/70 text-[#F8F5EE] text-[11px] sm:text-xs cursor-pointer"
              >
                <Globe className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#DCC6A1]" />
                <span>
                  {guestLocale === 'id'
                    ? 'Bahasa Indonesia (ID)'
                    : guestLocale === 'en'
                    ? 'English (EN)'
                    : guestLocale === 'zh-CN'
                    ? '简体中文 (中文)'
                    : '日本語 (JA)'}
                </span>
              </button>
              {activeScreen !== 'TV-03-HOME' && (
                <button
                  onClick={() => setActiveScreen('TV-03-HOME')}
                  className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] sm:text-xs cursor-pointer"
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
              className="px-2 sm:px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white font-mono-tabular text-[11px] sm:text-xs cursor-pointer"
            >
              ◀ Left
            </button>
            <button
              onClick={() => triggerDpadKey('ArrowUp')}
              className="px-2 sm:px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white font-mono-tabular text-[11px] sm:text-xs cursor-pointer"
            >
              ▲ Up
            </button>
            <button
              onClick={() => triggerDpadKey('ArrowDown')}
              className="px-2 sm:px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white font-mono-tabular text-[11px] sm:text-xs cursor-pointer"
            >
              ▼ Down
            </button>
            <button
              onClick={() => triggerDpadKey('ArrowRight')}
              className="px-2 sm:px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white font-mono-tabular text-[11px] sm:text-xs cursor-pointer"
            >
              Right ▶
            </button>
            <button
              onClick={() => triggerDpadKey('Enter')}
              className="px-2.5 sm:px-3 py-1 rounded bg-[#0050F5] hover:bg-[#0040C8] text-white font-semibold text-[11px] sm:text-xs cursor-pointer"
            >
              OK
            </button>
            <button
              onClick={() => triggerDpadKey('Back')}
              className="px-2.5 sm:px-3 py-1 rounded bg-white/15 hover:bg-white/25 text-white text-[11px] sm:text-xs cursor-pointer"
            >
              ↩ {t.backLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
