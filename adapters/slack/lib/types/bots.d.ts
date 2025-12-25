export declare namespace Bots {
    namespace Params {
        interface Info {
            bot?: string;
        }
    }
}
declare module './internal' {
    interface Internal {
        /**
         * Gets information about a bot user.
         * @see https://api.slack.com/methods/bots.info
         */
        botsInfo(token: TokenInput, params: Bots.Params.Info): Promise<{
            bot: {
                app_id: string;
                deleted: boolean;
                icons: {
                    image_36: string;
                    image_48: string;
                    image_72: string;
                };
                id: string;
                name: string;
                updated: number;
                user_id: string;
            };
            ok: boolean;
        }>;
    }
}
