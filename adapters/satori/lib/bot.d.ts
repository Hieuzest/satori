import { Bot, Context, HTTP, Universal } from '@satorijs/core';
import { SatoriAdapter } from './ws';
export declare class SatoriBot<C extends Context = Context> extends Bot<C, Universal.Login> {
    adapter: SatoriAdapter<C, this>;
    internal: () => void;
    constructor(ctx: C, config: Universal.Login);
    request(url: string, config: HTTP.RequestConfig): Promise<HTTP.Response<any>>;
}
