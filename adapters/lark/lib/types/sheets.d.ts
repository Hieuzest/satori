import * as Lark from '.';
declare module '../internal' {
    interface Internal {
        sheets: Sheets.Methods;
    }
}
export declare namespace Sheets {
    interface Methods {
        spreadsheet: Spreadsheet.Methods;
    }
    namespace Spreadsheet {
        interface Methods {
            sheet: Sheet.Methods;
            /**
             * 创建电子表格
             * @see https://open.feishu.cn/document/ukTMukTMukTM/uUDN04SN0QjL1QDN/sheets-v3/spreadsheet/create
             */
            create(body: CreateRequest): Promise<CreateResponse>;
            /**
             * 修改电子表格属性
             * @see https://open.feishu.cn/document/ukTMukTMukTM/uUDN04SN0QjL1QDN/sheets-v3/spreadsheet/patch
             */
            patch(spreadsheet_token: string, body: PatchRequest): Promise<void>;
            /**
             * 获取电子表格信息
             * @see https://open.feishu.cn/document/ukTMukTMukTM/uUDN04SN0QjL1QDN/sheets-v3/spreadsheet/get
             */
            get(spreadsheet_token: string, query?: GetQuery): Promise<GetResponse>;
        }
        interface CreateRequest {
            /** 表格标题 */
            title?: string;
            /** 文件夹token */
            folder_token?: string;
        }
        interface CreateResponse {
            /** 表格信息 */
            spreadsheet?: Lark.Spreadsheet;
        }
        interface PatchRequest {
            /** 表格标题 */
            title?: string;
        }
        interface GetQuery {
            /** 此次调用中使用的用户ID的类型 */
            user_id_type?: 'user_id' | 'union_id' | 'open_id';
        }
        interface GetResponse {
            /** 表格 */
            spreadsheet?: Lark.GetSpreadsheet;
        }
        namespace Sheet {
            interface Methods {
                filter: Filter.Methods;
                filterView: FilterView.Methods;
                floatImage: FloatImage.Methods;
                /**
                 * 获取工作表
                 * @see https://open.feishu.cn/document/ukTMukTMukTM/uUDN04SN0QjL1QDN/sheets-v3/spreadsheet-sheet/query
                 */
                query(spreadsheet_token: string): Promise<QueryResponse>;
                /**
                 * 查询工作表
                 * @see https://open.feishu.cn/document/ukTMukTMukTM/uUDN04SN0QjL1QDN/sheets-v3/spreadsheet-sheet/get
                 */
                get(spreadsheet_token: string, sheet_id: string): Promise<GetResponse>;
                /**
                 * 移动行列
                 * @see https://open.feishu.cn/document/ukTMukTMukTM/uUDN04SN0QjL1QDN/sheets-v3/spreadsheet-sheet/move_dimension
                 */
                moveDimension(spreadsheet_token: string, sheet_id: string, body: MoveDimensionRequest): Promise<void>;
                /**
                 * 查找单元格
                 * @see https://open.feishu.cn/document/ukTMukTMukTM/uUDN04SN0QjL1QDN/sheets-v3/spreadsheet-sheet/find
                 */
                find(spreadsheet_token: string, sheet_id: string, body: FindRequest): Promise<FindResponse>;
                /**
                 * 替换单元格
                 * @see https://open.feishu.cn/document/ukTMukTMukTM/uUDN04SN0QjL1QDN/sheets-v3/spreadsheet-sheet/replace
                 */
                replace(spreadsheet_token: string, sheet_id: string, body: ReplaceRequest): Promise<ReplaceResponse>;
            }
            interface QueryResponse {
                /** 工作表信息 */
                sheets?: Lark.Sheet[];
            }
            interface GetResponse {
                /** 工作表 */
                sheet?: Lark.Sheet;
            }
            interface MoveDimensionRequest {
                /** 移动源位置参数 */
                source?: Lark.Dimension;
                /** 移动的目标位置行或者列号 */
                destination_index?: number;
            }
            interface FindRequest {
                /** 查找条件 */
                find_condition: Lark.FindCondition;
                /** 查找的字符串 */
                find: string;
            }
            interface FindResponse {
                /** 查找返回符合条件的信息 */
                find_result?: Lark.FindReplaceResult;
            }
            interface ReplaceRequest {
                /** 查找条件 */
                find_condition: Lark.FindCondition;
                /** 查找的字符串 */
                find: string;
                /** 替换的字符串 */
                replacement: string;
            }
            interface ReplaceResponse {
                /** 符合查找条件并替换的单元格信息 */
                replace_result?: Lark.FindReplaceResult;
            }
            namespace Filter {
                interface Methods {
                    /**
                     * 创建筛选
                     * @see https://open.feishu.cn/document/ukTMukTMukTM/uUDN04SN0QjL1QDN/sheets-v3/spreadsheet-sheet-filter/create
                     */
                    create(spreadsheet_token: string, sheet_id: string, body: CreateRequest): Promise<void>;
                    /**
                     * 更新筛选
                     * @see https://open.feishu.cn/document/ukTMukTMukTM/uUDN04SN0QjL1QDN/sheets-v3/spreadsheet-sheet-filter/update
                     */
                    update(spreadsheet_token: string, sheet_id: string, body: UpdateRequest): Promise<void>;
                    /**
                     * 获取筛选
                     * @see https://open.feishu.cn/document/ukTMukTMukTM/uUDN04SN0QjL1QDN/sheets-v3/spreadsheet-sheet-filter/get
                     */
                    get(spreadsheet_token: string, sheet_id: string): Promise<GetResponse>;
                    /**
                     * 删除筛选
                     * @see https://open.feishu.cn/document/ukTMukTMukTM/uUDN04SN0QjL1QDN/sheets-v3/spreadsheet-sheet-filter/delete
                     */
                    delete(spreadsheet_token: string, sheet_id: string): Promise<void>;
                }
                interface CreateRequest {
                    /** 筛选应用范围 */
                    range: string;
                    /** 设置筛选条件的列 */
                    col: string;
                    /** 筛选的条件 */
                    condition: Lark.Condition;
                }
                interface UpdateRequest {
                    /** 更新筛选条件的列 */
                    col: string;
                    /** 筛选条件 */
                    condition: Lark.Condition;
                }
                interface GetResponse {
                    /** 筛选信息 */
                    sheet_filter_info?: Lark.SheetFilterInfo;
                }
            }
            namespace FilterView {
                interface Methods {
                    condition: Condition.Methods;
                    /**
                     * 创建筛选视图
                     * @see https://open.feishu.cn/document/ukTMukTMukTM/uUDN04SN0QjL1QDN/sheets-v3/spreadsheet-sheet-filter_view/create
                     */
                    create(spreadsheet_token: string, sheet_id: string, body: CreateRequest): Promise<CreateResponse>;
                    /**
                     * 更新筛选视图
                     * @see https://open.feishu.cn/document/ukTMukTMukTM/uUDN04SN0QjL1QDN/sheets-v3/spreadsheet-sheet-filter_view/patch
                     */
                    patch(spreadsheet_token: string, sheet_id: string, filter_view_id: string, body: PatchRequest): Promise<PatchResponse>;
                    /**
                     * 查询筛选视图
                     * @see https://open.feishu.cn/document/ukTMukTMukTM/uUDN04SN0QjL1QDN/sheets-v3/spreadsheet-sheet-filter_view/query
                     */
                    query(spreadsheet_token: string, sheet_id: string): Promise<QueryResponse>;
                    /**
                     * 获取筛选视图
                     * @see https://open.feishu.cn/document/ukTMukTMukTM/uUDN04SN0QjL1QDN/sheets-v3/spreadsheet-sheet-filter_view/get
                     */
                    get(spreadsheet_token: string, sheet_id: string, filter_view_id: string): Promise<GetResponse>;
                    /**
                     * 删除筛选视图
                     * @see https://open.feishu.cn/document/ukTMukTMukTM/uUDN04SN0QjL1QDN/sheets-v3/spreadsheet-sheet-filter_view/delete
                     */
                    delete(spreadsheet_token: string, sheet_id: string, filter_view_id: string): Promise<void>;
                }
                interface CreateRequest {
                    /** 筛选视图 id */
                    filter_view_id?: string;
                    /** 筛选视图名字 */
                    filter_view_name?: string;
                    /** 筛选视图的筛选范围 */
                    range?: string;
                }
                interface CreateResponse {
                    /** 创建的筛选视图的 id 、name、range */
                    filter_view?: Lark.FilterView;
                }
                interface PatchRequest {
                    /** 筛选视图名字 */
                    filter_view_name?: string;
                    /** 筛选视图的筛选范围 */
                    range?: string;
                }
                interface PatchResponse {
                    /** 更新后的筛选视图的 id 、name、range */
                    filter_view?: Lark.FilterView;
                }
                interface QueryResponse {
                    /** 子表的所有筛选视图信息，id、name、range */
                    items?: Lark.FilterView[];
                }
                interface GetResponse {
                    /** 筛选视图信息，包括 id、name、range */
                    filter_view?: Lark.FilterView;
                }
                namespace Condition {
                    interface Methods {
                        /**
                         * 创建筛选条件
                         * @see https://open.feishu.cn/document/ukTMukTMukTM/uUDN04SN0QjL1QDN/sheets-v3/spreadsheet-sheet-filter_view-condition/create
                         */
                        create(spreadsheet_token: string, sheet_id: string, filter_view_id: string, body: CreateRequest): Promise<CreateResponse>;
                        /**
                         * 更新筛选条件
                         * @see https://open.feishu.cn/document/ukTMukTMukTM/uUDN04SN0QjL1QDN/sheets-v3/spreadsheet-sheet-filter_view-condition/update
                         */
                        update(spreadsheet_token: string, sheet_id: string, filter_view_id: string, condition_id: string, body: UpdateRequest): Promise<UpdateResponse>;
                        /**
                         * 查询筛选条件
                         * @see https://open.feishu.cn/document/ukTMukTMukTM/uUDN04SN0QjL1QDN/sheets-v3/spreadsheet-sheet-filter_view-condition/query
                         */
                        query(spreadsheet_token: string, sheet_id: string, filter_view_id: string): Promise<QueryResponse>;
                        /**
                         * 获取筛选条件
                         * @see https://open.feishu.cn/document/ukTMukTMukTM/uUDN04SN0QjL1QDN/sheets-v3/spreadsheet-sheet-filter_view-condition/get
                         */
                        get(spreadsheet_token: string, sheet_id: string, filter_view_id: string, condition_id: string): Promise<GetResponse>;
                        /**
                         * 删除筛选条件
                         * @see https://open.feishu.cn/document/ukTMukTMukTM/uUDN04SN0QjL1QDN/sheets-v3/spreadsheet-sheet-filter_view-condition/delete
                         */
                        delete(spreadsheet_token: string, sheet_id: string, filter_view_id: string, condition_id: string): Promise<void>;
                    }
                    interface CreateRequest {
                        /** 设置筛选条件的列，使用字母号 */
                        condition_id?: string;
                        /** 筛选类型 */
                        filter_type?: string;
                        /** 比较类型 */
                        compare_type?: string;
                        /** 筛选参数 */
                        expected?: string[];
                    }
                    interface CreateResponse {
                        /** 创建的筛选条件 */
                        condition?: Lark.FilterViewCondition;
                    }
                    interface UpdateRequest {
                        /** 筛选类型 */
                        filter_type?: string;
                        /** 比较类型 */
                        compare_type?: string;
                        /** 筛选参数 */
                        expected?: string[];
                    }
                    interface UpdateResponse {
                        /** 更新后的筛选条件 */
                        condition?: Lark.FilterViewCondition;
                    }
                    interface QueryResponse {
                        /** 筛选视图设置的所有筛选条件 */
                        items?: Lark.FilterViewCondition[];
                    }
                    interface GetResponse {
                        /** 筛选的条件 */
                        condition?: Lark.FilterViewCondition;
                    }
                }
            }
            namespace FloatImage {
                interface Methods {
                    /**
                     * 创建浮动图片
                     * @see https://open.feishu.cn/document/ukTMukTMukTM/uUDN04SN0QjL1QDN/sheets-v3/spreadsheet-sheet-float_image/create
                     */
                    create(spreadsheet_token: string, sheet_id: string, body: CreateRequest): Promise<CreateResponse>;
                    /**
                     * 更新浮动图片
                     * @see https://open.feishu.cn/document/ukTMukTMukTM/uUDN04SN0QjL1QDN/sheets-v3/spreadsheet-sheet-float_image/patch
                     */
                    patch(spreadsheet_token: string, sheet_id: string, float_image_id: string, body: PatchRequest): Promise<PatchResponse>;
                    /**
                     * 获取浮动图片
                     * @see https://open.feishu.cn/document/ukTMukTMukTM/uUDN04SN0QjL1QDN/sheets-v3/spreadsheet-sheet-float_image/get
                     */
                    get(spreadsheet_token: string, sheet_id: string, float_image_id: string): Promise<GetResponse>;
                    /**
                     * 查询浮动图片
                     * @see https://open.feishu.cn/document/ukTMukTMukTM/uUDN04SN0QjL1QDN/sheets-v3/spreadsheet-sheet-float_image/query
                     */
                    query(spreadsheet_token: string, sheet_id: string): Promise<QueryResponse>;
                    /**
                     * 删除浮动图片
                     * @see https://open.feishu.cn/document/ukTMukTMukTM/uUDN04SN0QjL1QDN/sheets-v3/spreadsheet-sheet-float_image/delete
                     */
                    delete(spreadsheet_token: string, sheet_id: string, float_image_id: string): Promise<void>;
                }
                interface CreateRequest {
                    /** 浮动图片 id */
                    float_image_id?: string;
                    /** 浮动图片 token，需要先上传图片到表格获得此 token 之后再进行浮动图片的操作 */
                    float_image_token?: string;
                    /** 浮动图片的左上角单元格定位，只支持一个单元格 */
                    range?: string;
                    /** 浮动图片的宽度，大于等于 20px */
                    width?: number;
                    /** 浮动图片的高度，大于等于 20px */
                    height?: number;
                    /** 浮动图片左上角所在位置相对于所在单元格左上角的横向偏移，大于等于0且小于所在单元格的宽度 */
                    offset_x?: number;
                    /** 浮动图片左上角所在位置相对于所在单元格左上角的纵向偏移，大于等于0且小于所在单元格的高度 */
                    offset_y?: number;
                }
                interface CreateResponse {
                    /** 浮动图片 */
                    float_image?: Lark.FloatImage;
                }
                interface PatchRequest {
                    /** 浮动图片 token，需要先上传图片到表格获得此 token 之后再进行浮动图片的操作 */
                    float_image_token?: string;
                    /** 浮动图片的左上角单元格定位，只支持一个单元格 */
                    range?: string;
                    /** 浮动图片的宽度，大于等于 20px */
                    width?: number;
                    /** 浮动图片的高度，大于等于 20px */
                    height?: number;
                    /** 浮动图片左上角所在位置相对于所在单元格左上角的横向偏移，大于等于0且小于所在单元格的宽度 */
                    offset_x?: number;
                    /** 浮动图片左上角所在位置相对于所在单元格左上角的纵向偏移，大于等于0且小于所在单元格的高度 */
                    offset_y?: number;
                }
                interface PatchResponse {
                    /** 浮动图片 */
                    float_image?: Lark.FloatImage;
                }
                interface GetResponse {
                    /** 浮动图片 */
                    float_image?: Lark.FloatImage;
                }
                interface QueryResponse {
                    /** 子表的所有浮动图片信息 */
                    items?: Lark.FloatImage[];
                }
            }
        }
    }
}
