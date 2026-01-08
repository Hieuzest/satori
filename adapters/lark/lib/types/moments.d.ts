import * as Lark from '.';
declare module '../internal' {
    interface Internal {
        moments: Moments.Methods;
    }
}
export declare namespace Moments {
    interface Methods {
        post: Post.Methods;
    }
    namespace Post {
        interface Methods {
            /**
             * 查询帖子信息
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/moments-v1/post/get
             */
            get(post_id: string, query?: GetQuery): Promise<GetResponse>;
        }
        interface GetQuery {
            /** 此次调用中使用的用户ID的类型 */
            user_id_type?: 'user_id' | 'union_id' | 'open_id';
        }
        interface GetResponse {
            /** 帖子实体 */
            post?: Lark.Post;
        }
    }
}
