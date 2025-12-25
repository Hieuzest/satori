import { Dict, HTTP } from '@satorijs/core';
import { DingtalkBot } from './bot';
export declare class Internal {
    private bot;
    constructor(bot: DingtalkBot);
    static define(routes: Dict<Partial<Record<HTTP.Method, Record<string, boolean>>>>): void;
}
