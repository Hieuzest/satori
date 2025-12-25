import * as Lark from '.';
declare module '../internal' {
    interface Internal {
        speechToText: SpeechToText.Methods;
    }
}
export declare namespace SpeechToText {
    interface Methods {
        speech: Speech.Methods;
    }
    namespace Speech {
        interface Methods {
            /**
             * 识别语音文件
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/ai/speech_to_text-v1/speech/file_recognize
             */
            fileRecognize(body: FileRecognizeRequest): Promise<FileRecognizeResponse>;
            /**
             * 识别流式语音
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/ai/speech_to_text-v1/speech/stream_recognize
             */
            streamRecognize(body: StreamRecognizeRequest): Promise<StreamRecognizeResponse>;
        }
        interface FileRecognizeRequest {
            /** 语音资源 */
            speech: Lark.Speech;
            /** 配置属性 */
            config: Lark.FileConfig;
        }
        interface FileRecognizeResponse {
            /** 语音识别后的文本信息 */
            recognition_text: string;
        }
        interface StreamRecognizeRequest {
            /** 语音资源 */
            speech: Lark.Speech;
            /** 配置属性 */
            config: Lark.StreamConfig;
        }
        interface StreamRecognizeResponse {
            /** 16 位 String 随机串作为同一数据流的标识 */
            stream_id: string;
            /** 数据流分片的序号，序号从 0 开始，每次请求递增 1 */
            sequence_id: number;
            /** 语音流识别后的文本信息 */
            recognition_text: string;
        }
    }
}
