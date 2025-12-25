export interface UpgradeDeviceResponse {
    requestId?: string;
}
declare module '../internal' {
    interface Internal {
        /**
         * 升级设备
         * @see https://open.dingtalk.com/document/app/upgrade-equipment
         */
        upgradeDevice(): Promise<UpgradeDeviceResponse>;
    }
}
