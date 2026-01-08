import { Bot, Context, HTTP, Schema, Universal } from '@satorijs/core';
import { MatrixMessageEncoder } from './message';
import * as Matrix from './types';
export declare class MatrixBot<C extends Context = Context> extends Bot<C, MatrixBot.Config> {
    static MessageEncoder: typeof MatrixMessageEncoder;
    static inject: string[];
    http: HTTP;
    id: string;
    endpoint: string;
    rooms: string[];
    internal: Matrix.Internal;
    constructor(ctx: C, config: MatrixBot.Config);
    initialize(): Promise<void>;
    getMessage(channelId: string, messageId: string): Promise<Universal.Message>;
    deleteMessage(channelId: string, messageId: string): Promise<void>;
    getLogin(): Promise<Universal.Login>;
    getUser(userId: string): Promise<Universal.User>;
    getGuild(guildId: string): Promise<{
        id: string;
        name: string;
    }>;
    getChannel(id: string): Promise<{
        id: string;
        name: string;
        type: Universal.Channel.Type;
    }>;
    getGuildList(): Promise<{
        data: {
            id: string;
            name: string;
        }[];
    }>;
    getChannelList(guildId: string): Promise<{
        data: {
            id: string;
            name: string;
            type: Universal.Channel.Type;
        }[];
    }>;
    getGuildMemberList(guildId: string): Promise<{
        data: {
            user: Universal.User;
            isBot: boolean;
            roles: string[];
        }[];
    }>;
    getGuildMember(guildId: string, userId: string): Promise<{
        user: Universal.User;
        isBot: boolean;
        roles: string[];
    }>;
    createReaction(channelId: string, messageId: string, emoji: string): Promise<void>;
    handleFriendRequest(): Promise<void>;
    handleGuildRequest(messageId: string, approve: boolean, commit: string): Promise<void>;
    syncRooms(): Promise<Matrix.Sync>;
}
export declare namespace MatrixBot {
    interface Config extends HTTP.Config {
        name?: string;
        avatar?: string;
        id?: string;
        hsToken?: string;
        asToken?: string;
        host?: string;
        path?: string;
    }
    const Config: Schema<Config>;
}
