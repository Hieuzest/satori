import { Adapter, Context, Schema } from '@satorijs/core';
import { SlackBot } from './bot';
export declare class WsClient<C extends Context = Context> extends Adapter.WsClient<C, SlackBot<C, SlackBot.BaseConfig & WsClient.Options>> {
    prepare(): Promise<WebSocket>;
    accept(): Promise<void>;
}
export declare namespace WsClient {
    interface Options extends Adapter.WsClientConfig {
        protocol: 'ws';
    }
    const Options: Schema<Options>;
}
