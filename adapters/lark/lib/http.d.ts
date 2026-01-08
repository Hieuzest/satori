import { Adapter, Context, Schema } from '@satorijs/core';
import { LarkBot } from './bot';
import { EventPayload } from './utils';
export declare class HttpServer<C extends Context = Context> extends Adapter<C, LarkBot<C, LarkBot.BaseConfig & HttpServer.Options>> {
    static inject: string[];
    private logger;
    private ciphers;
    constructor(ctx: C, bot: LarkBot<C>);
    fork(ctx: C, bot: LarkBot<C, LarkBot.BaseConfig & HttpServer.Options>): Promise<void>;
    connect(bot: LarkBot<C, LarkBot.BaseConfig & HttpServer.Options>): Promise<void>;
    dispatchSession(body: EventPayload): Promise<void>;
    private _tryDecryptBody;
    private _refreshCipher;
}
export declare namespace HttpServer {
    interface Options {
        protocol: 'http';
        selfUrl?: string;
        path?: string;
        encryptKey?: string;
        verificationToken?: string;
        verifyToken?: boolean;
        verifySignature?: boolean;
    }
    const createConfig: (path: string) => Schema<Options>;
}
