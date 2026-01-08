import { Bot, Context, HTTP } from '@satorijs/core';
import { WhatsAppMessageEncoder } from './message';
import { Internal } from './internal';
export declare class WhatsAppBot<C extends Context = Context> extends Bot<C> {
    static inject: string[];
    static MessageEncoder: typeof WhatsAppMessageEncoder;
    internal: Internal;
    http: HTTP;
    constructor(ctx: C);
    createReaction(channelId: string, messageId: string, emoji: string): Promise<void>;
}
