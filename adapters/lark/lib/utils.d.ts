import { Context, Session, Universal } from '@satorijs/core';
import { LarkBot } from './bot';
import { Im, ListChat, Message, User } from './types';
import { MessageContent } from './content';
export interface EventHeader<K extends keyof Events> {
    event_id: string;
    event_type: K;
    create_time: string;
    token: string;
    app_id: string;
    tenant_key: string;
}
export interface Events {
    /**
     * Receive message event.
     * @see https://open.larksuite.com/document/uAjLw4CM/ukTMukTMukTM/reference/im-v1/message/events/receive
     */
    'im.message.receive_v1': {
        sender: {
            sender_id: UserIds;
            sender_type?: string;
            tenant_key: string;
        };
        message: {
            message_id: string;
            root_id: string;
            parent_id: string;
            thread_id: string;
            create_time: string;
            chat_id: string;
            chat_type: string;
            message_type: keyof MessageContent;
            content: string;
            mentions: {
                key: string;
                id: UserIds;
                name: string;
                tenant_key: string;
            }[];
        };
    };
    /**
     * Message read event.
     * @see https://open.larksuite.com/document/uAjLw4CM/ukTMukTMukTM/reference/im-v1/message/events/message_read
     */
    'im.message.message_read_v1': {
        reader: {
            reader_id: UserIds;
            read_time: string;
            tenant_key: string;
        };
        message_id_list: string[];
    };
    /**
     * Message card callback event.
     * @see https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/card-callback-communication
     */
    'card.action.trigger': {
        operator: {
            tenant_key: string;
            user_id: string;
            union_id: string;
            open_id: string;
        };
        token: string;
        action: {
            value: any;
            tag: string;
            timezone?: string;
            name?: string;
            form_value?: any;
            input_value?: string;
            option?: string;
            options?: string[];
            checked?: boolean;
        };
        host: string;
        /** 卡片分发类型，固定取值为 url_preview，表示链接预览卡片。仅链接预览卡片有此字段。 */
        delivery_type?: 'url_preview';
        context: {
            url?: string;
            preview_token?: string;
            open_message_id: string;
            open_chat_id: string;
        };
    };
    /**
     * 机器人自定义菜单事件
     * @see https://open.feishu.cn/document/client-docs/bot-v3/events/menu
     */
    'application.bot.menu_v6': {
        operator: {
            operator_name: string;
            operator_id: {
                union_id: string;
                user_id: string;
                open_id: string;
            };
        };
        event_key: string;
        timestamp: number;
    };
}
export type EventPayload = {
    [K in keyof Events]: {
        schema: '2.0';
        type: K;
        header: EventHeader<K>;
        event: Events[K];
    };
}[keyof Events];
/**
 * A user in Lark has several different IDs.
 * @see https://open.larksuite.com/document/home/user-identity-introduction/introduction
 */
export interface UserIds {
    union_id: string;
    /** *user_id* only available when the app has permissions granted by the administrator */
    user_id?: string;
    open_id: string;
}
/**
 * Identify a user in Lark.
 * This behaves like {@link UserIds}, but it only contains *open_id*.
 * (i.e. the id_type is always `open_id`)
 */
export interface UserIdentifiers {
    id: string;
    id_type: string;
}
export type UserIdType = 'union_id' | 'user_id' | 'open_id';
/**
 * The id type when specify a receiver, would be used in the request query.
 *
 * NOTE: we always use **open_id** to identify a user, use **chat_id** to identify a channel.
 * @see https://open.larksuite.com/document/uAjLw4CM/ukTMukTMukTM/reference/im-v1/message/create
 */
export type ReceiveIdType = UserIdType | 'email' | 'chat_id';
export type DepartmentIdType = 'department_id' | 'open_department_id';
export type Sender = {
    sender_id: UserIds;
    sender_type?: string;
    tenant_key: string;
} | (UserIdentifiers & {
    sender_type?: string;
    tenant_key: string;
});
export declare function adaptSender(sender: Sender, session: Session): Session;
export declare function adaptMessage<C extends Context = Context>(bot: LarkBot<C>, data: Events['im.message.receive_v1'], session: Session, details?: boolean): Promise<Session>;
export declare function adaptSession<C extends Context>(bot: LarkBot<C>, body: EventPayload): Promise<C[typeof import("cordis").Context.session]>;
export declare function decodeMessage<C extends Context = Context>(bot: LarkBot<C>, body: Message, details?: boolean): Promise<Universal.Message>;
/**
 * Get ID type from id string
 * @see https://open.larksuite.com/document/home/user-identity-introduction/introduction
 */
export declare function extractIdType(id: string): ReceiveIdType;
export declare function decodeChannel(channelId: string, guild: Im.Chat.GetResponse): Universal.Channel;
export declare function decodeGuild(guild: ListChat): Universal.Guild;
export declare function decodeUser(user: User): Universal.User;
export declare class Cipher {
    encryptKey: string;
    key: Buffer;
    constructor(key: string);
    decrypt(encrypt: string): string;
    calculateSignature(timestamp: string, nonce: string, body: string): string;
}
