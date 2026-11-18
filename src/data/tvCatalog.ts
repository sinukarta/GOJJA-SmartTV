import type {MarketplaceItem} from './mockData';
import {normalizeMediaUrl} from './tvExperience';
export const TV_CATALOG_ICONS=['concierge','dining','spa','laundry','car','landmark','shopping','coffee','bed','gym','pool'] as const;
export type TvCatalogIconId=typeof TV_CATALOG_ICONS[number];
export const EXPLORE_CATEGORIES=['attraction','souvenir','culinary'] as const;
export type ExploreCategory=typeof EXPLORE_CATEGORIES[number];
export function catalogIcon(item:MarketplaceItem):TvCatalogIconId{return item.tvIcon||(item.type==='InHouseService'&&/laundry|洗衣|ランドリー/i.test(item.title)?'laundry':undefined)||({ 'F&B':'dining',Wellness:'spa',Transport:'car',InHouseService:'concierge',ThirdPartyExperience:'landmark'} as const)[item.type];}
export function propertyCatalog(items:MarketplaceItem[],propertyId:string,explore=false){return items.filter(item=>item.propertyId===propertyId&&item.status==='Active'&&(item.type==='ThirdPartyExperience')===explore);}
export function validateCatalogPresentation(input:Record<string,unknown>,existing?:MarketplaceItem):Pick<MarketplaceItem,'tvIcon'|'imageUrl'|'videoUrl'|'locationLabel'|'exploreCategory'>{
  const result={tvIcon:existing?.tvIcon,imageUrl:existing?.imageUrl,videoUrl:existing?.videoUrl,locationLabel:existing?.locationLabel,exploreCategory:existing?.exploreCategory};
  if(input.tvIcon!==undefined){if(typeof input.tvIcon!=='string'||input.tvIcon&&!TV_CATALOG_ICONS.includes(input.tvIcon as TvCatalogIconId))throw new Error('Pilih ikon katalog yang tersedia.');result.tvIcon=input.tvIcon?input.tvIcon as TvCatalogIconId:undefined;}
  if(input.exploreCategory!==undefined){if(typeof input.exploreCategory!=='string'||input.exploreCategory&&!EXPLORE_CATEGORIES.includes(input.exploreCategory as ExploreCategory))throw new Error('Kategori Explore tidak valid.');result.exploreCategory=input.exploreCategory?input.exploreCategory as ExploreCategory:undefined;}
  if(input.locationLabel!==undefined){if(typeof input.locationLabel!=='string'||input.locationLabel.length>200)throw new Error('Lokasi maksimal 200 karakter.');result.locationLabel=input.locationLabel.trim();}
  for(const key of ['imageUrl','videoUrl'] as const){const value=input[key];if(value===undefined)continue;if(typeof value!=='string'||value.length>2048)throw new Error('URL media maksimal 2048 karakter.');const raw=value.trim();if(raw&&(raw.startsWith('blob:')||raw.startsWith('data:')||!normalizeMediaUrl(raw)))throw new Error('Gunakan URL media lokal, HTTP atau HTTPS tanpa kredensial.');result[key]=raw;}
  return result;
}
