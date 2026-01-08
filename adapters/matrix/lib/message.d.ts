import { Context, MessageEncoder, segment } from '@satorijs/core';
import { MatrixBot } from './bot';
export declare class MatrixMessageEncoder<C extends Context = Context> extends MessageEncoder<C, MatrixBot<C>> {
    private buffer;
    private reply;
    sendMedia(url: string, mediaType: 'file' | 'image' | 'video' | 'audio'): Promise<void>;
    flush(): Promise<void>;
    visit(element: segment): Promise<void>;
}
