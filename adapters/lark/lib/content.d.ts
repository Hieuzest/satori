declare global {
    namespace JSX {
        interface IntrinsicElements {
            'lark:share-chat': {
                'chat-id': string;
            };
            'lark:share-user': {
                'user-id': string;
            };
            'lark:system': {
                'need-rollup'?: boolean;
            };
        }
    }
}
export interface MessageContent {
    text: MessageContent.Text;
    post: MessageContent.RichText;
    image: MessageContent.Image;
    file: MessageContent.File;
    audio: MessageContent.Audio;
    media: MessageContent.Media;
    sticker: MessageContent.Sticker;
    interactive: MessageContent.Card;
    share_chat: MessageContent.ShareChat;
    share_user: MessageContent.ShareUser;
    system: MessageContent.System;
}
export declare namespace MessageContent {
    interface Text {
        text: string;
    }
    interface Image {
        image_key: string;
    }
    interface ShareChat {
        chat_id: string;
    }
    interface ShareUser {
        user_id: string;
    }
    interface Audio {
        file_key: string;
    }
    interface Media {
        file_key: string;
        image_key?: string;
    }
    interface File {
        file_key: string;
    }
    interface Sticker {
        file_key: string;
    }
    interface System {
        type: 'divider';
        params: {
            divider_text: {
                text: string;
                i18n_text?: Record<string, string>;
            };
        };
        options?: {
            need_rollup?: boolean;
        };
    }
    interface RichText {
        [locale: string]: {
            title?: string;
            content: RichText.Paragraph[];
        };
    }
    namespace RichText {
        type Style = 'bold' | 'italic' | 'underline' | 'lineThrough';
        interface BaseElement<T extends string = string> {
            tag: T;
        }
        interface TextElement extends BaseElement<'text'> {
            text: string;
            un_escape?: boolean;
            style?: Style[];
        }
        interface LinkElement extends BaseElement<'a'> {
            text: string;
            href: string;
            style?: Style[];
        }
        interface AtElement extends BaseElement<'at'> {
            user_id: string;
            style?: Style[];
        }
        interface ImageElement extends BaseElement<'img'> {
            image_key: string;
        }
        interface MediaElement extends BaseElement<'media'> {
            file_key: string;
            image_key?: string;
        }
        interface EmotionElement extends BaseElement<'emoji'> {
            emoji_type: string;
        }
        interface CodeBlockElement extends BaseElement<'code_block'> {
            language?: string;
            text: string;
        }
        interface HrElement extends BaseElement<'hr'> {
        }
        interface MarkdownElement extends BaseElement<'md'> {
            text: string;
        }
        type InlineElement = TextElement | LinkElement | AtElement | EmotionElement | MarkdownElement;
        type BlockElement = ImageElement | MediaElement | CodeBlockElement | HrElement;
        type Paragraph = InlineElement[] | [BlockElement];
    }
    interface Card {
        schema: '2.0';
        config?: Card.Config;
        card_link?: Card.Urls;
        header?: Card.Header;
        body: Card.Body;
    }
    namespace Card {
        /** @see https://open.larksuite.com/document/common-capabilities/message-card/getting-started/card-structure/card-configuration */
        interface Config {
            streaming_mode?: boolean;
            streaming_config?: StreamingConfig;
            summary?: {
                content: string;
                i18n_content?: Record<string, string>;
            };
            locales?: string[];
            enable_forward?: boolean;
            update_multi?: boolean;
            width_mode?: 'compact' | 'fill';
            use_custom_translation?: boolean;
            enable_forward_interaction?: boolean;
            style?: {
                text_size?: {
                    'cus-0': Record<'default' | 'android' | 'ios' | 'pc', 'medium' | 'large'>;
                };
                color?: {
                    'cus-0': Record<'light_mode' | 'dark_mode', string>;
                };
            };
        }
        interface StreamingConfig {
            print_frequency_ms?: Record<'default' | 'android' | 'ios' | 'pc', number>;
            print_step?: Record<'default' | 'android' | 'ios' | 'pc', number>;
            print_strategy?: 'fast' | 'delay';
        }
        interface Urls {
            url: string;
            pc_url?: string;
            ios_url?: string;
            android_url?: string;
        }
        /** @see https://open.feishu.cn/document/feishu-cards/card-json-v2-components/content-components/title */
        interface Header {
            title: I18nTextElement;
            subtitle?: I18nTextElement;
            template?: Header.Template;
            icon?: IconElement;
            text_tag_list?: TextTagElement[];
            i18n_text_tag_list?: Record<string, TextTagElement[]>;
            padding?: string;
        }
        namespace Header {
            type Template = 'blue' | 'wathet' | 'turquoise' | 'green' | 'yellow' | 'orange' | 'red' | 'carmine' | 'violet' | 'purple' | 'indigo' | 'grey' | 'default';
        }
        interface Body {
            direction?: 'vertical' | 'horizontal';
            padding?: string;
            horizontal_spacing?: string;
            horizontal_align?: 'left' | 'center' | 'right';
            vertical_spacing?: string;
            vertical_align?: 'top' | 'center' | 'bottom';
            elements: Element[];
        }
        interface BaseElement<T extends string = string> {
            tag: T;
            margin?: string;
            element_id?: string;
        }
        interface BaseContainerElement<T extends string = string> extends BaseElement<T> {
            vertical_align?: 'top' | 'center' | 'bottom';
            vertical_spacing?: string;
            horizontal_align?: 'left' | 'center' | 'right';
            horizontal_spacing?: string;
            direction?: 'vertical' | 'horizontal';
            padding?: string;
            elements: Element[];
        }
        /** @see https://open.feishu.cn/document/feishu-cards/card-json-v2-components/containers/column-set */
        interface ColumnSetElement extends BaseElement<'column_set'> {
            horizontal_spacing?: string;
            horizontal_align?: 'left' | 'center' | 'right';
            vertical_align?: 'center';
            flex_mode?: 'none' | 'stretch' | 'flow' | 'bisect' | 'trisect';
            background_style?: string;
            columns: ColumnElement[];
            action?: {
                multi_url: Urls;
            };
        }
        interface ColumnElement extends BaseContainerElement<'column'> {
            background_style?: string;
            width?: 'auto' | 'weighted' | string;
            weight?: number;
            action?: {
                multi_url: Urls;
            };
        }
        /** @see https://open.feishu.cn/document/feishu-cards/card-json-v2-components/containers/form-container */
        interface FormElement extends BaseContainerElement<'form'> {
            name: string;
            confirm?: ConfirmElement;
        }
        /** @see https://open.feishu.cn/document/feishu-cards/card-json-v2-components/containers/interactive-container */
        interface InteractiveContainerElement extends BaseContainerElement<'interactive_container'> {
            width?: string;
            height?: string;
            background_style?: string;
            has_border?: boolean;
            border_color?: string;
            corner_radius?: string;
            behaviors: ActionBehavior[];
            disabled?: boolean;
            disabled_tips?: TextElement;
            confirm?: ConfirmElement;
            hover_tips?: TextElement;
        }
        /** @see https://open.feishu.cn/document/feishu-cards/card-json-v2-components/containers/collapsible-panel */
        interface CollapsiblePanelElement extends BaseContainerElement<'collapsible_panel'> {
            expanded?: boolean;
            background_color?: string;
            header: CollapsiblePanelElement.Header;
            border?: {
                color?: string;
                corner_radius?: string;
            };
        }
        namespace CollapsiblePanelElement {
            interface Header {
                title: TextElement | MarkdownElement;
                background_color?: string;
                vertical_align?: 'center' | 'top' | 'bottom';
                padding?: string;
                position?: 'top' | 'bottom';
                width?: string;
                icon?: IconElement & {
                    size?: string;
                };
                icon_position?: 'left' | 'right' | 'follow_text';
                icon_expanded_angle?: number;
            }
        }
        type TextSize = 'heading-0' | 'heading-1' | 'heading-2' | 'heading-3' | 'heading-4' | 'heading' | 'normal' | 'notation' | 'xxxx-large' | 'xxx-large' | 'xx-large' | 'x-large' | 'large' | 'medium' | 'small' | 'x-small';
        type TextAlign = 'left' | 'center' | 'right';
        interface TextElement<T extends string = 'plain_text'> extends BaseElement<T> {
            content: string;
        }
        interface I18nTextElement extends TextElement<'plain_text' | 'lark_md'> {
            i18n_content?: Record<string, string>;
        }
        interface DivTextElement extends TextElement<'plain_text' | 'lark_md'> {
            text_size?: TextSize;
            text_color?: string;
            text_align?: TextAlign;
            lines?: number;
        }
        type IconElement = StandardIconElement | CustomIconElement;
        interface CustomIconElement extends BaseElement<'custom_icon'> {
            img_key: string;
        }
        interface StandardIconElement extends BaseElement<'standard_icon'> {
            token: string;
            color?: string;
        }
        interface TextTagElement extends BaseElement<'text_tag'> {
            text: TextElement;
            color: TextTagElement.Color;
        }
        namespace TextTagElement {
            type Color = 'neutral' | 'blue' | 'torqoise' | 'lime' | 'orange' | 'violet' | 'indigo' | 'wathet' | 'green' | 'yellow' | 'red' | 'purple' | 'carmine';
        }
        interface BaseImageElement extends BaseElement<'img'> {
            img_key: string;
            alt?: TextElement;
        }
        /** @see https://open.feishu.cn/document/feishu-cards/card-json-v2-components/content-components/image */
        interface ImageElement extends BaseImageElement {
            title?: TextElement;
            transparent?: boolean;
            preview?: boolean;
            corner_radius?: string;
            scale_type?: 'crop_center' | 'fit_horizontal' | 'crop_top';
            size?: 'large' | 'medium' | 'small' | 'tiny' | 'stretch_without_padding' | 'stretch' | string;
            mode?: 'crop_center' | 'fit_horizontal' | 'large' | 'medium' | 'small' | 'tiny';
        }
        /** @see https://open.feishu.cn/document/feishu-cards/card-json-v2-components/content-components/multi-image-laylout */
        interface ImageCombinationElement extends BaseElement<'img_combination'> {
            combination_mode?: 'double' | 'triple' | 'bisect' | 'trisect';
            combination_transparent?: boolean;
            corner_radius?: string;
            img_list?: {
                img_key: string;
            }[];
        }
        /** @see https://open.feishu.cn/document/feishu-cards/card-json-v2-components/content-components/divider */
        interface HrElement extends BaseElement<'hr'> {
        }
        /** @see https://open.feishu.cn/document/feishu-cards/card-json-v2-components/content-components/plain-text */
        interface DivElement extends BaseElement<'div'> {
            text?: DivTextElement;
            width?: string;
            icon?: IconElement;
        }
        /** @see https://open.feishu.cn/document/feishu-cards/card-json-v2-components/content-components/rich-text */
        interface MarkdownElement extends BaseElement<'markdown'> {
            content: string;
            text_size?: TextSize;
            text_align?: TextAlign;
            icon?: IconElement;
        }
        /** @see https://open.feishu.cn/document/feishu-cards/card-json-v2-components/content-components/user-profile */
        interface PersonElement extends BaseElement<'person'> {
            user_id: string;
            size?: 'large' | 'medium' | 'small' | 'extra_small';
            show_avatar?: boolean;
            show_name?: boolean;
            style?: 'normal' | 'capsule';
        }
        /** @see https://open.feishu.cn/document/feishu-cards/card-json-v2-components/content-components/user-list */
        interface PersonListElement extends BaseElement<'person_list'> {
            persons: {
                id: string;
            }[];
            size?: 'large' | 'medium' | 'small' | 'extra_small';
            show_name?: boolean;
            show_avatar?: boolean;
            lines?: number;
            drop_invalid_user_id?: string;
            icon?: IconElement;
        }
        /** @see https://open.feishu.cn/document/feishu-cards/card-json-v2-components/content-components/chart */
        interface ChartElement extends BaseElement<'chart'> {
            chart_spec: {};
            aspect_ratio?: '1:1' | '2:1' | '4:3' | '16:9';
            color_theme?: 'brand' | 'rainbow' | 'complementary' | 'converse' | 'primary';
            preview?: boolean;
            height?: 'auto' | string;
        }
        /** @see https://open.feishu.cn/document/feishu-cards/card-json-v2-components/content-components/table */
        interface TableElement extends BaseElement<'table'> {
            page_size?: number;
            row_height?: 'low' | 'medium' | 'high' | string;
            row_max_height?: string;
            freeze_first_column?: boolean;
            header_style?: TableElement.HeaderStyle;
            columns: TableElement.Column[];
            rows: object[];
        }
        namespace TableElement {
            interface HeaderStyle {
                text_align?: TextAlign;
                text_size?: TextSize;
                background_style?: 'grey' | 'none';
                text_color?: 'default' | 'grey';
                bold?: boolean;
                lines?: number;
            }
            interface Column {
                name: string;
                display_name?: string;
                width?: 'auto' | string;
                vertical_align?: 'top' | 'center' | 'bottom';
                horizontal_align?: 'left' | 'center' | 'right';
                data_type?: 'text' | 'lark_md' | 'options' | 'number' | 'persons' | 'date' | 'markdown';
                format?: {
                    precision?: number;
                    symbol?: string;
                    separator?: string;
                };
                date_format?: string;
            }
        }
        type ActionBehavior = OpenUrlBehavior | CallbackBehavior;
        interface OpenUrlBehavior {
            type: 'open_url';
            default_url: string;
            pc_url?: string;
            ios_url?: string;
            android_url?: string;
        }
        interface CallbackBehavior {
            type: 'callback';
            value: Record<string, string>;
        }
        interface BaseButtonElement extends BaseElement<'button'> {
            text: TextElement;
            size?: ButtonElement.Size;
            icon?: IconElement;
            disabled?: boolean;
            behaviors?: ActionBehavior[];
        }
        /** @see https://open.feishu.cn/document/feishu-cards/card-json-v2-components/interactive-components/button */
        interface ButtonElement extends BaseButtonElement {
            type?: ButtonElement.Type;
            width?: ButtonElement.Width;
            hover_tips?: TextElement;
            disabled_tips?: TextElement;
            confirm?: ConfirmElement;
            name?: string;
            required?: boolean;
            form_action_type?: 'submit' | 'reset';
        }
        interface ConfirmElement {
            title: TextElement;
            text: TextElement;
        }
        /** @see https://open.feishu.cn/document/feishu-cards/card-json-v2-components/interactive-components/input */
        interface InputElement extends BaseElement<'input'> {
            name?: string;
            required?: boolean;
            placeholder?: TextElement;
            default_value?: string;
            disabled?: boolean;
            disabled_tips?: TextElement;
            width?: 'default' | 'fill' | string;
            max_length?: number;
            input_type?: 'text' | 'multiline_text' | 'password';
            show_icon?: boolean;
            rows?: number;
            auto_resize?: boolean;
            max_rows?: number;
            label?: TextElement;
            label_position?: 'top' | 'left';
            value?: string | object;
            behaviors?: ActionBehavior[];
            confirm?: ConfirmElement;
        }
        /** @see https://open.feishu.cn/document/feishu-cards/card-json-v2-components/interactive-components/overflow */
        interface OverflowElement extends BaseElement<'overflow'> {
            width?: 'default' | 'fill' | string;
            options: OverflowElement.Option[];
            value?: object;
            confirm?: ConfirmElement;
        }
        namespace OverflowElement {
            interface Option {
                text?: TextElement;
                multi_url?: Urls;
                value?: string;
            }
        }
        interface BaseSelectElement<T extends string = string> extends BaseElement<T> {
            type?: 'default' | 'text';
            name?: string;
            required?: boolean;
            disabled?: boolean;
            placeholder?: TextElement;
            width?: 'default' | 'fill' | string;
            confirm?: ConfirmElement;
            behaviors?: ActionBehavior[];
        }
        interface OptionElement {
            text: TextElement;
            icon?: IconElement;
            value: string;
        }
        /** @see https://open.feishu.cn/document/feishu-cards/card-json-v2-components/interactive-components/single-select-dropdown-menu */
        interface SelectElement extends BaseSelectElement<'select_static'> {
            options: OptionElement[];
            initial_option?: string;
            behaviors?: ActionBehavior[];
        }
        /** @see https://open.feishu.cn/document/feishu-cards/card-json-v2-components/interactive-components/multi-select-dropdown-menu */
        interface MultiSelectElement extends BaseSelectElement<'multi_select_static'> {
            options: OptionElement[];
            selected_values?: string[];
        }
        /** @see https://open.feishu.cn/document/feishu-cards/card-json-v2-components/interactive-components/single-select-user-picker */
        interface SelectPersonElement extends BaseSelectElement<'select_person'> {
            options: {
                value: string;
            }[];
        }
        /** @see https://open.feishu.cn/document/feishu-cards/card-json-v2-components/interactive-components/multi-select-user-picker */
        interface MultiSelectPersonElement extends BaseSelectElement<'multi_select_person'> {
            options: {
                value: string;
            }[];
            selected_values?: string[];
        }
        /** @see https://open.feishu.cn/document/feishu-cards/card-json-v2-components/interactive-components/date-picker */
        interface DatePickerElement extends BaseSelectElement<'date_picker'> {
            initial_date?: string;
            value?: object;
        }
        /** @see https://open.feishu.cn/document/feishu-cards/card-json-v2-components/interactive-components/time-selector */
        interface TimePickerElement extends BaseSelectElement<'picker_time'> {
            initial_time?: string;
            value?: object;
        }
        /** @see https://open.feishu.cn/document/feishu-cards/card-json-v2-components/interactive-components/date-time-picker */
        interface DateTimePickerElement extends BaseSelectElement<'picker_datetime'> {
            initial_datetime?: string;
            value?: object;
        }
        /** @see https://open.feishu.cn/document/feishu-cards/card-json-v2-components/interactive-components/image-picker */
        interface SelectImageElement extends BaseSelectElement<'select_img'> {
            multi_select?: boolean;
            layout?: 'stretch' | 'bisect' | 'trisect';
            can_preview?: boolean;
            aspect_ratio?: '1:1' | '4:3' | '16:9';
            disabled_tips?: TextElement;
            value?: string | object;
            options?: {
                img_key: string;
                value?: string;
                disabled?: boolean;
                disabled_tips?: TextElement;
                hover_tips?: TextElement;
            }[];
        }
        /** @see https://open.feishu.cn/document/feishu-cards/card-json-v2-components/interactive-components/checker */
        interface CheckerElement extends BaseElement<'checker'> {
            name?: string;
            checked?: boolean;
            disabled?: boolean;
            text?: CheckerElement.Text;
            overall_checkable?: boolean;
            button_area?: {
                pc_display_rule?: 'always' | 'on_hover';
                buttons?: CheckerElement.Button[];
            };
            checked_style?: {
                show_strikethrough?: boolean;
                opacity?: number;
            };
            padding?: string;
            confirm?: ConfirmElement;
            behaviors?: ActionBehavior[];
            hover_tips?: TextElement;
            disabled_tips?: TextElement;
        }
        namespace CheckerElement {
            interface Text extends Card.TextElement<'plain_text' | 'lark_md'> {
                text_size?: 'normal' | 'heading' | 'notation';
                text_color?: string;
                text_align?: TextAlign;
            }
            interface Button extends BaseButtonElement {
                type: 'text' | 'primary_text' | 'danger_text';
            }
        }
        namespace ButtonElement {
            type Size = 'tiny' | 'small' | 'medium' | 'large';
            type Width = 'default' | 'fill' | string;
            type Type = 'default' | 'primary' | 'danger' | 'text' | 'primary_text' | 'danger_text' | 'primary_filled' | 'danger_filled' | 'laser';
        }
        type Element = DivElement | MarkdownElement | HrElement | ChartElement | TableElement | ImageElement | FormElement | InputElement | ButtonElement | CheckerElement | ColumnSetElement | SelectElement | MultiSelectElement | SelectPersonElement | MultiSelectPersonElement | DatePickerElement | TimePickerElement | DateTimePickerElement | InteractiveContainerElement | CollapsiblePanelElement | OverflowElement;
    }
    interface Template {
        type: 'template';
        data: {
            template_id: string;
            template_variable: object;
        };
    }
}
