import { Definitions } from './definition';
export declare namespace Chat {
    namespace Params {
        interface Delete {
            ts?: number;
            channel?: string;
            as_user?: boolean;
        }
        interface DeleteScheduledMessage {
            as_user?: boolean;
            channel: string;
            scheduled_message_id: string;
        }
        interface GetPermalink {
            channel: string;
            message_ts: string;
        }
        interface MeMessage {
            channel?: string;
            text?: string;
        }
        interface PostEphemeral {
            as_user?: boolean;
            attachments?: string;
            blocks?: string;
            channel: string;
            icon_emoji?: string;
            icon_url?: string;
            link_names?: boolean;
            parse?: string;
            text?: string;
            thread_ts?: string;
            user: string;
            username?: string;
        }
        interface PostMessage {
            as_user?: string;
            attachments?: string;
            blocks?: string;
            channel: string;
            icon_emoji?: string;
            icon_url?: string;
            link_names?: boolean;
            mrkdwn?: boolean;
            parse?: string;
            reply_broadcast?: boolean;
            text?: string;
            thread_ts?: string;
            unfurl_links?: boolean;
            unfurl_media?: boolean;
            username?: string;
        }
        interface ScheduleMessage {
            channel?: string;
            text?: string;
            post_at?: string;
            parse?: string;
            as_user?: boolean;
            link_names?: boolean;
            attachments?: string;
            blocks?: string;
            unfurl_links?: boolean;
            unfurl_media?: boolean;
            thread_ts?: number;
            reply_broadcast?: boolean;
        }
        interface ScheduledMessagesList {
            channel?: string;
            latest?: number;
            oldest?: number;
            limit?: number;
            cursor?: string;
        }
        interface Unfurl {
            channel: string;
            ts: string;
            unfurls?: string;
            user_auth_message?: string;
            user_auth_required?: boolean;
            user_auth_url?: string;
        }
        interface Update {
            as_user?: string;
            attachments?: string;
            blocks?: string;
            channel: string;
            link_names?: string;
            parse?: string;
            text?: string;
            ts: string;
        }
    }
}
declare module './internal' {
    interface Internal {
        /**
         * Deletes a message.
         * @see https://api.slack.com/methods/chat.delete
         */
        chatDelete(token: TokenInput, params: Chat.Params.Delete): Promise<{
            channel: string;
            ok: boolean;
            ts: string;
        }>;
        /**
         * Deletes a pending scheduled message from the queue.
         * @see https://api.slack.com/methods/chat.deleteScheduledMessage
         */
        chatDeleteScheduledMessage(token: TokenInput, params: Chat.Params.DeleteScheduledMessage): Promise<{
            ok: boolean;
        }>;
        /**
         * Retrieve a permalink URL for a specific extant message
         * @see https://api.slack.com/methods/chat.getPermalink
         */
        chatGetPermalink(token: TokenInput, params: Chat.Params.GetPermalink): Promise<{
            channel: string;
            ok: boolean;
            permalink: string;
        }>;
        /**
         * Share a me message into a channel.
         * @see https://api.slack.com/methods/chat.meMessage
         */
        chatMeMessage(token: TokenInput, params: Chat.Params.MeMessage): Promise<{
            channel?: string;
            ok: boolean;
            ts?: string;
        }>;
        /**
         * Sends an ephemeral message to a user in a channel.
         * @see https://api.slack.com/methods/chat.postEphemeral
         */
        chatPostEphemeral(token: TokenInput, params: Chat.Params.PostEphemeral): Promise<{
            message_ts: string;
            ok: boolean;
        }>;
        /**
         * Sends a message to a channel.
         * @see https://api.slack.com/methods/chat.postMessage
         */
        chatPostMessage(token: TokenInput, params: Chat.Params.PostMessage): Promise<{
            channel: string;
            message: Definitions.Message;
            ok: boolean;
            ts: string;
        }>;
        /**
         * Schedules a message to be sent to a channel.
         * @see https://api.slack.com/methods/chat.scheduleMessage
         */
        chatScheduleMessage(token: TokenInput, params: Chat.Params.ScheduleMessage): Promise<{
            channel: string;
            message: {
                bot_id: string;
                bot_profile: Definitions.BotProfile;
                team: string;
                text: string;
                type: string;
                user: string;
                username: string;
            };
            ok: boolean;
            post_at: number;
            scheduled_message_id: string;
        }>;
        /**
         * Returns a list of scheduled messages.
         * @see https://api.slack.com/methods/chat.scheduledMessages.list
         */
        chatScheduledMessagesList(token: TokenInput, params: Chat.Params.ScheduledMessagesList): Promise<{
            ok: boolean;
            response_metadata: {
                next_cursor: string;
            };
            scheduled_messages: {
                channel_id: string;
                date_created: number;
                id: string;
                post_at: number;
                text: string;
            }[];
        }>;
        /**
         * Provide custom unfurl behavior for user-posted URLs
         * @see https://api.slack.com/methods/chat.unfurl
         */
        chatUnfurl(token: TokenInput, params: Chat.Params.Unfurl): Promise<{
            ok: boolean;
        }>;
        /**
         * Updates a message.
         * @see https://api.slack.com/methods/chat.update
         */
        chatUpdate(token: TokenInput, params: Chat.Params.Update): Promise<{
            channel: string;
            message: {
                attachments: {}[];
                blocks: {};
                text: string;
            };
            ok: boolean;
            text: string;
            ts: string;
        }>;
    }
}
