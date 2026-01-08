import { Context, h, MessageEncoder } from '@satorijs/core';
import { LarkBot } from './bot';
import { EventPayload } from './utils';
export declare class LarkMessageEncoder<C extends Context = Context> extends MessageEncoder<C, LarkBot<C>> {
    referrer?: EventPayload;
    private quote;
    private textContent;
    private richContent;
    private card;
    private elements;
    private inline;
    editMessageIds: string[] | undefined;
    post(data?: any): Promise<void>;
    private flushText;
    flush(): Promise<void>;
    createImage(url: string): Promise<string>;
    sendFile(_type: 'video' | 'audio' | 'file', attrs: any): Promise<void>;
    private createBehaviors;
    visit(element: h): Promise<void>;
}
export { LarkMessageEncoder as FeishuMessageEncoder };
