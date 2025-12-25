import * as Lark from '.';
import { Paginated } from '../internal';
declare module '../internal' {
    interface Internal {
        report: Report.Methods;
    }
}
export declare namespace Report {
    interface Methods {
        rule: Rule.Methods;
        task: Task.Methods;
    }
    namespace Rule {
        interface Methods {
            view: View.Methods;
            /**
             * 查询规则
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/report/report-v1/rule/query
             */
            query(query?: QueryQuery): Promise<QueryResponse>;
        }
        const enum QueryQueryIncludeDeleted {
            /** 不包括已删除 */
            Exclude = 0,
            /** 包括已删除 */
            Include = 1
        }
        interface QueryQuery {
            /** 规则名称 */
            rule_name: string;
            /** 是否包括已删除，默认未删除 */
            include_deleted?: QueryQueryIncludeDeleted;
            /** 此次调用中使用的用户ID的类型 */
            user_id_type?: 'user_id' | 'union_id' | 'open_id';
        }
        interface QueryResponse {
            /** 规则列表 */
            rules?: Lark.Rule[];
        }
        namespace View {
            interface Methods {
                /**
                 * 移除规则看板
                 * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/report/report-v1/rule-view/remove
                 */
                remove(rule_id: string, body: RemoveRequest, query?: RemoveQuery): Promise<void>;
            }
            interface RemoveRequest {
                /** 列表为空删除规则下全用户视图，列表不为空删除指定用户视图，大小限制200。 */
                user_ids?: string[];
            }
            interface RemoveQuery {
                user_id_type?: 'user_id' | 'union_id' | 'open_id';
            }
        }
    }
    namespace Task {
        interface Methods {
            /**
             * 查询任务
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/report/report-v1/task/query
             */
            query(body: QueryRequest, query?: QueryQuery): Paginated<Lark.Task>;
        }
        interface QueryRequest {
            /** 提交开始时间时间戳 */
            commit_start_time: number;
            /** 提交结束时间时间戳 */
            commit_end_time: number;
            /** 汇报规则ID */
            rule_id?: string;
            /** 用户ID */
            user_id?: string;
            /** 分页标识符 */
            page_token: string;
            /** 单次分页返回的条数 */
            page_size: number;
        }
        interface QueryQuery {
            /** 此次调用中使用的用户ID的类型 */
            user_id_type?: 'user_id' | 'union_id' | 'open_id';
        }
    }
}
