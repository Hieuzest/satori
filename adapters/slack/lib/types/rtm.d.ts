export declare namespace Rtm {
    namespace Params {
        interface Connect {
            batch_presence_aware?: boolean;
            presence_sub?: boolean;
        }
    }
}
declare module './internal' {
    interface Internal {
        /**
         * Starts a Real Time Messaging session.
         * @see https://api.slack.com/methods/rtm.connect
         */
        rtmConnect(token: TokenInput, params: Rtm.Params.Connect): Promise<{
            ok: boolean;
            self: {
                id: string;
                name: string;
            };
            team: {
                domain: string;
                id: string;
                name: string;
            };
            url: string;
        }>;
    }
}
