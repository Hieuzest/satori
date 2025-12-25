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
  HttpServer: () => HttpServer,
  WechatOfficialBot: () => WechatOfficialBot,
  WechatOfficialMessageEncoder: () => WechatOfficialMessageEncoder,
  decodeMessage: () => decodeMessage,
  default: () => src_default
});
module.exports = __toCommonJS(src_exports);

// src/bot.ts
var import_core4 = require("@satorijs/core");

// src/http.ts
var import_core2 = require("@satorijs/core");
var import_xml2js = __toESM(require("xml2js"), 1);

// src/utils.ts
var import_core = require("@satorijs/core");
async function decodeMessage(bot, message) {
  const session = bot.session();
  session.timestamp = message.CreateTime * 1e3;
  session.wechatOfficial = message;
  session.userId = message.FromUserName;
  session.channelId = session.userId;
  session.messageId = message.MsgId;
  if (message.MsgType === "text") {
    session.isDirect = true;
    session.type = "message";
    session.elements = [import_core.h.text(message.Content)];
    return session;
  } else if (message.MsgType === "image") {
    session.isDirect = true;
    session.type = "message";
    session.elements = [import_core.h.image(message.PicUrl)];
    return session;
  } else if (message.MsgType === "voice") {
    session.isDirect = true;
    session.type = "message";
    session.elements = [import_core.h.audio(bot.$toMediaUrl(message.MediaId))];
    return session;
  } else if (message.MsgType === "video") {
    session.isDirect = true;
    session.type = "message";
    session.elements = [import_core.h.video(bot.$toMediaUrl(message.MediaId))];
    return session;
  } else if (message.MsgType === "location") {
    session.isDirect = true;
    session.type = "message";
    session.elements = [(0, import_core.h)("wechat-official:location", {
      latitude: message.Location_X,
      longitude: message.Location_Y,
      label: message.Label
    })];
    return session;
  } else if (message.MsgType === "event") {
    if (message.Event === "subscribe") {
      session.type = "friend-added";
      return session;
    } else if (message.Event === "unsubscribe") {
      session.type = "friend-deleted";
      return session;
    }
  }
}
__name(decodeMessage, "decodeMessage");

// src/http.ts
var import_crypto = require("@wecom/crypto");
var HttpServer = class extends import_core2.Adapter {
  static {
    __name(this, "HttpServer");
  }
  static inject = ["server"];
  async connect(bot) {
    await bot.refreshToken();
    await bot.ensureCustom();
    bot.ctx.server.get("/wechat-official", async (ctx) => {
      let success = false;
      const { signature, timestamp, nonce, echostr } = ctx.request.query;
      for (const bot2 of this.bots) {
        const localSign = (0, import_crypto.getSignature)(bot2.config.token, timestamp?.toString(), nonce?.toString(), "");
        if (localSign === signature) {
          success = true;
          break;
        }
      }
      if (!success) return ctx.status = 403;
      ctx.status = 200;
      ctx.body = echostr;
    });
    bot.ctx.server.post("/wechat-official", async (ctx) => {
      const { timestamp, nonce, msg_signature } = ctx.request.query;
      bot.logger.debug("%c", ctx.request.body);
      let { xml: data } = await import_xml2js.default.parseStringPromise(ctx.request.body, {
        explicitArray: false
      });
      const botId = data.ToUserName;
      const localBot = this.bots.find((bot2) => bot2.selfId === botId);
      if (!localBot) return ctx.status = 403;
      if (data.Encrypt) {
        const localSign = (0, import_crypto.getSignature)(localBot.config.token, timestamp?.toString(), nonce?.toString(), data.Encrypt);
        if (localSign !== msg_signature) return ctx.status = 403;
        const { message, id } = (0, import_crypto.decrypt)(bot.config.aesKey, data.Encrypt);
        if (id !== localBot.config.appid) return ctx.status = 403;
        const { xml: data2 } = await import_xml2js.default.parseStringPromise(message, {
          explicitArray: false
        });
        bot.logger.debug("decrypted %c", data2);
        data = data2;
      }
      const session = await decodeMessage(localBot, data);
      let resolveFunction;
      const promise = new Promise((resolve, reject) => {
        if (localBot.config.customerService) return resolve("success");
        const timeout = setTimeout(() => {
          ctx.status = 200;
          ctx.body = "success";
          reject(new Error("timeout"));
        }, 4500);
        resolveFunction = /* @__PURE__ */ __name((text) => {
          resolve(text);
          clearTimeout(timeout);
        }, "resolveFunction");
      });
      if (session) {
        session.wechatOfficialResolve = resolveFunction;
        localBot.dispatch(session);
      }
      try {
        const result = await promise;
        if (localBot.config.aesKey) {
          const builder = new import_xml2js.default.Builder({
            cdata: true,
            headless: true
          });
          const encrypted = (0, import_crypto.encrypt)(localBot.config.aesKey, result, localBot.config.appid);
          const sign = (0, import_crypto.getSignature)(localBot.config.token, timestamp?.toString(), nonce?.toString(), encrypted);
          const xml = builder.buildObject({
            xml: {
              Encrypt: encrypted,
              Nonce: nonce,
              TimeStamp: timestamp,
              MsgSignature: sign
            }
          });
          return ctx.body = xml;
        }
        ctx.status = 200;
        ctx.body = result;
      } catch (error) {
        localBot.logger.warn("resolve timeout");
        ctx.status = 200;
        ctx.body = "success";
      }
    });
    bot.ctx.server.get("/wechat-official/assets/:self_id/:media_id", async (ctx) => {
      const mediaId = ctx.params.media_id;
      const selfId = ctx.params.self_id;
      const localBot = this.bots.find((bot2) => bot2.selfId === selfId);
      if (!localBot) return ctx.status = 404;
      const resp = await localBot.http(`/cgi-bin/media/get`, {
        method: "GET",
        responseType: "stream",
        params: {
          access_token: localBot.token,
          media_id: mediaId
        }
      });
      ctx.type = resp.headers.get("content-type");
      ctx.set("date", resp.headers.get("date"));
      ctx.set("cache-control", resp.headers.get("cache-control"));
      ctx.response.body = resp.data;
      ctx.status = 200;
    });
    bot.online();
  }
};

// src/message.ts
var import_core3 = require("@satorijs/core");
var import_xml2js2 = __toESM(require("xml2js"), 1);
var WechatOfficialMessageEncoder = class extends import_core3.MessageEncoder {
  static {
    __name(this, "WechatOfficialMessageEncoder");
  }
  buffer = "";
  sent = false;
  upsertSend() {
    const session = this.bot.session();
    session.type = "message";
    session.isDirect = true;
    session.userId = this.bot.selfId;
    session.timestamp = (/* @__PURE__ */ new Date()).valueOf();
  }
  async sendByHttpResponse(payload) {
    if (payload.MsgType === "text" && !payload.Content.length) return;
    if (this.sent) {
      this.bot.logger.error("flushed twice");
      return;
    }
    if ((/* @__PURE__ */ new Date()).valueOf() - this.options.session.timestamp > 5e3) {
      this.bot.logger.error("timeout %c", this.options.session.timestamp);
      return;
    }
    payload = {
      ToUserName: this.options.session.userId,
      FromUserName: this.bot.selfId,
      CreateTime: Math.floor((/* @__PURE__ */ new Date()).valueOf() / 1e3),
      ...payload
    };
    const builder = new import_xml2js2.default.Builder({
      cdata: true,
      headless: true
    });
    const xml = builder.buildObject({
      xml: payload
    });
    this.options.session.wechatOfficialResolve(xml);
    this.sent = true;
    this.upsertSend();
  }
  async sendByCustom(payload) {
    if (payload.msgtype === "text" && !payload.text.content) return;
    await this.bot.http.post("/cgi-bin/message/custom/send", {
      touser: this.options.session.userId,
      ...payload
    }, {
      params: { access_token: this.bot.token }
    });
    this.upsertSend();
  }
  async flushMedia(element) {
    if (!["audio", "video", "image", "img"].includes(element.type)) return;
    let type = element.type;
    if (type === "audio") type = "voice";
    if (type === "img") type = "image";
    const [media] = await this.uploadMedia(element);
    if (this.options.session.wechatOfficialResolve && !this.bot.config.customerService) {
      await this.sendByHttpResponse({
        // @ts-ignore
        MsgType: type,
        [type[0].toUpperCase() + type.slice(1)]: {
          MediaId: media
        }
      });
      return;
    }
    if (this.bot.config.customerService) {
      await this.sendByCustom({
        msgtype: type,
        [type]: {
          media_id: media
        }
      });
    }
  }
  async flush() {
    if (this.options.session.wechatOfficialResolve && !this.bot.config.customerService) {
      await this.sendByHttpResponse({
        MsgType: "text",
        Content: this.buffer
      });
    }
    if (this.bot.config.customerService) {
      await this.sendByCustom({
        msgtype: "text",
        text: {
          content: this.buffer
        }
      });
    }
  }
  // https://developers.weixin.qq.com/doc/offiaccount/Asset_Management/New_temporary_materials.html
  async uploadMedia(element) {
    const { attrs } = element;
    const uploadType = element.type === "audio" ? "voice" : element.type;
    const form = new FormData();
    const { filename, data, type } = await this.bot.ctx.http.file(attrs.src || attrs.url, attrs);
    const value = new Blob([data], { type });
    form.append("media", value, attrs.file || filename);
    const resp = await this.bot.http.post("/cgi-bin/media/upload", form, {
      params: {
        access_token: this.bot.token,
        type: uploadType
      }
    });
    if (resp.media_id) {
      return [resp.media_id, uploadType];
    }
  }
  async visit(element) {
    const { type, attrs, children } = element;
    if (type === "text") {
      this.buffer += attrs.content;
    } else if (type === "br") {
      this.buffer += "\n";
    } else if (type === "p") {
      if (!this.buffer.endsWith("\n")) this.buffer += "\n";
      await this.render(children);
      if (!this.buffer.endsWith("\n")) this.buffer += "\n";
    } else if (type === "img" || type === "image" || type === "audio" || type === "video") {
      await this.flushMedia(element);
    } else if (type === "message") {
      await this.flush();
      await this.render(children);
      await this.flush();
    }
  }
};

// src/bot.ts
var WechatOfficialBot = class extends import_core4.Bot {
  static {
    __name(this, "WechatOfficialBot");
  }
  static inject = ["server", "http"];
  static MessageEncoder = WechatOfficialMessageEncoder;
  http;
  // internal: Internal
  refreshTokenTimer;
  constructor(ctx, config) {
    super(ctx, config, "wechat-official");
    this.selfId = config.account;
    this.http = ctx.http.extend(config);
    ctx.plugin(HttpServer, this);
  }
  // @ts-ignore
  stop() {
    clearTimeout(this.refreshTokenTimer);
  }
  token;
  /** https://developers.weixin.qq.com/doc/offiaccount/Basic_Information/Get_access_token.html */
  async refreshToken() {
    const { access_token, expires_in, errcode, errmsg } = await this.http.get("/cgi-bin/token", {
      params: {
        grant_type: "client_credential",
        appid: this.config.appid,
        secret: this.config.secret
      }
    });
    if (errcode > 0) {
      this.logger.error(errmsg);
      return;
    }
    this.token = access_token;
    this.logger.debug("token %o, expires in %d", access_token, expires_in);
    this.refreshTokenTimer = setTimeout(this.refreshToken.bind(this), (expires_in - 10) * 1e3);
    return access_token;
  }
  /** https://developers.weixin.qq.com/doc/offiaccount/Customer_Service/Customer_Service_Management.html */
  async ensureCustom() {
    if (!this.config.customerService) return;
    const data = await this.http.get("/cgi-bin/customservice/getkflist", {
      params: { access_token: this.token }
    });
    if (data.kf_list.find((v) => v.kf_nick === "Koishi")) return;
    await this.http.post("/customservice/kfaccount/add", {
      kf_account: "koishi@" + this.config.account,
      nickname: "Koishi"
    }, {
      params: { access_token: this.token }
    });
  }
  async getMedia(mediaId) {
    return await this.http.get("/cgi-bin/media/get", {
      params: {
        access_token: this.token,
        media_id: mediaId
      }
    });
  }
  $toMediaUrl(mediaId) {
    return `${this.ctx.server.config.selfUrl}/wechat-official/assets/${this.selfId}/${mediaId}`;
  }
};
((WechatOfficialBot2) => {
  WechatOfficialBot2.Config = import_core4.Schema.intersect([
    import_core4.Schema.object({
      account: import_core4.Schema.string().required(),
      appid: import_core4.Schema.string().description("AppID").required(),
      secret: import_core4.Schema.string().role("secret").description("AppSecret").required(),
      token: import_core4.Schema.string().role("secret").description("Webhook Token").required(),
      aesKey: import_core4.Schema.string().role("secret").description("EncodingAESKey"),
      customerService: import_core4.Schema.boolean().default(false).description("启用客服消息回复")
    }),
    import_core4.HTTP.createConfig("https://api.weixin.qq.com/")
  ]);
})(WechatOfficialBot || (WechatOfficialBot = {}));

// src/index.ts
var src_default = WechatOfficialBot;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  HttpServer,
  WechatOfficialBot,
  WechatOfficialMessageEncoder,
  decodeMessage
});
