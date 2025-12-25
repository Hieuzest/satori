import { Definitions } from './definition';
export declare namespace Reactions {
    namespace Params {
        interface Add {
            channel: string;
            name: string;
            timestamp: string;
        }
        interface Get {
            channel?: string;
            file?: string;
            file_comment?: string;
            full?: boolean;
            timestamp?: string;
        }
        interface List {
            user?: string;
            full?: boolean;
            count?: number;
            page?: number;
            cursor?: string;
            limit?: number;
        }
        interface Remove {
            name: string;
            file?: string;
            file_comment?: string;
            channel?: string;
            timestamp?: string;
        }
    }
}
declare module './internal' {
    interface Internal {
        /**
         * Adds a reaction to an item.
         * @see https://api.slack.com/methods/reactions.add
         */
        reactionsAdd(token: TokenInput, params: Reactions.Params.Add): Promise<{
            ok: boolean;
        }>;
        /**
         * Gets reactions for an item.
         * @see https://api.slack.com/methods/reactions.get
         */
        reactionsGet(token: TokenInput, params: Reactions.Params.Get): Promise<{
            channel: string;
            message: Definitions.Message;
            ok: boolean;
            type: string;
        }>;
        /**
         * Lists reactions made by a user.
         * @see https://api.slack.com/methods/reactions.list
         */
        reactionsList(token: TokenInput, params: Reactions.Params.List): Promise<{
            items: {
                channel: string;
                message: Definitions.Message;
                type: string;
            }[];
            ok: boolean;
            paging?: Definitions.Paging;
            response_metadata?: Definitions.ResponseMetadata;
        }>;
        /**
         * Removes a reaction from an item.
         * @see https://api.slack.com/methods/reactions.remove
         */
        reactionsRemove(token: TokenInput, params: Reactions.Params.Remove): Promise<{
            ok: boolean;
        }>;
    }
}
