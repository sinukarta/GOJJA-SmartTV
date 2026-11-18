import {useState} from 'react';
import {ConciergeBell,Utensils,Sparkles,Shirt,Car,Landmark,ShoppingBag,Coffee,BedDouble,Dumbbell,Waves} from 'lucide-react';
import type {TvCatalogIconId} from '../data/tvCatalog';
const icons={concierge:ConciergeBell,dining:Utensils,spa:Sparkles,laundry:Shirt,car:Car,landmark:Landmark,shopping:ShoppingBag,coffee:Coffee,bed:BedDouble,gym:Dumbbell,pool:Waves};
export function TvCatalogIcon({name,className}:{name:TvCatalogIconId;className?:string}){const Icon=icons[name]||ConciergeBell;return <Icon className={className} aria-hidden="true" strokeWidth={1.4}/>;}

export function TvCatalogImage({src}:{src:string}){const [failed,setFailed]=useState(false);return failed?null:<img src={src} alt="" onError={()=>setFailed(true)}/>;}
