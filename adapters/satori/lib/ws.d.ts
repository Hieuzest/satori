import { Adapter, Context, HTTP, Logger, Schema, Universal } from '@satorijs/core';
import { SatoriBot } from './bot';
export declare class SatoriAdapter<C extends Context = Context, B extends SatoriBot<C> = SatoriBot<C>> extends Adapter.WsClientBase<C, B> {
    ctx: C;
    config: SatoriAdapter.Config;
    static schema: any;
    static reusable: boolean;
    static inject: string[];
    http: HTTP;
    logger: Logger;
    private _status;
    private sequence?;
    private timeout?;
    private _metaDispose?;
    constructor(ctx: C, config: SatoriAdapter.Config);
    getActive(): boolean;
    setStatus(status: Universal.Status, error?: Error): void;
    prepare(): Promise<WebSocket>;
    getBot(login: Universal.Login, action?: 'created' | 'updated' | 'removed'): B | undefined;
    accept(socket: WebSocket): void;
    start(): Promise<void>;
    stop(): Promise<void>;
}
export declare namespace SatoriAdapter {
    interface Config extends Adapter.WsClientConfig {
        endpoint: string;
        token?: string;
    }
    const Config: Schema<Config>;
}
