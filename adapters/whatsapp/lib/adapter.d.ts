import { Adapter, Context, HTTP, Schema } from '@satorijs/core';
import { WhatsAppBot } from './bot';
export declare class WhatsAppAdapter<C extends Context = Context> extends Adapter<C, WhatsAppBot<C>> {
    config: WhatsAppAdapter.Config;
    static inject: string[];
    static schema: any;
    static reusable: boolean;
    constructor(ctx: C, config: WhatsAppAdapter.Config);
}
export declare namespace WhatsAppAdapter {
    interface Config extends HTTP.Config {
        systemToken: string;
        verifyToken: string;
        id: string;
        secret: string;
    }
    const Config: Schema<Config>;
}
