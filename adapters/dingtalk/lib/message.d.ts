import { Context, Dict, h, MessageEncoder } from '@satorijs/core';
import { DingtalkBot } from './bot';
import { SendMessageData } from './types';
export declare const escape: (val: string) => string;
export declare const unescape: (val: string) => string;
export declare class DingtalkMessageEncoder<C extends Context = Context> extends MessageEncoder<C, DingtalkBot<C>> {
    buffer: string;
    /**
     * Markdown: https://open.dingtalk.com/document/isvapp/robot-message-types-and-data-format
     */
    hasRichContent: boolean;
    flush(): Promise<void>;
    sendMessage<T extends keyof SendMessageData>(msgType: T, msgParam: SendMessageData[T]): Promise<void>;
    uploadMedia(attrs: Dict): Promise<any>;
    private listType;
    visit(element: h): Promise<void>;
}
