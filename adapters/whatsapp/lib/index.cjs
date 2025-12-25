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
  WhatsAppAdapter: () => WhatsAppAdapter,
  WhatsAppBot: () => WhatsAppBot,
  WhatsAppMessageEncoder: () => WhatsAppMessageEncoder,
  decodeSession: () => decodeSession,
  default: () => src_default
});
module.exports = __toCommonJS(src_exports);

// src/adapter.ts
var import_core4 = require("@satorijs/core");

// src/internal.ts
var Internal = class {
  constructor(http) {
    this.http = http;
  }
  static {
    __name(this, "Internal");
  }
  async getPhoneNumbers(id) {
    const { data } = await this.http.get(`/${id}/phone_numbers`);
    return data;
  }
  async messageReaction(selfId, channelId, messageId, emoji) {
    await this.http.post(`/${selfId}/messages`, {
      messaging_product: "whatsapp",
      to: channelId,
      recipient_type: "individual",
      type: "reaction",
      reaction: {
        message_id: messageId,
        emoji
      }
    });
  }
  async sendMessage(selfId, data) {
    const response = await this.http.post(`/${selfId}/messages`, data);
    return response;
  }
  getMedia(mediaId) {
    return this.http.get("/" + mediaId);
  }
  uploadMedia(selfId, form) {
    return this.http.post(`/${selfId}/media`, form);
  }
};

// src/bot.ts
var import_core2 = require("@satorijs/core");

// src/message.ts
var import_core = require("@satorijs/core");
var SUPPORTED_MEDIA = [
  "audio/aac",
  "audio/mp4",
  "audio/mpeg",
  "audio/amr",
  "audio/ogg",
  "audio/opus",
  "application/vnd.ms-powerpoint",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/pdf",
  "text/plain",
  "application/vnd.ms-excel",
  "image/jpeg",
  "image/png",
  "image/webp",
  "video/mp4",
  "video/3gpp"
];
var WhatsAppMessageEncoder = class extends import_core.MessageEncoder {
  static {
    __name(this, "WhatsAppMessageEncoder");
  }
  buffer = "";
  quoteId = null;
  buttons = [];
  async flush() {
    if (this.buttons.length) await this.flushButton();
    await this.flushTextMessage();
  }
  async flushTextMessage() {
    await this.sendMessage("text", { body: this.buffer, preview_url: this.options.linkPreview });
    this.buffer = "";
  }
  async flushButton() {
    for (let i = 0; i < this.buttons.length; i += 3) {
      await this.sendMessage("button", {
        body: { text: this.buffer || " " },
        action: { buttons: this.buttons.slice(i, i + 3) }
      });
      this.buffer = "";
    }
    this.buttons = [];
  }
  async sendMessage(type, data) {
    if (type === "text" && !this.buffer.length) return;
    if (type !== "text" && this.buffer.length) await this.flushTextMessage();
    const { messages } = await this.bot.internal.sendMessage(this.bot.selfId, {
      messaging_product: "whatsapp",
      to: this.channelId,
      recipient_type: "individual",
      type,
      [type]: data,
      ...this.quoteId ? {
        context: {
          message_id: this.quoteId
        }
      } : {}
    });
    for (const msg of messages) {
      const session = this.bot.session();
      session.type = "message";
      session.messageId = msg.id;
      session.channelId = this.channelId;
      session.guildId = this.channelId;
      session.isDirect = true;
      session.event.user = this.bot.user;
      session.timestamp = Date.now();
      session.app.emit(session, "send", session);
      this.results.push(session.event.message);
    }
  }
  // https://developers.facebook.com/docs/whatsapp/cloud-api/reference/media#upload-media
  async uploadMedia(attrs) {
    const { filename, data, type } = await this.bot.ctx.http.file(attrs.src || attrs.url, attrs);
    if (!SUPPORTED_MEDIA.includes(type)) {
      this.bot.ctx.logger("whatsapp").warn(`Unsupported media type: ${type}`);
      return;
    }
    const form = new FormData();
    const value = new Blob([data], { type });
    form.append("file", value, attrs.file || filename);
    form.append("type", type);
    form.append("messaging_product", "whatsapp");
    const r = await this.bot.internal.uploadMedia(this.bot.selfId, form);
    return r.id;
  }
  decodeButton(attrs, label) {
    return {
      id: attrs.id,
      type: "reply",
      title: label
    };
  }
  async visit(element) {
    const { type, attrs, children } = element;
    if (type === "text") {
      this.buffer += attrs.content;
    } else if ((type === "image" || type === "img" || type === "audio" || type === "video") && (attrs.src || attrs.url)) {
      const id = await this.uploadMedia(attrs);
      if (!id) return;
      await this.sendMessage(type === "img" ? "image" : type, { id });
    } else if (type === "file") {
      const id = await this.uploadMedia(attrs);
      if (!id) return;
      await this.sendMessage("document", { id });
    } else if (type === "face") {
      if (attrs.platform && attrs.platform !== this.bot.platform) {
        return this.render(children);
      } else {
        await this.sendMessage("sticker", { id: attrs.id });
      }
    } else if (type === "br") {
      this.buffer += "\n";
    } else if (type === "p") {
      if (!this.buffer.endsWith("\n")) this.buffer += "\n";
      await this.render(children);
      if (!this.buffer.endsWith("\n")) this.buffer += "\n";
    } else if (type === "a") {
      await this.render(children);
      this.buffer += ` (${attrs.href}) `;
    } else if (type === "at") {
      if (attrs.id) {
        this.buffer += `@${attrs.id}`;
      }
    } else if (type === "button") {
      this.buttons.push(this.decodeButton(attrs, children.join("")));
    } else if (type === "button-group") {
      await this.render(children);
    } else if (type === "message") {
      await this.flush();
      await this.render(children);
      await this.flush();
      this.quoteId = null;
    } else if (type === "quote") {
      this.quoteId = attrs.id;
    } else {
      await this.render(children);
    }
  }
};

// src/bot.ts
var WhatsAppBot = class extends import_core2.Bot {
  static {
    __name(this, "WhatsAppBot");
  }
  static inject = ["server"];
  static MessageEncoder = WhatsAppMessageEncoder;
  internal;
  http;
  constructor(ctx) {
    super(ctx, {}, "whatsapp");
  }
  async createReaction(channelId, messageId, emoji) {
    await this.internal.messageReaction(this.selfId, channelId, messageId, emoji);
  }
};

// src/utils.ts
var import_core3 = require("@satorijs/core");
async function decodeSession(bot, entry) {
  const result = [];
  for (const change of entry.changes) {
    bot.dispatch(bot.session({
      type: "internal",
      _type: "whatsapp/" + change.field,
      _data: change.value
    }));
    if (change.field === "messages" && change.value.messages?.length) {
      const session = bot.session();
      session.type = "message";
      session.setInternal("whatsapp", change.value);
      session.isDirect = true;
      const message = change.value.messages[0];
      session.channelId = message.from;
      session.guildId = message.from;
      session.messageId = message.id;
      session.event.user = {
        id: message.from,
        name: change.value.contacts[0].profile.name
      };
      session.timestamp = parseInt(message.timestamp) * 1e3;
      if (message.context) {
        session.quote = {
          id: message.context.id,
          channel: { id: message.context.from, type: import_core3.Universal.Channel.Type.DIRECT },
          user: { id: message.context.from },
          content: ""
        };
      }
      if (message.type === "text") {
        session.elements = [import_core3.h.text(message.text.body)];
      } else if (["video", "audio", "image", "document"].includes(message.type)) {
        const elements = [];
        let type = message.type;
        if (message.type === "document") type = "file";
        const resource = message[message.type];
        if (resource.caption) elements.push(import_core3.h.text(message[message.type].caption));
        elements.push(import_core3.h[type](`${bot.ctx.server.config.selfUrl}/whatsapp/assets/${bot.selfId}/${resource.id}`));
        session.elements = elements;
      } else if (message.type === "sticker") {
        session.elements = [(0, import_core3.h)("face", {
          id: (
            /* (message.sticker.animated ? 'a:' : '') + */
            message.sticker.id
          ),
          platform: "whatsapp"
        }, [
          import_core3.h.image(`${bot.ctx.server.config.selfUrl}/whatsapp/assets/${bot.selfId}/${message.sticker.id}`)
        ])];
      } else if (message.type === "location") {
        session.elements = [(0, import_core3.h)("whatsapp:location", {
          latitude: message.location.latitude,
          longitude: message.location.longitude
        })];
      } else if (message.type === "interactive" && message.interactive.type === "button_reply") {
        session.type = "interaction/button";
        session.event.button = {
          id: message.interactive.button_reply.id
        };
      } else {
        continue;
      }
      session.content = session.elements.join("");
      result.push(session);
    }
  }
  return result;
}
__name(decodeSession, "decodeSession");

// src/adapter.ts
var import_crypto = __toESM(require("crypto"), 1);
var HttpServer = class {
  constructor(ctx) {
    this.ctx = ctx;
    this.logger = ctx.logger("whatsapp");
    ctx.server.post("/whatsapp", async (ctx2) => {
      const received = ctx2.get("X-Hub-Signature-256").split("sha256=")[1];
      if (!received) return ctx2.status = 403;
      const payload = ctx2.request.body[Symbol.for("unparsedBody")];
      const adapters = this.adapters.filter((adapter) => {
        const expected = import_crypto.default.createHmac("sha256", adapter.config.secret).update(payload).digest("hex");
        return expected === received;
      });
      if (!adapters.length) return ctx2.status = 403;
      const parsed = ctx2.request.body;
      this.logger.debug(parsed);
      ctx2.body = "ok";
      ctx2.status = 200;
      if (parsed.object !== "whatsapp_business_account") return;
      for (const entry of parsed.entry) {
        const phone_number_id = entry.changes[0].value.metadata.phone_number_id;
        const bot = this.getBot(phone_number_id);
        const session = await decodeSession(bot, entry);
        if (session.length) session.forEach(bot.dispatch.bind(bot));
        this.logger.debug("handling bot: %s", bot.sid);
        this.logger.debug(session);
      }
    });
    ctx.server.get("/whatsapp", async (ctx2) => {
      this.logger.debug(ctx2.query);
      const verifyToken = ctx2.query["hub.verify_token"];
      const challenge = ctx2.query["hub.challenge"];
      for (const adapter of this.adapters) {
        if (adapter.config.verifyToken === verifyToken) {
          ctx2.body = challenge;
          ctx2.status = 200;
          return;
        }
      }
      return ctx2.status = 403;
    });
    ctx.server.get("/whatsapp/assets/:self_id/:media_id", async (ctx2) => {
      const mediaId = ctx2.params.media_id;
      const selfId = ctx2.params.self_id;
      const bot = this.getBot(selfId);
      if (!bot) return ctx2.status = 404;
      const fetched = await bot.internal.getMedia(mediaId);
      this.logger.debug(fetched.url);
      const resp = await bot.ctx.http(fetched.url, {
        method: "GET",
        responseType: "stream"
      });
      ctx2.type = resp.headers.get("content-type");
      ctx2.set("cache-control", resp.headers.get("cache-control"));
      ctx2.response.body = resp.data;
      ctx2.status = 200;
    });
  }
  static {
    __name(this, "HttpServer");
  }
  static inject = ["server"];
  logger;
  adapters = [];
  getBot(selfId) {
    for (const adapter of this.adapters) {
      for (const bot of adapter.bots) {
        if (bot.selfId === selfId) return bot;
      }
    }
  }
  fork(ctx, adapter) {
    this.adapters.push(adapter);
    ctx.on("dispose", () => {
      (0, import_core4.remove)(this.adapters, adapter);
    });
  }
};
var WhatsAppAdapter = class extends import_core4.Adapter {
  constructor(ctx, config) {
    super(ctx);
    this.config = config;
    ctx.plugin(HttpServer, this);
    const http = ctx.http.extend({
      headers: {
        Authorization: `Bearer ${config.systemToken}`
      }
    }).extend(config);
    const internal = new Internal(http);
    ctx.on("ready", async () => {
      const data = await internal.getPhoneNumbers(config.id);
      for (const item of data) {
        const bot = new WhatsAppBot(ctx);
        bot.selfId = item.id;
        bot.adapter = this;
        bot.internal = internal;
        bot.user = {
          id: item.id,
          name: item.display_phone_number
        };
        this.bots.push(bot);
        bot.online();
      }
    });
  }
  static {
    __name(this, "WhatsAppAdapter");
  }
  static inject = ["server", "http"];
  static schema = true;
  static reusable = true;
};
((WhatsAppAdapter2) => {
  WhatsAppAdapter2.Config = import_core4.Schema.intersect([
    import_core4.Schema.object({
      secret: import_core4.Schema.string().role("secret").description("App Secret").required(),
      systemToken: import_core4.Schema.string().role("secret").description("System User Token").required(),
      verifyToken: import_core4.Schema.string().role("secret").description("Verify Token").required(),
      id: import_core4.Schema.string().description("WhatsApp Business Account ID").required()
    }),
    import_core4.HTTP.createConfig("https://graph.facebook.com")
  ]);
})(WhatsAppAdapter || (WhatsAppAdapter = {}));

// src/index.ts
var src_default = WhatsAppAdapter;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  WhatsAppAdapter,
  WhatsAppBot,
  WhatsAppMessageEncoder,
  decodeSession
});
