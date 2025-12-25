import { Context, h, MessageEncoder } from '@satorijs/core';
import { SlackBot } from './bot';
export declare const escape: (val: string) => string;
export declare const unescape: (val: string) => string;
export declare class SlackMessageEncoder<C extends Context = Context> extends MessageEncoder<C, SlackBot<C>> {
    buffer: string;
    thread_ts: any;
    elements: any[];
    addition: Record<string, any>;
    flush(): Promise<void>;
    sendAsset(element: h): Promise<void>;
    visit(element: h): Promise<void>;
}
