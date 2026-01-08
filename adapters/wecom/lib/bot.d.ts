import { Bot, Context, HTTP, Schema, Universal } from '@satorijs/core';
import { WecomMessageEncoder } from './message';
export declare class WecomBot<C extends Context = Context> extends Bot<C, WecomBot.Config> {
    static inject: string[];
    static MessageEncoder: typeof WecomMessageEncoder;
    http: HTTP;
    refreshTokenTimer: NodeJS.Timeout;
    constructor(ctx: C, config: WecomBot.Config);
    stop(): Promise<void>;
    token: string;
    /** hhttps://developer.work.weixin.qq.com/document/path/91039 */
    refreshToken(): Promise<string>;
    getMedia(mediaId: string): Promise<any>;
    $toMediaUrl(mediaId: string): string;
    /** https://developer.work.weixin.qq.com/document/path/90196 */
    getUser(userId: string, guildId?: string): Promise<Universal.User>;
    /** https://developer.work.weixin.qq.com/document/path/90227 */
    getLogin(): Promise<Universal.Login>;
    /** https://developer.work.weixin.qq.com/document/path/94867 */
    deleteMessage(channelId: string, messageId: string): Promise<void>;
}
export declare namespace WecomBot {
    interface Config extends HTTP.Config {
        corpId: string;
        token: string;
        aesKey: string;
        agentId: string;
        secret: string;
    }
    const Config: Schema<Config>;
}
