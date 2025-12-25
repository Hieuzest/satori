import { Definitions } from './definition';
export declare namespace Reminders {
    namespace Params {
        interface Add {
            text: string;
            time: string;
            user?: string;
        }
        interface Complete {
            reminder?: string;
        }
        interface Delete {
            reminder?: string;
        }
        interface Info {
            reminder?: string;
        }
        interface List {
        }
    }
}
declare module './internal' {
    interface Internal {
        /**
         * Creates a reminder.
         * @see https://api.slack.com/methods/reminders.add
         */
        remindersAdd(token: TokenInput, params: Reminders.Params.Add): Promise<{
            ok: boolean;
            reminder: Definitions.Reminder;
        }>;
        /**
         * Marks a reminder as complete.
         * @see https://api.slack.com/methods/reminders.complete
         */
        remindersComplete(token: TokenInput, params: Reminders.Params.Complete): Promise<{
            ok: boolean;
        }>;
        /**
         * Deletes a reminder.
         * @see https://api.slack.com/methods/reminders.delete
         */
        remindersDelete(token: TokenInput, params: Reminders.Params.Delete): Promise<{
            ok: boolean;
        }>;
        /**
         * Gets information about a reminder.
         * @see https://api.slack.com/methods/reminders.info
         */
        remindersInfo(token: TokenInput, params: Reminders.Params.Info): Promise<{
            ok: boolean;
            reminder: Definitions.Reminder;
        }>;
        /**
         * Lists all reminders created by or for a given user.
         * @see https://api.slack.com/methods/reminders.list
         */
        remindersList(token: TokenInput): Promise<{
            ok: boolean;
            reminders: Definitions.Reminder[];
        }>;
    }
}
