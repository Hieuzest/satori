import { Bot, Context, HTTP, Schema, Universal } from '@satorijs/core';
import { HttpPolling } from './polling';
import { Internal } from './types';
import { ZulipMessageEncoder } from './message';
export declare class ZulipBot<C extends Context = Context> extends Bot<C, ZulipBot.Config> {
    static MessageEncoder: typeof ZulipMessageEncoder;
    static inject: string[];
    http: HTTP;
    internal: Internal;
    constructor(ctx: C, config: ZulipBot.Config);
    getGuildList(): Promise<{
        data: Universal.Guild[];
    }>;
    getGuild(guildId: string): Promise<Universal.Guild>;
    getChannelList(guildId: string): Promise<{
        data: {
            id: string;
            type: Universal.Channel.Type;
        }[];
    }>;
    getGuildMember(guildId: string, userId: string): Promise<Universal.User>;
    getUser(userId: string, guildId?: string): Promise<Universal.User>;
    getGuildMemberList(guildId: string): Promise<{
        data: {
            user: Universal.User;
        }[];
    }>;
    getMessage(channelId: string, messageId: string): Promise<Universal.Message>;
    getLogin(): Promise<Universal.Login>;
    getMessageList(channelId: string, before?: string): Promise<{
        data: Universal.Message[];
        next: string;
    }>;
    getReactions(channelId: string, messageId: string, emoji: string): Promise<Universal.User[]>;
    createReaction(channelId: string, messageId: string, emoji: string): Promise<void>;
    deleteReaction(channelId: string, messageId: string, emoji: string): Promise<void>;
}
export declare namespace ZulipBot {
    interface Config extends HTTP.Config, HttpPolling.Options {
        email: string;
        key: string;
    }
    const Config: Schema<Config>;
}
