import { Bot, Context, HTTP, Schema } from '@satorijs/core';
import { WechatOfficialMessageEncoder } from './message';
export declare class WechatOfficialBot<C extends Context = Context> extends Bot<C, WechatOfficialBot.Config> {
    static inject: string[];
    static MessageEncoder: typeof WechatOfficialMessageEncoder;
    http: HTTP;
    refreshTokenTimer: NodeJS.Timeout;
    constructor(ctx: C, config: WechatOfficialBot.Config);
    stop(): Promise<void>;
    token: string;
    /** https://developers.weixin.qq.com/doc/offiaccount/Basic_Information/Get_access_token.html */
    refreshToken(): Promise<string>;
    /** https://developers.weixin.qq.com/doc/offiaccount/Customer_Service/Customer_Service_Management.html */
    ensureCustom(): Promise<void>;
    getMedia(mediaId: string): Promise<any>;
    $toMediaUrl(mediaId: string): string;
}
export declare namespace WechatOfficialBot {
    interface Config extends HTTP.Config {
        appid: string;
        secret: string;
        token: string;
        aesKey: string;
        customerService: boolean;
        account: string;
    }
    const Config: Schema<Config>;
}
