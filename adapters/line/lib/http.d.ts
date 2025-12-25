import { Adapter, Context } from '@satorijs/core';
import { LineBot } from './bot';
export declare class HttpServer<C extends Context = Context> extends Adapter<C, LineBot<C>> {
    static inject: string[];
    connect(bot: LineBot<C>): Promise<void>;
}
