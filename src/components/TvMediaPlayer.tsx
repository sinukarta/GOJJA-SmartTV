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
  const embed=youtubeEmbed(src);const safe=normalizeMediaUrl(src);
  useEffect(()=>{
    if(!embed||!safe||!youtubeHost.current)return;
    const host=youtubeHost.current;let alive=true;let timer:ReturnType<typeof setInterval>|undefined;
    setError('');const id=embed.split('/embed/')[1].split('?')[0];
    void loadYoutube().then(api=>{
      if(!alive)return;const mount=document.createElement('div');host.replaceChildren(mount);
      const player=new api.Player(mount,{host:'https://www.youtube-nocookie.com',videoId:id,width:'100%',height:'100%',playerVars:{autoplay:1,playsinline:1,rel:0,origin:location.origin,loop:loop?1:0,...(loop?{playlist:id}:{})},events:{
        onReady:()=>{if(!alive)return;currentMuted.current?player.mute():player.unMute();player.playVideo();timer=setInterval(()=>callbacks.current.onTime?.(player.getCurrentTime(),player.getDuration()),500);},
        onStateChange:(event:{data:number})=>{if(event.data===1)callbacks.current.onPlaying?.();if(event.data===0&&!loop)callbacks.current.onEnded?.();},
        onError:()=>{setError('YouTube tidak tersedia / YouTube unavailable');callbacks.current.onFailure?.();},
      }});youtubePlayer.current=player;
    }).catch(()=>{if(alive)setError('YouTube API tidak tersedia / YouTube API unavailable');});
    return()=>{alive=false;clearInterval(timer);youtubePlayer.current?.destroy();youtubePlayer.current=null;host.replaceChildren();};
  },[embed,safe,loop,retry]);
  useEffect(()=>{const player=youtubePlayer.current;if(player){muted?player.mute():player.unMute();}},[muted]);
  useEffect(()=>{
    setError('');setBlocked(false);const el=video.current;if(!el||embed||!safe)return;
    let alive=true;let destroy=()=>{};
    const fail=()=>{if(alive){setError('Media tidak dapat diputar / Media unavailable');callbacks.current.onFailure?.();}};
    const start=()=>{void el.play().catch(()=>{if(alive)setBlocked(true);});};
    if(/\.m3u8(?:[?#]|$)/i.test(safe)&&!el.canPlayType('application/vnd.apple.mpegurl')){
      void import('hls.js').then(({default:Hls})=>{
        if(!alive)return;
        if(!Hls.isSupported())return fail();
        const hls=new Hls();destroy=()=>hls.destroy();hls.loadSource(safe);hls.attachMedia(el);
        hls.on(Hls.Events.MANIFEST_PARSED,start);hls.on(Hls.Events.ERROR,(_event,data)=>{if(data.fatal)fail();});
      }).catch(fail);
    }else{el.src=safe;start();}
    return()=>{alive=false;destroy();el.pause();el.removeAttribute('src');el.load();};
  },[safe,embed,retry]);
  if(!safe)return <div className="tv-media-error"><strong>Sumber tayangan belum tersedia</strong><p>Atur sumber video pada Brand Studio atau channel provider.</p></div>;
  if(embed)return <><div ref={youtubeHost} className="tv-video tv-youtube" aria-label={label}/>{error?<div className="tv-media-error" role="alert"><strong>{error}</strong><button onClick={()=>setRetry(n=>n+1)}>Coba lagi / Retry</button></div>:null}</>;
  return <><video ref={video} className="tv-video" poster={poster} muted={muted} loop={loop} playsInline aria-label={label} onTimeUpdate={e=>callbacks.current.onTime?.(e.currentTarget.currentTime,e.currentTarget.duration)} onEnded={()=>callbacks.current.onEnded?.()} onPlaying={()=>{setBlocked(false);callbacks.current.onPlaying?.();}} onError={()=>{setError('Media tidak dapat diputar / Media unavailable');callbacks.current.onFailure?.();}}/>
    {error?<div className="tv-media-error" role="alert"><strong>{error}</strong><button onClick={()=>setRetry(n=>n+1)}>Coba lagi / Retry</button></div>:blocked?<button className="tv-play-prompt" onClick={()=>void video.current?.play().then(()=>setBlocked(false)).catch(()=>setError('Tekan ulang untuk memutar / Playback blocked'))}>Putar video / Play video</button>:null}</>;
}
