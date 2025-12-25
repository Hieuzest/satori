var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  DingtalkBot: () => DingtalkBot,
  DingtalkMessageEncoder: () => DingtalkMessageEncoder,
  HttpServer: () => HttpServer,
  decodeMessage: () => decodeMessage,
  default: () => src_default,
  escape: () => escape,
  unescape: () => unescape
});
module.exports = __toCommonJS(src_exports);

// src/bot.ts
var import_core5 = require("@satorijs/core");

// src/http.ts
var import_core2 = require("@satorijs/core");
var import_node_crypto = __toESM(require("node:crypto"), 1);

// src/utils.ts
var import_core = require("@satorijs/core");
async function decodeMessage(bot, body) {
  const session = bot.session();
  session.type = "message";
  session.messageId = body.msgId;
  session.guildId = body.chatbotCorpId;
  session.event.user = {
    id: body.senderStaffId,
    name: body.senderNick
  };
  if (body.conversationType === "1") {
    session.channelId = session.userId;
    session.isDirect = true;
  } else {
    const atUsers = body.atUsers.filter((v) => v.dingtalkId !== body.chatbotUserId).map((v) => import_core.h.at(v.staffId));
    session.elements = [import_core.h.at(body.robotCode), ...atUsers];
    session.channelId = body.conversationId;
    session.isDirect = false;
  }
  if (body.conversationTitle) {
    session.event.channel.name = body.conversationTitle;
  }
  session.event.member = {
    roles: body.isAdmin ? ["admin"] : []
  };
  session.timestamp = +body.createAt;
  if (body.msgtype === "text") {
    session.elements = [import_core.h.text(body.text.content)];
  } else if (body.msgtype === "richText") {
    const elements = [];
    for (const item of body.content.richText) {
      if (item.text) elements.push(import_core.h.text(item.text));
      if (item.downloadCode) {
        const url = await bot.downloadFile(item.downloadCode);
        elements.push(import_core.h.image(url));
      }
    }
    session.elements = elements;
  } else if (body.msgtype === "picture") {
    session.elements = [import_core.h.image(await bot.downloadFile(body.content.downloadCode))];
  } else if (body.msgtype === "file") {
    session.elements = [import_core.h.file(await bot.downloadFile(body.content.downloadCode))];
  } else {
    return;
  }
  session.content = session.elements.join("");
  return session;
}
__name(decodeMessage, "decodeMessage");

// src/http.ts
var HttpServer = class extends import_core2.Adapter {
  static {
    __name(this, "HttpServer");
  }
  static inject = ["server"];
  logger;
  constructor(ctx, bot) {
    super(ctx);
    this.logger = ctx.logger("dingtalk");
  }
  async connect(bot) {
    await bot.refreshToken();
    await bot.getLogin();
    bot.online();
    this.ctx.server.post("/dingtalk", async (ctx) => {
      const timestamp = ctx.get("timestamp");
      const sign = ctx.get("sign");
      if (!timestamp || !sign) return ctx.status = 403;
      const timeDiff = Math.abs(Date.now() - Number(timestamp));
      if (timeDiff > 36e5) return ctx.status = 401;
      const signContent = timestamp + "\n" + bot.config.secret;
      const computedSign = import_node_crypto.default.createHmac("sha256", bot.config.secret).update(signContent).digest("base64");
      if (computedSign !== sign) return ctx.status = 403;
      const body = ctx.request.body;
      this.logger.debug(body);
      const session = await decodeMessage(bot, body);
      this.logger.debug(session);
      if (session) bot.dispatch(session);
    });
  }
};

// src/message.ts
var import_core3 = require("@satorijs/core");
var escape = /* @__PURE__ */ __name((val) => val.replace(/(?<!\u200b)[\*_~`]/g, "​$&").replace(/([\\`*_{}[\]\-(#!>])/g, "\\$&").replace(/([\-\*]|\d\.) /g, "​$&").replace(/^(\s{4})/gm, "​&nbsp;&nbsp;&nbsp;&nbsp;"), "escape");
var unescape = /* @__PURE__ */ __name((val) => val.replace(/\u200b([\*_~`])/g, "$1"), "unescape");
var DingtalkMessageEncoder = class extends import_core3.MessageEncoder {
  static {
    __name(this, "DingtalkMessageEncoder");
  }
  buffer = "";
  /**
   * Markdown: https://open.dingtalk.com/document/isvapp/robot-message-types-and-data-format
   */
  hasRichContent = true;
  async flush() {
    if (this.buffer.length && !this.hasRichContent) {
      await this.sendMessage("sampleText", {
        content: this.buffer
      });
    } else if (this.buffer.length && this.hasRichContent) {
      await this.sendMessage("sampleMarkdown", {
        text: this.buffer.replace(/\n/g, "\n\n")
      });
    }
  }
  // https://open.dingtalk.com/document/orgapp/the-robot-sends-a-group-message
  async sendMessage(msgType, msgParam) {
    const { processQueryKey } = this.session.isDirect ? await this.bot.internal.batchSendOTO({
      msgKey: msgType,
      msgParam: JSON.stringify(msgParam),
      robotCode: this.bot.config.appkey,
      userIds: [this.session.channelId]
    }) : await this.bot.internal.orgGroupSend({
      // https://open.dingtalk.com/document/orgapp/types-of-messages-sent-by-robots
      msgKey: msgType,
      msgParam: JSON.stringify(msgParam),
      robotCode: this.bot.config.appkey,
      openConversationId: this.channelId
    });
    const session = this.bot.session();
    session.messageId = processQueryKey;
    session.channelId = this.session.channelId;
    session.guildId = this.session.guildId;
    session.app.emit(session, "send", session);
    this.results.push({
      id: processQueryKey
    });
  }
  // https://open.dingtalk.com/document/orgapp/upload-media-files?spm=ding_open_doc.document.0.0.3b166172ERBuHw
  async uploadMedia(attrs) {
    const { data, type } = await this.bot.ctx.http.file(attrs.src || attrs.url, attrs);
    const form = new FormData();
    const value = new Blob([data], { type });
    let mediaType;
    if (type.startsWith("image/") || type.startsWith("video/")) {
      mediaType = type.split("/")[0];
    } else if (type.startsWith("audio/")) {
      mediaType = "voice";
    } else {
      mediaType = "file";
    }
    form.append("type", mediaType);
    form.append("media", value);
    const { media_id } = await this.bot.oldHttp.post("/media/upload", form);
    return media_id;
  }
  listType = null;
  async visit(element) {
    const { type, attrs, children } = element;
    if (type === "text") {
      this.buffer += escape(attrs.content);
    } else if ((type === "img" || type === "image") && (attrs.src || attrs.url)) {
      const src = attrs.src || attrs.url;
      if (await this.bot.http.isLocal(src)) {
        const temp = this.bot.ctx.get("server.temp");
        if (!temp) {
          return this.bot.logger.warn("missing temporary file service, cannot send assets with private url");
        }
        const entry = await temp.create(src);
        this.buffer += `![${attrs.alt ?? ""}](${entry.url})`;
      } else {
        this.buffer += `![${attrs.alt ?? ""}](${src})`;
      }
    } else if (type === "message") {
      await this.flush();
      await this.render(children);
    } else if (type === "at") {
      this.buffer += `@${attrs.id}`;
    } else if (type === "br") {
      this.buffer += "\n";
    } else if (type === "p") {
      if (!this.buffer.endsWith("\n")) this.buffer += "\n";
      await this.render(children);
      if (!this.buffer.endsWith("\n")) this.buffer += "\n";
      this.buffer += "\n";
    } else if (type === "b" || type === "strong") {
      this.buffer += ` **`;
      await this.render(children);
      this.buffer += `** `;
    } else if (type === "i" || type === "em") {
      this.buffer += ` *`;
      await this.render(children);
      this.buffer += `* `;
    } else if (type === "a" && attrs.href) {
      this.buffer += `[`;
      await this.render(children);
      this.buffer += `](${encodeURI(attrs.href)})`;
    } else if (type === "ul" || type === "ol") {
      this.listType = type;
      await this.render(children);
      this.listType = null;
    } else if (type === "li") {
      if (!this.buffer.endsWith("\n")) this.buffer += "\n";
      if (this.listType === "ol") {
        this.buffer += `1. `;
      } else if (this.listType === "ul") {
        this.buffer += "- ";
      }
      this.render(children);
      this.buffer += "\n";
    } else if (type === "blockquote") {
      if (!this.buffer.endsWith("\n")) this.buffer += "\n";
      this.buffer += "> ";
      await this.render(children);
      this.buffer += "\n\n";
    }
  }
};

// src/ws.ts
var import_core4 = require("@satorijs/core");
var WsClient = class extends import_core4.Adapter.WsClient {
  static {
    __name(this, "WsClient");
  }
  async prepare() {
    await this.bot.refreshToken();
    await this.bot.getLogin();
    const { endpoint, ticket } = await this.bot.http.post("/gateway/connections/open", {
      clientId: this.bot.config.appkey,
      clientSecret: this.bot.config.secret,
      subscriptions: [
        {
          type: "CALLBACK",
          topic: "/v1.0/im/bot/messages/get"
        }
      ]
    });
    return this.bot.http.ws(`${endpoint}?ticket=${ticket}`);
  }
  accept() {
    this.bot.online();
    this.socket.addEventListener("message", async ({ data }) => {
      const parsed = JSON.parse(data.toString());
      this.bot.logger.debug(parsed);
      if (parsed.type === "SYSTEM") {
        if (parsed.headers.topic === "ping") {
          this.socket.send(JSON.stringify({
            code: 200,
            headers: parsed.headers,
            message: "OK",
            data: parsed.data
          }));
        }
      } else if (parsed.type === "CALLBACK") {
        this.bot.logger.debug(JSON.parse(parsed.data));
        const session = await decodeMessage(this.bot, JSON.parse(parsed.data));
        if (session) this.bot.dispatch(session);
        this.bot.logger.debug(session);
      }
    });
  }
};
((WsClient2) => {
  WsClient2.Options = import_core4.Schema.intersect([
    import_core4.Adapter.WsClientConfig
  ]);
})(WsClient || (WsClient = {}));

// src/internal.ts
var Internal = class _Internal {
  constructor(bot) {
    this.bot = bot;
  }
  static {
    __name(this, "Internal");
  }
  static define(routes) {
    for (const path in routes) {
      for (const key in routes[path]) {
        const method = key;
        for (const name of Object.keys(routes[path][method])) {
          const isOldApi = routes[path][method][name];
          _Internal.prototype[name] = async function(...args) {
            const raw = args.join(", ");
            const url = path.replace(/\{([^}]+)\}/g, () => {
              if (!args.length) throw new Error(`too few arguments for ${path}, received ${raw}`);
              return args.shift();
            });
            const config = {};
            if (args.length === 1) {
              if (method === "GET" || method === "DELETE") {
                config.params = args[0];
              } else {
                config.data = args[0];
              }
            } else if (args.length === 2 && method !== "GET" && method !== "DELETE") {
              config.data = args[0];
              config.params = args[1];
            } else if (args.length > 1) {
              throw new Error(`too many arguments for ${path}, received ${raw}`);
            }
            const quester = isOldApi ? this.bot.oldHttp : this.bot.http;
            if (isOldApi) {
              config.params = { ...config.params, access_token: this.bot.token };
            }
            try {
              return (await quester(method, url, config)).data;
            } catch (error) {
              if (!this.bot.http.isError(error) || !error.response) throw error;
              throw new Error(`[${error.response.status}] ${JSON.stringify(error.response.data)}`);
            }
          };
        }
      }
    }
  }
};

// src/bot.ts
var DingtalkBot = class extends import_core5.Bot {
  static {
    __name(this, "DingtalkBot");
  }
  static MessageEncoder = DingtalkMessageEncoder;
  static inject = ["http"];
  oldHttp;
  http;
  internal;
  refreshTokenTimer;
  constructor(ctx, config) {
    super(ctx, config, "dingtalk");
    this.selfId = config.appkey;
    this.http = ctx.http.extend(config.api);
    this.oldHttp = ctx.http.extend(config.oldApi);
    this.internal = new Internal(this);
    if (config.protocol === "http") {
      ctx.plugin(HttpServer, this);
    } else if (config.protocol === "ws") {
      ctx.plugin(WsClient, this);
    }
  }
  async getLogin() {
    try {
      const { appList } = await this.internal.listAllInnerApps();
      const self2 = appList.find((v) => v.agentId === this.config.agentId);
      if (self2) {
        this.user.name = self2.name;
        this.user.avatar = self2.icon;
        return this.toJSON();
      }
    } catch (e) {
      this.logger.warn(e);
    }
    const data = await this.internal.oapiMicroappList();
    if (!data.appList) {
      this.logger.error("getLogin failed: %o", data);
      return this.toJSON();
    }
    const self = data.appList.find((v) => v.agentId === this.config.agentId);
    if (self) {
      this.user.name = self.name;
      this.user.avatar = self.appIcon;
    }
    return this.toJSON();
  }
  stop() {
    clearTimeout(this.refreshTokenTimer);
    return super.stop();
  }
  token;
  async refreshToken() {
    const data = await this.internal.getAccessToken({
      appKey: this.config.appkey,
      appSecret: this.config.secret
    });
    this.logger.debug("gettoken result: %o", data);
    this.token = data.accessToken;
    this.http = this.http.extend({
      headers: {
        "x-acs-dingtalk-access-token": data.accessToken
      }
    }).extend(this.config.api);
    this.refreshTokenTimer = setTimeout(this.refreshToken.bind(this), (data.expireIn - 10) * 1e3);
  }
  // https://open.dingtalk.com/document/orgapp/download-the-file-content-of-the-robot-receiving-message
  async downloadFile(downloadCode) {
    const { downloadUrl } = await this.internal.robotMessageFileDownload({
      downloadCode,
      robotCode: this.selfId
    });
    return downloadUrl;
  }
  async deleteMessage(channelId, messageId) {
    if (channelId.startsWith("cid")) {
      await this.internal.orgGroupRecall({
        robotCode: this.selfId,
        processQueryKeys: [messageId],
        openConversationId: channelId
      });
    } else {
      await this.internal.batchRecallOTO({
        robotCode: this.selfId,
        processQueryKeys: [messageId]
      });
    }
  }
};
((DingtalkBot2) => {
  DingtalkBot2.Config = import_core5.Schema.intersect([
    import_core5.Schema.object({
      protocol: process.env.KOISHI_ENV === "browser" ? import_core5.Schema.const("ws").default("ws") : import_core5.Schema.union(["http", "ws"]).description("选择要使用的协议。").required()
    }),
    import_core5.Schema.object({
      secret: import_core5.Schema.string().required().description("机器人密钥。"),
      agentId: import_core5.Schema.number().description("AgentId"),
      appkey: import_core5.Schema.string().required(),
      api: import_core5.HTTP.createConfig("https://api.dingtalk.com/v1.0/"),
      oldApi: import_core5.HTTP.createConfig("https://oapi.dingtalk.com/")
    }),
    WsClient.Options
  ]);
})(DingtalkBot || (DingtalkBot = {}));

// src/api/oauth2.ts
Internal.define({
  "/oauth2/jsapiTickets": { POST: { createJsapiTicket: false } },
  "/oauth2/ssoAccessToken": { POST: { getSsoAccessToken: false } },
  "/oauth2/authRules/user": { GET: { getPersonalAuthRule: false } },
  "/oauth2/accessToken": { POST: { getAccessToken: false } },
  "/oauth2/corpAccessToken": { POST: { getCorpAccessToken: false } },
  "/oauth2/userAccessToken": { POST: { getUserToken: false } },
  "/oauth2/ssoUserInfo": { GET: { getSsoUserInfo: false } }
});

// src/api/oapi.ts
Internal.define({
  "/service/get_corp_token": { POST: { oapiServiceGetCorpToken: true } },
  "/sso/gettoken": { GET: { oapiSsoGettoken: true } },
  "/get_jsapi_ticket": { GET: { oapiGetJsapiTicket: true } },
  "/gettoken": { GET: { oapiGettoken: true } },
  "/v2/user/getuserinfo": { POST: { oapiV2UserGetuserinfo: true } },
  "/sns/getuserinfo_bycode": { POST: { oapiSnsGetuserinfoBycode: true } },
  "/sso/getuserinfo": { GET: { oapiSsoGetuserinfo: true } },
  "/service/get_auth_info": { POST: { oapiServiceGetAuthInfo: true } },
  "/v2/user/update": { POST: { oapiV2UserUpdate: true } },
  "/v2/user/create": { POST: { oapiV2UserCreate: true } },
  "/org/union/trunk/get": { POST: { oapiOrgUnionTrunkGet: true } },
  "/smartwork/hrm/roster/meta/get": {
    POST: { oapiSmartworkHrmRosterMetaGet: true }
  },
  "/smartwork/hrm/employee/v2/list": {
    POST: { oapiSmartworkHrmEmployeeV2List: true }
  },
  "/smartwork/hrm/employee/v2/update": {
    POST: { oapiSmartworkHrmEmployeeV2Update: true }
  },
  "/smartwork/hrm/employee/field/grouplist": {
    POST: { oapiSmartworkHrmEmployeeFieldGrouplist: true }
  },
  "/smartwork/hrm/employee/update": {
    POST: { oapiSmartworkHrmEmployeeUpdate: true }
  },
  "/smartwork/hrm/employee/queryonjob": {
    POST: { oapiSmartworkHrmEmployeeQueryonjob: true }
  },
  "/smartwork/hrm/employee/querypreentry": {
    POST: { oapiSmartworkHrmEmployeeQuerypreentry: true }
  },
  "/smartwork/hrm/employee/addpreentry": {
    POST: { oapiSmartworkHrmEmployeeAddpreentry: true }
  },
  "/smartwork/hrm/employee/list": {
    POST: { oapiSmartworkHrmEmployeeList: true }
  },
  "/report/template/getbyname": { POST: { oapiReportTemplateGetbyname: true } },
  "/report/create": { POST: { oapiReportCreate: true } },
  "/report/savecontent": { POST: { oapiReportSavecontent: true } },
  "/report/simplelist": { POST: { oapiReportSimplelist: true } },
  "/report/statistics/listbytype": {
    POST: { oapiReportStatisticsListbytype: true }
  },
  "/report/receiver/list": { POST: { oapiReportReceiverList: true } },
  "/report/comment/list": { POST: { oapiReportCommentList: true } },
  "/report/statistics": { POST: { oapiReportStatistics: true } },
  "/report/getunreadcount": { POST: { oapiReportGetunreadcount: true } },
  "/report/list": { POST: { oapiReportList: true } },
  "/report/template/listbyuserid": {
    POST: { oapiReportTemplateListbyuserid: true }
  },
  "/checkin/record/get": { POST: { oapiCheckinRecordGet: true } },
  "/checkin/record": { GET: { oapiCheckinRecord: true } },
  "/blackboard/category/list": { POST: { oapiBlackboardCategoryList: true } },
  "/blackboard/update": { POST: { oapiBlackboardUpdate: true } },
  "/blackboard/delete": { POST: { oapiBlackboardDelete: true } },
  "/blackboard/get": { POST: { oapiBlackboardGet: true } },
  "/blackboard/listids": { POST: { oapiBlackboardListids: true } },
  "/blackboard/create": { POST: { oapiBlackboardCreate: true } },
  "/blackboard/listtopten": { POST: { oapiBlackboardListtopten: true } },
  "/health/stepinfo/getuserstatus": {
    POST: { oapiHealthStepinfoGetuserstatus: true }
  },
  "/health/stepinfo/listbyuserid": {
    POST: { oapiHealthStepinfoListbyuserid: true }
  },
  "/health/stepinfo/list": { POST: { oapiHealthStepinfoList: true } },
  "/microapp/list_by_userid": { GET: { oapiMicroappListByUserid: true } },
  "/microapp/list": { POST: { oapiMicroappList: true } },
  "/microapp/delete": { POST: { oapiMicroappDelete: true } },
  "/microapp/set_visible_scopes": {
    POST: { oapiMicroappSetVisibleScopes: true }
  },
  "/microapp/visible_scopes": { POST: { oapiMicroappVisibleScopes: true } },
  "/asr/voice/translate": { POST: { oapiAsrVoiceTranslate: true } },
  "/ai/mt/translate": { POST: { oapiAiMtTranslate: true } },
  "/ocr/structured/recognize": { POST: { oapiOcrStructuredRecognize: true } },
  "/im/chat/scencegroup/message/send_v2": {
    POST: { oapiImChatScencegroupMessageSendV2: true }
  },
  "/im/chat/scenegroup/template/close": {
    POST: { oapiImChatScenegroupTemplateClose: true }
  },
  "/im/chat/scenegroup/template/apply": {
    POST: { oapiImChatScenegroupTemplateApply: true }
  },
  "/im/chat/scencegroup/interactivecard/callback/register": {
    POST: { oapiImChatScencegroupInteractivecardCallbackRegister: true }
  },
  "/im/chat/scenegroup/create": { POST: { oapiImChatScenegroupCreate: true } },
  "/im/chat/scenegroup/member/add": {
    POST: { oapiImChatScenegroupMemberAdd: true }
  },
  "/im/chat/scenegroup/member/get": {
    POST: { oapiImChatScenegroupMemberGet: true }
  },
  "/im/chat/scenegroup/update": { POST: { oapiImChatScenegroupUpdate: true } },
  "/im/chat/scenegroup/member/delete": {
    POST: { oapiImChatScenegroupMemberDelete: true }
  },
  "/im/chat/scenegroup/get": { POST: { oapiImChatScenegroupGet: true } },
  "/robot/send": { POST: { oapiRobotSend: true } },
  "/alitrip/btrip/invoice/setting/rule": {
    POST: { oapiAlitripBtripInvoiceSettingRule: true }
  },
  "/alitrip/btrip/invoice/setting/add": {
    POST: { oapiAlitripBtripInvoiceSettingAdd: true }
  },
  "/alitrip/btrip/project/delete": {
    POST: { oapiAlitripBtripProjectDelete: true }
  },
  "/alitrip/btrip/project/modify": {
    POST: { oapiAlitripBtripProjectModify: true }
  },
  "/alitrip/btrip/project/add": { POST: { oapiAlitripBtripProjectAdd: true } },
  "/alitrip/btrip/invoice/setting/delete": {
    POST: { oapiAlitripBtripInvoiceSettingDelete: true }
  },
  "/alitrip/btrip/invoice/setting/modify": {
    POST: { oapiAlitripBtripInvoiceSettingModify: true }
  },
  "/alitrip/btrip/price/query": { POST: { oapiAlitripBtripPriceQuery: true } },
  "/alitrip/btrip/train/city/suggest": {
    POST: { oapiAlitripBtripTrainCitySuggest: true }
  },
  "/alitrip/btrip/monthbill/url/get": {
    POST: { oapiAlitripBtripMonthbillUrlGet: true }
  },
  "/alitrip/btrip/address/get": { POST: { oapiAlitripBtripAddressGet: true } },
  "/alitrip/btrip/approval/modify": {
    POST: { oapiAlitripBtripApprovalModify: true }
  },
  "/alitrip/btrip/flight/city/suggest": {
    POST: { oapiAlitripBtripFlightCitySuggest: true }
  },
  "/alitrip/btrip/vehicle/order/search": {
    POST: { oapiAlitripBtripVehicleOrderSearch: true }
  },
  "/alitrip/btrip/cost/center/query": {
    POST: { oapiAlitripBtripCostCenterQuery: true }
  },
  "/alitrip/btrip/approval/update": {
    POST: { oapiAlitripBtripApprovalUpdate: true }
  },
  "/alitrip/btrip/cost/center/new": {
    POST: { oapiAlitripBtripCostCenterNew: true }
  },
  "/alitrip/btrip/cost/center/modify": {
    POST: { oapiAlitripBtripCostCenterModify: true }
  },
  "/alitrip/btrip/cost/center/delete": {
    POST: { oapiAlitripBtripCostCenterDelete: true }
  },
  "/alitrip/btrip/cost/center/entity/set": {
    POST: { oapiAlitripBtripCostCenterEntitySet: true }
  },
  "/alitrip/btrip/hotel/order/search": {
    POST: { oapiAlitripBtripHotelOrderSearch: true }
  },
  "/alitrip/btrip/train/order/search": {
    POST: { oapiAlitripBtripTrainOrderSearch: true }
  },
  "/alitrip/btrip/flight/order/search": {
    POST: { oapiAlitripBtripFlightOrderSearch: true }
  },
  "/alitrip/btrip/invoice/search": {
    POST: { oapiAlitripBtripInvoiceSearch: true }
  },
  "/alitrip/btrip/cost/center/transfer": {
    POST: { oapiAlitripBtripCostCenterTransfer: true }
  },
  "/alitrip/btrip/apply/get": { POST: { oapiAlitripBtripApplyGet: true } },
  "/alitrip/btrip/apply/search": {
    POST: { oapiAlitripBtripApplySearch: true }
  },
  "/alitrip/btrip/approval/new": {
    POST: { oapiAlitripBtripApprovalNew: true }
  },
  "/alitrip/btrip/cost/center/entity/delete": {
    POST: { oapiAlitripBtripCostCenterEntityDelete: true }
  },
  "/workspace/auditlog/list": { POST: { oapiWorkspaceAuditlogList: true } },
  "/edu/cert/get": { POST: { oapiEduCertGet: true } },
  "/edu/user/list": { POST: { oapiEduUserList: true } },
  "/smartdevice/device/querybyid": {
    POST: { oapiSmartdeviceDeviceQuerybyid: true }
  },
  "/smartdevice/device/querylist": {
    POST: { oapiSmartdeviceDeviceQuerylist: true }
  },
  "/smartdevice/device/query": { POST: { oapiSmartdeviceDeviceQuery: true } },
  "/smartdevice/device/updatenick": {
    POST: { oapiSmartdeviceDeviceUpdatenick: true }
  },
  "/smartdevice/device/unbind": { POST: { oapiSmartdeviceDeviceUnbind: true } },
  "/smartdevice/external/bind": { POST: { oapiSmartdeviceExternalBind: true } },
  "/crm/objectdata/contact/delete": {
    POST: { oapiCrmObjectdataContactDelete: true }
  },
  "/crm/objectdata/customobject/create": {
    POST: { oapiCrmObjectdataCustomobjectCreate: true }
  },
  "/crm/objectdata/customobject/update": {
    POST: { oapiCrmObjectdataCustomobjectUpdate: true }
  },
  "/crm/objectdata/list": { POST: { oapiCrmObjectdataList: true } },
  "/crm/objectdata/query": { POST: { oapiCrmObjectdataQuery: true } },
  "/crm/objectmeta/describe": { POST: { oapiCrmObjectmetaDescribe: true } },
  "/crm/objectdata/contact/query": {
    POST: { oapiCrmObjectdataContactQuery: true }
  },
  "/crm/objectdata/followrecord/list": {
    POST: { oapiCrmObjectdataFollowrecordList: true }
  },
  "/crm/objectdata/followrecord/query": {
    POST: { oapiCrmObjectdataFollowrecordQuery: true }
  },
  "/crm/objectdata/contact/list": {
    POST: { oapiCrmObjectdataContactList: true }
  },
  "/crm/objectmeta/contact/describe": {
    POST: { oapiCrmObjectmetaContactDescribe: true }
  },
  "/crm/objectmeta/followrecord/describe": {
    POST: { oapiCrmObjectmetaFollowrecordDescribe: true }
  },
  "/cspace/add_to_single_chat": { POST: { oapiCspaceAddToSingleChat: true } },
  "/cspace/grant_custom_space": { GET: { oapiCspaceGrantCustomSpace: true } },
  "/cspace/get_custom_space": { GET: { oapiCspaceGetCustomSpace: true } },
  "/cspace/add": { GET: { oapiCspaceAdd: true } },
  "/chat/subadmin/update": { POST: { oapiChatSubadminUpdate: true } },
  "/chat/qrcode/get": { POST: { oapiChatQrcodeGet: true } },
  "/chat/member/friendswitch/update": {
    POST: { oapiChatMemberFriendswitchUpdate: true }
  },
  "/chat/updategroupnick": { POST: { oapiChatUpdategroupnick: true } },
  "/chat/update": { POST: { oapiChatUpdate: true } },
  "/chat/create": { POST: { oapiChatCreate: true } },
  "/chat/get": { GET: { oapiChatGet: true } },
  "/smartbot/msg/push": { POST: { oapiSmartbotMsgPush: true } }
});

// src/api/contact.ts
Internal.define({
  "/contact/organizations/authInfos": { GET: { getOrgAuthInfo: false } },
  "/contact/cooperateCorps/unionApplications/approve": {
    POST: { batchApproveUnionApply: false }
  }
});

// src/api/swform.ts
Internal.define({
  "/swform/instances/{formInstanceId}": { GET: { getFormInstance: false } },
  "/swform/forms/{formCode}/instances": { GET: { listFormInstances: false } },
  "/swform/users/forms": { GET: { listFormSchemasByCreator: false } }
});

// src/api/hrm.ts
Internal.define({
  "/hrm/processes/employees/terminations": {
    PUT: { hrmProcessUpdateTerminationInfo: false }
  },
  "/hrm/processes/regulars/become": { POST: { hrmProcessRegular: false } },
  "/hrm/employees/dismissions": { GET: { queryDismissionStaffIdList: false } },
  "/hrm/rosters/meta/fields/options": {
    PUT: { rosterMetaFieldOptionsUpdate: false }
  },
  "/hrm/processes/transfer": { POST: { hrmProcessTransfer: false } },
  "/hrm/employees/dimissionInfos": {
    GET: { queryHrmEmployeeDismissionInfo: false }
  },
  "/hrm/jobs": { GET: { queryJobs: false } },
  "/hrm/jobRanks": { GET: { queryJobRanks: false } },
  "/hrm/positions/query": { POST: { queryPositions: false } }
});

// src/api/todo.ts
Internal.define({
  "/todo/users/{unionId}/org/tasks/query": {
    POST: { queryOrgTodoTasks: false }
  },
  "/todo/users/{unionId}/tasks/{taskId}/executorStatus": {
    PUT: { updateTodoTaskExecutorStatus: false }
  },
  "/todo/users/{unionId}/tasks": { POST: { createTodoTask: false } },
  "/todo/users/{unionId}/tasks/{taskId}": {
    PUT: { updateTodoTask: false },
    DELETE: { deleteTodoTask: false }
  }
});

// src/api/attendance.ts
Internal.define({
  "/attendance/adjustments": { GET: { getAdjustments: false } },
  "/attendance/overtimeSettings": { GET: { getSimpleOvertimeSetting: false } },
  "/attendance/overtimeSettings/query": { POST: { getOvertimeSetting: false } }
});

// src/api/calendar.ts
Internal.define({
  "/calendar/users/{userId}/meetingRooms/schedules/query": {
    POST: { getMeetingRoomsSchedule: false }
  },
  "/calendar/users/{userId}/calendars/{calendarId}/events/{eventId}/meetingRooms": { POST: { addMeetingRooms: false } },
  "/calendar/users/{userId}/calendars/{calendarId}/events/{eventId}/meetingRooms/batchRemove": { POST: { removeMeetingRooms: false } },
  "/calendar/users/{userId}/calendars/{calendarId}/unsubscribe": {
    POST: { unsubscribeCalendar: false }
  },
  "/calendar/users/{userId}/subscribedCalendars/{calendarId}": {
    DELETE: { deleteSubscribedCalendar: false },
    GET: { getSubscribedCalendar: false }
  },
  "/calendar/users/{userId}/subscribedCalendars": {
    POST: { createSubscribedCalendar: false }
  },
  "/calendar/users/{userId}/calendars/{calendarId}/events/{eventId}/signOut": {
    POST: { signOut: false },
    GET: { getSignOutList: false }
  },
  "/calendar/users/{userId}/calendars/{calendarId}/subscribe": {
    POST: { subscribeCalendar: false }
  },
  "/calendar/users/{userId}/calendars/{calendarId}/events/{eventId}/attendees": { GET: { listAttendees: false }, POST: { addAttendee: false } },
  "/calendar/users/{userId}/calendars/{calendarId}/events/{eventId}/signin": {
    POST: { signIn: false },
    GET: { getSignInList: false }
  },
  "/calendar/users/{userId}/calendars/{calendarId}/acls": {
    GET: { listAcls: false },
    POST: { createAcls: false }
  },
  "/calendar/users/{userId}/calendars/{calendarId}/acls/{aclId}": {
    DELETE: { deleteAcl: false }
  },
  "/calendar/users/{userId}/calendars": { GET: { listCalendars: false } },
  "/calendar/users/{userId}/querySchedule": { POST: { getSchedule: false } },
  "/calendar/users/{userId}/calendars/{calendarId}/events": {
    GET: { listEvents: false },
    POST: { createEvent: false }
  },
  "/calendar/users/{userId}/calendars/{calendarId}/events/{eventId}": {
    GET: { getEvent: false },
    DELETE: { deleteEvent: false },
    PUT: { patchEvent: false }
  },
  "/calendar/users/{userId}/calendars/{calendarId}/events/{eventId}/attendees/batchRemove": { POST: { removeAttendee: false } },
  "/calendar/users/{userId}/calendars/{calendarId}/eventsview": {
    GET: { listEventsView: false }
  },
  "/calendar/users/{userId}/calendars/{calendarId}/events/{eventId}/respond": {
    POST: { respondEvent: false }
  }
});

// src/api/blackboard.ts
Internal.define({
  "/blackboard/spaces": { GET: { queryBlackboardSpace: false } }
});

// src/api/microApp.ts
Internal.define({
  "/microApp/innerMiniApps/{agentId}/versions/rollback": {
    POST: { rollbackInnerAppVersion: false }
  },
  "/microApp/innerMiniApps/{agentId}/versions/publish": {
    POST: { publishInnerAppVersion: false }
  },
  "/microApp/innerMiniApps/{agentId}/historyVersions": {
    GET: { pageInnerAppHistoryVersion: false }
  },
  "/microApp/innerMiniApps/{agentId}/versions": {
    GET: { listInnerAppVersion: false }
  },
  "/microApp/allInnerApps": { GET: { listAllInnerApps: false } },
  "/microApp/apps/{agentId}/scopes": {
    GET: { getMicroAppScope: false },
    POST: { setMicroAppScope: false }
  },
  "/microApp/users/{userId}/apps": { GET: { listUserVilebleApp: false } },
  "/microApp/allApps": { GET: { listAllApp: false } },
  "/microApp/apps/{agentId}": {
    DELETE: { deleteInnerApp: false },
    PUT: { updateInnerApp: false }
  },
  "/microApp/apps": { POST: { createInnerApp: false } }
});

// src/api/im.ts
Internal.define({
  "/im/sceneGroups/templates/robots": {
    GET: { querySceneGroupTemplateRobot: false }
  },
  "/im/sceneGroups/members/batchQuery": {
    POST: { batchQueryGroupMember: false }
  },
  "/im/sceneGroups/muteSettings": { GET: { queryGroupMuteStatus: false } },
  "/im/sceneGroups/muteMembers/set": { POST: { updateMemberBanWords: false } },
  "/im/sceneGroups/query": { POST: { getSceneGroupInfo: false } },
  "/im/sceneGroups/subAdmins": { PUT: { updateGroupSubAdmin: false } },
  "/im/sceneGroups/members/groupNicks": {
    PUT: { updateMemberGroupNick: false }
  },
  "/im/interactiveCards/templates/send": {
    POST: { sendTemplateInteractiveCard: false }
  },
  "/im/interactiveCards": { PUT: { updateInteractiveCard: false } },
  "/im/interactiveCards/send": { POST: { sendInteractiveCard: false } },
  "/im/robots/interactiveCards": { PUT: { updateRobotInteractiveCard: false } },
  "/im/v1.0/robot/interactiveCards/send": {
    POST: { sendRobotInteractiveCard: false }
  },
  "/im/chat/{chatId}/convertToOpenConversationId": {
    POST: { chatIdToOpenConversationId: false }
  },
  "/im/subAdministrators": { POST: { chatSubAdminUpdate: false } },
  "/im/interconnections/groups": { POST: { createGroupConversation: false } },
  "/im/interconnections/couples/groups": { POST: { createCoupleGroup: false } },
  "/im/interconnections/groups/owners": { PUT: { changeGroupOwner: false } },
  "/im/interconnections/groups/dismiss": {
    POST: { dismissGroupConversation: false }
  },
  "/im/interconnections/robotMessages/send": {
    POST: { sendRobotMessage: false }
  },
  "/im/interconnections/storeGroups": {
    POST: { createStoreGroupConversation: false }
  },
  "/im/interconnections/coupleGroups": {
    POST: { createCoupleGroupConversation: false }
  },
  "/im/interconnections/groups/names": { PUT: { updateGroupName: false } },
  "/im/interconnections/groups/avatars": { PUT: { updateGroupAvatar: false } },
  "/im/interconnections/doubleGroups/query": {
    POST: { querySingleGroup: false }
  },
  "/im/interconnections/conversations/members": {
    GET: { queryGroupMember: false }
  },
  "/im/interconnections/unReadMsgs/query": {
    POST: { queryUnReadMessage: false }
  },
  "/im/interconnections/messages/send": { POST: { sendMessage: false } },
  "/im/interconnections/groups/members/remove": {
    POST: { removeGroupMember: false }
  },
  "/im/interconnections/groups/members": { POST: { addGroupMember: false } },
  "/im/interconnections/dingMessages/send": {
    POST: { sendDingMessage: false }
  },
  "/im/conversations/urls": { POST: { getConversationUrl: false } },
  "/im/interconnections": { POST: { createInterconnection: false } },
  "/im/privateChat/interactiveCards/send": {
    POST: { sendOTOInteractiveCard: false }
  },
  "/im/topBoxes/close": { POST: { closeTopbox: false } },
  "/im/topBoxes": { POST: { createTopbox: false } }
});

// src/api/connector.ts
Internal.define({
  "/connector/data/{dataModelId}": { GET: { pullDataByPk: false } },
  "/connector/data": { GET: { pullDataByPage: false } },
  "/connector/triggers/data/sync": { POST: { syncData: false } }
});

// src/api/exclusive.ts
Internal.define({
  "/exclusive/enterpriseSecurities/userBehaviors/screenshots/query": {
    POST: { queryUserBehavior: false }
  },
  "/exclusive/trusts/publicDevices": { GET: { getPublicDevices: false } },
  "/exclusive/phoneDings/send": { POST: { sendPhoneDing: false } },
  "/exclusive/partners/users/{userId}": { GET: { queryPartnerInfo: false } },
  "/exclusive/data/conferences": { GET: { getConfBaseInfoByLogicalId: false } },
  "/exclusive/trusts/devices": { POST: { createTrustedDeviceBatch: false } },
  "/exclusive/fileAuditLogs": { GET: { listAuditLog: false } },
  "/exclusive/enterpriseSecurities/banOrOpenGroupWords": {
    PUT: { banOrOpenGroupWords: false }
  },
  "/exclusive/audits/users": { GET: { getSignedDetailByPage: false } },
  "/exclusive/comments/send": { POST: { publishFileChangeNotice: false } },
  "/exclusive/appDings/send": { POST: { sendAppDing: false } },
  "/exclusive/partnerLabels/{parentId}": {
    GET: { getPartnerTypeByParentId: false }
  },
  "/exclusive/partnerDepartments": {
    POST: { setDeptPartnerTypeAndNum: false },
    GET: { getAllLabelableDepts: false }
  }
});

// src/api/alitrip.ts
Internal.define({
  "/alitrip/billSettlements/btripTrains": {
    GET: { billSettementBtripTrain: false }
  },
  "/alitrip/billSettlements/hotels": { GET: { billSettementHotel: false } },
  "/alitrip/billSettlements/cars": { GET: { billSettementCar: false } },
  "/alitrip/billSettlements/flights": { GET: { billSettementFlight: false } },
  "/alitrip/exceedapply/getFlight": { GET: { getFlightExceedApply: false } },
  "/alitrip/unionOrders": { GET: { queryUnionOrder: false } },
  "/alitrip/exceedapply/getTrain": { GET: { getTrainExceedApply: false } },
  "/alitrip/exceedapply/getHotel": { GET: { getHotelExceedApply: false } },
  "/alitrip/exceedapply/sync": { POST: { syncExceedApply: false } },
  "/alitrip/cityCarApprovals": {
    GET: { queryCityCarApply: false },
    PUT: { approveCityCarApply: false },
    POST: { addCityCarApply: false }
  }
});

// src/api/project.ts
Internal.define({
  "/project/users/{userId}/projects/{projectId}/customfields": {
    PUT: { createProjectCustomfieldStatus: false }
  },
  "/project/users/{userId}/tasks/{taskId}/contents": {
    PUT: { updateTaskContent: false }
  },
  "/project/users/{userId}/tasks/{taskId}/notes": {
    PUT: { updateTaskNote: false }
  },
  "/project/users/{userId}/tasks/{taskId}/involveMembers": {
    PUT: { updateTaskInvolvemembers: false }
  },
  "/project/users/{userId}/tasks/{taskId}/executors": {
    PUT: { updateTaskExecutor: false }
  },
  "/project/users/{userId}/tasks/{taskId}/priorities": {
    PUT: { updateTaskPriority: false }
  },
  "/project/users/{userId}/tasks/{taskId}/dueDates": {
    PUT: { updateTaskDueDate: false }
  },
  "/project/users/{userId}/tasks": {
    GET: { getTaskByIds: false },
    POST: { createTask: false }
  },
  "/project/users/{userId}/tasks/{taskId}/archive": {
    POST: { archiveTask: false }
  },
  "/project/users/{userId}/tasks/search": { POST: { searchUserTask: false } },
  "/project/users/{userId}/projects/{projectId}/taskStages/search": {
    POST: { seachTaskStage: false }
  },
  "/project/users/{userId}/projects/{projectId}/taskLists/search": {
    POST: { searchTaskList: false }
  },
  "/project/users/{userId}/projects/{projectId}/taskflows/search": {
    POST: { searchTaskFlow: false }
  },
  "/project/users/{userId}/projects/{projectId}/statuses": {
    GET: { getProjectStatusList: false }
  },
  "/project/users/{userId}/projects/{projectId}/members/remove": {
    POST: { deleteProjectMember: false }
  },
  "/project/users/{userId}/projects/{projectId}/members": {
    GET: { getProjectMemebers: false },
    POST: { addProjectMember: false }
  },
  "/project/users/{userId}/projects/query": { POST: { queryProject: false } },
  "/project/users/{userId}/projects/{projectId}/taskflowStatuses/search": {
    GET: { searchTaskflowStatus: false }
  },
  "/project/users/{userId}/tasks/{taskId}/taskflowStatuses": {
    PUT: { updateTaskTaskflowstatus: false }
  },
  "/project/users/{userId}/tasks/{taskId}/startDates": {
    PUT: { updateTaskStartdate: false }
  },
  "/project/users/{userId}/projects": { POST: { createProject: false } },
  "/project/users/{userId}/joinProjects": {
    GET: { getUserJoinedProject: false }
  },
  "/project/users/{userId}/projects/{projectId}/archive": {
    POST: { archiveProject: false }
  },
  "/project/users/{userId}/projects/{projectId}/unsuspend": {
    POST: { unSuspendProject: false }
  },
  "/project/users/{userId}/projects/{projectId}/suspend": {
    POST: { suspendProject: false }
  },
  "/project/users/{userId}/projectIds/{projectId}/tasks": {
    GET: { queryTaskOfProject: false }
  },
  "/project/users/{userId}/workTimes": { POST: { createWorkTime: false } },
  "/project/users/{userId}/planTimes": { POST: { createPlanTime: false } },
  "/project/users/{userId}/tasks/{taskId}/customFields": {
    PUT: { updateCustomfieldValue: false }
  },
  "/project/teambition/users": { GET: { getTbUserIdByStaffId: false } },
  "/project/teambition/organizations": {
    GET: { getTbOrgIdByDingOrgId: false }
  },
  "/project/users/{userId}/projects/{projectId}/groups": {
    PUT: { updateProjectGroup: false }
  },
  "/project/users/{userId}/templates/projects": {
    POST: { createProjectByTemplate: false }
  },
  "/project/organizations/users/{userId}/groups": {
    GET: { getProjectGroup: false }
  },
  "/project/organizations/users/{userId}/templates": {
    GET: { searchProjectTemplate: false }
  },
  "/project/users/{userId}/tasks/{taskId}/objectLinks": {
    POST: { createTaskObjectLink: false }
  },
  "/project/organizations/users/{userId}/tasks": {
    GET: { getOrganizatioTaskByIds: false },
    POST: { createOrganizationTask: false }
  },
  "/project/organizations/users/{userId}/tasks/{taskId}/priorities": {
    PUT: { updateOrganizationTaskPriority: false }
  },
  "/project/organizations/users/{userId}/tasks/{taskId}/notes": {
    PUT: { updateOrganizationTaskNote: false }
  },
  "/project/organizations/users/{userId}/tasks/{taskId}/involveMembers": {
    PUT: { updateOrganizationTaskInvolveMembers: false }
  },
  "/project/organizations/users/{userId}/tasks/{taskId}/executors": {
    PUT: { updateOrganizationTaskExecutor: false }
  },
  "/project/organizations/users/{userId}/tasks/{taskId}/dueDates": {
    PUT: { updateOrganizationTaskDueDate: false }
  },
  "/project/organizations/users/{userId}/tasks/{taskId}/contents": {
    PUT: { updateOrganizationTaskContent: false }
  },
  "/project/organizations/users/{userId}/tasks/{taskId}/states": {
    PUT: { updateOrganizationTaskStatus: false }
  },
  "/project/organizations/users/{userId}/priorities": {
    GET: { getOrganizationPriorityList: false }
  },
  "/project/organizations/users/{userId}/tasks/{taskId}": {
    GET: { getOrganizationTask: false }
  },
  "/project/users/{userId}/tasks/{taskId}": { DELETE: { deleteTask: false } }
});

// src/api/edu.ts
Internal.define({ "/edu/students/move": { POST: { moveStudent: false } } });

// src/api/crm.ts
Internal.define({
  "/crm/globalInfos": { GET: { queryGlobalInfo: false } },
  "/crm/followRecords/batch": {
    PUT: { batchUpdateFollowRecords: false },
    POST: { batchAddFollowRecords: false }
  },
  "/crm/followRecords/batchRemove": {
    POST: { batchRemoveFollowRecords: false }
  },
  "/crm/customObjectDatas/instances/{instanceId}": {
    DELETE: { deleteCrmCustomObjectData: false }
  },
  "/crm/contacts/batch": {
    PUT: { batchUpdateContacts: false },
    POST: { batchAddContacts: false }
  },
  "/crm/relationDatas/batch": {
    POST: { batchAddRelationDatas: false },
    PUT: { batchUpdateRelationDatas: false }
  },
  "/crm/relationUkSettings": { GET: { getRelationUkSetting: false } },
  "/crm/groups": { POST: { crmCreateGroup: false } },
  "/crm/crmGroupChats/batchQuery": { POST: { getCrmGroupChatMulti: false } },
  "/crm/crmGroupChats/query": { POST: { getCrmGroupChatSingle: false } },
  "/crm/relations/datas/targets/{targetId}": {
    GET: { queryRelationDatasByTargetId: false }
  },
  "/crm/crmGroupChats": { GET: { queryCrmGroupChats: false } },
  "/crm/groupSets/set": { PUT: { crmUpdateGroupSet: false } },
  "/crm/groupSets/lists": { GET: { listGroupSet: false } },
  "/crm/groupSets": {
    POST: { createGroupSet: false },
    GET: { getGroupSet: false }
  },
  "/crm/personalCustomers": {
    PUT: { updateCrmPersonalCustomer: false },
    POST: { addCrmPersonalCustomer: false },
    GET: { queryCrmPersonalCustomer: false }
  },
  "/crm/personalCustomers/{dataId}": {
    DELETE: { deleteCrmPersonalCustomer: false }
  },
  "/crm/personalCustomers/objectMeta": {
    GET: { describeCrmPersonalCustomerObjectMeta: false }
  },
  "/crm/personalCustomers/batchQuery": {
    POST: { listCrmPersonalCustomers: false }
  },
  "/crm/customerInstances": { POST: { queryAllCustomer: false } },
  "/crm/officialAccounts/oToMessages/send": {
    POST: { sendOfficialAccountOTOMessage: false }
  },
  "/crm/officialAccounts/oToMessages/batchSend": {
    POST: { batchSendOfficialAccountOTOMessage: false }
  }
});

// src/api/yida.ts
Internal.define({
  "/yida/forms": { GET: { getFormListInApp: false } },
  "/yida/forms/formFields": { GET: { getFieldDefByUuid: false } },
  "/yida/tasks/batches/execute": { POST: { executeBatchTask: false } },
  "/yida/forms/operationsLogs/query": { POST: { listOperationLogs: false } },
  "/yida/forms/remarks/query": { POST: { listFormRemarks: false } },
  "/yida/services/invocationRecords": { GET: { queryServiceRecord: false } },
  "/yida/forms/instances/batchRemove": {
    POST: { batchRemovalByFormInstanceIdList: false }
  },
  "/yida/forms/instances/components": {
    PUT: { batchUpdateFormDataByInstanceId: false }
  },
  "/yida/forms/instances/datas": {
    PUT: { batchUpdateFormDataByInstanceMap: false }
  },
  "/yida/organizations/applications": { GET: { listApplication: false } },
  "/yida/forms/instances/batchSave": { POST: { batchSaveFormData: false } },
  "/yida/forms/instances/advances/query": {
    POST: { searchFormDataSecondGenerationNoTableField: false }
  },
  "/yida/forms/instances/insertOrUpdate": {
    POST: { createOrUpdateFormData: false }
  },
  "/yida/forms/instances/advances/queryAll": {
    POST: { searchFormDataSecondGeneration: false }
  },
  "/yida/forms/instances/ids/query": {
    POST: { batchGetFormDataByIdList: false }
  },
  "/yida/tasks/taskCopies": { GET: { getTaskCopies: false } },
  "/yida/forms/instances/ids/{appType}/{formUuid}": {
    POST: { searchFormDataIdList: false }
  },
  "/yida/forms/innerTables/{formInstanceId}": {
    GET: { listTableDataByFormInstanceIdTableId: false }
  },
  "/yida/tasks/completedTasks/{corpId}/{userId}": {
    GET: { getCorpAccomplishmentTasks: false }
  },
  "/yida/forms/definitions/{appType}/{formUuid}": {
    GET: { getFormComponentDefinitionList: false }
  },
  "/yida/processes/instanceIds": { POST: { getInstanceIdList: false } },
  "/yida/processes/instances/searchWithIds": {
    GET: { getInstancesByIdList: false }
  },
  "/yida/tasks/myCorpSubmission/{userId}": {
    GET: { getMeCorpSubmission: false }
  },
  "/yida/processes/definitions/{processInstanceId}": {
    GET: { getProcessDefinition: false }
  },
  "/yida/corpTasks": { GET: { getCorpTasks: false } },
  "/yida/corpNotifications/{userId}": { GET: { getNotifyMe: false } },
  "/yida/processDefinitions/buttons/{appType}/{processCode}/{activityId}": {
    GET: { getActivityButtonList: false }
  },
  "/yida/authorization/platformResources": {
    GET: { getApplicationAuthorizationServicePlatformResource: false }
  },
  "/yida/processes/instances": {
    PUT: { updateInstance: false },
    DELETE: { deleteInstance: false },
    POST: { getInstances: false }
  },
  "/yida/processes/operationRecords": { GET: { getOperationRecords: false } },
  "/yida/processes/instances/terminate": { PUT: { terminateInstance: false } },
  "/yida/tasks/execute": { POST: { executeTask: false } },
  "/yida/tasks/platformTasks/execute": { POST: { executePlatformTask: false } },
  "/yida/tasks/redirect": { POST: { redirectTask: false } },
  "/yida/apps/temporaryUrls/{appType}": { GET: { getOpenUrl: false } },
  "/yida/forms/remarks": { POST: { saveFormRemark: false } },
  "/yida/apps/navigations": { GET: { listNavigationByFormType: false } },
  "/yida/apps/orderBuy/validate": { GET: { validateOrderBuy: false } },
  "/yida/processes/tasks/getRunningTasks": { GET: { getRunningTasks: false } },
  "/yida/processes/activities": { GET: { getActivityList: false } },
  "/yida/apps/customApi/execute": { POST: { executeCustomApi: false } },
  "/yida/apps/activationCode/information": {
    GET: { searchActivationCode: false }
  },
  "/yida/apps/saleUserInfo": { GET: { getSaleUserInfoByUserId: false } },
  "/yida/apps/corpLevel": { GET: { getCorpLevelByAccountId: false } },
  "/yida/forms/status": { PUT: { updateStatus: false } },
  "/yida/apps/orderUpgrade/validate": { GET: { validateOrderUpgrade: false } },
  "/yida/appAuth/commodities/release": { DELETE: { releaseCommodity: false } },
  "/yida/appAuth/commodities/expire": { PUT: { expireCommodity: false } },
  "/yida/appAuth/commodities/refund": { POST: { refundCommodity: false } },
  "/yida/forms/employeeFields": { POST: { searchEmployeeFieldValues: false } },
  "/yida/forms/deleteSequence": { DELETE: { deleteSequence: false } },
  "/yida/forms/instances": {
    POST: { saveFormData: false },
    PUT: { updateFormData: false },
    DELETE: { deleteFormData: false }
  },
  "/yida/forms/instances/search": { POST: { searchFormDatas: false } },
  "/yida/processes/instancesInfos/{id}": { GET: { getInstanceById: false } },
  "/yida/processes/instances/start": { POST: { startInstance: false } },
  "/yida/forms/instances/{id}": { GET: { getFormDataByID: false } }
});

// src/api/drive.ts
Internal.define({
  "/drive/spaces/customSpaces": { POST: { addCustomSpace: false } },
  "/drive/spaces/{spaceId}": { DELETE: { deleteSpace: false } },
  "/drive/spaces": {
    POST: { driveAddSpace: false },
    GET: { listSpaces: false }
  }
});

// src/api/workbench.ts
Internal.define({
  "/workbench/components/recentUsed/batch": {
    POST: { addRecentUserAppList: false }
  },
  "/workbench/plugins/validationRules": {
    GET: { getPluginRuleCheckInfo: false }
  },
  "/workbench/plugins/permissions": {
    GET: { getPluginPermissionPoint: false }
  }
});

// src/api/robot.ts
Internal.define({
  "/robot/groups/robots/query": { POST: { getBotListInGroup: false } },
  "/robot/messageFiles/download": { POST: { robotMessageFileDownload: false } },
  "/robot/plugins/clear": { POST: { clearRobotPlugin: false } },
  "/robot/plugins/set": { POST: { setRobotPlugin: false } },
  "/robot/plugins/query": { POST: { queryRobotPlugin: false } },
  "/robot/groupMessages/recall": { POST: { orgGroupRecall: false } },
  "/robot/groupMessages/query": { POST: { orgGroupQuery: false } },
  "/robot/groupMessages/send": { POST: { orgGroupSend: false } },
  "/robot/otoMessages/batchRecall": { POST: { batchRecallOTO: false } },
  "/robot/oToMessages/readStatus": { GET: { batchOTOQuery: false } },
  "/robot/oToMessages/batchSend": { POST: { batchSendOTO: false } },
  "/robot/privateChatMessages/send": { POST: { privateChatSend: false } },
  "/robot/privateChatMessages/query": { POST: { privateChatQuery: false } },
  "/robot/privateChatMessages/batchRecall": {
    POST: { batchRecallPrivateChat: false }
  }
});

// src/api/conference.ts
Internal.define({
  "/conference/videoConferences/{conferenceId}/users/invite": {
    POST: { inviteUsers: false }
  },
  "/conference/videoConferences/{conferenceId}/focus": {
    POST: { focus: false }
  },
  "/conference/videoConferences/{conferenceId}/coHosts/set": {
    POST: { cohosts: false }
  },
  "/conference/videoConferences/{conferenceId}/members/mute": {
    POST: { muteMembers: false }
  },
  "/conference/videoConferences/scheduleConferences/{scheduleConferenceId}": {
    GET: { queryScheduleConferenceInfo: false }
  },
  "/conference/videoConferences/{conferenceId}/cloudRecords/getVideos": {
    GET: { queryCloudRecordVideo: false }
  },
  "/conference/videoConferences/{conferenceId}/cloudRecords/getTexts": {
    GET: { queryCloudRecordText: false }
  },
  "/conference/videoConferences/{conferenceId}/cloudRecords/videos/getPlayInfos": { GET: { queryCloudRecordVideoPlayInfo: false } },
  "/conference/videoConferences/{conferenceId}/cloudRecords/stop": {
    POST: { stopCloudRecord: false }
  },
  "/conference/videoConferences/{conferenceId}/streamOuts/stop": {
    POST: { stopStreamOut: false }
  },
  "/conference/videoConferences/{conferenceId}/streamOuts/start": {
    POST: { startStreamOut: false }
  },
  "/conference/videoConferences/{conferenceId}/cloudRecords/start": {
    POST: { startCloudRecord: false }
  },
  "/conference/videoConferences/query": {
    POST: { queryConferenceInfoBatch: false }
  },
  "/conference/videoConferences/{conferenceId}": {
    DELETE: { closeVideoConference: false },
    GET: { queryConferenceInfo: false }
  },
  "/conference/videoConferences": { POST: { createVideoConference: false } },
  "/conference/videoConferences/{conferenceId}/members": {
    GET: { queryConferenceMembers: false }
  },
  "/conference/scheduleConferences/cancel": {
    POST: { cancelScheduleConference: false }
  },
  "/conference/scheduleConferences/{scheduleConferenceId}/infos": {
    GET: { queryScheduleConference: false }
  },
  "/conference/scheduleConferences": {
    PUT: { updateScheduleConference: false },
    POST: { createScheduleConference: false }
  }
});

// src/api/serviceGroup.ts
Internal.define({
  "/serviceGroup/groups/members": { POST: { addMemberToServiceGroup: false } },
  "/serviceGroup/messages/tasks/send": { POST: { sendMsgByTask: false } },
  "/serviceGroup/normalGroups/upgrade": { POST: { upgradeNormalGroup: false } },
  "/serviceGroup/cloudGroups/upgrade": { POST: { upgradeCloudGroup: false } },
  "/serviceGroup/groups/queryActiveUsers": { GET: { queryActiveUsers: false } },
  "/serviceGroup/messages/send": { POST: { sendServiceGroupMessage: false } },
  "/serviceGroup/groups": { POST: { serviceGroupCreateGroup: false } },
  "/serviceGroup/groups/configurations": {
    PUT: { serviceGroupUpdateGroupSet: false }
  }
});

// src/api/customerService.ts
Internal.define({
  "/customerService/tickets/{ticketId}": { PUT: { executeActivity: false } },
  "/customerService/tickets/{ticketId}/actions": {
    GET: { pageListAction: false }
  },
  "/customerService/tickets": {
    GET: { pageListTicket: false },
    POST: { createTicket: false }
  }
});

// src/api/esign.ts
Internal.define({
  "/esign/flowTasks/{taskId}/docs": { GET: { getFlowDocs: false } },
  "/esign/approvals/{taskId}": { GET: { approvalList: false } }
});

// src/api/jzcrm.ts
Internal.define({
  "/jzcrm/contacts": { POST: { editContact: false } },
  "/jzcrm/customerPools": { POST: { editCustomerPool: false } },
  "/jzcrm/exchanges": { POST: { editExchange: false } },
  "/jzcrm/goods": { POST: { editGoods: false } },
  "/jzcrm/outstocks": { POST: { editOutstock: false } },
  "/jzcrm/intostocks": { POST: { editIntostock: false } },
  "/jzcrm/productions": { POST: { editProduction: false } },
  "/jzcrm/purchases": { POST: { editPurchase: false } },
  "/jzcrm/orders": { POST: { editOrder: false } },
  "/jzcrm/invoices": { POST: { editInvoice: false } },
  "/jzcrm/customers": { POST: { editCustomer: false } },
  "/jzcrm/dataView": { GET: { getDataView: false } },
  "/jzcrm/data": { GET: { getDataList: false } }
});

// src/api/badge.ts
Internal.define({
  "/badge/notices": { POST: { createBadgeNotify: false } },
  "/badge/codes/verifyResults": {
    POST: { notifyBadgeCodeVerifyResult: false }
  },
  "/badge/codes/corpInstances": { POST: { saveBadgeCodeCorpInstance: false } },
  "/badge/codes/payResults": { POST: { notifyBadgeCodePayResult: false } },
  "/badge/codes/userInstances": {
    POST: { createBadgeCodeUserInstance: false },
    PUT: { updateBadgeCodeUserInstance: false }
  },
  "/badge/codes/refundResults": {
    POST: { notifyBadgeCodeRefundResult: false }
  },
  "/badge/codes/decode": { POST: { decodeBadgeCode: false } }
});

// src/api/datacenter.ts
Internal.define({
  "/datacenter/generalDataServices": {
    GET: { queryGeneralDataService: false }
  },
  "/datacenter/onlineUserData": {
    GET: { queryOnlineUserStatisticalData: false }
  },
  "/datacenter/activeUserData": {
    GET: { queryActiveUserStatisticalData: false }
  },
  "/datacenter/employeeTypeData": {
    GET: { queryEmployeeTypeStatisticalData: false }
  },
  "/datacenter/circleData": { GET: { queryCircleStatisticalData: false } },
  "/datacenter/singleMessagerData": {
    GET: { querySingleMessageStatisticalData: false }
  },
  "/datacenter/groupMessageData": {
    GET: { queryGroupMessageStatisticalData: false }
  },
  "/datacenter/dingSendData": { GET: { queryDingSendStatisticalData: false } },
  "/datacenter/dingReciveData": {
    GET: { queryDingReciveStatisticalData: false }
  },
  "/datacenter/vedioMeetingData": {
    GET: { queryVedioMeetingStatisticalData: false }
  },
  "/datacenter/telMeetingData": {
    GET: { queryTelMeetingStatisticalData: false }
  },
  "/datacenter/groupLiveData": {
    GET: { queryGroupLiveStatisticalData: false }
  },
  "/datacenter/redEnvelopeSendData": {
    GET: { queryRedEnvelopeSendStatisticalData: false }
  },
  "/datacenter/redEnvelopeReciveData": {
    GET: { queryRedEnvelopeReciveStatisticalData: false }
  },
  "/datacenter/blackboardData": {
    GET: { queryBlackboardStatisticalData: false }
  },
  "/datacenter/todoUserData": { GET: { queryTodoStatisticalData: false } },
  "/datacenter/healtheUserData": { GET: { queryHealthStatisticalData: false } },
  "/datacenter/documentData": { GET: { queryDocumentStatisticalData: false } },
  "/datacenter/checkinData": { GET: { queryCheckinStatisticalData: false } },
  "/datacenter/approvalData": { GET: { queryApprovalStatisticalData: false } },
  "/datacenter/reportData": { GET: { queryReportStatisticalData: false } },
  "/datacenter/attendanceData": {
    GET: { queryAttendanceStatisticalData: false }
  },
  "/datacenter/driveData": { GET: { queryDriveStatisticalData: false } },
  "/datacenter/mailData": { GET: { queryMailStatisticalData: false } },
  "/datacenter/calendarData": { GET: { queryCalendarStatisticalData: false } },
  "/datacenter/digitalCounty/orgInfos/query": {
    POST: { queryDigitalDistrictOrgInfo: false }
  }
});

// src/api/resident.ts
Internal.define({
  "/resident/points": { POST: { addPoint: false } },
  "/resident/points/records": { GET: { pagePointHistory: false } },
  "/resident/points/rules": { GET: { listPointRules: false } },
  "/resident/industryRoles/users": { GET: { listIndustryRoleUsers: false } },
  "/resident/users/industryRoles": { GET: { listUserIndustryRoles: false } }
});

// src/api/wiki.ts
Internal.define({
  "/wiki/nodes": { GET: { listNodes: false } },
  "/wiki/nodes/queryByUrl": { POST: { getNodeByUrl: false } },
  "/wiki/nodes/batchQuery": { POST: { getNodes: false } },
  "/wiki/nodes/{nodeId}": { GET: { getNode: false } },
  "/wiki/words/details": { GET: { wikiWordsDetail: false } },
  "/wiki/words/parse": { POST: { wikiWordsParse: false } }
});

// src/api/storage.ts
Internal.define({
  "/storage/workspaces/search": { POST: { searchWorkspaces: false } },
  "/storage/spaces/dentries/{dentryUuid}/permissions/inheritances": {
    PUT: { setPermissionInheritance: false },
    GET: { getPermissionInheritance: false }
  },
  "/storage/spaces/dentries/{dentryUuid}/permissions": {
    PUT: { storageUpdatePermission: false },
    POST: { storageAddPermission: false }
  },
  "/storage/spaces/dentries/{dentryUuid}/permissions/remove": {
    POST: { storageDeletePermission: false }
  },
  "/storage/spaces/dentries/{dentryUuid}/permissions/query": {
    POST: { listPermissionsOrg: false }
  },
  "/storage/dentries/search": { POST: { searchDentries: false } },
  "/storage/spaces/files/{parentDentryUuid}/commit": {
    POST: { storageCommitFile: false }
  },
  "/storage/spaces/files/{parentDentryUuid}/uploadInfos/query": {
    POST: { storageGetFileUploadInfo: false }
  },
  "/storage/events/unsubscribe": { POST: { unsubscribeEvent: false } },
  "/storage/spaces/{spaceId}/dentries/listAll": {
    POST: { listAllDentries: false }
  },
  "/storage/spaces/{spaceId}/dentries/query": { POST: { getDentries: false } },
  "/storage/spaces/{spaceId}/thumbnails/query": {
    POST: { getDentryThumbnails: false }
  },
  "/storage/spaces/{spaceId}/dentries/batchMove": {
    POST: { moveDentries: false }
  },
  "/storage/spaces/{spaceId}/dentries/batchCopy": {
    POST: { copyDentries: false }
  },
  "/storage/spaces/{spaceId}/dentries/batchRemove": {
    POST: { deleteDentries: false }
  },
  "/storage/tasks/{taskId}": { GET: { getTask: false } },
  "/storage/spaces/{spaceId}/files/multiPartUploadInfos/init": {
    POST: { initMultipartFileUpload: false }
  },
  "/storage/spaces/files/multiPartUploadInfos/query": {
    POST: { getMultipartFileUploadInfos: false }
  },
  "/storage/orgs/{corpId}": { GET: { getOrg: false } },
  "/storage/recycleBins/{recycleBinId}/recycleItems/{recycleItemId}/restore": {
    POST: { restoreRecycleItem: false }
  },
  "/storage/recycleBins": { GET: { getRecycleBin: false } },
  "/storage/recycleBins/{recycleBinId}/recycleItems/{recycleItemId}": {
    GET: { getRecycleItem: false },
    DELETE: { deleteRecycleItem: false }
  },
  "/storage/recycleBins/{recycleBinId}/clear": {
    POST: { clearRecycleBin: false }
  },
  "/storage/recycleBins/{recycleBinId}/recycleItems/batchRemove": {
    POST: { deleteRecycleItems: false }
  },
  "/storage/recycleBins/{recycleBinId}/recycleItems/batchRestore": {
    POST: { restoreRecycleItems: false }
  },
  "/storage/spaces/{spaceId}/dentries/{dentryId}/versions": {
    GET: { listDentryVersions: false }
  },
  "/storage/spaces/{spaceId}/dentries/{dentryId}/openInfos/query": {
    POST: { getDentryOpenInfo: false }
  },
  "/storage/spaces/{spaceId}/dentries/{dentryId}/move": {
    POST: { moveDentry: false }
  },
  "/storage/spaces/{spaceId}/dentries/{dentryId}/permissions/query": {
    POST: { listPermissionsIsv: false }
  },
  "/storage/spaces/{spaceId}/dentries/{dentryId}/downloadInfos/query": {
    POST: { getFileDownloadInfo: false }
  },
  "/storage/recycleBins/{recycleBinId}/recycleItems": {
    GET: { listRecycleItems: false }
  },
  "/storage/spaces/{spaceId}/dentries/{dentryId}": {
    DELETE: { deleteDentry: false }
  },
  "/storage/spaces/{spaceId}/dentries/{dentryId}/rename": {
    POST: { renameDentry: false }
  },
  "/storage/spaces/{spaceId}/dentries": { GET: { listDentries: false } },
  "/storage/spaces/{spaceId}/dentries/{dentryId}/versions/{version}/revert": {
    POST: { revertDentryVersion: false }
  },
  "/storage/spaces/{spaceId}/dentries/{dentryId}/copy": {
    POST: { copyDentry: false }
  },
  "/storage/currentApps/query": { POST: { getCurrentApp: false } },
  "/storage/spaces/{spaceId}": { GET: { storageGetSpace: false } },
  "/storage/spaces/{spaceId}/dentries/{parentId}/folders": {
    POST: { addFolder: false }
  },
  "/storage/spaces/{spaceId}/dentries/{dentryId}/query": {
    POST: { getDentry: false }
  },
  "/storage/spaces/{spaceId}/dentries/{dentryId}/appProperties/remove": {
    POST: { deleteDentryAppProperties: false }
  },
  "/storage/spaces/{spaceId}/dentries/{dentryId}/appProperties": {
    PUT: { updateDentryAppProperties: false }
  },
  "/storage/spaces/{spaceId}/files/commit": {
    POST: { storageCommitFile: false }
  },
  "/storage/spaces/{spaceId}/files/uploadInfos/query": {
    POST: { storageGetFileUploadInfo: false }
  },
  "/storage/spaces/{spaceId}/dentries/{dentryId}/permissions": {
    PUT: { storageUpdatePermission: false },
    POST: { storageAddPermission: false }
  },
  "/storage/spaces/{spaceId}/dentries/{dentryId}/permissions/remove": {
    POST: { storageDeletePermission: false }
  },
  "/storage/spaces": { POST: { storageAddSpace: false } }
});

// src/api/doc.ts
Internal.define({
  "/doc/workbooks/{workbookId}/sheets/{sheetId}/setRowsVisibility": {
    POST: { setRowsVisibility: false }
  },
  "/doc/workbooks/{workbookId}/sheets/{sheetId}/setColumnsVisibility": {
    POST: { setColumnsVisibility: false }
  },
  "/doc/workbooks/{workbookId}/sheets/{sheetId}/deleteRows": {
    POST: { deleteRows: false }
  },
  "/doc/workbooks/{workbookId}/sheets/{sheetId}/deleteColumns": {
    POST: { deleteColumns: false }
  },
  "/doc/workbooks/{workbookId}/sheets/{sheetId}/insertRowsBefore": {
    POST: { insertRowsBefore: false }
  },
  "/doc/workbooks/{workbookId}/sheets/{sheetId}/insertColumnsBefore": {
    POST: { insertColumnsBefore: false }
  },
  "/doc/workbooks/{workbookId}/sheets/{sheetId}/ranges/{rangeAddress}/clear": {
    POST: { clear: false }
  },
  "/doc/workbooks/{workbookId}/sheets/{sheetId}/ranges/{rangeAddress}/clearData": { POST: { clearData: false } }
});

// src/api/diot.ts
Internal.define({ "/diot/upgrade/device": { POST: { upgradeDevice: false } } });

// src/api/h3yun.ts
Internal.define({
  "/h3yun/attachments/uploadUrls": { GET: { getUploadUrl: false } },
  "/h3yun/apps/functionNodes": { GET: { queryAppFunctionNodes: false } },
  "/h3yun/processes/instances": {
    POST: { createProcessesInstance: false },
    DELETE: { deleteProcessesInstance: false },
    GET: { queryProcessesInstance: false }
  },
  "/h3yun/forms/loadBizFields": { GET: { loadBizFields: false } },
  "/h3yun/processes/workItems": { GET: { queryProcessesWorkItems: false } },
  "/h3yun/forms/instances/batch": { POST: { batchInsertBizObject: false } },
  "/h3yun/forms/instances": {
    DELETE: { deleteBizObject: false },
    POST: { createBizObject: false },
    PUT: { updateBizObject: false }
  },
  "/h3yun/processes/instances/cancel": {
    POST: { cancelProcessInstance: false }
  },
  "/h3yun/forms/instances/loadInstances": { GET: { loadBizObject: false } },
  "/h3yun/forms/instances/search": { POST: { loadBizObjects: false } },
  "/h3yun/attachments/temporaryUrls": {
    GET: { getAttachmentTemporaryUrl: false }
  },
  "/h3yun/roles/roleUsers": { GET: { getRoleUsers: false } },
  "/h3yun/roles": { GET: { getRoles: false } },
  "/h3yun/users": { GET: { getUsers: false } },
  "/h3yun/apps/search": { POST: { getApps: false } },
  "/h3yun/departments": { GET: { getOrganizations: false } }
});

// src/api/link.ts
Internal.define({
  "/link/followers/statuses": { GET: { getUserFollowStatus: false } },
  "/link/accounts": { GET: { listAccount: false } },
  "/link/followers": { GET: { listFollower: false } },
  "/link/followers/infos": { GET: { getFollowerInfo: false } }
});

// src/api/pedia.ts
Internal.define({
  "/pedia/words/query": { POST: { pediaWordsQuery: false } },
  "/pedia/words/search": { POST: { pediaWordsSearch: false } },
  "/pedia/words/approve": { POST: { pediaWordsApprove: false } },
  "/pedia/words": {
    DELETE: { pediaWordsDelete: false },
    PUT: { pediaWordsUpdate: false },
    POST: { pediaWordsAdd: false }
  }
});

// src/api/devicemng.ts
Internal.define({
  "/devicemng/customers/devices/maintainInfos/query": {
    POST: { listMaintainInfo: false }
  },
  "/devicemng/customers/devices/inspectInfos/query": {
    POST: { listInspectInfo: false }
  },
  "/devicemng/customers/devices/activations/infos": {
    GET: { listActivateDevices: false }
  },
  "/devicemng/customers/devices/registrationActivations/batch": {
    POST: { registerAndActivateDeviceBatch: false }
  },
  "/devicemng/customers/devices/registerAndActivate": {
    POST: { registerAndActivateDevice: false }
  }
});

// src/api/convFile.ts
Internal.define({
  "/convFile/conversations/files/links/send": { POST: { sendLink: false } },
  "/convFile/conversations/files/send": { POST: { send: false } },
  "/convFile/conversations/spaces/query": { POST: { convFileGetSpace: false } },
  "/convFile/apps/conversations/files/send": { POST: { sendByApp: false } }
});

// src/api/industry.ts
Internal.define({
  "/industry/campuses/projectInfos": { GET: { campusGetCampus: false } },
  "/industry/campuses/projects/groupInfos": {
    GET: { campusGetCampusGroup: false }
  },
  "/industry/campuses/projects": { POST: { campusCreateCampus: false } },
  "/industry/campuses/projects/groups": {
    POST: { campusCreateCampusGroup: false },
    DELETE: { campusDeleteCampusGroup: false }
  }
});

// src/api/live.ts
Internal.define({
  "/live/lives": {
    DELETE: { deleteLive: false },
    PUT: { updateLive: false },
    POST: { createLive: false },
    GET: { queryLiveInfo: false }
  },
  "/live/lives/watchUsers": { GET: { queryLiveWatchUserList: false } },
  "/live/lives/watchDetails": { GET: { queryLiveWatchDetail: false } }
});

// src/api/card.ts
Internal.define({
  "/card/instances": {
    PUT: { updateCard: false },
    POST: { createCard: false }
  },
  "/card/instances/createAndDeliver": { POST: { createAndDeliver: false } },
  "/card/callbacks/register": { POST: { registerCallback: false } },
  "/card/instances/spaces": { PUT: { appendSpace: false } },
  "/card/instances/deliver": { POST: { deliverCard: false } }
});

// src/api/rooms.ts
Internal.define({
  "/rooms/devices/properties/query": { POST: { queryDeviceProperties: false } },
  "/rooms/devices": { GET: { queryMeetingRoomDevice: false } },
  "/rooms/groups/{groupId}": {
    DELETE: { deleteMeetingRoomGroup: false },
    GET: { queryMeetingRoomGroup: false }
  },
  "/rooms/groups": {
    PUT: { updateMeetingRoomGroup: false },
    POST: { createMeetingRoomGroup: false }
  },
  "/rooms/groupLists": { GET: { queryMeetingRoomGroupList: false } },
  "/rooms/meetingRooms/{roomId}": {
    DELETE: { deleteMeetingRoom: false },
    GET: { queryMeetingRoom: false }
  },
  "/rooms/meetingRoomLists": { GET: { queryMeetingRoomList: false } },
  "/rooms/meetingRooms": { PUT: { updateMeetingRoom: false } },
  "/rooms/meetingrooms": { POST: { createMeetingRoom: false } }
});

// src/index.ts
var src_default = DingtalkBot;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DingtalkBot,
  DingtalkMessageEncoder,
  HttpServer,
  decodeMessage,
  escape,
  unescape
});
