import { Context } from '@satorijs/core';
import { Message } from './types';
import { DingtalkBot } from './bot';
export declare function decodeMessage<C extends Context>(bot: DingtalkBot<C>, body: Message): Promise<C[typeof import("cordis").Context.session]>;
