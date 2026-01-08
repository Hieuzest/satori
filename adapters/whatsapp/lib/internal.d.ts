import { HTTP } from '@satorijs/core';
import { SendMessage } from './types';
interface PhoneNumber {
    verified_name: string;
    code_verification_status: string;
    display_phone_number: string;
    quality_rating: string;
    id: string;
}
export declare class Internal {
    http: HTTP;
    constructor(http: HTTP);
    getPhoneNumbers(id: string): Promise<PhoneNumber[]>;
    messageReaction(selfId: string, channelId: string, messageId: string, emoji: string): Promise<void>;
    sendMessage(selfId: string, data: SendMessage): Promise<{
        messages: {
            id: string;
        }[];
    }>;
    getMedia(mediaId: string): Promise<{
        url: string;
    }>;
    uploadMedia(selfId: string, form: FormData): Promise<{
        id: string;
    }>;
}
export {};
