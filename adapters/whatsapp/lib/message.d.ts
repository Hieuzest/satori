import { Context, Dict, h, MessageEncoder } from '@satorijs/core';
import { WhatsAppBot } from './bot';
import { Button, SendMessage } from './types';
export declare class WhatsAppMessageEncoder<C extends Context = Context> extends MessageEncoder<C, WhatsAppBot<C>> {
    private buffer;
    quoteId: string;
    private buttons;
    flush(): Promise<void>;
    flushTextMessage(): Promise<void>;
    flushButton(): Promise<void>;
    sendMessage<T extends SendMessage['type']>(type: T, data: Dict): Promise<void>;
    uploadMedia(attrs: Dict): Promise<string>;
    decodeButton(attrs: Dict, label: string): Button;
    visit(element: h): Promise<void>;
}
