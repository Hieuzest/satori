import { Context, Element, MessageEncoder } from '@satorijs/core';
import { MailBot } from './bot';
import { Attachment } from './mail';
export declare function randomId(): string;
export declare class MailMessageEncoder<C extends Context = Context> extends MessageEncoder<C, MailBot<C>> {
    buffer: string;
    reply: string;
    attachments: Attachment[];
    figure: boolean;
    flush(): Promise<void>;
    visit(element: Element): Promise<void>;
}
