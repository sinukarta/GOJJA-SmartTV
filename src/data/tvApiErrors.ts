import type {GuestLocale} from './mockData';
export class ApiRequestError extends Error {constructor(message:string,public code:string,public status:number){super(message);this.name='ApiRequestError';}}
export function tvAccessMessage(code:string|undefined,message:string|undefined,locale:GuestLocale):string{
 const unavailable=code==='API_UNAVAILABLE'||/HTTP (?:404|405|502|503|504)\b|Failed to fetch|NetworkError|Unexpected token.*</i.test(message||'');
 if(!unavailable)return message||({id:'Tayangan tidak tersedia.',en:'Channel unavailable.','zh-CN':'频道不可用。','ja-JP':'チャンネルを利用できません。'})[locale];
 return ({id:'Layanan TV belum tersambung ke server. Silakan hubungi resepsionis.',en:'TV service is not connected to the server. Please contact reception.','zh-CN':'电视服务尚未连接服务器，请联系前台。','ja-JP':'テレビサービスがサーバーに接続されていません。フロントへお問い合わせください。'})[locale];
}
