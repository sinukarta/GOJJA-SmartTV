import React,{useEffect,useState} from 'react';
import {wifiQrPayload,type TvWifiSettings} from '../data/tvExperience';
import type {GuestLocale} from '../data/mockData';
export function TvWifiQr({wifi,locale}:{wifi:TvWifiSettings;locale:GuestLocale}){
  const value=wifiQrPayload(wifi);const [qr,setQr]=useState({value:'',url:''});
  useEffect(()=>{
    let alive=true;if(!value)return;
    void import('qrcode').then(module=>module.default.toDataURL(value,{width:512,margin:4,errorCorrectionLevel:'M',color:{dark:'#000000ff',light:'#ffffffff'}})).then(url=>{if(alive)setQr({value,url});}).catch(()=>{if(alive)setQr({value:'',url:''});});
    return()=>{alive=false;};
  },[value]);
  if(value&&qr.value===value&&qr.url)return <img className="tv-wifi-qr" src={qr.url} alt={`Wi-Fi QR · ${wifi.ssid}`}/>;
  return <div className="tv-wifi-qr-empty" role="status">{locale==='id'?'Atur Wi-Fi di Brand Studio':locale==='en'?'Set up Wi-Fi in Brand Studio':locale==='zh-CN'?'请在 Brand Studio 配置 Wi-Fi':'Brand Studio で Wi-Fi を設定'}</div>;
}
