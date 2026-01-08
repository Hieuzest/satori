import * as Lark from '.';
import { Paginated, Pagination } from '../internal';
declare module '../internal' {
    interface Internal {
        acs: Acs.Methods;
    }
}
export declare namespace Acs {
    interface Methods {
        user: User.Methods;
        ruleExternal: RuleExternal.Methods;
        visitor: Visitor.Methods;
        device: Device.Methods;
        accessRecord: AccessRecord.Methods;
    }
    namespace User {
        interface Methods {
            face: Face.Methods;
            /**
             * 修改用户部分信息
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/acs-v1/user/patch
             */
            patch(user_id: string, body: PatchRequest, query?: PatchQuery): Promise<void>;
            /**
             * 获取单个用户信息
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/acs-v1/user/get
             */
            get(user_id: string, query?: GetQuery): Promise<GetResponse>;
            /**
             * 获取用户列表
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/acs-v1/user/list
             */
            list(query?: ListQuery): Paginated<Lark.User>;
        }
        interface PatchRequest {
            /** 用户特征 */
            feature?: Lark.Feature;
        }
        interface PatchQuery {
            /** 此次调用中使用的用户ID的类型 */
            user_id_type?: 'user_id' | 'union_id' | 'open_id';
        }
        interface GetQuery {
            /** 此次调用中使用的用户ID的类型 */
            user_id_type?: 'user_id' | 'union_id' | 'open_id';
        }
        interface GetResponse {
            /** 门禁用户信息 */
            user?: Lark.User;
        }
        interface ListQuery extends Pagination {
            /** 此次调用中使用的用户ID的类型 */
            user_id_type?: 'user_id' | 'union_id' | 'open_id';
        }
        namespace Face {
            interface Methods {
                /**
                 * 上传人脸图片
                 * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/acs-v1/user-face/update
                 */
                update(user_id: string, form: UpdateForm, query?: UpdateQuery): Promise<void>;
                /**
                 * 下载人脸图片
                 * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/acs-v1/user-face/get
                 */
                get(user_id: string, query?: GetQuery): Promise<ArrayBuffer>;
            }
            interface UpdateForm {
                /** 人脸图片内容 */
                files: Blob;
                /** 文件类型,可选的类型有jpg,png */
                file_type: string;
                /** 带后缀的文件名 */
                file_name: string;
            }
            interface UpdateQuery {
                /** 此次调用中使用的用户ID的类型 */
                user_id_type?: 'user_id' | 'union_id' | 'open_id';
            }
            interface GetQuery {
                /** 裁剪图 */
                is_cropped?: boolean;
                /** 此次调用中使用的用户ID的类型 */
                user_id_type?: 'user_id' | 'union_id' | 'open_id';
            }
        }
    }
    namespace RuleExternal {
        interface Methods {
            /**
             * 设备绑定权限组
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/acs-v1/rule_external/device_bind
             */
            deviceBind(body: DeviceBindRequest): Promise<void>;
            /**
             * 获取权限组信息
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/acs-v1/rule_external/get
             */
            get(query?: GetQuery): Promise<GetResponse>;
            /**
             * 删除权限组
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/acs-v1/rule_external/delete
             */
            delete(query?: DeleteQuery): Promise<void>;
            /**
             * 创建或更新权限组
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/acs-v1/rule_external/create
             */
            create(body: CreateRequest, query?: CreateQuery): Promise<CreateResponse>;
        }
        interface DeviceBindRequest {
            /** 设备id */
            device_id: string;
            /** 权限组id列表 */
            rule_ids: string[];
        }
        interface GetQuery {
            /** 设备id */
            device_id?: string;
            /** 此次调用中使用的用户ID的类型 */
            user_id_type?: 'user_id' | 'union_id' | 'open_id';
        }
        interface GetResponse {
            /** 设备权限组信息 */
            rules: Lark.Rule[];
        }
        interface DeleteQuery {
            /** 权限组id */
            rule_id: string;
        }
        interface CreateRequest {
            /** 权限组信息 */
            rule: Lark.Rule;
        }
        interface CreateQuery {
            /** 权限组id-为空创建,不为空则更新 */
            rule_id?: string;
            /** 此次调用中使用的用户ID的类型 */
            user_id_type?: 'user_id' | 'union_id' | 'open_id';
        }
        interface CreateResponse {
            /** 权限组id */
            rule_id: string;
        }
    }
    namespace Visitor {
        interface Methods {
            /**
             * 删除访客
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/acs-v1/visitor/delete
             */
            delete(visitor_id: string, query?: DeleteQuery): Promise<void>;
            /**
             * 添加访客
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/acs-v1/visitor/create
             */
            create(body: CreateRequest, query?: CreateQuery): Promise<CreateResponse>;
        }
        interface DeleteQuery {
            /** 此次调用中使用的用户ID的类型 */
            user_id_type?: 'user_id' | 'union_id' | 'open_id';
        }
        interface CreateRequest {
            /** 访客信息 */
            user: Lark.UserExternal;
        }
        interface CreateQuery {
            /** 此次调用中使用的用户ID的类型 */
            user_id_type?: 'user_id' | 'union_id' | 'open_id';
        }
        interface CreateResponse {
            /** 访客的id */
            visitor_id: string;
        }
    }
    namespace Device {
        interface Methods {
            /**
             * 获取门禁设备列表
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/acs-v1/device/list
             */
            list(): Promise<ListResponse>;
        }
        interface ListResponse {
            items?: Lark.Device[];
        }
    }
    namespace AccessRecord {
        interface Methods {
            accessPhoto: AccessPhoto.Methods;
            /**
             * 获取门禁记录列表
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/acs-v1/access_record/list
             */
            list(query?: ListQuery): Paginated<Lark.AccessRecord>;
        }
        interface ListQuery extends Pagination {
            /** 记录开始时间，单位秒 */
            from: number;
            /**
             * 记录结束时间，单位秒，
             * 时间跨度不能超过30天
             */
            to: number;
            /** 门禁设备 ID */
            device_id?: string;
            /** 此次调用中使用的用户ID的类型 */
            user_id_type?: 'user_id' | 'union_id' | 'open_id';
        }
        namespace AccessPhoto {
            interface Methods {
                /**
                 * 下载开门时的人脸识别图片
                 * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/acs-v1/access_record-access_photo/get
                 */
                get(access_record_id: string): Promise<ArrayBuffer>;
            }
        }
    }
}
