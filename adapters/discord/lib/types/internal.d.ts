import { Context, Dict, HTTP } from '@satorijs/core';
import { DiscordBot } from '../bot';
export declare class Internal<C extends Context = Context> {
    private bot;
    constructor(bot: DiscordBot<C>);
    static define(routes: Dict<Partial<Record<HTTP.Method, string | string[]>>>): void;
}
