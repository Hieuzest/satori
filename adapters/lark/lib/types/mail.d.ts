import * as Lark from '.';
import { Paginated, Pagination } from '../internal';
declare module '../internal' {
    interface Internal {
        mail: Mail.Methods;
    }
}
export declare namespace Mail {
    interface Methods {
        userMailbox: UserMailbox.Methods;
        mailgroup: Mailgroup.Methods;
        publicMailbox: PublicMailbox.Methods;
        user: User.Methods;
    }
    namespace UserMailbox {
        interface Methods {
            folder: Folder.Methods;
            message: Message.Methods;
            event: Event.Methods;
            rule: Rule.Methods;
            mailContact: MailContact.Methods;
            alias: Alias.Methods;
            /**
             * 从回收站删除用户邮箱地址
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/mail-v1/user_mailbox/delete
             */
            delete(user_mailbox_id: string, query?: DeleteQuery): Promise<void>;
        }
        interface DeleteQuery {
            /** 用于接受转移的邮箱地址 */
            transfer_mailbox?: string;
        }
        namespace Folder {
            interface Methods {
                /**
                 * 创建邮箱文件夹
                 * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/mail-v1/user_mailbox-folder/create
                 */
                create(user_mailbox_id: string, body: CreateRequest): Promise<CreateResponse>;
                /**
                 * 删除邮箱文件夹
                 * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/mail-v1/user_mailbox-folder/delete
                 */
                delete(user_mailbox_id: string, folder_id: string): Promise<void>;
                /**
                 * 修改邮箱文件夹
                 * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/mail-v1/user_mailbox-folder/patch
                 */
                patch(user_mailbox_id: string, folder_id: string, body: PatchRequest): Promise<void>;
                /**
                 * 列出邮箱文件夹
                 * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/mail-v1/user_mailbox-folder/list
                 */
                list(user_mailbox_id: string, query?: ListQuery): Promise<ListResponse>;
            }
            interface CreateRequest {
                /** 文件夹名称 */
                name: string;
                /** 父文件夹 id，该值为 0 表示根文件夹 */
                parent_folder_id: string;
            }
            interface CreateResponse {
                /** 文件夹实体 */
                folder?: Lark.Folder;
            }
            interface PatchRequest {
                /** 文件夹名称 */
                name?: string;
                /** 父文件夹 id，该值为 0 表示根文件夹 */
                parent_folder_id?: string;
            }
            const enum ListQueryFolderType {
                /** 系统文件夹 */
                System = 1,
                /** 用户文件夹 */
                User = 2
            }
            interface ListQuery {
                /** 文件夹类型 */
                folder_type?: ListQueryFolderType;
            }
            interface ListResponse {
                /** 文件夹列表 */
                items?: Lark.Folder[];
            }
        }
        namespace Message {
            interface Methods {
                attachment: Attachment.Methods;
                /**
                 * 获取邮件卡片的邮件列表
                 * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/mail-v1/user_mailbox-message/get_by_card
                 */
                getByCard(user_mailbox_id: string, query?: GetByCardQuery): Promise<GetByCardResponse>;
                /**
                 * 列出邮件
                 * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/mail-v1/user_mailbox-message/list
                 */
                list(user_mailbox_id: string, query?: ListQuery): Paginated<string>;
                /**
                 * 获取邮件详情
                 * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/mail-v1/user_mailbox-message/get
                 */
                get(user_mailbox_id: string, message_id: string): Promise<GetResponse>;
                /**
                 * 发送邮件
                 * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/mail-v1/user_mailbox-message/send
                 */
                send(user_mailbox_id: string, body: SendRequest): Promise<void>;
            }
            interface GetByCardQuery {
                /** 卡片ID */
                card_id: string;
                /** 卡片OwnerID */
                owner_id: string;
                /** 用户ID类型 */
                user_id_type?: 'open_id' | 'user_id' | 'union_id';
            }
            interface GetByCardResponse {
                /** 邮件Owner信息 */
                owner_info: Lark.UserInfo;
                /** 邮件ID列表 */
                message_ids: string[];
                /** 卡片ID */
                card_id: string;
            }
            interface ListQuery extends Pagination {
                /** 文件夹 id */
                folder_id: string;
                /** 是否只查询未读邮件 */
                only_unread?: boolean;
            }
            interface GetResponse {
                /** 邮件体 */
                message?: Lark.Message;
            }
            interface SendRequest {
                /** MIME邮件数据，基于base64url编码 */
                raw?: string;
                /** 主题 */
                subject?: string;
                /** 收件人 */
                to?: Lark.MailAddress[];
                /** 抄送 */
                cc?: Lark.MailAddress[];
                /** 秘送 */
                bcc?: Lark.MailAddress[];
                /** 发件人 */
                head_from?: Lark.MailAddress;
                /** 正文(base64url) */
                body_html?: string;
                /** 正文纯文本(base64url) */
                body_plain_text?: string;
                /** 邮件附件列表 */
                attachments?: Lark.Attachment[];
                /** 会话id */
                thread_id?: string;
            }
            namespace Attachment {
                interface Methods {
                    /**
                     * 获取附件下载链接
                     * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/mail-v1/user_mailbox-message-attachment/download_url
                     */
                    downloadUrl(user_mailbox_id: string, message_id: string, query?: DownloadUrlQuery): Promise<DownloadUrlResponse>;
                }
                interface DownloadUrlQuery {
                    /** 附件 id 列表 */
                    attachment_ids: string[];
                }
                interface DownloadUrlResponse {
                    /** 下载链接列表 */
                    download_urls?: Lark.AttachmentDownloadUrlItem[];
                    /** 获取失败的附件 id 列表 */
                    failed_ids?: string[];
                }
            }
        }
        namespace Event {
            interface Methods {
                /**
                 * 订阅事件
                 * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/mail-v1/user_mailbox-event/subscribe
                 */
                subscribe(user_mailbox_id: string, body: SubscribeRequest): Promise<void>;
                /**
                 * 获取订阅状态
                 * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/mail-v1/user_mailbox-event/subscription
                 */
                subscription(user_mailbox_id: string): Promise<SubscriptionResponse>;
                /**
                 * 取消订阅
                 * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/mail-v1/user_mailbox-event/unsubscribe
                 */
                unsubscribe(user_mailbox_id: string, body: UnsubscribeRequest): Promise<void>;
            }
            const enum SubscribeRequestEventType {
                /** 邮件相关事件 */
                Message = 1
            }
            interface SubscribeRequest {
                /** 事件类型 */
                event_type: SubscribeRequestEventType;
            }
            interface SubscriptionResponse {
                /** 订阅的事件列表 */
                event_types?: number[];
            }
            const enum UnsubscribeRequestEventType {
                /** 邮件相关事件 */
                Message = 1
            }
            interface UnsubscribeRequest {
                /** 事件类型 */
                event_type: UnsubscribeRequestEventType;
            }
        }
        namespace Rule {
            interface Methods {
                /**
                 * 创建收信规则
                 * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/mail-v1/user_mailbox-rule/create
                 */
                create(user_mailbox_id: string, body: CreateRequest): Promise<CreateResponse>;
                /**
                 * 删除收信规则
                 * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/mail-v1/user_mailbox-rule/delete
                 */
                delete(user_mailbox_id: string, rule_id: string): Promise<void>;
                /**
                 * 更新收信规则
                 * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/mail-v1/user_mailbox-rule/update
                 */
                update(user_mailbox_id: string, rule_id: string, body: UpdateRequest): Promise<void>;
                /**
                 * 列出收信规则
                 * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/mail-v1/user_mailbox-rule/list
                 */
                list(user_mailbox_id: string): Promise<ListResponse>;
                /**
                 * 对收信规则进行排序
                 * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/mail-v1/user_mailbox-rule/reorder
                 */
                reorder(user_mailbox_id: string, body: ReorderRequest): Promise<void>;
            }
            interface CreateRequest {
                /** 匹配条件 */
                condition: Lark.RuleCondition;
                /** 匹配命中后的操作 */
                action: Lark.RuleAction;
                /** 是否终点规则 */
                ignore_the_rest_of_rules: boolean;
                /** 规则名称 */
                name: string;
                /** 是否启用 */
                is_enable: boolean;
            }
            interface CreateResponse {
                /** 规则实体 */
                rule?: Lark.Rule;
            }
            interface UpdateRequest {
                /** 匹配条件 */
                condition: Lark.RuleCondition;
                /** 匹配命中后的操作 */
                action: Lark.RuleAction;
                /** 是否终点规则 */
                ignore_the_rest_of_rules: boolean;
                /** 规则名称 */
                name: string;
                /** 是否启用 */
                is_enable: boolean;
            }
            interface ListResponse {
                /** 规则列表 */
                items?: Lark.Rule[];
            }
            interface ReorderRequest {
                /** 规则 id 列表 */
                rule_ids: string[];
            }
        }
        namespace MailContact {
            interface Methods {
                /**
                 * 创建邮箱联系人
                 * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/mail-v1/user_mailbox-mail_contact/create
                 */
                create(user_mailbox_id: string, body: CreateRequest): Promise<CreateResponse>;
                /**
                 * 删除邮箱联系人
                 * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/mail-v1/user_mailbox-mail_contact/delete
                 */
                delete(user_mailbox_id: string, mail_contact_id: string): Promise<void>;
                /**
                 * 修改邮箱联系人信息
                 * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/mail-v1/user_mailbox-mail_contact/patch
                 */
                patch(user_mailbox_id: string, mail_contact_id: string, body: PatchRequest): Promise<void>;
                /**
                 * 列出邮箱联系人
                 * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/mail-v1/user_mailbox-mail_contact/list
                 */
                list(user_mailbox_id: string, query?: Pagination): Paginated<Lark.MailContact>;
            }
            interface CreateRequest {
                /** 联系人姓名 */
                name: string;
                /** 联系人公司 */
                company?: string;
                /** 联系人手机号 */
                phone?: string;
                /** 联系人邮箱 */
                mail_address?: string;
                /** 联系人标签 */
                tag?: string;
                /** 联系人备注 */
                remark?: string;
                /** 联系人职位 */
                position?: string;
            }
            interface CreateResponse {
                /** 联系人实体 */
                mail_contact?: Lark.MailContact;
            }
            interface PatchRequest {
                /** 联系人姓名 */
                name: string;
                /** 联系人公司 */
                company?: string;
                /** 联系人手机号 */
                phone?: string;
                /** 联系人邮箱 */
                mail_address?: string;
                /** 联系人标签 */
                tag?: string;
                /** 联系人备注 */
                remark?: string;
                /** 联系人职位 */
                position?: string;
            }
        }
        namespace Alias {
            interface Methods {
                /**
                 * 创建用户邮箱别名
                 * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/mail-v1/user_mailbox-alias/create
                 */
                create(user_mailbox_id: string, body: CreateRequest): Promise<CreateResponse>;
                /**
                 * 删除用户邮箱别名
                 * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/mail-v1/user_mailbox-alias/delete
                 */
                delete(user_mailbox_id: string, alias_id: string): Promise<void>;
                /**
                 * 获取用户邮箱所有别名
                 * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/mail-v1/user_mailbox-alias/list
                 */
                list(user_mailbox_id: string, query?: Pagination): Promise<ListResponse>;
            }
            interface CreateRequest {
                /** 邮箱别名 */
                email_alias?: string;
            }
            interface CreateResponse {
                /** 用户邮箱别名 */
                user_mailbox_alias?: Lark.EmailAlias;
            }
            interface ListResponse {
                /** 用户邮箱别名 */
                items?: Lark.EmailAlias[];
            }
        }
    }
    namespace Mailgroup {
        interface Methods {
            manager: Manager.Methods;
            member: Member.Methods;
            alias: Alias.Methods;
            permissionMember: PermissionMember.Methods;
            /**
             * 创建邮件组
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/mail-v1/mailgroup/create
             */
            create(body: CreateRequest): Promise<CreateResponse>;
            /**
             * 删除邮件组
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/mail-v1/mailgroup/delete
             */
            delete(mailgroup_id: string): Promise<void>;
            /**
             * 修改邮件组部分信息
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/mail-v1/mailgroup/patch
             */
            patch(mailgroup_id: string, body: PatchRequest): Promise<PatchResponse>;
            /**
             * 修改邮件组全部信息
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/mail-v1/mailgroup/update
             */
            update(mailgroup_id: string, body: UpdateRequest): Promise<UpdateResponse>;
            /**
             * 查询指定邮件组
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/mail-v1/mailgroup/get
             */
            get(mailgroup_id: string): Promise<GetResponse>;
            /**
             * 批量获取邮件组
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/mail-v1/mailgroup/list
             */
            list(query?: ListQuery): Paginated<Lark.Mailgroup>;
        }
        interface CreateRequest {
            /** The mail group's email address */
            email?: string;
            /** The mail group's display name */
            name?: string;
            /** The mail group's description */
            description?: string;
            /**
             * Who can send mail to this mail group. Possible values are:
             * - ANYONE: Any Internet user can send mail to this mail group
             * - ALL_INTERNAL_USERS: Anyone in the team can send mail to this mail group
             * - ALL_GROUP_MEMBERS: Any group member can send mail to this mail group
             * - CUSTOM_MEMBERS: Only custom members can send mail to this mail group, define in mailgroup.permission_members resoure
             */
            who_can_send_mail?: 'ANYONE' | 'ALL_INTERNAL_USERS' | 'ALL_GROUP_MEMBERS' | 'CUSTOM_MEMBERS';
        }
        interface CreateResponse {
            /** The unique ID of a mail group */
            mailgroup_id?: string;
            /** The mail group's email address */
            email?: string;
            /** The mail group's display name */
            name?: string;
            /** The mail group's description */
            description?: string;
            /** The number of mail group's direct members */
            direct_members_count?: string;
            /** Value is true if this mail group has external member */
            include_external_member?: boolean;
            /** Value is true if all company members are in this mail group */
            include_all_company_member?: boolean;
            /**
             * Who can send mail to this mail group. Possible values are:
             * - ANYONE: Any Internet user can send mail to this mail group
             * - ALL_INTERNAL_USERS: Anyone in the team can send mail to this mail group
             * - ALL_GROUP_MEMBERS: Any group member can send mail to this mail group
             * - CUSTOM_MEMBERS: Only custom members can send mail to this mail group, define in mailgroup.permission_members resoure
             */
            who_can_send_mail?: 'ANYONE' | 'ALL_INTERNAL_USERS' | 'ALL_GROUP_MEMBERS' | 'CUSTOM_MEMBERS';
        }
        interface PatchRequest {
            /** The public mailbox's new primary email address */
            email?: string;
            /** The mail group's display name */
            name?: string;
            /** The mail group's description */
            description?: string;
            /**
             * Who can send mail to this mail group. Possible values are:
             * - ANYONE: Any Internet user can send mail to this mail group
             * - ALL_INTERNAL_USERS: Anyone in the team can send mail to this mail group
             * - ALL_GROUP_MEMBERS: Any group member can send mail to this mail group
             * - CUSTOM_MEMBERS: Only custom members can send mail to this mail group, define in mailgroup.permission_members resoure
             */
            who_can_send_mail?: 'ANYONE' | 'ALL_INTERNAL_USERS' | 'ALL_GROUP_MEMBERS' | 'CUSTOM_MEMBERS';
        }
        interface PatchResponse {
            /** The unique ID of a mail group */
            mailgroup_id?: string;
            /** The mail group's email address */
            email?: string;
            /** The mail group's display name */
            name?: string;
            /** The mail group's description */
            description?: string;
            /** The number of mail group's direct members */
            direct_members_count?: string;
            /** Value is true if this mail group has external member */
            include_external_member?: boolean;
            /** Value is true if all company members are in this mail group */
            include_all_company_member?: boolean;
            /**
             * Who can send mail to this mail group. Possible values are:
             * - ANYONE: Any Internet user can send mail to this mail group
             * - ALL_INTERNAL_USERS: Anyone in the team can send mail to this mail group
             * - ALL_GROUP_MEMBERS: Any group member can send mail to this mail group
             * - CUSTOM_MEMBERS: Only custom members can send mail to this mail group, define in mailgroup.permission_members resoure
             */
            who_can_send_mail?: 'ANYONE' | 'ALL_INTERNAL_USERS' | 'ALL_GROUP_MEMBERS' | 'CUSTOM_MEMBERS';
        }
        interface UpdateRequest {
            /** The public mailbox's new primary email address */
            email?: string;
            /** The mail group's display name */
            name?: string;
            /** The mail group's description */
            description?: string;
            /**
             * Who can send mail to this mail group. Possible values are:
             * - ANYONE: Any Internet user can send mail to this mail group
             * - ALL_INTERNAL_USERS: Anyone in the team can send mail to this mail group
             * - ALL_GROUP_MEMBERS: Any group member can send mail to this mail group
             * - CUSTOM_MEMBERS: Only custom members can send mail to this mail group, define in mailgroup.permission_members resoure
             */
            who_can_send_mail?: 'ANYONE' | 'ALL_INTERNAL_USERS' | 'ALL_GROUP_MEMBERS' | 'CUSTOM_MEMBERS';
        }
        interface UpdateResponse {
            /** The unique ID of a mail group */
            mailgroup_id?: string;
            /** The mail group's email address */
            email?: string;
            /** The mail group's display name */
            name?: string;
            /** The mail group's description */
            description?: string;
            /** The number of mail group's direct members */
            direct_members_count?: string;
            /** Value is true if this mail group has external member */
            include_external_member?: boolean;
            /** Value is true if all company members are in this mail group */
            include_all_company_member?: boolean;
            /**
             * Who can send mail to this mail group. Possible values are:
             * - ANYONE: Any Internet user can send mail to this mail group
             * - ALL_INTERNAL_USERS: Anyone in the team can send mail to this mail group
             * - ALL_GROUP_MEMBERS: Any group member can send mail to this mail group
             * - CUSTOM_MEMBERS: Only custom members can send mail to this mail group, define in mailgroup.permission_members resoure
             */
            who_can_send_mail?: 'ANYONE' | 'ALL_INTERNAL_USERS' | 'ALL_GROUP_MEMBERS' | 'CUSTOM_MEMBERS';
        }
        interface GetResponse {
            /** The unique ID of a mail group */
            mailgroup_id?: string;
            /** The mail group's email address */
            email?: string;
            /** The mail group's display name */
            name?: string;
            /** The mail group's description */
            description?: string;
            /** The number of mail group's direct members */
            direct_members_count?: string;
            /** Value is true if this mail group has external member */
            include_external_member?: boolean;
            /** Value is true if all company members are in this mail group */
            include_all_company_member?: boolean;
            /**
             * Who can send mail to this mail group. Possible values are:
             * - ANYONE: Any Internet user can send mail to this mail group
             * - ALL_INTERNAL_USERS: Anyone in the team can send mail to this mail group
             * - ALL_GROUP_MEMBERS: Any group member can send mail to this mail group
             * - CUSTOM_MEMBERS: Only custom members can send mail to this mail group, define in mailgroup.permission_members resoure
             */
            who_can_send_mail?: 'ANYONE' | 'ALL_INTERNAL_USERS' | 'ALL_GROUP_MEMBERS' | 'CUSTOM_MEMBERS';
        }
        interface ListQuery extends Pagination {
            /** 邮件组管理员用户ID，用于获取该用户有管理权限的邮件组 */
            manager_user_id?: string;
            /** 此次调用中使用的用户ID的类型 */
            user_id_type?: 'user_id' | 'union_id' | 'open_id';
        }
        namespace Manager {
            interface Methods {
                /**
                 * 批量创建邮件组管理员
                 * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/mail-v1/mailgroup-manager/batch_create
                 */
                batchCreate(mailgroup_id: string, body: BatchCreateRequest, query?: BatchCreateQuery): Promise<void>;
                /**
                 * 批量删除邮件组管理员
                 * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/mail-v1/mailgroup-manager/batch_delete
                 */
                batchDelete(mailgroup_id: string, body: BatchDeleteRequest, query?: BatchDeleteQuery): Promise<void>;
                /**
                 * 批量获取邮件组管理员
                 * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/mail-v1/mailgroup-manager/list
                 */
                list(mailgroup_id: string, query?: ListQuery): Paginated<Lark.MailgroupManager>;
            }
            interface BatchCreateRequest {
                /** 邮件组管理员列表 */
                mailgroup_manager_list?: Lark.MailgroupManager[];
            }
            interface BatchCreateQuery {
                /** 此次调用中使用的用户ID的类型 */
                user_id_type?: 'user_id' | 'union_id' | 'open_id';
            }
            interface BatchDeleteRequest {
                /** 邮件组管理员列表 */
                mailgroup_manager_list?: Lark.MailgroupManager[];
            }
            interface BatchDeleteQuery {
                /** 此次调用中使用的用户ID的类型 */
                user_id_type?: 'user_id' | 'union_id' | 'open_id';
            }
            interface ListQuery extends Pagination {
                /** 此次调用中使用的用户ID的类型 */
                user_id_type?: 'user_id' | 'union_id' | 'open_id';
            }
        }
        namespace Member {
            interface Methods {
                /**
                 * 创建邮件组成员
                 * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/mail-v1/mailgroup-member/create
                 */
                create(mailgroup_id: string, body: CreateRequest, query?: CreateQuery): Promise<CreateResponse>;
                /**
                 * 删除邮件组成员
                 * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/mail-v1/mailgroup-member/delete
                 */
                delete(mailgroup_id: string, member_id: string): Promise<void>;
                /**
                 * 查询指定邮件组成员
                 * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/mail-v1/mailgroup-member/get
                 */
                get(mailgroup_id: string, member_id: string, query?: GetQuery): Promise<GetResponse>;
                /**
                 * 获取所有邮件组成员
                 * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/mail-v1/mailgroup-member/list
                 */
                list(mailgroup_id: string, query?: ListQuery): Paginated<Lark.MailgroupMember>;
                /**
                 * 批量创建邮件组成员
                 * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/mail-v1/mailgroup-member/batch_create
                 */
                batchCreate(mailgroup_id: string, body: BatchCreateRequest, query?: BatchCreateQuery): Promise<BatchCreateResponse>;
                /**
                 * 批量删除邮件组成员
                 * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/mail-v1/mailgroup-member/batch_delete
                 */
                batchDelete(mailgroup_id: string, body: BatchDeleteRequest): Promise<void>;
            }
            interface CreateRequest {
                /** The member's email address. Value is valid when type is one of USER/EXTERNAL_USER/MAIL_GROUP/PUBLIC_MAILBOX/OTHER_MEMBER */
                email?: string;
                /** The member's user id. Value is valid when type is USER */
                user_id?: string;
                /** The member's department id. Value is valid when type is DEPARTMENT */
                department_id?: string;
                /**
                 * The type of member. Possible values are:
                 * - USER: internal user in the team
                 * - DEPARTMENT: member is a department
                 * - COMPANY: member is the company
                 * - EXTERNAL_USER: internet user outside the organization
                 * - MAIL_GROUP: member is another mail group
                 * - PUBLIC_MAILBOX: member is a public mailbox
                 * - OTHER_MEMBER: other internal member
                 */
                type?: 'USER' | 'DEPARTMENT' | 'COMPANY' | 'EXTERNAL_USER' | 'MAIL_GROUP' | 'PUBLIC_MAILBOX' | 'OTHER_MEMBER';
            }
            interface CreateQuery {
                /** 此次调用中使用的用户ID的类型 */
                user_id_type?: 'user_id' | 'union_id' | 'open_id';
                /** 此次调用中使用的部门ID的类型 */
                department_id_type?: 'department_id' | 'open_department_id';
            }
            interface CreateResponse {
                /** The unique ID of a member in this mail group */
                member_id?: string;
                /** The member's email address. Value is valid when type is one of USER/EXTERNAL_USER/MAIL_GROUP/PUBLIC_MAILBOX/OTHER_MEMBER */
                email?: string;
                /** The member's user id. Value is valid when type is USER */
                user_id?: string;
                /** The member's department id. Value is valid when type is DEPARTMENT */
                department_id?: string;
                /**
                 * The type of member. Possible values are:
                 * - USER: internal user in the team
                 * - DEPARTMENT: member is a department
                 * - COMPANY: member is the company
                 * - EXTERNAL_USER: internet user outside the organization
                 * - MAIL_GROUP: member is another mail group
                 * - PUBLIC_MAILBOX: member is a public mailbox
                 * - OTHER_MEMBER: other internal member
                 */
                type?: 'USER' | 'DEPARTMENT' | 'COMPANY' | 'EXTERNAL_USER' | 'MAIL_GROUP' | 'PUBLIC_MAILBOX' | 'OTHER_MEMBER';
            }
            interface GetQuery {
                /** 此次调用中使用的用户ID的类型 */
                user_id_type?: 'user_id' | 'union_id' | 'open_id';
                /** 此次调用中使用的部门ID的类型 */
                department_id_type?: 'department_id' | 'open_department_id';
            }
            interface GetResponse {
                /** The unique ID of a member in this mail group */
                member_id?: string;
                /** The member's email address. Value is valid when type is one of USER/EXTERNAL_USER/MAIL_GROUP/PUBLIC_MAILBOX/OTHER_MEMBER */
                email?: string;
                /** The member's user id. Value is valid when type is USER */
                user_id?: string;
                /** The member's department id. Value is valid when type is DEPARTMENT */
                department_id?: string;
                /**
                 * The type of member. Possible values are:
                 * - USER: internal user in the team
                 * - DEPARTMENT: member is a department
                 * - COMPANY: member is the company
                 * - EXTERNAL_USER: internet user outside the organization
                 * - MAIL_GROUP: member is another mail group
                 * - PUBLIC_MAILBOX: member is a public mailbox
                 * - OTHER_MEMBER: other internal member
                 */
                type?: 'USER' | 'DEPARTMENT' | 'COMPANY' | 'EXTERNAL_USER' | 'MAIL_GROUP' | 'PUBLIC_MAILBOX' | 'OTHER_MEMBER';
            }
            interface ListQuery extends Pagination {
                /** 此次调用中使用的用户ID的类型 */
                user_id_type?: 'user_id' | 'union_id' | 'open_id';
                /** 此次调用中使用的部门ID的类型 */
                department_id_type?: 'department_id' | 'open_department_id';
            }
            interface BatchCreateRequest {
                /** 本次添加的邮件组成员列表 */
                items?: Lark.MailgroupMember[];
            }
            interface BatchCreateQuery {
                /** 此次调用中使用的用户ID的类型 */
                user_id_type?: 'user_id' | 'union_id' | 'open_id';
                /** 此次调用中使用的部门ID的类型 */
                department_id_type?: 'department_id' | 'open_department_id';
            }
            interface BatchCreateResponse {
                /** 添加成功后的邮件组成员信息列表 */
                items?: Lark.MailgroupMember[];
            }
            interface BatchDeleteRequest {
                /** 本次调用删除的成员ID列表 */
                member_id_list?: string[];
            }
        }
        namespace Alias {
            interface Methods {
                /**
                 * 创建邮件组别名
                 * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/mail-v1/mailgroup-alias/create
                 */
                create(mailgroup_id: string, body: CreateRequest): Promise<CreateResponse>;
                /**
                 * 删除邮件组别名
                 * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/mail-v1/mailgroup-alias/delete
                 */
                delete(mailgroup_id: string, alias_id: string): Promise<void>;
                /**
                 * 获取邮件组所有别名
                 * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/mail-v1/mailgroup-alias/list
                 */
                list(mailgroup_id: string): Promise<ListResponse>;
            }
            interface CreateRequest {
                /** 邮箱别名 */
                email_alias?: string;
            }
            interface CreateResponse {
                /** 邮件组别名 */
                mailgroup_alias?: Lark.EmailAlias;
            }
            interface ListResponse {
                /** 邮件组别名 */
                items?: Lark.EmailAlias[];
            }
        }
        namespace PermissionMember {
            interface Methods {
                /**
                 * 创建邮件组权限成员
                 * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/mail-v1/mailgroup-permission_member/create
                 */
                create(mailgroup_id: string, body: CreateRequest, query?: CreateQuery): Promise<CreateResponse>;
                /**
                 * 删除邮件组权限成员
                 * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/mail-v1/mailgroup-permission_member/delete
                 */
                delete(mailgroup_id: string, permission_member_id: string): Promise<void>;
                /**
                 * 获取邮件组权限成员
                 * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/mail-v1/mailgroup-permission_member/get
                 */
                get(mailgroup_id: string, permission_member_id: string, query?: GetQuery): Promise<GetResponse>;
                /**
                 * 批量获取邮件组权限成员
                 * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/mail-v1/mailgroup-permission_member/list
                 */
                list(mailgroup_id: string, query?: ListQuery): Paginated<Lark.MailgroupPermissionMember>;
                /**
                 * 批量创建邮件组权限成员
                 * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/mail-v1/mailgroup-permission_member/batch_create
                 */
                batchCreate(mailgroup_id: string, body: BatchCreateRequest, query?: BatchCreateQuery): Promise<BatchCreateResponse>;
                /**
                 * 批量删除邮件组权限成员
                 * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/mail-v1/mailgroup-permission_member/batch_delete
                 */
                batchDelete(mailgroup_id: string, body: BatchDeleteRequest): Promise<void>;
            }
            interface CreateRequest {
                /** The member's user id. Value is valid when type is USER */
                user_id?: string;
                /** The member's department id. Value is valid when type is DEPARTMENT */
                department_id?: string;
                /** The member's email address. Value is valid when type is MAIL_GROUP/PUBLIC_MAILBOX */
                email?: string;
                /**
                 * The type of member. Possible values are:
                 * - USER: internal user in the team
                 * - DEPARTMENT: member is a department
                 */
                type?: 'USER' | 'DEPARTMENT' | 'MAIL_GROUP' | 'PUBLIC_MAILBOX';
            }
            interface CreateQuery {
                /** 此次调用中使用的用户ID的类型 */
                user_id_type?: 'user_id' | 'union_id' | 'open_id';
                /** 此次调用中使用的部门ID的类型 */
                department_id_type?: 'department_id' | 'open_department_id';
            }
            interface CreateResponse {
                /** The unique ID of a member in this permission group */
                permission_member_id?: string;
                /** The member's user id. Value is valid when type is USER */
                user_id?: string;
                /** The member's department id. Value is valid when type is DEPARTMENT */
                department_id?: string;
                /** The member's email address. Value is valid when type is MAIL_GROUP/PUBLIC_MAILBOX */
                email?: string;
                /**
                 * The type of member. Possible values are:
                 * - USER: internal user in the team
                 * - DEPARTMENT: member is a department
                 */
                type?: 'USER' | 'DEPARTMENT' | 'MAIL_GROUP' | 'PUBLIC_MAILBOX';
            }
            interface GetQuery {
                /** 此次调用中使用的用户ID的类型 */
                user_id_type?: 'user_id' | 'union_id' | 'open_id';
                /** 此次调用中使用的部门ID的类型 */
                department_id_type?: 'department_id' | 'open_department_id';
            }
            interface GetResponse {
                /** The unique ID of a member in this permission group */
                permission_member_id?: string;
                /** The member's user id. Value is valid when type is USER */
                user_id?: string;
                /** The member's department id. Value is valid when type is DEPARTMENT */
                department_id?: string;
                /** The member's email address. Value is valid when type is MAIL_GROUP/PUBLIC_MAILBOX */
                email?: string;
                /**
                 * The type of member. Possible values are:
                 * - USER: internal user in the team
                 * - DEPARTMENT: member is a department
                 */
                type?: 'USER' | 'DEPARTMENT' | 'MAIL_GROUP' | 'PUBLIC_MAILBOX';
            }
            interface ListQuery extends Pagination {
                /** 此次调用中使用的用户ID的类型 */
                user_id_type?: 'user_id' | 'union_id' | 'open_id';
                /** 此次调用中使用的部门ID的类型 */
                department_id_type?: 'department_id' | 'open_department_id';
            }
            interface BatchCreateRequest {
                /** 本次添加的邮件组权限成员列表 */
                items?: Lark.MailgroupPermissionMember[];
            }
            interface BatchCreateQuery {
                /** 此次调用中使用的用户ID的类型 */
                user_id_type?: 'user_id' | 'union_id' | 'open_id';
                /** 此次调用中使用的部门ID的类型 */
                department_id_type?: 'department_id' | 'open_department_id';
            }
            interface BatchCreateResponse {
                /** 添加成功后的邮件组权限成员信息列表 */
                items?: Lark.MailgroupPermissionMember[];
            }
            interface BatchDeleteRequest {
                /** 本次调用删除的权限成员ID列表 */
                permission_member_id_list: string[];
            }
        }
    }
    namespace PublicMailbox {
        interface Methods {
            member: Member.Methods;
            alias: Alias.Methods;
            /**
             * 创建公共邮箱
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/mail-v1/public_mailbox/create
             */
            create(body: CreateRequest): Promise<CreateResponse>;
            /**
             * 修改公共邮箱部分信息
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/mail-v1/public_mailbox/patch
             */
            patch(public_mailbox_id: string, body: PatchRequest): Promise<PatchResponse>;
            /**
             * 修改公共邮箱全部信息
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/mail-v1/public_mailbox/update
             */
            update(public_mailbox_id: string, body: UpdateRequest): Promise<UpdateResponse>;
            /**
             * 查询指定公共邮箱
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/mail-v1/public_mailbox/get
             */
            get(public_mailbox_id: string): Promise<GetResponse>;
            /**
             * 查询所有公共邮箱
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/mail-v1/public_mailbox/list
             */
            list(query?: Pagination): Paginated<Lark.PublicMailbox>;
            /**
             * 将公共邮箱移至回收站
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/mail-v1/public_mailbox/remove_to_recycle_bin
             */
            removeToRecycleBin(public_mailbox_id: string, body: RemoveToRecycleBinRequest): Promise<void>;
            /**
             * 永久删除公共邮箱
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/mail-v1/public_mailbox/delete
             */
            delete(public_mailbox_id: string): Promise<void>;
        }
        interface CreateRequest {
            /** The public mailbox's email address */
            email?: string;
            /** The public mailbox's display name */
            name?: string;
            /** 数据驻留地 */
            geo?: string;
        }
        interface CreateResponse {
            /** The unique ID of a public mailbox */
            public_mailbox_id?: string;
            /** The public mailbox's email address */
            email?: string;
            /** The public mailbox's display name */
            name?: string;
            /** 数据驻留地 */
            geo?: string;
        }
        interface PatchRequest {
            /** The public mailbox's new primary email address */
            email?: string;
            /** The public mailbox's display name */
            name?: string;
        }
        interface PatchResponse {
            /** The unique ID of a public mailbox */
            public_mailbox_id?: string;
            /** The public mailbox's email address */
            email?: string;
            /** The public mailbox's display name */
            name?: string;
        }
        interface UpdateRequest {
            /** The public mailbox's new primary email address */
            email?: string;
            /** The public mailbox's display name */
            name?: string;
        }
        interface UpdateResponse {
            /** The unique ID of a public mailbox */
            public_mailbox_id?: string;
            /** The public mailbox's email address */
            email?: string;
            /** The public mailbox's display name */
            name?: string;
        }
        interface GetResponse {
            /** The unique ID of a public mailbox */
            public_mailbox_id?: string;
            /** The public mailbox's email address */
            email?: string;
            /** The public mailbox's display name */
            name?: string;
            /** 数据驻留地 */
            geo?: string;
        }
        interface RemoveToRecycleBinRequest {
            /** 接收删除邮件的邮箱地址，不填则删除该公共邮箱的邮件 */
            to_mail_address?: string;
        }
        namespace Member {
            interface Methods {
                /**
                 * 添加公共邮箱成员
                 * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/mail-v1/public_mailbox-member/create
                 */
                create(public_mailbox_id: string, body: CreateRequest, query?: CreateQuery): Promise<CreateResponse>;
                /**
                 * 删除公共邮箱单个成员
                 * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/mail-v1/public_mailbox-member/delete
                 */
                delete(public_mailbox_id: string, member_id: string): Promise<void>;
                /**
                 * 删除公共邮箱所有成员
                 * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/mail-v1/public_mailbox-member/clear
                 */
                clear(public_mailbox_id: string): Promise<void>;
                /**
                 * 查询指定公共邮箱成员信息
                 * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/mail-v1/public_mailbox-member/get
                 */
                get(public_mailbox_id: string, member_id: string, query?: GetQuery): Promise<GetResponse>;
                /**
                 * 查询所有公共邮箱成员信息
                 * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/mail-v1/public_mailbox-member/list
                 */
                list(public_mailbox_id: string, query?: ListQuery): Paginated<Lark.PublicMailboxMember>;
                /**
                 * 批量添加公共邮箱成员
                 * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/mail-v1/public_mailbox-member/batch_create
                 */
                batchCreate(public_mailbox_id: string, body: BatchCreateRequest, query?: BatchCreateQuery): Promise<BatchCreateResponse>;
                /**
                 * 批量删除公共邮箱成员
                 * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/mail-v1/public_mailbox-member/batch_delete
                 */
                batchDelete(public_mailbox_id: string, body: BatchDeleteRequest): Promise<void>;
            }
            interface CreateRequest {
                /** The member's user id. Value is valid when type is USER */
                user_id?: string;
                /**
                 * The type of member. Possible values are:
                 * - USER: internal user in the team
                 */
                type?: 'USER';
            }
            interface CreateQuery {
                /** 此次调用中使用的用户ID的类型 */
                user_id_type?: 'user_id' | 'union_id' | 'open_id';
            }
            interface CreateResponse {
                /** The unique ID of a member in this public mailbox */
                member_id?: string;
                /** The member's user id. Value is valid when type is USER */
                user_id?: string;
                /**
                 * The type of member. Possible values are:
                 * - USER: internal user in the team
                 */
                type?: 'USER';
            }
            interface GetQuery {
                /** 此次调用中使用的用户ID的类型 */
                user_id_type?: 'user_id' | 'union_id' | 'open_id';
            }
            interface GetResponse {
                /** The unique ID of a member in this public mailbox */
                member_id?: string;
                /** The member's user id. Value is valid when type is USER */
                user_id?: string;
                /**
                 * The type of member. Possible values are:
                 * - USER: internal user in the team
                 */
                type?: 'USER';
            }
            interface ListQuery extends Pagination {
                /** 此次调用中使用的用户ID的类型 */
                user_id_type?: 'user_id' | 'union_id' | 'open_id';
            }
            interface BatchCreateRequest {
                /** 本次调用添加的公共邮箱成员列表 */
                items: Lark.PublicMailboxMember[];
            }
            interface BatchCreateQuery {
                /** 此次调用中使用的用户ID的类型 */
                user_id_type?: 'user_id' | 'union_id' | 'open_id';
            }
            interface BatchCreateResponse {
                /** 添加成功后的公共邮箱成员信息列表 */
                items?: Lark.PublicMailboxMember[];
            }
            interface BatchDeleteRequest {
                /** 本次调用删除的公共邮箱成员ID列表 */
                member_id_list: string[];
            }
        }
        namespace Alias {
            interface Methods {
                /**
                 * 创建公共邮箱别名
                 * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/mail-v1/public_mailbox-alias/create
                 */
                create(public_mailbox_id: string, body: CreateRequest): Promise<CreateResponse>;
                /**
                 * 删除公共邮箱别名
                 * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/mail-v1/public_mailbox-alias/delete
                 */
                delete(public_mailbox_id: string, alias_id: string): Promise<void>;
                /**
                 * 查询公共邮箱的所有别名
                 * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/mail-v1/public_mailbox-alias/list
                 */
                list(public_mailbox_id: string): Promise<ListResponse>;
            }
            interface CreateRequest {
                /** 邮箱别名 */
                email_alias?: string;
            }
            interface CreateResponse {
                /** 公共邮箱别名 */
                public_mailbox_alias?: Lark.EmailAlias;
            }
            interface ListResponse {
                /** 公共邮箱别名 */
                items?: Lark.EmailAlias[];
            }
        }
    }
    namespace User {
        interface Methods {
            /**
             * 查询邮箱地址状态
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/mail-v1/user/query
             */
            query(body: QueryRequest): Promise<QueryResponse>;
        }
        interface QueryRequest {
            /** 需要查询的邮箱地址列表 */
            email_list: string[];
        }
        interface QueryResponse {
            /** 邮箱地址返回 */
            user_list?: Lark.User[];
        }
    }
}
