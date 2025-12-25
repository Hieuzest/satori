import * as Lark from '.';
import { Paginated, Pagination } from '../internal';
declare module '../internal' {
    interface Internal {
        helpdesk: Helpdesk.Methods;
    }
}
export declare namespace Helpdesk {
    interface Methods {
        agent: Agent.Methods;
        agentSchedule: AgentSchedule.Methods;
        agentSkill: AgentSkill.Methods;
        agentSkillRule: AgentSkillRule.Methods;
        ticket: Ticket.Methods;
        bot: Bot.Methods;
        ticketCustomizedField: TicketCustomizedField.Methods;
        faq: Faq.Methods;
        category: Category.Methods;
        notification: Notification.Methods;
        event: Event.Methods;
    }
    namespace Agent {
        interface Methods {
            schedules: Schedules.Methods;
            /**
             * 更新客服信息
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/helpdesk-v1/agent/patch
             */
            patch(agent_id: string, body: PatchRequest): Promise<void>;
            /**
             * 获取客服邮箱
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/helpdesk-v1/agent/agent_email
             */
            agentEmail(): Promise<AgentEmailResponse>;
        }
        interface PatchRequest {
            /** agent status */
            status?: number;
        }
        interface AgentEmailResponse {
            /** agent emails */
            agents?: string;
        }
        namespace Schedules {
            interface Methods {
                /**
                 * 删除客服工作日程
                 * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/helpdesk-v1/agent-schedules/delete
                 */
                delete(agent_id: string): Promise<void>;
                /**
                 * 更新客服工作日程
                 * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/helpdesk-v1/agent-schedules/patch
                 */
                patch(agent_id: string, body: PatchRequest): Promise<void>;
                /**
                 * 查询指定客服工作日程
                 * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/helpdesk-v1/agent-schedules/get
                 */
                get(agent_id: string): Promise<GetResponse>;
            }
            interface PatchRequest {
                /** 工作日程列表 */
                agent_schedule?: Lark.AgentScheduleUpdateInfo;
            }
            interface GetResponse {
                /** schedules of an agent */
                agent_schedule?: Lark.AgentSchedule;
            }
        }
    }
    namespace AgentSchedule {
        interface Methods {
            /**
             * 创建客服工作日程
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/helpdesk-v1/agent_schedule/create
             */
            create(body: CreateRequest): Promise<void>;
            /**
             * 查询全部客服工作日程
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/helpdesk-v1/agent_schedule/list
             */
            list(query?: ListQuery): Promise<ListResponse>;
        }
        interface CreateRequest {
            /** 新客服日程 */
            agent_schedules?: Lark.AgentScheduleUpdateInfo[];
        }
        interface ListQuery {
            /** 筛选条件, 1 - online客服, 2 - offline(手动)客服, 3 - off duty(下班)客服, 4 - 移除客服 */
            status: number[];
        }
        interface ListResponse {
            /** schedule of all agent */
            agent_schedules?: Lark.AgentSchedule[];
        }
    }
    namespace AgentSkill {
        interface Methods {
            /**
             * 创建客服技能
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/helpdesk-v1/agent_skill/create
             */
            create(body: CreateRequest): Promise<CreateResponse>;
            /**
             * 删除客服技能
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/helpdesk-v1/agent_skill/delete
             */
            delete(agent_skill_id: string): Promise<void>;
            /**
             * 更新客服技能
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/helpdesk-v1/agent_skill/patch
             */
            patch(agent_skill_id: string, body: PatchRequest): Promise<void>;
            /**
             * 查询指定客服技能
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/helpdesk-v1/agent_skill/get
             */
            get(agent_skill_id: string): Promise<GetResponse>;
            /**
             * 查询全部客服技能
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/helpdesk-v1/agent_skill/list
             */
            list(): Promise<ListResponse>;
        }
        interface CreateRequest {
            /** 技能名 */
            name?: string;
            /** 技能rules */
            rules?: Lark.AgentSkillRule[];
            /** 客服 ids */
            agent_ids?: string[];
        }
        interface CreateResponse {
            agent_skill_id?: string;
        }
        interface PatchRequest {
            /** 更新技能 */
            agent_skill?: Lark.AgentSkill;
        }
        interface GetResponse {
            /** agent skill */
            agent_skill?: Lark.AgentSkill;
        }
        interface ListResponse {
            /** list of agent groups */
            agent_skills?: Lark.AgentSkill[];
        }
    }
    namespace AgentSkillRule {
        interface Methods {
            /**
             * 获取客服技能列表
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/helpdesk-v1/agent_skill_rule/list
             */
            list(): Promise<ListResponse>;
        }
        interface ListResponse {
            /** all rules for agent skill */
            rules?: Lark.AgentSkillRule[];
        }
    }
    namespace Ticket {
        interface Methods {
            message: Message.Methods;
            /**
             * 创建服务台对话
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/helpdesk-v1/ticket/start_service
             */
            startService(body: StartServiceRequest): Promise<StartServiceResponse>;
            /**
             * 查询指定工单详情
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/helpdesk-v1/ticket/get
             */
            get(ticket_id: string): Promise<GetResponse>;
            /**
             * 更新工单详情
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/helpdesk-v1/ticket/update
             */
            update(ticket_id: string, body: UpdateRequest): Promise<void>;
            /**
             * 查询全部工单详情
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/helpdesk-v1/ticket/list
             */
            list(query?: ListQuery): Promise<ListResponse>;
            /**
             * 获取工单内图像
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/helpdesk-v1/ticket/ticket_image
             */
            ticketImage(query?: TicketImageQuery): Promise<ArrayBuffer>;
            /**
             * 回复用户在工单里的提问
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/helpdesk-v1/ticket/answer_user_query
             */
            answerUserQuery(ticket_id: string, body: AnswerUserQueryRequest): Promise<void>;
            /**
             * 获取服务台自定义字段
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/helpdesk-v1/ticket/customized_fields
             */
            customizedFields(query?: CustomizedFieldsQuery): Promise<CustomizedFieldsResponse>;
        }
        interface StartServiceRequest {
            /** 是否直接进入人工(若appointed_agents填写了，该值为必填) */
            human_service?: boolean;
            /** 客服 open ids (获取方式参考[获取单个用户信息](https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/contact-v3/user/get))，human_service需要为true */
            appointed_agents?: string[];
            /** 用户 open id,(获取方式参考[获取单个用户信息](https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/contact-v3/user/get)) */
            open_id: string;
            /** 工单来源自定义信息，长度限制1024字符，如设置，[获取工单详情](https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/helpdesk-v1/ticket/get)会返回此信息 */
            customized_info?: string;
        }
        interface StartServiceResponse {
            /** chat id */
            chat_id: string;
        }
        interface GetResponse {
            /** ticket detail */
            ticket?: Lark.Ticket;
        }
        interface UpdateRequest {
            /** new status, 1: 已创建, 2: 处理中, 3: 排队中, 5: 待定, 50: 机器人关闭工单, 51: 关闭工单 */
            status?: number;
            /** 新标签名 */
            tag_names?: string[];
            /** 新评论 */
            comment?: string;
            /** 自定义字段 */
            customized_fields?: Lark.CustomizedFieldDisplayItem[];
            /** ticket stage */
            ticket_type?: number;
            /** 工单是否解决，1: 未解决, 2: 已解决 */
            solved?: number;
            /** 工单来源渠道ID */
            channel?: number;
        }
        interface ListQuery {
            /** 搜索条件：工单ID */
            ticket_id?: string;
            /** 搜索条件: 客服id */
            agent_id?: string;
            /** 搜索条件: 关单客服id */
            closed_by_id?: string;
            /** 搜索条件: 工单类型 1:bot 2:人工 */
            type?: number;
            /** 搜索条件: 工单渠道 */
            channel?: number;
            /** 搜索条件: 工单是否解决 1:没解决 2:已解决 */
            solved?: number;
            /** 搜索条件: 工单评分 */
            score?: number;
            /** 搜索条件: 工单状态列表 */
            status_list?: number[];
            /** 搜索条件: 用户名称 */
            guest_name?: string;
            /** 搜索条件: 用户id */
            guest_id?: string;
            /** 搜索条件: 用户标签列表 */
            tags?: string[];
            /** 页数, 从1开始, 默认为1 */
            page?: number;
            /** 当前页大小，最大为200， 默认为20。分页查询最多累计返回一万条数据，超过一万条请更改查询条件，推荐通过时间查询。 */
            page_size?: number;
            /** 搜索条件: 工单创建起始时间 ms (也需要填上create_time_end)，相当于>=create_time_start */
            create_time_start?: number;
            /** 搜索条件: 工单创建结束时间 ms (也需要填上create_time_start)，相当于<=create_time_end */
            create_time_end?: number;
            /** 搜索条件: 工单修改起始时间 ms (也需要填上update_time_end) */
            update_time_start?: number;
            /** 搜索条件: 工单修改结束时间 ms(也需要填上update_time_start) */
            update_time_end?: number;
        }
        interface ListResponse {
            /** the total count */
            total?: number;
            tickets?: Lark.Ticket[];
        }
        interface TicketImageQuery {
            /** 工单ID */
            ticket_id: string;
            /**
             * 消息ID
             * [查询消息ID](https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/helpdesk-v1/ticket-message/list)
             */
            msg_id: string;
            /** index，当消息类型为post时，需指定图片index，index从0开始。当消息类型为img时，无需index */
            index?: number;
        }
        interface AnswerUserQueryRequest {
            /** 事件ID,可从订阅事件中提取 */
            event_id: string;
            /** faq结果列表 */
            faqs?: Lark.UserQueryFaqInfo[];
        }
        interface CustomizedFieldsQuery {
            /** visible only */
            visible_only?: boolean;
        }
        interface CustomizedFieldsResponse {
            /** user customized fields */
            user_customized_fields?: Lark.UserCustomizedField[];
            /** ticket customized fields */
            ticket_customized_fields?: Lark.TicketCustomizedField[];
        }
        namespace Message {
            interface Methods {
                /**
                 * 发送工单消息
                 * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/helpdesk-v1/ticket-message/create
                 */
                create(ticket_id: string, body: CreateRequest): Promise<CreateResponse>;
                /**
                 * 获取工单消息详情
                 * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/helpdesk-v1/ticket-message/list
                 */
                list(ticket_id: string, query?: ListQuery): Promise<ListResponse>;
            }
            interface CreateRequest {
                /** 消息类型；text：纯文本；post：富文本 */
                msg_type: string;
                /**
                 * - 纯文本，参考[发送文本消息](https://open.feishu.cn/document/ukTMukTMukTM/uUjNz4SN2MjL1YzM)中的content；
                 * - 富文本，参考[发送富文本消息](https://open.feishu.cn/document/ukTMukTMukTM/uMDMxEjLzATMx4yMwETM)中的content
                 */
                content: string;
            }
            interface CreateResponse {
                /** chat消息open ID */
                message_id?: string;
            }
            interface ListQuery {
                /** 起始时间 */
                time_start?: number;
                /** 结束时间 */
                time_end?: number;
                /** 页数ID */
                page?: number;
                /** 消息数量，最大200，默认20 */
                page_size?: number;
            }
            interface ListResponse {
                /** list of ticket messages */
                messages?: Lark.TicketMessage[];
                /** total number of messages */
                total?: number;
            }
        }
    }
    namespace Bot {
        interface Methods {
            message: Message.Methods;
        }
        namespace Message {
            interface Methods {
                /**
                 * 服务台机器人向工单绑定的群内发送消息
                 * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/helpdesk-v1/bot-message/create
                 */
                create(body: CreateRequest, query?: CreateQuery): Promise<CreateResponse>;
            }
            interface CreateRequest {
                /** 消息类型 */
                msg_type: 'text' | 'post' | 'image' | 'interactive';
                /** 消息内容 */
                content: string;
                /** 接收消息用户id */
                receiver_id: string;
                /** 接收消息方式，chat(服务台专属服务群)或user(服务台机器人私聊)。若选择专属服务群，用户有正在处理的工单将会发送失败。默认以chat方式发送。 */
                receive_type?: 'chat' | 'user';
            }
            interface CreateQuery {
                /** 此次调用中使用的用户ID的类型 */
                user_id_type?: 'user_id' | 'union_id' | 'open_id';
            }
            interface CreateResponse {
                message_id?: string;
            }
        }
    }
    namespace TicketCustomizedField {
        interface Methods {
            /**
             * 创建工单自定义字段
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/helpdesk-v1/ticket_customized_field/create-ticket-customized-field
             */
            create(body: CreateRequest): Promise<void>;
            /**
             * 删除工单自定义字段
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/helpdesk-v1/ticket_customized_field/delete
             */
            delete(ticket_customized_field_id: string): Promise<void>;
            /**
             * 更新工单自定义字段
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/helpdesk-v1/ticket_customized_field/update-ticket-customized-field
             */
            patch(ticket_customized_field_id: string, body: PatchRequest): Promise<void>;
            /**
             * 获取指定工单自定义字段
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/helpdesk-v1/ticket_customized_field/get-ticket-customized-field
             */
            get(ticket_customized_field_id: string): Promise<GetResponse>;
            /**
             * 获取全部工单自定义字段
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/helpdesk-v1/ticket_customized_field/list-ticket-customized-fields
             */
            list(body: ListRequest, query?: Pagination): Promise<ListResponse> & AsyncIterableIterator<Lark.TicketCustomizedField>;
        }
        interface CreateRequest {
            /** help desk id */
            helpdesk_id: string;
            /** key name */
            key_name: string;
            /** display name */
            display_name: string;
            /** the position of ticket customized field in the page */
            position: string;
            /** type of the field */
            field_type: string;
            /** description of the field */
            description: string;
            /** if the field is visible */
            visible: boolean;
            /** if the field is editable */
            editable: boolean;
            /** if the field is required */
            required: boolean;
            /** if the dropdown field supports multi-select */
            dropdown_allow_multiple?: boolean;
        }
        interface PatchRequest {
            /** display name */
            display_name?: string;
            /** the position of ticket customized field in the page */
            position?: string;
            /** description of the field */
            description?: string;
            /** if the field is visible */
            visible?: boolean;
            /** if the field is required */
            required?: boolean;
        }
        interface GetResponse {
            /** ticket customized field id */
            ticket_customized_field_id: string;
            /** help desk id */
            helpdesk_id: string;
            /** key name */
            key_name: string;
            /** display name */
            display_name: string;
            /** the position of ticket customized field in the page */
            position: string;
            /** type of the field */
            field_type: string;
            /** description of the field */
            description: string;
            /** if the field is visible */
            visible: boolean;
            /** if the field is editable */
            editable: boolean;
            /** if the field is required */
            required: boolean;
            /** the time when the field is created */
            created_at?: string;
            /** the time when the field is updated */
            updated_at?: string;
            /** the user who created the ticket customized field */
            created_by?: Lark.TicketUser;
            /** the user who recently updated the ticket customized field */
            updated_by?: Lark.TicketUser;
            /** if the dropdown field supports multi-select */
            dropdown_allow_multiple?: boolean;
        }
        interface ListRequest {
            /** 是否可见 */
            visible?: boolean;
        }
        interface ListResponse {
            /** whether there is more data */
            has_more?: boolean;
            /** the next page token */
            next_page_token?: string;
            /** all the ticket customized fields */
            items?: Lark.TicketCustomizedField[];
        }
    }
    namespace Faq {
        interface Methods {
            /**
             * 创建知识库
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/helpdesk-v1/faq/create
             */
            create(body: CreateRequest): Promise<CreateResponse>;
            /**
             * 删除知识库
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/helpdesk-v1/faq/delete
             */
            delete(id: string): Promise<void>;
            /**
             * 修改知识库
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/helpdesk-v1/faq/patch
             */
            patch(id: string, body: PatchRequest): Promise<void>;
            /**
             * 获取指定知识库详情
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/helpdesk-v1/faq/get
             */
            get(id: string): Promise<GetResponse>;
            /**
             * 获取全部知识库详情
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/helpdesk-v1/faq/list
             */
            list(query?: ListQuery): Promise<ListResponse> & AsyncIterableIterator<Lark.Faq>;
            /**
             * 获取知识库图像
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/helpdesk-v1/faq/faq_image
             */
            faqImage(id: string, image_key: string): Promise<ArrayBuffer>;
            /**
             * 搜索知识库
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/helpdesk-v1/faq/search
             */
            search(query?: SearchQuery): Paginated<Lark.Faq>;
        }
        interface CreateRequest {
            /** 知识库详情 */
            faq?: Lark.FaqCreateInfo;
        }
        interface CreateResponse {
            /** faq detail */
            faq?: Lark.Faq;
        }
        interface PatchRequest {
            /** 修改的知识库内容 */
            faq?: Lark.FaqUpdateInfo;
        }
        interface GetResponse {
            /** faq detail */
            faq?: Lark.Faq;
        }
        interface ListQuery extends Pagination {
            /** 知识库分类ID */
            category_id?: string;
            /** 搜索条件: 知识库状态 1:在线 0:删除，可恢复 2：删除，不可恢复 */
            status?: string;
            /** 搜索条件: 关键词，匹配问题标题，问题关键字，用户姓名 */
            search?: string;
        }
        interface ListResponse {
            /** if there's next page */
            has_more?: boolean;
            /** the next page token */
            page_token?: string;
            /** the page size */
            page_size?: number;
            /** the total count */
            total?: number;
            items?: Lark.Faq[];
        }
        interface SearchQuery extends Pagination {
            /**
             * 搜索query
             * ，query内容如果不是英文，包含中文空格等有两种编码策略：1. url编码 2. base64编码，同时加上base64=true参数
             */
            query: string;
            /** 是否转换为base64,输入true表示是，不填写表示否，中文需要转换为base64 */
            base64?: string;
        }
    }
    namespace Category {
        interface Methods {
            /**
             * 创建知识库分类
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/helpdesk-v1/category/create
             */
            create(body: CreateRequest): Promise<CreateResponse>;
            /**
             * 获取知识库分类
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/helpdesk-v1/category/get
             */
            get(id: string): Promise<GetResponse>;
            /**
             * 更新知识库分类详情
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/helpdesk-v1/category/patch
             */
            patch(id: string, body: PatchRequest): Promise<void>;
            /**
             * 删除知识库分类详情
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/helpdesk-v1/category/delete
             */
            delete(id: string): Promise<void>;
            /**
             * 获取全部知识库分类
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/helpdesk-v1/category/list-categories
             */
            list(query?: ListQuery): Promise<ListResponse>;
        }
        interface CreateRequest {
            /** category name */
            name: string;
            /** parent category id, if any */
            parent_id: string;
            /** category language */
            language?: string;
        }
        interface CreateResponse {
            /** category */
            category?: Lark.Category;
        }
        interface GetResponse {
            /** category id */
            category_id: string;
            /** category id, for backward compatibility */
            id: string;
            /** category name */
            name: string;
            /** helpdesk id */
            helpdesk_id: string;
            /** category language */
            language?: string;
        }
        interface PatchRequest {
            /** category name */
            name?: string;
            /** parent category id, if any */
            parent_id?: string;
        }
        interface ListQuery {
            /** 知识库分类语言 */
            lang?: string;
            /** 排序键。1: 根据知识库分类更新时间排序 */
            order_by?: number;
            /** 顺序。true: 正序；false：反序 */
            asc?: boolean;
        }
        interface ListResponse {
            /** list of categories */
            categories?: Lark.Category[];
        }
    }
    namespace Notification {
        interface Methods {
            /**
             * 创建推送
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/helpdesk-v1/notification/create
             */
            create(body: CreateRequest, query?: CreateQuery): Promise<CreateResponse>;
            /**
             * 更新推送
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/helpdesk-v1/notification/patch
             */
            patch(notification_id: string, body: PatchRequest, query?: PatchQuery): Promise<void>;
            /**
             * 查询推送
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/helpdesk-v1/notification/get
             */
            get(notification_id: string, query?: GetQuery): Promise<GetResponse>;
            /**
             * 预览推送
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/helpdesk-v1/notification/preview
             */
            preview(notification_id: string): Promise<void>;
            /**
             * 提交审核
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/helpdesk-v1/notification/submit_approve
             */
            submitApprove(notification_id: string, body: SubmitApproveRequest): Promise<SubmitApproveResponse>;
            /**
             * 取消审核
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/helpdesk-v1/notification/cancel_approve
             */
            cancelApprove(notification_id: string): Promise<void>;
            /**
             * 执行推送
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/helpdesk-v1/notification/execute_send
             */
            executeSend(notification_id: string, body: ExecuteSendRequest): Promise<void>;
            /**
             * 取消推送
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/helpdesk-v1/notification/cancel_send
             */
            cancelSend(notification_id: string, body: CancelSendRequest): Promise<void>;
        }
        interface CreateRequest {
            /** 唯一ID */
            id?: string;
            /** 任务名称 */
            job_name?: string;
            /** 0(草稿)、1(等待审批)、 2(审批未通过)、3(正在发送中)、4(发送完成)、5(等待设置发送时间)、6(取消发送)、7(新人入职执行发送)、8(等待倒计时发送) */
            status?: number;
            /** 创建人 */
            create_user?: Lark.NotificationUser;
            /** 创建时间（毫秒时间戳） */
            created_at?: string;
            /** 更新用户 */
            update_user?: Lark.NotificationUser;
            /** 更新时间（毫秒时间戳） */
            updated_at?: string;
            /** 目标推送用户 */
            target_user_count?: number;
            /** 已推送用户总数 */
            sent_user_count?: number;
            /** 已读用户总数 */
            read_user_count?: number;
            /** 推送任务触发时间（毫秒时间戳） */
            send_at?: string;
            /** 推送内容，详见：https://open.feishu.cn/tool/cardbuilder?from=howtoguide */
            push_content?: string;
            /** 0（定时推送：push_scope不能等于3） 1（新人入职推送：push_scope必须等于1或者3；new_staff_scope_type不能为空） */
            push_type?: number;
            /** 推送范围（服务台私信） 0：组织内全部成员（user_list和department_list必须为空） 1：不推送任何成员（user_list和department_list必须为空，chat_list不可为空） 2：推送到部分成员（user_list或department_list不能为空） 3：入职新人 以上四种状态，chat_list都相对独立，只有在推送范围为1时，必须需要设置chat_list */
            push_scope_type?: number;
            /** 新人入职范围类型（push_type为1时生效） 0：组织内所有新人 1：组织内特定的部门（new_staff_scope_department_list 字段不能为空） */
            new_staff_scope_type?: number;
            /** 新人入职生效部门列表 */
            new_staff_scope_department_list?: Lark.NotificationDepartment[];
            /** push推送到成员列表 */
            user_list?: Lark.NotificationUser[];
            /** push推送到的部门信息列表 */
            department_list?: Lark.NotificationDepartment[];
            /** push推送到的会话列表(群) */
            chat_list?: Lark.NotificationChat[];
            /** 预留扩展字段 */
            ext?: string;
        }
        interface CreateQuery {
            /** 此次调用中使用的用户ID的类型 */
            user_id_type?: 'user_id' | 'union_id' | 'open_id';
        }
        interface CreateResponse {
            /** 创建成功后的唯一id */
            notification_id?: string;
            /** 当前状态 */
            status?: number;
        }
        interface PatchRequest {
            /** 唯一ID */
            id?: string;
            /** 任务名称 */
            job_name?: string;
            /** 0(草稿)、1(等待审批)、 2(审批未通过)、3(正在发送中)、4(发送完成)、5(等待设置发送时间)、6(取消发送)、7(新人入职执行发送)、8(等待倒计时发送) */
            status?: number;
            /** 创建人 */
            create_user?: Lark.NotificationUser;
            /** 创建时间（毫秒时间戳） */
            created_at?: string;
            /** 更新用户 */
            update_user?: Lark.NotificationUser;
            /** 更新时间（毫秒时间戳） */
            updated_at?: string;
            /** 目标推送用户 */
            target_user_count?: number;
            /** 已推送用户总数 */
            sent_user_count?: number;
            /** 已读用户总数 */
            read_user_count?: number;
            /** 推送任务触发时间（毫秒时间戳） */
            send_at?: string;
            /** 推送内容，详见：https://open.feishu.cn/tool/cardbuilder?from=howtoguide */
            push_content?: string;
            /** 0（定时推送：push_scope不能等于3） 1（新人入职推送：push_scope必须等于1或者3；new_staff_scope_type不能为空） */
            push_type?: number;
            /** 推送范围（服务台私信） 0：组织内全部成员（user_list和department_list必须为空） 1：不推送任何成员（user_list和department_list必须为空，chat_list不可为空） 2：推送到部分成员（user_list或department_list不能为空） 3：入职新人 以上四种状态，chat_list都相对独立，只有在推送范围为1时，必须需要设置chat_list */
            push_scope_type?: number;
            /** 新人入职范围类型（push_type为1时生效） 0：组织内所有新人 1：组织内特定的部门（new_staff_scope_department_list 字段不能为空） */
            new_staff_scope_type?: number;
            /** 新人入职生效部门列表 */
            new_staff_scope_department_list?: Lark.NotificationDepartment[];
            /** push推送到成员列表 */
            user_list?: Lark.NotificationUser[];
            /** push推送到的部门信息列表 */
            department_list?: Lark.NotificationDepartment[];
            /** push推送到的会话列表(群) */
            chat_list?: Lark.NotificationChat[];
            /** 预留扩展字段 */
            ext?: string;
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
            /** push任务详情 */
            notification?: Lark.Notification;
            /** 审批链接 */
            approval_app_link?: string;
        }
        interface SubmitApproveRequest {
            /** 提交审批理由 */
            reason: string;
        }
        interface SubmitApproveResponse {
            /** 是否有权限创建或者管理审批流程 （有两种情况会导致没有权限： 1：用户没有安装服务台小程序，需要在https://app.feishu.cn/app/cli_9f9f8825d53b900d或者https://ftest.feishu.cn/admin/appCenter/manage/cli_9f9f8825d53b900d?lang=zh-CN 安装小程序 2：用户安装的服务台小程序版本过低） */
            has_access?: boolean;
        }
        interface ExecuteSendRequest {
            /** 发送时间戳(毫秒) */
            send_at: string;
        }
        interface CancelSendRequest {
            /** 是否召回已发送的消息,新人入职消息同样适用 */
            is_recall: boolean;
        }
    }
    namespace Event {
        interface Methods {
            /**
             * 订阅服务台事件
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/helpdesk-v1/event/subscribe
             */
            subscribe(body: SubscribeRequest): Promise<void>;
            /**
             * 取消订阅服务台事件
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/helpdesk-v1/event/unsubscribe
             */
            unsubscribe(body: UnsubscribeRequest): Promise<void>;
        }
        interface SubscribeRequest {
            /** 可订阅的事件列表 */
            events: Lark.Event[];
        }
        interface UnsubscribeRequest {
            /** event list to unsubscribe */
            events: Lark.Event[];
        }
    }
}
