import { Paginated, Pagination } from '../internal';
declare module '../internal' {
    interface Internal {
        event: Event.Methods;
    }
}
export declare namespace Event {
    interface Methods {
        outboundIp: OutboundIp.Methods;
    }
    namespace OutboundIp {
        interface Methods {
            /**
             * 获取事件出口 IP
             * @see https://open.feishu.cn/document/ukTMukTMukTM/uYDNxYjL2QTM24iN0EjN/event-v1/outbound_ip/list
             */
            list(query?: Pagination): Paginated<string, 'ip_list'>;
        }
    }
}
