export type AtUser = {
    dingtalkId: string;
    staffId?: string;
};
export type DingtalkRequestBase = {
    msgtype: string;
    msgId: string;
    createAt: string;
    conversationType: string;
    conversationId: string;
    conversationTitle?: string;
    senderId: string;
    senderNick: string;
    senderCorpId?: string;
    sessionWebhook: string;
    sessionWebhookExpiredTime: number;
    isAdmin?: boolean;
    chatbotCorpId?: string;
    isInAtList?: boolean;
    senderStaffId?: string;
    chatbotUserId: string;
    atUsers?: AtUser[];
    robotCode: string;
};
export type Message = TextMessage | RichTextMessage | PictureMessage | FileMessage;
export interface TextMessage extends DingtalkRequestBase {
    msgtype: 'text';
    text: {
        content: string;
    };
}
export interface FileMessage extends DingtalkRequestBase {
    msgtype: 'file';
    content: {
        spaceId: string;
        fileName: string;
        downloadCode: string;
        fileId: string;
    };
}
export interface PictureMessage extends DingtalkRequestBase {
    msgtype: 'picture';
    content: {
        downloadCode: string;
    };
}
export interface RichTextMessage extends DingtalkRequestBase {
    msgtype: 'richText';
    content: {
        richText: ({
            text: string;
        } & {
            pictureDownloadCode: string;
            downloadCode: string;
            type: 'picture';
        })[];
    };
}
export interface SendMessageData {
    sampleText: {
        content: string;
    };
    sampleMarkdown: {
        title?: string;
        text: string;
    };
    sampleImageMsg: {
        photoURL: string;
    };
    sampleLink: {
        text: string;
        title: string;
        picUrl: string;
        messageUrl: string;
    };
    sampleAudio: {
        mediaId: string;
        duration: string;
    };
    sampleFile: {
        mediaId: string;
        fileName: string;
        fileType: string;
    };
    sampleVideo: {
        duration: string;
        videoMediaId: string;
        videoType: string;
        picMediaId: string;
    };
}
export * from '../api/oauth2';
export * from '../api/oapi';
export * from '../api/contact';
export * from '../api/swform';
export * from '../api/hrm';
export * from '../api/todo';
export * from '../api/attendance';
export * from '../api/calendar';
export * from '../api/blackboard';
export * from '../api/microApp';
export * from '../api/im';
export * from '../api/connector';
export * from '../api/exclusive';
export * from '../api/alitrip';
export * from '../api/project';
export * from '../api/edu';
export * from '../api/crm';
export * from '../api/yida';
export * from '../api/drive';
export * from '../api/workbench';
export * from '../api/robot';
export * from '../api/conference';
export * from '../api/serviceGroup';
export * from '../api/customerService';
export * from '../api/esign';
export * from '../api/jzcrm';
export * from '../api/badge';
export * from '../api/datacenter';
export * from '../api/resident';
export * from '../api/wiki';
export * from '../api/storage';
export * from '../api/doc';
export * from '../api/diot';
export * from '../api/h3yun';
export * from '../api/link';
export * from '../api/pedia';
export * from '../api/devicemng';
export * from '../api/convFile';
export * from '../api/industry';
export * from '../api/live';
export * from '../api/card';
export * from '../api/rooms';
