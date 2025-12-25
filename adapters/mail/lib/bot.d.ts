import { Bot, Context, Schema } from '@satorijs/core';
import { SMTP } from './mail';
import { MailMessageEncoder } from './message';
export declare class MailBot<C extends Context = Context> extends Bot<C, MailBot.Config> {
    static MessageEncoder: typeof MailMessageEncoder;
    static inject: string[];
    internal: SMTP;
    constructor(ctx: C, config: MailBot.Config);
}
export declare namespace MailBot {
    interface Config {
        name: string;
        selfId: string;
        username: string;
        password: string;
        subject: string;
        imap: {
            host: string;
            port: number;
            tls: boolean;
        };
        smtp: {
            host: string;
            port: number;
            tls: boolean;
        };
    }
    const Config: Schema<Schemastery.ObjectS<{
        username: Schema<string, string>;
        password: Schema<string, string>;
        selfId: Schema<string, string>;
        name: Schema<string, string>;
        subject: Schema<string, string>;
        imap: Schema<Schemastery.ObjectS<{
            host: Schema<string, string>;
            tls: Schema<boolean, boolean>;
        }> | Schemastery.ObjectS<{
            tls: Schema<true, true>;
            port: Schema<number, number>;
        }> | Schemastery.ObjectS<{
            tls: Schema<false, false>;
            port: Schema<number, number>;
        }>, {
            host: string;
            tls: boolean;
        } & import("cosmokit").Dict & (Schemastery.ObjectT<{
            tls: Schema<true, true>;
            port: Schema<number, number>;
        }> | Schemastery.ObjectT<{
            tls: Schema<false, false>;
            port: Schema<number, number>;
        }>)>;
        smtp: Schema<Schemastery.ObjectS<{
            host: Schema<string, string>;
            tls: Schema<boolean, boolean>;
        }> | Schemastery.ObjectS<{
            tls: Schema<true, true>;
            port: Schema<number, number>;
        }> | Schemastery.ObjectS<{
            tls: Schema<false, false>;
            port: Schema<number, number>;
        }>, {
            host: string;
            tls: boolean;
        } & import("cosmokit").Dict & (Schemastery.ObjectT<{
            tls: Schema<true, true>;
            port: Schema<number, number>;
        }> | Schemastery.ObjectT<{
            tls: Schema<false, false>;
            port: Schema<number, number>;
        }>)>;
    }>, Schemastery.ObjectT<{
        username: Schema<string, string>;
        password: Schema<string, string>;
        selfId: Schema<string, string>;
        name: Schema<string, string>;
        subject: Schema<string, string>;
        imap: Schema<Schemastery.ObjectS<{
            host: Schema<string, string>;
            tls: Schema<boolean, boolean>;
        }> | Schemastery.ObjectS<{
            tls: Schema<true, true>;
            port: Schema<number, number>;
        }> | Schemastery.ObjectS<{
            tls: Schema<false, false>;
            port: Schema<number, number>;
        }>, {
            host: string;
            tls: boolean;
        } & import("cosmokit").Dict & (Schemastery.ObjectT<{
            tls: Schema<true, true>;
            port: Schema<number, number>;
        }> | Schemastery.ObjectT<{
            tls: Schema<false, false>;
            port: Schema<number, number>;
        }>)>;
        smtp: Schema<Schemastery.ObjectS<{
            host: Schema<string, string>;
            tls: Schema<boolean, boolean>;
        }> | Schemastery.ObjectS<{
            tls: Schema<true, true>;
            port: Schema<number, number>;
        }> | Schemastery.ObjectS<{
            tls: Schema<false, false>;
            port: Schema<number, number>;
        }>, {
            host: string;
            tls: boolean;
        } & import("cosmokit").Dict & (Schemastery.ObjectT<{
            tls: Schema<true, true>;
            port: Schema<number, number>;
        }> | Schemastery.ObjectT<{
            tls: Schema<false, false>;
            port: Schema<number, number>;
        }>)>;
    }>>;
}
