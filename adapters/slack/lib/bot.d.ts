import { Bot, Context, HTTP, Schema, Universal } from '@satorijs/core';
import { WsClient } from './ws';
import { HttpServer } from './http';
import { SlackMessageEncoder } from './message';
import { Internal } from './types/internal';
export declare class SlackBot<C extends Context = Context, T extends SlackBot.Config = SlackBot.Config> extends Bot<C, T> {
    static MessageEncoder: typeof SlackMessageEncoder;
    static inject: string[];
    http: HTTP;
    internal: Internal;
    constructor(ctx: C, config: T);
    request<T = any>(method: HTTP.Method, path: string, data?: {}, headers?: any, zap?: boolean): Promise<T>;
    getLogin(): Promise<Universal.Login>;
    deleteMessage(channelId: string, messageId: string): Promise<void>;
    getMessage(channelId: string, messageId: string): Promise<Universal.Message>;
    getMessageList(channelId: string, before?: string): Promise<{
        data: Universal.Message[];
        next: string;
    }>;
    getUser(userId: string, guildId?: string): Promise<Universal.User>;
    getGuildMemberList(guildId: string): Promise<{
        data: Universal.GuildMember[];
    }>;
    getChannel(channelId: string, guildId?: string): Promise<Universal.Channel>;
    getChannelList(guildId: string): Promise<{
        data: Universal.Channel[];
    }>;
    getGuild(guildId?: string): Promise<Universal.Guild>;
    getGuildList(): Promise<{
        data: Universal.Guild[];
    }>;
    getGuildMember(guildId: string, userId: string): Promise<Universal.GuildMember>;
    createDirectChannel(userId: string): Promise<{
        id: string;
        type: Universal.Channel.Type;
    }>;
    getReactions(channelId: string, messageId: string, emoji: string): Promise<{
        userId: string;
    }[]>;
    createReaction(channelId: string, messageId: string, emoji: string): Promise<void>;
    clearReaction(channelId: string, messageId: string, emoji?: string): Promise<void>;
}
export declare namespace SlackBot {
    interface BaseConfig extends HTTP.Config {
        token: string;
        botToken: string;
    }
    type Config = BaseConfig & (HttpServer.Options | WsClient.Options);
    const Config: Schema<Config>;
}
