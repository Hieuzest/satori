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
  HttpAdapter: () => HttpAdapter,
  Internal: () => Internal,
  MatrixBot: () => MatrixBot,
  MatrixMessageEncoder: () => MatrixMessageEncoder,
  adaptMessage: () => adaptMessage,
  adaptSession: () => adaptSession,
  decodeUser: () => decodeUser,
  default: () => src_default,
  dispatchSession: () => dispatchSession
});
module.exports = __toCommonJS(src_exports);

// src/bot.ts
var import_core4 = require("@satorijs/core");

// src/http.ts
var import_core2 = require("@satorijs/core");

// src/utils.ts
var import_core = require("@satorijs/core");
var import_html5parser = require("html5parser");
var decodeUser = /* @__PURE__ */ __name((data, id) => ({
  id,
  name: data.displayname,
  avatar: data.avatar_url
}), "decodeUser");
async function adaptMessage(bot, data, message = {}, payload = message) {
  message.id = message.messageId = data.event_id;
  const content = data.content;
  const reply = content["m.relates_to"]?.["m.in_reply_to"];
  if (reply) {
    message.quote = await bot.getMessage(data.room_id, reply.event_id);
  }
  switch (content.msgtype) {
    case "m.text":
    case "m.emote":
    case "m.notice": {
      message.content = parsseContent(bot, content);
      break;
    }
    case "m.image":
    case "m.file":
    case "m.audio":
    case "m.video": {
      const src = bot.internal.getAssetUrl(content.url);
      const type = content.msgtype.substring(2);
      message.content = (0, import_core.segment)(type === "audio" ? "record" : type === "image" ? "img" : type, { src }).toString();
      break;
    }
    default:
      return null;
  }
  message.elements ??= import_core.segment.parse(message.content);
  if (!payload) return message;
  payload.timestamp = data.origin_server_ts;
  payload.channel = {
    id: data.room_id,
    type: import_core.Universal.Channel.Type.TEXT
  };
  payload.guild = {
    id: data.room_id
  };
  payload.user = {
    id: data.sender
  };
  payload.member = {};
  return message;
}
__name(adaptMessage, "adaptMessage");
async function adaptSession(bot, event) {
  const session = bot.session();
  if (event.type === "m.room.message") {
    const content = event.content;
    const newContent = content["m.new_content"];
    if (newContent) {
      session.type = "message-update";
      content.body = newContent.body;
      content.msgtype = newContent.msgtype;
    } else {
      session.type = "message";
    }
    if (!await adaptMessage(bot, event, session.event.message = {}, session.event)) return null;
    return session;
  }
  session.userId = event.sender;
  session.guildId = event.room_id;
  session.channelId = event.room_id;
  session.messageId = event.event_id;
  session.timestamp = event.origin_server_ts;
  session.isDirect = false;
  switch (event.type) {
    case "m.room.redaction": {
      session.type = "message-deleted";
      session.subtype = "group";
      session.messageId = event.redacts;
      break;
    }
    case "m.reaction": {
      const content = event.content;
      session.type = "reaction-added";
      session.subtype = "group";
      session.content = content["m.relates_to"].key;
      session.messageId = content["m.relates_to"].event_id;
      break;
    }
    case "m.room.member": {
      bot.syncRooms();
      const memberEvent = event.content;
      session["targetId"] = memberEvent.state_key;
      session.operatorId = event.sender;
      session.messageId = event.event_id;
      if (memberEvent.reason) {
        session.content = memberEvent.reason;
      }
      switch (memberEvent.membership) {
        case "join":
          session.type = "guild-member-added";
          break;
        case "leave":
          session.type = "guild-member-deleted";
          break;
        case "ban":
          session.type = "guild-member";
          session.subtype = "ban";
          break;
        case "invite":
          if (event.state_key === bot.userId) {
            session.type = "guild-request";
            session.messageId = event.room_id;
            break;
          }
        // fallthrough
        default:
          session.type = event.type;
      }
      break;
    }
    default:
      session.type = event.type;
  }
  return session;
}
__name(adaptSession, "adaptSession");
async function dispatchSession(bot, event) {
  const session = await adaptSession(bot, event);
  if (!session) return;
  session.setInternal("matrix", event);
  bot.dispatch(session);
}
__name(dispatchSession, "dispatchSession");
function parsseContent(bot, content) {
  if (content["format"] !== "org.matrix.custom.html") {
    return content.body;
  }
  const { formatted_body } = content;
  let result = "";
  (/* @__PURE__ */ __name(function visit(nodes) {
    if (!nodes) return;
    for (const node of nodes) {
      if (node.type === import_html5parser.SyntaxKind.Text) {
        result += import_core.segment.escape(decodeHE(node.value).trim() || "");
      } else {
        let tag = function(name) {
          result += `<${name}>`;
          visit(node.body);
          result += `</${name}>`;
        };
        __name(tag, "tag");
        switch (node.name) {
          case "del":
            tag("s");
            break;
          case "p":
            tag("p");
            break;
          case "b":
            tag("b");
            break;
          case "i":
            tag("i");
            break;
          case "u":
            tag("u");
            break;
          case "strong":
            tag("b");
            break;
          case "em":
            tag("em");
            break;
          case "strike":
            tag("s");
            break;
          case "code":
            tag("code");
            break;
          case "sup":
            tag("sup");
            break;
          case "sub":
            tag("sub");
            break;
          case "a": {
            const href = node.attributeMap.href?.value.value || "#";
            if (href.startsWith("https://matrix.to/#/@")) {
              result += `<at id="${href.substring(20)}">`;
              visit(node.body);
              result += "</at>";
              break;
            } else if (href.startsWith("https://matrix.to/#/#")) {
              result += `<sharp id="${href.substring(20)}">`;
              visit(node.body);
              result += "</sharp>";
              break;
            }
            result += `<a href="${href}">`;
            visit(node.body);
            result += "</a>";
            break;
          }
          case "li": {
            visit(node.body);
            result += "\n";
            break;
          }
          case "hr": {
            result += "\n\n";
            break;
          }
          case "br": {
            result += "\n";
            break;
          }
          case "img": {
            const src = node.attributeMap.src?.value.value;
            const alt = node.attributeMap.src?.value.value;
            if (!src) {
              if (alt) result += alt;
              break;
            }
            if (src.match(/^(data|https?):/)) {
              result += `<img src="${src}"/>`;
              break;
            } else if (src.startsWith("mxc://")) {
              result += `<img src="${bot.internal.getAssetUrl(src)}">`;
              break;
            }
            break;
          }
          case "blockquote": {
            result += "> ";
            visit(node.body);
            break;
          }
          case "mx-reply":
            break;
          // div table thead tbody tr th td caption pre span
          // details summary ul ol font h1 h2 h3 h4 h5 h6
          default:
            visit(node.body);
        }
      }
    }
  }, "visit"))((0, import_html5parser.parse)(formatted_body, { setAttributeMap: true }));
  return result;
}
__name(parsseContent, "parsseContent");
var entities = {
  nbsp: " ",
  cent: "¢",
  pound: "£",
  yen: "¥",
  euro: "€",
  copy: "©",
  reg: "®",
  lt: "<",
  gt: ">",
  quot: '"',
  amp: "&",
  apos: "'"
};
function decodeHE(text) {
  const regex = /&(([a-z0-9]+)|(#[0-9]{1,6})|(#x[0-9a-fA-F]{1,6}));/ig;
  return text.replace(regex, (_1, _2, name, dec, hex) => {
    if (name) {
      if (name in entities) {
        return entities[name];
      } else {
        return text;
      }
    } else if (dec) {
      return String.fromCharCode(+dec.substring(1));
    } else if (hex) {
      return String.fromCharCode(parseInt(hex.substring(2), 16));
    }
  });
}
__name(decodeHE, "decodeHE");

// src/http.ts
var HttpAdapter = class extends import_core2.Adapter {
  static {
    __name(this, "HttpAdapter");
  }
  static inject = ["server"];
  txnId = null;
  constructor(ctx) {
    super(ctx);
    ctx.server.all("/(.*)", (koaCtx, next) => {
      const match = this.bots.filter((bot) => koaCtx.path.startsWith(bot.config.path + "/"));
      if (match.length === 0) return next();
      const asToken = koaCtx.headers.authorization?.substring(7) || koaCtx.query.access_token;
      if (!asToken) return next();
      const bots = match.filter((bot) => bot.config.hsToken === asToken);
      if (!bots.length) {
        koaCtx.status = 403;
        koaCtx.body = { errcode: "M_FORBIDDEN" };
        return;
      }
      const trimmed = koaCtx.path.substring(bots[0].config.path.length);
      const path = trimmed.startsWith("/_matrix/app/v1/") ? trimmed.substring(15) : trimmed;
      if (koaCtx.method === "PUT" && path.startsWith("/transactions/")) {
        const txnId = path.substring(14);
        this.transactions(koaCtx, bots, txnId);
      } else if (koaCtx.method === "GET" && path.startsWith("/users/")) {
        const user = path.substring(7);
        this.users(koaCtx, bots, user);
      } else if (koaCtx.method === "GET" && path.startsWith("/rooms/")) {
        const room = path.substring(7);
        this.rooms(koaCtx, bots, room);
      } else {
        koaCtx.status = 404;
      }
    });
  }
  async connect(bot) {
    try {
      await bot.initialize();
      bot.online();
    } catch (e) {
      bot.logger.error("failed to initialize", e);
      throw e;
    }
  }
  transactions(ctx, bots, txnId) {
    const events = ctx.request.body.events;
    ctx.body = {};
    if (txnId === this.txnId) return;
    this.txnId = txnId;
    for (const event of events) {
      const inRoom = bots.filter((bot2) => bot2.userId !== event.sender && bot2.rooms.includes(event.room_id));
      let bot;
      if (event.type === "m.room.member" && event.content.membership === "invite" && (bot = bots.find((bot2) => bot2.userId === event.state_key)) && !inRoom.includes(bot)) {
        inRoom.push(bot);
      }
      inRoom.forEach((bot2) => dispatchSession(bot2, event));
    }
  }
  users(ctx, bots, userId) {
    if (!bots.find((bot) => bot.userId === userId)) {
      ctx.status = 404;
      ctx.body = { "errcode": "CHAT.SATORI.NOT_FOUND" };
      return;
    }
    ctx.body = {};
  }
  rooms(ctx, bots, room) {
    ctx.status = 404;
    ctx.body = { "errcode": "CHAT.SATORI.NOT_FOUND" };
  }
};

// src/message.ts
var import_core3 = require("@satorijs/core");
var MatrixMessageEncoder = class extends import_core3.MessageEncoder {
  static {
    __name(this, "MatrixMessageEncoder");
  }
  buffer = "";
  reply = null;
  async sendMedia(url, mediaType) {
    try {
      const session = this.bot.session(this.session);
      const { data, filename, type } = await this.bot.ctx.http.file(url);
      const id = await this.bot.internal.sendMediaMessage(
        this.channelId,
        mediaType,
        Buffer.from(data),
        this.reply?.id,
        type,
        filename
      );
      session.messageId = id;
      this.results.push(session.event.message);
      this.reply = null;
    } catch (e) {
      this.errors.push(e);
    }
  }
  async flush() {
    if (!this.buffer) return;
    try {
      const session = this.bot.session(this.session);
      if (this.reply) {
        this.buffer = `> <${this.reply.user.id}> ${this.reply.content}

` + this.buffer;
      }
      const id = await this.bot.internal.sendTextMessage(
        this.channelId,
        this.buffer,
        this.reply?.id
      );
      session.messageId = id;
      this.results.push(session.event.message);
      this.buffer = "";
      this.reply = null;
    } catch (e) {
      this.errors.push(e);
    }
  }
  async visit(element) {
    const { type, attrs, children } = element;
    if (type === "text") {
      this.buffer += attrs.content.replace(/[\\*_`~|]/g, "\\$&");
    } else if (type === "b" || type === "strong") {
      this.buffer += "**";
      await this.render(children);
      this.buffer += "**";
    } else if (type === "i" || type === "em") {
      this.buffer += "*";
      await this.render(children);
      this.buffer += "*";
    } else if (type === "u" || type === "ins") {
      this.buffer += "__";
      await this.render(children);
      this.buffer += "__";
    } else if (type === "s" || type === "del") {
      this.buffer += "~~";
      await this.render(children);
      this.buffer += "~~";
    } else if (type === "code") {
      this.buffer += "`";
      await this.render(children);
      this.buffer += "`";
    } else if (type === "a") {
      this.buffer += "[";
      await this.render(children);
      this.buffer += `](${attrs.href})`;
    } else if (type === "br") {
      this.buffer += "\n";
    } else if (type === "p") {
      if (!this.buffer.endsWith("\n")) this.buffer += "\n";
      await this.render(children);
      if (!this.buffer.endsWith("\n")) this.buffer += "\n";
    } else if (type === "at") {
      if (attrs.id) {
        this.buffer += ` @${attrs.id} `;
      } else if (attrs.type === "all") {
        this.buffer += ` @room `;
      }
    } else if (type === "sharp" && attrs.id) {
      this.buffer += ` #${attrs.id} `;
    } else if ((type === "image" || type === "img" || type === "video" || type === "record" || type === "file") && (attrs.src || attrs.url)) {
      await this.flush();
      const matrixType = type === "record" ? "audio" : type === "img" ? "image" : type;
      await this.sendMedia(attrs.src || attrs.url, matrixType);
    } else if (type === "quote") {
      this.reply = await this.bot.getMessage(this.channelId, attrs.id);
    } else if (type === "message") {
      await this.flush();
      await this.render(children, true);
    } else {
      await this.render(children);
    }
  }
};

// src/types.ts
var import_image_size = __toESM(require("image-size"), 1);
var Internal = class {
  constructor(bot) {
    this.bot = bot;
  }
  static {
    __name(this, "Internal");
  }
  txnId = Math.round(Math.random() * 1e3);
  async uploadFile(filename, buffer, mimetype) {
    const headers = {};
    if (mimetype) headers["content-type"] = mimetype;
    return (await this.bot.http.post(`/media/v3/upload?filename=${filename}`, buffer, { headers })).content_uri;
  }
  async sendTextMessage(roomId, content, reply) {
    const eventContent = {
      msgtype: "m.text",
      body: content
    };
    if (reply) eventContent["m.relates_to"] = { "m.in_reply_to": { "event_id": reply } };
    const response = await this.bot.http.put(
      `/client/v3/rooms/${roomId}/send/m.room.message/${this.txnId++}`,
      eventContent
    );
    return response.event_id;
  }
  async sendMediaMessage(roomId, type, buffer, reply, mimetype, filename = "file") {
    const uri = await this.uploadFile(filename, buffer, mimetype);
    let info;
    if (type === "image") {
      const { width, height } = (0, import_image_size.default)(buffer);
      info = {
        size: buffer.byteLength,
        h: height,
        w: width,
        mimetype
      };
    }
    const eventContent = {
      msgtype: `m.${type}`,
      body: filename,
      url: uri,
      info
    };
    if (reply) eventContent["m.relates_to"] = { "m.in_reply_to": { "event_id": reply } };
    const response = await this.bot.http.put(
      `/client/v3/rooms/${roomId}/send/m.room.message/${this.txnId++}`,
      eventContent
    );
    return response.event_id;
  }
  async sendReaction(roomId, messageId, key) {
    const eventContent = {
      "m.relates_to": {
        rel_type: "m.annotation",
        event_id: messageId,
        key
      }
    };
    const response = await this.bot.http.put(
      `/client/v3/rooms/${roomId}/send/m.reaction/${this.txnId++}`,
      eventContent
    );
    return response.event_id;
  }
  async getEvent(roomId, eventId) {
    return await this.bot.http.get(`/client/v3/rooms/${roomId}/event/${eventId}`);
  }
  async redactEvent(roomId, eventId, reason) {
    const event = await this.bot.http.put(`/client/v3/rooms/${roomId}/redact/${eventId}/${this.txnId++}`, { reason });
    return event.event_id;
  }
  async getProfile(userId) {
    return await this.bot.http.get(`/client/v3/profile/${userId}`);
  }
  async setDisplayName(userId, displayname) {
    await this.bot.http.put(`/client/v3/profile/${userId}/displayname`, { displayname });
  }
  async setAvatar(userId, buffer, mimetype) {
    const uri = await this.uploadFile("avatar", buffer, mimetype);
    await this.bot.http.put(`/client/v3/profile/${userId}/avatar_url`, { avatar_url: uri });
  }
  async createRoom(creation) {
    const response = await this.bot.http.post("/client/v3/createRoom", creation);
    return response.room_id;
  }
  async joinRoom(roomId, reason) {
    const response = await this.bot.http.post(`/client/v3/join/${roomId}`, { reason });
    return response.room_id;
  }
  async leaveRoom(roomId, reason) {
    const response = await this.bot.http.post(`/client/v3/rooms/${roomId}/leave`, { reason });
    return response.room_id;
  }
  async invite(roomId, userId, reason) {
    await this.bot.http.post(`/client/v3/rooms/${roomId}/invite`, { user_id: userId, reason });
  }
  async sync(fullSstate = false) {
    return await this.bot.http.get("/client/v3/sync", {
      params: { full_state: fullSstate }
    });
  }
  async getState(roomId) {
    return await this.bot.http.get(`/client/v3/rooms/${roomId}/state`);
  }
  async setState(roomId, eventType, event, state) {
    const statePath = state ? `/${state}` : "";
    const response = await this.bot.http.put(`/client/v3/rooms/${roomId}/state/${eventType}${statePath}`, event);
    return response.event_id;
  }
  async getJoinedRooms() {
    return await this.bot.http.get("/client/v3/joined_rooms");
  }
  async register(username, asToken) {
    return await this.bot.ctx.http.post(this.bot.endpoint + "/client/v3/register", {
      type: "m.login.application_service",
      username
    }, {
      headers: {
        "Authorization": `Bearer ${asToken}`
      }
    });
  }
  async login(username, asToken) {
    return await this.bot.ctx.http.post(this.bot.endpoint + "/client/v3/login", {
      type: "m.login.application_service",
      identifier: {
        type: "m.id.user",
        user: username
      }
    }, {
      headers: {
        "Authorization": `Bearer ${asToken}`
      }
    });
  }
  getAssetUrl(mxc) {
    return `${this.bot.endpoint}/_matrix/media/v3/download/${mxc.substring(6)}`;
  }
};

// src/bot.ts
var MatrixBot = class extends import_core4.Bot {
  static {
    __name(this, "MatrixBot");
  }
  static MessageEncoder = MatrixMessageEncoder;
  static inject = ["http"];
  http;
  id;
  endpoint;
  rooms = [];
  internal;
  constructor(ctx, config) {
    super(ctx, config, "matrix");
    this.id = config.id;
    this.user.id = `@${this.id}:${this.config.host}`;
    this.user.name = config.name || this.id;
    this.endpoint = (config.endpoint || `https://${config.host}`) + "/_matrix";
    this.internal = new Internal(this);
    ctx.plugin(HttpAdapter, this);
  }
  async initialize() {
    let user;
    try {
      user = await this.internal.register(this.id, this.config.asToken);
    } catch (e) {
      if (e.response.status !== 400 && e.data.errcode !== "M_USER_IN_USE") throw e;
    }
    if (!user) user = await this.internal.login(this.id, this.config.asToken);
    this.http = this.ctx.http.extend({
      ...this.config,
      endpoint: this.endpoint,
      headers: {
        "Authorization": `Bearer ${user.access_token}`
      }
    });
    if (this.config.name) {
      await this.internal.setDisplayName(this.userId, this.config.name);
    }
    if (this.config.avatar) {
      const { data, type } = await this.http.file(this.config.avatar);
      await this.internal.setAvatar(this.userId, Buffer.from(data), type);
    }
    await this.getLogin();
    const sync = await this.syncRooms();
    if (!sync?.rooms?.invite) return;
    setTimeout(() => Object.entries(sync.rooms.invite).forEach(([roomId, room]) => {
      const event = room.invite_state.events.find((event2) => event2.type === "m.room.member" && event2.content.membership === "invite");
      event.room_id = roomId;
      dispatchSession(this, event);
    }));
  }
  async getMessage(channelId, messageId) {
    const event = await this.internal.getEvent(channelId, messageId);
    return await adaptMessage(this, event);
  }
  async deleteMessage(channelId, messageId) {
    await this.internal.redactEvent(channelId, messageId);
  }
  async getLogin() {
    this.user = await this.getUser(this.userId);
    return this.toJSON();
  }
  async getUser(userId) {
    const profile = await this.internal.getProfile(userId);
    const user = decodeUser(profile, userId);
    user.avatar = user.avatar && this.internal.getAssetUrl(user.avatar);
    return user;
  }
  async getGuild(guildId) {
    const { id, name } = await this.getChannel(guildId);
    return { id, name };
  }
  async getChannel(id) {
    const events = await this.internal.getState(id);
    const name = events.find((event) => event.type === "m.room.name")?.content?.name;
    return { id, name, type: import_core4.Universal.Channel.Type.TEXT };
  }
  async getGuildList() {
    const data = await Promise.all(this.rooms.map((roomId) => this.getGuild(roomId)));
    return { data };
  }
  async getChannelList(guildId) {
    const data = await Promise.all(this.rooms.map((roomId) => this.getChannel(roomId)));
    return { data };
  }
  async getGuildMemberList(guildId) {
    const state = await this.internal.getState(guildId);
    const levels = state.find((event) => event.type === "m.room.power_levels").content;
    const data = state.filter((event) => event.type === "m.room.member").map((event) => {
      const content = event.content;
      return {
        user: decodeUser(content, event.state_key),
        isBot: !!this.ctx.bots.find((bot) => bot.userId === event.state_key),
        roles: [levels.users[event.state_key].toString()]
      };
    });
    return { data };
  }
  async getGuildMember(guildId, userId) {
    const { data } = await this.getGuildMemberList(guildId);
    return data.find((member) => member.user.id === userId);
  }
  async createReaction(channelId, messageId, emoji) {
    await this.internal.sendReaction(channelId, messageId, emoji);
  }
  async handleFriendRequest() {
  }
  // as utils.ts commented, messageId is roomId
  async handleGuildRequest(messageId, approve, commit) {
    if (approve) {
      await this.internal.joinRoom(messageId, commit);
    } else {
      await this.internal.leaveRoom(messageId, commit);
    }
    this.syncRooms();
  }
  // will be called after m.room.member received
  async syncRooms() {
    const sync = await this.internal.sync(true);
    if (!sync?.rooms?.join) return;
    this.rooms = Object.keys(sync.rooms.join);
    return sync;
  }
};
((MatrixBot2) => {
  MatrixBot2.Config = import_core4.Schema.object({
    name: import_core4.Schema.string().description("机器人的名称，如果设置了将会在启动时为机器人更改。"),
    avatar: import_core4.Schema.string().description("机器人的头像地址，如果设置了将会在启动时为机器人更改。"),
    id: import_core4.Schema.string().description("机器人的 ID。机器人最后的用户名将会是 `@{id}:{host}`。").required(),
    host: import_core4.Schema.string().description("Matrix Homeserver 域名。").required(),
    hsToken: import_core4.Schema.string().description("hs_token").role("secret").required(),
    asToken: import_core4.Schema.string().description("as_token").role("secret").required(),
    endpoint: import_core4.Schema.string().description("Matrix Homeserver 地址。默认为 `https://{host}`。"),
    path: import_core4.Schema.string().description("Matrix Application Service 的路径。默认为 `/matrix`。").default("/matrix"),
    ...(0, import_core4.omit)(import_core4.HTTP.Config.dict, ["endpoint"])
  });
})(MatrixBot || (MatrixBot = {}));

// src/index.ts
var src_default = MatrixBot;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  HttpAdapter,
  Internal,
  MatrixBot,
  MatrixMessageEncoder,
  adaptMessage,
  adaptSession,
  decodeUser,
  dispatchSession
});
