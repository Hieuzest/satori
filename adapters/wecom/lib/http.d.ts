import { Adapter, Context } from '@satorijs/core';
import { WecomBot } from './bot';
export declare class HttpServer<C extends Context = Context> extends Adapter<C, WecomBot<C>> {
    static inject: string[];
    connect(bot: WecomBot): Promise<void>;
}
