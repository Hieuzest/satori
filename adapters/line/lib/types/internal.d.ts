import { Dict, HTTP } from '@satorijs/core';
export declare class Internal {
    private http;
    constructor(http: HTTP);
    static define(routes: Dict<Partial<Record<HTTP.Method, string | string[]>>>): void;
}
