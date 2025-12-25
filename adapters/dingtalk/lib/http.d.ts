import { Adapter, Context } from '@satorijs/core';
import { DingtalkBot } from './bot';
export declare class HttpServer<C extends Context = Context> extends Adapter<C, DingtalkBot<C>> {
    static inject: string[];
    private logger;
    constructor(ctx: C, bot: DingtalkBot<C>);
    connect(bot: DingtalkBot<C>): Promise<void>;
}
