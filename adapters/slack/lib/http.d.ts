import { Adapter, Context, Schema } from '@satorijs/core';
import { SlackBot } from './bot';
export declare class HttpServer<C extends Context = Context> extends Adapter<C, SlackBot<C>> {
    static inject: string[];
    connect(bot: SlackBot<C, SlackBot.Config & HttpServer.Options>): Promise<void>;
}
export declare namespace HttpServer {
    interface Options {
        protocol: 'http';
        signing: string;
    }
    const Options: Schema<Options>;
}
