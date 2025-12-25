import { Block, KnownBlock, MessageAttachment } from '@slack/types';
export type MessageEvent = BotMessageEvent | ChannelJoinMessageEvent | ChannelLeaveMessageEvent | ChannelNameMessageEvent | FileShareMessageEvent | MeMessageEvent | MessageChangedEvent | MessageDeletedEvent;
export interface GenericMessageEvent {
    type: 'message';
    subtype: undefined;
    event_ts: string;
    team?: string;
    channel: string;
    user: string;
    bot_id?: string;
    app_id?: string;
    username?: string;
    bot_profile?: BotProfile;
    text?: string;
    ts: string;
    thread_ts?: string;
    channel_type: channelTypes;
    attachments?: MessageAttachment[];
    blocks?: (KnownBlock | Block)[];
    files?: File[];
    edited?: {
        user: string;
        ts: string;
    };
    client_msg_id?: string;
    parent_user_id?: string;
    is_starred?: boolean;
    pinned_to?: string[];
    reactions?: {
        name: string;
        count: number;
        users: string[];
    }[];
}
export interface BotMessageEvent {
    type: 'message';
    subtype: 'bot_message';
    event_ts: string;
    channel: string;
    channel_type: channelTypes;
    ts: string;
    text: string;
    bot_id: string;
    username?: string;
    icons?: {
        [size: string]: string;
    };
    user?: string;
    attachments?: MessageAttachment[];
    blocks?: (KnownBlock | Block)[];
    edited?: {
        user: string;
        ts: string;
    };
    thread_ts?: string;
}
export interface ChannelJoinMessageEvent {
    type: 'message';
    subtype: 'channel_join';
    team: string;
    user: string;
    inviter: string;
    channel: string;
    channel_type: channelTypes;
    text: string;
    ts: string;
    event_ts: string;
}
export interface ChannelLeaveMessageEvent {
    type: 'message';
    subtype: 'channel_leave';
    team: string;
    user: string;
    channel: string;
    channel_type: channelTypes;
    text: string;
    ts: string;
    event_ts: string;
}
export interface ChannelNameMessageEvent {
    type: 'message';
    subtype: 'channel_name';
    team: string;
    user: string;
    name: string;
    old_name: string;
    channel: string;
    channel_type: channelTypes;
    text: string;
    ts: string;
    event_ts: string;
}
export interface FileShareMessageEvent {
    type: 'message';
    subtype: 'file_share';
    text: string;
    attachments?: MessageAttachment[];
    blocks?: (KnownBlock | Block)[];
    files?: File[];
    upload?: boolean;
    display_as_bot?: boolean;
    x_files?: string[];
    user: string;
    parent_user_id?: string;
    ts: string;
    thread_ts?: string;
    channel: string;
    channel_type: channelTypes;
    event_ts: string;
}
export interface MeMessageEvent {
    type: 'message';
    subtype: 'me_message';
    event_ts: string;
    channel: string;
    channel_type: channelTypes;
    user: string;
    text: string;
    ts: string;
}
export interface MessageChangedEvent {
    type: 'message';
    subtype: 'message_changed';
    event_ts: string;
    hidden: true;
    channel: string;
    channel_type: channelTypes;
    ts: string;
    message: GenericMessageEvent;
    previous_message: GenericMessageEvent;
}
export interface MessageDeletedEvent {
    type: 'message';
    subtype: 'message_deleted';
    event_ts: string;
    hidden: true;
    channel: string;
    channel_type: channelTypes;
    ts: string;
    deleted_ts: string;
    previous_message: GenericMessageEvent;
}
export type channelTypes = 'channel' | 'group' | 'im' | 'mpim' | 'app_home';
interface BotProfile {
    id: string;
    name: string;
    app_id: string;
    team_id: string;
    icons: {
        [size: string]: string;
    };
    updated: number;
    deleted: boolean;
}
export interface File {
    id: string;
    created: number;
    name: string | null;
    title: string | null;
    mimetype: string;
    filetype: string;
    pretty_type: string;
    user?: string;
    editable: boolean;
    size: number;
    mode: 'hosted' | 'external' | 'snippet' | 'post';
    is_external: boolean;
    external_type: string | null;
    is_public: boolean;
    public_url_shared: boolean;
    display_as_bot: boolean;
    username: string | null;
    url_private?: string;
    url_private_download?: string;
    thumb_64?: string;
    thumb_80?: string;
    thumb_160?: string;
    thumb_360?: string;
    thumb_360_w?: number;
    thumb_360_h?: number;
    thumb_360_gif?: string;
    thumb_480?: string;
    thumb_720?: string;
    thumb_960?: string;
    thumb_1024?: string;
    permalink: string;
    permalink_public?: string;
    edit_link?: string;
    image_exif_rotation?: number;
    original_w?: number;
    original_h?: number;
    deanimate_gif?: string;
    preview?: string;
    preview_highlight?: string;
    lines?: string;
    lines_more?: string;
    preview_is_truncated?: boolean;
    has_rich_preview?: boolean;
    shares?: {
        [key: string]: any;
    };
    channels: string[] | null;
    groups: string[] | null;
    users?: string[];
    pinned_to?: string[];
    reactions?: {
        [key: string]: any;
    }[];
    is_starred?: boolean;
    num_stars?: number;
    initial_comment?: string;
    comments_count?: string;
}
export {};
