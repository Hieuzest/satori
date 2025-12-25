export declare namespace Auth {
    namespace Params {
        interface Revoke {
            test?: boolean;
        }
        interface Test {
        }
    }
}
declare module './internal' {
    interface Internal {
        /**
         * Revokes a token.
         * @see https://api.slack.com/methods/auth.revoke
         */
        authRevoke(token: TokenInput, params: Auth.Params.Revoke): Promise<{
            ok: boolean;
            revoked: boolean;
        }>;
        /**
         * Checks authentication & identity.
         * @see https://api.slack.com/methods/auth.test
         */
        authTest(token: TokenInput): Promise<{
            bot_id?: string;
            is_enterprise_install?: boolean;
            ok: boolean;
            team: string;
            team_id: string;
            url: string;
            user: string;
            user_id: string;
        }>;
    }
}
