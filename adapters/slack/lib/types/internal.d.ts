import { Dict, HTTP } from '@satorijs/core';
import { SlackBot } from '../bot';
type SupportPostJSON = boolean;
export declare enum Token {
    BOT = 0,
    APP = 1
}
export type TokenInput = string | Token;
export declare class Internal {
    private bot;
    private http;
    constructor(bot: SlackBot, http: HTTP);
    static define(routes: Dict<Partial<Record<HTTP.Method, Record<string, SupportPostJSON>>>>): void;
}
export {};
