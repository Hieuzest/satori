import { Adapter, Context } from '@satorijs/core';
import { MatrixBot } from './bot';
export declare class HttpAdapter<C extends Context = Context> extends Adapter<C, MatrixBot<C>> {
    static inject: string[];
    private txnId;
    constructor(ctx: C);
    connect(bot: MatrixBot): Promise<void>;
    private transactions;
    private users;
    private rooms;
}
