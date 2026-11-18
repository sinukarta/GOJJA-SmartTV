import type { GuestLocale, Subscription } from './mockData';

export const TV_LOCALES: GuestLocale[] = ['id', 'en', 'zh-CN', 'ja-JP'];
export type LocalizedText = Record<GuestLocale, string>;
export interface TvWifiSettings {ssid:string;password:string;security:'WPA'|'WEP'|'nopass';hidden:boolean;}
export function wifiQrPayload(wifi:TvWifiSettings):string|null {
  if(!wifi.ssid||(wifi.security!=='nopass'&&!wifi.password))return null;
  const escape=(value:string)=>value.replace(/([\\;,:\"])/g,'\\$1');
  return `WIFI:T:${wifi.security};S:${escape(wifi.ssid)};P:${wifi.security==='nopass'?'':escape(wifi.password)};H:${wifi.hidden?'true':'false'};;`;
}
export const ENTERTAINMENT_APPS = [
  {id:'netflix',name:'Netflix',url:'https://www.netflix.com/'},
  {id:'hbo-max',name:'HBO Max',url:'https://www.hbomax.com/'},
  {id:'apple-tv',name:'Apple TV',url:'https://tv.apple.com/'},
  {id:'prime-video',name:'Prime Video',url:'https://www.primevideo.com/'},
  {id:'disney-plus',name:'Disney+',url:'https://www.disneyplus.com/'},
  {id:'youtube',name:'YouTube',url:'https://www.youtube.com/'},
] as const;
export type EntertainmentAppId = typeof ENTERTAINMENT_APPS[number]['id'];
export interface EntertainmentEntitlement {status:'Active'|'Inactive';mode:'DEMO'|'CONTRACT';reference:string;validUntil?:string;}
export function hasEntertainmentEntitlement(subscription:Subscription|undefined,environment:string,now=Date.now()):boolean {
  const grant=subscription?.entertainmentAppsEntitlement;
  return !!(subscription&&subscription.status!=='PastDue'&&(!subscription.suspensionStatus||subscription.suspensionStatus==='None')&&grant?.status==='Active'&&(grant.mode==='CONTRACT'||environment==='DEMO')&&(!grant.validUntil||(Number.isFinite(Date.parse(grant.validUntil))&&Date.parse(grant.validUntil)>now)));
}
export const WELCOME_ITEMS = ['tv','hotel','services','entertainment','offers','explore','help','wifi',...ENTERTAINMENT_APPS.map(app=>`app:${app.id}`)] as const;
export interface WelcomeSettings {weatherLabel:string;dim:number;glass:number;typography:'editorial'|'modern';brandLayout:'combined'|'logo'|'text';statusSide:'left'|'right';items:string[];}
export interface AppProfile {owner:'PROPERTY'|'ISP';reference:string;}
export interface TvExperienceSettings {
  services:{glass:number;columns:3|4;showImages:boolean};
  welcome:WelcomeSettings;
  appProfiles:Record<EntertainmentAppId,AppProfile>;
  showWifi: boolean; showMessages: boolean; showTicker: boolean; showPromo: boolean; showDock: boolean;
  tickerSeconds: number;
  ticker: LocalizedText;
  notificationTitle: LocalizedText;
  notificationBody: LocalizedText;
  maintenanceTitle: LocalizedText;
  maintenanceBody: LocalizedText;
  previewStreamUrl: string;
  appsEnabled: boolean;
  apps: Record<EntertainmentAppId,boolean>;
  wifi:TvWifiSettings;
}
export const DEFAULT_TV_EXPERIENCE: TvExperienceSettings = {
  services:{glass:.16,columns:4,showImages:true},
  welcome:{weatherLabel:'',dim:.56,glass:.18,typography:'editorial',brandLayout:'combined',statusSide:'right',items:['tv','app:youtube','app:netflix','hotel','services','explore','wifi','help']},
  appProfiles:Object.fromEntries(ENTERTAINMENT_APPS.map(app=>[app.id,{owner:'PROPERTY',reference:''}])) as Record<EntertainmentAppId,AppProfile>,
  showWifi: true, showMessages: true, showTicker: true, showPromo: true, showDock: true,
  tickerSeconds: 38,
  ticker: { id:'Selamat menikmati masa menginap Anda · Sarapan 06.00–10.00 · Hubungi resepsionis untuk bantuan', en:'Enjoy your stay · Breakfast 06:00–10:00 · Contact reception for assistance', 'zh-CN':'祝您入住愉快 · 早餐 06:00–10:00 · 如需帮助请联系前台', 'ja-JP':'ご滞在をお楽しみください · 朝食 06:00–10:00 · お困りの際はフロントまで' },
  notificationTitle: {id:'Pesan hotel',en:'Hotel message','zh-CN':'酒店消息','ja-JP':'ホテルからのお知らせ'},
  notificationBody: {id:'Sarapan tersedia pukul 06.00–10.00',en:'Breakfast is served from 06:00 to 10:00','zh-CN':'早餐供应时间为 06:00–10:00','ja-JP':'朝食は 06:00–10:00 にご利用いただけます'},
  maintenanceTitle: {id:'Kami sedang meningkatkan pengalaman Anda.',en:'We are improving your experience.','zh-CN':'我们正在提升您的入住体验。','ja-JP':'より快適な体験のためメンテナンス中です。'},
  maintenanceBody: {id:'Layanan TV sedang dalam pemeliharaan. Hubungi resepsionis bila membutuhkan bantuan.',en:'TV service is under maintenance. Please contact reception for assistance.','zh-CN':'电视服务正在维护。如需帮助，请联系前台。','ja-JP':'テレビサービスはメンテナンス中です。お困りの際はフロントへご連絡ください。'},
  previewStreamUrl: '/assets/tv/demo-flower.mp4',
  appsEnabled:false,
  apps:{'disney-plus':false,netflix:true,'hbo-max':true,'apple-tv':true,'prime-video':true,youtube:true},
  wifi:{ssid:'',password:'',security:'WPA',hidden:false},
};
export function resolveTvExperience(value?: Partial<TvExperienceSettings>,ssidFallback=''): TvExperienceSettings {
  const result = {...DEFAULT_TV_EXPERIENCE, ...value};
  result.services={...DEFAULT_TV_EXPERIENCE.services,...value?.services};
  result.welcome={...DEFAULT_TV_EXPERIENCE.welcome,...value?.welcome,items:[...(value?.welcome?.items||DEFAULT_TV_EXPERIENCE.welcome.items)]};
  result.appProfiles=Object.fromEntries(ENTERTAINMENT_APPS.map(app=>[app.id,{...DEFAULT_TV_EXPERIENCE.appProfiles[app.id],...value?.appProfiles?.[app.id]}])) as Record<EntertainmentAppId,AppProfile>;
  result.apps={...DEFAULT_TV_EXPERIENCE.apps,...value?.apps};
  result.wifi={...DEFAULT_TV_EXPERIENCE.wifi,...value?.wifi};
  if(!result.wifi.ssid)result.wifi.ssid=ssidFallback;
  for (const key of ['ticker','notificationTitle','notificationBody','maintenanceTitle','maintenanceBody'] as const) result[key]={...DEFAULT_TV_EXPERIENCE[key],...value?.[key]};
  return result;
}
export function normalizeMediaUrl(raw: string): string | null {
  const value=raw.trim();
  if(/^data:video\/(?:mp4|webm|ogg);base64,[A-Za-z0-9+/=\s]+$/.test(value))return value;
  if(value.startsWith('blob:'))return value;
  if(value.startsWith('/')&&!value.startsWith('//'))return value;
  try {const url=new URL(value);return ['https:','http:'].includes(url.protocol)&&!url.username&&!url.password?url.href:null;}catch{return null;}
}
export function resolveLegacyDemoMedia(raw:string):string {
  return /^https:\/\/(?:commondatastorage|storage)\.googleapis\.com\/gtv-videos-bucket\/sample\/ForBigger[^/]*\.mp4$/i.test(raw)?'/assets/tv/demo-flower.mp4':raw;
}
export function youtubeEmbed(raw:string):string|null {
  try {
    const u=new URL(raw); let id:string|null=null;
    if(['youtube.com','www.youtube.com','m.youtube.com','youtube-nocookie.com','www.youtube-nocookie.com'].includes(u.hostname)) id=u.pathname.startsWith('/embed/')?u.pathname.split('/')[2]:u.searchParams.get('v');
    if(u.hostname==='youtu.be')id=u.pathname.slice(1);
    return id&&/^[a-zA-Z0-9_-]{11}$/.test(id)?`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&playsinline=1&rel=0`:null;
  }catch{return null;}
}
export function validateTvExperience(value:unknown):TvExperienceSettings {
  if(!value||typeof value!=='object'||Array.isArray(value))throw new Error('TV settings must be an object.');
  const data=value as Record<string,unknown>;const result=resolveTvExperience();
  for(const key of ['showWifi','showMessages','showTicker','showPromo','showDock'] as const){if(typeof data[key]!=='boolean')throw new Error(`Invalid ${key}`);result[key]=data[key];}
  if(typeof data.tickerSeconds!=='number'||!Number.isFinite(data.tickerSeconds)||data.tickerSeconds<15||data.tickerSeconds>120)throw new Error('Ticker speed must be between 15 and 120 seconds.');
  result.tickerSeconds=data.tickerSeconds;
  for(const key of ['ticker','notificationTitle','notificationBody','maintenanceTitle','maintenanceBody'] as const){
    if(!data[key]||typeof data[key]!=='object'||Array.isArray(data[key]))throw new Error(`Invalid ${key}`);
    for(const loc of TV_LOCALES){const text=(data[key] as Record<string,unknown>)[loc];if(typeof text!=='string'||text.length>1000)throw new Error(`Invalid ${key}.${loc}`);result[key][loc]=text.trim();}
  }
  if(typeof data.previewStreamUrl!=='string'||data.previewStreamUrl.length>2048||(data.previewStreamUrl&&!normalizeMediaUrl(data.previewStreamUrl)))throw new Error('Use a local, HTTP or HTTPS media URL.');
  result.previewStreamUrl=data.previewStreamUrl.trim();
  if(data.appsEnabled!==undefined&&typeof data.appsEnabled!=='boolean')throw new Error('Invalid appsEnabled');
  result.appsEnabled=data.appsEnabled===true;
  if(data.apps!==undefined){
    if(!data.apps||typeof data.apps!=='object'||Array.isArray(data.apps))throw new Error('Invalid apps');
    for(const app of ENTERTAINMENT_APPS){const enabled=(data.apps as Record<string,unknown>)[app.id];if(enabled===undefined)continue;if(typeof enabled!=='boolean')throw new Error(`Invalid app ${app.id}`);result.apps[app.id]=enabled;}
  }
  if(data.services!==undefined){const service=data.services as TvExperienceSettings['services'];if(!service||typeof service.glass!=='number'||!Number.isFinite(service.glass)||service.glass<.06||service.glass>.6||![3,4].includes(service.columns)||typeof service.showImages!=='boolean')throw new Error('Invalid service card settings');result.services={glass:service.glass,columns:service.columns,showImages:service.showImages};}
  if(data.welcome!==undefined){
    const w=data.welcome as WelcomeSettings;
    if(!w||Array.isArray(w)||typeof w.dim!=='number'||!Number.isFinite(w.dim)||w.dim<0||w.dim>.85||typeof w.glass!=='number'||!Number.isFinite(w.glass)||w.glass<.06||w.glass>.5||!['editorial','modern'].includes(w.typography)||!['combined','logo','text'].includes(w.brandLayout)||!['left','right'].includes(w.statusSide)||!Array.isArray(w.items)||w.items.length<1||w.items.length>8||new Set(w.items).size!==w.items.length||w.items.some(id=>!WELCOME_ITEMS.includes(id)))throw new Error('Invalid welcome settings or shortcuts (1–8 unique items).');
    if(w.weatherLabel!==undefined&&(typeof w.weatherLabel!=='string'||w.weatherLabel.length>50))throw new Error('Weather label max 50 characters.');
    result.welcome={weatherLabel:w.weatherLabel?.trim()||'',dim:w.dim,glass:w.glass,typography:w.typography,brandLayout:w.brandLayout,statusSide:w.statusSide,items:[...w.items]};
  }
  if(data.appProfiles!==undefined){
    const profiles=data.appProfiles as Record<string,AppProfile>;
    if(!profiles||typeof profiles!=='object'||Array.isArray(profiles))throw new Error('Invalid app profiles');
    for(const app of ENTERTAINMENT_APPS){const profile=profiles[app.id];if(profile===undefined)continue;if(!profile||!['PROPERTY','ISP'].includes(profile.owner)||typeof profile.reference!=='string'||profile.reference.length>120||Object.keys(profile).some(key=>!['owner','reference'].includes(key)))throw new Error('Use only account owner and non-secret provisioning reference.');result.appProfiles[app.id]={owner:profile.owner,reference:profile.reference.trim()};}
  }
  if(data.wifi!==undefined){
    const wifi=data.wifi as Record<string,unknown>;
    if(!wifi||typeof wifi!=='object'||Array.isArray(wifi)||typeof wifi.ssid!=='string'||new TextEncoder().encode(wifi.ssid).length>32||typeof wifi.password!=='string'||wifi.password.length>128||!['WPA','WEP','nopass'].includes(String(wifi.security))||typeof wifi.hidden!=='boolean')throw new Error('Invalid Wi-Fi configuration. SSID max 32 bytes; password max 128 characters.');
    result.wifi={ssid:wifi.ssid,password:wifi.security==='nopass'?'':wifi.password,security:wifi.security as TvWifiSettings['security'],hidden:wifi.hidden};
  }
  return result;
}
