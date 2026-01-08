import { Context, Session, Universal } from '@satorijs/core';
import { SlackBot } from './bot';
import { EnvelopedEvent, GenericMessageEvent, MessageDeletedEvent, SlackEvent, SlackUser } from './types/events';
import { Definitions, File, SlackChannel, SlackTeam } from './types';
export declare function adaptMessage(bot: SlackBot, data: Partial<GenericMessageEvent> | Definitions.Message, message: Universal.Message, payload?: Universal.MessageLike): Promise<void>;
export declare function adaptMessageDeleted(bot: SlackBot, event: MessageDeletedEvent, session: Session): void;
export declare function adaptSentAsset(file: File, session: Session): void;
export declare function adaptSession<C extends Context = Context>(bot: SlackBot<C>, payload: EnvelopedEvent<SlackEvent>): Promise<C[typeof import("cordis").Context.session]>;
export interface AuthTestResponse {
    ok: boolean;
    url: string;
    team: string;
    user: string;
    team_id: string;
    user_id: string;
    bot_id?: string;
    is_enterprise_install: boolean;
}
export declare const decodeUser: (data: SlackUser) => Universal.User;
export declare const decodeGuildMember: (data: SlackUser) => Universal.GuildMember;
export declare const decodeChannel: (data: SlackChannel) => Universal.Channel;
export declare const decodeGuild: (data: SlackTeam | Definitions.Team) => Universal.Guild;
