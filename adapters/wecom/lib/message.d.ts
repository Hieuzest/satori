import { Context, h, MessageEncoder } from '@satorijs/core';
import { WecomBot } from './bot';
/** https://developer.work.weixin.qq.com/document/path/90236#%E6%94%AF%E6%8C%81%E7%9A%84markdown%E8%AF%AD%E6%B3%95 */
export declare class WecomMessageEncoder<C extends Context = Context> extends MessageEncoder<C, WecomBot<C>> {
    buffer: string;
    upsertSend(msgId: string, payload: any): void;
    /** https://developer.work.weixin.qq.com/document/path/90236 */
    sendByCustom(payload: any): Promise<void>;
    flushMedia(element: h): Promise<void>;
    flush(): Promise<void>;
    /** https://developer.work.weixin.qq.com/document/path/90253 */
    uploadMedia(element: h): Promise<string[]>;
    visit(element: h): Promise<void>;
}
