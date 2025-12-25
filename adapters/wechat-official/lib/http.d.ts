import { Adapter, Context } from '@satorijs/core';
import { WechatOfficialBot } from './bot';
export declare class HttpServer<C extends Context = Context> extends Adapter<C, WechatOfficialBot<C>> {
    static inject: string[];
    connect(bot: WechatOfficialBot): Promise<void>;
}
