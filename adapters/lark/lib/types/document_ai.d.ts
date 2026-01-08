import * as Lark from '.';
declare module '../internal' {
    interface Internal {
        documentAi: DocumentAi.Methods;
    }
}
export declare namespace DocumentAi {
    interface Methods {
        resume: Resume.Methods;
        vehicleInvoice: VehicleInvoice.Methods;
        healthCertificate: HealthCertificate.Methods;
        hkmMainlandTravelPermit: HkmMainlandTravelPermit.Methods;
        twMainlandTravelPermit: TwMainlandTravelPermit.Methods;
        chinesePassport: ChinesePassport.Methods;
        bankCard: BankCard.Methods;
        vehicleLicense: VehicleLicense.Methods;
        trainInvoice: TrainInvoice.Methods;
        taxiInvoice: TaxiInvoice.Methods;
        idCard: IdCard.Methods;
        foodProduceLicense: FoodProduceLicense.Methods;
        foodManageLicense: FoodManageLicense.Methods;
        drivingLicense: DrivingLicense.Methods;
        vatInvoice: VatInvoice.Methods;
        businessLicense: BusinessLicense.Methods;
        contract: Contract.Methods;
        businessCard: BusinessCard.Methods;
    }
    namespace Resume {
        interface Methods {
            /**
             * 识别文件中的简历信息
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/ai/document_ai-v1/resume/parse
             */
            parse(form: ParseForm): Promise<ParseResponse>;
        }
        interface ParseForm {
            /** 简历文件，支持 PDF / DOCX / PNG / JPG */
            file: Blob;
        }
        interface ParseResponse {
            /** 简历信息 */
            resumes?: Lark.Resume[];
        }
    }
    namespace VehicleInvoice {
        interface Methods {
            /**
             * 识别文件中的机动车发票
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/ai/document_ai-v1/vehicle_invoice/recognize
             */
            recognize(form: RecognizeForm): Promise<RecognizeResponse>;
        }
        interface RecognizeForm {
            /** 识别的机动车发票源文件 */
            file: Blob;
        }
        interface RecognizeResponse {
            /** 机动车发票信息 */
            vehicle_invoice?: Lark.VehicleInvoice;
        }
    }
    namespace HealthCertificate {
        interface Methods {
            /**
             * 识别文件中的健康证
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/ai/document_ai-v1/health_certificate/recognize
             */
            recognize(form: RecognizeForm): Promise<RecognizeResponse>;
        }
        interface RecognizeForm {
            /** 识别的健康证源文件 */
            file: Blob;
        }
        interface RecognizeResponse {
            /** 健康证信息 */
            health_certificate?: Lark.HealthCertificate;
        }
    }
    namespace HkmMainlandTravelPermit {
        interface Methods {
            /**
             * 识别文件中的港澳居民来往内地通行证
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/ai/document_ai-v1/hkm_mainland_travel_permit/recognize
             */
            recognize(form: RecognizeForm): Promise<RecognizeResponse>;
        }
        interface RecognizeForm {
            /** 识别的港澳居民来往内地通行证源文件 */
            file: Blob;
        }
        interface RecognizeResponse {
            /** 港澳居民来往内地通行证信息 */
            hkm_mainland_travel_permit?: Lark.HkmMainlandTravelPermit;
        }
    }
    namespace TwMainlandTravelPermit {
        interface Methods {
            /**
             * 识别文件中的台湾居民来往大陆通行证
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/ai/document_ai-v1/tw_mainland_travel_permit/recognize
             */
            recognize(form: RecognizeForm): Promise<RecognizeResponse>;
        }
        interface RecognizeForm {
            /** 识别的台湾居民来往大陆通行证源文件 */
            file?: Blob;
        }
        interface RecognizeResponse {
            /** 台湾居民来往大陆通行证信息 */
            tw_mainland_travel_permit?: Lark.TwMainlandTravelPermit;
        }
    }
    namespace ChinesePassport {
        interface Methods {
            /**
             * 识别文件中的中国护照
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/ai/document_ai-v1/chinese_passport/recognize
             */
            recognize(form: RecognizeForm): Promise<RecognizeResponse>;
        }
        interface RecognizeForm {
            /** 识别的中国护照源文件 */
            file: Blob;
        }
        interface RecognizeResponse {
            /** 中国护照信息 */
            chinese_passport?: Lark.ChinesePassport;
        }
    }
    namespace BankCard {
        interface Methods {
            /**
             * 识别文件中的银行卡
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/ai/document_ai-v1/bank_card/recognize
             */
            recognize(form: RecognizeForm): Promise<RecognizeResponse>;
        }
        interface RecognizeForm {
            /** 识别的银行卡源文件 */
            file: Blob;
        }
        interface RecognizeResponse {
            /** 银行卡信息 */
            bank_card?: Lark.BankCard;
        }
    }
    namespace VehicleLicense {
        interface Methods {
            /**
             * 识别文件中的行驶证
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/ai/document_ai-v1/vehicle_license/recognize
             */
            recognize(form: RecognizeForm): Promise<RecognizeResponse>;
        }
        interface RecognizeForm {
            /** 识别的行驶证源文件 */
            file: Blob;
        }
        interface RecognizeResponse {
            /** 行驶证信息 */
            vehicle_license?: Lark.VehicleLicense;
        }
    }
    namespace TrainInvoice {
        interface Methods {
            /**
             * 识别文件中的火车票
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/ai/document_ai-v1/train_invoice/recognize
             */
            recognize(form: RecognizeForm): Promise<RecognizeResponse>;
        }
        interface RecognizeForm {
            /** 识别的火车票源文件 */
            file: Blob;
        }
        interface RecognizeResponse {
            /** 火车票信息 */
            train_invoices?: Lark.TrainInvoice[];
        }
    }
    namespace TaxiInvoice {
        interface Methods {
            /**
             * 识别文件中的出租车发票
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/ai/document_ai-v1/taxi_invoice/recognize
             */
            recognize(form: RecognizeForm): Promise<RecognizeResponse>;
        }
        interface RecognizeForm {
            /** 识别的出租车票源文件 */
            file: Blob;
        }
        interface RecognizeResponse {
            /** 出租车票信息 */
            taxi_invoices?: Lark.TaxiInvoice[];
        }
    }
    namespace IdCard {
        interface Methods {
            /**
             * 识别文件中的身份证
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/ai/document_ai-v1/id_card/recognize
             */
            recognize(form: RecognizeForm): Promise<RecognizeResponse>;
        }
        interface RecognizeForm {
            /** 识别身份证的源文件 */
            file: Blob;
        }
        interface RecognizeResponse {
            /** 身份证信息 */
            id_card?: Lark.IdCard;
        }
    }
    namespace FoodProduceLicense {
        interface Methods {
            /**
             * 识别文件中的食品生产许可证
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/ai/document_ai-v1/food_produce_license/recognize
             */
            recognize(form: RecognizeForm): Promise<RecognizeResponse>;
        }
        interface RecognizeForm {
            /** 识别的食品生产许可证源文件 */
            file: Blob;
        }
        interface RecognizeResponse {
            /** 食品生产许可证信息 */
            food_produce_license?: Lark.FoodProduceLicense;
        }
    }
    namespace FoodManageLicense {
        interface Methods {
            /**
             * 识别文件中的食品经营许可证
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/ai/document_ai-v1/food_manage_license/recognize
             */
            recognize(form: RecognizeForm): Promise<RecognizeResponse>;
        }
        interface RecognizeForm {
            /** 识别的食品经营许可证源文件 */
            file: Blob;
        }
        interface RecognizeResponse {
            /** 食品经营许可证信息 */
            food_manage_license?: Lark.FoodManageLicense;
        }
    }
    namespace DrivingLicense {
        interface Methods {
            /**
             * 识别文件中的驾驶证
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/ai/document_ai-v1/driving_license/recognize
             */
            recognize(form: RecognizeForm): Promise<RecognizeResponse>;
        }
        interface RecognizeForm {
            /** 识别的驾驶证源文件 */
            file: Blob;
        }
        interface RecognizeResponse {
            /** 驾驶证信息 */
            driving_license?: Lark.DrvingLicense;
        }
    }
    namespace VatInvoice {
        interface Methods {
            /**
             * 识别文件中的增值税发票
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/ai/document_ai-v1/vat_invoice/recognize
             */
            recognize(form: RecognizeForm): Promise<RecognizeResponse>;
        }
        interface RecognizeForm {
            /** 识别的增值税发票文件 */
            file: Blob;
        }
        interface RecognizeResponse {
            /** 增值税发票信息 */
            vat_invoices?: Lark.VatInvoice[];
        }
    }
    namespace BusinessLicense {
        interface Methods {
            /**
             * 识别文件中的营业执照
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/ai/document_ai-v1/business_license/recognize
             */
            recognize(form: RecognizeForm): Promise<RecognizeResponse>;
        }
        interface RecognizeForm {
            /** 识别的营业执照源文件 */
            file: Blob;
        }
        interface RecognizeResponse {
            /** 营业执照信息 */
            business_license?: Lark.BusinessLicense;
        }
    }
    namespace Contract {
        interface Methods {
            /**
             * 提取文件中的合同字段
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/ai/document_ai-v1/contract/field_extraction
             */
            fieldExtraction(form: FieldExtractionForm): Promise<FieldExtractionResponse>;
        }
        interface FieldExtractionForm {
            /** 合同字段解析的源文件，当前只支持pdf, doc, docx三种类型的文件 */
            file: Blob;
            /** pdf页数限制，太长会导致latency增加，最大允许100页 */
            pdf_page_limit: number;
            /** ocr 参数，当前支持force, pdf, unused三种格式 */
            ocr_mode: 'force' | 'auto' | 'unused';
        }
        interface FieldExtractionResponse {
            /** 文件的唯一id */
            file_id?: string;
            /** 总交易金额 */
            price?: Lark.ExtractPrice;
            /** 期限相关信息，包括开始日期、结束日期、有效时长 */
            time?: Lark.ExtractTime;
            /** 盖章份数 */
            copy?: Lark.ExtractCopy;
            /** 币种 */
            currency?: Lark.ExtractCurrency;
            /** 合同标题 */
            header?: string;
            /** 主体信息 */
            body_info?: Lark.BodyInfo[];
            /** 银行信息 */
            bank_info?: Lark.BankInfo[];
        }
    }
    namespace BusinessCard {
        interface Methods {
            /**
             * 识别文件中的名片
             * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/ai/document_ai-v1/business_card/recognize
             */
            recognize(form: RecognizeForm): Promise<RecognizeResponse>;
        }
        interface RecognizeForm {
            /** 识别名片的源文件（支持 JPG / PNG / PDF） */
            file: Blob;
        }
        interface RecognizeResponse {
            /** 名片信息 */
            business_cards?: Lark.RecognizedEntities[];
        }
    }
}
