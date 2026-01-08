import { Bot, Context, h, HTTP, Schema, Universal } from '@satorijs/core';
import { HttpServer } from './http';
import { WsClient } from './ws';
import { LarkMessageEncoder } from './message';
import { Internal } from './internal';
export declare class LarkBot<C extends Context = Context, T extends LarkBot.Config = LarkBot.Config> extends Bot<C, T> {
    static inject: string[];
    static MessageEncoder: typeof LarkMessageEncoder;
    _refresher?: NodeJS.Timeout;
    http: HTTP;
    assetsQuester: HTTP;
    internal: Internal<C>;
    constructor(ctx: C, config: T);
    getResourceUrl(type: string, message_id: string, file_key: string): string;
    initialize(): Promise<void>;
    private refreshToken;
    editMessage(channelId: string, messageId: string, content: h.Fragment): Promise<void>;
    deleteMessage(channelId: string, messageId: string): Promise<void>;
    getMessage(channelId: string, messageId: string, recursive?: boolean): Promise<Universal.Message>;
    getMessageList(channelId: string, before?: string): Promise<{
        data: Universal.Message[];
        next: string;
    }>;
    getUser(userId: string, guildId?: string): Promise<Universal.User>;
    getChannel(channelId: string): Promise<Universal.Channel>;
    getChannelList(guildId: string): Promise<{
        data: Universal.Channel[];
    }>;
    getGuild(guildId: string): Promise<Universal.Guild>;
    getGuildList(after?: string): Promise<{
        data: Universal.Guild[];
        next: string;
    }>;
    getGuildMemberList(guildId: string, after?: string): Promise<{
        data: {
            user: {
                id: string;
                name: string;
            };
            name: string;
        }[];
        next: string;
    }>;
    createUpload(...uploads: Universal.Upload[]): Promise<string[]>;
}
export declare namespace LarkBot {
    interface BaseConfig extends HTTP.Config {
        appId: string;
        appSecret: string;
    }
    type Config = BaseConfig & (HttpServer.Options | WsClient.Options);
    const Config: Schema<Config>;
}
export { LarkBot as FeishuBot };
