export declare namespace Calls {
    namespace Params {
        interface Add {
            external_unique_id: string;
            external_display_id?: string;
            join_url: string;
            desktop_app_join_url?: string;
            date_start?: number;
            title?: string;
            created_by?: string;
            users?: string;
        }
        interface End {
            id: string;
            duration?: number;
        }
        interface Info {
            id: string;
        }
        interface ParticipantsAdd {
            id: string;
            users: string;
        }
        interface ParticipantsRemove {
            id: string;
            users: string;
        }
        interface Update {
            id: string;
            title?: string;
            join_url?: string;
            desktop_app_join_url?: string;
        }
    }
}
declare module './internal' {
    interface Internal {
        /**
         * Registers a new Call.
         * @see https://api.slack.com/methods/calls.add
         */
        callsAdd(token: TokenInput, params: Calls.Params.Add): Promise<{
            ok: boolean;
        }>;
        /**
         * Ends a Call.
         * @see https://api.slack.com/methods/calls.end
         */
        callsEnd(token: TokenInput, params: Calls.Params.End): Promise<{
            ok: boolean;
        }>;
        /**
         * Returns information about a Call.
         * @see https://api.slack.com/methods/calls.info
         */
        callsInfo(token: TokenInput, params: Calls.Params.Info): Promise<{
            ok: boolean;
        }>;
        /**
         * Registers new participants added to a Call.
         * @see https://api.slack.com/methods/calls.participants.add
         */
        callsParticipantsAdd(token: TokenInput, params: Calls.Params.ParticipantsAdd): Promise<{
            ok: boolean;
        }>;
        /**
         * Registers participants removed from a Call.
         * @see https://api.slack.com/methods/calls.participants.remove
         */
        callsParticipantsRemove(token: TokenInput, params: Calls.Params.ParticipantsRemove): Promise<{
            ok: boolean;
        }>;
        /**
         * Updates information about a Call.
         * @see https://api.slack.com/methods/calls.update
         */
        callsUpdate(token: TokenInput, params: Calls.Params.Update): Promise<{
            ok: boolean;
        }>;
    }
}
