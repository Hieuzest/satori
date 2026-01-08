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
  HttpPolling: () => HttpPolling,
  Internal: () => Internal,
  ZulipBot: () => ZulipBot,
  adaptSession: () => adaptSession,
  by_stream_topic_url: () => by_stream_topic_url,
  decodeGuild: () => decodeGuild,
  decodeMessage: () => decodeMessage,
  decodeUser: () => decodeUser,
  default: () => src_default,
  encodeHashComponent: () => encodeHashComponent,
  setupMessage: () => setupMessage
});
module.exports = __toCommonJS(src_exports);

// src/bot.ts
var import_core5 = require("@satorijs/core");

// src/polling.ts
var import_core2 = require("@satorijs/core");

// src/utils.ts
var import_core = require("@satorijs/core");
var marked = __toESM(require("marked"), 1);
var hashReplacements = /* @__PURE__ */ new Map([
  ["%", "."],
  ["(", ".28"],
  [")", ".29"],
  [".", ".2E"]
]);
function encodeHashComponent(str) {
  return encodeURIComponent(str).replace(/[%().]/g, (matched) => hashReplacements.get(matched));
}
__name(encodeHashComponent, "encodeHashComponent");
function by_stream_topic_url(stream_id, topic) {
  return `#narrow/stream/${encodeHashComponent(`${stream_id}-unknown`)}/topic/${encodeHashComponent(topic)}`;
}
__name(by_stream_topic_url, "by_stream_topic_url");
var atBlock = {
  name: "koishi.at",
  level: "inline",
  start(src) {
    return src.match(/@_?\*\*/)?.index;
  },
  tokenizer(src) {
    const rule = /^@_?\*\*(.*\|\d+)\*\*/;
    const match = rule.exec(src);
    if (match) {
      return {
        type: "koishi.at",
        raw: match[0],
        param: match[1]
      };
    }
  }
};
var atRoleBlock = {
  name: "koishi.at.role",
  level: "inline",
  start(src) {
    return src.match(/@\*/)?.index;
  },
  tokenizer(src) {
    const rule = /^@\*(?!\*)(.*)\*/;
    const match = rule.exec(src);
    if (match) {
      return {
        type: "koishi.at.role",
        raw: match[0],
        param: match[1]
      };
    }
  }
};
var sharp = {
  name: "koishi.sharp",
  level: "inline",
  start(src) {
    return src.match(/#\*\*/)?.index;
  },
  tokenizer(src) {
    const rule = /^#\*\*(.+>(?:(?!\*\*).)+)\*\*/;
    const match = rule.exec(src);
    if (match) {
      return {
        type: "koishi.sharp",
        raw: match[0],
        param: match[1]
      };
    }
  }
};
marked.use({ extensions: [sharp, atBlock, atRoleBlock] });
function renderToken(token) {
  if (token.type === "code") {
    return (0, import_core.h)("code", { content: token.text });
  } else if (token.type === "paragraph") {
    return (0, import_core.h)("p", render(token.tokens));
  } else if (token.type === "image") {
    return import_core.h.image(token.href);
  } else if (token.type === "blockquote") {
    return (0, import_core.h)("p", render(token.tokens));
  } else if (token.type === "text") {
    return (0, import_core.h)("text", { content: token.text });
  } else if (token.type === "em") {
    return (0, import_core.h)("em", render(token.tokens));
  } else if (token.type === "strong") {
    return (0, import_core.h)("strong", render(token.tokens));
  } else if (token.type === "del") {
    return (0, import_core.h)("del", render(token.tokens));
  } else if (token.type === "link") {
    return (0, import_core.h)("a", { href: token.href }, render(token.tokens));
  } else if (token.type === "koishi.at") {
    return (0, import_core.h)("at", { raw: token.param });
  } else if (token.type === "koishi.at.role") {
    return (0, import_core.h)("at", { role: token.param });
  } else if (token.type === "koishi.sharp") {
    return (0, import_core.h)("sharp", { raw: token.param });
  }
  return (0, import_core.h)("text", { content: token.raw });
}
__name(renderToken, "renderToken");
function render(tokens) {
  return tokens.map(renderToken).filter(Boolean);
}
__name(render, "render");
function setupReaction(session, data) {
  session.type = data.op === "add" ? "reaction-added" : "reaction-removed";
  session.userId = data.user_id.toString();
  session.messageId = data.message_id.toString();
  session.timestamp = Date.now();
  session.content = data.emoji_name;
}
__name(setupReaction, "setupReaction");
async function adaptSession(bot, input) {
  const session = bot.session({});
  if (input.type === "message") {
    await decodeMessage(bot, input.message, session.event.message = {}, session.event);
  } else if (input.type === "reaction") {
    session.type = input.op === "add" ? "reaction-added" : "reaction-removed";
    const { message } = await bot.internal.getMessage(input.message_id.toString());
    setupMessage(session.event, message);
    session.messageId = input.message_id.toString();
    setupReaction(session, input);
  } else if (input.type === "delete_message" && input.message_type === "stream") {
    session.type = "channel-deleted";
    session.channelId = input.topic;
    session.messageId = input.message_id.toString();
    session.guildId = input.stream_id.toString();
  } else if (input.type === "subscription" && input.op === "peer_add") {
    session.type = "guild-added";
    session.guildId = input.stream_ids[0].toString();
  } else if (input.type === "subscription" && input.op === "add") {
    session.type = "guild-added";
    session.guildId = input.subscriptions[0].stream_id.toString();
  } else if (input.type === "subscription" && input.op === "remove") {
    session.type = "guild-removed";
    session.guildId = input.subscriptions[0].stream_id.toString();
  } else if (input.type === "stream" && input.op === "delete") {
    session.type = "guild-deleted";
    session.guildId = input.streams[0].stream_id.toString();
  } else if (input.type === "realm_user" && input.op === "delete") {
    session.type = "guild-member-deleted";
    session.userId = input.person.user_id.toString();
  } else if (input.type === "realm_user" && input.op === "add") {
    session.type = "guild-member-added";
    session.userId = input.person.user_id.toString();
  } else {
    return;
  }
  return session;
}
__name(adaptSession, "adaptSession");
function setupMessage(payload, data) {
  if (data.type === "private") {
    payload.channel = {
      id: data.sender_id.toString(),
      type: import_core.Universal.Channel.Type.DIRECT
    };
  } else {
    payload.channel = {
      id: data.subject,
      type: import_core.Universal.Channel.Type.TEXT
    };
    payload.guild = { id: data.stream_id.toString() };
  }
  payload.user = {
    id: data.sender_id.toString(),
    name: data.sender_full_name
  };
}
__name(setupMessage, "setupMessage");
async function decodeMessage(bot, data, message = {}, payload = message) {
  const quoteMatch = data.content.match(/^@_\*\*\w+\|(\d+)\*\* \[.*\]\(.*\/near\/(\d+)\)/);
  if (quoteMatch) {
    const splited = data.content.split("\n");
    const quoteLength = splited[1].indexOf("quote");
    const quotes = splited[1].slice(0, quoteLength);
    const quoteEndIndex = splited.indexOf(quotes, 2);
    const trueContent = splited.slice(quoteEndIndex + 1).join("\n").trim();
    const quoteMsg = await bot.internal.getMessage(quoteMatch[2]);
    quoteMsg.message.content = quoteMsg.raw_content;
    message.quote = await decodeMessage(bot, quoteMsg.message);
    data.content = trueContent;
  }
  const content = data.content;
  message.elements = render(marked.lexer(content, {}));
  if (message.elements?.[0]?.type === "p") {
    message.elements = message.elements[0].children;
  }
  message.elements = await import_core.h.transformAsync(message.elements, {
    async at(attrs) {
      if (attrs.role) return (0, import_core.h)("at", attrs);
      const raw = attrs.raw;
      if (raw === "all" || raw === "everyone" || raw === "stream") return (0, import_core.h)("at", { type: "all" });
      if (raw.includes("|")) return import_core.h.at(raw.split("|")[1]);
      const { members } = await bot.internal.getUsers();
      const user = members.find((v) => v.full_name === raw);
      if (user) return import_core.h.at(user.user_id.toString(), { name: user.full_name });
    },
    async sharp(attrs) {
      const raw = attrs.raw;
      if (raw.includes(">")) {
        const guildName = raw.slice(0, raw.indexOf(">"));
        const { stream_id } = await bot.internal.getStreamId({
          stream: guildName
        });
        const channel = raw.slice(raw.indexOf(">") + 1);
        return (0, import_core.h)("sharp", { id: channel, guild: stream_id.toString() });
      }
      return (0, import_core.h)("sharp", { guild: raw });
    }
  });
  message.content = message.elements.join("");
  message.id = data.id.toString();
  message.timestamp = data.timestamp * 1e3;
  setupMessage(payload, data);
  return message;
}
__name(decodeMessage, "decodeMessage");
var decodeGuild = /* @__PURE__ */ __name((stream) => ({
  id: stream.stream_id.toString(),
  name: stream.name
}), "decodeGuild");
var decodeUser = /* @__PURE__ */ __name((user) => ({
  id: user.user_id.toString(),
  name: user.full_name,
  avatar: user.avatar_url
}), "decodeUser");

// src/polling.ts
var HttpPolling = class extends import_core2.Adapter {
  static {
    __name(this, "HttpPolling");
  }
  static reusable = true;
  timeout;
  async connect(bot) {
    await bot.getLogin();
    const r = await bot.internal.registerQueue({
      // event_types: `["message"]`,
    });
    let last = -1;
    let _retryCount = 0;
    bot.online();
    const { retryTimes, retryInterval } = bot.config;
    const polling = /* @__PURE__ */ __name(async () => {
      try {
        const updates = await bot.internal.getEvents({
          queue_id: r.queue_id,
          last_event_id: last
        });
        if (!bot.isActive) {
          return bot.offline();
        }
        bot.online();
        _retryCount = 0;
        for (const e of updates.events) {
          bot.logger.debug("[receive] %o", e);
          last = Math.max(last, e.id);
          const session = await adaptSession(bot, e);
          if (session) bot.dispatch(session);
          bot.logger.debug("[session] %o", session);
        }
        setTimeout(polling, 0);
      } catch (e) {
        if (!this.ctx.http.isError(e) || !e.response?.data) {
          bot.logger.warn("failed to get updates. reason: %s", e.stack);
        } else {
          bot.logger.error(e.stack);
        }
        if (_retryCount > retryTimes) {
          bot.error = e;
          return bot.status = import_core2.Universal.Status.OFFLINE;
        }
        _retryCount++;
        bot.status = import_core2.Universal.Status.RECONNECT;
        this.timeout = setTimeout(() => polling(), retryInterval);
      }
    }, "polling");
    polling();
    bot.logger.debug("listening updates %c", bot.sid);
  }
  async disconnect(bot) {
    clearTimeout(this.timeout);
  }
};
((HttpPolling2) => {
  HttpPolling2.Options = import_core2.Schema.object({
    protocol: import_core2.Schema.const("polling").required(process.env.KOISHI_ENV !== "browser"),
    // pollingTimeout: Schema.natural().role('ms').default(Time.second * 25).description('通过长轮询获取更新时请求的超时 (单位为毫秒)。'),
    retryTimes: import_core2.Schema.natural().description("连接时的最大重试次数。").default(6),
    retryInterval: import_core2.Schema.natural().role("ms").default(import_core2.Time.second * 5).description("长轮询断开后的重试时间间隔 (单位为毫秒)。")
  });
})(HttpPolling || (HttpPolling = {}));

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
            const url = path.replace(/^\//, "").replace(/\{([^}]+)\}/g, () => {
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

// src/types/api.ts
Internal.define({
  "/fetch_api_key": {
    POST: "fetchApiKey"
  },
  "/dev_fetch_api_key": {
    POST: "devFetchApiKey"
  },
  "/events": {
    GET: "getEvents",
    DELETE: "deleteQueue"
  },
  "/get_stream_id": {
    GET: "getStreamId"
  },
  "/mark_all_as_read": {
    POST: "markAllAsRead"
  },
  "/mark_stream_as_read": {
    POST: "markStreamAsRead"
  },
  "/mark_topic_as_read": {
    POST: "markTopicAsRead"
  },
  "/attachments": {
    GET: "getAttachments"
  },
  "/attachments/{attachment_id}": {
    DELETE: "removeAttachment"
  },
  "/drafts": {
    GET: "getDrafts",
    POST: "createDrafts"
  },
  "/drafts/{draft_id}": {
    PATCH: "editDraft",
    DELETE: "deleteDraft"
  },
  "/scheduled_messages": {
    GET: "getScheduledMessages",
    POST: "createScheduledMessage"
  },
  "/scheduled_messages/{scheduled_message_id}": {
    PATCH: "updateScheduledMessage",
    DELETE: "deleteScheduledMessage"
  },
  "/default_streams": {
    POST: "addDefaultStream",
    DELETE: "removeDefaultStream"
  },
  "/messages": {
    GET: "getMessages",
    POST: "sendMessage"
  },
  "/messages/{message_id}/history": {
    GET: "getMessageHistory"
  },
  "/messages/flags": {
    POST: "updateMessageFlags"
  },
  "/messages/flags/narrow": {
    POST: "updateMessageFlagsForNarrow"
  },
  "/messages/render": {
    POST: "renderMessage"
  },
  "/messages/{message_id}/reactions": {
    POST: "addReaction",
    DELETE: "removeReaction"
  },
  "/messages/{message_id}/read_receipts": {
    GET: "getReadReceipts"
  },
  "/messages/matches_narrow": {
    GET: "checkMessagesMatchNarrow"
  },
  "/messages/{message_id}": {
    GET: "getMessage",
    PATCH: "updateMessage",
    DELETE: "deleteMessage"
  },
  "/user_uploads": {
    POST: "uploadFile"
  },
  "/user_uploads/{realm_id_str}/{filename}": {
    GET: "getFileTemporaryUrl"
  },
  "/users": {
    GET: "getUsers",
    POST: "createUser"
  },
  "/users/{user_id}/reactivate": {
    POST: "reactivateUser"
  },
  "/users/{user_id_or_email}/presence": {
    GET: "getUserPresence"
  },
  "/users/me": {
    GET: "getOwnUser",
    DELETE: "deactivateOwnUser"
  },
  "/users/me/alert_words": {
    GET: "getAlertWords",
    POST: "addAlertWords",
    DELETE: "removeAlertWords"
  },
  "/users/me/status": {
    POST: "updateStatus"
  },
  "/users/me/{stream_id}/topics": {
    GET: "getStreamTopics"
  },
  "/users/me/subscriptions": {
    GET: "getSubscriptions",
    POST: "subscribe",
    PATCH: "updateSubscriptions",
    DELETE: "unsubscribe"
  },
  "/users/me/subscriptions/muted_topics": {
    PATCH: "muteTopic"
  },
  "/user_topics": {
    POST: "updateUserTopic"
  },
  "/users/me/muted_users/{muted_user_id}": {
    POST: "muteUser",
    DELETE: "unmuteUser"
  },
  "/users/{user_id}/subscriptions/{stream_id}": {
    GET: "getSubscriptionStatus"
  },
  "/realm/emoji/{emoji_name}": {
    POST: "uploadCustomEmoji",
    DELETE: "deactivateCustomEmoji"
  },
  "/realm/emoji": {
    GET: "getCustomEmoji"
  },
  "/realm/presence": {
    GET: "getPresence"
  },
  "/realm/profile_fields": {
    GET: "getCustomProfileFields",
    PATCH: "reorderCustomProfileFields",
    POST: "createCustomProfileField"
  },
  "/realm/user_settings_defaults": {
    PATCH: "updateRealmUserSettingsDefaults"
  },
  "/users/me/subscriptions/properties": {
    POST: "updateSubscriptionSettings"
  },
  "/users/{email}": {
    GET: "getUserByEmail"
  },
  "/users/{user_id}": {
    GET: "getUser",
    PATCH: "updateUser",
    DELETE: "deactivateUser"
  },
  "/realm/linkifiers": {
    GET: "getLinkifiers",
    PATCH: "reorderLinkifiers"
  },
  "/realm/filters": {
    POST: "addLinkifier"
  },
  "/realm/filters/{filter_id}": {
    DELETE: "removeLinkifier",
    PATCH: "updateLinkifier"
  },
  "/realm/playgrounds": {
    POST: "addCodePlayground"
  },
  "/realm/playgrounds/{playground_id}": {
    DELETE: "removeCodePlayground"
  },
  "/register": {
    POST: "registerQueue"
  },
  "/server_settings": {
    GET: "getServerSettings"
  },
  "/settings": {
    PATCH: "updateSettings"
  },
  "/streams/{stream_id}/members": {
    GET: "getSubscribers"
  },
  "/streams": {
    GET: "getStreams"
  },
  "/streams/{stream_id}": {
    GET: "getStreamById",
    DELETE: "archiveStream",
    PATCH: "updateStream"
  },
  "/streams/{stream_id}/delete_topic": {
    POST: "deleteTopic"
  },
  "/typing": {
    POST: "setTypingStatus"
  },
  "/user_groups/create": {
    POST: "createUserGroup"
  },
  "/user_groups/{user_group_id}/members": {
    POST: "updateUserGroupMembers",
    GET: "getUserGroupMembers"
  },
  "/user_groups/{user_group_id}": {
    PATCH: "updateUserGroup",
    DELETE: "removeUserGroup"
  },
  "/user_groups": {
    GET: "getUserGroups"
  },
  "/user_groups/{user_group_id}/subgroups": {
    POST: "updateUserGroupSubgroups",
    GET: "getUserGroupSubgroups"
  },
  "/user_groups/{user_group_id}/members/{user_id}": {
    GET: "getIsUserGroupMember"
  },
  "/real-time": {},
  "/rest-error-handling": {},
  "/zulip-outgoing-webhook": {
    POST: "zulipOutgoingWebhooks"
  },
  "/calls/bigbluebutton/create": {
    GET: "createBigBlueButtonVideoCall"
  }
});

// src/message.ts
var import_core4 = require("@satorijs/core");
var escape = /* @__PURE__ */ __name((val) => val.replace(/(?<!\u200b)[\*_~`\->[\](#!@]/g, "​$&").replace(/^\s+/gm, (match) => Array(match.length + 1).join("&nbsp;")), "escape");
var ZulipMessageEncoder = class extends import_core4.MessageEncoder {
  static {
    __name(this, "ZulipMessageEncoder");
  }
  buffer = "";
  async flush() {
    if (!this.buffer.length) return;
    const form = new FormData();
    form.append("type", this.session.isDirect ? "private" : "stream");
    form.append("to", this.session.isDirect ? `[${this.options.session.userId}]` : this.session.guildId);
    form.append("content", this.buffer);
    if (!this.session.isDirect) form.append("topic", this.session.channelId);
    const { id } = await this.bot.http.post("messages", form);
    const session = this.bot.session();
    session.content = this.buffer;
    session.messageId = id.toString();
    session.userId = this.bot.selfId;
    session.channelId = this.session.channelId;
    session.guildId = this.session.guildId;
    session.isDirect = this.session.isDirect;
    session.app.emit(session, "send", session);
    this.results.push(session.event.message);
  }
  async uploadMedia(element) {
    const { attrs } = element;
    const { filename, data, type } = await this.bot.ctx.http.file(attrs.src || attrs.url, attrs);
    const form = new FormData();
    const value = new Blob([data], { type });
    form.append("file", value, attrs.file || filename);
    const response = await this.bot.http.post("/user_uploads", form);
    return [response.uri, filename];
  }
  async getUser(id) {
    const { user } = await this.bot.internal.getUser(id);
    return user?.full_name;
  }
  async visit(element) {
    const { type, attrs, children } = element;
    if (type === "text") {
      this.buffer += escape(attrs.content);
    } else if (type === "p") {
      if (!this.buffer.endsWith("\n")) this.buffer += "\n";
      await this.render(children);
      if (!this.buffer.endsWith("\n")) this.buffer += "\n";
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
    } else if (["audio", "video", "file", "image", "img"].includes(type)) {
      const [uri, filename] = await this.uploadMedia(element);
      this.buffer += `[${filename}](${encodeURI(uri)})
`;
    } else if (type === "quote") {
      const quoteMsg = await this.bot.internal.getMessage(attrs.id);
      const suffix = "/near/" + encodeHashComponent(attrs.id);
      const path = by_stream_topic_url(+this.session.guildId, this.channelId) + suffix;
      this.buffer = `@_**${quoteMsg.message.sender_full_name}|${quoteMsg.message.sender_id}** [Said](${path}):
\`\`\`quote
` + quoteMsg.raw_content + "\n```\n\n" + this.buffer;
    } else if (type === "sharp" && attrs.guild) {
      const { stream } = await this.bot.internal.getStreamById(attrs.guild);
      if (!attrs.id) {
        this.buffer += ` #**${stream.name}** `;
      } else {
        this.buffer += ` #**${stream.name}>${attrs.id}** `;
      }
    } else if (type === "at" && attrs.id) {
      try {
        const u = await this.getUser(attrs.id);
        if (u) this.buffer += ` @**${u}|${attrs.id}** `;
      } catch (e) {
        this.bot.logger.error(e);
        this.buffer += ` @**${attrs.id}** `;
      }
    } else if (type === "at" && ["all", "here"].includes(attrs.type)) {
      this.buffer += ` @**all** `;
    } else if (type === "message") {
      await this.render(children);
    }
  }
};

// src/bot.ts
var import_package = require("../package.json");
var ZulipBot = class extends import_core5.Bot {
  static {
    __name(this, "ZulipBot");
  }
  static MessageEncoder = ZulipMessageEncoder;
  static inject = ["http"];
  http;
  internal;
  constructor(ctx, config) {
    super(ctx, config, "zulip");
    this.http = ctx.http.extend({
      headers: {
        Authorization: `Basic ${Buffer.from(`${config.email}:${config.key}`).toString("base64")}`,
        "user-agent": `Koishi/${import_package.version}`
      }
    }).extend({
      ...config,
      baseURL: config.endpoint + "/api/v1/"
    });
    this.internal = new Internal(this.http);
    ctx.plugin(HttpPolling, this);
  }
  async getGuildList() {
    const { streams } = await this.internal.getStreams();
    return { data: streams.map(decodeGuild) };
  }
  async getGuild(guildId) {
    const { stream } = await this.internal.getStreamById(guildId);
    return decodeGuild(stream);
  }
  async getChannelList(guildId) {
    const { topics } = await this.internal.getStreamTopics(guildId);
    return { data: topics.map(({ name }) => ({ id: name, type: import_core5.Universal.Channel.Type.TEXT })) };
  }
  async getGuildMember(guildId, userId) {
    const { user } = await this.internal.getUser(userId);
    return decodeUser(user);
  }
  getUser(userId, guildId) {
    return this.getGuildMember(guildId, userId);
  }
  async getGuildMemberList(guildId) {
    const { members } = await this.internal.getUsers();
    return { data: members.map((m) => ({ user: decodeUser(m) })) };
  }
  async getMessage(channelId, messageId) {
    const { message } = await this.internal.getMessage(messageId);
    return await decodeMessage(this, message);
  }
  async getLogin() {
    const self = await this.internal.getOwnUser();
    this.user = decodeUser(self);
    return this.toJSON();
  }
  async getMessageList(channelId, before) {
    const { messages } = await this.internal.getMessages({
      num_before: 50,
      num_after: 0,
      narrow: JSON.stringify([
        { operator: "topic", operand: channelId }
      ]),
      anchor: before ?? "newest",
      apply_markdown: false
    });
    const data = await Promise.all(messages.map((data2) => decodeMessage(this, data2)));
    return { data, next: data[0].id };
  }
  async getReactions(channelId, messageId, emoji) {
    const { message } = await this.internal.getMessage(messageId);
    return message.reactions.map((v) => decodeUser(v.user));
  }
  async createReaction(channelId, messageId, emoji) {
    await this.internal.addReaction(messageId, {
      emoji_name: emoji
    });
  }
  async deleteReaction(channelId, messageId, emoji) {
    await this.internal.removeReaction(messageId, {
      emoji_name: emoji
    });
  }
};
((ZulipBot2) => {
  ZulipBot2.Config = import_core5.Schema.intersect([
    import_core5.Schema.object({
      email: import_core5.Schema.string().required().description("Bot Email"),
      key: import_core5.Schema.string().required().role("secret").description("API Key")
    }),
    import_core5.Schema.union([
      HttpPolling.Options
    ]).description("推送设置"),
    import_core5.HTTP.createConfig()
  ]);
})(ZulipBot || (ZulipBot = {}));

// src/index.ts
var src_default = ZulipBot;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  HttpPolling,
  Internal,
  ZulipBot,
  adaptSession,
  by_stream_topic_url,
  decodeGuild,
  decodeMessage,
  decodeUser,
  encodeHashComponent,
  setupMessage
});
