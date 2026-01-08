import { Adapter, Context, Schema } from '@satorijs/core';
import { LarkBot } from './bot';
import pb from 'protobufjs/light';
interface FrameSegment {
    message_id: string;
    sum: number;
    seq: number;
    data: Uint8Array;
}
export declare class WsClient<C extends Context = Context> extends Adapter.WsClient<C, LarkBot<C, LarkBot.BaseConfig & WsClient.Options>> {
    _deviceId: string;
    _serviceId: number;
    _pingInterval: number;
    _ping: NodeJS.Timeout;
    _cache: Record<string, FrameSegment[]>;
    _frame: pb.Type;
    constructor(ctx: C, bot: LarkBot<C, LarkBot.BaseConfig & WsClient.Options>);
    prepare(): Promise<WebSocket>;
    ping(): void;
    accept(): Promise<void>;
    send(frame: any): void;
    retrieve(seg: FrameSegment): Uint8Array | undefined;
}
export declare namespace WsClient {
    interface Options extends Adapter.WsClientConfig {
        protocol: 'ws';
    }
    const Options: Schema<Options>;
}
export {};
