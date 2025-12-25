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
  Internal: () => Internal,
  SlackBot: () => SlackBot,
  SlackMessageEncoder: () => SlackMessageEncoder,
  Token: () => Token,
  WsClient: () => WsClient,
  adaptMessage: () => adaptMessage,
  adaptMessageDeleted: () => adaptMessageDeleted,
  adaptSentAsset: () => adaptSentAsset,
  adaptSession: () => adaptSession,
  decodeChannel: () => decodeChannel,
  decodeGuild: () => decodeGuild,
  decodeGuildMember: () => decodeGuildMember,
  decodeUser: () => decodeUser,
  default: () => src_default,
  escape: () => escape,
  unescape: () => unescape
});
module.exports = __toCommonJS(src_exports);

// src/bot.ts
var import_core5 = require("@satorijs/core");

// src/ws.ts
var import_core3 = require("@satorijs/core");

// src/utils.ts
var import_core2 = require("@satorijs/core");

// src/message.ts
var import_core = require("@satorijs/core");
var escape = /* @__PURE__ */ __name((val) => val.replace(/(?<!\u200b)[\*_~`]/g, "​$&").replace(/@everyone/g, () => "@​everyone").replace(/@here/g, () => "@​here").replace(/(?<!\u200b)^>/g, " &gt;").replace(/<(.*?)>/g, "&lt;$1&gt;"), "escape");
var unescape = /* @__PURE__ */ __name((val) => val.replace(/\u200b([\*_~`])/g, "$1").replace(/@\u200Beveryone/g, () => "@everyone").replace(/@\u200Bhere/g, () => "@here"), "unescape");
var SlackMessageEncoder = class extends import_core.MessageEncoder {
  static {
    __name(this, "SlackMessageEncoder");
  }
  buffer = "";
  thread_ts = null;
  elements = [];
  addition = {};
  async flush() {
    if (!this.buffer.length) return;
    const r = await this.bot.internal.chatPostMessage(this.bot.config.botToken, {
      channel: this.channelId,
      ...this.addition,
      thread_ts: this.thread_ts,
      text: this.buffer
    });
    if (!r.ok) throw new Error(r["error"]);
    const session = this.bot.session();
    await adaptMessage(this.bot, r.message, session.event.message = {}, session.event);
    session.channelId = this.channelId;
    session.app.emit(session, "send", session);
    this.results.push(session.event.message);
    this.buffer = "";
  }
  async sendAsset(element) {
    if (this.buffer.length) await this.flush();
    const { attrs } = element;
    const { filename, data, type } = await this.bot.ctx.http.file(attrs.src || attrs.url, attrs);
    const form = new FormData();
    const value = new Blob([data], { type });
    form.append("file", value, attrs.file || filename);
    form.append("channels", this.channelId);
    if (this.thread_ts) form.append("thread_ts", this.thread_ts);
    const sent = await this.bot.request("POST", "/files.upload", form);
    if (sent.ok) {
      const session = this.bot.session();
      adaptSentAsset(sent.file, session);
      session.app.emit(session, "send", session);
      this.results.push(session.event.message);
    }
  }
  async visit(element) {
    const { type, attrs, children } = element;
    if (type === "text") {
      this.buffer += escape(attrs.content);
    } else if ((type === "img" || type === "image") && (attrs.src || attrs.url)) {
      await this.sendAsset(element);
    } else if (type === "sharp" && attrs.id) {
      this.buffer += `<#${attrs.id}>`;
    } else if (type === "at") {
      if (attrs.id) this.buffer += `<@${attrs.id}>`;
      if (attrs.type === "all") this.buffer += `<!everyone>`;
      if (attrs.type === "here") this.buffer += `<!here>`;
    } else if (type === "b" || type === "strong") {
      this.buffer += "*";
      await this.render(children);
      this.buffer += "*";
    } else if (type === "i" || type === "em") {
      this.buffer += "_";
      await this.render(children);
      this.buffer += "_";
    } else if (type === "s" || type === "del") {
      this.buffer += "~";
      await this.render(children);
      this.buffer += "~";
    } else if (type === "code") {
      this.buffer += "`";
      await this.render(children);
      this.buffer += "`";
    } else if (type === "a") {
      this.buffer += `<${attrs.href}|`;
      await this.render(children);
      this.buffer += `>`;
    } else if (type === "quote") {
      this.thread_ts = attrs.id;
    } else if (type === "br") {
      this.buffer += "\n";
    } else if (type === "p") {
      if (!this.buffer.endsWith("\n")) this.buffer += `
`;
      await this.render(children);
      if (!this.buffer.endsWith("\n")) this.buffer += `
`;
    } else if (type === "face") {
      this.buffer += `:${attrs.id}:`;
    } else if (type === "author") {
      this.addition = {
        username: attrs.nickname,
        icon_url: attrs.avatar
      };
    } else if (type === "message") {
      await this.render(children);
    }
  }
};

// src/utils.ts
function adaptRichText(elements) {
  const result = [];
  for (const text of elements) {
    if (text.type === "text") {
      let item = import_core2.h.text(unescape(text.text));
      if (text.style?.bold) item = (0, import_core2.h)("b", {}, item);
      if (text.style?.italic) item = (0, import_core2.h)("i", {}, item);
      if (text.style?.strike) item = (0, import_core2.h)("del", {}, item);
      if (text.style?.code) item = (0, import_core2.h)("code", {}, item);
      result.push(item);
    } else if (text.type === "link") {
      result.push((0, import_core2.h)("a", { href: text.url }, text.text));
    } else if (text.type === "emoji") {
      result.push(import_core2.h.text(String.fromCodePoint(...text.unicode.split("-").map((v) => parseInt(v, 16)))));
    } else if (text.type === "user") {
      result.push(import_core2.h.at(text.user_id));
    } else if (text.type === "broadcast") {
      result.push((0, import_core2.h)("at", { type: text.range }));
    }
  }
  return result;
}
__name(adaptRichText, "adaptRichText");
function adaptMarkdown(markdown) {
  let list = markdown.split(/(<(?:.*?)>)/g);
  list = list.map((v) => v.split(/(:(?:[a-zA-Z0-9_]+):)/g)).flat();
  const result = [];
  for (const item of list) {
    if (!item) continue;
    const match = item.match(/<(.*?)>/);
    if (match) {
      if (match[0].startsWith("@U")) result.push(import_core2.h.at(match[0].slice(2)));
      if (match[0].startsWith("#C")) result.push(import_core2.h.sharp(match[0].slice(2)));
    } else if (item.startsWith(":") && item.endsWith(":")) {
      result.push((0, import_core2.h)("face", { id: item.slice(1, -1) }));
    } else {
      result.push(import_core2.h.text(item));
    }
  }
  return result;
}
__name(adaptMarkdown, "adaptMarkdown");
function adaptMessageBlocks(blocks) {
  let result = [];
  for (const block of blocks) {
    if (block.type === "rich_text") {
      for (const element of block.elements) {
        if (element.type === "rich_text_section") {
          result = result.concat(adaptRichText(element.elements));
        } else if (element.type === "rich_text_list") {
          result.push((0, import_core2.h)(
            element.style === "bullet" ? "ul" : "ol",
            {},
            element.elements.map(
              (v) => (0, import_core2.h)("li", {}, adaptRichText(v.elements))
            )
          ));
        }
      }
    } else if (block.type === "section") {
      result = result.concat(adaptMarkdown(block.text.text));
    }
  }
  return result;
}
__name(adaptMessageBlocks, "adaptMessageBlocks");
var decodeBotProfile = /* @__PURE__ */ __name((data) => ({
  id: data.app_id,
  name: data.name,
  isBot: true,
  avatar: data.icons.image_72
}), "decodeBotProfile");
async function adaptMessage(bot, data, message, payload = message) {
  const elements = adaptMessageBlocks(data.blocks);
  for (const file of data.files ?? []) {
    if (file.mimetype.startsWith("video/")) {
      elements.push(import_core2.h.video(file.url_private, { id: file.id }));
    } else if (file.mimetype.startsWith("audio/")) {
      elements.push(import_core2.h.video(file.url_private, { id: file.id }));
    } else if (file.mimetype.startsWith("image/")) {
      elements.push(import_core2.h.image(file.url_private, { id: file.id }));
    } else {
      elements.push(import_core2.h.file(file.url_private, { id: file.id }));
    }
  }
  let forward = null;
  for (const attachment of data.attachments ?? []) {
    if (attachment["is_msg_unfurl"]) {
      forward = attachment["ts"];
    }
  }
  message.id = message.messageId = data.ts;
  message.elements = forward ? [(0, import_core2.h)("message", { forward: true, id: forward }, elements)] : elements;
  message.content = message.elements.join("");
  if (!payload) return;
  payload.timestamp = Math.floor(Number(data.ts) * 1e3);
  if ("channel" in data) {
    payload.channel = {
      id: data.channel,
      type: data.channel_type === "im" ? import_core2.Universal.Channel.Type.DIRECT : import_core2.Universal.Channel.Type.TEXT
    };
  }
  if ("bot_profile" in data) {
    payload.user = decodeBotProfile(data.bot_profile);
  } else {
    payload.user = { id: data.user };
  }
  if (data.thread_ts && data.thread_ts !== data.ts) {
    message.quote = await bot.getMessage(payload.channel.id, data.thread_ts);
  }
  if (data.team) {
    payload.guild = { id: data.team };
  }
}
__name(adaptMessage, "adaptMessage");
function adaptMessageDeleted(bot, event, session) {
  session.isDirect = event.channel_type === "im";
  session.channelId = event.channel;
  session.guildId = event.previous_message.team;
  session.type = "message-deleted";
  session.messageId = event.previous_message.ts;
  session.timestamp = Math.floor(Number(event.previous_message.ts) * 1e3);
  adaptMessage(bot, event.previous_message, session.event.message = {}, session.event);
}
__name(adaptMessageDeleted, "adaptMessageDeleted");
function adaptSentAsset(file, session) {
  session.messageId = file.shares.public[Object.keys(file.shares.public)[0]][0].ts;
  session.timestamp = file.created * 1e3;
  session.elements = [import_core2.h.image(file.url_private, { id: file.id })];
  session.content = session.elements.join("");
  session.channelId = file.channels[0];
  session.type = "message";
  session.userId = file.user;
}
__name(adaptSentAsset, "adaptSentAsset");
function setupReaction(session, data) {
  session.guildId = data.team_id;
  session.channelId = data.event.item.channel;
  session.messageId = data.event.item.ts;
  session.timestamp = Math.floor(Number(data.event.item.ts) * 1e3);
  session.userId = data.event.user;
  session.content = data.event.reaction;
}
__name(setupReaction, "setupReaction");
async function adaptSession(bot, payload) {
  const session = bot.session();
  if (payload.event.type === "message") {
    const input = payload.event;
    if (input.user === bot.selfId) return;
    if (!input.subtype) {
      session.type = "message";
      await adaptMessage(bot, input, session.event.message = {}, session.event);
    } else if (input.subtype === "message_deleted") {
      adaptMessageDeleted(bot, input, session);
    } else if (input.subtype === "message_changed") {
      const evt = input;
      if (evt.message.subtype === "thread_broadcast") return;
      session.type = "message-updated";
      session.guildId = payload.team_id;
      await adaptMessage(bot, evt.message, session.event.message = {}, session.event);
    } else {
      return;
    }
  } else if (payload.event.type === "channel_left") {
    session.type = "channel-removed";
    session.channelId = payload.event.channel;
    session.timestamp = Math.floor(Number(payload.event.event_ts) * 1e3);
    session.guildId = payload.team_id;
  } else if (payload.event.type === "reaction_added") {
    session.type = "reaction-added";
    setupReaction(session, payload);
  } else if (payload.event.type === "reaction_removed") {
    session.type = "reaction-deleted";
    setupReaction(session, payload);
  } else {
    return;
  }
  return session;
}
__name(adaptSession, "adaptSession");
var decodeUser = /* @__PURE__ */ __name((data) => ({
  id: data.id,
  name: data.real_name,
  nickname: data.profile.display_name,
  userId: data.id,
  avatar: data.profile.image_512 ?? data.profile.image_192 ?? data.profile.image_72 ?? data.profile.image_48 ?? data.profile.image_32 ?? data.profile.image_24,
  username: data.real_name,
  isBot: data.is_bot
}), "decodeUser");
var decodeGuildMember = /* @__PURE__ */ __name((data) => ({
  user: decodeUser(data)
}), "decodeGuildMember");
var decodeChannel = /* @__PURE__ */ __name((data) => ({
  id: data.id,
  name: data.name,
  type: data.is_private ? import_core2.Universal.Channel.Type.DIRECT : import_core2.Universal.Channel.Type.TEXT
}), "decodeChannel");
var decodeGuild = /* @__PURE__ */ __name((data) => ({
  id: data.id,
  name: data.name
}), "decodeGuild");

// src/ws.ts
var WsClient = class extends import_core3.Adapter.WsClient {
  static {
    __name(this, "WsClient");
  }
  async prepare() {
    await this.bot.getLogin();
    const data = await this.bot.request("POST", "/apps.connections.open", {}, {}, true);
    const { url } = data;
    this.bot.logger.debug("ws url: %s", url);
    return this.bot.ctx.http.ws(url);
  }
  async accept() {
    this.socket.addEventListener("message", async ({ data }) => {
      const parsed = JSON.parse(data.toString());
      this.bot.logger.debug(parsed);
      const { type } = parsed;
      if (type === "hello") {
        return this.bot.online();
      }
      if (type === "events_api") {
        const { envelope_id } = parsed;
        const payload = parsed.payload;
        this.socket.send(JSON.stringify({ envelope_id }));
        const session = await adaptSession(this.bot, payload);
        if (session) {
          this.bot.dispatch(session);
          this.bot.logger.debug(session);
        }
      }
    });
  }
};
((WsClient2) => {
  WsClient2.Options = import_core3.Schema.intersect([
    import_core3.Schema.object({
      protocol: import_core3.Schema.const("ws").required(process.env.KOISHI_ENV !== "browser")
    }),
    import_core3.Adapter.WsClientConfig
  ]);
})(WsClient || (WsClient = {}));

// src/http.ts
var import_core4 = require("@satorijs/core");
var import_node_crypto = __toESM(require("node:crypto"), 1);
var HttpServer = class extends import_core4.Adapter {
  static {
    __name(this, "HttpServer");
  }
  static inject = ["server"];
  async connect(bot) {
    const { signing } = bot.config;
    await bot.getLogin();
    this.ctx.server.post("/slack", async (ctx) => {
      const timestamp = ctx.request.header["x-slack-request-timestamp"].toString();
      const signature = ctx.request.header["x-slack-signature"].toString();
      const requestBody = ctx.request.body[Symbol.for("unparsedBody")];
      const hmac = import_node_crypto.default.createHmac("sha256", signing);
      const [version, hash] = signature.split("=");
      const fiveMinutesAgo = Math.floor(Date.now() / 1e3) - 60 * 5;
      if (Number(timestamp) < fiveMinutesAgo) {
        return ctx.status = 403;
      }
      hmac.update(`${version}:${timestamp}:${requestBody}`);
      if (hash !== hmac.digest("hex")) {
        return ctx.status = 403;
      }
      const { type } = ctx.request.body;
      if (type === "url_verification") {
        ctx.status = 200;
        return ctx.body = {
          challenge: ctx.request.body.challenge
        };
      }
      if (type === "event_callback") {
        ctx.status = 200;
        ctx.body = "ok";
        const payload = ctx.request.body;
        bot.logger.debug(payload);
        const session = await adaptSession(bot, payload);
        bot.logger.debug(session);
        if (session) bot.dispatch(session);
      }
    });
  }
};
((HttpServer2) => {
  HttpServer2.Options = import_core4.Schema.object({
    protocol: import_core4.Schema.const("http").required(),
    signing: import_core4.Schema.string().required()
  });
})(HttpServer || (HttpServer = {}));

// src/types/internal.ts
var Token = /* @__PURE__ */ ((Token2) => {
  Token2[Token2["BOT"] = 0] = "BOT";
  Token2[Token2["APP"] = 1] = "APP";
  return Token2;
})(Token || {});
var Internal = class _Internal {
  constructor(bot, http) {
    this.bot = bot;
    this.http = http;
  }
  static {
    __name(this, "Internal");
  }
  // route: content-type
  static define(routes) {
    for (const path in routes) {
      for (const key in routes[path]) {
        const method = key;
        for (const name of Object.keys(routes[path][method])) {
          _Internal.prototype[name] = async function(...args) {
            const config = {
              headers: {}
            };
            let token = "";
            if (typeof args[0] === "string") {
              token = args[0];
            } else {
              token = args[0] === 0 /* BOT */ ? this.bot.config.botToken : this.bot.config.token;
            }
            config.headers.Authorization = `Bearer ${token}`;
            const supportJson = routes[path][method][name];
            if (method === "GET") {
              config.params = args[1];
            } else if (supportJson && !(args[1] instanceof FormData)) {
              config.headers["content-type"] = "application/json; charset=utf-8";
              config.data = JSON.stringify(args[1]);
            } else {
              config.headers["content-type"] = "application/x-www-form-urlencoded";
              config.data = args[1];
            }
            try {
              return (await this.http(method, path, config)).data;
            } catch (error) {
              if (!this.http.isError(error) || !error.response) throw error;
              throw new Error(`[${error.response.status}] ${JSON.stringify(error.response.data)}`);
            }
          };
        }
      }
    }
  }
};

// src/bot.ts
var SlackBot = class extends import_core5.Bot {
  static {
    __name(this, "SlackBot");
  }
  static MessageEncoder = SlackMessageEncoder;
  static inject = ["http"];
  http;
  internal;
  constructor(ctx, config) {
    super(ctx, config, "slack");
    this.http = ctx.http.extend(config);
    this.internal = new Internal(this, this.http);
    if (config.protocol === "ws") {
      ctx.plugin(WsClient, this);
    } else {
      ctx.plugin(HttpServer, this);
    }
  }
  async request(method, path, data = {}, headers = {}, zap = false) {
    headers["Authorization"] = `Bearer ${zap ? this.config.token : this.config.botToken}`;
    if (method === "GET") {
      return await this.http.get(path, { params: data, headers });
    } else {
      return (await this.http(method, path, { data, headers })).data;
    }
  }
  async getLogin() {
    const data = await this.internal.authTest(0 /* BOT */);
    this.user = {
      id: data.user_id,
      name: data.user,
      userId: data.user_id,
      avatar: null,
      username: data.user,
      isBot: !!data.bot_id
    };
    return this.toJSON();
  }
  async deleteMessage(channelId, messageId) {
    await this.internal.chatDelete(0 /* BOT */, {
      channel: channelId,
      ts: Number(messageId)
    });
  }
  async getMessage(channelId, messageId) {
    const { messages: [data] } = await this.internal.conversationsHistory(0 /* BOT */, {
      channel: channelId,
      oldest: Number(messageId),
      limit: 1,
      inclusive: true
    });
    if (!data) return;
    const message = {};
    await adaptMessage(this, data, message, message);
    return message;
  }
  async getMessageList(channelId, before) {
    const { messages } = await this.request("POST", "/conversations.history", {
      channel: channelId,
      latest: before
    });
    const data = await Promise.all(messages.map(async (v) => {
      const message = {};
      await adaptMessage(this, v, message, message);
      return message;
    }));
    return { data, next: data[0]?.id };
  }
  async getUser(userId, guildId) {
    const { user } = await this.request("POST", "/users.info", {
      user: userId
    });
    return decodeUser(user);
  }
  async getGuildMemberList(guildId) {
    const { members } = await this.request("POST", "/users.list");
    return { data: members.map(decodeGuildMember) };
  }
  async getChannel(channelId, guildId) {
    const { channel } = await this.request("POST", "/conversations.info", {
      channel: channelId
    });
    return decodeChannel(channel);
  }
  async getChannelList(guildId) {
    const { channels } = await this.request("POST", "/conversations.list", {
      team_id: guildId
    });
    return { data: channels.map(decodeChannel) };
  }
  async getGuild(guildId) {
    const { team } = await this.request("POST", "/team.info", {
      team_id: guildId
    });
    return decodeGuild(team);
  }
  async getGuildList() {
    return { data: [await this.getGuild()] };
  }
  async getGuildMember(guildId, userId) {
    const { user } = await this.request("POST", "/users.info", {
      user: userId
    });
    return decodeGuildMember(user);
  }
  async createDirectChannel(userId) {
    const { channel } = await this.internal.conversationsOpen(0 /* BOT */, {
      users: userId
    });
    return { id: channel.id, type: import_core5.Universal.Channel.Type.DIRECT };
  }
  async getReactions(channelId, messageId, emoji) {
    const { message } = await this.internal.reactionsGet(0 /* BOT */, {
      channel: channelId,
      timestamp: messageId,
      full: true
    });
    return message.reactions.find((v) => v.name === emoji)?.users.map((v) => ({
      userId: v
    })) ?? [];
  }
  async createReaction(channelId, messageId, emoji) {
    await this.internal.reactionsAdd(0 /* BOT */, {
      channel: channelId,
      timestamp: messageId,
      name: emoji
    });
  }
  async clearReaction(channelId, messageId, emoji) {
    const { message } = await this.internal.reactionsGet(0 /* BOT */, {
      channel: channelId,
      timestamp: messageId,
      full: true
    });
    for (const reaction of message.reactions) {
      if (!emoji || reaction.name === emoji) {
        await this.internal.reactionsRemove(0 /* BOT */, {
          channel: channelId,
          timestamp: messageId,
          name: reaction.name
        });
      }
    }
  }
};
((SlackBot2) => {
  SlackBot2.Config = import_core5.Schema.intersect([
    import_core5.Schema.object({
      protocol: import_core5.Schema.union(["http", "ws"]).description("选择要使用的协议。").required(),
      token: import_core5.Schema.string().description("App-Level Token.").role("secret").required(),
      botToken: import_core5.Schema.string().description("OAuth Token.").role("secret").required()
    }),
    import_core5.Schema.union([
      WsClient.Options,
      HttpServer.Options
    ]),
    import_core5.HTTP.createConfig("https://slack.com/api/")
  ]);
})(SlackBot || (SlackBot = {}));

// src/types/admin.ts
Internal.define({
  "/admin.apps.approve": {
    POST: { "adminAppsApprove": true }
  },
  "/admin.apps.approved.list": {
    GET: { "adminAppsApprovedList": false }
  },
  "/admin.apps.requests.list": {
    GET: { "adminAppsRequestsList": false }
  },
  "/admin.apps.restrict": {
    POST: { "adminAppsRestrict": true }
  },
  "/admin.apps.restricted.list": {
    GET: { "adminAppsRestrictedList": false }
  },
  "/admin.conversations.archive": {
    POST: { "adminConversationsArchive": true }
  },
  "/admin.conversations.convertToPrivate": {
    POST: { "adminConversationsConvertToPrivate": true }
  },
  "/admin.conversations.create": {
    POST: { "adminConversationsCreate": true }
  },
  "/admin.conversations.delete": {
    POST: { "adminConversationsDelete": true }
  },
  "/admin.conversations.disconnectShared": {
    POST: { "adminConversationsDisconnectShared": true }
  },
  "/admin.conversations.ekm.listOriginalConnectedChannelInfo": {
    GET: { "adminConversationsEkmListOriginalConnectedChannelInfo": false }
  },
  "/admin.conversations.getConversationPrefs": {
    GET: { "adminConversationsGetConversationPrefs": true }
  },
  "/admin.conversations.getTeams": {
    GET: { "adminConversationsGetTeams": true }
  },
  "/admin.conversations.invite": {
    POST: { "adminConversationsInvite": true }
  },
  "/admin.conversations.rename": {
    POST: { "adminConversationsRename": true }
  },
  "/admin.conversations.restrictAccess.addGroup": {
    POST: { "adminConversationsRestrictAccessAddGroup": false }
  },
  "/admin.conversations.restrictAccess.listGroups": {
    GET: { "adminConversationsRestrictAccessListGroups": false }
  },
  "/admin.conversations.restrictAccess.removeGroup": {
    POST: { "adminConversationsRestrictAccessRemoveGroup": false }
  },
  "/admin.conversations.search": {
    GET: { "adminConversationsSearch": true }
  },
  "/admin.conversations.setConversationPrefs": {
    POST: { "adminConversationsSetConversationPrefs": true }
  },
  "/admin.conversations.setTeams": {
    POST: { "adminConversationsSetTeams": true }
  },
  "/admin.conversations.unarchive": {
    POST: { "adminConversationsUnarchive": true }
  },
  "/admin.emoji.add": {
    POST: { "adminEmojiAdd": false }
  },
  "/admin.emoji.addAlias": {
    POST: { "adminEmojiAddAlias": false }
  },
  "/admin.emoji.list": {
    GET: { "adminEmojiList": false }
  },
  "/admin.emoji.remove": {
    POST: { "adminEmojiRemove": false }
  },
  "/admin.emoji.rename": {
    POST: { "adminEmojiRename": false }
  },
  "/admin.inviteRequests.approve": {
    POST: { "adminInviteRequestsApprove": true }
  },
  "/admin.inviteRequests.approved.list": {
    GET: { "adminInviteRequestsApprovedList": true }
  },
  "/admin.inviteRequests.denied.list": {
    GET: { "adminInviteRequestsDeniedList": true }
  },
  "/admin.inviteRequests.deny": {
    POST: { "adminInviteRequestsDeny": true }
  },
  "/admin.inviteRequests.list": {
    GET: { "adminInviteRequestsList": true }
  },
  "/admin.teams.admins.list": {
    GET: { "adminTeamsAdminsList": false }
  },
  "/admin.teams.create": {
    POST: { "adminTeamsCreate": true }
  },
  "/admin.teams.list": {
    GET: { "adminTeamsList": true }
  },
  "/admin.teams.owners.list": {
    GET: { "adminTeamsOwnersList": false }
  },
  "/admin.teams.settings.info": {
    GET: { "adminTeamsSettingsInfo": true }
  },
  "/admin.teams.settings.setDefaultChannels": {
    POST: { "adminTeamsSettingsSetDefaultChannels": false }
  },
  "/admin.teams.settings.setDescription": {
    POST: { "adminTeamsSettingsSetDescription": true }
  },
  "/admin.teams.settings.setDiscoverability": {
    POST: { "adminTeamsSettingsSetDiscoverability": true }
  },
  "/admin.teams.settings.setIcon": {
    POST: { "adminTeamsSettingsSetIcon": false }
  },
  "/admin.teams.settings.setName": {
    POST: { "adminTeamsSettingsSetName": true }
  },
  "/admin.usergroups.addChannels": {
    POST: { "adminUsergroupsAddChannels": true }
  },
  "/admin.usergroups.addTeams": {
    POST: { "adminUsergroupsAddTeams": true }
  },
  "/admin.usergroups.listChannels": {
    GET: { "adminUsergroupsListChannels": true }
  },
  "/admin.usergroups.removeChannels": {
    POST: { "adminUsergroupsRemoveChannels": true }
  },
  "/admin.users.assign": {
    POST: { "adminUsersAssign": true }
  },
  "/admin.users.invite": {
    POST: { "adminUsersInvite": true }
  },
  "/admin.users.list": {
    GET: { "adminUsersList": true }
  },
  "/admin.users.remove": {
    POST: { "adminUsersRemove": true }
  },
  "/admin.users.session.invalidate": {
    POST: { "adminUsersSessionInvalidate": true }
  },
  "/admin.users.session.reset": {
    POST: { "adminUsersSessionReset": true }
  },
  "/admin.users.setAdmin": {
    POST: { "adminUsersSetAdmin": true }
  },
  "/admin.users.setExpiration": {
    POST: { "adminUsersSetExpiration": true }
  },
  "/admin.users.setOwner": {
    POST: { "adminUsersSetOwner": true }
  },
  "/admin.users.setRegular": {
    POST: { "adminUsersSetRegular": true }
  }
});

// src/types/api.ts
Internal.define({
  "/api.test": {
    GET: { "apiTest": true }
  }
});

// src/types/apps.ts
Internal.define({
  "/apps.event.authorizations.list": {
    GET: { "appsEventAuthorizationsList": true }
  },
  "/apps.permissions.info": {
    GET: { "appsPermissionsInfo": false }
  },
  "/apps.permissions.request": {
    GET: { "appsPermissionsRequest": false }
  },
  "/apps.permissions.resources.list": {
    GET: { "appsPermissionsResourcesList": false }
  },
  "/apps.permissions.scopes.list": {
    GET: { "appsPermissionsScopesList": false }
  },
  "/apps.permissions.users.list": {
    GET: { "appsPermissionsUsersList": false }
  },
  "/apps.permissions.users.request": {
    GET: { "appsPermissionsUsersRequest": false }
  },
  "/apps.uninstall": {
    GET: { "appsUninstall": false }
  }
});

// src/types/auth.ts
Internal.define({
  "/auth.revoke": {
    GET: { "authRevoke": false }
  },
  "/auth.test": {
    GET: { "authTest": true }
  }
});

// src/types/bots.ts
Internal.define({
  "/bots.info": {
    GET: { "botsInfo": false }
  }
});

// src/types/calls.ts
Internal.define({
  "/calls.add": {
    POST: { "callsAdd": true }
  },
  "/calls.end": {
    POST: { "callsEnd": true }
  },
  "/calls.info": {
    GET: { "callsInfo": true }
  },
  "/calls.participants.add": {
    POST: { "callsParticipantsAdd": true }
  },
  "/calls.participants.remove": {
    POST: { "callsParticipantsRemove": true }
  },
  "/calls.update": {
    POST: { "callsUpdate": true }
  }
});

// src/types/chat.ts
Internal.define({
  "/chat.delete": {
    POST: { "chatDelete": true }
  },
  "/chat.deleteScheduledMessage": {
    POST: { "chatDeleteScheduledMessage": true }
  },
  "/chat.getPermalink": {
    GET: { "chatGetPermalink": false }
  },
  "/chat.meMessage": {
    POST: { "chatMeMessage": true }
  },
  "/chat.postEphemeral": {
    POST: { "chatPostEphemeral": true }
  },
  "/chat.postMessage": {
    POST: { "chatPostMessage": true }
  },
  "/chat.scheduleMessage": {
    POST: { "chatScheduleMessage": true }
  },
  "/chat.scheduledMessages.list": {
    GET: { "chatScheduledMessagesList": true }
  },
  "/chat.unfurl": {
    POST: { "chatUnfurl": true }
  },
  "/chat.update": {
    POST: { "chatUpdate": true }
  }
});

// src/types/conversations.ts
Internal.define({
  "/conversations.archive": {
    POST: { "conversationsArchive": true }
  },
  "/conversations.close": {
    POST: { "conversationsClose": true }
  },
  "/conversations.create": {
    POST: { "conversationsCreate": true }
  },
  "/conversations.history": {
    GET: { "conversationsHistory": true }
  },
  "/conversations.info": {
    GET: { "conversationsInfo": false }
  },
  "/conversations.invite": {
    POST: { "conversationsInvite": true }
  },
  "/conversations.join": {
    POST: { "conversationsJoin": true }
  },
  "/conversations.kick": {
    POST: { "conversationsKick": true }
  },
  "/conversations.leave": {
    POST: { "conversationsLeave": true }
  },
  "/conversations.list": {
    GET: { "conversationsList": false }
  },
  "/conversations.mark": {
    POST: { "conversationsMark": true }
  },
  "/conversations.members": {
    GET: { "conversationsMembers": false }
  },
  "/conversations.open": {
    POST: { "conversationsOpen": true }
  },
  "/conversations.rename": {
    POST: { "conversationsRename": true }
  },
  "/conversations.replies": {
    GET: { "conversationsReplies": false }
  },
  "/conversations.setPurpose": {
    POST: { "conversationsSetPurpose": true }
  },
  "/conversations.setTopic": {
    POST: { "conversationsSetTopic": true }
  },
  "/conversations.unarchive": {
    POST: { "conversationsUnarchive": true }
  }
});

// src/types/dialog.ts
Internal.define({
  "/dialog.open": {
    GET: { "dialogOpen": true }
  }
});

// src/types/dnd.ts
Internal.define({
  "/dnd.endDnd": {
    POST: { "dndEndDnd": true }
  },
  "/dnd.endSnooze": {
    POST: { "dndEndSnooze": true }
  },
  "/dnd.info": {
    GET: { "dndInfo": false }
  },
  "/dnd.setSnooze": {
    POST: { "dndSetSnooze": false }
  },
  "/dnd.teamInfo": {
    GET: { "dndTeamInfo": false }
  }
});

// src/types/emoji.ts
Internal.define({
  "/emoji.list": {
    GET: { "emojiList": false }
  }
});

// src/types/files.ts
Internal.define({
  "/files.comments.delete": {
    POST: { "filesCommentsDelete": true }
  },
  "/files.delete": {
    POST: { "filesDelete": true }
  },
  "/files.info": {
    GET: { "filesInfo": false }
  },
  "/files.list": {
    GET: { "filesList": false }
  },
  "/files.remote.add": {
    POST: { "filesRemoteAdd": false }
  },
  "/files.remote.info": {
    GET: { "filesRemoteInfo": false }
  },
  "/files.remote.list": {
    GET: { "filesRemoteList": false }
  },
  "/files.remote.remove": {
    POST: { "filesRemoteRemove": false }
  },
  "/files.remote.share": {
    GET: { "filesRemoteShare": false }
  },
  "/files.remote.update": {
    POST: { "filesRemoteUpdate": false }
  },
  "/files.revokePublicURL": {
    POST: { "filesRevokePublicURL": true }
  },
  "/files.sharedPublicURL": {
    POST: { "filesSharedPublicURL": true }
  },
  "/files.upload": {
    POST: { "filesUpload": false }
  }
});

// src/types/migration.ts
Internal.define({
  "/migration.exchange": {
    GET: { "migrationExchange": false }
  }
});

// src/types/oauth.ts
Internal.define({
  "/oauth.access": {
    GET: { "oauthAccess": false }
  },
  "/oauth.token": {
    GET: { "oauthToken": false }
  },
  "/oauth.v2.access": {
    GET: { "oauthV2Access": false }
  }
});

// src/types/pins.ts
Internal.define({
  "/pins.add": {
    POST: { "pinsAdd": true }
  },
  "/pins.list": {
    GET: { "pinsList": false }
  },
  "/pins.remove": {
    POST: { "pinsRemove": true }
  }
});

// src/types/reactions.ts
Internal.define({
  "/reactions.add": {
    POST: { "reactionsAdd": true }
  },
  "/reactions.get": {
    GET: { "reactionsGet": false }
  },
  "/reactions.list": {
    GET: { "reactionsList": false }
  },
  "/reactions.remove": {
    POST: { "reactionsRemove": true }
  }
});

// src/types/reminders.ts
Internal.define({
  "/reminders.add": {
    POST: { "remindersAdd": true }
  },
  "/reminders.complete": {
    POST: { "remindersComplete": true }
  },
  "/reminders.delete": {
    POST: { "remindersDelete": true }
  },
  "/reminders.info": {
    GET: { "remindersInfo": false }
  },
  "/reminders.list": {
    GET: { "remindersList": false }
  }
});

// src/types/rtm.ts
Internal.define({
  "/rtm.connect": {
    GET: { "rtmConnect": false }
  }
});

// src/types/search.ts
Internal.define({
  "/search.messages": {
    GET: { "searchMessages": false }
  }
});

// src/types/stars.ts
Internal.define({
  "/stars.add": {
    POST: { "starsAdd": true }
  },
  "/stars.list": {
    GET: { "starsList": false }
  },
  "/stars.remove": {
    POST: { "starsRemove": true }
  }
});

// src/types/team.ts
Internal.define({
  "/team.accessLogs": {
    GET: { "teamAccessLogs": false }
  },
  "/team.billableInfo": {
    GET: { "teamBillableInfo": false }
  },
  "/team.info": {
    GET: { "teamInfo": false }
  },
  "/team.integrationLogs": {
    GET: { "teamIntegrationLogs": false }
  },
  "/team.profile.get": {
    GET: { "teamProfileGet": false }
  }
});

// src/types/usergroups.ts
Internal.define({
  "/usergroups.create": {
    POST: { "usergroupsCreate": true }
  },
  "/usergroups.disable": {
    POST: { "usergroupsDisable": true }
  },
  "/usergroups.enable": {
    POST: { "usergroupsEnable": true }
  },
  "/usergroups.list": {
    GET: { "usergroupsList": false }
  },
  "/usergroups.update": {
    POST: { "usergroupsUpdate": true }
  },
  "/usergroups.users.list": {
    GET: { "usergroupsUsersList": false }
  },
  "/usergroups.users.update": {
    POST: { "usergroupsUsersUpdate": true }
  }
});

// src/types/users.ts
Internal.define({
  "/users.conversations": {
    GET: { "usersConversations": false }
  },
  "/users.deletePhoto": {
    POST: { "usersDeletePhoto": false }
  },
  "/users.getPresence": {
    GET: { "usersGetPresence": false }
  },
  "/users.identity": {
    GET: { "usersIdentity": false }
  },
  "/users.info": {
    GET: { "usersInfo": false }
  },
  "/users.list": {
    GET: { "usersList": false }
  },
  "/users.lookupByEmail": {
    GET: { "usersLookupByEmail": false }
  },
  "/users.profile.get": {
    GET: { "usersProfileGet": false }
  },
  "/users.profile.set": {
    POST: { "usersProfileSet": true }
  },
  "/users.setActive": {
    POST: { "usersSetActive": true }
  },
  "/users.setPhoto": {
    POST: { "usersSetPhoto": false }
  },
  "/users.setPresence": {
    POST: { "usersSetPresence": true }
  }
});

// src/types/views.ts
Internal.define({
  "/views.open": {
    GET: { "viewsOpen": true }
  },
  "/views.publish": {
    GET: { "viewsPublish": true }
  },
  "/views.push": {
    GET: { "viewsPush": true }
  },
  "/views.update": {
    GET: { "viewsUpdate": true }
  }
});

// src/types/workflows.ts
Internal.define({
  "/workflows.stepCompleted": {
    GET: { "workflowsStepCompleted": true }
  },
  "/workflows.stepFailed": {
    GET: { "workflowsStepFailed": true }
  },
  "/workflows.updateStep": {
    GET: { "workflowsUpdateStep": true }
  }
});

// src/index.ts
var src_default = SlackBot;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  HttpServer,
  Internal,
  SlackBot,
  SlackMessageEncoder,
  Token,
  WsClient,
  adaptMessage,
  adaptMessageDeleted,
  adaptSentAsset,
  adaptSession,
  decodeChannel,
  decodeGuild,
  decodeGuildMember,
  decodeUser,
  escape,
  unescape
});
