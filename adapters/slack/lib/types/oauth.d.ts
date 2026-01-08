export declare namespace Oauth {
    namespace Params {
        interface Access {
            client_id?: string;
            client_secret?: string;
            code?: string;
            redirect_uri?: string;
            single_channel?: boolean;
        }
        interface Token {
            client_id?: string;
            client_secret?: string;
            code?: string;
            redirect_uri?: string;
            single_channel?: boolean;
        }
        interface V2Access {
            client_id?: string;
            client_secret?: string;
            code: string;
            redirect_uri?: string;
        }
    }
}
declare module './internal' {
    interface Internal {
        /**
         * Exchanges a temporary OAuth verifier code for an access token.
         * @see https://api.slack.com/methods/oauth.access
         */
        oauthAccess(token: TokenInput, params: Oauth.Params.Access): Promise<{
            ok: boolean;
        }>;
        /**
         * Exchanges a temporary OAuth verifier code for a workspace token.
         * @see https://api.slack.com/methods/oauth.token
         */
        oauthToken(token: TokenInput, params: Oauth.Params.Token): Promise<{
            ok: boolean;
        }>;
        /**
         * Exchanges a temporary OAuth verifier code for an access token.
         * @see https://api.slack.com/methods/oauth.v2.access
         */
        oauthV2Access(token: TokenInput, params: Oauth.Params.V2Access): Promise<{
            ok: boolean;
        }>;
    }
}
