export declare namespace Pins {
    namespace Params {
        interface Add {
            channel: string;
            timestamp?: string;
        }
        interface List {
            channel: string;
        }
        interface Remove {
            channel: string;
            timestamp?: string;
        }
    }
}
declare module './internal' {
    interface Internal {
        /**
         * Pins an item to a channel.
         * @see https://api.slack.com/methods/pins.add
         */
        pinsAdd(token: TokenInput, params: Pins.Params.Add): Promise<{
            ok: boolean;
        }>;
        /**
         * Lists items pinned to a channel.
         * @see https://api.slack.com/methods/pins.list
         */
        pinsList(token: TokenInput, params: Pins.Params.List): Promise<unknown>;
        /**
         * Un-pins an item from a channel.
         * @see https://api.slack.com/methods/pins.remove
         */
        pinsRemove(token: TokenInput, params: Pins.Params.Remove): Promise<{
            ok: boolean;
        }>;
    }
}
