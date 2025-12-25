import { Definitions } from './definition';
export declare namespace Team {
    namespace Params {
        interface AccessLogs {
            before?: string;
            count?: string;
            page?: string;
        }
        interface BillableInfo {
            user?: string;
        }
        interface Info {
            team?: string;
        }
        interface IntegrationLogs {
            app_id?: string;
            change_type?: string;
            count?: string;
            page?: string;
            service_id?: string;
            user?: string;
        }
        interface ProfileGet {
            visibility?: string;
        }
    }
}
declare module './internal' {
    interface Internal {
        /**
         * Gets the access logs for the current team.
         * @see https://api.slack.com/methods/team.accessLogs
         */
        teamAccessLogs(token: TokenInput, params: Team.Params.AccessLogs): Promise<{
            logins: {
                count: number;
                country: unknown;
                date_first: number;
                date_last: number;
                ip: unknown;
                isp: unknown;
                region: unknown;
                user_agent: string;
                user_id: string;
                username: string;
            }[];
            ok: boolean;
            paging: Definitions.Paging;
        }>;
        /**
         * Gets billable users information for the current team.
         * @see https://api.slack.com/methods/team.billableInfo
         */
        teamBillableInfo(token: TokenInput, params: Team.Params.BillableInfo): Promise<{
            ok: boolean;
        }>;
        /**
         * Gets information about the current team.
         * @see https://api.slack.com/methods/team.info
         */
        teamInfo(token: TokenInput, params: Team.Params.Info): Promise<{
            ok: boolean;
            team: Definitions.Team;
        }>;
        /**
         * Gets the integration logs for the current team.
         * @see https://api.slack.com/methods/team.integrationLogs
         */
        teamIntegrationLogs(token: TokenInput, params: Team.Params.IntegrationLogs): Promise<{
            logs: {
                admin_app_id: string;
                app_id: string;
                app_type: string;
                change_type: string;
                channel: string;
                date: string;
                scope: string;
                service_id: string;
                service_type: string;
                user_id: string;
                user_name: string;
            }[];
            ok: boolean;
            paging: Definitions.Paging;
        }>;
        /**
         * Retrieve a team's profile.
         * @see https://api.slack.com/methods/team.profile.get
         */
        teamProfileGet(token: TokenInput, params: Team.Params.ProfileGet): Promise<{
            ok: boolean;
            profile: {
                fields: Definitions.TeamProfileField[];
            };
        }>;
    }
}
