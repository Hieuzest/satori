export interface GetFlowDocsResponse {
    data?: {
        fileId?: string;
        fileName?: string;
        fileUrl?: string;
    }[];
}
export interface ApprovalListResponse {
    data?: {
        approvalName?: string;
        status?: string;
        refuseReason?: string;
        sponsorAccountName?: string;
        startTime?: number;
        endTime?: number;
        sealIdImg?: string;
        approvalNodes?: number;
    }[];
}
declare module '../internal' {
    interface Internal {
        /**
         * 获取流程任务的所有合同列表
         * @see https://open.dingtalk.com/document/isvapp/get-a-list-of-all-contracts-for-the-process-task
         */
        getFlowDocs(taskId: string): Promise<GetFlowDocsResponse>;
        /**
         * 获取流程任务用印审批列表
         * @see https://open.dingtalk.com/document/isvapp/obtains-the-print-approval-list-for-process-tasks
         */
        approvalList(taskId: string): Promise<ApprovalListResponse>;
    }
}
