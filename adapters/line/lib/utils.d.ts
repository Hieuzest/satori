import { h, Session } from '@satorijs/core';
import { LineBot } from './bot';
import { EventMessage, WebhookEvent } from './types';
export declare function adaptMessage(bot: LineBot, message: EventMessage): Promise<h[]>;
export declare function adaptSessions(bot: LineBot, body: WebhookEvent): Promise<Session<import("cordis").Context>[]>;
