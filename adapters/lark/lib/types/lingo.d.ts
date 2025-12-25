import * as Lark from '.';
import { Paginated, Pagination } from '../internal';
declare module '../internal' {
    interface Internal {
        lingo: Lingo.Methods;
    }
}
export declare namespace Lingo {
    interface Methods {
        draft: Draft.Methods;
        entity: Entity.Methods;
        classification: Classification.Methods;
        repo: Repo.Methods;
        file: File.Methods;
    }
    namespace Draft {
        interface Methods {
            /**
             * 创建草稿
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/lingo-v1/draft/create
             */
            create(body: CreateRequest, query?: CreateQuery): Promise<CreateResponse>;
            /**
             * 更新草稿
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/lingo-v1/draft/update
             */
            update(draft_id: string, body: UpdateRequest, query?: UpdateQuery): Promise<UpdateResponse>;
        }
        interface CreateRequest {
            /** 实体词 Id */
            id?: string;
            /** 词条名 */
            main_keys: Lark.Term[];
            /** 别名 */
            aliases?: Lark.Term[];
            /** 详情描述 */
            description?: string;
            /** 相关数据 */
            related_meta?: Lark.RelatedMeta;
            /** 外部 id 关联数据 */
            outer_info?: Lark.OuterInfo;
            /** 富文本格式（当填写富文本内容时，description字段将会失效可不填写），支持的格式参考[企业百科指南](https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/baike-v1/overview)中的释义部分 */
            rich_text?: string;
            /** 国际化的词条释义 */
            i18n_descs?: Lark.I18nEntryDesc[];
        }
        interface CreateQuery {
            /** 词库ID */
            repo_id?: string;
            /** 此次调用中使用的用户ID的类型 */
            user_id_type?: 'user_id' | 'union_id' | 'open_id';
        }
        interface CreateResponse {
            draft?: Lark.Draft;
        }
        interface UpdateRequest {
            /** 实体词 Id */
            id?: string;
            /** 词条名 */
            main_keys: Lark.Term[];
            /** 别名 */
            aliases?: Lark.Term[];
            /** 详情描述 */
            description?: string;
            /** 相关数据 */
            related_meta?: Lark.RelatedMeta;
            /** 富文本格式（当填写富文本内容时，description字段将会失效可不填写），支持的格式参考[企业百科指南](https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/baike-v1/overview)中的释义部分 */
            rich_text?: string;
            /** 国际化的词条释义 */
            i18n_descs?: Lark.I18nEntryDesc[];
        }
        interface UpdateQuery {
            /** 此次调用中使用的用户ID的类型 */
            user_id_type?: 'user_id' | 'union_id' | 'open_id';
        }
        interface UpdateResponse {
            draft?: Lark.Draft;
        }
    }
    namespace Entity {
        interface Methods {
            /**
             * 创建免审词条
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/lingo-v1/entity/create
             */
            create(body: CreateRequest, query?: CreateQuery): Promise<CreateResponse>;
            /**
             * 更新免审词条
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/lingo-v1/entity/update
             */
            update(entity_id: string, body: UpdateRequest, query?: UpdateQuery): Promise<UpdateResponse>;
            /**
             * 删除免审词条
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/lingo-v1/entity/delete
             */
            delete(entity_id: string, query?: DeleteQuery): Promise<void>;
            /**
             * 获取词条详情
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/lingo-v1/entity/get
             */
            get(entity_id: string, query?: GetQuery): Promise<GetResponse>;
            /**
             * 获取词条列表
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/lingo-v1/entity/list
             */
            list(query?: ListQuery): Paginated<Lark.Entity, 'entities'>;
            /**
             * 精准搜索词条
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/lingo-v1/entity/match
             */
            match(body: MatchRequest, query?: MatchQuery): Promise<MatchResponse>;
            /**
             * 模糊搜索词条
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/lingo-v1/entity/search
             */
            search(body: SearchRequest, query?: SearchQuery): Paginated<Lark.Entity, 'entities'>;
            /**
             * 词条高亮
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/lingo-v1/entity/highlight
             */
            highlight(body: HighlightRequest): Promise<HighlightResponse>;
        }
        interface CreateRequest {
            /** 词条名 */
            main_keys: Lark.Term[];
            /** 别名 */
            aliases?: Lark.Term[];
            /** 详情描述 */
            description?: string;
            /** 相关数据 */
            related_meta?: Lark.RelatedMeta;
            /** 外部 id 关联数据 */
            outer_info?: Lark.OuterInfo;
            /** 富文本格式（当填写富文本内容时，description字段将会失效可不填写），支持的格式参考[企业百科指南](https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/baike-v1/overview)中的释义部分 */
            rich_text?: string;
            /** 国际化的词条释义 */
            i18n_descs?: Lark.I18nEntryDesc[];
        }
        interface CreateQuery {
            /** 词库 ID */
            repo_id?: string;
            /** 此次调用中使用的用户ID的类型 */
            user_id_type?: 'user_id' | 'union_id' | 'open_id';
        }
        interface CreateResponse {
            entity?: Lark.Entity;
        }
        interface UpdateRequest {
            /** 词条名 */
            main_keys: Lark.Term[];
            /** 别名 */
            aliases?: Lark.Term[];
            /** 详情描述 */
            description?: string;
            /** 相关数据 */
            related_meta?: Lark.RelatedMeta;
            /** 外部 id 关联数据 */
            outer_info?: Lark.OuterInfo;
            /** 富文本格式（当填写富文本内容时，description字段将会失效可不填写），支持的格式参考[企业百科指南](https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/baike-v1/overview)中的释义部分 */
            rich_text?: string;
            /** 国际化的词条释义 */
            i18n_descs?: Lark.I18nEntryDesc[];
        }
        interface UpdateQuery {
            /** 此次调用中使用的用户ID的类型 */
            user_id_type?: 'user_id' | 'union_id' | 'open_id';
        }
        interface UpdateResponse {
            entity?: Lark.Entity;
        }
        interface DeleteQuery {
            /** 数据提供方（使用时需要将路径中的词条 ID 固定为：enterprise_0，且提供 provider 和 outer_id） */
            provider?: string;
            /** 外部唯一 id（使用时需要将路径中的词条 ID 固定为：enterprise_0，且提供 provider 和 outer_id） */
            outer_id?: string;
        }
        interface GetQuery {
            /** 数据提供方（使用时需要将路径中的实体词 ID 固定为：enterprise_0，且提供 provider 和 outer_id） */
            provider?: string;
            /** 外部唯一 id（使用时需要将路径中的实体词 ID 固定为：enterprise_0，且提供 provider 和 outer_id） */
            outer_id?: string;
            /** 此次调用中使用的用户ID的类型 */
            user_id_type?: 'user_id' | 'union_id' | 'open_id';
        }
        interface GetResponse {
            /** 实体词 */
            entity?: Lark.Entity;
        }
        interface ListQuery extends Pagination {
            /** 数据提供方【可用来过滤数据】 */
            provider?: string;
            /** 词库 id */
            repo_id?: string;
            /** 此次调用中使用的用户ID的类型 */
            user_id_type?: 'user_id' | 'union_id' | 'open_id';
        }
        interface MatchRequest {
            /** 实体词主关键词、全称、别名全匹配 */
            word: string;
        }
        interface MatchQuery {
            /** 词库ID */
            repo_id?: string;
        }
        interface MatchResponse {
            /** 匹配结果 */
            results?: Lark.MatchInfo[];
        }
        interface SearchRequest {
            /** 搜索关键词 */
            query?: string;
            /** 分类筛选 */
            classification_filter?: Lark.ClassificationFilter;
            /** 词条的创建来源，1：用户主动创建，2：批量导入，3：官方词，4：OpenAPI 创建 */
            sources?: number[];
            /** 创建者 */
            creators?: string[];
        }
        interface SearchQuery extends Pagination {
            /** 词库ID */
            repo_id?: string;
            /** 此次调用中使用的用户ID的类型 */
            user_id_type?: 'user_id' | 'union_id' | 'open_id';
        }
        interface HighlightRequest {
            /** 需要被识别实体词内容的一句话（不要超过1000字） */
            text: string;
        }
        interface HighlightResponse {
            /** 返回识别到的实体词信息 */
            phrases?: Lark.Phrase[];
        }
    }
    namespace Classification {
        interface Methods {
            /**
             * 获取词典分类
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/lingo-v1/classification/list
             */
            list(query?: ListQuery): Paginated<Lark.Classification>;
        }
        interface ListQuery extends Pagination {
            /** 词库ID */
            repo_id?: string;
        }
    }
    namespace Repo {
        interface Methods {
            /**
             * 获取词库列表
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/lingo-v1/repo/list
             */
            list(): Promise<ListResponse>;
        }
        interface ListResponse {
            /** 词库列表 */
            items?: Lark.Repo[];
        }
    }
    namespace File {
        interface Methods {
            /**
             * 上传图片
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/lingo-v1/file/upload
             */
            upload(form: UploadForm): Promise<UploadResponse>;
            /**
             * 下载图片
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/lingo-v1/file/download
             */
            download(file_token: string): Promise<ArrayBuffer>;
        }
        interface UploadForm {
            /** 文件名称，当前仅支持上传图片且图片格式为以下六种：icon、bmp、gif、png、jpeg、webp */
            name: string;
            /** 二进制文件内容，高宽像素在 320-4096 像素之间，大小在 3KB-10MB 的图片 */
            file: Blob;
        }
        interface UploadResponse {
            /** 文件 token */
            file_token?: string;
        }
    }
}
