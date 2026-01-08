import * as Lark from '.';
import { Paginated, Pagination } from '../internal';
declare module '../internal' {
    interface Internal {
        directory: Directory.Methods;
    }
}
export declare namespace Directory {
    interface Methods {
        employee: Employee.Methods;
        department: Department.Methods;
        collborationShareEntity: CollborationShareEntity.Methods;
        collaborationTenant: CollaborationTenant.Methods;
        collaborationRule: CollaborationRule.Methods;
    }
    namespace Employee {
        interface Methods {
            /**
             * 创建员工
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/directory-v1/employee/create
             */
            create(body: CreateRequest, query?: CreateQuery): Promise<CreateResponse>;
            /**
             * 更新员工信息
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/directory-v1/employee/patch
             */
            patch(employee_id: string, body: PatchRequest, query?: PatchQuery): Promise<void>;
            /**
             * 离职员工
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/directory-v1/employee/delete
             */
            delete(employee_id: string, body: DeleteRequest, query?: DeleteQuery): Promise<void>;
            /**
             * 恢复离职员工
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/directory-v1/employee/resurrect
             */
            resurrect(employee_id: string, body: ResurrectRequest, query?: ResurrectQuery): Promise<void>;
            /**
             * 更新在职员工为待离职
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/directory-v1/employee/to_be_resigned
             */
            toBeResigned(employee_id: string, body: ToBeResignedRequest, query?: ToBeResignedQuery): Promise<void>;
            /**
             * 更新待离职成员为在职
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/directory-v1/employee/regular
             */
            regular(employee_id: string, query?: RegularQuery): Promise<void>;
            /**
             * 批量获取员工信息
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/directory-v1/employee/mget
             */
            mget(body: MgetRequest, query?: MgetQuery): Promise<MgetResponse>;
            /**
             * 批量获取员工列表
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/directory-v1/employee/filter
             */
            filter(body: FilterRequest, query?: FilterQuery): Promise<FilterResponse>;
            /**
             * 搜索员工信息
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/directory-v1/employee/search
             */
            search(body: SearchRequest, query?: SearchQuery): Promise<SearchResponse>;
        }
        interface CreateRequest {
            /** 创建员工对象 */
            employee: Lark.CreateEmployee;
            /** 接口拓展选项 */
            options?: Lark.CreateEmployeeOptions;
        }
        interface CreateQuery {
            /** 此次调用中使用的用户ID的类型 */
            employee_id_type?: 'open_id' | 'employee_id' | 'union_id';
            /** 此次调用中使用的部门ID的类型 */
            department_id_type?: 'department_id' | 'open_department_id';
        }
        interface CreateResponse {
            /** 员工ID */
            employee_id?: string;
        }
        interface PatchRequest {
            /** 更新员工对象 */
            employee: Lark.UpdateEmployee;
        }
        interface PatchQuery {
            /** 此次调用中使用的用户ID的类型 */
            employee_id_type?: 'open_id' | 'union_id' | 'employee_id';
            /** 部门ID类型 */
            department_id_type?: 'department_id' | 'open_department_id';
        }
        interface DeleteRequest {
            /** 接口拓展选项 */
            options?: Lark.DeleteEmployeeOptions;
        }
        interface DeleteQuery {
            /** 此次调用中使用的用户ID的类型 */
            employee_id_type?: 'open_id' | 'employee_id' | 'union_id';
        }
        interface ResurrectRequest {
            /** 部门信息 */
            employee_order_in_departments?: Lark.UpsertUserDepartmentSortInfo[];
            /** 选项 */
            options?: Lark.ResurrectEmployeeOptions;
        }
        interface ResurrectQuery {
            /** 此次调用中使用的用户ID的类型 */
            employee_id_type?: 'open_id' | 'employee_id' | 'union_id';
            /** 部门ID类型 */
            department_id_type?: 'department_id' | 'open_department_id';
        }
        interface ToBeResignedRequest {
            /** 在职员工流转到待离职 */
            employee: Lark.SetEmployeePreResigned;
        }
        interface ToBeResignedQuery {
            /** 员工ID类型 */
            employee_id_type?: 'open_id' | 'union_id' | 'employee_id';
            /** 部门ID类型 */
            department_id_type?: 'department_id' | 'open_department_id';
        }
        interface RegularQuery {
            /** 员工ID类型 */
            employee_id_type?: 'open_id' | 'union_id' | 'employee_id';
            /** 部门ID类型 */
            department_id_type?: 'department_id' | 'open_department_id';
        }
        interface MgetRequest {
            /** 员工id */
            employee_ids: string[];
            /** 字段枚举 */
            required_fields: string[];
        }
        interface MgetQuery {
            /** 此次调用中使用的用户ID的类型 */
            employee_id_type?: 'open_id' | 'employee_id' | 'union_id';
            /** 此次调用中使用的部门ID的类型 */
            department_id_type?: 'department_id' | 'open_department_id';
        }
        interface MgetResponse {
            /** 员工信息 */
            employees?: Lark.EmployeeEntity[];
            /** 字段异常信息 */
            abnormals?: Lark.AbnormalRecord[];
        }
        interface FilterRequest {
            /** 查询条件 */
            filter: Lark.MultiFilterCondition;
            /** 需要查询的字段列表。将按照传递的字段列表返回有权限的行、列数据。不传则不会返回任何字段 */
            required_fields: string[];
            /** 分页参数 */
            page_request: Lark.PageCondition;
        }
        interface FilterQuery {
            /** 此次调用中使用的用户ID的类型 */
            employee_id_type?: 'open_id' | 'union_id' | 'employee_id';
            /** 此次调用中使用的部门ID的类型 */
            department_id_type?: 'department_id' | 'open_department_id';
        }
        interface FilterResponse {
            /** 员工信息 */
            employees?: Lark.EmployeeEntity[];
            /** 分页结果 */
            page_response?: Lark.PageResponse;
            /** 异常信息 */
            abnormals?: Lark.AbnormalRecord[];
        }
        interface SearchRequest {
            /** 搜索关键词。支持员工ID、员工名称、员工手机号、员工邮箱的搜索。其中员工ID、员工手机号支持精确搜索，员工名称、员工邮箱支持模糊搜索，员工名称支持国际化名称的搜索。 */
            query: string;
            /** 分页信息 */
            page_request: Lark.PageCondition;
            /** 需要查询的字段列表。将按照传递的字段列表返回有权限的行、列数据。不传则不会返回任何字段 */
            required_fields: string[];
        }
        interface SearchQuery {
            /** 此次调用中使用的用户ID的类型 */
            employee_id_type?: 'open_id' | 'union_id' | 'employee_id';
            /** 此次调用中使用的部门ID的类型 */
            department_id_type?: 'open_department_id' | 'department_id';
        }
        interface SearchResponse {
            /** 员工信息 */
            employees?: Lark.EmployeeEntity[];
            /** 分页结果 */
            page_response?: Lark.PageResponse;
            /** 字段异常信息 */
            abnormals?: Lark.AbnormalRecord[];
        }
    }
    namespace Department {
        interface Methods {
            /**
             * 创建部门
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/directory-v1/department/create
             */
            create(body: CreateRequest, query?: CreateQuery): Promise<CreateResponse>;
            /**
             * 更新部门
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/directory-v1/department/patch
             */
            patch(department_id: string, body: PatchRequest, query?: PatchQuery): Promise<void>;
            /**
             * 删除部门
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/directory-v1/department/delete
             */
            delete(department_id: string, query?: DeleteQuery): Promise<void>;
            /**
             * 批量获取部门信息
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/directory-v1/department/mget
             */
            mget(body: MgetRequest, query?: MgetQuery): Promise<MgetResponse>;
            /**
             * 获取部门列表
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/directory-v1/department/filter
             */
            filter(body: FilterRequest, query?: FilterQuery): Promise<FilterResponse>;
            /**
             * 搜索部门
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/directory-v1/department/search
             */
            search(body: SearchRequest, query?: SearchQuery): Promise<SearchResponse>;
        }
        interface CreateRequest {
            /** 创建部门 */
            department: Lark.CreateDepartment;
        }
        interface CreateQuery {
            /** 此次调用中使用的用户ID的类型 */
            employee_id_type?: 'open_id' | 'union_id' | 'employee_id';
            /** 此次调用中使用的部门ID的类型 */
            department_id_type?: 'department_id' | 'open_department_id';
        }
        interface CreateResponse {
            /** 部门ID */
            department_id?: string;
        }
        interface PatchRequest {
            /** 更新部门 */
            department: Lark.UpdateDepartment;
        }
        interface PatchQuery {
            /** 此次调用中使用的用户ID的类型 */
            employee_id_type?: 'open_id' | 'union_id' | 'employee_id';
            /** 此次调用中使用的部门ID的类型 */
            department_id_type?: 'open_department_id' | 'department_id';
        }
        interface DeleteQuery {
            /** 此次调用中使用的部门ID的类型 */
            department_id_type?: 'department_id' | 'open_department_id';
        }
        interface MgetRequest {
            /** 部门id */
            department_ids: string[];
            /** 字段枚举 */
            required_fields: string[];
        }
        interface MgetQuery {
            /** 此次调用中使用的用户ID的类型 */
            employee_id_type?: 'open_id' | 'employee_id' | 'union_id';
            /** 此次调用中使用的部门ID的类型 */
            department_id_type?: 'department_id' | 'open_department_id';
        }
        interface MgetResponse {
            /** 部门信息 */
            departments?: Lark.Department[];
            /** 字段异常信息 */
            abnormals?: Lark.AbnormalRecord[];
        }
        interface FilterRequest {
            /** 查询条件 */
            filter: Lark.MultiFilterCondition;
            /** 需要查询的字段列表。将按照传递的字段列表返回有权限的行、列数据。不传则不会返回任何字段 */
            required_fields: string[];
            /** 分页信息 */
            page_request: Lark.PageCondition;
        }
        interface FilterQuery {
            /** 此次调用中使用的用户ID的类型 */
            employee_id_type?: 'open_id' | 'employee_id' | 'union_id';
            /** 此次调用中使用的部门ID的类型 */
            department_id_type?: 'open_department_id' | 'department_id';
        }
        interface FilterResponse {
            /** 部门信息 */
            departments?: Lark.Department[];
            /** 分页结果 */
            page_response?: Lark.PageResponse;
            /** 异常信息 */
            abnormals?: Lark.AbnormalRecord[];
        }
        interface SearchRequest {
            /** 搜索关键词。支持部门名称的搜索 */
            query: string;
            /** 分页信息 */
            page_request: Lark.PageCondition;
            /** 需要查询的字段列表。将按照传递的字段列表返回有权限的行、列数据。不传则不会返回任何字段 */
            required_fields: string[];
        }
        interface SearchQuery {
            /** 此次调用中使用的用户ID的类型 */
            employee_id_type?: 'open_id' | 'employee_id' | 'union_id';
            /** 此次调用中使用的部门ID的类型 */
            department_id_type?: 'open_department_id' | 'department_id';
        }
        interface SearchResponse {
            /** 部门信息 */
            departments?: Lark.Department[];
            /** 分页结果 */
            page_response?: Lark.PageResponse;
            /** 字段异常信息 */
            abnormals?: Lark.AbnormalRecord[];
        }
    }
    namespace CollborationShareEntity {
        interface Methods {
            /**
             * 获取关联组织双方共享成员范围
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/directory-v1/collboration_share_entity/list
             */
            list(query?: ListQuery): Promise<ListResponse>;
        }
        interface ListQuery extends Pagination {
            /** 对方租户的tenant key */
            target_tenant_key: string;
            /** 不填写该参数为租户的分享范围，可填写该字段继续下钻查看指定部门下的子部门+成员。填写0分为两种情况，若租户分享的为全员则展示一级部门，否则展示分享的部门+成员。 */
            target_department_id?: string;
            /** 获取用户组下的成员，填写该值后忽略target_department_id */
            target_group_id?: string;
            /** 是否主体租户分享范围，默认是客体租户的分享范围 */
            is_select_subject?: boolean;
        }
        interface ListResponse {
            /** 分页标记，第一次请求不填，表示从头开始遍历；分页查询结果还有更多项时会同时返回新的 page_token，下次遍历可采用该 page_token 获取查询结果 */
            page_token?: string;
            /** 是否还有更多项 */
            has_more?: boolean;
            /** 分享的部门信息 */
            share_departments?: Lark.ShareDepartment[];
            /** 分享的用户组信息 */
            share_groups?: Lark.ShareGroup[];
            /** 分享的用户信息 */
            share_users?: Lark.ShareUser[];
        }
    }
    namespace CollaborationTenant {
        interface Methods {
            /**
             * 管理员获取所有关联组织列表
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/directory-v1/collaboration_tenant/list
             */
            list(query?: Pagination): Paginated<Lark.CollaborationTenant>;
        }
    }
    namespace CollaborationRule {
        interface Methods {
            /**
             * 新增可搜可见规则
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/directory-v1/collaboration_rule/create
             */
            create(body: CreateRequest, query?: CreateQuery): Promise<CreateResponse>;
            /**
             * 更新可搜可见规则
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/directory-v1/collaboration_rule/update
             */
            update(collaboration_rule_id: string, body: UpdateRequest, query?: UpdateQuery): Promise<void>;
            /**
             * 查询可搜可见规则
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/directory-v1/collaboration_rule/list
             */
            list(query?: ListQuery): Paginated<Lark.CollaborationRule>;
            /**
             * 删除可搜可见规则
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/directory-v1/collaboration_rule/delete
             */
            delete(collaboration_rule_id: string, query?: DeleteQuery): Promise<void>;
        }
        interface CreateRequest {
            /** 实体数量之和需要小于100 */
            subjects: Lark.CollaborationRuleEntities;
            /** 实体数量之和需要小于100 */
            objects: Lark.CollaborationRuleEntities;
        }
        interface CreateQuery {
            /** 对方租户的tenant key */
            target_tenant_key: string;
        }
        interface CreateResponse {
            /** 添加的规则ID */
            add_rule_id?: string;
        }
        interface UpdateRequest {
            /** 实体数量之和需要小于100 */
            subjects: Lark.CollaborationRuleEntities;
            /** 实体数量之和需要小于100 */
            objects: Lark.CollaborationRuleEntities;
        }
        interface UpdateQuery {
            /** 对方租户的tenant key */
            target_tenant_key: string;
        }
        interface ListQuery extends Pagination {
            /** 对方租户的tenant key */
            target_tenant_key: string;
        }
        interface DeleteQuery {
            /** 对方租户的tenant key */
            target_tenant_key: string;
        }
    }
}
