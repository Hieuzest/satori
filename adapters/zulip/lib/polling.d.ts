import { Adapter, Context, Schema } from '@satorijs/core';
import { ZulipBot } from './bot';
export declare class HttpPolling<C extends Context = Context> extends Adapter<C, ZulipBot<C>> {
    static reusable: boolean;
    private timeout;
    connect(bot: ZulipBot): Promise<void>;
    disconnect(bot: ZulipBot): Promise<void>;
}
export declare namespace HttpPolling {
    interface Options {
        protocol: 'polling';
        retryTimes?: number;
        retryInterval?: number;
    }
    const Options: Schema<Options>;
}
