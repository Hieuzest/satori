import { Bot, Context, HTTP, Schema } from '@satorijs/core';
import { DingtalkMessageEncoder } from './message';
import { WsClient } from './ws';
import { Internal } from './internal';
export declare class DingtalkBot<C extends Context = Context> extends Bot<C, DingtalkBot.Config> {
    static MessageEncoder: typeof DingtalkMessageEncoder;
    static inject: string[];
    oldHttp: HTTP;
    http: HTTP;
    internal: Internal;
    private refreshTokenTimer;
    constructor(ctx: C, config: DingtalkBot.Config);
    getLogin(): Promise<import("@satorijs/protocol").Login>;
    stop(): Promise<void>;
    token: string;
    refreshToken(): Promise<void>;
    downloadFile(downloadCode: string): Promise<string>;
    deleteMessage(channelId: string, messageId: string): Promise<void>;
}
export declare namespace DingtalkBot {
    interface Config extends WsClient.Options {
        secret: string;
        protocol: string;
        appkey: string;
        agentId?: number;
        api: HTTP.Config;
        oldApi: HTTP.Config;
    }
    const Config: Schema<Config>;
}
