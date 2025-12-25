import { Context, h, MessageEncoder } from '@satorijs/core';
import { WechatOfficialBot } from './bot';
import { SendMessage } from './types';
export declare class WechatOfficialMessageEncoder<C extends Context = Context> extends MessageEncoder<C, WechatOfficialBot<C>> {
    buffer: string;
    sent: boolean;
    upsertSend(): void;
    sendByHttpResponse(payload: Partial<SendMessage>): Promise<void>;
    sendByCustom(payload: any): Promise<void>;
    flushMedia(element: h): Promise<void>;
    flush(): Promise<void>;
    uploadMedia(element: h): Promise<string[]>;
    visit(element: h): Promise<void>;
}
