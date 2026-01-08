import { Universal } from '@satorijs/core';
import { ParsedMail } from 'mailparser';
import { MailBot } from './bot';
export declare function adaptMessage(bot: MailBot, mail: ParsedMail, message: Universal.Message, payload: Universal.MessageLike): Promise<Universal.Message>;
export declare function dispatchSession(bot: MailBot, mail: ParsedMail): Promise<any>;
