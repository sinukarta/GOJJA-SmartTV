import React,{useEffect,useRef,useState} from 'react';
import { normalizeMediaUrl,youtubeEmbed } from '../data/tvExperience';

interface YoutubePlayer {mute:()=>void;unMute:()=>void;playVideo:()=>void;getCurrentTime:()=>number;getDuration:()=>number;destroy:()=>void;}
interface YoutubeApi {Player:new(element:HTMLElement,options:Record<string,unknown>)=>YoutubePlayer;}
declare global {interface Window {YT?:YoutubeApi;onYouTubeIframeAPIReady?:()=>void;}}
let youtubeReady:Promise<YoutubeApi>|undefined;
function loadYoutube():Promise<YoutubeApi>{
  if(window.YT?.Player)return Promise.resolve(window.YT);
  if(!youtubeReady)youtubeReady=new Promise((resolve,reject)=>{
    const previous=window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady=()=>{previous?.();if(window.YT)resolve(window.YT);};
    const script=document.createElement('script');script.src='https://www.youtube.com/iframe_api';script.async=true;
    script.onerror=()=>{youtubeReady=undefined;reject(new Error('YouTube player API unavailable'));};document.head.appendChild(script);
  });
  return youtubeReady;
}

interface Props {src:string;poster?:string;muted:boolean;loop?:boolean;label:string;onTime?:(seconds:number,duration:number)=>void;onEnded?:()=>void;onPlaying?:()=>void;onFailure?:()=>void;}
export function TvMediaPlayer({src,poster,muted,loop=false,label,onTime,onEnded,onPlaying,onFailure}:Props){
  const video=useRef<HTMLVideoElement>(null);
  const youtubeHost=useRef<HTMLDivElement>(null);const youtubePlayer=useRef<YoutubePlayer|null>(null);const currentMuted=useRef(muted);currentMuted.current=muted;
  const callbacks=useRef({onTime,onEnded,onPlaying,onFailure});callbacks.current={onTime,onEnded,onPlaying,onFailure};
  const [error,setError]=useState('');const [blocked,setBlocked]=useState(false);const [retry,setRetry]=useState(0);
  const [isLoading,setIsLoading]=useState(true);
  const embed=youtubeEmbed(src);const safe=normalizeMediaUrl(src);
  useEffect(()=>{
    if(!embed||!safe||!youtubeHost.current)return;
    const host=youtubeHost.current;let alive=true;let timer:ReturnType<typeof setInterval>|undefined;
    setError('');setIsLoading(true);const id=embed.split('/embed/')[1].split('?')[0];
    void loadYoutube().then(api=>{
      if(!alive)return;const mount=document.createElement('div');host.replaceChildren(mount);
      const player=new api.Player(mount,{host:'https://www.youtube-nocookie.com',videoId:id,width:'100%',height:'100%',playerVars:{autoplay:1,playsinline:1,rel:0,origin:location.origin,loop:loop?1:0,...(loop?{playlist:id}:{})},events:{
        onReady:()=>{if(!alive)return;currentMuted.current?player.mute():player.unMute();player.playVideo();timer=setInterval(()=>callbacks.current.onTime?.(player.getCurrentTime(),player.getDuration()),500);},
        onStateChange:(event:{data:number})=>{
          if(event.data===1){setIsLoading(false);callbacks.current.onPlaying?.();}
          if(event.data===0&&!loop)callbacks.current.onEnded?.();
        },
        onError:()=>{setIsLoading(false);setError('YouTube tidak tersedia / YouTube unavailable');callbacks.current.onFailure?.();},
      }});youtubePlayer.current=player;
    }).catch(()=>{if(alive){setIsLoading(false);setError('YouTube API tidak tersedia / YouTube API unavailable');}});
    return()=>{alive=false;clearInterval(timer);youtubePlayer.current?.destroy();youtubePlayer.current=null;host.replaceChildren();};
  },[embed,safe,loop,retry]);
  useEffect(()=>{const player=youtubePlayer.current;if(player){muted?player.mute():player.unMute();}},[muted]);
  useEffect(()=>{
    setError('');setBlocked(false);setIsLoading(true);const el=video.current;if(!el||embed||!safe)return;
    let alive=true;let destroy=()=>{};
    const fail=()=>{if(alive){setIsLoading(false);setError('Media tidak dapat diputar / Media unavailable');callbacks.current.onFailure?.();}};
    const start=()=>{void el.play().catch(()=>{if(alive)setBlocked(true);});};
    if(/\.m3u8(?:[?#]|$)/i.test(safe)){
      void import('hls.js').then(({default:Hls})=>{
        if(!alive)return;
        if(Hls.isSupported()){
          const hls=new Hls({
            enableWorker: true,
            lowLatencyMode: true,
            backBufferLength: 90
          });
          destroy=()=>{
            try { hls.destroy(); } catch {}
          };
          hls.loadSource(safe);
          hls.attachMedia(el);
          hls.on(Hls.Events.MANIFEST_PARSED,start);
          hls.on(Hls.Events.FRAG_BUFFERED,()=>{
            if(alive) setIsLoading(false);
          });
          hls.on(Hls.Events.ERROR,(_event,data)=>{
            if(data.fatal){
              switch (data.type) {
                case Hls.ErrorTypes.NETWORK_ERROR:
                  try { hls.startLoad(); } catch { fail(); }
                  break;
                case Hls.ErrorTypes.MEDIA_ERROR:
                  try { hls.recoverMediaError(); } catch { fail(); }
                  break;
                default:
                  fail();
                  break;
              }
            }
          });
        }else if(el.canPlayType('application/vnd.apple.mpegurl')){
          el.src=safe;
          start();
        }else{
          fail();
        }
      }).catch(fail);
    }else{el.src=safe;start();}
    return()=>{alive=false;destroy();el.pause();el.removeAttribute('src');el.load();};
  },[safe,embed,retry]);
  if(!safe)return <div className="tv-media-error"><strong>Sumber tayangan belum tersedia</strong><p>Atur sumber video pada Brand Studio atau channel provider.</p></div>;
  
  const loadingIndicator = isLoading && !error ? (
    <div className="tv-media-loading" role="status" aria-live="polite" aria-label="Memuat siaran TV">
      <div className="tv-loading-backdrop" />
      <div className="tv-loading-content">
        <div className="tv-orbital-spinner">
          <div className="tv-orbital-ring ring-outer" />
          <div className="tv-orbital-ring ring-mid" />
          <div className="tv-orbital-core">
            <svg className="tv-loading-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
        </div>

        <div className="tv-loading-labels">
          <div className="tv-loading-title">{label || 'Menghubungkan Tayangan TV...'}</div>
          <div className="tv-loading-subtitle">
            <span className="tv-loading-dot dot-1" />
            <span className="tv-loading-dot dot-2" />
            <span className="tv-loading-dot dot-3" />
            <span className="tv-loading-text">Sinkronisasi buffer siaran live HLS</span>
          </div>
        </div>

        <div className="tv-loading-pill">
          <span className="tv-pulse-dot" />
          <span>GOJJA Hospitality Stream Engine</span>
        </div>
      </div>
    </div>
  ) : null;

  if(embed)return <><div ref={youtubeHost} className="tv-video tv-youtube" aria-label={label}/>{loadingIndicator}{error?<div className="tv-media-error" role="alert"><strong>{error}</strong><button onClick={()=>setRetry(n=>n+1)}>Coba lagi / Retry</button></div>:null}</>;
  return <>
    <video
      ref={video}
      className="tv-video"
      poster={poster}
      muted={muted}
      loop={loop}
      playsInline
      aria-label={label}
      onTimeUpdate={e=>callbacks.current.onTime?.(e.currentTarget.currentTime,e.currentTarget.duration)}
      onEnded={()=>callbacks.current.onEnded?.()}
      onCanPlay={()=>setIsLoading(false)}
      onWaiting={()=>setIsLoading(true)}
      onPlaying={()=>{setIsLoading(false);setBlocked(false);callbacks.current.onPlaying?.();}}
      onError={()=>{setIsLoading(false);setError('Media tidak dapat diputar / Media unavailable');callbacks.current.onFailure?.();}}
    />
    {loadingIndicator}
    {error?<div className="tv-media-error" role="alert"><strong>{error}</strong><button onClick={()=>setRetry(n=>n+1)}>Coba lagi / Retry</button></div>:blocked?<button className="tv-play-prompt" onClick={()=>void video.current?.play().then(()=>setBlocked(false)).catch(()=>setError('Tekan ulang untuk memutar / Playback blocked'))}>Putar video / Play video</button>:null}
  </>;
}
