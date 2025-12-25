import { Bot, Context, HTTP, Schema } from '@satorijs/core';
import { Internal } from './types';
import { LineMessageEncoder } from './message';
export declare class LineBot<C extends Context = Context> extends Bot<C, LineBot.Config> {
    static inject: string[];
    static MessageEncoder: typeof LineMessageEncoder;
    http: HTTP;
    contentHttp: HTTP;
    internal: Internal;
    constructor(ctx: C, config: LineBot.Config);
    getLogin(): Promise<import("@satorijs/protocol").Login>;
    getFriendList(start?: string): Promise<{
        data: {
            id: string;
            userId: string;
        }[];
        next: string;
    }>;
    getGuild(guildId: string): Promise<{
        id: string;
        name: string;
    }>;
    getGuildMemberList(guildId: string, start?: string): Promise<{
        data: {
            user: {
                id: string;
            };
            userId: string;
        }[];
        next: string;
    }>;
    getGuildMember(guildId: string, userId: string): Promise<{
        user: {
            id: string;
            name: string;
            avatar: string;
        };
        userId: string;
        nickname: string;
        avatar: string;
    }>;
}
export declare namespace LineBot {
    interface Config {
        token: string;
        secret: string;
        api: HTTP.Config;
        content: HTTP.Config;
    }
    const Config: Schema<Config>;
}
