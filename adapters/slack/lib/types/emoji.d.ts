export declare namespace Emoji {
    namespace Params {
        interface List {
        }
    }
}
declare module './internal' {
    interface Internal {
        /**
         * Lists custom emoji for a team.
         * @see https://api.slack.com/methods/emoji.list
         */
        emojiList(token: TokenInput): Promise<{
            ok: boolean;
        }>;
    }
}
