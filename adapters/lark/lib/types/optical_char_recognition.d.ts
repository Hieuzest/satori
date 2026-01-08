declare module '../internal' {
    interface Internal {
        opticalCharRecognition: OpticalCharRecognition.Methods;
    }
}
export declare namespace OpticalCharRecognition {
    interface Methods {
        image: Image.Methods;
    }
    namespace Image {
        interface Methods {
            /**
             * 识别图片中的文字
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/ai/optical_char_recognition-v1/image/basic_recognize
             */
            basicRecognize(body: BasicRecognizeRequest): Promise<BasicRecognizeResponse>;
        }
        interface BasicRecognizeRequest {
            /** base64 后的图片数据 */
            image?: string;
        }
        interface BasicRecognizeResponse {
            /** 按区域识别，返回文本列表 */
            text_list: string[];
        }
    }
}
