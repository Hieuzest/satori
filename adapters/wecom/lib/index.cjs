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
  WecomBot: () => WecomBot,
  WecomMessageEncoder: () => WecomMessageEncoder,
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
  session.guildId = bot.config.corpId;
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
    session.elements = [(0, import_core.h)("wecom:location", {
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
    await bot.getLogin();
    bot.ctx.server.get("/wecom", async (ctx) => {
      let success = false;
      const { msg_signature, timestamp, nonce, echostr } = ctx.request.query;
      const localSign = (0, import_crypto.getSignature)(bot.config.token, timestamp?.toString(), nonce?.toString(), echostr?.toString());
      if (localSign === msg_signature) {
        success = true;
        const dec = (0, import_crypto.decrypt)(bot.config.aesKey, echostr?.toString());
        ctx.body = dec.message;
      }
      if (!success) return ctx.status = 403;
      ctx.status = 200;
    });
    bot.ctx.server.post("/wecom", async (ctx) => {
      const { timestamp, nonce, msg_signature } = ctx.request.query;
      bot.logger.debug(ctx.request.body);
      let { xml: data } = await import_xml2js.default.parseStringPromise(ctx.request.body, {
        explicitArray: false
      });
      const botId = data.AgentID;
      const localBot = this.bots.find((bot2) => bot2.selfId === botId);
      if (!localBot) return ctx.status = 403;
      if (data.Encrypt) {
        const localSign = (0, import_crypto.getSignature)(localBot.config.token, timestamp?.toString(), nonce?.toString(), data.Encrypt);
        if (localSign !== msg_signature) return ctx.status = 403;
        const { message } = (0, import_crypto.decrypt)(bot.config.aesKey, data.Encrypt);
        const { xml: data2 } = await import_xml2js.default.parseStringPromise(message, {
          explicitArray: false
        });
        bot.logger.debug("decrypted %c", data2);
        data = data2;
      }
      const session = await decodeMessage(localBot, data);
      if (session) {
        localBot.dispatch(session);
        localBot.logger.debug(session);
      }
      ctx.status = 200;
      ctx.body = "success";
    });
    bot.ctx.server.get("/wecom/assets/:self_id/:media_id", async (ctx) => {
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
var WecomMessageEncoder = class extends import_core3.MessageEncoder {
  static {
    __name(this, "WecomMessageEncoder");
  }
  buffer = "";
  upsertSend(msgId, payload) {
    const session = this.bot.session();
    session.type = "message";
    session.messageId = msgId;
    session.isDirect = true;
    session.userId = this.bot.selfId;
    session.timestamp = (/* @__PURE__ */ new Date()).valueOf();
    session.elements = payload.msgtype === "text" ? [import_core3.h.text(payload.text.content)] : [(0, import_core3.h)(payload.msgtype === "voice" ? "audio" : payload.msgtype, {
      src: this.bot.$toMediaUrl(payload[payload.msgtype].media_id)
    })];
    session.app.emit(session, "send", session);
    this.results.push(session.event.message);
  }
  /** https://developer.work.weixin.qq.com/document/path/90236 */
  async sendByCustom(payload) {
    if (payload.msgtype === "text" && !payload.text?.content) return;
    const { msgid } = await this.bot.http.post("/cgi-bin/message/send", {
      touser: this.options.session.userId,
      agentid: this.bot.selfId,
      ...payload
    }, {
      params: { access_token: this.bot.token }
    });
    this.upsertSend(msgid, payload);
  }
  async flushMedia(element) {
    if (!["audio", "video", "image", "file", "img"].includes(element.type)) return;
    let type = element.type;
    if (type === "audio") type = "voice";
    if (type === "img") type = "image";
    const [media] = await this.uploadMedia(element);
    await this.sendByCustom({
      msgtype: type,
      [type]: {
        media_id: media
      }
    });
  }
  async flush() {
    await this.sendByCustom({
      msgtype: "text",
      text: {
        content: this.buffer
      }
    });
    this.buffer = "";
  }
  /** https://developer.work.weixin.qq.com/document/path/90253 */
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
    this.bot.logger.error(resp.errmsg);
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
    } else if (type === "img" || type === "image" || type === "audio" || type === "video" || type === "file") {
      await this.flushMedia(element);
    } else if (type === "a" && attrs.href) {
      await this.render(children);
      this.buffer += ` (${attrs.href})`;
    } else if (type === "message") {
      await this.flush();
      await this.render(children);
      await this.flush();
    } else {
      await this.render(children);
    }
  }
};

// src/bot.ts
var WecomBot = class extends import_core4.Bot {
  static {
    __name(this, "WecomBot");
  }
  static inject = ["server", "http"];
  static MessageEncoder = WecomMessageEncoder;
  http;
  // internal: Internal
  refreshTokenTimer;
  constructor(ctx, config) {
    super(ctx, config, "wecom");
    this.selfId = config.agentId;
    this.http = ctx.http.extend(config);
    ctx.plugin(HttpServer, this);
  }
  async stop() {
    clearTimeout(this.refreshTokenTimer);
  }
  token;
  /** hhttps://developer.work.weixin.qq.com/document/path/91039 */
  async refreshToken() {
    const { access_token, expires_in, errcode, errmsg } = await this.http.get("/cgi-bin/gettoken", {
      params: {
        corpid: this.config.corpId,
        corpsecret: this.config.secret
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
  async getMedia(mediaId) {
    return await this.http.get("/cgi-bin/media/get", {
      params: {
        access_token: this.token,
        media_id: mediaId
      }
    });
  }
  $toMediaUrl(mediaId) {
    return `${this.ctx.server.config.selfUrl}/wecom/assets/${this.selfId}/${mediaId}`;
  }
  /** https://developer.work.weixin.qq.com/document/path/90196 */
  async getUser(userId, guildId) {
    const data = await this.http.get("/cgi-bin/user/get", {
      params: {
        userid: userId,
        access_token: this.token
      }
    });
    const { name, avatar } = data;
    return {
      id: userId,
      name,
      avatar
    };
  }
  /** https://developer.work.weixin.qq.com/document/path/90227 */
  async getLogin() {
    const { square_logo_url, name } = await this.http.get("/cgi-bin/agent/get", {
      params: {
        access_token: this.token,
        agentid: this.config.agentId
      }
    });
    this.user = {
      id: this.config.agentId,
      name,
      userId: this.config.agentId,
      username: name,
      avatar: square_logo_url
    };
    return this.toJSON();
  }
  /** https://developer.work.weixin.qq.com/document/path/94867 */
  async deleteMessage(channelId, messageId) {
    await this.http.post("/cgi-bin/message/recall", {
      msgid: messageId
    }, {
      params: { access_token: this.token }
    });
  }
};
((WecomBot2) => {
  WecomBot2.Config = import_core4.Schema.intersect([
    import_core4.Schema.object({
      corpId: import_core4.Schema.string().required(),
      agentId: import_core4.Schema.string().description("AgentID").required(),
      secret: import_core4.Schema.string().role("secret").description("AppSecret").required(),
      token: import_core4.Schema.string().role("secret").description("Webhook Token").required(),
      aesKey: import_core4.Schema.string().role("secret").description("EncodingAESKey")
    }),
    import_core4.HTTP.createConfig("https://qyapi.weixin.qq.com/")
  ]);
})(WecomBot || (WecomBot = {}));

// src/index.ts
var src_default = WecomBot;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  HttpServer,
  WecomBot,
  WecomMessageEncoder,
  decodeMessage
});
