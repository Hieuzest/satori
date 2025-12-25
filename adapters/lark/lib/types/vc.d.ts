import * as Lark from '.';
import { Paginated, Pagination } from '../internal';
declare module '../internal' {
    interface Internal {
        vc: Vc.Methods;
    }
}
export declare namespace Vc {
    interface Methods {
        reserve: Reserve.Methods;
        meeting: Meeting.Methods;
        report: Report.Methods;
        export: Export.Methods;
        roomLevel: RoomLevel.Methods;
        room: Room.Methods;
        scopeConfig: ScopeConfig.Methods;
        reserveConfig: ReserveConfig.Methods;
        meetingList: MeetingList.Methods;
        participantList: ParticipantList.Methods;
        participantQualityList: ParticipantQualityList.Methods;
        resourceReservationList: ResourceReservationList.Methods;
        alert: Alert.Methods;
        roomConfig: RoomConfig.Methods;
    }
    namespace Reserve {
        interface Methods {
            /**
             * 预约会议
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/vc-v1/reserve/apply
             */
            apply(body: ApplyRequest, query?: ApplyQuery): Promise<ApplyResponse>;
            /**
             * 删除预约
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/vc-v1/reserve/delete
             */
            delete(reserve_id: string): Promise<void>;
            /**
             * 更新预约
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/vc-v1/reserve/update
             */
            update(reserve_id: string, body: UpdateRequest, query?: UpdateQuery): Promise<UpdateResponse>;
            /**
             * 获取预约
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/vc-v1/reserve/get
             */
            get(reserve_id: string, query?: GetQuery): Promise<GetResponse>;
            /**
             * 获取活跃会议
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/vc-v1/reserve/get_active_meeting
             */
            getActiveMeeting(reserve_id: string, query?: GetActiveMeetingQuery): Promise<GetActiveMeetingResponse>;
        }
        interface ApplyRequest {
            /** 预约到期时间（unix时间，单位sec），多人会议必填 */
            end_time?: string;
            /** 指定会议归属人，使用tenant_access_token时生效且必传，使用user_access_token时不生效，必须指定为同租户下的合法lark用户 */
            owner_id?: string;
            /** 会议设置 */
            meeting_settings: Lark.ReserveMeetingSetting;
        }
        interface ApplyQuery {
            /** 此次调用中使用的用户ID的类型，默认使用open_id可不填 */
            user_id_type?: 'user_id' | 'union_id' | 'open_id';
        }
        interface ApplyResponse {
            reserve?: Lark.Reserve;
            reserve_correction_check_info?: Lark.ReserveCorrectionCheckInfo;
        }
        interface UpdateRequest {
            /** 预约到期时间（unix时间，单位sec） */
            end_time?: string;
            /** 会议设置 */
            meeting_settings?: Lark.ReserveMeetingSetting;
        }
        interface UpdateQuery {
            /** 此次调用中使用的用户ID的类型，默认使用open_id可不填 */
            user_id_type?: 'user_id' | 'union_id' | 'open_id';
        }
        interface UpdateResponse {
            reserve?: Lark.Reserve;
            reserve_correction_check_info?: Lark.ReserveCorrectionCheckInfo;
        }
        interface GetQuery {
            /** 此次调用中使用的用户ID的类型 */
            user_id_type?: 'user_id' | 'union_id' | 'open_id';
        }
        interface GetResponse {
            reserve?: Lark.Reserve;
        }
        interface GetActiveMeetingQuery {
            /** 是否需要参会人列表，默认为false */
            with_participants?: boolean;
            /** 此次调用中使用的用户ID的类型 */
            user_id_type?: 'user_id' | 'union_id' | 'open_id';
        }
        interface GetActiveMeetingResponse {
            meeting?: Lark.Meeting;
        }
    }
    namespace Meeting {
        interface Methods {
            recording: Recording.Methods;
            /**
             * 邀请参会人
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/vc-v1/meeting/invite
             */
            invite(meeting_id: string, body: InviteRequest, query?: InviteQuery): Promise<InviteResponse>;
            /**
             * 移除参会人
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/vc-v1/meeting/kickout
             */
            kickout(meeting_id: string, body: KickoutRequest, query?: KickoutQuery): Promise<KickoutResponse>;
            /**
             * 设置主持人
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/vc-v1/meeting/set_host
             */
            setHost(meeting_id: string, body: SetHostRequest, query?: SetHostQuery): Promise<SetHostResponse>;
            /**
             * 结束会议
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/vc-v1/meeting/end
             */
            end(meeting_id: string): Promise<void>;
            /**
             * 获取会议详情
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/vc-v1/meeting/get
             */
            get(meeting_id: string, query?: GetQuery): Promise<GetResponse>;
            /**
             * 获取与会议号关联的会议列表
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/vc-v1/meeting/list_by_no
             */
            listByNo(query?: ListByNoQuery): Paginated<Lark.Meeting, 'meeting_briefs'>;
        }
        interface InviteRequest {
            /** 被邀请的用户列表 */
            invitees: Lark.MeetingUser[];
        }
        interface InviteQuery {
            /** 此次调用中使用的用户ID的类型，默认使用open_id可不填 */
            user_id_type?: 'user_id' | 'union_id' | 'open_id';
        }
        interface InviteResponse {
            /** 邀请结果 */
            invite_results?: Lark.MeetingInviteStatus[];
        }
        interface KickoutRequest {
            /** 需踢出的用户列表 */
            kickout_users: Lark.MeetingUser[];
        }
        interface KickoutQuery {
            /** 此次调用中使用的用户ID的类型，默认使用open_id可不填 */
            user_id_type?: 'user_id' | 'union_id' | 'open_id';
        }
        interface KickoutResponse {
            /** 踢出结果 */
            kickout_results?: Lark.MeetingParticipantResult[];
        }
        interface SetHostRequest {
            /** 将要设置的主持人 */
            host_user: Lark.MeetingUser;
            /** 当前主持人（CAS并发安全：如果和会中当前主持人不符则会设置失败，可使用返回的最新数据重新设置） */
            old_host_user?: Lark.MeetingUser;
        }
        interface SetHostQuery {
            /** 此次调用中使用的用户ID的类型，默认使用open_id可不填 */
            user_id_type?: 'user_id' | 'union_id' | 'open_id';
        }
        interface SetHostResponse {
            /** 会中当前主持人 */
            host_user?: Lark.MeetingUser;
        }
        interface GetQuery {
            /** 是否需要参会人列表 */
            with_participants?: boolean;
            /** 是否需要会中使用能力统计（仅限tenant_access_token） */
            with_meeting_ability?: boolean;
            /** 此次调用中使用的用户ID的类型，默认使用open_id可不填 */
            user_id_type?: 'user_id' | 'union_id' | 'open_id';
        }
        interface GetResponse {
            meeting?: Lark.Meeting;
        }
        interface ListByNoQuery extends Pagination {
            /** 9位会议号 */
            meeting_no: string;
            /** 查询开始时间（unix时间，单位sec） */
            start_time: string;
            /** 查询结束时间（unix时间，单位sec） */
            end_time: string;
        }
        namespace Recording {
            interface Methods {
                /**
                 * 开始录制
                 * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/vc-v1/meeting-recording/start
                 */
                start(meeting_id: string, body: StartRequest): Promise<void>;
                /**
                 * 停止录制
                 * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/vc-v1/meeting-recording/stop
                 */
                stop(meeting_id: string): Promise<void>;
                /**
                 * 获取录制文件
                 * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/vc-v1/meeting-recording/get
                 */
                get(meeting_id: string): Promise<GetResponse>;
                /**
                 * 授权录制文件
                 * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/vc-v1/meeting-recording/set_permission
                 */
                setPermission(meeting_id: string, body: SetPermissionRequest, query?: SetPermissionQuery): Promise<void>;
            }
            interface StartRequest {
                /** 录制文件时间显示使用的时区[-12,12] */
                timezone?: number;
            }
            interface GetResponse {
                recording?: Lark.MeetingRecording;
            }
            const enum SetPermissionRequestActionType {
                /** 授权 */
                Authorize = 0,
                /** 取消授权 */
                Revoke = 1
            }
            interface SetPermissionRequest {
                /** 授权对象列表 */
                permission_objects: Lark.RecordingPermissionObject[];
                /** 授权或者取消授权，默认授权 */
                action_type?: SetPermissionRequestActionType;
            }
            interface SetPermissionQuery {
                /** 此次调用中使用的用户ID的类型，默认使用open_id可不填 */
                user_id_type?: 'user_id' | 'union_id' | 'open_id';
            }
        }
    }
    namespace Report {
        interface Methods {
            /**
             * 获取会议报告
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/vc-v1/report/get_daily
             */
            getDaily(query?: GetDailyQuery): Promise<GetDailyResponse>;
            /**
             * 获取 Top 用户列表
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/vc-v1/report/get_top_user
             */
            getTopUser(query?: GetTopUserQuery): Promise<GetTopUserResponse>;
        }
        const enum GetDailyQueryUnit {
            /** 中国大陆 */
            CN = 0,
            /** 美国 */
            VA = 1,
            /** 新加坡 */
            SG = 2,
            /** 日本 */
            JP = 3
        }
        interface GetDailyQuery {
            /** 开始时间（unix时间，单位sec） */
            start_time: string;
            /** 结束时间（unix时间，单位sec） */
            end_time: string;
            /** 数据驻留地 */
            unit?: GetDailyQueryUnit;
        }
        interface GetDailyResponse {
            /** 会议报告 */
            meeting_report?: Lark.Report;
        }
        const enum GetTopUserQueryOrderBy {
            /** 会议数量 */
            MeetingCount = 1,
            /** 会议时长 */
            MeetingDuration = 2
        }
        const enum GetTopUserQueryUnit {
            /** 中国大陆 */
            CN = 0,
            /** 美国 */
            VA = 1,
            /** 新加坡 */
            SG = 2,
            /** 日本 */
            JP = 3
        }
        interface GetTopUserQuery {
            /** 开始时间（unix时间，单位sec） */
            start_time: string;
            /** 结束时间（unix时间，单位sec） */
            end_time: string;
            /** 取前多少位 */
            limit: number;
            /** 排序依据（降序） */
            order_by: GetTopUserQueryOrderBy;
            /** 数据驻留地 */
            unit?: GetTopUserQueryUnit;
            /** 此次调用中使用的用户ID的类型 */
            user_id_type?: 'user_id' | 'union_id' | 'open_id';
        }
        interface GetTopUserResponse {
            /** top用户列表 */
            top_user_report?: Lark.ReportTopUser[];
        }
    }
    namespace Export {
        interface Methods {
            /**
             * 导出会议明细
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/vc-v1/export/meeting_list
             */
            meetingList(body: MeetingListRequest, query?: MeetingListQuery): Promise<MeetingListResponse>;
            /**
             * 导出参会人明细
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/vc-v1/export/participant_list
             */
            participantList(body: ParticipantListRequest, query?: ParticipantListQuery): Promise<ParticipantListResponse>;
            /**
             * 导出参会人会议质量数据
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/vc-v1/export/participant_quality_list
             */
            participantQualityList(body: ParticipantQualityListRequest, query?: ParticipantQualityListQuery): Promise<ParticipantQualityListResponse>;
            /**
             * 导出会议室预定数据
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/vc-v1/export/resource_reservation_list
             */
            resourceReservationList(body: ResourceReservationListRequest): Promise<ResourceReservationListResponse>;
            /**
             * 查询导出任务结果
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/vc-v1/export/get
             */
            get(task_id: string): Promise<GetResponse>;
            /**
             * 下载导出文件
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/vc-v1/export/download
             */
            download(query?: DownloadQuery): Promise<ArrayBuffer>;
        }
        const enum MeetingListRequestMeetingStatus {
            /** 进行中 */
            Ongoing = 1,
            /** 已结束 */
            Past = 2,
            /** 待召开 */
            Future = 3
        }
        const enum MeetingListRequestMeetingType {
            /** 全部类型（默认） */
            All = 1,
            /** 视频会议 */
            Meeting = 2,
            /** 本地投屏 */
            ShareScreen = 3
        }
        interface MeetingListRequest {
            /** 查询开始时间（unix时间，单位sec） */
            start_time: string;
            /** 查询结束时间（unix时间，单位sec） */
            end_time: string;
            /** 会议状态（不传默认为已结束会议） */
            meeting_status?: MeetingListRequestMeetingStatus;
            /** 按9位会议号筛选（最多一个筛选条件） */
            meeting_no?: string;
            /** 按参会Lark用户筛选（最多一个筛选条件） */
            user_id?: string;
            /** 按参会Rooms筛选（最多一个筛选条件） */
            room_id?: string;
            /** 按会议类型筛选（最多一个筛选条件） */
            meeting_type?: MeetingListRequestMeetingType;
        }
        interface MeetingListQuery {
            /** 此次调用中使用的用户ID的类型，默认使用open_id可不填 */
            user_id_type?: 'user_id' | 'union_id' | 'open_id';
        }
        interface MeetingListResponse {
            /** 任务id */
            task_id?: string;
        }
        const enum ParticipantListRequestMeetingStatus {
            /** 进行中 */
            Ongoing = 1,
            /** 已结束 */
            Past = 2,
            /** 待召开 */
            Future = 3
        }
        interface ParticipantListRequest {
            /** 会议开始时间（unix时间，单位sec） */
            meeting_start_time: string;
            /** 会议结束时间（unix时间，单位sec） */
            meeting_end_time: string;
            /** 会议状态（不传默认为已结束会议） */
            meeting_status?: ParticipantListRequestMeetingStatus;
            /** 9位会议号 */
            meeting_no: string;
            /** 按参会Lark用户筛选（最多一个筛选条件） */
            user_id?: string;
            /** 按参会Rooms筛选（最多一个筛选条件） */
            room_id?: string;
        }
        interface ParticipantListQuery {
            /** 此次调用中使用的用户ID的类型，默认使用open_id可不填 */
            user_id_type?: 'user_id' | 'union_id' | 'open_id';
        }
        interface ParticipantListResponse {
            /** 任务id */
            task_id?: string;
        }
        interface ParticipantQualityListRequest {
            /** 会议开始时间（unix时间，单位sec） */
            meeting_start_time: string;
            /** 会议结束时间（unix时间，单位sec） */
            meeting_end_time: string;
            /** 9位会议号 */
            meeting_no: string;
            /** 参会人入会时间（unix时间，单位sec） */
            join_time: string;
            /** 参会人为Lark用户时填入 */
            user_id?: string;
            /** 参会人为Rooms时填入 */
            room_id?: string;
        }
        interface ParticipantQualityListQuery {
            /** 此次调用中使用的用户ID的类型，默认使用open_id可不填 */
            user_id_type?: 'user_id' | 'union_id' | 'open_id';
        }
        interface ParticipantQualityListResponse {
            /** 任务id */
            task_id?: string;
        }
        interface ResourceReservationListRequest {
            /** 层级id */
            room_level_id: string;
            /** 是否展示会议主题 */
            need_topic?: boolean;
            /** 查询开始时间（unix时间，单位sec） */
            start_time: string;
            /** 查询结束时间（unix时间，单位sec） */
            end_time: string;
            /** 待筛选的会议室id列表 */
            room_ids?: string[];
            /** 若为true表示导出room_ids范围外的会议室，默认为false */
            is_exclude?: boolean;
        }
        interface ResourceReservationListResponse {
            /** 任务id */
            task_id?: string;
        }
        const enum GetResponseStatus {
            /** 处理中 */
            InProgress = 1,
            /** 失败 */
            Failed = 2,
            /** 完成 */
            Done = 3
        }
        interface GetResponse {
            /** 任务状态 */
            status: GetResponseStatus;
            /** 文件下载地址 */
            url?: string;
            /** 文件token */
            file_token?: string;
            /** 失败信息 */
            fail_msg?: string;
        }
        interface DownloadQuery {
            /** 文档token */
            file_token: string;
        }
    }
    namespace RoomLevel {
        interface Methods {
            /**
             * 创建会议室层级
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/vc-v1/room_level/create
             */
            create(body: CreateRequest): Promise<CreateResponse>;
            /**
             * 删除会议室层级
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/vc-v1/room_level/del
             */
            del(body: DelRequest): Promise<void>;
            /**
             * 更新会议室层级
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/vc-v1/room_level/patch
             */
            patch(room_level_id: string, body: PatchRequest): Promise<void>;
            /**
             * 查询会议室层级详情
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/vc-v1/room_level/get
             */
            get(room_level_id: string): Promise<GetResponse>;
            /**
             * 批量查询会议室层级详情
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/vc-v1/room_level/mget
             */
            mget(body: MgetRequest): Promise<MgetResponse>;
            /**
             * 查询会议室层级列表
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/vc-v1/room_level/list
             */
            list(query?: ListQuery): Paginated<Lark.RoomLevel>;
            /**
             * 搜索会议室层级
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/vc-v1/room_level/search
             */
            search(query?: SearchQuery): Promise<SearchResponse>;
        }
        interface CreateRequest {
            /** 层级名称 */
            name: string;
            /** 父层级ID */
            parent_id: string;
            /** 自定义层级ID */
            custom_group_id?: string;
        }
        interface CreateResponse {
            room_level?: Lark.RoomLevel;
        }
        interface DelRequest {
            /** 层级ID */
            room_level_id: string;
            /** 是否删除所有子层级 */
            delete_child?: boolean;
        }
        interface PatchRequest {
            /** 层级名称 */
            name: string;
            /** 父层级ID */
            parent_id: string;
            /** 自定义层级ID */
            custom_group_id?: string;
        }
        interface GetResponse {
            room_level?: Lark.RoomLevel;
        }
        interface MgetRequest {
            /** 层级id列表 */
            level_ids: string[];
        }
        interface MgetResponse {
            /** 层级列表 */
            items?: Lark.RoomLevel[];
        }
        interface ListQuery extends Pagination {
            /** 层级ID，不传则返回该租户下第一层级列表 */
            room_level_id?: string;
        }
        interface SearchQuery {
            /** 用于查询指定会议室的租户自定义会议室ID */
            custom_level_ids: string;
        }
        interface SearchResponse {
            /** 层级id列表 */
            level_ids?: string[];
        }
    }
    namespace Room {
        interface Methods {
            /**
             * 创建会议室
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/vc-v1/room/create
             */
            create(body: CreateRequest, query?: CreateQuery): Promise<CreateResponse>;
            /**
             * 删除会议室
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/vc-v1/room/delete
             */
            delete(room_id: string): Promise<void>;
            /**
             * 更新会议室
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/vc-v1/room/patch
             */
            patch(room_id: string, body: PatchRequest, query?: PatchQuery): Promise<void>;
            /**
             * 查询会议室详情
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/vc-v1/room/get
             */
            get(room_id: string, query?: GetQuery): Promise<GetResponse>;
            /**
             * 批量查询会议室详情
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/vc-v1/room/mget
             */
            mget(body: MgetRequest, query?: MgetQuery): Promise<MgetResponse>;
            /**
             * 查询会议室列表
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/vc-v1/room/list
             */
            list(query?: ListQuery): Paginated<Lark.Room, 'rooms'>;
            /**
             * 搜索会议室
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/vc-v1/room/search
             */
            search(body: SearchRequest, query?: SearchQuery): Paginated<Lark.Room, 'rooms'>;
        }
        interface CreateRequest {
            /** 会议室名称 */
            name: string;
            /** 会议室能容纳的人数 */
            capacity: number;
            /** 会议室的相关描述 */
            description?: string;
            /** 自定义的会议室ID */
            custom_room_id?: string;
            /** 层级ID */
            room_level_id: string;
            /** 会议室状态 */
            room_status?: Lark.RoomStatus;
            /** 设施信息列表 */
            device?: Lark.Device[];
        }
        interface CreateQuery {
            /** 此次调用中使用的用户ID的类型，默认使用open_id可不填 */
            user_id_type?: 'user_id' | 'union_id' | 'open_id';
        }
        interface CreateResponse {
            room?: Lark.Room;
        }
        interface PatchRequest {
            /** 会议室名称 */
            name?: string;
            /** 会议室能容纳的人数 */
            capacity?: number;
            /** 会议室的相关描述 */
            description?: string;
            /** 自定义的会议室ID */
            custom_room_id?: string;
            /** 层级ID */
            room_level_id?: string;
            /** 会议室状态 */
            room_status?: Lark.RoomStatus;
            /** 设施信息列表 */
            device?: Lark.Device[];
        }
        interface PatchQuery {
            /** 此次调用中使用的用户ID的类型，默认使用open_id可不填 */
            user_id_type?: 'user_id' | 'union_id' | 'open_id';
        }
        interface GetQuery {
            /** 此次调用中使用的用户ID的类型，默认使用open_id可不填 */
            user_id_type?: 'user_id' | 'union_id' | 'open_id';
        }
        interface GetResponse {
            room?: Lark.Room;
        }
        interface MgetRequest {
            /** 会议室id列表 */
            room_ids: string[];
        }
        interface MgetQuery {
            /** 此次调用中使用的用户ID的类型，默认使用open_id可不填 */
            user_id_type?: 'user_id' | 'union_id' | 'open_id';
        }
        interface MgetResponse {
            /** 会议室列表 */
            items?: Lark.Room[];
        }
        interface ListQuery extends Pagination {
            /** 层级ID，不传则返回该租户下的所有会议室 */
            room_level_id?: string;
            /** 此次调用中使用的用户ID的类型，默认使用open_id可不填 */
            user_id_type?: 'user_id' | 'union_id' | 'open_id';
        }
        interface SearchRequest {
            /** 用于查询指定会议室的租户自定义会议室ID列表，优先使用该字段进行查询 */
            custom_room_ids?: string[];
            /** 会议室搜索关键词（当custom_room_ids为空时，使用该字段进行查询） */
            keyword?: string;
            /** 在该会议室层级下进行搜索 */
            room_level_id?: string;
            /** 搜索会议室是否包括层级名称 */
            search_level_name?: boolean;
            /** 分页大小，该值默认为10，最大为100 */
            page_size?: number;
            /** 分页标记，第一次请求不填，表示从头开始遍历；分页查询结果还有更多项时会同时返回新的 page_token，下次遍历可采用该 page_token 获取查询结果 */
            page_token?: string;
        }
        interface SearchQuery {
            /** 此次调用中使用的用户ID的类型，默认使用open_id可不填 */
            user_id_type?: 'user_id' | 'union_id' | 'open_id';
        }
    }
    namespace ScopeConfig {
        interface Methods {
            /**
             * 查询会议室配置
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/vc-v1/scope_config/get
             */
            get(query?: GetQuery): Promise<GetResponse>;
            /**
             * 设置会议室配置
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/vc-v1/scope_config/create
             */
            create(body: CreateRequest, query?: CreateQuery): Promise<void>;
        }
        const enum GetQueryScopeType {
            /** 会议室层级 */
            RoomLevel = 1,
            /** 会议室 */
            Room = 2
        }
        interface GetQuery {
            /** 查询节点范围 */
            scope_type: GetQueryScopeType;
            /** 查询节点ID：如果scope_type为1，则为层级ID，如果scope_type为2，则为会议室ID */
            scope_id: string;
            /** 此次调用中使用的用户ID的类型，默认使用open_id可不填 */
            user_id_type?: 'user_id' | 'union_id' | 'open_id';
        }
        interface GetResponse {
            /** 当前节点的配置，根据层级顺序从底向上进行合并计算后的结果；如果当前节点某个值已配置，则取该节点的值，否则会从该节点的父层级节点获取，如果父节点依然未配置，则继续向上递归获取；若所有节点均未配置，则该值返回为空 */
            current_config?: Lark.ScopeConfig;
            /** 所有节点的原始配置，按照层级顺序从底向上返回；如果某节点某个值未配置，则该值返回为空 */
            origin_configs?: Lark.ScopeConfig[];
        }
        const enum CreateRequestScopeType {
            /** 会议室层级 */
            RoomLevel = 1,
            /** 会议室 */
            Room = 2
        }
        interface CreateRequest {
            /** 查询节点范围 */
            scope_type: CreateRequestScopeType;
            /** 查询节点ID：如果scope_type为1，则为层级ID，如果scope_type为2，则为会议室ID */
            scope_id: string;
            /** 节点配置 */
            scope_config?: Lark.RoomConfig;
        }
        interface CreateQuery {
            /** 此次调用中使用的用户ID的类型，默认使用open_id可不填 */
            user_id_type?: 'user_id' | 'union_id' | 'open_id';
        }
    }
    namespace ReserveConfig {
        interface Methods {
            form: Form.Methods;
            admin: Admin.Methods;
            disableInform: DisableInform.Methods;
            /**
             * 查询会议室预定限制
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/vc-v1/reserve_config/reserve_scope
             */
            reserveScope(query?: ReserveScopeQuery): Promise<ReserveScopeResponse>;
            /**
             * 更新会议室预定限制
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/vc-v1/reserve_config/patch
             */
            patch(reserve_config_id: string, body: PatchRequest, query?: PatchQuery): Promise<void>;
        }
        interface ReserveScopeQuery {
            /** 会议室或层级id */
            scope_id: string;
            /** 1代表层级，2代表会议室 */
            scope_type: string;
            /** 此次调用中使用的用户ID的类型 */
            user_id_type?: 'user_id' | 'union_id' | 'open_id';
        }
        interface ReserveScopeResponse {
            /** 预定审批设置 */
            approve_config?: Lark.ApprovalConfig;
            /** 预定时间设置 */
            time_config?: Lark.TimeConfig;
            /** 预定范围设置 */
            reserve_scope_config?: Lark.ReserveScopeConfig;
        }
        interface PatchRequest {
            /** 1代表层级，2代表会议室 */
            scope_type: string;
            /** 预定审批设置 */
            approval_config?: Lark.ApprovalConfig;
            /** 预定时间设置 */
            time_config?: Lark.TimeConfig;
            /** 预定范围设置 */
            reserve_scope_config?: Lark.ReserveScopeConfig;
        }
        interface PatchQuery {
            /** 此次调用中使用的用户ID的类型 */
            user_id_type?: 'user_id' | 'union_id' | 'open_id';
        }
        namespace Form {
            interface Methods {
                /**
                 * 查询会议室预定表单
                 * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/vc-v1/reserve_config-form/get
                 */
                get(reserve_config_id: string, query?: GetQuery): Promise<GetResponse>;
                /**
                 * 更新会议室预定表单
                 * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/vc-v1/reserve_config-form/patch
                 */
                patch(reserve_config_id: string, body: PatchRequest, query?: PatchQuery): Promise<void>;
            }
            interface GetQuery {
                /** 1代表层级，2代表会议室 */
                scope_type: number;
                /** 此次调用中使用的用户ID的类型 */
                user_id_type?: 'user_id' | 'union_id' | 'open_id';
            }
            interface GetResponse {
                /** 预定表单 */
                reserve_form_config: Lark.ReserveFormConfig;
            }
            interface PatchRequest {
                /** 1代表层级，2代表会议室 */
                scope_type: number;
                /** 预定表单设置 */
                reserve_form_config: Lark.ReserveFormConfig;
            }
            interface PatchQuery {
                /** 此次调用中使用的用户ID的类型 */
                user_id_type?: 'user_id' | 'union_id' | 'open_id';
            }
        }
        namespace Admin {
            interface Methods {
                /**
                 * 查询会议室预定管理员
                 * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/vc-v1/reserve_config-admin/get
                 */
                get(reserve_config_id: string, query?: GetQuery): Promise<GetResponse>;
                /**
                 * 更新会议室预定管理员
                 * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/vc-v1/reserve_config-admin/patch
                 */
                patch(reserve_config_id: string, body: PatchRequest, query?: PatchQuery): Promise<void>;
            }
            interface GetQuery {
                /** 会议室或层级 */
                scope_type: number;
                /** 此次调用中使用的用户ID的类型 */
                user_id_type?: 'user_id' | 'union_id' | 'open_id';
            }
            interface GetResponse {
                /** 预定管理员/部门 */
                reserve_admin_config: Lark.ReserveAdminConfig;
            }
            interface PatchRequest {
                /** 1代表层级，2代表会议室 */
                scope_type: number;
                /** 预定管理员或部门 */
                reserve_admin_config: Lark.ReserveAdminConfig;
            }
            interface PatchQuery {
                /** 此次调用中使用的用户ID的类型 */
                user_id_type?: 'user_id' | 'union_id' | 'open_id';
            }
        }
        namespace DisableInform {
            interface Methods {
                /**
                 * 查询禁用状态变更通知
                 * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/vc-v1/reserve_config-disable_inform/get
                 */
                get(reserve_config_id: string, query?: GetQuery): Promise<GetResponse>;
                /**
                 * 更新禁用状态变更通知
                 * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/vc-v1/reserve_config-disable_inform/patch
                 */
                patch(reserve_config_id: string, body: PatchRequest, query?: PatchQuery): Promise<void>;
            }
            interface GetQuery {
                /** 1表示层级，2表示会议室 */
                scope_type: number;
                /** 此次调用中使用的用户ID的类型 */
                user_id_type?: 'user_id' | 'union_id' | 'open_id';
            }
            interface GetResponse {
                /** 会议室禁用通知配置 */
                disable_inform?: Lark.DisableInformConfig;
            }
            interface PatchRequest {
                /** 1表示会议室层级，2表示会议室 */
                scope_type: number;
                /** 禁用通知配置 */
                disable_inform: Lark.DisableInformConfig;
            }
            interface PatchQuery {
                /** 此次调用中使用的用户ID的类型 */
                user_id_type?: 'user_id' | 'union_id' | 'open_id';
            }
        }
    }
    namespace MeetingList {
        interface Methods {
            /**
             * 查询会议明细
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/vc-v1/meeting_list/get
             */
            get(query?: GetQuery): Paginated<Lark.MeetingInfo, 'meeting_list'>;
        }
        const enum GetQueryMeetingStatus {
            /** 进行中 */
            Ongoing = 1,
            /** 已结束 */
            Past = 2,
            /** 待召开 */
            Future = 3
        }
        const enum GetQueryMeetingType {
            /** 全部类型（默认） */
            All = 1,
            /** 视频会议 */
            Meeting = 2,
            /** 本地投屏 */
            ShareScreen = 3
        }
        interface GetQuery extends Pagination {
            /** 查询开始时间（unix时间，单位sec） */
            start_time: string;
            /** 查询结束时间（unix时间，单位sec） */
            end_time: string;
            /** 会议状态 */
            meeting_status?: GetQueryMeetingStatus;
            /** 按9位会议号筛选（最多一个筛选条件） */
            meeting_no?: string;
            /** 按参会Lark用户筛选（最多一个筛选条件） */
            user_id?: string;
            /** 按参会Rooms筛选（最多一个筛选条件） */
            room_id?: string;
            /** 按会议类型筛选（最多一个筛选条件） */
            meeting_type?: GetQueryMeetingType;
            /** 此次调用中使用的用户ID的类型 */
            user_id_type?: 'user_id' | 'union_id' | 'open_id';
        }
    }
    namespace ParticipantList {
        interface Methods {
            /**
             * 查询参会人明细
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/vc-v1/participant_list/get
             */
            get(query?: GetQuery): Paginated<Lark.Participant, 'participants'>;
        }
        const enum GetQueryMeetingStatus {
            /** 进行中 */
            Ongoing = 1,
            /** 已结束 */
            Past = 2,
            /** 待召开 */
            Future = 3
        }
        interface GetQuery extends Pagination {
            /** 会议开始时间（需要精确到一分钟，unix时间，单位sec） */
            meeting_start_time: string;
            /** 会议结束时间（unix时间，单位sec；对于进行中会议则传0） */
            meeting_end_time: string;
            /** 会议状态（不传默认为已结束会议） */
            meeting_status?: GetQueryMeetingStatus;
            /** 9位会议号 */
            meeting_no: string;
            /** 按参会Lark用户筛选（最多一个筛选条件） */
            user_id?: string;
            /** 按参会Rooms筛选（最多一个筛选条件） */
            room_id?: string;
            /** 此次调用中使用的用户ID的类型 */
            user_id_type?: 'user_id' | 'union_id' | 'open_id';
        }
    }
    namespace ParticipantQualityList {
        interface Methods {
            /**
             * 查询参会人会议质量数据
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/vc-v1/participant_quality_list/get
             */
            get(query?: GetQuery): Paginated<Lark.ParticipantQuality, 'participant_quality_list'>;
        }
        interface GetQuery extends Pagination {
            /** 会议开始时间（需要精确到一分钟，unix时间，单位sec） */
            meeting_start_time: string;
            /** 会议结束时间（unix时间，单位sec） */
            meeting_end_time: string;
            /** 9位会议号 */
            meeting_no: string;
            /** 参会人入会时间（unix时间，单位sec） */
            join_time: string;
            /** 参会人为Lark用户时填入 */
            user_id?: string;
            /** 参会人为Rooms时填入 */
            room_id?: string;
            /** 此次调用中使用的用户ID的类型 */
            user_id_type?: 'user_id' | 'union_id' | 'open_id';
        }
    }
    namespace ResourceReservationList {
        interface Methods {
            /**
             * 查询会议室预定数据
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/vc-v1/resource_reservation_list/get
             */
            get(query?: GetQuery): Paginated<Lark.RoomMeetingReservation, 'room_reservation_list'>;
        }
        interface GetQuery extends Pagination {
            /** 层级id */
            room_level_id: string;
            /** 是否展示会议主题 */
            need_topic?: boolean;
            /** 查询开始时间（unix时间，单位sec） */
            start_time: string;
            /** 查询结束时间（unix时间，单位sec） */
            end_time: string;
            /** 待筛选的会议室id列表 */
            room_ids: string[];
            /** 若为true表示导出room_ids范围外的会议室，默认为false */
            is_exclude?: boolean;
        }
    }
    namespace Alert {
        interface Methods {
            /**
             * 获取告警记录
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/vc-v1/alert/list
             */
            list(query?: ListQuery): Paginated<Lark.Alert>;
        }
        const enum ListQueryQueryType {
            /** 会议室 */
            Room = 1,
            /** erc */
            Erc = 2,
            /** SIP会议室系统 */
            Sip = 3
        }
        interface ListQuery extends Pagination {
            /** 开始时间（unix时间，单位sec） */
            start_time: string;
            /** 结束时间（unix时间，单位sec） */
            end_time: string;
            /** 查询对象类型 */
            query_type?: ListQueryQueryType;
            /** 查询对象ID */
            query_value?: string;
        }
    }
    namespace RoomConfig {
        interface Methods {
            /**
             * 创建签到板部署码
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/vc-v1/room_config/set_checkboard_access_code
             */
            setCheckboardAccessCode(body: SetCheckboardAccessCodeRequest): Promise<SetCheckboardAccessCodeResponse>;
            /**
             * 创建会议室部署码
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/vc-v1/room_config/set_room_access_code
             */
            setRoomAccessCode(body: SetRoomAccessCodeRequest): Promise<SetRoomAccessCodeResponse>;
            /**
             * 查询会议室配置
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/vc-v1/room_config/query
             */
            query(query?: QueryQuery): Promise<QueryResponse>;
            /**
             * 设置会议室配置
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/vc-v1/room_config/set
             */
            set(body: SetRequest, query?: SetQuery): Promise<void>;
        }
        const enum SetCheckboardAccessCodeRequestScope {
            /** 租户 */
            Tenant = 1,
            /** 国家/地区 */
            CountryDistrict = 2,
            /** 城市 */
            City = 3,
            /** 建筑 */
            Building = 4,
            /** 楼层 */
            Floor = 5,
            /** 会议室 */
            Room = 6
        }
        const enum SetCheckboardAccessCodeRequestValidDay {
            /** 1天 */
            Day = 1,
            /** 7天 */
            Week = 7,
            /** 30天 */
            Month = 30
        }
        interface SetCheckboardAccessCodeRequest {
            /** 设置节点范围 */
            scope: SetCheckboardAccessCodeRequestScope;
            /** 国家/地区ID scope为2，3时需要此参数 */
            country_id?: string;
            /** 城市ID scope为3时需要此参数 */
            district_id?: string;
            /** 建筑ID scope为4，5时需要此参数 */
            building_id?: string;
            /** 楼层 scope为5时需要此参数 */
            floor_name?: string;
            /** 会议室ID scope为6时需要此参数 */
            room_id?: string;
            /** 有效天数 */
            valid_day: SetCheckboardAccessCodeRequestValidDay;
        }
        interface SetCheckboardAccessCodeResponse {
            /** 部署访问码 */
            access_code?: string;
        }
        const enum SetRoomAccessCodeRequestScope {
            /** 租户 */
            Tenant = 1,
            /** 国家/地区 */
            CountryDistrict = 2,
            /** 城市 */
            City = 3,
            /** 建筑 */
            Building = 4,
            /** 楼层 */
            Floor = 5,
            /** 会议室 */
            Room = 6
        }
        const enum SetRoomAccessCodeRequestValidDay {
            /** 1天 */
            Day = 1,
            /** 7天 */
            Week = 7,
            /** 30天 */
            Month = 30
        }
        interface SetRoomAccessCodeRequest {
            /** 设置节点范围 */
            scope: SetRoomAccessCodeRequestScope;
            /** 国家/地区ID scope为2，3时需要此参数 */
            country_id?: string;
            /** 城市ID scope为3时需要此参数 */
            district_id?: string;
            /** 建筑ID scope为4，5时需要此参数 */
            building_id?: string;
            /** 楼层 scope为5时需要此参数 */
            floor_name?: string;
            /** 会议室ID scope为6时需要此参数 */
            room_id?: string;
            /** 有效天数 */
            valid_day: SetRoomAccessCodeRequestValidDay;
        }
        interface SetRoomAccessCodeResponse {
            /** 部署访问码 */
            access_code?: string;
        }
        const enum QueryQueryScope {
            /** 租户 */
            Tenant = 1,
            /** 国家/地区 */
            CountryDistrict = 2,
            /** 城市 */
            City = 3,
            /** 建筑 */
            Building = 4,
            /** 楼层 */
            Floor = 5,
            /** 会议室 */
            Room = 6
        }
        interface QueryQuery {
            /** 查询节点范围 */
            scope: QueryQueryScope;
            /** 国家/地区ID scope为2，3时需要此参数 */
            country_id?: string;
            /** 城市ID scope为3时需要此参数 */
            district_id?: string;
            /** 建筑ID scope为4，5时需要此参数 */
            building_id?: string;
            /** 楼层 scope为5时需要此参数 */
            floor_name?: string;
            /** 会议室ID scope为6时需要此参数 */
            room_id?: string;
            /** 此次调用中使用的用户ID的类型，默认使用open_id可不填 */
            user_id_type?: 'user_id' | 'union_id' | 'open_id';
        }
        interface QueryResponse {
            /** 飞书会议室背景图 */
            room_background?: string;
            /** 飞书签到板背景图 */
            display_background?: string;
            /** 飞书会议室数字标牌 */
            digital_signage?: Lark.RoomDigitalSignage;
            /** 飞书投屏盒子数字标牌 */
            room_box_digital_signage?: Lark.RoomDigitalSignage;
            /** 会议室状态 */
            room_status?: Lark.RoomStatus;
        }
        const enum SetRequestScope {
            /** 租户 */
            Tenant = 1,
            /** 国家/地区 */
            CountryDistrict = 2,
            /** 城市 */
            City = 3,
            /** 建筑 */
            Building = 4,
            /** 楼层 */
            Floor = 5,
            /** 会议室 */
            Room = 6
        }
        interface SetRequest {
            /** 设置节点范围 */
            scope: SetRequestScope;
            /** 国家/地区ID scope为2，3时需要此参数 */
            country_id?: string;
            /** 城市ID scope为3时需要此参数 */
            district_id?: string;
            /** 建筑ID scope为4，5时需要此参数 */
            building_id?: string;
            /** 楼层 scope为5时需要此参数 */
            floor_name?: string;
            /** 会议室ID scope为6时需要此参数 */
            room_id?: string;
            /** 会议室设置 */
            room_config: Lark.RoomConfig;
        }
        interface SetQuery {
            /** 此次调用中使用的用户ID的类型，默认使用open_id可不填 */
            user_id_type?: 'user_id' | 'union_id' | 'open_id';
        }
    }
}
