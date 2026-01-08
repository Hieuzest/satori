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
  Line: () => types_exports,
  LineBot: () => LineBot,
  LineMessageEncoder: () => LineMessageEncoder,
  adaptMessage: () => adaptMessage,
  adaptSessions: () => adaptSessions,
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
async function adaptMessage(bot, message) {
  const result = [];
  if (message.type === "text") {
    const splits = [];
    let nowPos = 0;
    const finalLen = message.text.length;
    for (const emoji of message.emojis ?? []) {
      splits.push(emoji.index);
    }
    for (const mention of message.mention?.mentionees ?? []) {
      splits.push(mention.index);
    }
    if (splits.length === 0) return [import_core.h.text(message.text)];
    do {
      const nextPos = splits.shift() ?? finalLen;
      if (nextPos !== nowPos) {
        result.push(import_core.h.text(message.text.substring(nowPos, nextPos)));
        nowPos = nextPos;
      }
      if (message.emojis) {
        const emoji = message.emojis.find((v) => v.index === nextPos);
        if (emoji) {
          result.push((0, import_core.h)("face", { id: `e:${emoji.productId}:${emoji.emojiId}`, platform: bot.platform }));
          nowPos = nowPos + emoji.length;
        }
      }
      if (message.mention) {
        const mention = message.mention.mentionees.find((v) => v.index === nextPos);
        if (mention) {
          if (mention.type === "all") {
            result.push((0, import_core.h)("at", { type: "all" }));
          } else {
            result.push((0, import_core.h)("at", { name: message.text.slice(nowPos + 1, nowPos + mention.length) }));
          }
          nowPos = nowPos + mention.length;
        }
      }
    } while (nowPos !== finalLen);
  } else if (message.type === "image") {
    if (message.contentProvider.type === "line") {
      return [import_core.h.image(`${bot.ctx.server.config.selfUrl}/line/assets/${bot.selfId}/${message.id}`)];
    } else {
      return [import_core.h.image(message.contentProvider.originalContentUrl)];
    }
  } else if (message.type === "video") {
    if (message.contentProvider.type === "line") {
      return [import_core.h.video(`${bot.ctx.server.config.selfUrl}/line/assets/${bot.selfId}/${message.id}`)];
    } else {
      return [import_core.h.video(message.contentProvider.originalContentUrl)];
    }
  } else if (message.type === "sticker") {
    return [(0, import_core.h)("face", { type: "sticker", id: `s:${message.packageId}:${message.stickerId}`, platform: bot.platform })];
  } else if (message.type === "file") {
    return [import_core.h.file(`${bot.ctx.server.config.selfUrl}/line/assets/${bot.selfId}/${message.id}`)];
  }
  return result;
}
__name(adaptMessage, "adaptMessage");
async function adaptSessions(bot, body) {
  const result = [bot.session({
    type: "internal",
    _type: `line/${(0, import_core.hyphenate)(body.type)}`,
    _data: body
  })];
  const session = bot.session();
  session.setInternal("line", body);
  session.timestamp = +body.timestamp;
  if (body.source.type === "user") {
    session.userId = body.source.userId;
    session.channelId = body.source.userId;
  } else if (body.source.type === "group") {
    session.guildId = body.source.groupId;
    session.channelId = body.source.groupId;
    session.userId = body.source.userId;
  } else if (body.source.type === "room") {
    session.guildId = body.source.roomId;
    session.channelId = body.source.roomId;
    session.userId = body.source.userId;
  }
  if (body.type === "message") {
    session.type = "message";
    session.isDirect = body.source.type === "user";
    session.messageId = body.message.id;
    session.elements = await adaptMessage(bot, body.message);
    session.content = session.elements.join("");
  } else if (body.type === "memberJoined") {
    session.type = "guild-member-added";
    for (const user of body.joined.members) {
      const tmpSession = Object.assign({}, session);
      tmpSession.userId = user.userId;
      result.push(tmpSession);
    }
  } else if (body.type === "memberLeft") {
    session.type = "guild-member-deleted";
    for (const user of body.left.members) {
      const tmpSession = Object.assign({}, session);
      tmpSession.userId = user.userId;
      result.push(tmpSession);
    }
  } else if (body.type === "follow") {
    session.type = "friend-added";
    session.userId = body.source.userId;
  } else if (body.type === "unfollow") {
    session.type = "friend-deleted";
    session.userId = body.source.userId;
  } else if (body.type === "unsend") {
    session.type = "message-deleted";
    session.messageId = body.unsend.messageId;
  } else if (body.type === "join") {
    session.type = "guild-added";
  } else if (body.type === "leave") {
    session.type = "guild-deleted";
  } else if (body.type === "postback") {
    session.type = "interaction/button";
    session.messageId = body.webhookEventId;
    session.event.button = {
      id: body.postback.data
    };
  }
  if (session.type) result.push(session);
  return result;
}
__name(adaptSessions, "adaptSessions");

// src/http.ts
var HttpServer = class extends import_core2.Adapter {
  static {
    __name(this, "HttpServer");
  }
  static inject = ["server"];
  async connect(bot) {
    bot.ctx.server.post("/line", async (ctx) => {
      const sign = ctx.headers["x-line-signature"]?.toString();
      const parsed = ctx.request.body;
      const { destination } = parsed;
      const bot2 = this.bots.find((bot3) => bot3.selfId === destination);
      if (!bot2) return ctx.status = 403;
      const hash = import_node_crypto.default.createHmac("SHA256", bot2?.config?.secret).update(ctx.request.body[Symbol.for("unparsedBody")] || "").digest("base64");
      if (hash !== sign) {
        return ctx.status = 403;
      }
      bot2.logger.debug(parsed);
      for (const event of parsed.events) {
        const sessions = await adaptSessions(bot2, event);
        if (sessions.length) sessions.forEach(bot2.dispatch.bind(bot2));
        bot2.logger.debug(sessions);
      }
      ctx.status = 200;
      ctx.body = "ok";
    });
    bot.ctx.server.get("/line/assets/:self_id/:message_id", async (ctx) => {
      const messageId = ctx.params.message_id;
      const selfId = ctx.params.self_id;
      const bot2 = this.bots.find((bot3) => bot3.selfId === selfId);
      if (!bot2) return ctx.status = 404;
      const resp = await bot2.contentHttp.axios(`/v2/bot/message/${messageId}/content`, {
        method: "GET",
        responseType: "stream"
      });
      ctx.type = resp.headers.get("content-type");
      ctx.set("cache-control", resp.headers.get("cache-control"));
      ctx.response.body = resp.data;
      ctx.status = 200;
    });
    await bot.getLogin();
    await bot.internal.setWebhookEndpoint({
      endpoint: bot.ctx.server.config.selfUrl + "/line"
    });
    bot.logger.debug("listening updates %c", "line:" + bot.selfId);
    bot.online();
  }
};

// src/types/index.ts
var types_exports = {};
__export(types_exports, {
  Internal: () => Internal
});

// src/types/internal.ts
var import_core3 = require("@satorijs/core");
var Internal = class _Internal {
  constructor(http) {
    this.http = http;
  }
  static {
    __name(this, "Internal");
  }
  static define(routes) {
    for (const path in routes) {
      for (const key in routes[path]) {
        const method = key;
        for (const name of (0, import_core3.makeArray)(routes[path][method])) {
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
            try {
              return (await this.http(method, url, config)).data;
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
Internal.define({
  "/v2/bot/channel/webhook/endpoint": {
    GET: "getWebhookEndpoint",
    PUT: "setWebhookEndpoint"
  },
  "/v2/bot/channel/webhook/test": {
    POST: "testWebhookEndpoint"
  },
  "/v2/bot/message/{messageId}/content": {
    GET: "getMessageContent"
  },
  "/v2/bot/message/{messageId}/content/preview": {
    GET: "getMessageContentPreview"
  },
  "/v2/bot/message/{messageId}/content/transcoding": {
    GET: "getMessageContentTranscodingByMessageId"
  },
  "/v2/bot/message/reply": {
    POST: "replyMessage"
  },
  "/v2/bot/message/push": {
    POST: "pushMessage"
  },
  "/v2/bot/message/multicast": {
    POST: "multicast"
  },
  "/v2/bot/message/narrowcast": {
    POST: "narrowcast"
  },
  "/v2/bot/message/progress/narrowcast": {
    GET: "getNarrowcastProgress"
  },
  "/v2/bot/message/broadcast": {
    POST: "broadcast"
  },
  "/v2/bot/message/quota": {
    GET: "getMessageQuota"
  },
  "/v2/bot/message/quota/consumption": {
    GET: "getMessageQuotaConsumption"
  },
  "/v2/bot/message/delivery/reply": {
    GET: "getNumberOfSentReplyMessages"
  },
  "/v2/bot/message/delivery/push": {
    GET: "getNumberOfSentPushMessages"
  },
  "/v2/bot/message/delivery/multicast": {
    GET: "getNumberOfSentMulticastMessages"
  },
  "/v2/bot/message/delivery/broadcast": {
    GET: "getNumberOfSentBroadcastMessages"
  },
  "/v2/bot/message/validate/reply": {
    POST: "validateReply"
  },
  "/v2/bot/message/validate/push": {
    POST: "validatePush"
  },
  "/v2/bot/message/validate/multicast": {
    POST: "validateMulticast"
  },
  "/v2/bot/message/validate/narrowcast": {
    POST: "validateNarrowcast"
  },
  "/v2/bot/message/validate/broadcast": {
    POST: "validateBroadcast"
  },
  "/v2/bot/message/aggregation/info": {
    GET: "getAggregationUnitUsage"
  },
  "/v2/bot/message/aggregation/list": {
    GET: "getAggregationUnitNameList"
  },
  "/v2/bot/profile/{userId}": {
    GET: "getProfile"
  },
  "/v2/bot/followers/ids": {
    GET: "getFollowers"
  },
  "/v2/bot/info": {
    GET: "getBotInfo"
  },
  "/v2/bot/group/{groupId}/member/{userId}": {
    GET: "getGroupMemberProfile"
  },
  "/v2/bot/room/{roomId}/member/{userId}": {
    GET: "getRoomMemberProfile"
  },
  "/v2/bot/group/{groupId}/members/ids": {
    GET: "getGroupMembersIds"
  },
  "/v2/bot/room/{roomId}/members/ids": {
    GET: "getRoomMembersIds"
  },
  "/v2/bot/group/{groupId}/leave": {
    POST: "leaveGroup"
  },
  "/v2/bot/room/{roomId}/leave": {
    POST: "leaveRoom"
  },
  "/v2/bot/group/{groupId}/summary": {
    GET: "getGroupSummary"
  },
  "/v2/bot/group/{groupId}/members/count": {
    GET: "getGroupMemberCount"
  },
  "/v2/bot/room/{roomId}/members/count": {
    GET: "getRoomMemberCount"
  },
  "/v2/bot/richmenu": {
    POST: "createRichMenu"
  },
  "/v2/bot/richmenu/validate": {
    POST: "validateRichMenuObject"
  },
  "/v2/bot/richmenu/{richMenuId}/content": {
    GET: "getRichMenuImage",
    POST: "setRichMenuImage"
  },
  "/v2/bot/richmenu/{richMenuId}": {
    GET: "getRichMenu",
    DELETE: "deleteRichMenu"
  },
  "/v2/bot/richmenu/list": {
    GET: "getRichMenuList"
  },
  "/v2/bot/user/all/richmenu/{richMenuId}": {
    POST: "setDefaultRichMenu"
  },
  "/v2/bot/user/all/richmenu": {
    GET: "getDefaultRichMenuId",
    DELETE: "cancelDefaultRichMenu"
  },
  "/v2/bot/richmenu/alias": {
    POST: "createRichMenuAlias"
  },
  "/v2/bot/richmenu/alias/{richMenuAliasId}": {
    GET: "getRichMenuAlias",
    POST: "updateRichMenuAlias",
    DELETE: "deleteRichMenuAlias"
  },
  "/v2/bot/richmenu/alias/list": {
    GET: "getRichMenuAliasList"
  },
  "/v2/bot/user/{userId}/richmenu": {
    GET: "getRichMenuIdOfUser",
    DELETE: "unlinkRichMenuIdFromUser"
  },
  "/v2/bot/user/{userId}/richmenu/{richMenuId}": {
    POST: "linkRichMenuIdToUser"
  },
  "/v2/bot/richmenu/bulk/link": {
    POST: "linkRichMenuIdToUsers"
  },
  "/v2/bot/richmenu/bulk/unlink": {
    POST: "unlinkRichMenuIdFromUsers"
  },
  "/v2/bot/richmenu/batch": {
    POST: "richMenuBatch"
  },
  "/v2/bot/richmenu/validate/batch": {
    POST: "validateRichMenuBatchRequest"
  },
  "/v2/bot/richmenu/progress/batch": {
    GET: "getRichMenuBatchProgress"
  },
  "/v2/bot/user/{userId}/linkToken": {
    POST: "issueLinkToken"
  },
  "/v2/bot/message/markAsRead": {
    POST: "markMessagesAsRead"
  },
  "/bot/pnp/push": {
    POST: "pushMessagesByPhone"
  },
  "/bot/ad/multicast/phone": {
    POST: "audienceMatch"
  },
  "/v2/bot/message/delivery/pnp": {
    GET: "getPNPMessageStatistics"
  },
  "/v2/bot/message/delivery/ad_phone": {
    GET: "getAdPhoneMessageStatistics"
  }
});

// src/message.ts
var import_core4 = require("@satorijs/core");
var escape = /* @__PURE__ */ __name((val) => val.replace(/(?<!\u200b)[\*_~`]/g, "​$&"), "escape");
var unescape = /* @__PURE__ */ __name((val) => val.replace(/\u200b([\*_~`])/g, "$1"), "unescape");
var LineMessageEncoder = class extends import_core4.MessageEncoder {
  static {
    __name(this, "LineMessageEncoder");
  }
  buffer = "";
  blocks = [];
  sender = {};
  emojis = [];
  buttons = [];
  async flush() {
    await this.insertBlock();
    for (let i = 0; i < this.buttons.length; i += 4) {
      this.blocks.push({
        type: "template",
        altText: "Buttons",
        template: {
          type: "buttons",
          text: "Please select",
          actions: this.buttons.slice(i, i + 4)
        }
      });
    }
    for (let i = 0; i < this.blocks.length; i += 5) {
      const { sentMessages } = await this.bot.internal.pushMessage({
        to: this.channelId,
        messages: this.blocks.slice(i, i + 5)
      });
      for (const sent of sentMessages) {
        const session = this.bot.session(this.session.event);
        session.messageId = sent.id;
        this.results.push(session.event.message);
        session.app.emit(session, "send", session);
      }
    }
  }
  async insertBlock() {
    if (this.buffer.length) {
      this.blocks.push({
        ...{
          type: "text",
          text: escape(this.buffer),
          sender: { ...this.sender }
        },
        ...this.emojis.length ? { emojis: this.emojis } : {}
      });
      this.buffer = "";
      this.emojis = [];
    }
  }
  decodeButton(attrs, label) {
    if (attrs.type === "input") {
      return {
        type: "message",
        text: attrs.text,
        label
      };
    } else if (attrs.type === "link") {
      return {
        type: "uri",
        label,
        uri: attrs.href
      };
    } else {
      return {
        type: "postback",
        label,
        data: attrs.id
      };
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
    } else if ((type === "img" || type === "image") && (attrs.src || attrs.url)) {
      await this.insertBlock();
      this.blocks.push({
        type: "image",
        originalContentUrl: attrs.src || attrs.url,
        previewImageUrl: attrs.poster
      });
    } else if (type === "video" && (attrs.src || attrs.url)) {
      await this.insertBlock();
      this.blocks.push({
        type: "video",
        originalContentUrl: attrs.src || attrs.url,
        previewImageUrl: attrs.poster
      });
    } else if (type === "audio" && (attrs.src || attrs.url)) {
      await this.insertBlock();
      this.blocks.push({
        type: "audio",
        originalContentUrl: attrs.src || attrs.url,
        duration: attrs.duration
      });
    } else if (type === "face") {
      if (attrs.id.startsWith("s")) {
        await this.insertBlock();
        this.blocks.push({
          type: "sticker",
          packageId: attrs.id.split(":")[1],
          stickerId: attrs.id.split(":")[2]
        });
      } else {
        this.emojis.push({
          index: this.buffer.length,
          productId: attrs.id.split(":")[1],
          emojiId: attrs.id.split(":")[2]
        });
        this.buffer += "$";
      }
    } else if (type === "author") {
      this.sender.name = attrs.nickname;
      this.sender.iconUrl = attrs.avatar;
    } else if (type === "button-group") {
      await this.render(children);
    } else if (type === "button") {
      this.buttons.push(this.decodeButton(attrs, children.join("")));
    } else if (type === "message") {
      const sender = { ...this.sender };
      await this.insertBlock();
      await this.render(children);
      await this.insertBlock();
      if (this.sender.iconUrl || this.sender.name) {
        this.sender = { ...sender };
      }
    }
  }
};

// src/bot.ts
var LineBot = class extends import_core5.Bot {
  static {
    __name(this, "LineBot");
  }
  static inject = ["server", "http"];
  static MessageEncoder = LineMessageEncoder;
  http;
  contentHttp;
  internal;
  constructor(ctx, config) {
    super(ctx, config, "line");
    if (!ctx.server.config.selfUrl) {
      this.logger.warn("selfUrl is not set, some features may not work");
    }
    this.http = ctx.http.extend({
      ...config.api,
      headers: {
        Authorization: `Bearer ${config.token}`
      }
    });
    this.contentHttp = ctx.http.extend({
      ...config.content,
      headers: {
        Authorization: `Bearer ${config.token}`
      }
    });
    this.internal = new Internal(this.http);
    ctx.plugin(HttpServer, this);
  }
  // https://developers.line.biz/en/reference/messaging-api/#get-profile
  async getLogin() {
    const { userId, displayName, pictureUrl } = await this.internal.getBotInfo();
    this.user.id = userId;
    this.user.name = displayName;
    this.user.avatar = pictureUrl;
    return this.toJSON();
  }
  async getFriendList(start) {
    const { userIds, next } = await this.internal.getFollowers({
      start,
      limit: 1e3
    });
    return { data: userIds.map((v) => ({ id: v, userId: v })), next };
  }
  async getGuild(guildId) {
    const res = await this.internal.getGroupSummary(guildId);
    return {
      id: res.groupId,
      name: res.groupName
    };
  }
  async getGuildMemberList(guildId, start) {
    const { memberIds, next } = await this.internal.getGroupMembersIds(guildId, { start });
    return { data: memberIds.map((id) => ({ user: { id }, userId: id })), next };
  }
  async getGuildMember(guildId, userId) {
    const res = await this.internal.getGroupMemberProfile(guildId, userId);
    return {
      user: {
        id: res.userId,
        name: res.displayName,
        avatar: res.pictureUrl
      },
      userId: res.userId,
      nickname: res.displayName,
      avatar: res.pictureUrl
    };
  }
};
((LineBot2) => {
  LineBot2.Config = import_core5.Schema.intersect([
    import_core5.Schema.object({
      token: import_core5.Schema.string().required().description("机器人令牌。"),
      secret: import_core5.Schema.string().required().description("机器人密钥。")
    }),
    import_core5.Schema.object({
      api: import_core5.HTTP.createConfig("https://api.line.me/")
    }),
    import_core5.Schema.object({
      content: import_core5.HTTP.createConfig("https://api-data.line.me/")
    })
  ]);
})(LineBot || (LineBot = {}));

// src/index.ts
var src_default = LineBot;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  HttpServer,
  Line,
  LineBot,
  LineMessageEncoder,
  adaptMessage,
  adaptSessions,
  escape,
  unescape
});
