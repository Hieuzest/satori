import * as Lark from '.';
declare module '../internal' {
    interface Internal {
        translation: Translation.Methods;
    }
}
export declare namespace Translation {
    interface Methods {
        text: Text.Methods;
    }
    namespace Text {
        interface Methods {
            /**
             * 识别文本语种
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/ai/translation-v1/text/detect
             */
            detect(body: DetectRequest): Promise<DetectResponse>;
            /**
             * 翻译文本
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/ai/translation-v1/text/translate
             */
            translate(body: TranslateRequest): Promise<TranslateResponse>;
        }
        interface DetectRequest {
            /** 需要被识别语种的文本 */
            text: string;
        }
        interface DetectResponse {
            /** 识别的文本语种，返回符合  ISO 693-1 标准 */
            language: string;
        }
        interface TranslateRequest {
            /** 源语言 */
            source_language: string;
            /** 源文本 */
            text: string;
            /** 目标语言 */
            target_language: string;
            /** 请求级术语表，携带术语，仅在本次翻译中生效（最多能携带 128个术语词） */
            glossary?: Lark.Term[];
        }
        interface TranslateResponse {
            /** 翻译后的文本 */
            text: string;
        }
    }
}
