import { Dict } from '@satorijs/core';
import { MatrixBot } from './bot';
export interface Transaction {
    txnId: string;
    events: ClientEvent[];
}
export interface ClientEvent {
    content: EventContent;
    event_id: string;
    origin_server_ts: number;
    redacts?: string;
    room_id: string;
    sender: string;
    state_key?: string;
    type: string;
    unsigned?: UnsignedData;
}
export interface UnsignedData {
    age?: number;
    prev_content?: EventContent;
    redacted_because?: ClientEvent;
    transaction_id?: string;
}
export interface PreviousRoom {
    event_id: string;
    room_id: string;
}
export interface AllowCondition {
    room_id?: string;
    type: 'm.room_membership';
}
export interface Invite {
    display_name: string;
    signed: Signed;
}
export interface Signed {
    mxid: string;
    signatures: any;
    token: string;
}
export interface Notifications {
    room?: number;
}
export interface ThumbnailInfo {
    h?: number;
    mimetype?: string;
    size?: number;
    w?: number;
}
export interface ImageInfo {
    h?: number;
    mimetype?: string;
    size?: number;
    thumbnail_file?: any;
    thumbnail_info?: ThumbnailInfo;
    thumbnail_url?: string;
    w?: number;
}
export interface FileInfo {
    mimetype?: string;
    size?: number;
    thumbnail_file?: any;
    thumbnail_info?: ThumbnailInfo;
    thumbnail_url?: string;
}
export interface AudioInfo {
    duration?: number;
    mimetype?: string;
    size?: number;
}
export interface LocationInfo {
    thumbnail_file?: any;
    thumbnail_info?: ThumbnailInfo;
    thumbnail_url?: string;
}
export interface VideoInfo {
    duration?: number;
    h?: number;
    mimetype?: string;
    size?: number;
    thumbnail_file?: any;
    thumbnail_info?: ThumbnailInfo;
    thumbnail_url?: string;
    w?: number;
}
export interface PublicKeys {
    key_validity_url?: string;
    public_key: string;
}
export interface Profile {
    avatar_url?: string;
    displayname?: string;
}
export interface User {
    access_token?: string;
    device_id?: string;
    user_id?: string;
}
export interface Sync {
    account_data?: AccountData;
    next_batch: string;
    presence?: Presence;
    rooms?: Rooms;
}
export interface AccountData {
    events?: ClientEvent[];
}
export interface Presence {
    events?: ClientEvent[];
}
export interface Rooms {
    invite?: Dict<InvitedRoom>;
    join?: Dict<JoinedRoom>;
    knock?: Dict<KnockedRoom>;
    leave?: Dict<LeftRoom>;
}
export interface InvitedRoom {
    invite_state?: InviteState;
}
export interface InviteState {
    events?: ClientEvent[];
}
export interface JoinedRoom {
    account_data?: AccountData;
    ephemeral?: Ephemeral;
    state?: State;
    summary?: RoomSummary;
    timeline?: Timeline;
    unread_notifications?: UnreadNotificationCounts;
    unread_thread_notifications?: Dict<ThreadNotificationCounts>;
}
export interface Ephemeral {
    events?: ClientEvent[];
}
export interface State {
    events?: ClientEvent[];
}
export interface RoomSummary {
    'm.heroes'?: string[];
    'm.invited_member_count'?: number;
    'm.joined_member_count'?: number;
}
export interface Timeline {
    events: ClientEvent[];
    limited?: boolean;
    prev_batch?: string;
}
export interface UnreadNotificationCounts {
    highlight_count?: number;
    notification_count?: number;
}
export interface ThreadNotificationCounts {
    highlight_count?: number;
    notification_count?: number;
}
export interface KnockedRoom {
    knock_state?: KnockState;
}
export interface KnockState {
    events?: ClientEvent[];
}
export interface LeftRoom {
    account_data?: AccountData;
    state?: State;
    timeline?: Timeline;
}
export interface Invite3pid {
    address: string;
    id_access_token: string;
    id_server: string;
    medium: string;
}
export interface StateEvent {
    content: EventContent;
    state_key?: string;
    type: string;
}
export interface RoomCreation {
    creation_content?: Partial<M_ROOM_CREATE>;
    initial_state?: StateEvent[];
    invite?: string[];
    invite_3pid?: Invite3pid;
    is_direct?: boolean;
    name: string;
    power_level_content_override?: M_ROOM_POWER_LEVELS;
    preset?: 'private_chat' | 'public_chat' | 'trusted_private_chat';
    room_alias_name?: string;
    room_version?: string;
    topic?: string;
    visibility?: 'public' | 'private';
}
export interface EventContent {
}
export interface Relation {
    event_id?: string;
    rel_type?: string;
    'm.in_reply_to'?: {
        event_id: string;
    };
}
export interface M_ROOM_CANONICAL_ALIAS extends EventContent {
    alias?: string;
    alt_aliases?: string[];
}
export interface M_ROOM_CREATE extends EventContent {
    creator: string;
    'm.federate'?: boolean;
    predecessor?: PreviousRoom;
    room_version?: string;
    type?: string;
}
export interface M_ROOM_JOIN_RULES extends EventContent {
    allow?: AllowCondition[];
    join_rule?: 'public' | 'knock' | 'invite' | 'private' | 'restricted';
}
export interface M_ROOM_MEMBER extends EventContent {
    avatar_url?: string;
    displayname?: string;
    is_direct?: boolean;
    join_authorised_via_users_server?: string;
    membership?: 'invite' | 'join' | 'knock' | 'leave' | 'ban';
    reason?: string;
    third_party_invite?: Invite;
}
export interface M_ROOM_POWER_LEVELS extends EventContent {
    ban?: number;
    events?: Record<string, number>;
    events_default?: number;
    invite?: number;
    kick?: number;
    notifications?: Notifications;
    redact?: number;
    state_default?: number;
    users?: Record<string, number>;
    users_default?: number;
}
export interface M_ROOM_REDACTION extends EventContent {
    reason?: string;
}
export interface M_ROOM_MESSAGE extends EventContent {
    body: string;
    msgtype: string;
    'm.relates_to'?: Relation;
    'm.new_content'?: M_ROOM_MESSAGE;
}
export interface M_ROOM_MESSAGE_FEEDBACK extends EventContent {
    target_event_id: string;
    type: 'delivered' | 'read';
}
export interface M_ROOM_NAME extends EventContent {
    name: string;
}
export interface M_ROOM_TOPIC extends EventContent {
    topic: string;
}
export interface M_ROOM_AVATAR extends EventContent {
    info?: ImageInfo;
    url: string;
}
export interface M_ROOM_PINNED_EVENTS extends EventContent {
    pinned: string[];
}
export interface M_TEXT extends M_ROOM_MESSAGE {
    body: string;
    format?: 'org.matrix.custom.html';
    formatted_body?: string;
    msgtype: 'm.text';
}
export interface M_EMOTE extends M_ROOM_MESSAGE {
    body: string;
    format?: 'org.matrix.custom.html';
    formatted_body?: string;
    msgtype: 'm.emote';
}
export interface M_NOTICE extends M_ROOM_MESSAGE {
    body: string;
    format?: 'org.matrix.custom.html';
    formatted_body?: string;
    msgtype: 'm.notice';
}
export interface M_IMAGE extends M_ROOM_MESSAGE {
    body: string;
    file?: any;
    info?: ImageInfo;
    msgtype: 'm.image';
    url?: string;
}
export interface M_FILE extends M_ROOM_MESSAGE {
    body: string;
    file?: any;
    filename?: string;
    info?: FileInfo;
    msgtype: 'm.file';
    url?: string;
}
export interface M_AUDIO extends M_ROOM_MESSAGE {
    body: string;
    file?: any;
    filename?: string;
    info?: AudioInfo;
    msgtype: 'm.audio';
    url?: string;
}
export interface M_LOCATION extends M_ROOM_MESSAGE {
    body: string;
    geo_uri: string;
    info?: LocationInfo;
    msgtype: 'm.location';
}
export interface M_VIDEO extends M_ROOM_MESSAGE {
    body: string;
    file?: any;
    info?: VideoInfo;
    msgtype: 'm.video';
    url?: string;
}
export interface M_TYPING extends EventContent {
    user_ids: string[];
}
export interface M_RECEIPT extends EventContent {
}
export interface M_FULLY_READ extends EventContent {
    event_id: string;
}
export interface M_PRESENCE extends EventContent {
    avatar_url?: string;
    currently_actice?: boolean;
    displayname?: string;
    last_active_ago?: number;
    presence?: 'online' | 'offline' | 'unavailable';
    status_msg?: string;
}
export interface M_ROOM_HISTORY_VISIBILITY extends EventContent {
    history_visibility: 'invited' | 'joined' | 'shared' | 'world_readable';
}
export interface M_ROOM_THIRD_PATRY_INVITE extends EventContent {
    display_name: string;
    key_validity_url: string;
    public_key: string;
    public_keys: PublicKeys[];
}
export interface M_ROOM_GUEST_ACCESS extends EventContent {
    guest_access: 'can_join' | 'forbidden';
}
export interface M_IGNORED_USER_LIST extends EventContent {
    ignored_users: Record<string, any>;
}
export interface M_STICKER extends EventContent {
    body: string;
    info: ImageInfo;
    url: string;
}
export interface M_ROOM_SERVER_ACL extends EventContent {
    allow?: string[];
    allow_ip_literals?: boolean;
    deny?: string[];
}
export interface M_ROOM_TOMBSTONE extends EventContent {
    body: string;
    replacement_room: string;
}
export interface M_POLICY_RULE_USER extends EventContent {
    entity: string;
    reason: string;
    recommendation: string;
}
export interface M_POLICY_RULE_ROOM extends EventContent {
    entity: string;
    reason: string;
    recommendation: string;
}
export interface M_POLICY_RULE_SERVER extends EventContent {
    entity: string;
    reason: string;
    recommendation: string;
}
export interface M_SPACE_CHILD extends EventContent {
    order?: string;
    suggested?: boolean;
    via?: string[];
}
export interface M_SPACE_PARENT extends EventContent {
    canonical?: boolean;
    via?: string[];
}
export interface M_ANNOTATION extends Relation {
    rel_type: 'm.annotation';
    key: string;
}
export interface M_REACTION extends EventContent {
    'm.relates_to'?: M_ANNOTATION;
}
export declare class Internal {
    bot: MatrixBot;
    private txnId;
    constructor(bot: MatrixBot);
    uploadFile(filename: string, buffer: Buffer, mimetype?: string): Promise<string>;
    sendTextMessage(roomId: string, content: string, reply?: string): Promise<string>;
    sendMediaMessage(roomId: string, type: 'file' | 'image' | 'video' | 'audio', buffer: Buffer, reply?: string, mimetype?: string, filename?: string): Promise<string>;
    sendReaction(roomId: string, messageId: string, key: string): Promise<string>;
    getEvent(roomId: string, eventId: string): Promise<ClientEvent>;
    redactEvent(roomId: string, eventId: string, reason?: string): Promise<string>;
    getProfile(userId: string): Promise<Profile>;
    setDisplayName(userId: string, displayname: string): Promise<void>;
    setAvatar(userId: string, buffer: Buffer, mimetype: string): Promise<void>;
    createRoom(creation: RoomCreation): Promise<string>;
    joinRoom(roomId: string, reason?: string): Promise<string>;
    leaveRoom(roomId: string, reason?: string): Promise<string>;
    invite(roomId: string, userId: string, reason?: string): Promise<void>;
    sync(fullSstate?: boolean): Promise<Sync>;
    getState(roomId: string): Promise<ClientEvent[]>;
    setState(roomId: string, eventType: string, event: EventContent, state?: string): Promise<string>;
    getJoinedRooms(): Promise<string[]>;
    register(username: string, asToken: string): Promise<User>;
    login(username: string, asToken: string): Promise<User>;
    getAssetUrl(mxc: string): string;
}
