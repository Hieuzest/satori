declare module '../internal' {
    interface Internal {
        docs: Docs.Methods;
    }
}
export declare namespace Docs {
    interface Methods {
        content: Content.Methods;
    }
    namespace Content {
        interface Methods {
            /**
             * 获取云文档内容
             * @see https://open.feishu.cn/document/ukTMukTMukTM/uUDN04SN0QjL1QDN/docs-v1/content/get
             */
            get(query?: GetQuery): Promise<GetResponse>;
        }
        interface GetQuery {
            /** 文档唯一标识 */
            doc_token: string;
            /** 文档类型 */
            doc_type: 'docx';
            /** 内容类型 */
            content_type: 'markdown';
            /** 语言 */
            lang?: 'zh' | 'en' | 'ja';
        }
        interface GetResponse {
            /** 内容 */
            content?: string;
        }
    }
}
