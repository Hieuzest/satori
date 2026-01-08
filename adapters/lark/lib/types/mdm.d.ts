import * as Lark from '.';
declare module '../internal' {
    interface Internal {
        mdm: Mdm.Methods;
    }
}
export declare namespace Mdm {
    interface Methods {
        batchCountryRegion: BatchCountryRegion.Methods;
        countryRegion: CountryRegion.Methods;
        userAuthDataRelation: UserAuthDataRelation.Methods;
    }
    namespace BatchCountryRegion {
        interface Methods {
            /**
             * 根据主数据编码批量查询国家/地区
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/mdm-v3/batch_country_region/get
             */
            get(query?: GetQuery): Promise<GetResponse>;
        }
        interface GetQuery {
            /** 需要的查询字段集 */
            fields: string[];
            /** 主数据编码集 */
            ids: string[];
            /** 语言集 */
            languages: string[];
        }
        interface GetResponse {
            /** 国家/地区目录列表 */
            data?: Lark.CountryRegion[];
        }
    }
    namespace CountryRegion {
        interface Methods {
            /**
             * 分页批量查询国家/地区
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/mdm-v3/country_region/list
             */
            list(body: ListRequest, query?: ListQuery): Promise<ListResponse> & AsyncIterableIterator<Lark.CountryRegion>;
        }
        interface ListRequest {
            /** filter */
            filter?: Lark.Filter;
        }
        interface ListQuery {
            /** 语言集 */
            languages: string[];
            /** 需要的查询字段集 */
            fields: string[];
            /** 查询页大小 */
            limit?: number;
            /** 查询起始位置 */
            offset?: number;
            /** 是否返回总数 */
            return_count?: boolean;
            page_token?: string;
        }
        interface ListResponse {
            /** 国家/地区目录列表 */
            data?: Lark.CountryRegion[];
            /** 总数 */
            total?: string;
            /** 下一次分页参数 */
            next_page_token?: string;
        }
    }
    namespace UserAuthDataRelation {
        interface Methods {
            /**
             * 用户数据维度绑定
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/mdm-v1/user_auth_data_relation/bind
             */
            bind(body: BindRequest, query?: BindQuery): Promise<void>;
            /**
             * 用户数据维度解绑
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/mdm-v1/user_auth_data_relation/unbind
             */
            unbind(body: UnbindRequest, query?: UnbindQuery): Promise<void>;
        }
        interface BindRequest {
            /** 数据类型编码 */
            root_dimension_type: string;
            /** 数据编码列表 */
            sub_dimension_types: string[];
            /** 授权人的lark id */
            authorized_user_ids: string[];
            /** uams系统中应用id */
            uams_app_id: string;
        }
        interface BindQuery {
            /** 此次调用中使用的用户ID的类型 */
            user_id_type?: 'user_id' | 'union_id' | 'open_id';
        }
        interface UnbindRequest {
            /** 数据类型编码 */
            root_dimension_type: string;
            /** 数据编码列表 */
            sub_dimension_types: string[];
            /** 授权人的lark id */
            authorized_user_ids: string[];
            /** uams系统中应用id */
            uams_app_id: string;
        }
        interface UnbindQuery {
            /** 此次调用中使用的用户ID的类型 */
            user_id_type?: 'user_id' | 'union_id' | 'open_id';
        }
    }
}
