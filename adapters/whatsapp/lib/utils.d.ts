import { Session } from '@satorijs/core';
import { WhatsAppBot } from './bot';
import { Entry } from './types';
export declare function decodeSession(bot: WhatsAppBot, entry: Entry): Promise<Session<import("cordis").Context>[]>;
