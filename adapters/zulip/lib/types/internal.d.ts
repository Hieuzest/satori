import { Dict, HTTP } from '@satorijs/core';
export declare class Internal {
    http: HTTP;
    constructor(http: HTTP);
    static define(routes: Dict<Partial<Record<HTTP.Method, string | string[]>>>): void;
}
