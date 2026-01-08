import { Context, h, MessageEncoder } from '@satorijs/core';
import { ZulipBot } from './bot';
export declare const escape: (val: string) => string;
export declare const unescape: (val: string) => string;
export declare class ZulipMessageEncoder<C extends Context = Context> extends MessageEncoder<C, ZulipBot<C>> {
    buffer: string;
    flush(): Promise<void>;
    uploadMedia(element: h): Promise<string[]>;
    getUser(id: string): Promise<string>;
    visit(element: h): Promise<void>;
}
