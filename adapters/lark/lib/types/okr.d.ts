import * as Lark from '.';
import { Paginated, Pagination } from '../internal';
declare module '../internal' {
    interface Internal {
        okr: Okr.Methods;
    }
}
export declare namespace Okr {
    interface Methods {
        period: Period.Methods;
        periodRule: PeriodRule.Methods;
        user: User.Methods;
        progressRecord: ProgressRecord.Methods;
        image: Image.Methods;
        review: Review.Methods;
        /**
         * 批量获取 OKR
         * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/okr-v1/okr/batch_get
         */
        batchGet(query?: BatchGetQuery): Promise<BatchGetResponse>;
    }
    interface BatchGetQuery {
        /** 此次调用中使用的用户ID的类型 */
        user_id_type?: 'user_id' | 'union_id' | 'open_id' | 'people_admin_id';
        /** OKR ID 列表，最多10个 */
        okr_ids: string[];
        /** 请求OKR的语言版本（比如@的人名），lang=en_us/zh_cn，请求 Query中 */
        lang?: string;
    }
    interface BatchGetResponse {
        /** OKR 列表 */
        okr_list?: Lark.OkrBatch[];
    }
    namespace Period {
        interface Methods {
            /**
             * 创建 OKR 周期
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/okr-v1/period/create
             */
            create(body: CreateRequest): Promise<CreateResponse>;
            /**
             * 修改 OKR 周期状态
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/okr-v1/period/patch
             */
            patch(period_id: string, body: PatchRequest): Promise<PatchResponse>;
            /**
             * 获取 OKR 周期列表
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/okr-v1/period/list
             */
            list(query?: Pagination): Paginated<Lark.Period>;
        }
        interface CreateRequest {
            /** 周期规则 id */
            period_rule_id: string;
            /** 周期起始年月 */
            start_month: string;
        }
        interface CreateResponse {
            /** 周期id */
            period_id?: string;
            /** 周期起始年月 */
            start_month?: string;
            /** 周期结束年月 */
            end_month?: string;
        }
        const enum PatchRequestStatus {
            /** 正常状态 */
            NormalStatus = 1,
            /** 标记失效 */
            MarkInvalid = 2,
            /** 隐藏周期 */
            HiddenPeriod = 3
        }
        interface PatchRequest {
            /** 周期显示状态 */
            status: PatchRequestStatus;
        }
        const enum PatchResponseStatus {
            /** 正常状态 */
            NormalStatus = 1,
            /** 标记失效 */
            MarkInvalid = 2,
            /** 隐藏周期 */
            HiddenPeriod = 3
        }
        interface PatchResponse {
            /** 周期规则id */
            period_id?: string;
            /** 周期显示状态 */
            status?: PatchResponseStatus;
        }
    }
    namespace PeriodRule {
        interface Methods {
            /**
             * 获取 OKR 周期规则
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/okr-v1/period_rule/list
             */
            list(): Promise<ListResponse>;
        }
        interface ListResponse {
            /** 指标库列表 */
            period_rules?: Lark.PeriodRule[];
        }
    }
    namespace User {
        interface Methods {
            okr: Okr.Methods;
        }
        namespace Okr {
            interface Methods {
                /**
                 * 获取用户的 OKR 列表
                 * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/okr-v1/user-okr/list
                 */
                list(user_id: string, query?: ListQuery): Promise<ListResponse>;
            }
            interface ListQuery {
                /** 此次调用中使用的用户ID的类型 */
                user_id_type?: 'user_id' | 'union_id' | 'open_id' | 'people_admin_id';
                /** 请求列表的偏移，offset>=0 */
                offset: string;
                /** 列表长度，0-10 */
                limit: string;
                /** 请求OKR的语言版本（比如@的人名），lang=en_us/zh_cn */
                lang?: string;
                /** period_id列表，最多10个 */
                period_ids?: string[];
            }
            interface ListResponse {
                /** OKR周期总数 */
                total?: number;
                /** OKR 列表 */
                okr_list?: Lark.OkrBatch[];
            }
        }
    }
    namespace ProgressRecord {
        interface Methods {
            /**
             * 创建 OKR 进展记录
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/okr-v1/progress_record/create
             */
            create(body: CreateRequest, query?: CreateQuery): Promise<CreateResponse>;
            /**
             * 删除 OKR 进展记录
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/okr-v1/progress_record/delete
             */
            delete(progress_id: string): Promise<void>;
            /**
             * 更新 OKR 进展记录
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/okr-v1/progress_record/update
             */
            update(progress_id: string, body: UpdateRequest, query?: UpdateQuery): Promise<UpdateResponse>;
            /**
             * 获取 OKR 进展记录
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/okr-v1/progress_record/get
             */
            get(progress_id: string, query?: GetQuery): Promise<GetResponse>;
        }
        const enum CreateRequestTargetType {
            /** okr的O */
            Objective = 2,
            /** okr的KR */
            KeyResult = 3
        }
        interface CreateRequest {
            /** 进展来源 */
            source_title: string;
            /** 进展来源链接 */
            source_url: string;
            /** 目标id，与target_type对应 */
            target_id: string;
            /** 目标类型 */
            target_type: CreateRequestTargetType;
            /** 进展详情 富文本格式 */
            content: Lark.ContentBlock;
            /** pc进展来源链接 */
            source_url_pc?: string;
            /** mobile进展来源链接 */
            source_url_mobile?: string;
        }
        interface CreateQuery {
            /** 此次调用中使用的用户ID的类型 */
            user_id_type?: 'user_id' | 'union_id' | 'open_id';
        }
        interface CreateResponse {
            /** OKR 进展ID */
            progress_id?: string;
            /** 进展更新时间 毫秒 */
            modify_time?: string;
            /** 进展 对应的 Content 详细内容 */
            content?: Lark.ContentBlock;
        }
        interface UpdateRequest {
            /** 进展详情 富文本格式 */
            content: Lark.ContentBlock;
        }
        interface UpdateQuery {
            /** 此次调用中使用的用户ID的类型 */
            user_id_type?: 'user_id' | 'union_id' | 'open_id';
        }
        interface UpdateResponse {
            /** OKR 进展ID */
            progress_id?: string;
            /** 进展更新时间 毫秒 */
            modify_time?: string;
            /** 进展 对应的 Content 详细内容 */
            content?: Lark.ContentBlock;
        }
        interface GetQuery {
            /** 此次调用中使用的用户ID的类型 */
            user_id_type?: 'user_id' | 'union_id' | 'open_id';
        }
        interface GetResponse {
            /** OKR 进展ID */
            progress_id?: string;
            /** 进展更新时间 毫秒 */
            modify_time?: string;
            /** 进展 对应的 Content 详细内容 */
            content?: Lark.ContentBlock;
        }
    }
    namespace Image {
        interface Methods {
            /**
             * 上传进展记录图片
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/okr-v1/image/upload
             */
            upload(form: UploadForm): Promise<UploadResponse>;
        }
        const enum UploadFormTargetType {
            /** okr的O */
            Objective = 2,
            /** okr的KR */
            KeyResult = 3
        }
        interface UploadForm {
            /** 图片 */
            data: Blob;
            /** 图片的目标ID */
            target_id: string;
            /** 图片使用的目标类型 */
            target_type: UploadFormTargetType;
        }
        interface UploadResponse {
            /** 图片token */
            file_token?: string;
            /** 图片下载链接 */
            url?: string;
        }
    }
    namespace Review {
        interface Methods {
            /**
             * 查询复盘信息
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/okr-v1/review/query
             */
            query(query?: QueryQuery): Promise<QueryResponse>;
        }
        interface QueryQuery {
            /** 此次调用中使用的用户ID的类型 */
            user_id_type?: 'user_id' | 'union_id' | 'open_id' | 'people_admin_id';
            /** 目标用户id列表，最多5个 */
            user_ids: string[];
            /** period_id列表，最多5个 */
            period_ids: string[];
        }
        interface QueryResponse {
            /** OKR复盘 列表 */
            review_list?: Lark.OkrReview[];
        }
    }
}
