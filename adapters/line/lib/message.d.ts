import { Context, Dict, h, MessageEncoder } from '@satorijs/core';
import { LineBot } from './bot';
import * as Line from './types';
export declare const escape: (val: string) => string;
export declare const unescape: (val: string) => string;
export declare class LineMessageEncoder<C extends Context = Context> extends MessageEncoder<C, LineBot<C>> {
    buffer: string;
    blocks: Line.Message[];
    sender: Line.Sender;
    emojis: Line.Emoji[];
    buttons: Line.Action[];
    flush(): Promise<void>;
    insertBlock(): Promise<void>;
    decodeButton(attrs: Dict, label: string): Line.Action;
    visit(element: h): Promise<void>;
}
