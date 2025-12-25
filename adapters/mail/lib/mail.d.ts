import NodeIMAP from 'node-imap';
import { Transporter } from 'nodemailer';
import { MailBot } from './bot';
import { Adapter, Context } from '@satorijs/core';
export declare class IMAP<C extends Context = Context> extends Adapter<C, MailBot<C>> {
    bot: MailBot<C>;
    static reusable: boolean;
    imap: NodeIMAP;
    constructor(ctx: C, bot: MailBot<C>);
    connect(bot: MailBot<C>): Promise<void>;
    stop(): void;
    inbox(error: Error): void;
    scan(): void;
}
export interface Attachment {
    filename?: string;
    content: Buffer;
    contentType: string;
    cid?: string;
}
export interface SendOptions {
    to: string;
    html: string;
    attachments?: Attachment[];
    subject?: string;
    inReplyTo?: string;
}
export declare class SMTP {
    transporter: Transporter;
    from: string;
    constructor(config: MailBot.Config);
    send(options: SendOptions): Promise<string>;
}
