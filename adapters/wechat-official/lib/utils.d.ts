import { Message } from './types';
import { WechatOfficialBot } from './bot';
import { Context } from '@satorijs/core';
export declare function decodeMessage<C extends Context>(bot: WechatOfficialBot<C>, message: Message): Promise<C[typeof import("cordis").Context.session]>;
