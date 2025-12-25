export declare namespace Dialog {
    namespace Params {
        interface Open {
            dialog: string;
            trigger_id: string;
        }
    }
}
declare module './internal' {
    interface Internal {
        /**
         * Open a dialog with a user
         * @see https://api.slack.com/methods/dialog.open
         */
        dialogOpen(token: TokenInput, params: Dialog.Params.Open): Promise<{
            ok: boolean;
        }>;
    }
}
