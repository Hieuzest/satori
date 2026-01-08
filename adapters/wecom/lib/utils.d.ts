import { Message } from './types';
import { WecomBot } from './bot';
import { Context } from '@satorijs/core';
export declare function decodeMessage<C extends Context>(bot: WecomBot<C>, message: Message): Promise<C[typeof import("cordis").Context.session]>;
