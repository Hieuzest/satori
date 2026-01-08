import * as Lark from '.';
declare module '../internal' {
    interface Internal {
        verification: Verification.Methods;
    }
}
export declare namespace Verification {
    interface Methods {
        /**
         * 获取认证信息
         * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/verification-v1/verification/get
         */
        get(): Promise<GetResponse>;
    }
    interface GetResponse {
        /** 认证信息 */
        verification?: Lark.Verification;
    }
}
