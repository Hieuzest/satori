import { Context, Dict, HTTP } from '@satorijs/core';
import { LarkBot } from './bot';
export interface Internal {
}
export interface BaseResponse {
    /** error code. would be 0 if success, and non-0 if failed. */
    code: number;
    /** error message. would be 'success' if success. */
    msg: string;
}
export type Paginated<T = any, ItemsKey extends string = 'items'> = Promise<{
    [K in ItemsKey]: T[];
} & {
    page_token?: string;
    has_more: boolean;
}> & AsyncIterableIterator<T>;
export interface Pagination {
    page_size?: number;
    page_token?: string;
}
export interface InternalRoute {
    name: string;
    pagination?: {
        argIndex: number;
        itemsKey?: string;
        tokenKey?: string;
    };
    multipart?: boolean;
    type?: 'raw-json' | 'binary';
}
export declare class Internal<C extends Context = Context> {
    constructor(bot: LarkBot<C>, tree?: Dict);
    private static _assertResponse;
    private static _buildData;
    private static _tree;
    static define(routes: Dict<Partial<Record<HTTP.Method, string | InternalRoute>>>): void;
}
