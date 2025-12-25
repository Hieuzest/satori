import { Adapter, Context, Schema } from '@satorijs/core';
import { DingtalkBot } from './bot';
export declare class WsClient<C extends Context = Context> extends Adapter.WsClient<C, DingtalkBot<C>> {
    prepare(): Promise<WebSocket>;
    accept(): void;
}
export declare namespace WsClient {
    interface Options extends Adapter.WsClientConfig {
    }
    const Options: Schema<Options>;
}
