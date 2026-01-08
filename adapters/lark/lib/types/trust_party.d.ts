import * as Lark from '.';
import { Paginated, Pagination } from '../internal';
declare module '../internal' {
    interface Internal {
        trustParty: TrustParty.Methods;
    }
}
export declare namespace TrustParty {
    interface Methods {
        collaborationTenant: CollaborationTenant.Methods;
    }
    namespace CollaborationTenant {
        interface Methods {
            collaborationUser: CollaborationUser.Methods;
            collaborationDepartment: CollaborationDepartment.Methods;
            /**
             * 获取可见关联组织的列表
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/trust_party-v1/collaboration_tenant/list
             */
            list(query?: Pagination): Paginated<Lark.CollaborationTenant, 'target_tenant_list'>;
            /**
             * 获取关联组织的部门和成员信息
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/trust_party-v1/collaboration_tenant/visible_organization
             */
            visibleOrganization(target_tenant_key: string, query?: VisibleOrganizationQuery): Paginated<Lark.CollaborationEntity, 'collaboration_entity_list'>;
            /**
             * 获取关联组织详情
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/trust_party-v1/collaboration_tenant/get
             */
            get(target_tenant_key: string): Promise<GetResponse>;
        }
        interface VisibleOrganizationQuery extends Pagination {
            /** 此次调用中使用的部门ID的类型 */
            department_id_type?: 'department_id' | 'open_department_id';
            /** 请求关联组织的部门ID，0代表根部门，与target_group_id二选一 */
            target_department_id?: string;
            /** 此次调用中使用的用户组ID的类型 */
            group_id_type?: 'group_id' | 'open_group_id';
            /** 请求关联组织的用户组ID，与target_department_id二选一 */
            target_group_id?: string;
        }
        interface GetResponse {
            /** 对方关联组织详情 */
            target_tenant?: Lark.CollaborationTenant;
        }
        namespace CollaborationUser {
            interface Methods {
                /**
                 * 获取关联组织成员详情
                 * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/trust_party-v1/collaboration_tenant-collaboration_user/get
                 */
                get(target_tenant_key: string, target_user_id: string, query?: GetQuery): Promise<GetResponse>;
            }
            interface GetQuery {
                /** 用户ID类型 */
                target_user_id_type?: 'user_id' | 'union_id' | 'open_id';
            }
            interface GetResponse {
                /** 关联组织用户 */
                target_user: Lark.CollaborationUser;
            }
        }
        namespace CollaborationDepartment {
            interface Methods {
                /**
                 * 获取关联组织部门详情
                 * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/trust_party-v1/collaboration_tenant-collaboration_department/get
                 */
                get(target_tenant_key: string, target_department_id: string, query?: GetQuery): Promise<GetResponse>;
            }
            interface GetQuery {
                /** 对方关联组织的入参部门类型 */
                target_department_id_type?: 'department_id' | 'open_department_id';
            }
            interface GetResponse {
                /** 对方关联组织的部门 */
                target_department: Lark.CollaborationDepartment;
            }
        }
    }
}
