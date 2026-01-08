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
  Feishu: () => types_exports,
  FeishuBot: () => LarkBot,
  Lark: () => types_exports,
  LarkBot: () => LarkBot,
  default: () => src_default
});
module.exports = __toCommonJS(src_exports);

// src/bot.ts
var import_core6 = require("@satorijs/core");

// src/http.ts
var import_core2 = require("@satorijs/core");

// src/utils.ts
var import_crypto = __toESM(require("crypto"), 1);
var import_core = require("@satorijs/core");

// ../../../../node_modules/cosmokit/lib/index.mjs
function is(type, value) {
  if (arguments.length === 1) return (value2) => is(type, value2);
  return type in globalThis && value instanceof globalThis[type] || Object.prototype.toString.call(value).slice(8, -1) === type;
}
__name(is, "is");
function isArrayBufferLike(value) {
  return is("ArrayBuffer", value) || is("SharedArrayBuffer", value);
}
__name(isArrayBufferLike, "isArrayBufferLike");
function isArrayBufferSource(value) {
  return isArrayBufferLike(value) || ArrayBuffer.isView(value);
}
__name(isArrayBufferSource, "isArrayBufferSource");
var Binary;
((Binary2) => {
  Binary2.is = isArrayBufferLike;
  Binary2.isSource = isArrayBufferSource;
  function fromSource(source) {
    if (ArrayBuffer.isView(source)) {
      return source.buffer.slice(source.byteOffset, source.byteOffset + source.byteLength);
    } else {
      return source;
    }
  }
  __name(fromSource, "fromSource");
  Binary2.fromSource = fromSource;
  function toBase64(source) {
    source = fromSource(source);
    if (typeof Buffer !== "undefined") {
      return Buffer.from(source).toString("base64");
    }
    let binary = "";
    const bytes = new Uint8Array(source);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }
  __name(toBase64, "toBase64");
  Binary2.toBase64 = toBase64;
  function fromBase64(source) {
    if (typeof Buffer !== "undefined") return fromSource(Buffer.from(source, "base64"));
    return Uint8Array.from(atob(source), (c) => c.charCodeAt(0));
  }
  __name(fromBase64, "fromBase64");
  Binary2.fromBase64 = fromBase64;
  function toHex(source) {
    source = fromSource(source);
    if (typeof Buffer !== "undefined") return Buffer.from(source).toString("hex");
    return Array.from(new Uint8Array(source), (byte) => byte.toString(16).padStart(2, "0")).join("");
  }
  __name(toHex, "toHex");
  Binary2.toHex = toHex;
  function fromHex(source) {
    if (typeof Buffer !== "undefined") return fromSource(Buffer.from(source, "hex"));
    const hex = source.length % 2 === 0 ? source : source.slice(0, source.length - 1);
    const buffer = [];
    for (let i = 0; i < hex.length; i += 2) {
      buffer.push(parseInt(`${hex[i]}${hex[i + 1]}`, 16));
    }
    return Uint8Array.from(buffer).buffer;
  }
  __name(fromHex, "fromHex");
  Binary2.fromHex = fromHex;
})(Binary || (Binary = {}));
var base64ToArrayBuffer = Binary.fromBase64;
var arrayBufferToBase64 = Binary.toBase64;
var hexToArrayBuffer = Binary.fromHex;
var arrayBufferToHex = Binary.toHex;
function tokenize(source, delimiters, delimiter) {
  const output = [];
  let state = 0;
  for (let i = 0; i < source.length; i++) {
    const code = source.charCodeAt(i);
    if (code >= 65 && code <= 90) {
      if (state === 1) {
        const next = source.charCodeAt(i + 1);
        if (next >= 97 && next <= 122) {
          output.push(delimiter);
        }
        output.push(code + 32);
      } else {
        if (state !== 0) {
          output.push(delimiter);
        }
        output.push(code + 32);
      }
      state = 1;
    } else if (code >= 97 && code <= 122) {
      output.push(code);
      state = 2;
    } else if (delimiters.includes(code)) {
      if (state !== 0) {
        output.push(delimiter);
      }
      state = 0;
    } else {
      output.push(code);
    }
  }
  return String.fromCharCode(...output);
}
__name(tokenize, "tokenize");
function paramCase(source) {
  return tokenize(source, [45, 95], 45);
}
__name(paramCase, "paramCase");
var hyphenate = paramCase;
var Time;
((Time22) => {
  Time22.millisecond = 1;
  Time22.second = 1e3;
  Time22.minute = Time22.second * 60;
  Time22.hour = Time22.minute * 60;
  Time22.day = Time22.hour * 24;
  Time22.week = Time22.day * 7;
  let timezoneOffset = (/* @__PURE__ */ new Date()).getTimezoneOffset();
  function setTimezoneOffset(offset) {
    timezoneOffset = offset;
  }
  __name(setTimezoneOffset, "setTimezoneOffset");
  Time22.setTimezoneOffset = setTimezoneOffset;
  function getTimezoneOffset() {
    return timezoneOffset;
  }
  __name(getTimezoneOffset, "getTimezoneOffset");
  Time22.getTimezoneOffset = getTimezoneOffset;
  function getDateNumber(date = /* @__PURE__ */ new Date(), offset) {
    if (typeof date === "number") date = new Date(date);
    if (offset === void 0) offset = timezoneOffset;
    return Math.floor((date.valueOf() / Time22.minute - offset) / 1440);
  }
  __name(getDateNumber, "getDateNumber");
  Time22.getDateNumber = getDateNumber;
  function fromDateNumber(value, offset) {
    const date = new Date(value * Time22.day);
    if (offset === void 0) offset = timezoneOffset;
    return new Date(+date + offset * Time22.minute);
  }
  __name(fromDateNumber, "fromDateNumber");
  Time22.fromDateNumber = fromDateNumber;
  const numeric = /\d+(?:\.\d+)?/.source;
  const timeRegExp = new RegExp(`^${[
    "w(?:eek(?:s)?)?",
    "d(?:ay(?:s)?)?",
    "h(?:our(?:s)?)?",
    "m(?:in(?:ute)?(?:s)?)?",
    "s(?:ec(?:ond)?(?:s)?)?"
  ].map((unit) => `(${numeric}${unit})?`).join("")}$`);
  function parseTime(source) {
    const capture = timeRegExp.exec(source);
    if (!capture) return 0;
    return (parseFloat(capture[1]) * Time22.week || 0) + (parseFloat(capture[2]) * Time22.day || 0) + (parseFloat(capture[3]) * Time22.hour || 0) + (parseFloat(capture[4]) * Time22.minute || 0) + (parseFloat(capture[5]) * Time22.second || 0);
  }
  __name(parseTime, "parseTime");
  Time22.parseTime = parseTime;
  function parseDate(date) {
    const parsed = parseTime(date);
    if (parsed) {
      date = Date.now() + parsed;
    } else if (/^\d{1,2}(:\d{1,2}){1,2}$/.test(date)) {
      date = `${(/* @__PURE__ */ new Date()).toLocaleDateString()}-${date}`;
    } else if (/^\d{1,2}-\d{1,2}-\d{1,2}(:\d{1,2}){1,2}$/.test(date)) {
      date = `${(/* @__PURE__ */ new Date()).getFullYear()}-${date}`;
    }
    return date ? new Date(date) : /* @__PURE__ */ new Date();
  }
  __name(parseDate, "parseDate");
  Time22.parseDate = parseDate;
  function format(ms) {
    const abs = Math.abs(ms);
    if (abs >= Time22.day - Time22.hour / 2) {
      return Math.round(ms / Time22.day) + "d";
    } else if (abs >= Time22.hour - Time22.minute / 2) {
      return Math.round(ms / Time22.hour) + "h";
    } else if (abs >= Time22.minute - Time22.second / 2) {
      return Math.round(ms / Time22.minute) + "m";
    } else if (abs >= Time22.second) {
      return Math.round(ms / Time22.second) + "s";
    }
    return ms + "ms";
  }
  __name(format, "format");
  Time22.format = format;
  function toDigits(source, length = 2) {
    return source.toString().padStart(length, "0");
  }
  __name(toDigits, "toDigits");
  Time22.toDigits = toDigits;
  function template(template2, time = /* @__PURE__ */ new Date()) {
    return template2.replace("yyyy", time.getFullYear().toString()).replace("yy", time.getFullYear().toString().slice(2)).replace("MM", toDigits(time.getMonth() + 1)).replace("dd", toDigits(time.getDate())).replace("hh", toDigits(time.getHours())).replace("mm", toDigits(time.getMinutes())).replace("ss", toDigits(time.getSeconds())).replace("SSS", toDigits(time.getMilliseconds(), 3));
  }
  __name(template, "template");
  Time22.template = template;
})(Time || (Time = {}));

// src/utils.ts
function adaptSender(sender, session) {
  let userId;
  if ("sender_id" in sender) {
    userId = sender.sender_id.open_id;
  } else {
    userId = sender.id;
  }
  session.userId = userId;
  return session;
}
__name(adaptSender, "adaptSender");
async function adaptMessage(bot, data, session, details = true) {
  const json = JSON.parse(data.message.content);
  const content = [];
  switch (data.message.message_type) {
    case "text": {
      const text = json.text;
      if (!data.message.mentions?.length) {
        content.push(text);
        break;
      }
      text.split(" ").forEach((word) => {
        if (word.startsWith("@")) {
          const mention = data.message.mentions.find((mention2) => mention2.key === word);
          if (mention) {
            content.push(import_core.h.at(mention.id.open_id, { name: mention.name }));
            return;
          }
        }
        content.push(word);
      });
      break;
    }
    case "image":
      content.push(import_core.h.image(bot.getResourceUrl("image", data.message.message_id, json.image_key)));
      break;
    case "audio":
      content.push(import_core.h.audio(bot.getResourceUrl("file", data.message.message_id, json.file_key)));
      break;
    case "media":
      content.push(import_core.h.video(bot.getResourceUrl("file", data.message.message_id, json.file_key), {
        poster: json.image_key
      }));
      break;
    case "file":
      content.push(import_core.h.file(bot.getResourceUrl("file", data.message.message_id, json.file_key)));
      break;
  }
  session.timestamp = +data.message.create_time;
  session.messageId = data.message.message_id;
  session.channelId = data.message.chat_id;
  session.guildId = data.message.chat_id;
  session.content = content.map((c) => c.toString()).join(" ");
  if (data.message.parent_id && details) {
    session.quote = await bot.getMessage(session.channelId, data.message.parent_id, false);
  }
  return session;
}
__name(adaptMessage, "adaptMessage");
async function adaptSession(bot, body) {
  const session = bot.session();
  session.setInternal("lark", body);
  session.event.referrer = {
    type: body.type,
    event: {}
  };
  switch (body.type) {
    case "im.message.receive_v1":
      session.event.referrer.event.message = (0, import_core.pick)(body.event.message, ["message_id", "thread_id"]);
      session.type = "message";
      session.subtype = body.event.message.chat_type;
      if (session.subtype === "p2p") session.subtype = "private";
      session.isDirect = session.subtype === "private";
      adaptSender(body.event.sender, session);
      await adaptMessage(bot, body.event, session);
      break;
    case "application.bot.menu_v6":
      if (body.event.event_key.startsWith("command:")) {
        session.type = "interaction/command";
        session.content = body.event.event_key.slice(8);
        session.channelId = body.event.operator.operator_id.open_id;
        session.userId = body.event.operator.operator_id.open_id;
        session.isDirect = true;
      }
      break;
    case "card.action.trigger":
      session.event.referrer.event.context = (0, import_core.pick)(body.event.context, ["open_message_id"]);
      if (body.event.action.value?._satori_type === "command") {
        session.type = "interaction/command";
        let content = body.event.action.value.content;
        const args = [], options = /* @__PURE__ */ Object.create(null);
        const setOption = /* @__PURE__ */ __name((key, value) => {
          if (key in options) {
            options[key] += "," + value;
          } else {
            options[key] = value;
          }
        }, "setOption");
        for (const [key, value] of Object.entries(body.event.action.form_value ?? {})) {
          if (key.startsWith("@@")) {
            if (value === false) continue;
            args.push(key.slice(2));
          } else if (key.startsWith("@")) {
            if (value === false) continue;
            const [_key] = key.slice(1).split("=", 1);
            setOption(_key, key.slice(2 + _key.length));
          } else if (+key * 0 === 0) {
            args[+key] = value;
          } else {
            setOption(key, value);
          }
        }
        const toArg = /* @__PURE__ */ __name((value) => {
          if (typeof value === "string") {
            return `'${value}'`;
          } else {
            return value;
          }
        }, "toArg");
        for (let i = 0; i < args.length; ++i) {
          content += ` ${toArg(args[i])}`;
        }
        for (const [key, value] of Object.entries(options)) {
          if (value === true) {
            content += ` --${hyphenate(key)} 1`;
          } else if (value === false) {
            content += ` --${hyphenate(key)} 0`;
          } else {
            content += ` --${hyphenate(key)} ${toArg(value)}`;
          }
        }
        if (body.event.action.input_value) {
          content += ` ${toArg(body.event.action.input_value)}`;
        }
        session.content = content;
        session.messageId = body.event.context.open_message_id;
        session.channelId = body.event.context.open_chat_id;
        session.guildId = body.event.context.open_chat_id;
        session.userId = body.event.operator.open_id;
        const chat = await bot.internal.im.chat.get(session.channelId);
        session.isDirect = chat.chat_mode === "p2p";
      }
      break;
  }
  return session;
}
__name(adaptSession, "adaptSession");
async function decodeMessage(bot, body, details = true) {
  const json = JSON.parse(body.body.content);
  const content = [];
  switch (body.msg_type) {
    case "text": {
      const text = json.text;
      if (!body.mentions?.length) {
        content.push(import_core.h.text(text));
        break;
      }
      text.split(" ").forEach((word) => {
        if (word.startsWith("@")) {
          const mention = body.mentions.find((mention2) => mention2.key === word);
          if (mention) {
            content.push(import_core.h.at(mention.id, { name: mention.name }));
            return;
          }
        }
        content.push(import_core.h.text(word));
      });
      break;
    }
    case "image":
      content.push(import_core.h.image(bot.getResourceUrl("image", body.message_id, json.image_key)));
      break;
    case "audio":
      content.push(import_core.h.audio(bot.getResourceUrl("file", body.message_id, json.file_key)));
      break;
    case "media":
      content.push(import_core.h.video(bot.getResourceUrl("file", body.message_id, json.file_key), {
        poster: json.image_key
      }));
      break;
    case "file":
      content.push(import_core.h.file(bot.getResourceUrl("file", body.message_id, json.file_key)));
      break;
  }
  return {
    timestamp: +body.update_time,
    createdAt: +body.create_time,
    updatedAt: +body.update_time,
    id: body.message_id,
    messageId: body.message_id,
    user: {
      id: body.sender.id
    },
    channel: {
      id: body.chat_id,
      type: import_core.Universal.Channel.Type.TEXT
    },
    content: content.map((c) => c.toString()).join(" "),
    elements: content,
    quote: body.upper_message_id && details ? await bot.getMessage(body.chat_id, body.upper_message_id, false) : void 0
  };
}
__name(decodeMessage, "decodeMessage");
function extractIdType(id) {
  if (id.startsWith("ou")) return "open_id";
  if (id.startsWith("on")) return "union_id";
  if (id.startsWith("oc")) return "chat_id";
  if (id.includes("@")) return "email";
  return "user_id";
}
__name(extractIdType, "extractIdType");
function decodeChannel(channelId, guild) {
  return {
    id: channelId,
    type: import_core.Universal.Channel.Type.TEXT,
    name: guild.name,
    parentId: channelId
  };
}
__name(decodeChannel, "decodeChannel");
function decodeGuild(guild) {
  return {
    id: guild.chat_id,
    name: guild.name,
    avatar: guild.avatar
  };
}
__name(decodeGuild, "decodeGuild");
function decodeUser(user) {
  return {
    id: user.open_id,
    avatar: user.avatar?.avatar_origin,
    isBot: false,
    name: user.name
  };
}
__name(decodeUser, "decodeUser");
var Cipher = class {
  static {
    __name(this, "Cipher");
  }
  encryptKey;
  key;
  constructor(key) {
    this.encryptKey = key;
    const hash = import_crypto.default.createHash("sha256");
    hash.update(key);
    this.key = hash.digest();
  }
  decrypt(encrypt) {
    const encryptBuffer = Buffer.from(encrypt, "base64");
    const decipher = import_crypto.default.createDecipheriv("aes-256-cbc", this.key, encryptBuffer.slice(0, 16));
    let decrypted = decipher.update(encryptBuffer.slice(16).toString("hex"), "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  }
  calculateSignature(timestamp, nonce, body) {
    const content = timestamp + nonce + this.encryptKey + body;
    const sign = import_crypto.default.createHash("sha256").update(content).digest("hex");
    return sign;
  }
};

// src/http.ts
var HttpServer = class extends import_core2.Adapter {
  static {
    __name(this, "HttpServer");
  }
  static inject = ["server"];
  logger;
  ciphers = {};
  constructor(ctx, bot) {
    super(ctx);
    this.logger = ctx.logger("lark");
  }
  fork(ctx, bot) {
    super.fork(ctx, bot);
    this._refreshCipher();
    return bot.initialize();
  }
  async connect(bot) {
    const { path } = bot.config;
    bot.ctx.server.post(path, (ctx) => {
      this._refreshCipher();
      const signature = ctx.get("X-Lark-Signature");
      const enabledSignatureVerify = this.bots.filter((bot2) => bot2.config.verifySignature);
      if (signature && enabledSignatureVerify.length) {
        const result = enabledSignatureVerify.some((bot2) => {
          const timestamp = ctx.get("X-Lark-Request-Timestamp");
          const nonce = ctx.get("X-Lark-Request-Nonce");
          const body2 = ctx.request.body[Symbol.for("unparsedBody")];
          const actualSignature = this.ciphers[bot2.config.appId]?.calculateSignature(timestamp, nonce, body2);
          if (actualSignature === signature) return true;
          else return false;
        });
        if (!result) return ctx.status = 403;
      }
      if (!ctx.request.is("json")) return ctx.status = 415;
      const body = this._tryDecryptBody(ctx.request.body);
      if (body?.type === "url_verification" && body?.challenge && typeof body.challenge === "string") {
        ctx.response.body = { challenge: body.challenge };
        return;
      }
      const enabledVerifyTokenVerify = this.bots.filter((bot2) => bot2.config.verifyToken && bot2.config.verificationToken);
      if (enabledVerifyTokenVerify.length) {
        const token = ctx.request.body?.token;
        if (token) {
          const result = enabledVerifyTokenVerify.some((bot2) => {
            if (token === bot2.config.verificationToken) return true;
            else return false;
          });
          if (!result) return ctx.status = 403;
        }
      }
      bot.logger.debug("received decrypted event: %o", body);
      this.dispatchSession(body);
      ctx.body = {};
      return ctx.status = 200;
    });
  }
  async dispatchSession(body) {
    const { header } = body;
    if (!header) return;
    const { app_id, event_type } = header;
    body.type = event_type;
    const bot = this.bots.find((bot2) => bot2.config.appId === app_id);
    const session = await adaptSession(bot, body);
    bot.dispatch(session);
  }
  _tryDecryptBody(body) {
    this._refreshCipher();
    const ciphers = Object.values(this.ciphers);
    if (ciphers.length && typeof body.encrypt === "string") {
      for (const cipher of ciphers) {
        try {
          return JSON.parse(cipher.decrypt(body.encrypt));
        } catch {
        }
      }
      this.logger.warn("failed to decrypt message: %o", body);
    }
    if (typeof body.encrypt === "string" && !ciphers.length) {
      this.logger.warn("encryptKey is not set, but received encrypted message: %o", body);
    }
    return body;
  }
  _refreshCipher() {
    const ciphers = Object.keys(this.ciphers);
    const bots = this.bots.map((bot) => bot.config.appId);
    if (bots.length === ciphers.length && bots.every((bot) => ciphers.includes(bot))) return;
    this.ciphers = {};
    for (const bot of this.bots) {
      this.ciphers[bot.config.appId] = new Cipher(bot.config.encryptKey);
    }
  }
};
((HttpServer2) => {
  HttpServer2.createConfig = /* @__PURE__ */ __name((path) => import_core2.Schema.object({
    protocol: import_core2.Schema.const("http"),
    path: import_core2.Schema.string().role("url").description("要连接的服务器地址。").default(path),
    selfUrl: import_core2.Schema.string().role("link").description("服务器暴露在公网的地址。缺省时将使用全局配置。"),
    encryptKey: import_core2.Schema.string().role("secret").description("机器人的 Encrypt Key。"),
    verificationToken: import_core2.Schema.string().description("事件推送的验证令牌。"),
    verifyToken: import_core2.Schema.boolean().description("是否验证令牌。"),
    verifySignature: import_core2.Schema.boolean().description("是否验证签名。")
  }).description("服务端设置"), "createConfig");
})(HttpServer || (HttpServer = {}));

// src/ws.ts
var import_core3 = require("@satorijs/core");
var import_light = __toESM(require("protobufjs/light"), 1);
var WsClient = class extends import_core3.Adapter.WsClient {
  static {
    __name(this, "WsClient");
  }
  _deviceId;
  _serviceId;
  _pingInterval = 9e4;
  _ping;
  _cache = {};
  _frame;
  constructor(ctx, bot) {
    super(ctx, bot);
    this._frame = import_light.default.Root.fromJSON({
      nested: {
        Header: {
          fields: {
            key: { rule: "required", type: "string", id: 1 },
            value: { rule: "required", type: "string", id: 2 }
          }
        },
        Frame: {
          fields: {
            SeqID: { rule: "required", type: "uint64", id: 1 },
            LogID: { rule: "required", type: "uint64", id: 2 },
            service: { rule: "required", type: "int32", id: 3 },
            method: { rule: "required", type: "int32", id: 4 },
            headers: { rule: "repeated", type: "Header", id: 5 },
            payloadEncoding: { type: "string", id: 6 },
            payloadType: { type: "string", id: 7 },
            payload: { type: "bytes", id: 8 },
            LogIDNew: { type: "string", id: 9 }
          }
        }
      }
    }).lookupType("Frame");
  }
  async prepare() {
    const baseUrl = this.bot.config.baseURL ?? new URL(this.bot.config.endpoint).origin;
    const { code, data: { URL: url, ClientConfig: config }, msg } = await this.bot.http.post(`${baseUrl}/callback/ws/endpoint`, {
      AppID: this.bot.config.appId,
      AppSecret: this.bot.config.appSecret
    });
    if (code !== 0) throw new Error(`failed to get gateway url: ${code} ${msg}`);
    const urlObj = new URL(url);
    this._deviceId = urlObj.searchParams.get("device_id");
    this._serviceId = +urlObj.searchParams.get("service_id");
    this._pingInterval = config.PingInterval * 1e3;
    return this.bot.ctx.http.ws(url);
  }
  ping() {
    if (!this.socket || this.bot.status !== import_core3.Universal.Status.ONLINE) {
      clearTimeout(this._ping);
      return;
    }
    const frame = {
      headers: [{
        key: "type",
        value: "ping" /* ping */
      }],
      service: this._serviceId,
      method: 0 /* control */,
      SeqID: 0,
      LogID: 0
    };
    this.send(frame);
    this._ping = setTimeout(() => this.ping(), this._pingInterval);
  }
  async accept() {
    await this.bot.initialize();
    this.socket.addEventListener("message", async ({ data }) => {
      const frame = this._frame.decode(new Uint8Array(data));
      const headers = (frame.headers ?? []).reduce((acc, cur) => {
        acc[cur.key] = cur.value;
        return acc;
      }, {});
      if (frame.method === 0 /* control */ && headers.type === "pong" /* pong */) {
        this.bot.logger.debug("pong");
        return;
      }
      if (frame.method === 1 /* data */) {
        if (headers.type !== "event" /* event */) return;
        const data2 = this.retrieve({
          message_id: headers.message_id,
          sum: +headers.sum,
          seq: +headers.seq,
          data: frame.payload
        });
        if (!data2) return;
        const body = JSON.parse(Buffer.from(data2).toString("utf8"));
        if (!body.header) return;
        this.bot.logger.info("received event: %o", body);
        body.type = body.header.event_type;
        const session = await adaptSession(this.bot, body);
        this.bot.dispatch(session);
        this.send({
          ...frame,
          headers: [...frame.headers, { key: "biz_rt", value: "0" }],
          payload: Buffer.from(JSON.stringify({ code: 200 }))
        });
      }
    });
    this.socket.addEventListener("close", (e) => {
      clearTimeout(this._ping);
    });
    this.ping();
  }
  send(frame) {
    const encoded = this._frame.encode(frame).finish();
    this.socket.send(encoded);
  }
  retrieve(seg) {
    const { message_id, sum } = seg;
    if (sum === 1) return seg.data;
    if (!this._cache[message_id]) this._cache[message_id] = [];
    this._cache[message_id].push(seg);
    if (this._cache[message_id].length === sum) {
      const data = Buffer.concat(this._cache[message_id].sort((a, b) => a.seq - b.seq).map((item) => item.data));
      delete this._cache[message_id];
      return data;
    }
  }
};
((WsClient2) => {
  WsClient2.Options = import_core3.Schema.intersect([
    import_core3.Schema.object({
      protocol: import_core3.Schema.const("ws").required()
    }),
    import_core3.Adapter.WsClientConfig
  ]);
})(WsClient || (WsClient = {}));

// src/message.ts
var import_core4 = require("@satorijs/core");
var LarkMessageEncoder = class extends import_core4.MessageEncoder {
  static {
    __name(this, "LarkMessageEncoder");
  }
  quote;
  textContent = "";
  richContent = [];
  card;
  elements = [];
  inline = false;
  editMessageIds;
  async post(data) {
    try {
      let resp;
      let quote = this.quote;
      if (!quote && this.referrer) {
        if (this.referrer.type === "im.message.receive_v1" && this.referrer.event.message.thread_id) {
          quote = {
            id: this.referrer.event.message.message_id,
            replyInThread: true
          };
        } else if (this.referrer.type === "card.action.trigger") {
          const { items: [message] } = await this.bot.internal.im.message.get(this.referrer.event.context.open_message_id);
          if (message?.thread_id) {
            quote = {
              id: this.referrer.event.context.open_message_id,
              replyInThread: true
            };
          }
        }
      }
      if (this.editMessageIds) {
        const messageId = this.editMessageIds.pop();
        if (!messageId) throw new Error("No message to edit");
        if (data.msg_type === "interactive") {
          delete data.msg_type;
          await this.bot.internal.im.message.patch(messageId, data);
        } else {
          await this.bot.internal.im.message.update(messageId, data);
        }
      } else if (quote?.id) {
        resp = await this.bot.internal.im.message.reply(quote.id, {
          ...data,
          reply_in_thread: quote.replyInThread
        });
      } else {
        data.receive_id = this.channelId;
        resp = await this.bot.internal.im.message.create(data, {
          receive_id_type: extractIdType(this.channelId)
        });
      }
      if (!resp) return;
      const session = this.bot.session();
      session.messageId = resp.message_id;
      session.timestamp = Number(resp.create_time) * 1e3;
      session.userId = resp.sender.id;
      session.channelId = this.session.channelId;
      session.guildId = this.session.guildId;
      session.app.emit(session, "send", session);
      this.results.push(session.event.message);
    } catch (e) {
      if (this.bot.http.isError(e)) {
        if (e.response?.data?.code) {
          const generalErrorMsg = `Check error code at https://open.larksuite.com/document/server-docs/getting-started/server-error-codes`;
          e.message += ` (Lark error code ${e.response.data.code}: ${e.response.data.msg ?? generalErrorMsg})`;
        }
      }
      this.errors.push(e);
    }
  }
  flushText() {
    if (!this.textContent) return;
    this.richContent.push([{ tag: "md", text: this.textContent }]);
    this.elements.push({ tag: "markdown", content: this.textContent });
    this.textContent = "";
  }
  async flush() {
    this.flushText();
    if (!this.card && !this.richContent.length) return;
    if (this.card) {
      this.bot.logger.debug("card %o", JSON.parse(JSON.stringify(this.card)));
      await this.post({
        msg_type: "interactive",
        content: JSON.stringify(this.card)
      });
    } else {
      await this.post({
        msg_type: "post",
        content: JSON.stringify({
          zh_cn: {
            content: this.richContent
          }
        })
      });
    }
    this.quote = void 0;
    this.textContent = "";
    this.richContent = [];
    this.card = void 0;
  }
  async createImage(url) {
    const { filename, type, data } = await this.bot.assetsQuester.file(url);
    const { image_key } = await this.bot.internal.im.image.create({
      image_type: "message",
      image: new File([data], filename, { type })
    });
    return image_key;
  }
  async sendFile(_type, attrs) {
    const url = attrs.src || attrs.url;
    const prefix = this.bot.getInternalUrl("/im/v1/files/");
    if (url.startsWith(prefix)) {
      const file_key2 = url.slice(prefix.length);
      await this.post({
        msg_type: _type === "video" ? "media" : _type,
        content: JSON.stringify({ file_key: file_key2 })
      });
      return;
    }
    const { filename, type, data } = await this.bot.assetsQuester.file(url);
    let file_type;
    if (_type === "audio") {
      file_type = "opus";
    } else if (_type === "video") {
      file_type = "mp4";
    } else {
      const ext = filename.split(".").pop();
      if (["doc", "xls", "ppt", "pdf"].includes(ext)) {
        file_type = ext;
      } else {
        file_type = "stream";
      }
    }
    const form = {
      file_type,
      file: new File([data], filename, { type }),
      file_name: filename
    };
    if (attrs.duration) {
      form.duration = attrs.duration;
    }
    const { file_key } = await this.bot.internal.im.file.create(form);
    await this.post({
      msg_type: _type === "video" ? "media" : _type,
      content: JSON.stringify({ file_key })
    });
  }
  createBehaviors(attrs) {
    const behaviors = [];
    if (attrs.type === "link") {
      behaviors.push({
        type: "open_url",
        default_url: attrs.href
      });
    } else if (attrs.type === "input" || attrs.type === "submit") {
      behaviors.push({
        type: "callback",
        value: {
          _satori_type: "command",
          content: attrs.text
        }
      });
    } else if (attrs.type === "action") {
    }
    return behaviors.length ? behaviors : void 0;
  }
  async visit(element) {
    const { type, attrs, children } = element;
    if (type === "text") {
      this.textContent += attrs.content;
    } else if (type === "at") {
      if (this.card) {
        if (attrs.type === "all") {
          this.textContent += `<at id=all>${attrs.name ?? ""}</at>`;
        } else {
          this.textContent += `<at id=${attrs.id}>${attrs.name ?? ""}</at>`;
        }
      } else {
        if (attrs.type === "all") {
          this.textContent += `<at user_id="all">${attrs.name ?? ""}</at>`;
        } else {
          this.textContent += `<at user_id="${attrs.id}">${attrs.name ?? ""}</at>`;
        }
      }
    } else if (type === "a") {
      await this.render(children);
      if (attrs.href) this.textContent += ` (${attrs.href})`;
    } else if (type === "p") {
      if (!this.textContent.endsWith("\n")) this.textContent += "\n";
      await this.render(children);
      if (!this.textContent.endsWith("\n")) this.textContent += "\n";
    } else if (type === "br") {
      this.textContent += "\n";
    } else if (type === "sharp") {
    } else if (type === "quote") {
      await this.flush();
      this.quote = attrs;
    } else if (type === "img" || type === "image") {
      const image_key = await this.createImage(attrs.src || attrs.url);
      this.textContent += `![${attrs.alt ?? "图片"}](${image_key})`;
      this.flushText();
      this.richContent.push([{ tag: "img", image_key }]);
    } else if (["video", "audio", "file"].includes(type)) {
      await this.flush();
      await this.sendFile(type, attrs);
    } else if (type === "lark:img") {
      this.flushText();
      this.elements.push({
        tag: "img",
        alt: attrs.alt,
        img_key: attrs.imgKey,
        transparent: attrs.transparent,
        preview: attrs.preview,
        corner_radius: attrs.cornerRadius,
        scale_type: attrs.scaleType,
        size: attrs.size,
        mode: attrs.mode,
        margin: attrs.margin
      });
    } else if (type === "figure" || type === "message") {
      await this.flush();
      await this.render(children, true);
    } else if (type === "hr") {
      this.flushText();
      this.richContent.push([{ tag: "hr" }]);
      this.elements.push({
        tag: "hr",
        margin: attrs.margin
      });
    } else if (type === "form") {
      this.flushText();
      const parent = this.elements;
      parent.push({
        tag: "form",
        name: attrs.name || "Form",
        elements: this.elements = []
      });
      await this.render(children);
      this.elements = parent;
    } else if (type === "input") {
      if (attrs.type === "checkbox") {
        this.flushText();
        await this.render(children);
        this.elements.push({
          tag: "checker",
          name: (attrs.argument ? "@@" : attrs.option ? `@${attrs.option}=` : "") + attrs.name,
          checked: attrs.value,
          disabled: attrs.disabled,
          text: {
            tag: "lark_md",
            content: this.textContent
          },
          hover_tips: attrs.hoverTips && {
            tag: "plain_text",
            content: attrs.hoverTips
          },
          disabled_tips: attrs.disabledTips && {
            tag: "plain_text",
            content: attrs.disabledTips
          },
          behaviors: this.createBehaviors(attrs),
          margin: attrs.margin
        });
        this.textContent = "";
      } else if (attrs.type === "submit") {
        this.flushText();
        await this.render(children);
        this.elements.push({
          tag: "button",
          name: attrs.name,
          width: attrs.width,
          text: {
            tag: "plain_text",
            content: this.textContent
          },
          form_action_type: "submit",
          behaviors: this.createBehaviors(attrs),
          margin: attrs.margin
        });
        this.textContent = "";
      } else {
        this.flushText();
        const input = {
          tag: "input",
          name: attrs.name,
          width: attrs.width,
          label: attrs.label && {
            tag: "plain_text",
            content: attrs.label
          },
          placeholder: attrs.placeholder && {
            tag: "plain_text",
            content: attrs.placeholder
          },
          disabled_tips: attrs.disabledTips && {
            tag: "plain_text",
            content: attrs.disabledTips
          },
          default_value: attrs.value,
          disabled: attrs.disabled,
          required: attrs.required,
          behaviors: this.createBehaviors(attrs),
          margin: attrs.margin
        };
        this.elements.push(input);
      }
    } else if (type === "select") {
      this.flushText();
      const select = {
        tag: "select_static",
        name: attrs.name,
        width: attrs.width,
        initial_option: attrs.value,
        disabled: attrs.disabled,
        required: attrs.required,
        placeholder: attrs.placeholder && {
          tag: "plain_text",
          content: attrs.placeholder
        },
        options: [],
        behaviors: this.createBehaviors(attrs),
        margin: attrs.margin
      };
      for (const child of children) {
        if (child.type !== "option") continue;
        await this.render(child.children);
        select.options.push({
          value: child.attrs.value,
          text: {
            tag: "plain_text",
            content: this.textContent ?? child.attrs.value
          }
        });
        this.textContent = "";
      }
      this.elements.push(select);
    } else if (type === "button") {
      this.flushText();
      await this.render(children);
      this.elements.push({
        tag: "button",
        text: {
          tag: "plain_text",
          content: this.textContent
        },
        disabled: attrs.disabled,
        type: attrs["lark:type"],
        size: attrs["lark:size"],
        width: attrs["lark:width"],
        icon: attrs["lark:icon"] && {
          tag: "standard_icon",
          token: attrs["lark:icon"],
          color: attrs["lark:icon-color"]
        },
        hover_tips: attrs.hoverTips && {
          tag: "plain_text",
          content: attrs.hoverTips
        },
        disabled_tips: attrs.disabledTips && {
          tag: "plain_text",
          content: attrs.disabledTips
        },
        behaviors: this.createBehaviors(attrs),
        margin: attrs.margin
      });
      this.textContent = "";
    } else if (type === "div") {
      this.flushText();
      this.inline = true;
      await this.render(children);
      this.inline = false;
      this.elements.push({
        tag: "markdown",
        text_align: attrs.align,
        text_size: attrs.size,
        content: this.textContent,
        margin: attrs.margin,
        icon: attrs.icon && {
          tag: "standard_icon",
          token: attrs.icon,
          color: attrs.iconColor
        }
      });
      this.textContent = "";
    } else if (type.startsWith("lark:") || type.startsWith("feishu:")) {
      const tag = type.slice(type.split(":", 1)[0].length + 1);
      if (tag === "share-chat") {
        await this.flush();
        await this.post({
          msg_type: "share_chat",
          content: JSON.stringify({ chat_id: attrs.chatId })
        });
      } else if (tag === "share-user") {
        await this.flush();
        await this.post({
          msg_type: "share_user",
          content: JSON.stringify({ user_id: attrs.userId })
        });
      } else if (tag === "system") {
        await this.flush();
        await this.render(children);
        await this.post({
          msg_type: "system",
          content: JSON.stringify({
            type: "divider",
            params: { divider_text: { text: this.textContent } },
            options: { need_rollup: attrs.needRollup }
          })
        });
        this.textContent = "";
      } else if (tag === "card") {
        await this.flush();
        this.card = {
          schema: "2.0",
          config: {
            summary: attrs.summary && {
              content: attrs.summary
            },
            enable_forward: attrs.enableForward,
            update_multi: attrs.updateMulti,
            enable_forward_interaction: attrs.enableForwardInteraction,
            style: typeof attrs.style === "string" ? JSON.parse(attrs.style) : attrs.style
          },
          header: attrs.title && {
            template: attrs.color,
            icon: attrs.icon && {
              tag: "standard_icon",
              token: attrs.icon,
              color: attrs.iconColor
            },
            title: {
              tag: "plain_text",
              content: attrs.title
            },
            subtitle: attrs.subtitle && {
              tag: "plain_text",
              content: attrs.subtitle
            }
          },
          body: {
            direction: attrs.direction,
            padding: attrs.padding,
            horizontal_spacing: attrs.horizontalSpacing,
            horizontal_align: attrs.horizontalAlign,
            vertical_spacing: attrs.verticalSpacing,
            vertical_align: attrs.verticalAlign,
            elements: this.elements = []
          }
        };
        await this.render(children, true);
      } else if (tag === "interactive-container") {
        this.flushText();
        const parent = this.elements;
        parent.push({
          tag: "interactive_container",
          disabled: attrs.disabled,
          width: attrs.width,
          height: attrs.height,
          margin: attrs.margin,
          padding: attrs.padding,
          background_style: attrs.backgroundStyle,
          vertical_align: attrs.verticalAlign,
          vertical_spacing: attrs.verticalSpacing,
          horizontal_align: attrs.horizontalAlign,
          horizontal_spacing: attrs.horizontalSpacing,
          direction: attrs.direction,
          has_border: attrs.hasBorder,
          border_color: attrs.borderColor,
          corner_radius: attrs.cornerRadius,
          elements: this.elements = [],
          hover_tips: attrs.hoverTips && {
            tag: "plain_text",
            content: attrs.hoverTips
          },
          disabled_tips: attrs.disabledTips && {
            tag: "plain_text",
            content: attrs.disabledTips
          },
          behaviors: this.createBehaviors(attrs)
        });
        await this.render(children);
        this.flushText();
        this.elements = parent;
      } else if (tag === "column-set") {
        this.flushText();
        const columns = [];
        this.elements.push({
          tag: "column_set",
          margin: attrs.margin,
          flex_mode: attrs.flexMode,
          horizontal_align: attrs.horizontalAlign,
          horizontal_spacing: attrs.horizontalSpacing,
          background_style: attrs.backgroundStyle,
          columns
        });
        const parent = this.elements;
        for (const child of children) {
          if (child.type !== "lark:column" && child.type !== "feishu:column") {
            continue;
          }
          this.elements = [];
          await this.render(child.children);
          this.flushText();
          columns.push({
            tag: "column",
            width: child.attrs.width,
            weight: child.attrs.weight,
            margin: child.attrs.margin,
            padding: child.attrs.padding,
            vertical_align: child.attrs.verticalAlign ?? "center",
            vertical_spacing: child.attrs.verticalSpacing ?? "0px",
            background_style: child.attrs.backgroundStyle,
            elements: this.elements
          });
        }
        this.elements = parent;
      }
    } else if (type === "button-group") {
      this.flushText();
      const parent = this.elements;
      this.elements = [];
      await this.render(children);
      this.flushText();
      parent.push({
        tag: "column_set",
        margin: attrs.margin,
        flex_mode: attrs.flexMode,
        horizontal_align: attrs.horizontalAlign,
        horizontal_spacing: attrs.horizontalSpacing,
        background_style: attrs.backgroundStyle,
        columns: this.elements.map((element2) => ({
          tag: "column",
          elements: [element2]
        }))
      });
      this.elements = parent;
    } else {
      await this.render(children);
    }
  }
};

// src/internal.ts
var import_core5 = require("@satorijs/core");
var Internal = class _Internal {
  static {
    __name(this, "Internal");
  }
  constructor(bot, tree = _Internal._tree) {
    return new Proxy(this, {
      get: /* @__PURE__ */ __name((target, prop) => {
        if (typeof prop === "symbol") return Reflect.get(target, prop);
        const value = tree[prop];
        if (typeof value === "function") return value.bind(bot);
        if (value) return new _Internal(bot, value);
      }, "get")
    });
  }
  static _assertResponse(bot, response) {
    if (!response.data.code) return;
    bot.logger.debug("response: %o", response.data);
    const error = new import_core5.HTTP.Error(`request failed`);
    error.response = response;
    throw error;
  }
  static _buildData(arg, options) {
    if (options.multipart) {
      const form = new FormData();
      for (const [key, value] of Object.entries(arg)) {
        if (value instanceof File) {
          form.append(key, value, value.name);
        } else {
          form.append(key, value);
        }
      }
      return form;
    } else {
      return arg;
    }
  }
  static _tree = /* @__PURE__ */ Object.create(null);
  static define(routes) {
    for (const path in routes) {
      for (const key in routes[path]) {
        const method = key;
        for (let route of (0, import_core5.makeArray)(routes[path][method])) {
          if (typeof route === "string") {
            route = { name: route };
          }
          const impl = /* @__PURE__ */ __name(async function(bot, ...args) {
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
                config.data = _Internal._buildData(args[0], route);
              }
            } else if (args.length === 2 && method !== "GET" && method !== "DELETE") {
              config.data = _Internal._buildData(args[0], route);
              config.params = args[1];
            } else if (args.length > 1) {
              throw new Error(`too many arguments for ${path}, received ${raw}`);
            }
            if (route.type === "binary") {
              config.responseType = "arraybuffer";
            }
            const response = await bot.http(method, url, config);
            _Internal._assertResponse(bot, response);
            if (route.type === "raw-json" || route.type === "binary") {
              return response.data;
            } else {
              return response.data.data;
            }
          }, "impl");
          let root = _Internal._tree;
          const parts = route.name.split(".");
          const lastPart = parts.pop();
          for (const part of parts) {
            root = root[part] ??= /* @__PURE__ */ Object.create(null);
          }
          root[lastPart] = function(...args) {
            let promise;
            const result = {};
            for (const key2 of ["then", "catch", "finally"]) {
              result[key2] = (...args2) => {
                return (promise ??= impl(this, ...args))[key2](...args2);
              };
            }
            if (route.pagination) {
              const { argIndex, itemsKey = "items", tokenKey = "page_token" } = route.pagination;
              const iterArgs = [...args];
              iterArgs[argIndex] = { ...args[argIndex] };
              let pagination;
              result.next = async function() {
                pagination ??= await this[Symbol.for("satori.pagination")]();
                if (pagination.data.length) return { done: false, value: pagination.data.shift() };
                if (!pagination.next) return { done: true, value: void 0 };
                pagination = await this[Symbol.for("satori.pagination")]();
                return this.next();
              };
              result[Symbol.asyncIterator] = function() {
                return this;
              };
              result[Symbol.for("satori.pagination")] = async () => {
                const data = await impl(this, ...iterArgs);
                iterArgs[argIndex].page_token = data[tokenKey];
                return {
                  data: data[itemsKey],
                  next: data[tokenKey] ? iterArgs : void 0
                };
              };
            }
            return result;
          };
        }
      }
    }
  }
};

// src/bot.ts
var fileTypeMap = {
  opus: ["audio/opus"],
  mp4: ["video/mp4"],
  pdf: ["application/pdf"],
  doc: ["application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
  xls: ["application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"],
  ppt: ["application/vnd.ms-powerpoint", "application/vnd.openxmlformats-officedocument.presentationml.presentation"]
};
var LarkBot = class extends import_core6.Bot {
  static {
    __name(this, "LarkBot");
  }
  static inject = ["server", "http"];
  static MessageEncoder = LarkMessageEncoder;
  _refresher;
  http;
  assetsQuester;
  internal;
  constructor(ctx, config) {
    super(ctx, config, "lark");
    this.http = ctx.http.extend({
      endpoint: config.endpoint
    });
    this.assetsQuester = ctx.http;
    this.internal = new Internal(this);
    if (config.protocol === "http") {
      ctx.plugin(HttpServer, this);
    } else if (config.protocol === "ws") {
      ctx.plugin(WsClient, this);
    }
    this.defineInternalRoute("/*path", async ({ params, method, headers, body, query }) => {
      const response = await this.http("/" + params.path, {
        method,
        headers,
        data: method === "GET" || method === "HEAD" ? null : body,
        params: Object.fromEntries(query.entries()),
        responseType: "arraybuffer",
        validateStatus: /* @__PURE__ */ __name(() => true, "validateStatus")
      });
      return {
        status: response.status,
        body: response.data,
        headers: response.headers
      };
    });
  }
  getResourceUrl(type, message_id, file_key) {
    return this.getInternalUrl(`/im/v1/messages/${message_id}/resources/${file_key}`, { type });
  }
  async initialize() {
    await this.refreshToken();
    const { bot } = await this.http.get("/bot/v3/info");
    this.selfId = bot.open_id;
    this.user.avatar = bot.avatar_url;
    this.user.name = bot.app_name;
    this.online();
  }
  async refreshToken() {
    if (!this.isActive) return;
    let timeout = import_core6.Time.minute * 20;
    try {
      const { tenant_access_token: token } = await this.internal.auth.tenantAccessTokenInternal({
        app_id: this.config.appId,
        app_secret: this.config.appSecret
      });
      this.logger.debug("refreshed token %s", token);
      this.http.config.headers.Authorization = `Bearer ${token}`;
    } catch (error) {
      this.logger.error("failed to refresh token, retrying in 10s");
      this.logger.error(error);
      timeout = import_core6.Time.second * 10;
    }
    if (this._refresher) clearTimeout(this._refresher);
    this._refresher = setTimeout(() => this.refreshToken(), timeout);
    this.online();
  }
  async editMessage(channelId, messageId, content) {
    const encoder = new LarkMessageEncoder(this, channelId);
    encoder.editMessageIds = [messageId];
    await encoder.send(content);
  }
  async deleteMessage(channelId, messageId) {
    await this.internal.im.message.delete(messageId);
  }
  async getMessage(channelId, messageId, recursive = true) {
    const data = await this.internal.im.message.get(messageId);
    const message = await decodeMessage(this, data.items[0], recursive);
    const im = await this.internal.im.chat.get(channelId);
    message.channel.type = im.chat_mode === "p2p" ? import_core6.Universal.Channel.Type.DIRECT : import_core6.Universal.Channel.Type.TEXT;
    return message;
  }
  async getMessageList(channelId, before) {
    const messages = await this.internal.im.message.list({ container_id_type: "chat", container_id: channelId, page_token: before });
    const data = await Promise.all(messages.items.reverse().map((data2) => decodeMessage(this, data2)));
    return { data, next: data[0]?.id };
  }
  async getUser(userId, guildId) {
    const data = await this.internal.contact.user.get(userId);
    return decodeUser(data.user);
  }
  async getChannel(channelId) {
    const chat = await this.internal.im.chat.get(channelId);
    return decodeChannel(channelId, chat);
  }
  async getChannelList(guildId) {
    return { data: [await this.getChannel(guildId)] };
  }
  async getGuild(guildId) {
    const chat = await this.internal.im.chat.get(guildId);
    return decodeGuild(chat);
  }
  async getGuildList(after) {
    const chats = await this.internal.im.chat.list({ page_token: after });
    return { data: chats.items.map(decodeGuild), next: chats.page_token };
  }
  async getGuildMemberList(guildId, after) {
    const members = await this.internal.im.chat.members.get(guildId, { page_token: after });
    const data = members.items.map((v) => ({ user: { id: v.member_id, name: v.name }, name: v.name }));
    return { data, next: members.page_token };
  }
  async createUpload(...uploads) {
    return await Promise.all(uploads.map(async (upload) => {
      let type = "stream";
      for (const [key, value] of Object.entries(fileTypeMap)) {
        if (value.includes(upload.type)) {
          type = key;
          break;
        }
      }
      const response = await this.internal.im.file.create({
        file_name: upload.filename,
        file_type: type,
        file: new Blob([upload.data])
      });
      return this.getInternalUrl(`/im/v1/files/${response.file_key}`);
    }));
  }
};
((LarkBot2) => {
  LarkBot2.Config = import_core6.Schema.intersect([
    import_core6.Schema.object({
      platform: import_core6.Schema.union(["feishu", "lark"]).default("feishu").description("平台名称。"),
      appId: import_core6.Schema.string().required().description("机器人的应用 ID。"),
      appSecret: import_core6.Schema.string().role("secret").required().description("机器人的应用密钥。"),
      protocol: process.env.KOISHI_ENV === "browser" ? import_core6.Schema.const("ws").default("ws") : import_core6.Schema.union(["http", "ws"]).description("选择要使用的协议。").default("http")
    }),
    import_core6.Schema.union([
      import_core6.Schema.intersect([
        import_core6.Schema.object({
          platform: import_core6.Schema.const("lark").required()
        }),
        import_core6.HTTP.createConfig("https://open.larksuite.com/open-apis"),
        import_core6.Schema.union([
          HttpServer.createConfig("/lark"),
          WsClient.Options
        ])
      ]),
      import_core6.Schema.intersect([
        import_core6.Schema.object({
          platform: import_core6.Schema.const("feishu")
        }),
        import_core6.HTTP.createConfig("https://open.feishu.cn/open-apis"),
        import_core6.Schema.union([
          HttpServer.createConfig("/feishu"),
          WsClient.Options
        ])
      ])
    ])
  ]);
})(LarkBot || (LarkBot = {}));

// src/types/index.ts
var types_exports = {};
__export(types_exports, {
  AbnormalCode: () => AbnormalCode,
  Admin: () => Admin,
  AilyMessageContentType: () => AilyMessageContentType,
  AilyMessageStatus: () => AilyMessageStatus,
  AilySenderType: () => AilySenderType,
  Application: () => Application,
  Approval: () => Approval,
  Attendance: () => Attendance,
  Bitable: () => Bitable,
  ColorType: () => ColorType,
  ConnectorArrowStyle: () => ConnectorArrowStyle,
  ConnectorLineShape: () => ConnectorLineShape,
  Contact: () => Contact,
  Corehr: () => Corehr,
  CustomFieldValueEnumType: () => CustomFieldValueEnumType,
  CustomFieldValueType: () => CustomFieldValueType,
  CustomFieldValueUserType: () => CustomFieldValueUserType,
  DataSource: () => DataSource,
  DiagramType: () => DiagramType,
  Docx: () => Docx,
  Ehr: () => Ehr,
  EmployeeActiveStatusDirectory: () => EmployeeActiveStatusDirectory,
  EmployeeStaffStatusDirectory: () => EmployeeStaffStatusDirectory,
  GenderDirectory: () => GenderDirectory,
  Hire: () => Hire,
  IdentityProvider: () => IdentityProvider,
  Mail: () => Mail,
  MindMapLayout: () => MindMapLayout,
  MindMapType: () => MindMapType,
  Okr: () => Okr,
  PaintType: () => PaintType,
  Passport: () => Passport,
  Payroll: () => Payroll,
  Performance: () => Performance,
  Report: () => Report,
  ResignReasonDirectory: () => ResignReasonDirectory,
  ResignTypeDirectory: () => ResignTypeDirectory,
  RunStatus: () => RunStatus,
  Search: () => Search,
  SecurityAndCompliance: () => SecurityAndCompliance,
  SnapTo: () => SnapTo,
  StyleType: () => StyleType,
  SyntaxType: () => SyntaxType,
  Vc: () => Vc
});

// src/types/acs.ts
Internal.define({
  "/acs/v1/users/{user_id}": {
    PATCH: "acs.user.patch",
    GET: "acs.user.get"
  },
  "/acs/v1/users": {
    GET: { name: "acs.user.list", pagination: { argIndex: 0 } }
  },
  "/acs/v1/users/{user_id}/face": {
    PUT: { name: "acs.user.face.update", multipart: true },
    GET: { name: "acs.user.face.get", type: "binary" }
  },
  "/acs/v1/rule_external/device_bind": {
    POST: "acs.ruleExternal.deviceBind"
  },
  "/acs/v1/rule_external": {
    GET: "acs.ruleExternal.get",
    DELETE: "acs.ruleExternal.delete",
    POST: "acs.ruleExternal.create"
  },
  "/acs/v1/visitors/{visitor_id}": {
    DELETE: "acs.visitor.delete"
  },
  "/acs/v1/visitors": {
    POST: "acs.visitor.create"
  },
  "/acs/v1/devices": {
    GET: "acs.device.list"
  },
  "/acs/v1/access_records": {
    GET: { name: "acs.accessRecord.list", pagination: { argIndex: 0 } }
  },
  "/acs/v1/access_records/{access_record_id}/access_photo": {
    GET: { name: "acs.accessRecord.accessPhoto.get", type: "binary" }
  }
});

// src/types/admin.ts
var Admin;
((Admin2) => {
  let Badge;
  ((Badge2) => {
    let Grant;
    ((Grant2) => {
      let CreateRequestGrantType;
      ((CreateRequestGrantType2) => {
        CreateRequestGrantType2[CreateRequestGrantType2["Manual"] = 0] = "Manual";
        CreateRequestGrantType2[CreateRequestGrantType2["JoinTime"] = 1] = "JoinTime";
      })(CreateRequestGrantType = Grant2.CreateRequestGrantType || (Grant2.CreateRequestGrantType = {}));
      let UpdateRequestGrantType;
      ((UpdateRequestGrantType2) => {
        UpdateRequestGrantType2[UpdateRequestGrantType2["Manual"] = 0] = "Manual";
        UpdateRequestGrantType2[UpdateRequestGrantType2["JoinTime"] = 1] = "JoinTime";
      })(UpdateRequestGrantType = Grant2.UpdateRequestGrantType || (Grant2.UpdateRequestGrantType = {}));
    })(Grant = Badge2.Grant || (Badge2.Grant = {}));
  })(Badge = Admin2.Badge || (Admin2.Badge = {}));
  let BadgeImage;
  ((BadgeImage2) => {
    let CreateFormImageType;
    ((CreateFormImageType2) => {
      CreateFormImageType2[CreateFormImageType2["Detail"] = 1] = "Detail";
      CreateFormImageType2[CreateFormImageType2["Show"] = 2] = "Show";
    })(CreateFormImageType = BadgeImage2.CreateFormImageType || (BadgeImage2.CreateFormImageType = {}));
  })(BadgeImage = Admin2.BadgeImage || (Admin2.BadgeImage = {}));
  let AuditInfo;
  ((AuditInfo2) => {
    let ListQueryUserType;
    ((ListQueryUserType2) => {
      ListQueryUserType2[ListQueryUserType2["All"] = 0] = "All";
      ListQueryUserType2[ListQueryUserType2["NormalUser"] = 1] = "NormalUser";
      ListQueryUserType2[ListQueryUserType2["ExternalUser"] = 2] = "ExternalUser";
    })(ListQueryUserType = AuditInfo2.ListQueryUserType || (AuditInfo2.ListQueryUserType = {}));
  })(AuditInfo = Admin2.AuditInfo || (Admin2.AuditInfo = {}));
})(Admin || (Admin = {}));
Internal.define({
  "/admin/v1/password/reset": {
    POST: "admin.password.reset"
  },
  "/admin/v1/admin_dept_stats": {
    GET: { name: "admin.adminDeptStat.list", pagination: { argIndex: 0 } }
  },
  "/admin/v1/admin_user_stats": {
    GET: { name: "admin.adminUserStat.list", pagination: { argIndex: 0 } }
  },
  "/admin/v1/badges": {
    POST: "admin.badge.create",
    GET: { name: "admin.badge.list", pagination: { argIndex: 0, itemsKey: "badges" } }
  },
  "/admin/v1/badges/{badge_id}": {
    PUT: "admin.badge.update",
    GET: "admin.badge.get"
  },
  "/admin/v1/badge_images": {
    POST: { name: "admin.badgeImage.create", multipart: true }
  },
  "/admin/v1/badges/{badge_id}/grants": {
    POST: "admin.badge.grant.create",
    GET: { name: "admin.badge.grant.list", pagination: { argIndex: 1, itemsKey: "grants" } }
  },
  "/admin/v1/badges/{badge_id}/grants/{grant_id}": {
    DELETE: "admin.badge.grant.delete",
    PUT: "admin.badge.grant.update",
    GET: "admin.badge.grant.get"
  },
  "/admin/v1/audit_infos": {
    GET: { name: "admin.auditInfo.list", pagination: { argIndex: 0 } }
  }
});

// src/types/aily.ts
Internal.define({
  "/aily/v1/sessions": {
    POST: "aily.ailySession.create"
  },
  "/aily/v1/sessions/{aily_session_id}": {
    PUT: "aily.ailySession.update",
    GET: "aily.ailySession.get",
    DELETE: "aily.ailySession.delete"
  },
  "/aily/v1/sessions/{aily_session_id}/messages": {
    POST: "aily.ailySession.ailyMessage.create",
    GET: { name: "aily.ailySession.ailyMessage.list", pagination: { argIndex: 1, itemsKey: "messages" } }
  },
  "/aily/v1/sessions/{aily_session_id}/messages/{aily_message_id}": {
    GET: "aily.ailySession.ailyMessage.get"
  },
  "/aily/v1/sessions/{aily_session_id}/runs": {
    POST: "aily.ailySession.run.create",
    GET: { name: "aily.ailySession.run.list", pagination: { argIndex: 1, itemsKey: "runs" } }
  },
  "/aily/v1/sessions/{aily_session_id}/runs/{run_id}": {
    GET: "aily.ailySession.run.get"
  },
  "/aily/v1/sessions/{aily_session_id}/runs/{run_id}/cancel": {
    POST: "aily.ailySession.run.cancel"
  },
  "/aily/v1/apps/{app_id}/skills/{skill_id}/start": {
    POST: "aily.app.skill.start"
  },
  "/aily/v1/apps/{app_id}/skills/{skill_id}": {
    GET: "aily.app.skill.get"
  },
  "/aily/v1/apps/{app_id}/skills": {
    GET: { name: "aily.app.skill.list", pagination: { argIndex: 1, itemsKey: "skills" } }
  },
  "/aily/v1/apps/{app_id}/knowledges/ask": {
    POST: "aily.app.knowledge.ask"
  },
  "/aily/v1/apps/{app_id}/data_assets/upload_file": {
    POST: { name: "aily.app.dataAsset.uploadFile", multipart: true }
  },
  "/aily/v1/apps/{app_id}/data_assets": {
    POST: "aily.app.dataAsset.create",
    GET: { name: "aily.app.dataAsset.list", pagination: { argIndex: 1 } }
  },
  "/aily/v1/apps/{app_id}/data_assets/{data_asset_id}": {
    GET: "aily.app.dataAsset.get",
    DELETE: "aily.app.dataAsset.delete"
  },
  "/aily/v1/apps/{app_id}/data_asset_tags": {
    GET: { name: "aily.app.dataAssetTag.list", pagination: { argIndex: 1 } }
  }
});

// src/types/apaas.ts
Internal.define({
  "/apaas/v1/apps": {
    GET: { name: "apaas.app.list", pagination: { argIndex: 0 } }
  },
  "/apaas/v1/seat_assignments": {
    GET: { name: "apaas.seatAssignment.list", pagination: { argIndex: 0 } }
  },
  "/apaas/v1/seat_activities": {
    GET: { name: "apaas.seatActivity.list", pagination: { argIndex: 0 } }
  },
  "/apaas/v1/applications/{namespace}/audit_log/audit_log_list": {
    GET: "apaas.application.auditLog.auditLogList"
  },
  "/apaas/v1/applications/{namespace}/audit_log": {
    GET: "apaas.application.auditLog.get"
  },
  "/apaas/v1/applications/{namespace}/audit_log/data_change_logs_list": {
    GET: "apaas.application.auditLog.dataChangeLogsList"
  },
  "/apaas/v1/applications/{namespace}/audit_log/data_change_log_detail": {
    GET: "apaas.application.auditLog.dataChangeLogDetail"
  },
  "/apaas/v1/applications/{namespace}/record_permissions/{record_permission_api_name}/member/batch_remove_authorization": {
    POST: "apaas.application.recordPermission.member.batchRemoveAuthorization"
  },
  "/apaas/v1/applications/{namespace}/record_permissions/{record_permission_api_name}/member/batch_create_authorization": {
    POST: "apaas.application.recordPermission.member.batchCreateAuthorization"
  },
  "/apaas/v1/applications/{namespace}/roles/{role_api_name}/member/batch_remove_authorization": {
    POST: "apaas.application.role.member.batchRemoveAuthorization"
  },
  "/apaas/v1/applications/{namespace}/roles/{role_api_name}/member/batch_create_authorization": {
    POST: "apaas.application.role.member.batchCreateAuthorization"
  },
  "/apaas/v1/applications/{namespace}/roles/{role_api_name}/member": {
    GET: "apaas.application.role.member.get"
  },
  "/apaas/v1/applications/{namespace}/objects/oql_query": {
    POST: "apaas.application.object.oqlQuery"
  },
  "/apaas/v1/applications/{namespace}/objects/search": {
    POST: "apaas.application.object.search"
  },
  "/apaas/v1/applications/{namespace}/objects/{object_api_name}/records/{id}/query": {
    POST: "apaas.application.object.record.query"
  },
  "/apaas/v1/applications/{namespace}/objects/{object_api_name}/records/{id}": {
    PATCH: "apaas.application.object.record.patch",
    DELETE: "apaas.application.object.record.delete"
  },
  "/apaas/v1/applications/{namespace}/objects/{object_api_name}/records": {
    POST: "apaas.application.object.record.create"
  },
  "/apaas/v1/applications/{namespace}/objects/{object_api_name}/records/batch_update": {
    PATCH: "apaas.application.object.record.batchUpdate"
  },
  "/apaas/v1/applications/{namespace}/objects/{object_api_name}/records/batch_query": {
    POST: "apaas.application.object.record.batchQuery"
  },
  "/apaas/v1/applications/{namespace}/objects/{object_api_name}/records/batch_delete": {
    DELETE: "apaas.application.object.record.batchDelete"
  },
  "/apaas/v1/applications/{namespace}/objects/{object_api_name}/records/batch_create": {
    POST: "apaas.application.object.record.batchCreate"
  },
  "/apaas/v1/applications/{namespace}/functions/{function_api_name}/invoke": {
    POST: "apaas.application.function.invoke"
  },
  "/apaas/v1/applications/{namespace}/environment_variables/query": {
    POST: "apaas.application.environmentVariable.query"
  },
  "/apaas/v1/applications/{namespace}/environment_variables/{environment_variable_api_name}": {
    GET: "apaas.application.environmentVariable.get"
  },
  "/apaas/v1/applications/{namespace}/flows/{flow_id}/execute": {
    POST: "apaas.application.flow.execute"
  },
  "/apaas/v1/user_task/query": {
    POST: "apaas.userTask.query"
  },
  "/apaas/v1/approval_tasks/{approval_task_id}/agree": {
    POST: "apaas.approvalTask.agree"
  },
  "/apaas/v1/approval_tasks/{approval_task_id}/reject": {
    POST: "apaas.approvalTask.reject"
  },
  "/apaas/v1/approval_tasks/{approval_task_id}/transfer": {
    POST: "apaas.approvalTask.transfer"
  },
  "/apaas/v1/approval_tasks/{approval_task_id}/add_assignee": {
    POST: "apaas.approvalTask.addAssignee"
  },
  "/apaas/v1/user_tasks/{task_id}/cc": {
    POST: "apaas.userTask.cc"
  },
  "/apaas/v1/user_tasks/{task_id}/expediting": {
    POST: "apaas.userTask.expediting"
  },
  "/apaas/v1/approval_instances/{approval_instance_id}/cancel": {
    POST: "apaas.approvalInstance.cancel"
  },
  "/apaas/v1/user_tasks/{task_id}/rollback_points": {
    POST: "apaas.userTask.rollbackPoints"
  },
  "/apaas/v1/user_tasks/{task_id}/rollback": {
    POST: "apaas.userTask.rollback"
  },
  "/apaas/v1/user_tasks/{task_id}/chat_group": {
    POST: "apaas.userTask.chatGroup"
  },
  "/apaas/v1/workspaces/{workspace_id}/tables/{table_name}/records": {
    GET: "apaas.workspace.table.recordsGet",
    POST: "apaas.workspace.table.recordsPost",
    PATCH: "apaas.workspace.table.recordsPatch",
    DELETE: "apaas.workspace.table.recordsDelete"
  },
  "/apaas/v1/workspaces/{workspace_id}/tables/{table_name}/records_batch_update": {
    PATCH: "apaas.workspace.table.recordsBatchUpdate"
  },
  "/apaas/v1/workspaces/{workspace_id}/views/{view_name}/records": {
    GET: "apaas.workspace.view.viewsGet"
  },
  "/apaas/v1/workspaces/{workspace_id}/sql_commands": {
    POST: "apaas.workspace.sqlCommands"
  }
});

// src/types/application.ts
var Application;
((Application2) => {
  let ListQueryStatus;
  ((ListQueryStatus2) => {
    ListQueryStatus2[ListQueryStatus2["AvailabilityStopped"] = 0] = "AvailabilityStopped";
    ListQueryStatus2[ListQueryStatus2["AvailabilityActivated"] = 1] = "AvailabilityActivated";
    ListQueryStatus2[ListQueryStatus2["AvailabilityUnactivated"] = 2] = "AvailabilityUnactivated";
  })(ListQueryStatus = Application2.ListQueryStatus || (Application2.ListQueryStatus = {}));
  let ListQueryPaymentType;
  ((ListQueryPaymentType2) => {
    ListQueryPaymentType2[ListQueryPaymentType2["Free"] = 0] = "Free";
    ListQueryPaymentType2[ListQueryPaymentType2["Paid"] = 1] = "Paid";
  })(ListQueryPaymentType = Application2.ListQueryPaymentType || (Application2.ListQueryPaymentType = {}));
  let ListQueryOwnerType;
  ((ListQueryOwnerType2) => {
    ListQueryOwnerType2[ListQueryOwnerType2["FeishuTechnology"] = 0] = "FeishuTechnology";
    ListQueryOwnerType2[ListQueryOwnerType2["FeishuThirdParty"] = 1] = "FeishuThirdParty";
    ListQueryOwnerType2[ListQueryOwnerType2["EnterpriseMember"] = 2] = "EnterpriseMember";
  })(ListQueryOwnerType = Application2.ListQueryOwnerType || (Application2.ListQueryOwnerType = {}));
  let AppVersion;
  ((AppVersion2) => {
    let PatchRequestStatus;
    ((PatchRequestStatus2) => {
      PatchRequestStatus2[PatchRequestStatus2["Unknown"] = 0] = "Unknown";
      PatchRequestStatus2[PatchRequestStatus2["Audited"] = 1] = "Audited";
      PatchRequestStatus2[PatchRequestStatus2["Reject"] = 2] = "Reject";
      PatchRequestStatus2[PatchRequestStatus2["UnderAudit"] = 3] = "UnderAudit";
      PatchRequestStatus2[PatchRequestStatus2["Unaudit"] = 4] = "Unaudit";
    })(PatchRequestStatus = AppVersion2.PatchRequestStatus || (AppVersion2.PatchRequestStatus = {}));
  })(AppVersion = Application2.AppVersion || (Application2.AppVersion = {}));
  let AppUsage;
  ((AppUsage2) => {
    let DepartmentOverviewRequestCycleType;
    ((DepartmentOverviewRequestCycleType2) => {
      DepartmentOverviewRequestCycleType2[DepartmentOverviewRequestCycleType2["Day"] = 1] = "Day";
      DepartmentOverviewRequestCycleType2[DepartmentOverviewRequestCycleType2["Week"] = 2] = "Week";
      DepartmentOverviewRequestCycleType2[DepartmentOverviewRequestCycleType2["Month"] = 3] = "Month";
    })(DepartmentOverviewRequestCycleType = AppUsage2.DepartmentOverviewRequestCycleType || (AppUsage2.DepartmentOverviewRequestCycleType = {}));
    let MessagePushOverviewRequestCycleType;
    ((MessagePushOverviewRequestCycleType2) => {
      MessagePushOverviewRequestCycleType2[MessagePushOverviewRequestCycleType2["Day"] = 1] = "Day";
      MessagePushOverviewRequestCycleType2[MessagePushOverviewRequestCycleType2["Week"] = 2] = "Week";
      MessagePushOverviewRequestCycleType2[MessagePushOverviewRequestCycleType2["Month"] = 3] = "Month";
    })(MessagePushOverviewRequestCycleType = AppUsage2.MessagePushOverviewRequestCycleType || (AppUsage2.MessagePushOverviewRequestCycleType = {}));
    let OverviewRequestCycleType;
    ((OverviewRequestCycleType2) => {
      OverviewRequestCycleType2[OverviewRequestCycleType2["Day"] = 1] = "Day";
      OverviewRequestCycleType2[OverviewRequestCycleType2["Week"] = 2] = "Week";
      OverviewRequestCycleType2[OverviewRequestCycleType2["Month"] = 3] = "Month";
    })(OverviewRequestCycleType = AppUsage2.OverviewRequestCycleType || (AppUsage2.OverviewRequestCycleType = {}));
  })(AppUsage = Application2.AppUsage || (Application2.AppUsage = {}));
  let Feedback;
  ((Feedback2) => {
    let PatchQueryStatus;
    ((PatchQueryStatus2) => {
      PatchQueryStatus2[PatchQueryStatus2["Unmarked"] = 0] = "Unmarked";
      PatchQueryStatus2[PatchQueryStatus2["Marked"] = 1] = "Marked";
      PatchQueryStatus2[PatchQueryStatus2["Processing"] = 2] = "Processing";
      PatchQueryStatus2[PatchQueryStatus2["Closed"] = 3] = "Closed";
    })(PatchQueryStatus = Feedback2.PatchQueryStatus || (Feedback2.PatchQueryStatus = {}));
    let ListQueryFeedbackType;
    ((ListQueryFeedbackType2) => {
      ListQueryFeedbackType2[ListQueryFeedbackType2["Fault"] = 1] = "Fault";
      ListQueryFeedbackType2[ListQueryFeedbackType2["Advice"] = 2] = "Advice";
    })(ListQueryFeedbackType = Feedback2.ListQueryFeedbackType || (Feedback2.ListQueryFeedbackType = {}));
    let ListQueryStatus2;
    ((ListQueryStatus3) => {
      ListQueryStatus3[ListQueryStatus3["Unmarked"] = 0] = "Unmarked";
      ListQueryStatus3[ListQueryStatus3["Marked"] = 1] = "Marked";
      ListQueryStatus3[ListQueryStatus3["Processing"] = 2] = "Processing";
      ListQueryStatus3[ListQueryStatus3["Closed"] = 3] = "Closed";
    })(ListQueryStatus2 = Feedback2.ListQueryStatus || (Feedback2.ListQueryStatus = {}));
  })(Feedback = Application2.Feedback || (Application2.Feedback = {}));
})(Application || (Application = {}));
Internal.define({
  "/application/v6/applications/{app_id}/owner": {
    PUT: "application.owner.update"
  },
  "/application/v6/applications/{app_id}/collaborators": {
    PUT: "application.collaborators.update",
    GET: "application.collaborators.get"
  },
  "/application/v6/applications/{app_id}": {
    GET: "application.get",
    PATCH: "application.patch"
  },
  "/application/v6/applications/{app_id}/app_versions/{version_id}": {
    GET: "application.appVersion.get",
    PATCH: "application.appVersion.patch"
  },
  "/application/v6/applications/{app_id}/app_versions": {
    GET: { name: "application.appVersion.list", pagination: { argIndex: 1 } }
  },
  "/application/v6/applications/{app_id}/app_versions/{version_id}/contacts_range_suggest": {
    GET: "application.appVersion.contactsRangeSuggest"
  },
  "/application/v6/scopes/apply": {
    POST: "application.scope.apply"
  },
  "/application/v6/scopes": {
    GET: "application.scope.list"
  },
  "/application/v6/applications": {
    GET: { name: "application.list", pagination: { argIndex: 0, itemsKey: "app_list" } }
  },
  "/application/v6/applications/underauditlist": {
    GET: { name: "application.underauditlist", pagination: { argIndex: 0 } }
  },
  "/application/v6/applications/{app_id}/contacts_range_configuration": {
    GET: "application.contactsRangeConfiguration"
  },
  "/application/v6/applications/{app_id}/contacts_range": {
    PATCH: "application.contactsRange.patch"
  },
  "/application/v6/applications/{app_id}/visibility/check_white_black_list": {
    POST: "application.visibility.checkWhiteBlackList"
  },
  "/application/v6/applications/{app_id}/visibility": {
    PATCH: "application.visibility.patch"
  },
  "/application/v6/applications/{app_id}/management": {
    PUT: "application.management.update"
  },
  "/application/v6/applications/{app_id}/app_usage/department_overview": {
    POST: "application.appUsage.departmentOverview"
  },
  "/application/v6/applications/{app_id}/app_usage/message_push_overview": {
    POST: "application.appUsage.messagePushOverview"
  },
  "/application/v6/applications/{app_id}/app_usage/overview": {
    POST: "application.appUsage.overview"
  },
  "/application/v6/applications/{app_id}/feedbacks/{feedback_id}": {
    PATCH: "application.feedback.patch"
  },
  "/application/v6/applications/{app_id}/feedbacks": {
    GET: { name: "application.feedback.list", pagination: { argIndex: 1, itemsKey: "feedback_list" } }
  },
  "/application/v6/app_badge/set": {
    POST: "application.appBadge.set"
  },
  "/application/v5/applications/favourite": {
    GET: { name: "application.favourite", pagination: { argIndex: 0, itemsKey: "app_list" } }
  },
  "/application/v5/applications/recommend": {
    GET: { name: "application.recommend", pagination: { argIndex: 0, itemsKey: "app_list" } }
  },
  "/application/v6/app_recommend_rules": {
    GET: { name: "application.appRecommendRule.list", pagination: { argIndex: 0, itemsKey: "rules" } }
  }
});

// src/types/approval.ts
var Approval;
((Approval2) => {
  let Instance;
  ((Instance2) => {
    let CreateRequestTitleDisplayMethod;
    ((CreateRequestTitleDisplayMethod2) => {
      CreateRequestTitleDisplayMethod2[CreateRequestTitleDisplayMethod2["DisplayAll"] = 0] = "DisplayAll";
      CreateRequestTitleDisplayMethod2[CreateRequestTitleDisplayMethod2["DisplayInstanceTitle"] = 1] = "DisplayInstanceTitle";
    })(CreateRequestTitleDisplayMethod = Instance2.CreateRequestTitleDisplayMethod || (Instance2.CreateRequestTitleDisplayMethod = {}));
    let AddSignRequestAddSignType;
    ((AddSignRequestAddSignType2) => {
      AddSignRequestAddSignType2[AddSignRequestAddSignType2["AddSignPre"] = 1] = "AddSignPre";
      AddSignRequestAddSignType2[AddSignRequestAddSignType2["AddSignPost"] = 2] = "AddSignPost";
      AddSignRequestAddSignType2[AddSignRequestAddSignType2["AddSignParallel"] = 3] = "AddSignParallel";
    })(AddSignRequestAddSignType = Instance2.AddSignRequestAddSignType || (Instance2.AddSignRequestAddSignType = {}));
    let AddSignRequestApprovalMethod;
    ((AddSignRequestApprovalMethod2) => {
      AddSignRequestApprovalMethod2[AddSignRequestApprovalMethod2["OrSign"] = 1] = "OrSign";
      AddSignRequestApprovalMethod2[AddSignRequestApprovalMethod2["AddSign"] = 2] = "AddSign";
      AddSignRequestApprovalMethod2[AddSignRequestApprovalMethod2["SequentialSign"] = 3] = "SequentialSign";
    })(AddSignRequestApprovalMethod = Instance2.AddSignRequestApprovalMethod || (Instance2.AddSignRequestApprovalMethod = {}));
  })(Instance = Approval2.Instance || (Approval2.Instance = {}));
  let Task;
  ((Task2) => {
    let SearchRequestOrder;
    ((SearchRequestOrder2) => {
      SearchRequestOrder2[SearchRequestOrder2["UpdateTimeDESC"] = 0] = "UpdateTimeDESC";
      SearchRequestOrder2[SearchRequestOrder2["UpdateTimeASC"] = 1] = "UpdateTimeASC";
      SearchRequestOrder2[SearchRequestOrder2["StartTimeDESC"] = 2] = "StartTimeDESC";
      SearchRequestOrder2[SearchRequestOrder2["StartTimeASC"] = 3] = "StartTimeASC";
    })(SearchRequestOrder = Task2.SearchRequestOrder || (Task2.SearchRequestOrder = {}));
  })(Task = Approval2.Task || (Approval2.Task = {}));
})(Approval || (Approval = {}));
Internal.define({
  "/approval/v4/approvals": {
    POST: "approval.create"
  },
  "/approval/v4/approvals/{approval_code}": {
    GET: "approval.get"
  },
  "/approval/v4/instances": {
    POST: "approval.instance.create"
  },
  "/approval/v4/instances/cancel": {
    POST: "approval.instance.cancel"
  },
  "/approval/v4/instances/cc": {
    POST: "approval.instance.cc"
  },
  "/approval/v4/instances/preview": {
    POST: "approval.instance.preview"
  },
  "/approval/v4/instances/{instance_id}": {
    GET: "approval.instance.get"
  },
  "/approval/v4/tasks/approve": {
    POST: "approval.task.approve"
  },
  "/approval/v4/tasks/reject": {
    POST: "approval.task.reject"
  },
  "/approval/v4/tasks/transfer": {
    POST: "approval.task.transfer"
  },
  "/approval/v4/instances/specified_rollback": {
    POST: "approval.instance.specifiedRollback"
  },
  "/approval/v4/instances/add_sign": {
    POST: "approval.instance.addSign"
  },
  "/approval/v4/tasks/resubmit": {
    POST: "approval.task.resubmit"
  },
  "/approval/v4/instances/{instance_id}/comments": {
    POST: "approval.instance.comment.create",
    GET: "approval.instance.comment.list"
  },
  "/approval/v4/instances/{instance_id}/comments/{comment_id}": {
    DELETE: "approval.instance.comment.delete"
  },
  "/approval/v4/instances/{instance_id}/comments/remove": {
    POST: "approval.instance.comment.remove"
  },
  "/approval/v4/external_approvals": {
    POST: "approval.externalApproval.create"
  },
  "/approval/v4/external_approvals/{approval_code}": {
    GET: "approval.externalApproval.get"
  },
  "/approval/v4/external_instances": {
    POST: "approval.externalInstance.create"
  },
  "/approval/v4/external_instances/check": {
    POST: "approval.externalInstance.check"
  },
  "/approval/v4/external_tasks": {
    GET: { name: "approval.externalTask.list", pagination: { argIndex: 1, itemsKey: "data" } }
  },
  "/approval/v4/instances/query": {
    POST: { name: "approval.instance.query", pagination: { argIndex: 1, itemsKey: "instance_list" } }
  },
  "/approval/v4/instances/search_cc": {
    POST: { name: "approval.instance.searchCc", pagination: { argIndex: 1, itemsKey: "cc_list" } }
  },
  "/approval/v4/tasks/search": {
    POST: { name: "approval.task.search", pagination: { argIndex: 1, itemsKey: "task_list" } }
  },
  "/approval/v4/tasks/query": {
    GET: { name: "approval.task.query", pagination: { argIndex: 0, itemsKey: "tasks" } }
  },
  "/approval/v4/approvals/{approval_code}/subscribe": {
    POST: "approval.subscribe"
  },
  "/approval/v4/approvals/{approval_code}/unsubscribe": {
    POST: "approval.unsubscribe"
  }
});

// src/types/attendance.ts
var Attendance;
((Attendance2) => {
  let UserApproval;
  ((UserApproval2) => {
    let QueryRequestStatus;
    ((QueryRequestStatus2) => {
      QueryRequestStatus2[QueryRequestStatus2["Todo"] = 0] = "Todo";
      QueryRequestStatus2[QueryRequestStatus2["Rejected"] = 1] = "Rejected";
      QueryRequestStatus2[QueryRequestStatus2["Approved"] = 2] = "Approved";
      QueryRequestStatus2[QueryRequestStatus2["Canceled"] = 3] = "Canceled";
      QueryRequestStatus2[QueryRequestStatus2["Reverted"] = 4] = "Reverted";
    })(QueryRequestStatus = UserApproval2.QueryRequestStatus || (UserApproval2.QueryRequestStatus = {}));
  })(UserApproval = Attendance2.UserApproval || (Attendance2.UserApproval = {}));
  let UserTaskRemedy;
  ((UserTaskRemedy2) => {
    let QueryRequestStatus;
    ((QueryRequestStatus2) => {
      QueryRequestStatus2[QueryRequestStatus2["Pending"] = 0] = "Pending";
      QueryRequestStatus2[QueryRequestStatus2["Rejected"] = 1] = "Rejected";
      QueryRequestStatus2[QueryRequestStatus2["Pass"] = 2] = "Pass";
      QueryRequestStatus2[QueryRequestStatus2["Cancel"] = 3] = "Cancel";
      QueryRequestStatus2[QueryRequestStatus2["Withdraw"] = 4] = "Withdraw";
    })(QueryRequestStatus = UserTaskRemedy2.QueryRequestStatus || (UserTaskRemedy2.QueryRequestStatus = {}));
  })(UserTaskRemedy = Attendance2.UserTaskRemedy || (Attendance2.UserTaskRemedy = {}));
  let UserFlow;
  ((UserFlow2) => {
    let GetResponseType;
    ((GetResponseType2) => {
      GetResponseType2[GetResponseType2["Self"] = 0] = "Self";
      GetResponseType2[GetResponseType2["ManagerModification"] = 1] = "ManagerModification";
      GetResponseType2[GetResponseType2["Remedy"] = 2] = "Remedy";
      GetResponseType2[GetResponseType2["System"] = 3] = "System";
      GetResponseType2[GetResponseType2["Free"] = 4] = "Free";
      GetResponseType2[GetResponseType2["Machine"] = 5] = "Machine";
      GetResponseType2[GetResponseType2["Quick"] = 6] = "Quick";
      GetResponseType2[GetResponseType2["Import"] = 7] = "Import";
    })(GetResponseType = UserFlow2.GetResponseType || (UserFlow2.GetResponseType = {}));
  })(UserFlow = Attendance2.UserFlow || (Attendance2.UserFlow = {}));
})(Attendance || (Attendance = {}));
Internal.define({
  "/attendance/v1/shifts": {
    POST: "attendance.shift.create",
    GET: { name: "attendance.shift.list", pagination: { argIndex: 0, itemsKey: "shift_list" } }
  },
  "/attendance/v1/shifts/{shift_id}": {
    DELETE: "attendance.shift.delete",
    GET: "attendance.shift.get"
  },
  "/attendance/v1/shifts/query": {
    POST: "attendance.shift.query"
  },
  "/attendance/v1/user_daily_shifts/batch_create": {
    POST: "attendance.userDailyShift.batchCreate"
  },
  "/attendance/v1/user_daily_shifts/query": {
    POST: "attendance.userDailyShift.query"
  },
  "/attendance/v1/user_daily_shifts/batch_create_temp": {
    POST: "attendance.userDailyShift.batchCreateTemp"
  },
  "/attendance/v1/groups/{group_id}/list_user": {
    GET: { name: "attendance.group.listUser", pagination: { argIndex: 1, itemsKey: "users" } }
  },
  "/attendance/v1/groups": {
    POST: "attendance.group.create",
    GET: { name: "attendance.group.list", pagination: { argIndex: 0, itemsKey: "group_list" } }
  },
  "/attendance/v1/groups/{group_id}": {
    DELETE: "attendance.group.delete",
    GET: "attendance.group.get"
  },
  "/attendance/v1/groups/search": {
    POST: "attendance.group.search"
  },
  "/attendance/v1/user_settings/modify": {
    POST: "attendance.userSetting.modify"
  },
  "/attendance/v1/user_settings/query": {
    GET: "attendance.userSetting.query"
  },
  "/attendance/v1/files/upload": {
    POST: { name: "attendance.file.upload", multipart: true }
  },
  "/attendance/v1/files/{file_id}/download": {
    GET: { name: "attendance.file.download", type: "binary" }
  },
  "/attendance/v1/user_stats_views/{user_stats_view_id}": {
    PUT: "attendance.userStatsView.update"
  },
  "/attendance/v1/user_stats_fields/query": {
    POST: "attendance.userStatsField.query"
  },
  "/attendance/v1/user_stats_views/query": {
    POST: "attendance.userStatsView.query"
  },
  "/attendance/v1/user_stats_datas/query": {
    POST: "attendance.userStatsData.query"
  },
  "/attendance/v1/user_approvals/query": {
    POST: "attendance.userApproval.query"
  },
  "/attendance/v1/user_approvals": {
    POST: "attendance.userApproval.create"
  },
  "/attendance/v1/approval_infos/process": {
    POST: "attendance.approvalInfo.process"
  },
  "/attendance/v1/user_task_remedys": {
    POST: "attendance.userTaskRemedy.create"
  },
  "/attendance/v1/user_task_remedys/query_user_allowed_remedys": {
    POST: "attendance.userTaskRemedy.queryUserAllowedRemedys"
  },
  "/attendance/v1/user_task_remedys/query": {
    POST: "attendance.userTaskRemedy.query"
  },
  "/attendance/v1/archive_rule/user_stats_fields_query": {
    POST: "attendance.archiveRule.userStatsFieldsQuery"
  },
  "/attendance/v1/archive_rule/upload_report": {
    POST: "attendance.archiveRule.uploadReport"
  },
  "/attendance/v1/archive_rule/del_report": {
    POST: "attendance.archiveRule.delReport"
  },
  "/attendance/v1/archive_rule": {
    GET: { name: "attendance.archiveRule.list", pagination: { argIndex: 0 } }
  },
  "/attendance/v1/user_flows/batch_create": {
    POST: "attendance.userFlow.batchCreate"
  },
  "/attendance/v1/user_flows/{user_flow_id}": {
    GET: "attendance.userFlow.get"
  },
  "/attendance/v1/user_flows/query": {
    POST: "attendance.userFlow.query"
  },
  "/attendance/v1/user_flows/batch_del": {
    POST: "attendance.userFlow.batchDel"
  },
  "/attendance/v1/user_tasks/query": {
    POST: "attendance.userTask.query"
  },
  "/attendance/v1/leave_employ_expire_records/{leave_id}": {
    GET: "attendance.leaveEmployExpireRecord.get"
  },
  "/attendance/v1/leave_accrual_record/{leave_id}": {
    PATCH: "attendance.leaveAccrualRecord.patch"
  }
});

// src/types/auth.ts
Internal.define({
  "/auth/v3/tenant_access_token/internal": {
    POST: { name: "auth.tenantAccessTokenInternal", type: "raw-json" }
  },
  "/auth/v3/app_access_token/internal": {
    POST: { name: "auth.appAccessTokenInternal", type: "raw-json" }
  },
  "/auth/v3/app_ticket/resend": {
    POST: "auth.appTicketResend"
  },
  "/auth/v3/app_access_token": {
    POST: { name: "auth.appAccessToken", type: "raw-json" }
  },
  "/auth/v3/tenant_access_token": {
    POST: { name: "auth.tenantAccessToken", type: "raw-json" }
  }
});

// src/types/authen.ts
Internal.define({
  "/authen/v1/user_info": {
    GET: "authen.userInfo.get"
  },
  "/authen/v1/oidc/access_token": {
    POST: "authen.oidc.accessToken.create"
  },
  "/authen/v1/oidc/refresh_access_token": {
    POST: "authen.oidc.refreshAccessToken.create"
  },
  "/authen/v1/access_token": {
    POST: "authen.accessToken.create"
  },
  "/authen/v1/refresh_access_token": {
    POST: "authen.refreshAccessToken.create"
  }
});

// src/types/baike.ts
Internal.define({
  "/baike/v1/drafts": {
    POST: "baike.draft.create"
  },
  "/baike/v1/drafts/{draft_id}": {
    PUT: "baike.draft.update"
  },
  "/baike/v1/entities": {
    POST: "baike.entity.create",
    GET: { name: "baike.entity.list", pagination: { argIndex: 0, itemsKey: "entities" } }
  },
  "/baike/v1/entities/{entity_id}": {
    PUT: "baike.entity.update",
    GET: "baike.entity.get"
  },
  "/baike/v1/entities/match": {
    POST: "baike.entity.match"
  },
  "/baike/v1/entities/search": {
    POST: { name: "baike.entity.search", pagination: { argIndex: 1, itemsKey: "entities" } }
  },
  "/baike/v1/entities/highlight": {
    POST: "baike.entity.highlight"
  },
  "/baike/v1/entities/extract": {
    POST: "baike.entity.extract"
  },
  "/baike/v1/classifications": {
    GET: { name: "baike.classification.list", pagination: { argIndex: 0 } }
  },
  "/baike/v1/files/upload": {
    POST: { name: "baike.file.upload", multipart: true }
  },
  "/baike/v1/files/{file_token}/download": {
    GET: { name: "baike.file.download", type: "binary" }
  }
});

// src/types/base.ts
Internal.define({
  "/base/v2/apps/{app_token}/roles": {
    POST: "base.app.role.create",
    GET: { name: "base.app.role.list", pagination: { argIndex: 1 } }
  },
  "/base/v2/apps/{app_token}/roles/{role_id}": {
    PUT: "base.app.role.update"
  }
});

// src/types/bitable.ts
var Bitable;
((Bitable2) => {
  let App;
  ((App2) => {
    let Table;
    ((Table2) => {
      let Field;
      ((Field2) => {
        let CreateRequestType;
        ((CreateRequestType2) => {
          CreateRequestType2[CreateRequestType2["Text"] = 1] = "Text";
          CreateRequestType2[CreateRequestType2["Number"] = 2] = "Number";
          CreateRequestType2[CreateRequestType2["SingleSelect"] = 3] = "SingleSelect";
          CreateRequestType2[CreateRequestType2["MultiSelect"] = 4] = "MultiSelect";
          CreateRequestType2[CreateRequestType2["DateTime"] = 5] = "DateTime";
          CreateRequestType2[CreateRequestType2["Checkbox"] = 7] = "Checkbox";
          CreateRequestType2[CreateRequestType2["User"] = 11] = "User";
          CreateRequestType2[CreateRequestType2["PhoneNumber"] = 13] = "PhoneNumber";
          CreateRequestType2[CreateRequestType2["Url"] = 15] = "Url";
          CreateRequestType2[CreateRequestType2["Attachment"] = 17] = "Attachment";
          CreateRequestType2[CreateRequestType2["Link"] = 18] = "Link";
          CreateRequestType2[CreateRequestType2["Formula"] = 20] = "Formula";
          CreateRequestType2[CreateRequestType2["DuplexLink"] = 21] = "DuplexLink";
          CreateRequestType2[CreateRequestType2["Location"] = 22] = "Location";
          CreateRequestType2[CreateRequestType2["GroupChat"] = 23] = "GroupChat";
          CreateRequestType2[CreateRequestType2["CreatedTime"] = 1001] = "CreatedTime";
          CreateRequestType2[CreateRequestType2["ModifiedTime"] = 1002] = "ModifiedTime";
          CreateRequestType2[CreateRequestType2["CreatedUser"] = 1003] = "CreatedUser";
          CreateRequestType2[CreateRequestType2["ModifiedUser"] = 1004] = "ModifiedUser";
          CreateRequestType2[CreateRequestType2["AutoSerial"] = 1005] = "AutoSerial";
        })(CreateRequestType = Field2.CreateRequestType || (Field2.CreateRequestType = {}));
        let UpdateRequestType;
        ((UpdateRequestType2) => {
          UpdateRequestType2[UpdateRequestType2["Text"] = 1] = "Text";
          UpdateRequestType2[UpdateRequestType2["Number"] = 2] = "Number";
          UpdateRequestType2[UpdateRequestType2["SingleSelect"] = 3] = "SingleSelect";
          UpdateRequestType2[UpdateRequestType2["MultiSelect"] = 4] = "MultiSelect";
          UpdateRequestType2[UpdateRequestType2["DateTime"] = 5] = "DateTime";
          UpdateRequestType2[UpdateRequestType2["Checkbox"] = 7] = "Checkbox";
          UpdateRequestType2[UpdateRequestType2["User"] = 11] = "User";
          UpdateRequestType2[UpdateRequestType2["PhoneNumber"] = 13] = "PhoneNumber";
          UpdateRequestType2[UpdateRequestType2["Url"] = 15] = "Url";
          UpdateRequestType2[UpdateRequestType2["Attachment"] = 17] = "Attachment";
          UpdateRequestType2[UpdateRequestType2["Link"] = 18] = "Link";
          UpdateRequestType2[UpdateRequestType2["Formula"] = 20] = "Formula";
          UpdateRequestType2[UpdateRequestType2["DuplexLink"] = 21] = "DuplexLink";
          UpdateRequestType2[UpdateRequestType2["Location"] = 22] = "Location";
          UpdateRequestType2[UpdateRequestType2["GroupChat"] = 23] = "GroupChat";
          UpdateRequestType2[UpdateRequestType2["CreatedTime"] = 1001] = "CreatedTime";
          UpdateRequestType2[UpdateRequestType2["ModifiedTime"] = 1002] = "ModifiedTime";
          UpdateRequestType2[UpdateRequestType2["CreatedUser"] = 1003] = "CreatedUser";
          UpdateRequestType2[UpdateRequestType2["ModifiedUser"] = 1004] = "ModifiedUser";
          UpdateRequestType2[UpdateRequestType2["AutoSerial"] = 1005] = "AutoSerial";
        })(UpdateRequestType = Field2.UpdateRequestType || (Field2.UpdateRequestType = {}));
      })(Field = Table2.Field || (Table2.Field = {}));
    })(Table = App2.Table || (App2.Table = {}));
  })(App = Bitable2.App || (Bitable2.App = {}));
})(Bitable || (Bitable = {}));
Internal.define({
  "/bitable/v1/apps": {
    POST: "bitable.app.create"
  },
  "/bitable/v1/apps/{app_token}/copy": {
    POST: "bitable.app.copy"
  },
  "/bitable/v1/apps/{app_token}": {
    GET: "bitable.app.get",
    PUT: "bitable.app.update"
  },
  "/bitable/v1/apps/{app_token}/tables": {
    POST: "bitable.app.table.create",
    GET: { name: "bitable.app.table.list", pagination: { argIndex: 1 } }
  },
  "/bitable/v1/apps/{app_token}/tables/batch_create": {
    POST: "bitable.app.table.batchCreate"
  },
  "/bitable/v1/apps/{app_token}/tables/{table_id}": {
    PATCH: "bitable.app.table.patch",
    DELETE: "bitable.app.table.delete"
  },
  "/bitable/v1/apps/{app_token}/tables/batch_delete": {
    POST: "bitable.app.table.batchDelete"
  },
  "/bitable/v1/apps/{app_token}/tables/{table_id}/views": {
    POST: "bitable.app.table.view.create",
    GET: { name: "bitable.app.table.view.list", pagination: { argIndex: 2 } }
  },
  "/bitable/v1/apps/{app_token}/tables/{table_id}/views/{view_id}": {
    PATCH: "bitable.app.table.view.patch",
    GET: "bitable.app.table.view.get",
    DELETE: "bitable.app.table.view.delete"
  },
  "/bitable/v1/apps/{app_token}/tables/{table_id}/records": {
    POST: "bitable.app.table.record.create",
    GET: { name: "bitable.app.table.record.list", pagination: { argIndex: 2 } }
  },
  "/bitable/v1/apps/{app_token}/tables/{table_id}/records/{record_id}": {
    PUT: "bitable.app.table.record.update",
    DELETE: "bitable.app.table.record.delete",
    GET: "bitable.app.table.record.get"
  },
  "/bitable/v1/apps/{app_token}/tables/{table_id}/records/search": {
    POST: { name: "bitable.app.table.record.search", pagination: { argIndex: 3 } }
  },
  "/bitable/v1/apps/{app_token}/tables/{table_id}/records/batch_create": {
    POST: "bitable.app.table.record.batchCreate"
  },
  "/bitable/v1/apps/{app_token}/tables/{table_id}/records/batch_update": {
    POST: "bitable.app.table.record.batchUpdate"
  },
  "/bitable/v1/apps/{app_token}/tables/{table_id}/records/batch_get": {
    POST: "bitable.app.table.record.batchGet"
  },
  "/bitable/v1/apps/{app_token}/tables/{table_id}/records/batch_delete": {
    POST: "bitable.app.table.record.batchDelete"
  },
  "/bitable/v1/apps/{app_token}/tables/{table_id}/fields": {
    POST: "bitable.app.table.field.create",
    GET: { name: "bitable.app.table.field.list", pagination: { argIndex: 2 } }
  },
  "/bitable/v1/apps/{app_token}/tables/{table_id}/fields/{field_id}": {
    PUT: "bitable.app.table.field.update",
    DELETE: "bitable.app.table.field.delete"
  },
  "/bitable/v1/apps/{app_token}/dashboards/{block_id}/copy": {
    POST: "bitable.app.dashboard.copy"
  },
  "/bitable/v1/apps/{app_token}/dashboards": {
    GET: { name: "bitable.app.dashboard.list", pagination: { argIndex: 1, itemsKey: "dashboards" } }
  },
  "/bitable/v1/apps/{app_token}/tables/{table_id}/forms/{form_id}": {
    PATCH: "bitable.app.table.form.patch",
    GET: "bitable.app.table.form.get"
  },
  "/bitable/v1/apps/{app_token}/tables/{table_id}/forms/{form_id}/fields/{field_id}": {
    PATCH: "bitable.app.table.form.field.patch"
  },
  "/bitable/v1/apps/{app_token}/tables/{table_id}/forms/{form_id}/fields": {
    GET: { name: "bitable.app.table.form.field.list", pagination: { argIndex: 3 } }
  },
  "/bitable/v1/apps/{app_token}/roles/{role_id}": {
    DELETE: "bitable.app.role.delete",
    PUT: "bitable.app.role.update"
  },
  "/bitable/v1/apps/{app_token}/roles/{role_id}/members": {
    POST: "bitable.app.role.member.create",
    GET: { name: "bitable.app.role.member.list", pagination: { argIndex: 2 } }
  },
  "/bitable/v1/apps/{app_token}/roles/{role_id}/members/batch_create": {
    POST: "bitable.app.role.member.batchCreate"
  },
  "/bitable/v1/apps/{app_token}/roles/{role_id}/members/{member_id}": {
    DELETE: "bitable.app.role.member.delete"
  },
  "/bitable/v1/apps/{app_token}/roles/{role_id}/members/batch_delete": {
    POST: "bitable.app.role.member.batchDelete"
  },
  "/bitable/v1/apps/{app_token}/workflows": {
    GET: "bitable.app.workflow.list"
  },
  "/bitable/v1/apps/{app_token}/workflows/{workflow_id}": {
    PUT: "bitable.app.workflow.update"
  },
  "/bitable/v1/apps/{app_token}/roles": {
    POST: "bitable.app.role.create",
    GET: { name: "bitable.app.role.list", pagination: { argIndex: 1 } }
  }
});

// src/types/board.ts
Internal.define({
  "/board/v1/whiteboards/{whiteboard_id}/theme": {
    GET: "board.whiteboard.theme"
  },
  "/board/v1/whiteboards/{whiteboard_id}/update_theme": {
    POST: "board.whiteboard.updateTheme"
  },
  "/board/v1/whiteboards/{whiteboard_id}/download_as_image": {
    GET: { name: "board.whiteboard.downloadAsImage", type: "binary" }
  },
  "/board/v1/whiteboards/{whiteboard_id}/nodes/plantuml": {
    POST: "board.whiteboard.node.createPlantuml"
  },
  "/board/v1/whiteboards/{whiteboard_id}/nodes": {
    POST: "board.whiteboard.node.create",
    GET: "board.whiteboard.node.list"
  }
});

// src/types/calendar.ts
Internal.define({
  "/calendar/v4/calendars": {
    POST: "calendar.create",
    GET: "calendar.list"
  },
  "/calendar/v4/calendars/{calendar_id}": {
    DELETE: "calendar.delete",
    GET: "calendar.get",
    PATCH: "calendar.patch"
  },
  "/calendar/v4/calendars/primary": {
    POST: "calendar.primary"
  },
  "/calendar/v4/calendars/primarys": {
    POST: "calendar.primarys"
  },
  "/calendar/v4/calendars/mget": {
    POST: "calendar.mget"
  },
  "/calendar/v4/freebusy/list": {
    POST: "calendar.freebusy.list"
  },
  "/calendar/v4/freebusy/batch": {
    POST: "calendar.freebusy.batch"
  },
  "/calendar/v4/calendars/search": {
    POST: { name: "calendar.search", pagination: { argIndex: 1 } }
  },
  "/calendar/v4/calendars/{calendar_id}/subscribe": {
    POST: "calendar.subscribe"
  },
  "/calendar/v4/calendars/{calendar_id}/unsubscribe": {
    POST: "calendar.unsubscribe"
  },
  "/calendar/v4/calendars/subscription": {
    POST: "calendar.subscription"
  },
  "/calendar/v4/calendars/unsubscription": {
    POST: "calendar.unsubscription"
  },
  "/calendar/v4/calendars/{calendar_id}/acls": {
    POST: "calendar.acl.create",
    GET: { name: "calendar.acl.list", pagination: { argIndex: 1, itemsKey: "acls" } }
  },
  "/calendar/v4/calendars/{calendar_id}/acls/{acl_id}": {
    DELETE: "calendar.acl.delete"
  },
  "/calendar/v4/calendars/{calendar_id}/acls/subscription": {
    POST: "calendar.acl.subscription"
  },
  "/calendar/v4/calendars/{calendar_id}/acls/unsubscription": {
    POST: "calendar.acl.unsubscription"
  },
  "/calendar/v4/calendars/{calendar_id}/events": {
    POST: "calendar.event.create",
    GET: "calendar.event.list"
  },
  "/calendar/v4/calendars/{calendar_id}/events/{event_id}": {
    DELETE: "calendar.event.delete",
    PATCH: "calendar.event.patch",
    GET: "calendar.event.get"
  },
  "/calendar/v4/calendars/{calendar_id}/events/search": {
    POST: { name: "calendar.event.search", pagination: { argIndex: 2 } }
  },
  "/calendar/v4/calendars/{calendar_id}/events/subscription": {
    POST: "calendar.event.subscription"
  },
  "/calendar/v4/calendars/{calendar_id}/events/unsubscription": {
    POST: "calendar.event.unsubscription"
  },
  "/calendar/v4/calendars/{calendar_id}/events/{event_id}/reply": {
    POST: "calendar.event.reply"
  },
  "/calendar/v4/calendars/{calendar_id}/events/{event_id}/instances": {
    GET: { name: "calendar.event.instances", pagination: { argIndex: 2 } }
  },
  "/calendar/v4/calendars/{calendar_id}/events/instance_view": {
    GET: "calendar.event.instanceView"
  },
  "/calendar/v4/calendars/{calendar_id}/events/{event_id}/meeting_chat": {
    POST: "calendar.event.meetingChat.create",
    DELETE: "calendar.event.meetingChat.delete"
  },
  "/calendar/v4/calendars/{calendar_id}/events/{event_id}/meeting_minute": {
    POST: "calendar.event.meetingMinute.create"
  },
  "/calendar/v4/timeoff_events": {
    POST: "calendar.timeoffEvent.create"
  },
  "/calendar/v4/timeoff_events/{timeoff_event_id}": {
    DELETE: "calendar.timeoffEvent.delete"
  },
  "/calendar/v4/calendars/{calendar_id}/events/{event_id}/attendees": {
    POST: "calendar.event.attendee.create",
    GET: { name: "calendar.event.attendee.list", pagination: { argIndex: 2 } }
  },
  "/calendar/v4/calendars/{calendar_id}/events/{event_id}/attendees/batch_delete": {
    POST: "calendar.event.attendee.batchDelete"
  },
  "/calendar/v4/calendars/{calendar_id}/events/{event_id}/attendees/{attendee_id}/chat_members": {
    GET: { name: "calendar.event.attendee.chatMember.list", pagination: { argIndex: 3 } }
  },
  "/calendar/v4/settings/generate_caldav_conf": {
    POST: "calendar.setting.generateCaldavConf"
  },
  "/calendar/v4/exchange_bindings": {
    POST: "calendar.exchangeBinding.create"
  },
  "/calendar/v4/exchange_bindings/{exchange_binding_id}": {
    DELETE: "calendar.exchangeBinding.delete",
    GET: "calendar.exchangeBinding.get"
  }
});

// src/types/cardkit.ts
Internal.define({
  "/cardkit/v1/cards": {
    POST: "cardkit.card.create"
  },
  "/cardkit/v1/cards/{card_id}/settings": {
    PATCH: "cardkit.card.settings"
  },
  "/cardkit/v1/cards/{card_id}/batch_update": {
    POST: "cardkit.card.batchUpdate"
  },
  "/cardkit/v1/cards/{card_id}": {
    PUT: "cardkit.card.update"
  },
  "/cardkit/v1/cards/{card_id}/elements": {
    POST: "cardkit.card.element.create"
  },
  "/cardkit/v1/cards/{card_id}/elements/{element_id}": {
    PUT: "cardkit.card.element.update",
    PATCH: "cardkit.card.element.patch",
    DELETE: "cardkit.card.element.delete"
  },
  "/cardkit/v1/cards/{card_id}/elements/{element_id}/content": {
    PUT: "cardkit.card.element.content"
  },
  "/cardkit/v1/cards/id_convert": {
    POST: "cardkit.card.idConvert"
  }
});

// src/types/compensation.ts
Internal.define({
  "/compensation/v1/archives": {
    POST: "compensation.archive.create"
  },
  "/compensation/v1/archives/query": {
    POST: { name: "compensation.archive.query", pagination: { argIndex: 1 } }
  },
  "/compensation/v1/items": {
    GET: { name: "compensation.item.list", pagination: { argIndex: 0 } }
  },
  "/compensation/v1/indicators": {
    GET: { name: "compensation.indicator.list", pagination: { argIndex: 0 } }
  },
  "/compensation/v1/item_categories": {
    GET: { name: "compensation.itemCategory.list", pagination: { argIndex: 0 } }
  },
  "/compensation/v1/plans": {
    GET: { name: "compensation.plan.list", pagination: { argIndex: 0 } }
  },
  "/compensation/v1/change_reasons": {
    GET: { name: "compensation.changeReason.list", pagination: { argIndex: 0 } }
  },
  "/compensation/v1/social_insurances": {
    GET: "compensation.socialInsurance.list"
  },
  "/compensation/v1/social_plans/query": {
    POST: "compensation.socialPlan.query"
  },
  "/compensation/v1/social_plans": {
    GET: { name: "compensation.socialPlan.list", pagination: { argIndex: 0, itemsKey: "plans" } }
  },
  "/compensation/v1/social_archive_adjust_record/query": {
    POST: "compensation.socialArchiveAdjustRecord.query"
  },
  "/compensation/v1/social_archive/query": {
    POST: "compensation.socialArchive.query"
  },
  "/compensation/v1/lump_sum_payment/batch_create": {
    POST: "compensation.lumpSumPayment.batchCreate"
  },
  "/compensation/v1/lump_sum_payment/batch_update": {
    POST: "compensation.lumpSumPayment.batchUpdate"
  },
  "/compensation/v1/lump_sum_payment/query": {
    POST: { name: "compensation.lumpSumPayment.query", pagination: { argIndex: 1, itemsKey: "records" } }
  },
  "/compensation/v1/lump_sum_payment/query_detail": {
    POST: { name: "compensation.lumpSumPayment.queryDetail", pagination: { argIndex: 1, itemsKey: "records" } }
  },
  "/compensation/v1/lump_sum_payment/batch_remove": {
    POST: "compensation.lumpSumPayment.batchRemove"
  },
  "/compensation/v1/recurring_payment/query": {
    POST: { name: "compensation.recurringPayment.query", pagination: { argIndex: 1, itemsKey: "records" } }
  },
  "/compensation/v1/recurring_payment/batch_update": {
    POST: "compensation.recurringPayment.batchUpdate"
  },
  "/compensation/v1/recurring_payment/batch_remove": {
    POST: "compensation.recurringPayment.batchRemove"
  },
  "/compensation/v1/recurring_payment/batch_create": {
    POST: "compensation.recurringPayment.batchCreate"
  }
});

// src/types/contact.ts
var Contact;
((Contact2) => {
  let User;
  ((User2) => {
    let CreateRequestGender;
    ((CreateRequestGender2) => {
      CreateRequestGender2[CreateRequestGender2["Unkown"] = 0] = "Unkown";
      CreateRequestGender2[CreateRequestGender2["Male"] = 1] = "Male";
      CreateRequestGender2[CreateRequestGender2["Female"] = 2] = "Female";
      CreateRequestGender2[CreateRequestGender2["Others"] = 3] = "Others";
    })(CreateRequestGender = User2.CreateRequestGender || (User2.CreateRequestGender = {}));
    let PatchRequestGender;
    ((PatchRequestGender2) => {
      PatchRequestGender2[PatchRequestGender2["Unkown"] = 0] = "Unkown";
      PatchRequestGender2[PatchRequestGender2["Male"] = 1] = "Male";
      PatchRequestGender2[PatchRequestGender2["Female"] = 2] = "Female";
      PatchRequestGender2[PatchRequestGender2["Others"] = 3] = "Others";
    })(PatchRequestGender = User2.PatchRequestGender || (User2.PatchRequestGender = {}));
    let UpdateRequestGender;
    ((UpdateRequestGender2) => {
      UpdateRequestGender2[UpdateRequestGender2["Unkown"] = 0] = "Unkown";
      UpdateRequestGender2[UpdateRequestGender2["Male"] = 1] = "Male";
      UpdateRequestGender2[UpdateRequestGender2["Female"] = 2] = "Female";
      UpdateRequestGender2[UpdateRequestGender2["Others"] = 3] = "Others";
    })(UpdateRequestGender = User2.UpdateRequestGender || (User2.UpdateRequestGender = {}));
  })(User = Contact2.User || (Contact2.User = {}));
  let Group;
  ((Group2) => {
    let CreateRequestType;
    ((CreateRequestType2) => {
      CreateRequestType2[CreateRequestType2["Assign"] = 1] = "Assign";
      CreateRequestType2[CreateRequestType2["Dynamic"] = 2] = "Dynamic";
    })(CreateRequestType = Group2.CreateRequestType || (Group2.CreateRequestType = {}));
    let SimplelistQueryType;
    ((SimplelistQueryType2) => {
      SimplelistQueryType2[SimplelistQueryType2["Assign"] = 1] = "Assign";
      SimplelistQueryType2[SimplelistQueryType2["Dynamic"] = 2] = "Dynamic";
    })(SimplelistQueryType = Group2.SimplelistQueryType || (Group2.SimplelistQueryType = {}));
    let MemberBelongQueryGroupType;
    ((MemberBelongQueryGroupType2) => {
      MemberBelongQueryGroupType2[MemberBelongQueryGroupType2["Assign"] = 1] = "Assign";
      MemberBelongQueryGroupType2[MemberBelongQueryGroupType2["Dynamic"] = 2] = "Dynamic";
    })(MemberBelongQueryGroupType = Group2.MemberBelongQueryGroupType || (Group2.MemberBelongQueryGroupType = {}));
  })(Group = Contact2.Group || (Contact2.Group = {}));
  let EmployeeTypeEnum;
  ((EmployeeTypeEnum2) => {
    let CreateRequestEnumType;
    ((CreateRequestEnumType2) => {
      CreateRequestEnumType2[CreateRequestEnumType2["Defualt"] = 1] = "Defualt";
      CreateRequestEnumType2[CreateRequestEnumType2["Custom"] = 2] = "Custom";
    })(CreateRequestEnumType = EmployeeTypeEnum2.CreateRequestEnumType || (EmployeeTypeEnum2.CreateRequestEnumType = {}));
    let CreateRequestEnumStatus;
    ((CreateRequestEnumStatus2) => {
      CreateRequestEnumStatus2[CreateRequestEnumStatus2["Active"] = 1] = "Active";
      CreateRequestEnumStatus2[CreateRequestEnumStatus2["Inactive"] = 2] = "Inactive";
    })(CreateRequestEnumStatus = EmployeeTypeEnum2.CreateRequestEnumStatus || (EmployeeTypeEnum2.CreateRequestEnumStatus = {}));
    let UpdateRequestEnumType;
    ((UpdateRequestEnumType2) => {
      UpdateRequestEnumType2[UpdateRequestEnumType2["Defualt"] = 1] = "Defualt";
      UpdateRequestEnumType2[UpdateRequestEnumType2["Custom"] = 2] = "Custom";
    })(UpdateRequestEnumType = EmployeeTypeEnum2.UpdateRequestEnumType || (EmployeeTypeEnum2.UpdateRequestEnumType = {}));
    let UpdateRequestEnumStatus;
    ((UpdateRequestEnumStatus2) => {
      UpdateRequestEnumStatus2[UpdateRequestEnumStatus2["Active"] = 1] = "Active";
      UpdateRequestEnumStatus2[UpdateRequestEnumStatus2["Inactive"] = 2] = "Inactive";
    })(UpdateRequestEnumStatus = EmployeeTypeEnum2.UpdateRequestEnumStatus || (EmployeeTypeEnum2.UpdateRequestEnumStatus = {}));
  })(EmployeeTypeEnum = Contact2.EmployeeTypeEnum || (Contact2.EmployeeTypeEnum = {}));
})(Contact || (Contact = {}));
Internal.define({
  "/contact/v3/scopes": {
    GET: "contact.scope.list"
  },
  "/contact/v3/users": {
    POST: "contact.user.create",
    GET: { name: "contact.user.list", pagination: { argIndex: 0 } }
  },
  "/contact/v3/users/{user_id}": {
    PATCH: "contact.user.patch",
    GET: "contact.user.get",
    DELETE: "contact.user.delete",
    PUT: "contact.user.update"
  },
  "/contact/v3/users/{user_id}/update_user_id": {
    PATCH: "contact.user.updateUserId"
  },
  "/contact/v3/users/batch": {
    GET: "contact.user.batch"
  },
  "/contact/v3/users/find_by_department": {
    GET: { name: "contact.user.findByDepartment", pagination: { argIndex: 0 } }
  },
  "/contact/v3/users/batch_get_id": {
    POST: "contact.user.batchGetId"
  },
  "/contact/v3/users/{user_id}/resurrect": {
    POST: "contact.user.resurrect"
  },
  "/contact/v3/group": {
    POST: "contact.group.create"
  },
  "/contact/v3/group/{group_id}": {
    PATCH: "contact.group.patch",
    GET: "contact.group.get",
    DELETE: "contact.group.delete"
  },
  "/contact/v3/group/simplelist": {
    GET: { name: "contact.group.simplelist", pagination: { argIndex: 0, itemsKey: "grouplist" } }
  },
  "/contact/v3/group/member_belong": {
    GET: { name: "contact.group.memberBelong", pagination: { argIndex: 0, itemsKey: "group_list" } }
  },
  "/contact/v3/custom_attrs": {
    GET: { name: "contact.customAttr.list", pagination: { argIndex: 0 } }
  },
  "/contact/v3/employee_type_enums": {
    POST: "contact.employeeTypeEnum.create",
    GET: { name: "contact.employeeTypeEnum.list", pagination: { argIndex: 0 } }
  },
  "/contact/v3/employee_type_enums/{enum_id}": {
    PUT: "contact.employeeTypeEnum.update",
    DELETE: "contact.employeeTypeEnum.delete"
  },
  "/contact/v3/departments": {
    POST: "contact.department.create",
    GET: { name: "contact.department.list", pagination: { argIndex: 0 } }
  },
  "/contact/v3/departments/{department_id}": {
    PATCH: "contact.department.patch",
    PUT: "contact.department.update",
    GET: "contact.department.get",
    DELETE: "contact.department.delete"
  },
  "/contact/v3/departments/{department_id}/update_department_id": {
    PATCH: "contact.department.updateDepartmentId"
  },
  "/contact/v3/departments/unbind_department_chat": {
    POST: "contact.department.unbindDepartmentChat"
  },
  "/contact/v3/departments/batch": {
    GET: "contact.department.batch"
  },
  "/contact/v3/departments/{department_id}/children": {
    GET: { name: "contact.department.children", pagination: { argIndex: 1 } }
  },
  "/contact/v3/departments/parent": {
    GET: { name: "contact.department.parent", pagination: { argIndex: 0 } }
  },
  "/contact/v3/departments/search": {
    POST: { name: "contact.department.search", pagination: { argIndex: 1 } }
  },
  "/contact/v3/unit": {
    POST: "contact.unit.create",
    GET: { name: "contact.unit.list", pagination: { argIndex: 0, itemsKey: "unitlist" } }
  },
  "/contact/v3/unit/{unit_id}": {
    PATCH: "contact.unit.patch",
    GET: "contact.unit.get",
    DELETE: "contact.unit.delete"
  },
  "/contact/v3/unit/bind_department": {
    POST: "contact.unit.bindDepartment"
  },
  "/contact/v3/unit/unbind_department": {
    POST: "contact.unit.unbindDepartment"
  },
  "/contact/v3/unit/list_department": {
    GET: { name: "contact.unit.listDepartment", pagination: { argIndex: 0, itemsKey: "departmentlist" } }
  },
  "/contact/v3/group/{group_id}/member/add": {
    POST: "contact.group.member.add"
  },
  "/contact/v3/group/{group_id}/member/batch_add": {
    POST: "contact.group.member.batchAdd"
  },
  "/contact/v3/group/{group_id}/member/simplelist": {
    GET: { name: "contact.group.member.simplelist", pagination: { argIndex: 1, itemsKey: "memberlist" } }
  },
  "/contact/v3/group/{group_id}/member/remove": {
    POST: "contact.group.member.remove"
  },
  "/contact/v3/group/{group_id}/member/batch_remove": {
    POST: "contact.group.member.batchRemove"
  },
  "/contact/v3/functional_roles": {
    POST: "contact.functionalRole.create"
  },
  "/contact/v3/functional_roles/{role_id}": {
    PUT: "contact.functionalRole.update",
    DELETE: "contact.functionalRole.delete"
  },
  "/contact/v3/functional_roles/{role_id}/members/batch_create": {
    POST: "contact.functionalRole.member.batchCreate"
  },
  "/contact/v3/functional_roles/{role_id}/members/scopes": {
    PATCH: "contact.functionalRole.member.scopes"
  },
  "/contact/v3/functional_roles/{role_id}/members/{member_id}": {
    GET: "contact.functionalRole.member.get"
  },
  "/contact/v3/functional_roles/{role_id}/members": {
    GET: { name: "contact.functionalRole.member.list", pagination: { argIndex: 1, itemsKey: "members" } }
  },
  "/contact/v3/functional_roles/{role_id}/members/batch_delete": {
    PATCH: "contact.functionalRole.member.batchDelete"
  },
  "/contact/v3/job_levels": {
    POST: "contact.jobLevel.create",
    GET: { name: "contact.jobLevel.list", pagination: { argIndex: 0 } }
  },
  "/contact/v3/job_levels/{job_level_id}": {
    PUT: "contact.jobLevel.update",
    GET: "contact.jobLevel.get",
    DELETE: "contact.jobLevel.delete"
  },
  "/contact/v3/job_families": {
    POST: "contact.jobFamily.create",
    GET: { name: "contact.jobFamily.list", pagination: { argIndex: 0 } }
  },
  "/contact/v3/job_families/{job_family_id}": {
    PUT: "contact.jobFamily.update",
    GET: "contact.jobFamily.get",
    DELETE: "contact.jobFamily.delete"
  },
  "/contact/v3/job_titles/{job_title_id}": {
    GET: "contact.jobTitle.get"
  },
  "/contact/v3/job_titles": {
    GET: { name: "contact.jobTitle.list", pagination: { argIndex: 0 } }
  },
  "/contact/v3/work_cities/{work_city_id}": {
    GET: "contact.workCity.get"
  },
  "/contact/v3/work_cities": {
    GET: { name: "contact.workCity.list", pagination: { argIndex: 0 } }
  }
});

// src/types/corehr.ts
var Corehr;
((Corehr2) => {
  let CommonData;
  ((CommonData2) => {
    let Id;
    ((Id2) => {
      let ConvertQueryIdTransformType;
      ((ConvertQueryIdTransformType2) => {
        ConvertQueryIdTransformType2[ConvertQueryIdTransformType2["CoreHR2Feishu"] = 1] = "CoreHR2Feishu";
        ConvertQueryIdTransformType2[ConvertQueryIdTransformType2["Feishu2CoreHR"] = 2] = "Feishu2CoreHR";
        ConvertQueryIdTransformType2[ConvertQueryIdTransformType2["Admin2Feishu"] = 3] = "Admin2Feishu";
        ConvertQueryIdTransformType2[ConvertQueryIdTransformType2["Admin2CoreHR"] = 4] = "Admin2CoreHR";
      })(ConvertQueryIdTransformType = Id2.ConvertQueryIdTransformType || (Id2.ConvertQueryIdTransformType = {}));
    })(Id = CommonData2.Id || (CommonData2.Id = {}));
  })(CommonData = Corehr2.CommonData || (Corehr2.CommonData = {}));
  let BasicInfo;
  ((BasicInfo2) => {
    let CountryRegion;
    ((CountryRegion2) => {
      let SearchRequestStatus;
      ((SearchRequestStatus2) => {
        SearchRequestStatus2[SearchRequestStatus2["Active"] = 1] = "Active";
        SearchRequestStatus2[SearchRequestStatus2["Inactive"] = 0] = "Inactive";
      })(SearchRequestStatus = CountryRegion2.SearchRequestStatus || (CountryRegion2.SearchRequestStatus = {}));
    })(CountryRegion = BasicInfo2.CountryRegion || (BasicInfo2.CountryRegion = {}));
    let CountryRegionSubdivision;
    ((CountryRegionSubdivision2) => {
      let SearchRequestStatus;
      ((SearchRequestStatus2) => {
        SearchRequestStatus2[SearchRequestStatus2["Effective"] = 1] = "Effective";
        SearchRequestStatus2[SearchRequestStatus2["Expiration"] = 0] = "Expiration";
      })(SearchRequestStatus = CountryRegionSubdivision2.SearchRequestStatus || (CountryRegionSubdivision2.SearchRequestStatus = {}));
    })(CountryRegionSubdivision = BasicInfo2.CountryRegionSubdivision || (BasicInfo2.CountryRegionSubdivision = {}));
    let City;
    ((City2) => {
      let SearchRequestStatus;
      ((SearchRequestStatus2) => {
        SearchRequestStatus2[SearchRequestStatus2["Active"] = 1] = "Active";
        SearchRequestStatus2[SearchRequestStatus2["Inactive"] = 0] = "Inactive";
      })(SearchRequestStatus = City2.SearchRequestStatus || (City2.SearchRequestStatus = {}));
    })(City = BasicInfo2.City || (BasicInfo2.City = {}));
    let District;
    ((District2) => {
      let SearchRequestStatus;
      ((SearchRequestStatus2) => {
        SearchRequestStatus2[SearchRequestStatus2["Active"] = 1] = "Active";
        SearchRequestStatus2[SearchRequestStatus2["Inactive"] = 0] = "Inactive";
      })(SearchRequestStatus = District2.SearchRequestStatus || (District2.SearchRequestStatus = {}));
    })(District = BasicInfo2.District || (BasicInfo2.District = {}));
    let Nationality;
    ((Nationality2) => {
      let SearchRequestStatus;
      ((SearchRequestStatus2) => {
        SearchRequestStatus2[SearchRequestStatus2["Active"] = 1] = "Active";
        SearchRequestStatus2[SearchRequestStatus2["Inactive"] = 0] = "Inactive";
      })(SearchRequestStatus = Nationality2.SearchRequestStatus || (Nationality2.SearchRequestStatus = {}));
    })(Nationality = BasicInfo2.Nationality || (BasicInfo2.Nationality = {}));
    let Bank;
    ((Bank2) => {
      let SearchRequestStatus;
      ((SearchRequestStatus2) => {
        SearchRequestStatus2[SearchRequestStatus2["Enabled"] = 1] = "Enabled";
        SearchRequestStatus2[SearchRequestStatus2["Disabled"] = 0] = "Disabled";
      })(SearchRequestStatus = Bank2.SearchRequestStatus || (Bank2.SearchRequestStatus = {}));
    })(Bank = BasicInfo2.Bank || (BasicInfo2.Bank = {}));
    let BankBranch;
    ((BankBranch2) => {
      let SearchRequestStatus;
      ((SearchRequestStatus2) => {
        SearchRequestStatus2[SearchRequestStatus2["Active"] = 1] = "Active";
        SearchRequestStatus2[SearchRequestStatus2["Inactive"] = 0] = "Inactive";
      })(SearchRequestStatus = BankBranch2.SearchRequestStatus || (BankBranch2.SearchRequestStatus = {}));
    })(BankBranch = BasicInfo2.BankBranch || (BasicInfo2.BankBranch = {}));
    let Currency;
    ((Currency2) => {
      let SearchRequestStatus;
      ((SearchRequestStatus2) => {
        SearchRequestStatus2[SearchRequestStatus2["Active"] = 1] = "Active";
        SearchRequestStatus2[SearchRequestStatus2["Inactive"] = 0] = "Inactive";
      })(SearchRequestStatus = Currency2.SearchRequestStatus || (Currency2.SearchRequestStatus = {}));
    })(Currency = BasicInfo2.Currency || (BasicInfo2.Currency = {}));
    let TimeZone;
    ((TimeZone2) => {
      let SearchRequestStatus;
      ((SearchRequestStatus2) => {
        SearchRequestStatus2[SearchRequestStatus2["Active"] = 1] = "Active";
        SearchRequestStatus2[SearchRequestStatus2["Inactive"] = 0] = "Inactive";
      })(SearchRequestStatus = TimeZone2.SearchRequestStatus || (TimeZone2.SearchRequestStatus = {}));
    })(TimeZone = BasicInfo2.TimeZone || (BasicInfo2.TimeZone = {}));
    let Language;
    ((Language2) => {
      let SearchRequestStatus;
      ((SearchRequestStatus2) => {
        SearchRequestStatus2[SearchRequestStatus2["Active"] = 1] = "Active";
        SearchRequestStatus2[SearchRequestStatus2["Inactive"] = 0] = "Inactive";
      })(SearchRequestStatus = Language2.SearchRequestStatus || (Language2.SearchRequestStatus = {}));
    })(Language = BasicInfo2.Language || (BasicInfo2.Language = {}));
  })(BasicInfo = Corehr2.BasicInfo || (Corehr2.BasicInfo = {}));
  let JobChange;
  ((JobChange2) => {
    let CreateRequestTransferMode;
    ((CreateRequestTransferMode2) => {
      CreateRequestTransferMode2[CreateRequestTransferMode2["Type1"] = 1] = "Type1";
      CreateRequestTransferMode2[CreateRequestTransferMode2["Type2"] = 2] = "Type2";
    })(CreateRequestTransferMode = JobChange2.CreateRequestTransferMode || (JobChange2.CreateRequestTransferMode = {}));
  })(JobChange = Corehr2.JobChange || (Corehr2.JobChange = {}));
  let Offboarding;
  ((Offboarding2) => {
    let SubmitV2RequestOffboardingMode;
    ((SubmitV2RequestOffboardingMode2) => {
      SubmitV2RequestOffboardingMode2[SubmitV2RequestOffboardingMode2["TerminationOfDismissal"] = 1] = "TerminationOfDismissal";
      SubmitV2RequestOffboardingMode2[SubmitV2RequestOffboardingMode2["OffboardingWithProcess"] = 2] = "OffboardingWithProcess";
    })(SubmitV2RequestOffboardingMode = Offboarding2.SubmitV2RequestOffboardingMode || (Offboarding2.SubmitV2RequestOffboardingMode = {}));
    let SubmitRequestOffboardingMode;
    ((SubmitRequestOffboardingMode2) => {
      SubmitRequestOffboardingMode2[SubmitRequestOffboardingMode2["TerminationOfDismissal"] = 1] = "TerminationOfDismissal";
    })(SubmitRequestOffboardingMode = Offboarding2.SubmitRequestOffboardingMode || (Offboarding2.SubmitRequestOffboardingMode = {}));
  })(Offboarding = Corehr2.Offboarding || (Corehr2.Offboarding = {}));
  let Process;
  ((Process2) => {
    let GetResponseStatus;
    ((GetResponseStatus2) => {
      GetResponseStatus2[GetResponseStatus2["Running"] = 1] = "Running";
      GetResponseStatus2[GetResponseStatus2["Reject"] = 2] = "Reject";
      GetResponseStatus2[GetResponseStatus2["Withdraw"] = 4] = "Withdraw";
      GetResponseStatus2[GetResponseStatus2["Revoke"] = 8] = "Revoke";
      GetResponseStatus2[GetResponseStatus2["Complete"] = 9] = "Complete";
    })(GetResponseStatus = Process2.GetResponseStatus || (Process2.GetResponseStatus = {}));
    let GetResponseProperties;
    ((GetResponseProperties2) => {
      GetResponseProperties2[GetResponseProperties2["Common"] = 1] = "Common";
      GetResponseProperties2[GetResponseProperties2["CheXiao"] = 2] = "CheXiao";
      GetResponseProperties2[GetResponseProperties2["Correct"] = 3] = "Correct";
    })(GetResponseProperties = Process2.GetResponseProperties || (Process2.GetResponseProperties = {}));
    let Approver;
    ((Approver2) => {
      let UpdateRequestStatus;
      ((UpdateRequestStatus2) => {
        UpdateRequestStatus2[UpdateRequestStatus2["Approved"] = 2] = "Approved";
        UpdateRequestStatus2[UpdateRequestStatus2["Rejected"] = 3] = "Rejected";
      })(UpdateRequestStatus = Approver2.UpdateRequestStatus || (Approver2.UpdateRequestStatus = {}));
    })(Approver = Process2.Approver || (Process2.Approver = {}));
    let Extra;
    ((Extra2) => {
      let UpdateRequestExtraType;
      ((UpdateRequestExtraType2) => {
        UpdateRequestExtraType2[UpdateRequestExtraType2["PreExtra"] = 0] = "PreExtra";
        UpdateRequestExtraType2[UpdateRequestExtraType2["CurrentExtra"] = 1] = "CurrentExtra";
        UpdateRequestExtraType2[UpdateRequestExtraType2["PostExtra"] = 2] = "PostExtra";
      })(UpdateRequestExtraType = Extra2.UpdateRequestExtraType || (Extra2.UpdateRequestExtraType = {}));
      let UpdateRequestApprovalType;
      ((UpdateRequestApprovalType2) => {
        UpdateRequestApprovalType2[UpdateRequestApprovalType2["OR"] = 0] = "OR";
        UpdateRequestApprovalType2[UpdateRequestApprovalType2["AND"] = 1] = "AND";
      })(UpdateRequestApprovalType = Extra2.UpdateRequestApprovalType || (Extra2.UpdateRequestApprovalType = {}));
    })(Extra = Process2.Extra || (Process2.Extra = {}));
  })(Process = Corehr2.Process || (Corehr2.Process = {}));
})(Corehr || (Corehr = {}));
Internal.define({
  "/corehr/v1/custom_fields/list_object_api_name": {
    GET: { name: "corehr.customField.listObjectApiName", pagination: { argIndex: 0 } }
  },
  "/corehr/v1/custom_fields/query": {
    GET: "corehr.customField.query"
  },
  "/corehr/v1/custom_fields/get_by_param": {
    GET: "corehr.customField.getByParam"
  },
  "/corehr/v1/common_data/meta_data/add_enum_option": {
    POST: "corehr.commonData.metaData.addEnumOption"
  },
  "/corehr/v1/common_data/meta_data/edit_enum_option": {
    POST: "corehr.commonData.metaData.editEnumOption"
  },
  "/corehr/v2/enums/search": {
    POST: "corehr.enum.search"
  },
  "/corehr/v2/basic_info/country_regions/search": {
    POST: { name: "corehr.basicInfo.countryRegion.search", pagination: { argIndex: 1 } }
  },
  "/corehr/v2/basic_info/country_region_subdivisions/search": {
    POST: { name: "corehr.basicInfo.countryRegionSubdivision.search", pagination: { argIndex: 1 } }
  },
  "/corehr/v2/basic_info/cities/search": {
    POST: { name: "corehr.basicInfo.city.search", pagination: { argIndex: 1 } }
  },
  "/corehr/v2/basic_info/districts/search": {
    POST: { name: "corehr.basicInfo.district.search", pagination: { argIndex: 1 } }
  },
  "/corehr/v2/basic_info/nationalities/search": {
    POST: { name: "corehr.basicInfo.nationality.search", pagination: { argIndex: 1 } }
  },
  "/corehr/v1/national_id_types": {
    POST: "corehr.nationalIdType.create",
    GET: { name: "corehr.nationalIdType.list", pagination: { argIndex: 0 } }
  },
  "/corehr/v1/national_id_types/{national_id_type_id}": {
    DELETE: "corehr.nationalIdType.delete",
    PATCH: "corehr.nationalIdType.patch",
    GET: "corehr.nationalIdType.get"
  },
  "/corehr/v2/basic_info/banks/search": {
    POST: { name: "corehr.basicInfo.bank.search", pagination: { argIndex: 1 } }
  },
  "/corehr/v2/basic_info/bank_branchs/search": {
    POST: { name: "corehr.basicInfo.bankBranch.search", pagination: { argIndex: 1 } }
  },
  "/corehr/v2/basic_info/currencies/search": {
    POST: { name: "corehr.basicInfo.currency.search", pagination: { argIndex: 1 } }
  },
  "/corehr/v2/basic_info/time_zones/search": {
    POST: { name: "corehr.basicInfo.timeZone.search", pagination: { argIndex: 1 } }
  },
  "/corehr/v2/basic_info/languages/search": {
    POST: { name: "corehr.basicInfo.language.search", pagination: { argIndex: 1 } }
  },
  "/corehr/v1/employee_types": {
    POST: "corehr.employeeType.create",
    GET: { name: "corehr.employeeType.list", pagination: { argIndex: 0 } }
  },
  "/corehr/v1/employee_types/{employee_type_id}": {
    DELETE: "corehr.employeeType.delete",
    PATCH: "corehr.employeeType.patch",
    GET: "corehr.employeeType.get"
  },
  "/corehr/v1/working_hours_types": {
    POST: "corehr.workingHoursType.create",
    GET: { name: "corehr.workingHoursType.list", pagination: { argIndex: 0 } }
  },
  "/corehr/v1/working_hours_types/{working_hours_type_id}": {
    DELETE: "corehr.workingHoursType.delete",
    PATCH: "corehr.workingHoursType.patch",
    GET: "corehr.workingHoursType.get"
  },
  "/corehr/v1/common_data/id/convert": {
    POST: "corehr.commonData.id.convert"
  },
  "/corehr/v2/employees/batch_get": {
    POST: "corehr.employee.batchGet"
  },
  "/corehr/v2/employees/search": {
    POST: { name: "corehr.employee.search", pagination: { argIndex: 1 } }
  },
  "/corehr/v2/employees": {
    POST: "corehr.employee.create"
  },
  "/corehr/v2/persons": {
    POST: "corehr.person.create"
  },
  "/corehr/v2/persons/{person_id}": {
    PATCH: "corehr.person.patch"
  },
  "/corehr/v1/persons/{person_id}": {
    DELETE: "corehr.person.delete",
    GET: "corehr.person.get"
  },
  "/corehr/v1/persons/upload": {
    POST: { name: "corehr.person.upload", multipart: true }
  },
  "/corehr/v1/files/{id}": {
    GET: { name: "corehr.file.get", type: "binary" }
  },
  "/corehr/v1/employments": {
    POST: "corehr.employment.create"
  },
  "/corehr/v1/employments/{employment_id}": {
    PATCH: "corehr.employment.patch",
    DELETE: "corehr.employment.delete"
  },
  "/corehr/v1/job_datas": {
    POST: "corehr.jobData.create",
    GET: { name: "corehr.jobData.list", pagination: { argIndex: 0 } }
  },
  "/corehr/v1/job_datas/{job_data_id}": {
    DELETE: "corehr.jobData.delete",
    PATCH: "corehr.jobData.patch",
    GET: "corehr.jobData.get"
  },
  "/corehr/v2/employees/job_datas/query": {
    POST: { name: "corehr.employees.jobData.query", pagination: { argIndex: 1 } }
  },
  "/corehr/v2/employees/job_datas/batch_get": {
    POST: "corehr.employees.jobData.batchGet"
  },
  "/corehr/v2/employees/international_assignments": {
    POST: "corehr.employees.internationalAssignment.create",
    GET: "corehr.employees.internationalAssignment.list"
  },
  "/corehr/v2/employees/international_assignments/{international_assignment_id}": {
    PATCH: "corehr.employees.internationalAssignment.patch",
    DELETE: "corehr.employees.internationalAssignment.delete"
  },
  "/corehr/v2/employees/additional_jobs": {
    POST: "corehr.employees.additionalJob.create"
  },
  "/corehr/v2/employees/additional_jobs/{additional_job_id}": {
    PATCH: "corehr.employees.additionalJob.patch",
    DELETE: "corehr.employees.additionalJob.delete"
  },
  "/corehr/v2/employees/additional_jobs/batch": {
    POST: { name: "corehr.employees.additionalJob.batch", pagination: { argIndex: 1 } }
  },
  "/corehr/v2/default_cost_centers/update_version": {
    POST: "corehr.defaultCostCenter.updateVersion"
  },
  "/corehr/v2/default_cost_centers/remove_version": {
    POST: "corehr.defaultCostCenter.removeVersion"
  },
  "/corehr/v2/default_cost_centers/create_version": {
    POST: "corehr.defaultCostCenter.createVersion"
  },
  "/corehr/v2/default_cost_centers/batch_query": {
    POST: "corehr.defaultCostCenter.batchQuery"
  },
  "/corehr/v2/cost_allocations/update_version": {
    POST: "corehr.costAllocation.updateVersion"
  },
  "/corehr/v2/cost_allocations/remove_version": {
    POST: "corehr.costAllocation.removeVersion"
  },
  "/corehr/v2/cost_allocations/create_version": {
    POST: "corehr.costAllocation.createVersion"
  },
  "/corehr/v2/cost_allocations/batch_query": {
    POST: "corehr.costAllocation.batchQuery"
  },
  "/corehr/v2/departments/query_operation_logs": {
    POST: { name: "corehr.department.queryOperationLogs", pagination: { argIndex: 1, itemsKey: "op_logs", tokenKey: "next_page_token" } }
  },
  "/corehr/v1/departments": {
    POST: "corehr.department.create",
    GET: { name: "corehr.department.list", pagination: { argIndex: 0 } }
  },
  "/corehr/v2/departments/{department_id}": {
    PATCH: "corehr.department.patch",
    DELETE: "corehr.department.delete"
  },
  "/corehr/v2/departments/parents": {
    POST: "corehr.department.parents"
  },
  "/corehr/v2/departments/batch_get": {
    POST: "corehr.department.batchGet"
  },
  "/corehr/v2/departments/query_recent_change": {
    GET: "corehr.department.queryRecentChange"
  },
  "/corehr/v2/departments/query_timeline": {
    POST: "corehr.department.queryTimeline"
  },
  "/corehr/v2/departments/tree": {
    POST: { name: "corehr.department.tree", pagination: { argIndex: 1 } }
  },
  "/corehr/v2/departments/query_multi_timeline": {
    POST: { name: "corehr.department.queryMultiTimeline", pagination: { argIndex: 1 } }
  },
  "/corehr/v2/departments/search": {
    POST: { name: "corehr.department.search", pagination: { argIndex: 1 } }
  },
  "/corehr/v1/locations": {
    POST: "corehr.location.create",
    GET: { name: "corehr.location.list", pagination: { argIndex: 0 } }
  },
  "/corehr/v2/locations/{location_id}": {
    PATCH: "corehr.location.patch"
  },
  "/corehr/v1/locations/{location_id}": {
    GET: "corehr.location.get",
    DELETE: "corehr.location.delete"
  },
  "/corehr/v2/locations/query_recent_change": {
    GET: "corehr.location.queryRecentChange"
  },
  "/corehr/v2/locations/batch_get": {
    POST: "corehr.location.batchGet"
  },
  "/corehr/v2/locations/active": {
    POST: "corehr.location.active"
  },
  "/corehr/v2/locations/{location_id}/addresses/{address_id}": {
    DELETE: "corehr.location.address.delete",
    PATCH: "corehr.location.address.patch"
  },
  "/corehr/v2/locations/{location_id}/addresses": {
    POST: "corehr.location.address.create"
  },
  "/corehr/v1/companies": {
    POST: "corehr.company.create",
    GET: { name: "corehr.company.list", pagination: { argIndex: 0 } }
  },
  "/corehr/v1/companies/{company_id}": {
    PATCH: "corehr.company.patch",
    GET: "corehr.company.get",
    DELETE: "corehr.company.delete"
  },
  "/corehr/v2/companies/active": {
    POST: "corehr.company.active"
  },
  "/corehr/v2/companies/query_recent_change": {
    GET: "corehr.company.queryRecentChange"
  },
  "/corehr/v2/companies/batch_get": {
    POST: "corehr.company.batchGet"
  },
  "/corehr/v2/cost_centers": {
    POST: "corehr.costCenter.create"
  },
  "/corehr/v2/cost_centers/{cost_center_id}": {
    PATCH: "corehr.costCenter.patch",
    DELETE: "corehr.costCenter.delete"
  },
  "/corehr/v2/cost_centers/query_recent_change": {
    GET: "corehr.costCenter.queryRecentChange"
  },
  "/corehr/v2/cost_centers/search": {
    POST: { name: "corehr.costCenter.search", pagination: { argIndex: 1 } }
  },
  "/corehr/v2/cost_centers/{cost_center_id}/versions": {
    POST: "corehr.costCenter.version.create"
  },
  "/corehr/v2/cost_centers/{cost_center_id}/versions/{version_id}": {
    PATCH: "corehr.costCenter.version.patch",
    DELETE: "corehr.costCenter.version.delete"
  },
  "/corehr/v2/custom_orgs": {
    POST: "corehr.customOrg.create"
  },
  "/corehr/v2/custom_orgs/{org_id}": {
    PATCH: "corehr.customOrg.patch"
  },
  "/corehr/v2/custom_orgs/update_rule": {
    POST: "corehr.customOrg.updateRule"
  },
  "/corehr/v2/custom_orgs/active": {
    POST: "corehr.customOrg.active"
  },
  "/corehr/v2/custom_orgs/query": {
    POST: { name: "corehr.customOrg.query", pagination: { argIndex: 1 } }
  },
  "/corehr/v2/custom_orgs/query_recent_change": {
    GET: "corehr.customOrg.queryRecentChange"
  },
  "/corehr/v2/custom_orgs/delete_org": {
    POST: "corehr.customOrg.deleteOrg"
  },
  "/corehr/v2/drafts/{draft_id}": {
    GET: "corehr.draft.get"
  },
  "/corehr/v2/approval_groups/open_query_position_change_list_by_ids": {
    POST: "corehr.approvalGroups.openQueryPositionChangeListByIds"
  },
  "/corehr/v2/approval_groups/{process_id}": {
    GET: "corehr.approvalGroups.get"
  },
  "/corehr/v2/approval_groups/open_query_department_change_list_by_ids": {
    POST: "corehr.approvalGroups.openQueryDepartmentChangeListByIds"
  },
  "/corehr/v2/approval_groups/open_query_job_change_list_by_ids": {
    POST: "corehr.approvalGroups.openQueryJobChangeListByIds"
  },
  "/corehr/v1/job_families": {
    POST: "corehr.jobFamily.create",
    GET: { name: "corehr.jobFamily.list", pagination: { argIndex: 0 } }
  },
  "/corehr/v1/job_families/{job_family_id}": {
    PATCH: "corehr.jobFamily.patch",
    GET: "corehr.jobFamily.get",
    DELETE: "corehr.jobFamily.delete"
  },
  "/corehr/v2/job_families/query_recent_change": {
    GET: "corehr.jobFamily.queryRecentChange"
  },
  "/corehr/v2/job_families/batch_get": {
    POST: "corehr.jobFamily.batchGet"
  },
  "/corehr/v2/job_families/query_multi_timeline": {
    POST: "corehr.jobFamily.queryMultiTimeline"
  },
  "/corehr/v1/job_levels": {
    POST: "corehr.jobLevel.create",
    GET: { name: "corehr.jobLevel.list", pagination: { argIndex: 0 } }
  },
  "/corehr/v1/job_levels/{job_level_id}": {
    PATCH: "corehr.jobLevel.patch",
    GET: "corehr.jobLevel.get",
    DELETE: "corehr.jobLevel.delete"
  },
  "/corehr/v2/job_levels/query_recent_change": {
    GET: "corehr.jobLevel.queryRecentChange"
  },
  "/corehr/v2/job_levels/batch_get": {
    POST: "corehr.jobLevel.batchGet"
  },
  "/corehr/v2/job_grades": {
    POST: "corehr.jobGrade.create"
  },
  "/corehr/v2/job_grades/{job_grade_id}": {
    PATCH: "corehr.jobGrade.patch",
    DELETE: "corehr.jobGrade.delete"
  },
  "/corehr/v2/job_grades/query": {
    POST: { name: "corehr.jobGrade.query", pagination: { argIndex: 1 } }
  },
  "/corehr/v2/job_grades/query_recent_change": {
    GET: "corehr.jobGrade.queryRecentChange"
  },
  "/corehr/v2/pathways": {
    POST: "corehr.pathway.create"
  },
  "/corehr/v2/pathways/{pathway_id}": {
    PATCH: "corehr.pathway.patch",
    DELETE: "corehr.pathway.delete"
  },
  "/corehr/v2/pathways/active": {
    POST: "corehr.pathway.active"
  },
  "/corehr/v2/pathways/batch_get": {
    POST: "corehr.pathway.batchGet"
  },
  "/corehr/v1/jobs": {
    POST: "corehr.job.create"
  },
  "/corehr/v1/jobs/{job_id}": {
    DELETE: "corehr.job.delete",
    PATCH: "corehr.job.patch"
  },
  "/corehr/v2/jobs/{job_id}": {
    GET: "corehr.job.get"
  },
  "/corehr/v2/jobs": {
    GET: { name: "corehr.job.list", pagination: { argIndex: 0 } }
  },
  "/corehr/v2/jobs/batch_get": {
    POST: "corehr.job.batchGet"
  },
  "/corehr/v2/jobs/query_multi_timeline": {
    POST: "corehr.job.queryMultiTimeline"
  },
  "/corehr/v2/jobs/query_recent_change": {
    GET: "corehr.job.queryRecentChange"
  },
  "/corehr/v2/positions": {
    POST: "corehr.position.create"
  },
  "/corehr/v2/positions/{position_id}": {
    PATCH: "corehr.position.patch"
  },
  "/corehr/v2/positions/query": {
    POST: { name: "corehr.position.query", pagination: { argIndex: 1 } }
  },
  "/corehr/v2/positions/query_recent_change": {
    GET: "corehr.position.queryRecentChange"
  },
  "/corehr/v2/positions/active": {
    POST: "corehr.position.active"
  },
  "/corehr/v2/positions/del_position": {
    POST: "corehr.position.delPosition"
  },
  "/corehr/v2/pre_hires/withdraw_onboarding": {
    POST: "corehr.preHire.withdrawOnboarding"
  },
  "/corehr/v2/pre_hires/restore_flow_instance": {
    POST: "corehr.preHire.restoreFlowInstance"
  },
  "/corehr/v2/pre_hires": {
    POST: "corehr.preHire.create"
  },
  "/corehr/v2/pre_hires/{pre_hire_id}": {
    PATCH: "corehr.preHire.patch",
    DELETE: "corehr.preHire.delete"
  },
  "/corehr/v2/pre_hires/query": {
    POST: { name: "corehr.preHire.query", pagination: { argIndex: 1 } }
  },
  "/corehr/v2/pre_hires/search": {
    POST: { name: "corehr.preHire.search", pagination: { argIndex: 1 } }
  },
  "/corehr/v2/pre_hires/{pre_hire_id}/transit_task": {
    POST: "corehr.preHire.transitTask"
  },
  "/corehr/v2/pre_hires/transform_onboarding_task": {
    POST: "corehr.preHire.transformOnboardingTask"
  },
  "/corehr/v2/pre_hires/{pre_hire_id}/complete": {
    POST: "corehr.preHire.complete"
  },
  "/corehr/v2/probation/assessments": {
    POST: "corehr.probation.assessment.create"
  },
  "/corehr/v2/probation/enable_disable_assessment": {
    POST: "corehr.probation.enableDisableAssessment"
  },
  "/corehr/v2/probation/assessments/{assessment_id}": {
    PATCH: "corehr.probation.assessment.patch",
    DELETE: "corehr.probation.assessment.delete"
  },
  "/corehr/v2/probation/search": {
    POST: { name: "corehr.probation.search", pagination: { argIndex: 1 } }
  },
  "/corehr/v2/probation/submit": {
    POST: "corehr.probation.submit"
  },
  "/corehr/v2/probation/withdraw": {
    POST: "corehr.probation.withdraw"
  },
  "/corehr/v2/job_changes": {
    POST: "corehr.jobChange.create"
  },
  "/corehr/v1/transfer_types/query": {
    GET: "corehr.transferType.query"
  },
  "/corehr/v1/transfer_reasons/query": {
    GET: "corehr.transferReason.query"
  },
  "/corehr/v2/job_changes/search": {
    POST: { name: "corehr.jobChange.search", pagination: { argIndex: 1 } }
  },
  "/corehr/v2/job_changes/{job_change_id}/revoke": {
    POST: "corehr.jobChange.revoke"
  },
  "/corehr/v1/offboardings/query": {
    POST: "corehr.offboarding.query"
  },
  "/corehr/v2/offboardings/submit_v2": {
    POST: "corehr.offboarding.submitV2"
  },
  "/corehr/v2/offboardings/edit": {
    POST: "corehr.offboarding.edit"
  },
  "/corehr/v2/offboardings/revoke": {
    POST: "corehr.offboarding.revoke"
  },
  "/corehr/v1/offboardings/search": {
    POST: { name: "corehr.offboarding.search", pagination: { argIndex: 1 } }
  },
  "/corehr/v2/signature_files/terminate": {
    POST: "corehr.signatureFile.terminate"
  },
  "/corehr/v2/signature_files": {
    GET: { name: "corehr.signatureFile.list", pagination: { argIndex: 0 } }
  },
  "/corehr/v2/signature_files/query": {
    POST: { name: "corehr.signatureFile.query", pagination: { argIndex: 1 } }
  },
  "/corehr/v2/signature_nodes/list_by_file_id": {
    GET: "corehr.signatureNode.listByFileId"
  },
  "/corehr/v2/signature_files/list_by_biz_id": {
    GET: "corehr.signatureFile.listByBizId"
  },
  "/corehr/v2/signature_files/{signature_file_id}/download": {
    POST: { name: "corehr.signatureFile.download", type: "binary" }
  },
  "/corehr/v2/signature_templates/search": {
    GET: "corehr.signatureTemplate.search"
  },
  "/corehr/v2/signature_template_info_with_thumbnails": {
    GET: { name: "corehr.signatureTemplateInfoWithThumbnail.list", pagination: { argIndex: 0 } }
  },
  "/corehr/v1/contracts": {
    POST: "corehr.contract.create",
    GET: { name: "corehr.contract.list", pagination: { argIndex: 0 } }
  },
  "/corehr/v1/contracts/{contract_id}": {
    PATCH: "corehr.contract.patch",
    DELETE: "corehr.contract.delete",
    GET: "corehr.contract.get"
  },
  "/corehr/v2/contracts/search": {
    POST: { name: "corehr.contract.search", pagination: { argIndex: 1 } }
  },
  "/corehr/v2/workforce_plan_detail_row/batchSave": {
    POST: "corehr.workforcePlanDetailRow.batchSave"
  },
  "/corehr/v2/workforce_plan_detail_row/batchDelete": {
    POST: "corehr.workforcePlanDetailRow.batchDelete"
  },
  "/corehr/v2/report_detail_row/batchSave": {
    POST: "corehr.reportDetailRow.batchSave"
  },
  "/corehr/v2/report_detail_row/batchDelete": {
    POST: "corehr.reportDetailRow.batchDelete"
  },
  "/corehr/v2/workforce_plans": {
    GET: "corehr.workforcePlan.list"
  },
  "/corehr/v2/workforce_plan_details/batch": {
    POST: "corehr.workforcePlanDetail.batch"
  },
  "/corehr/v2/workforce_plan_details/batch_v2": {
    POST: "corehr.workforcePlanDetail.batchV2"
  },
  "/corehr/v1/leave_granting_records": {
    POST: "corehr.leaveGrantingRecord.create"
  },
  "/corehr/v1/leave_granting_records/{leave_granting_record_id}": {
    DELETE: "corehr.leaveGrantingRecord.delete"
  },
  "/corehr/v1/leaves/leave_types": {
    GET: { name: "corehr.leave.leaveTypes", pagination: { argIndex: 0, itemsKey: "leave_type_list" } }
  },
  "/corehr/v1/leaves/leave_balances": {
    GET: { name: "corehr.leave.leaveBalances", pagination: { argIndex: 0, itemsKey: "employment_leave_balance_list" } }
  },
  "/corehr/v1/leaves/leave_request_history": {
    GET: { name: "corehr.leave.leaveRequestHistory", pagination: { argIndex: 0, itemsKey: "leave_request_list" } }
  },
  "/corehr/v1/leaves/work_calendar": {
    POST: "corehr.leave.workCalendar"
  },
  "/corehr/v1/leaves/calendar_by_scope": {
    GET: "corehr.leave.calendarByScope"
  },
  "/corehr/v1/leaves/work_calendar_date": {
    POST: "corehr.leave.workCalendarDate"
  },
  "/corehr/v1/authorizations/query": {
    GET: { name: "corehr.authorization.query", pagination: { argIndex: 0 } }
  },
  "/corehr/v1/authorizations/get_by_param": {
    GET: "corehr.authorization.getByParam"
  },
  "/corehr/v1/security_groups": {
    GET: { name: "corehr.securityGroup.list", pagination: { argIndex: 0 } }
  },
  "/corehr/v1/authorizations/add_role_assign": {
    POST: "corehr.authorization.addRoleAssign"
  },
  "/corehr/v1/authorizations/update_role_assign": {
    POST: "corehr.authorization.updateRoleAssign"
  },
  "/corehr/v1/authorizations/remove_role_assign": {
    POST: "corehr.authorization.removeRoleAssign"
  },
  "/corehr/v2/employees/bps/batch_get": {
    POST: "corehr.employees.bp.batchGet"
  },
  "/corehr/v2/bps/get_by_department": {
    POST: "corehr.bp.getByDepartment"
  },
  "/corehr/v1/security_groups/query": {
    POST: "corehr.securityGroup.query"
  },
  "/corehr/v2/bps": {
    GET: { name: "corehr.bp.list", pagination: { argIndex: 0 } }
  },
  "/corehr/v1/assigned_users/search": {
    POST: "corehr.assignedUser.search"
  },
  "/corehr/v2/processes": {
    GET: { name: "corehr.process.list", pagination: { argIndex: 0, itemsKey: "process_ids" } }
  },
  "/corehr/v2/processes/{process_id}": {
    GET: "corehr.process.get"
  },
  "/corehr/v2/processes/{process_id}/flow_variable_data": {
    GET: "corehr.process.flowVariableData"
  },
  "/corehr/v2/processes/{process_id}/form_variable_data": {
    GET: "corehr.process.formVariableData.get"
  },
  "/corehr/v2/process_revoke/{process_id}": {
    PUT: "corehr.processRevoke.update"
  },
  "/corehr/v2/process_withdraw/{process_id}": {
    PUT: "corehr.processWithdraw.update"
  },
  "/corehr/v2/approvers": {
    GET: { name: "corehr.approver.list", pagination: { argIndex: 0, itemsKey: "approver_list" } }
  },
  "/corehr/v2/processes/{process_id}/approvers/{approver_id}": {
    PUT: "corehr.process.approver.update"
  },
  "/corehr/v2/processes/{process_id}/extra": {
    PUT: "corehr.process.extra.update"
  },
  "/corehr/v2/processes/{process_id}/transfer": {
    PUT: "corehr.process.transfer.update"
  },
  "/corehr/v1/compensation_standards/match": {
    GET: "corehr.compensationStandard.match"
  },
  "/corehr/v1/pre_hires/{pre_hire_id}": {
    GET: "corehr.preHire.get"
  },
  "/corehr/v1/pre_hires": {
    GET: { name: "corehr.preHire.list", pagination: { argIndex: 0 } }
  },
  "/corehr/v1/subregions": {
    GET: { name: "corehr.subregion.list", pagination: { argIndex: 0 } }
  },
  "/corehr/v1/subregions/{subregion_id}": {
    GET: "corehr.subregion.get"
  },
  "/corehr/v1/subdivisions": {
    GET: { name: "corehr.subdivision.list", pagination: { argIndex: 0 } }
  },
  "/corehr/v1/subdivisions/{subdivision_id}": {
    GET: "corehr.subdivision.get"
  },
  "/corehr/v1/country_regions": {
    GET: { name: "corehr.countryRegion.list", pagination: { argIndex: 0 } }
  },
  "/corehr/v1/country_regions/{country_region_id}": {
    GET: "corehr.countryRegion.get"
  },
  "/corehr/v1/currencies": {
    GET: { name: "corehr.currency.list", pagination: { argIndex: 0 } }
  },
  "/corehr/v1/currencies/{currency_id}": {
    GET: "corehr.currency.get"
  },
  "/corehr/v1/departments/{department_id}": {
    GET: "corehr.department.get"
  },
  "/corehr/v1/offboardings/submit": {
    POST: "corehr.offboarding.submit"
  }
});

// src/types/directory.ts
Internal.define({
  "/directory/v1/employees": {
    POST: "directory.employee.create"
  },
  "/directory/v1/employees/{employee_id}": {
    PATCH: "directory.employee.patch",
    DELETE: "directory.employee.delete"
  },
  "/directory/v1/employees/{employee_id}/resurrect": {
    POST: "directory.employee.resurrect"
  },
  "/directory/v1/employees/{employee_id}/to_be_resigned": {
    PATCH: "directory.employee.toBeResigned"
  },
  "/directory/v1/employees/{employee_id}/regular": {
    PATCH: "directory.employee.regular"
  },
  "/directory/v1/employees/mget": {
    POST: "directory.employee.mget"
  },
  "/directory/v1/employees/filter": {
    POST: "directory.employee.filter"
  },
  "/directory/v1/employees/search": {
    POST: "directory.employee.search"
  },
  "/directory/v1/departments": {
    POST: "directory.department.create"
  },
  "/directory/v1/departments/{department_id}": {
    PATCH: "directory.department.patch",
    DELETE: "directory.department.delete"
  },
  "/directory/v1/departments/mget": {
    POST: "directory.department.mget"
  },
  "/directory/v1/departments/filter": {
    POST: "directory.department.filter"
  },
  "/directory/v1/departments/search": {
    POST: "directory.department.search"
  },
  "/directory/v1/share_entities": {
    GET: "directory.collborationShareEntity.list"
  },
  "/directory/v1/collaboration_tenants": {
    GET: { name: "directory.collaborationTenant.list", pagination: { argIndex: 0 } }
  },
  "/directory/v1/collaboration_rules": {
    POST: "directory.collaborationRule.create",
    GET: { name: "directory.collaborationRule.list", pagination: { argIndex: 0 } }
  },
  "/directory/v1/collaboration_rules/{collaboration_rule_id}": {
    PUT: "directory.collaborationRule.update",
    DELETE: "directory.collaborationRule.delete"
  }
});

// src/types/docs.ts
Internal.define({
  "/docs/v1/content": {
    GET: "docs.content.get"
  }
});

// src/types/document_ai.ts
Internal.define({
  "/document_ai/v1/resume/parse": {
    POST: { name: "documentAi.resume.parse", multipart: true }
  },
  "/document_ai/v1/vehicle_invoice/recognize": {
    POST: { name: "documentAi.vehicleInvoice.recognize", multipart: true }
  },
  "/document_ai/v1/health_certificate/recognize": {
    POST: { name: "documentAi.healthCertificate.recognize", multipart: true }
  },
  "/document_ai/v1/hkm_mainland_travel_permit/recognize": {
    POST: { name: "documentAi.hkmMainlandTravelPermit.recognize", multipart: true }
  },
  "/document_ai/v1/tw_mainland_travel_permit/recognize": {
    POST: { name: "documentAi.twMainlandTravelPermit.recognize", multipart: true }
  },
  "/document_ai/v1/chinese_passport/recognize": {
    POST: { name: "documentAi.chinesePassport.recognize", multipart: true }
  },
  "/document_ai/v1/bank_card/recognize": {
    POST: { name: "documentAi.bankCard.recognize", multipart: true }
  },
  "/document_ai/v1/vehicle_license/recognize": {
    POST: { name: "documentAi.vehicleLicense.recognize", multipart: true }
  },
  "/document_ai/v1/train_invoice/recognize": {
    POST: { name: "documentAi.trainInvoice.recognize", multipart: true }
  },
  "/document_ai/v1/taxi_invoice/recognize": {
    POST: { name: "documentAi.taxiInvoice.recognize", multipart: true }
  },
  "/document_ai/v1/id_card/recognize": {
    POST: { name: "documentAi.idCard.recognize", multipart: true }
  },
  "/document_ai/v1/food_produce_license/recognize": {
    POST: { name: "documentAi.foodProduceLicense.recognize", multipart: true }
  },
  "/document_ai/v1/food_manage_license/recognize": {
    POST: { name: "documentAi.foodManageLicense.recognize", multipart: true }
  },
  "/document_ai/v1/driving_license/recognize": {
    POST: { name: "documentAi.drivingLicense.recognize", multipart: true }
  },
  "/document_ai/v1/vat_invoice/recognize": {
    POST: { name: "documentAi.vatInvoice.recognize", multipart: true }
  },
  "/document_ai/v1/business_license/recognize": {
    POST: { name: "documentAi.businessLicense.recognize", multipart: true }
  },
  "/document_ai/v1/contract/field_extraction": {
    POST: { name: "documentAi.contract.fieldExtraction", multipart: true }
  },
  "/document_ai/v1/business_card/recognize": {
    POST: { name: "documentAi.businessCard.recognize", multipart: true }
  }
});

// src/types/docx.ts
var Docx;
((Docx2) => {
  let Document;
  ((Document2) => {
    let RawContentQueryLang;
    ((RawContentQueryLang2) => {
      RawContentQueryLang2[RawContentQueryLang2["ZH"] = 0] = "ZH";
      RawContentQueryLang2[RawContentQueryLang2["EN"] = 1] = "EN";
      RawContentQueryLang2[RawContentQueryLang2["JP"] = 2] = "JP";
    })(RawContentQueryLang = Document2.RawContentQueryLang || (Document2.RawContentQueryLang = {}));
  })(Document = Docx2.Document || (Docx2.Document = {}));
})(Docx || (Docx = {}));
Internal.define({
  "/docx/v1/chats/{chat_id}/announcement": {
    GET: "docx.chat.announcement.get"
  },
  "/docx/v1/chats/{chat_id}/announcement/blocks": {
    GET: { name: "docx.chat.announcement.block.list", pagination: { argIndex: 1 } }
  },
  "/docx/v1/chats/{chat_id}/announcement/blocks/{block_id}/children": {
    POST: "docx.chat.announcement.block.children.create",
    GET: { name: "docx.chat.announcement.block.children.get", pagination: { argIndex: 2 } }
  },
  "/docx/v1/chats/{chat_id}/announcement/blocks/batch_update": {
    PATCH: "docx.chat.announcement.block.batchUpdate"
  },
  "/docx/v1/chats/{chat_id}/announcement/blocks/{block_id}": {
    GET: "docx.chat.announcement.block.get"
  },
  "/docx/v1/chats/{chat_id}/announcement/blocks/{block_id}/children/batch_delete": {
    DELETE: "docx.chat.announcement.block.children.batchDelete"
  },
  "/docx/v1/documents": {
    POST: "docx.document.create"
  },
  "/docx/v1/documents/{document_id}": {
    GET: "docx.document.get"
  },
  "/docx/v1/documents/{document_id}/raw_content": {
    GET: "docx.document.rawContent"
  },
  "/docx/v1/documents/{document_id}/blocks": {
    GET: { name: "docx.document.block.list", pagination: { argIndex: 1 } }
  },
  "/docx/v1/documents/{document_id}/blocks/{block_id}/children": {
    POST: "docx.document.block.children.create",
    GET: { name: "docx.document.block.children.get", pagination: { argIndex: 2 } }
  },
  "/docx/v1/documents/{document_id}/blocks/{block_id}/descendant": {
    POST: "docx.document.block.descendant.create"
  },
  "/docx/v1/documents/{document_id}/blocks/{block_id}": {
    PATCH: "docx.document.block.patch",
    GET: "docx.document.block.get"
  },
  "/docx/v1/documents/{document_id}/blocks/batch_update": {
    PATCH: "docx.document.block.batchUpdate"
  },
  "/docx/v1/documents/{document_id}/blocks/{block_id}/children/batch_delete": {
    DELETE: "docx.document.block.children.batchDelete"
  },
  "/docx/v1/documents/blocks/convert": {
    POST: "docx.document.convert"
  }
});

// src/types/drive.ts
Internal.define({
  "/drive/v1/files": {
    GET: { name: "drive.file.list", pagination: { argIndex: 0, itemsKey: "files", tokenKey: "next_page_token" } }
  },
  "/drive/v1/files/create_folder": {
    POST: "drive.file.createFolder"
  },
  "/drive/v1/files/task_check": {
    GET: "drive.file.taskCheck"
  },
  "/drive/v1/metas/batch_query": {
    POST: "drive.meta.batchQuery"
  },
  "/drive/v1/files/{file_token}/statistics": {
    GET: "drive.file.statistics.get"
  },
  "/drive/v1/files/{file_token}/view_records": {
    GET: { name: "drive.file.viewRecord.list", pagination: { argIndex: 1 } }
  },
  "/drive/v1/files/{file_token}/copy": {
    POST: "drive.file.copy"
  },
  "/drive/v1/files/{file_token}/move": {
    POST: "drive.file.move"
  },
  "/drive/v1/files/{file_token}": {
    DELETE: "drive.file.delete"
  },
  "/drive/v1/files/create_shortcut": {
    POST: "drive.file.createShortcut"
  },
  "/drive/v1/files/upload_all": {
    POST: { name: "drive.file.uploadAll", multipart: true }
  },
  "/drive/v1/files/upload_prepare": {
    POST: "drive.file.uploadPrepare"
  },
  "/drive/v1/files/upload_part": {
    POST: { name: "drive.file.uploadPart", multipart: true }
  },
  "/drive/v1/files/upload_finish": {
    POST: "drive.file.uploadFinish"
  },
  "/drive/v1/files/{file_token}/download": {
    GET: { name: "drive.file.download", type: "binary" }
  },
  "/drive/v1/import_tasks": {
    POST: "drive.importTask.create"
  },
  "/drive/v1/import_tasks/{ticket}": {
    GET: "drive.importTask.get"
  },
  "/drive/v1/export_tasks": {
    POST: "drive.exportTask.create"
  },
  "/drive/v1/export_tasks/{ticket}": {
    GET: "drive.exportTask.get"
  },
  "/drive/v1/export_tasks/file/{file_token}/download": {
    GET: { name: "drive.exportTask.download", type: "binary" }
  },
  "/drive/v1/medias/upload_all": {
    POST: { name: "drive.media.uploadAll", multipart: true }
  },
  "/drive/v1/medias/upload_prepare": {
    POST: "drive.media.uploadPrepare"
  },
  "/drive/v1/medias/upload_part": {
    POST: { name: "drive.media.uploadPart", multipart: true }
  },
  "/drive/v1/medias/upload_finish": {
    POST: "drive.media.uploadFinish"
  },
  "/drive/v1/medias/{file_token}/download": {
    GET: { name: "drive.media.download", type: "binary" }
  },
  "/drive/v1/medias/batch_get_tmp_download_url": {
    GET: "drive.media.batchGetTmpDownloadUrl"
  },
  "/drive/v1/files/{file_token}/versions": {
    POST: "drive.file.version.create",
    GET: { name: "drive.file.version.list", pagination: { argIndex: 1 } }
  },
  "/drive/v1/files/{file_token}/versions/{version_id}": {
    GET: "drive.file.version.get",
    DELETE: "drive.file.version.delete"
  },
  "/drive/v2/files/{file_token}/likes": {
    GET: { name: "drive.file.like.list", pagination: { argIndex: 1 } }
  },
  "/drive/v1/files/{file_token}/subscribe": {
    POST: "drive.file.subscribe"
  },
  "/drive/v1/files/{file_token}/get_subscribe": {
    GET: "drive.file.getSubscribe"
  },
  "/drive/v1/files/{file_token}/delete_subscribe": {
    DELETE: "drive.file.deleteSubscribe"
  },
  "/drive/v1/permissions/{token}/members": {
    POST: "drive.permission.member.create",
    GET: "drive.permission.member.list"
  },
  "/drive/v1/permissions/{token}/members/batch_create": {
    POST: "drive.permission.member.batchCreate"
  },
  "/drive/v1/permissions/{token}/members/{member_id}": {
    PUT: "drive.permission.member.update",
    DELETE: "drive.permission.member.delete"
  },
  "/drive/v1/permissions/{token}/members/transfer_owner": {
    POST: "drive.permission.member.transferOwner"
  },
  "/drive/v1/permissions/{token}/members/auth": {
    GET: "drive.permission.member.auth"
  },
  "/drive/v2/permissions/{token}/public": {
    PATCH: "drive.permission.public.patch",
    GET: "drive.permission.public.get"
  },
  "/drive/v1/permissions/{token}/public/password": {
    POST: "drive.permission.public.password.create",
    PUT: "drive.permission.public.password.update",
    DELETE: "drive.permission.public.password.delete"
  },
  "/drive/v1/files/{file_token}/comments": {
    GET: { name: "drive.file.comment.list", pagination: { argIndex: 1 } },
    POST: "drive.file.comment.create"
  },
  "/drive/v1/files/{file_token}/comments/batch_query": {
    POST: "drive.file.comment.batchQuery"
  },
  "/drive/v1/files/{file_token}/comments/{comment_id}": {
    PATCH: "drive.file.comment.patch",
    GET: "drive.file.comment.get"
  },
  "/drive/v1/files/{file_token}/comments/{comment_id}/replies": {
    GET: { name: "drive.file.comment.reply.list", pagination: { argIndex: 2 } }
  },
  "/drive/v1/files/{file_token}/comments/{comment_id}/replies/{reply_id}": {
    PUT: "drive.file.comment.reply.update",
    DELETE: "drive.file.comment.reply.delete"
  },
  "/drive/v1/files/{file_token}/subscriptions/{subscription_id}": {
    GET: "drive.file.subscription.get",
    PATCH: "drive.file.subscription.patch"
  },
  "/drive/v1/files/{file_token}/subscriptions": {
    POST: "drive.file.subscription.create"
  }
});

// src/types/ehr.ts
var Ehr;
((Ehr2) => {
  let Employee;
  ((Employee2) => {
    let ListQueryStatus;
    ((ListQueryStatus2) => {
      ListQueryStatus2[ListQueryStatus2["ToBeOnboarded"] = 1] = "ToBeOnboarded";
      ListQueryStatus2[ListQueryStatus2["Active"] = 2] = "Active";
      ListQueryStatus2[ListQueryStatus2["OnboardingCancelled"] = 3] = "OnboardingCancelled";
      ListQueryStatus2[ListQueryStatus2["Offboarding"] = 4] = "Offboarding";
      ListQueryStatus2[ListQueryStatus2["Offboarded"] = 5] = "Offboarded";
    })(ListQueryStatus = Employee2.ListQueryStatus || (Employee2.ListQueryStatus = {}));
    let ListQueryType;
    ((ListQueryType2) => {
      ListQueryType2[ListQueryType2["Regular"] = 1] = "Regular";
      ListQueryType2[ListQueryType2["Intern"] = 2] = "Intern";
      ListQueryType2[ListQueryType2["Consultant"] = 3] = "Consultant";
      ListQueryType2[ListQueryType2["Outsourcing"] = 4] = "Outsourcing";
      ListQueryType2[ListQueryType2["Contractor"] = 5] = "Contractor";
    })(ListQueryType = Employee2.ListQueryType || (Employee2.ListQueryType = {}));
  })(Employee = Ehr2.Employee || (Ehr2.Employee = {}));
})(Ehr || (Ehr = {}));
Internal.define({
  "/ehr/v1/employees": {
    GET: { name: "ehr.employee.list", pagination: { argIndex: 0 } }
  },
  "/ehr/v1/attachments/{token}": {
    GET: { name: "ehr.attachment.get", type: "binary" }
  }
});

// src/types/event.ts
Internal.define({
  "/event/v1/outbound_ip": {
    GET: { name: "event.outboundIp.list", pagination: { argIndex: 0, itemsKey: "ip_list" } }
  }
});

// src/types/helpdesk.ts
Internal.define({
  "/helpdesk/v1/agents/{agent_id}": {
    PATCH: "helpdesk.agent.patch"
  },
  "/helpdesk/v1/agent_emails": {
    GET: "helpdesk.agent.agentEmail"
  },
  "/helpdesk/v1/agent_schedules": {
    POST: "helpdesk.agentSchedule.create",
    GET: "helpdesk.agentSchedule.list"
  },
  "/helpdesk/v1/agents/{agent_id}/schedules": {
    DELETE: "helpdesk.agent.schedules.delete",
    PATCH: "helpdesk.agent.schedules.patch",
    GET: "helpdesk.agent.schedules.get"
  },
  "/helpdesk/v1/agent_skills": {
    POST: "helpdesk.agentSkill.create",
    GET: "helpdesk.agentSkill.list"
  },
  "/helpdesk/v1/agent_skills/{agent_skill_id}": {
    DELETE: "helpdesk.agentSkill.delete",
    PATCH: "helpdesk.agentSkill.patch",
    GET: "helpdesk.agentSkill.get"
  },
  "/helpdesk/v1/agent_skill_rules": {
    GET: "helpdesk.agentSkillRule.list"
  },
  "/helpdesk/v1/start_service": {
    POST: "helpdesk.ticket.startService"
  },
  "/helpdesk/v1/tickets/{ticket_id}": {
    GET: "helpdesk.ticket.get",
    PUT: "helpdesk.ticket.update"
  },
  "/helpdesk/v1/tickets": {
    GET: "helpdesk.ticket.list"
  },
  "/helpdesk/v1/ticket_images": {
    GET: { name: "helpdesk.ticket.ticketImage", type: "binary" }
  },
  "/helpdesk/v1/tickets/{ticket_id}/answer_user_query": {
    POST: "helpdesk.ticket.answerUserQuery"
  },
  "/helpdesk/v1/customized_fields": {
    GET: "helpdesk.ticket.customizedFields"
  },
  "/helpdesk/v1/tickets/{ticket_id}/messages": {
    POST: "helpdesk.ticket.message.create",
    GET: "helpdesk.ticket.message.list"
  },
  "/helpdesk/v1/message": {
    POST: "helpdesk.bot.message.create"
  },
  "/helpdesk/v1/ticket_customized_fields": {
    POST: "helpdesk.ticketCustomizedField.create",
    GET: { name: "helpdesk.ticketCustomizedField.list", pagination: { argIndex: 1, tokenKey: "next_page_token" } }
  },
  "/helpdesk/v1/ticket_customized_fields/{ticket_customized_field_id}": {
    DELETE: "helpdesk.ticketCustomizedField.delete",
    PATCH: "helpdesk.ticketCustomizedField.patch",
    GET: "helpdesk.ticketCustomizedField.get"
  },
  "/helpdesk/v1/faqs": {
    POST: "helpdesk.faq.create",
    GET: { name: "helpdesk.faq.list", pagination: { argIndex: 0 } }
  },
  "/helpdesk/v1/faqs/{id}": {
    DELETE: "helpdesk.faq.delete",
    PATCH: "helpdesk.faq.patch",
    GET: "helpdesk.faq.get"
  },
  "/helpdesk/v1/faqs/{id}/image/{image_key}": {
    GET: { name: "helpdesk.faq.faqImage", type: "binary" }
  },
  "/helpdesk/v1/faqs/search": {
    GET: { name: "helpdesk.faq.search", pagination: { argIndex: 0 } }
  },
  "/helpdesk/v1/categories": {
    POST: "helpdesk.category.create",
    GET: "helpdesk.category.list"
  },
  "/helpdesk/v1/categories/{id}": {
    GET: "helpdesk.category.get",
    PATCH: "helpdesk.category.patch",
    DELETE: "helpdesk.category.delete"
  },
  "/helpdesk/v1/notifications": {
    POST: "helpdesk.notification.create"
  },
  "/helpdesk/v1/notifications/{notification_id}": {
    PATCH: "helpdesk.notification.patch",
    GET: "helpdesk.notification.get"
  },
  "/helpdesk/v1/notifications/{notification_id}/preview": {
    POST: "helpdesk.notification.preview"
  },
  "/helpdesk/v1/notifications/{notification_id}/submit_approve": {
    POST: "helpdesk.notification.submitApprove"
  },
  "/helpdesk/v1/notifications/{notification_id}/cancel_approve": {
    POST: "helpdesk.notification.cancelApprove"
  },
  "/helpdesk/v1/notifications/{notification_id}/execute_send": {
    POST: "helpdesk.notification.executeSend"
  },
  "/helpdesk/v1/notifications/{notification_id}/cancel_send": {
    POST: "helpdesk.notification.cancelSend"
  },
  "/helpdesk/v1/events/subscribe": {
    POST: "helpdesk.event.subscribe"
  },
  "/helpdesk/v1/events/unsubscribe": {
    POST: "helpdesk.event.unsubscribe"
  }
});

// src/types/hire.ts
var Hire;
((Hire2) => {
  let Job;
  ((Job2) => {
    let CombinedCreateRequestExperience;
    ((CombinedCreateRequestExperience2) => {
      CombinedCreateRequestExperience2[CombinedCreateRequestExperience2["NoLimit"] = 1] = "NoLimit";
      CombinedCreateRequestExperience2[CombinedCreateRequestExperience2["Graduate"] = 2] = "Graduate";
      CombinedCreateRequestExperience2[CombinedCreateRequestExperience2["UnderOneYear"] = 3] = "UnderOneYear";
      CombinedCreateRequestExperience2[CombinedCreateRequestExperience2["OneToThreeYear"] = 4] = "OneToThreeYear";
      CombinedCreateRequestExperience2[CombinedCreateRequestExperience2["ThreeToFiveYear"] = 5] = "ThreeToFiveYear";
      CombinedCreateRequestExperience2[CombinedCreateRequestExperience2["FiveToSevenYear"] = 6] = "FiveToSevenYear";
      CombinedCreateRequestExperience2[CombinedCreateRequestExperience2["SevenToTenYear"] = 7] = "SevenToTenYear";
      CombinedCreateRequestExperience2[CombinedCreateRequestExperience2["OverTenYear"] = 8] = "OverTenYear";
    })(CombinedCreateRequestExperience = Job2.CombinedCreateRequestExperience || (Job2.CombinedCreateRequestExperience = {}));
    let CombinedCreateRequestProcessType;
    ((CombinedCreateRequestProcessType2) => {
      CombinedCreateRequestProcessType2[CombinedCreateRequestProcessType2["SocialProcess"] = 1] = "SocialProcess";
      CombinedCreateRequestProcessType2[CombinedCreateRequestProcessType2["CampusProcess"] = 2] = "CampusProcess";
    })(CombinedCreateRequestProcessType = Job2.CombinedCreateRequestProcessType || (Job2.CombinedCreateRequestProcessType = {}));
    let CombinedCreateRequestRequiredDegree;
    ((CombinedCreateRequestRequiredDegree2) => {
      CombinedCreateRequestRequiredDegree2[CombinedCreateRequestRequiredDegree2["PrimaryEducation"] = 1] = "PrimaryEducation";
      CombinedCreateRequestRequiredDegree2[CombinedCreateRequestRequiredDegree2["JuniorMiddleSchoolEducation"] = 2] = "JuniorMiddleSchoolEducation";
      CombinedCreateRequestRequiredDegree2[CombinedCreateRequestRequiredDegree2["Secondary"] = 3] = "Secondary";
      CombinedCreateRequestRequiredDegree2[CombinedCreateRequestRequiredDegree2["SeniorSchoolGraduates"] = 4] = "SeniorSchoolGraduates";
      CombinedCreateRequestRequiredDegree2[CombinedCreateRequestRequiredDegree2["Associate"] = 5] = "Associate";
      CombinedCreateRequestRequiredDegree2[CombinedCreateRequestRequiredDegree2["Bachelor"] = 6] = "Bachelor";
      CombinedCreateRequestRequiredDegree2[CombinedCreateRequestRequiredDegree2["Master"] = 7] = "Master";
      CombinedCreateRequestRequiredDegree2[CombinedCreateRequestRequiredDegree2["Phd"] = 8] = "Phd";
      CombinedCreateRequestRequiredDegree2[CombinedCreateRequestRequiredDegree2["NoLimit"] = 20] = "NoLimit";
    })(CombinedCreateRequestRequiredDegree = Job2.CombinedCreateRequestRequiredDegree || (Job2.CombinedCreateRequestRequiredDegree = {}));
    let CombinedCreateRequestJobAttribute;
    ((CombinedCreateRequestJobAttribute2) => {
      CombinedCreateRequestJobAttribute2[CombinedCreateRequestJobAttribute2["Concrete"] = 1] = "Concrete";
      CombinedCreateRequestJobAttribute2[CombinedCreateRequestJobAttribute2["Virtual"] = 2] = "Virtual";
    })(CombinedCreateRequestJobAttribute = Job2.CombinedCreateRequestJobAttribute || (Job2.CombinedCreateRequestJobAttribute = {}));
    let CombinedUpdateRequestExperience;
    ((CombinedUpdateRequestExperience2) => {
      CombinedUpdateRequestExperience2[CombinedUpdateRequestExperience2["NoLimit"] = 1] = "NoLimit";
      CombinedUpdateRequestExperience2[CombinedUpdateRequestExperience2["Graduate"] = 2] = "Graduate";
      CombinedUpdateRequestExperience2[CombinedUpdateRequestExperience2["UnderOneYear"] = 3] = "UnderOneYear";
      CombinedUpdateRequestExperience2[CombinedUpdateRequestExperience2["OneToThreeYear"] = 4] = "OneToThreeYear";
      CombinedUpdateRequestExperience2[CombinedUpdateRequestExperience2["ThreeToFiveYear"] = 5] = "ThreeToFiveYear";
      CombinedUpdateRequestExperience2[CombinedUpdateRequestExperience2["FiveToSevenYear"] = 6] = "FiveToSevenYear";
      CombinedUpdateRequestExperience2[CombinedUpdateRequestExperience2["SevenToTenYear"] = 7] = "SevenToTenYear";
      CombinedUpdateRequestExperience2[CombinedUpdateRequestExperience2["OverTenYear"] = 8] = "OverTenYear";
    })(CombinedUpdateRequestExperience = Job2.CombinedUpdateRequestExperience || (Job2.CombinedUpdateRequestExperience = {}));
    let CombinedUpdateRequestRequiredDegree;
    ((CombinedUpdateRequestRequiredDegree2) => {
      CombinedUpdateRequestRequiredDegree2[CombinedUpdateRequestRequiredDegree2["PrimaryEducation"] = 1] = "PrimaryEducation";
      CombinedUpdateRequestRequiredDegree2[CombinedUpdateRequestRequiredDegree2["JuniorMiddleSchoolEducation"] = 2] = "JuniorMiddleSchoolEducation";
      CombinedUpdateRequestRequiredDegree2[CombinedUpdateRequestRequiredDegree2["Secondary"] = 3] = "Secondary";
      CombinedUpdateRequestRequiredDegree2[CombinedUpdateRequestRequiredDegree2["SeniorSchoolGraduates"] = 4] = "SeniorSchoolGraduates";
      CombinedUpdateRequestRequiredDegree2[CombinedUpdateRequestRequiredDegree2["Associate"] = 5] = "Associate";
      CombinedUpdateRequestRequiredDegree2[CombinedUpdateRequestRequiredDegree2["Bachelor"] = 6] = "Bachelor";
      CombinedUpdateRequestRequiredDegree2[CombinedUpdateRequestRequiredDegree2["Master"] = 7] = "Master";
      CombinedUpdateRequestRequiredDegree2[CombinedUpdateRequestRequiredDegree2["Phd"] = 8] = "Phd";
      CombinedUpdateRequestRequiredDegree2[CombinedUpdateRequestRequiredDegree2["NoLimit"] = 20] = "NoLimit";
    })(CombinedUpdateRequestRequiredDegree = Job2.CombinedUpdateRequestRequiredDegree || (Job2.CombinedUpdateRequestRequiredDegree = {}));
    let CombinedUpdateRequestJobAttribute;
    ((CombinedUpdateRequestJobAttribute2) => {
      CombinedUpdateRequestJobAttribute2[CombinedUpdateRequestJobAttribute2["Concrete"] = 1] = "Concrete";
      CombinedUpdateRequestJobAttribute2[CombinedUpdateRequestJobAttribute2["Virtual"] = 2] = "Virtual";
    })(CombinedUpdateRequestJobAttribute = Job2.CombinedUpdateRequestJobAttribute || (Job2.CombinedUpdateRequestJobAttribute = {}));
    let Manager;
    ((Manager2) => {
      let BatchUpdateRequestUpdateOption;
      ((BatchUpdateRequestUpdateOption2) => {
        BatchUpdateRequestUpdateOption2[BatchUpdateRequestUpdateOption2["JobManager"] = 1] = "JobManager";
        BatchUpdateRequestUpdateOption2[BatchUpdateRequestUpdateOption2["Assistant"] = 2] = "Assistant";
        BatchUpdateRequestUpdateOption2[BatchUpdateRequestUpdateOption2["HireManager"] = 3] = "HireManager";
      })(BatchUpdateRequestUpdateOption = Manager2.BatchUpdateRequestUpdateOption || (Manager2.BatchUpdateRequestUpdateOption = {}));
    })(Manager = Job2.Manager || (Job2.Manager = {}));
  })(Job = Hire2.Job || (Hire2.Job = {}));
  let JobRequirement;
  ((JobRequirement2) => {
    let CreateRequestDisplayProgress;
    ((CreateRequestDisplayProgress2) => {
      CreateRequestDisplayProgress2[CreateRequestDisplayProgress2["WaitingStart"] = 1] = "WaitingStart";
      CreateRequestDisplayProgress2[CreateRequestDisplayProgress2["OnGoing"] = 2] = "OnGoing";
      CreateRequestDisplayProgress2[CreateRequestDisplayProgress2["Canceled"] = 3] = "Canceled";
      CreateRequestDisplayProgress2[CreateRequestDisplayProgress2["Suspended"] = 4] = "Suspended";
      CreateRequestDisplayProgress2[CreateRequestDisplayProgress2["Completed"] = 5] = "Completed";
      CreateRequestDisplayProgress2[CreateRequestDisplayProgress2["Expired"] = 6] = "Expired";
    })(CreateRequestDisplayProgress = JobRequirement2.CreateRequestDisplayProgress || (JobRequirement2.CreateRequestDisplayProgress = {}));
    let CreateRequestCategory;
    ((CreateRequestCategory2) => {
      CreateRequestCategory2[CreateRequestCategory2["Addition"] = 1] = "Addition";
      CreateRequestCategory2[CreateRequestCategory2["Replacement"] = 2] = "Replacement";
    })(CreateRequestCategory = JobRequirement2.CreateRequestCategory || (JobRequirement2.CreateRequestCategory = {}));
    let CreateRequestPriority;
    ((CreateRequestPriority2) => {
      CreateRequestPriority2[CreateRequestPriority2["High"] = 1] = "High";
      CreateRequestPriority2[CreateRequestPriority2["Medium"] = 2] = "Medium";
      CreateRequestPriority2[CreateRequestPriority2["Low"] = 3] = "Low";
    })(CreateRequestPriority = JobRequirement2.CreateRequestPriority || (JobRequirement2.CreateRequestPriority = {}));
    let CreateRequestRequiredDegree;
    ((CreateRequestRequiredDegree2) => {
      CreateRequestRequiredDegree2[CreateRequestRequiredDegree2["PrimaryEducation"] = 1] = "PrimaryEducation";
      CreateRequestRequiredDegree2[CreateRequestRequiredDegree2["JuniorMiddleSchoolEducation"] = 2] = "JuniorMiddleSchoolEducation";
      CreateRequestRequiredDegree2[CreateRequestRequiredDegree2["Secondary"] = 3] = "Secondary";
      CreateRequestRequiredDegree2[CreateRequestRequiredDegree2["SeniorSchoolGraduates"] = 4] = "SeniorSchoolGraduates";
      CreateRequestRequiredDegree2[CreateRequestRequiredDegree2["Associate"] = 5] = "Associate";
      CreateRequestRequiredDegree2[CreateRequestRequiredDegree2["Bachelor"] = 6] = "Bachelor";
      CreateRequestRequiredDegree2[CreateRequestRequiredDegree2["Master"] = 7] = "Master";
      CreateRequestRequiredDegree2[CreateRequestRequiredDegree2["Phd"] = 8] = "Phd";
      CreateRequestRequiredDegree2[CreateRequestRequiredDegree2["NoLimit"] = 20] = "NoLimit";
    })(CreateRequestRequiredDegree = JobRequirement2.CreateRequestRequiredDegree || (JobRequirement2.CreateRequestRequiredDegree = {}));
    let CreateRequestProcessType;
    ((CreateRequestProcessType2) => {
      CreateRequestProcessType2[CreateRequestProcessType2["Social"] = 1] = "Social";
      CreateRequestProcessType2[CreateRequestProcessType2["Campus"] = 2] = "Campus";
    })(CreateRequestProcessType = JobRequirement2.CreateRequestProcessType || (JobRequirement2.CreateRequestProcessType = {}));
    let UpdateRequestDisplayProgress;
    ((UpdateRequestDisplayProgress2) => {
      UpdateRequestDisplayProgress2[UpdateRequestDisplayProgress2["WaitingStart"] = 1] = "WaitingStart";
      UpdateRequestDisplayProgress2[UpdateRequestDisplayProgress2["OnGoing"] = 2] = "OnGoing";
      UpdateRequestDisplayProgress2[UpdateRequestDisplayProgress2["Canceled"] = 3] = "Canceled";
      UpdateRequestDisplayProgress2[UpdateRequestDisplayProgress2["Suspended"] = 4] = "Suspended";
      UpdateRequestDisplayProgress2[UpdateRequestDisplayProgress2["Completed"] = 5] = "Completed";
      UpdateRequestDisplayProgress2[UpdateRequestDisplayProgress2["Expired"] = 6] = "Expired";
    })(UpdateRequestDisplayProgress = JobRequirement2.UpdateRequestDisplayProgress || (JobRequirement2.UpdateRequestDisplayProgress = {}));
    let UpdateRequestCategory;
    ((UpdateRequestCategory2) => {
      UpdateRequestCategory2[UpdateRequestCategory2["Addition"] = 1] = "Addition";
      UpdateRequestCategory2[UpdateRequestCategory2["Replacement"] = 2] = "Replacement";
    })(UpdateRequestCategory = JobRequirement2.UpdateRequestCategory || (JobRequirement2.UpdateRequestCategory = {}));
    let UpdateRequestPriority;
    ((UpdateRequestPriority2) => {
      UpdateRequestPriority2[UpdateRequestPriority2["High"] = 1] = "High";
      UpdateRequestPriority2[UpdateRequestPriority2["Medium"] = 2] = "Medium";
      UpdateRequestPriority2[UpdateRequestPriority2["Low"] = 3] = "Low";
    })(UpdateRequestPriority = JobRequirement2.UpdateRequestPriority || (JobRequirement2.UpdateRequestPriority = {}));
    let UpdateRequestRequiredDegree;
    ((UpdateRequestRequiredDegree2) => {
      UpdateRequestRequiredDegree2[UpdateRequestRequiredDegree2["PrimaryEducation"] = 1] = "PrimaryEducation";
      UpdateRequestRequiredDegree2[UpdateRequestRequiredDegree2["JuniorMiddleSchoolEducation"] = 2] = "JuniorMiddleSchoolEducation";
      UpdateRequestRequiredDegree2[UpdateRequestRequiredDegree2["Secondary"] = 3] = "Secondary";
      UpdateRequestRequiredDegree2[UpdateRequestRequiredDegree2["SeniorSchoolGraduates"] = 4] = "SeniorSchoolGraduates";
      UpdateRequestRequiredDegree2[UpdateRequestRequiredDegree2["Associate"] = 5] = "Associate";
      UpdateRequestRequiredDegree2[UpdateRequestRequiredDegree2["Bachelor"] = 6] = "Bachelor";
      UpdateRequestRequiredDegree2[UpdateRequestRequiredDegree2["Master"] = 7] = "Master";
      UpdateRequestRequiredDegree2[UpdateRequestRequiredDegree2["Phd"] = 8] = "Phd";
      UpdateRequestRequiredDegree2[UpdateRequestRequiredDegree2["NoLimit"] = 20] = "NoLimit";
    })(UpdateRequestRequiredDegree = JobRequirement2.UpdateRequestRequiredDegree || (JobRequirement2.UpdateRequestRequiredDegree = {}));
    let UpdateRequestProcessType;
    ((UpdateRequestProcessType2) => {
      UpdateRequestProcessType2[UpdateRequestProcessType2["Social"] = 1] = "Social";
      UpdateRequestProcessType2[UpdateRequestProcessType2["Campus"] = 2] = "Campus";
    })(UpdateRequestProcessType = JobRequirement2.UpdateRequestProcessType || (JobRequirement2.UpdateRequestProcessType = {}));
  })(JobRequirement = Hire2.JobRequirement || (Hire2.JobRequirement = {}));
  let RegistrationSchema;
  ((RegistrationSchema2) => {
    let ListQueryScenario;
    ((ListQueryScenario2) => {
      ListQueryScenario2[ListQueryScenario2["InterviewRegistration"] = 5] = "InterviewRegistration";
      ListQueryScenario2[ListQueryScenario2["OnboardRegistration"] = 6] = "OnboardRegistration";
      ListQueryScenario2[ListQueryScenario2["InfoUpdateRegistration"] = 14] = "InfoUpdateRegistration";
    })(ListQueryScenario = RegistrationSchema2.ListQueryScenario || (RegistrationSchema2.ListQueryScenario = {}));
  })(RegistrationSchema = Hire2.RegistrationSchema || (Hire2.RegistrationSchema = {}));
  let Interviewer;
  ((Interviewer2) => {
    let ListQueryVerifyStatus;
    ((ListQueryVerifyStatus2) => {
      ListQueryVerifyStatus2[ListQueryVerifyStatus2["NotVarified"] = 1] = "NotVarified";
      ListQueryVerifyStatus2[ListQueryVerifyStatus2["Varified"] = 2] = "Varified";
    })(ListQueryVerifyStatus = Interviewer2.ListQueryVerifyStatus || (Interviewer2.ListQueryVerifyStatus = {}));
  })(Interviewer = Hire2.Interviewer || (Hire2.Interviewer = {}));
  let ReferralWebsite;
  ((ReferralWebsite2) => {
    let JobPost;
    ((JobPost2) => {
      let ListQueryProcessType;
      ((ListQueryProcessType2) => {
        ListQueryProcessType2[ListQueryProcessType2["SocialProcess"] = 1] = "SocialProcess";
        ListQueryProcessType2[ListQueryProcessType2["CampusProcess"] = 2] = "CampusProcess";
      })(ListQueryProcessType = JobPost2.ListQueryProcessType || (JobPost2.ListQueryProcessType = {}));
    })(JobPost = ReferralWebsite2.JobPost || (ReferralWebsite2.JobPost = {}));
  })(ReferralWebsite = Hire2.ReferralWebsite || (Hire2.ReferralWebsite = {}));
  let Agency;
  ((Agency2) => {
    let GetAgencyAccountRequestStatus;
    ((GetAgencyAccountRequestStatus2) => {
      GetAgencyAccountRequestStatus2[GetAgencyAccountRequestStatus2["Normal"] = 0] = "Normal";
      GetAgencyAccountRequestStatus2[GetAgencyAccountRequestStatus2["Enabled"] = 1] = "Enabled";
      GetAgencyAccountRequestStatus2[GetAgencyAccountRequestStatus2["DisabledBySupplier"] = 2] = "DisabledBySupplier";
    })(GetAgencyAccountRequestStatus = Agency2.GetAgencyAccountRequestStatus || (Agency2.GetAgencyAccountRequestStatus = {}));
    let GetAgencyAccountRequestRole;
    ((GetAgencyAccountRequestRole2) => {
      GetAgencyAccountRequestRole2[GetAgencyAccountRequestRole2["Manager"] = 0] = "Manager";
      GetAgencyAccountRequestRole2[GetAgencyAccountRequestRole2["Consultant"] = 1] = "Consultant";
    })(GetAgencyAccountRequestRole = Agency2.GetAgencyAccountRequestRole || (Agency2.GetAgencyAccountRequestRole = {}));
    let OperateAgencyAccountRequestOption;
    ((OperateAgencyAccountRequestOption2) => {
      OperateAgencyAccountRequestOption2[OperateAgencyAccountRequestOption2["Add"] = 1] = "Add";
      OperateAgencyAccountRequestOption2[OperateAgencyAccountRequestOption2["Remove"] = 2] = "Remove";
    })(OperateAgencyAccountRequestOption = Agency2.OperateAgencyAccountRequestOption || (Agency2.OperateAgencyAccountRequestOption = {}));
  })(Agency = Hire2.Agency || (Hire2.Agency = {}));
  let Talent;
  ((Talent2) => {
    let OnboardStatusRequestOperation;
    ((OnboardStatusRequestOperation2) => {
      OnboardStatusRequestOperation2[OnboardStatusRequestOperation2["Onboard"] = 1] = "Onboard";
      OnboardStatusRequestOperation2[OnboardStatusRequestOperation2["Overboard"] = 2] = "Overboard";
    })(OnboardStatusRequestOperation = Talent2.OnboardStatusRequestOperation || (Talent2.OnboardStatusRequestOperation = {}));
  })(Talent = Hire2.Talent || (Hire2.Talent = {}));
  let ExternalApplication;
  ((ExternalApplication2) => {
    let CreateRequestJobRecruitmentType;
    ((CreateRequestJobRecruitmentType2) => {
      CreateRequestJobRecruitmentType2[CreateRequestJobRecruitmentType2["SocialRecruitment"] = 1] = "SocialRecruitment";
      CreateRequestJobRecruitmentType2[CreateRequestJobRecruitmentType2["CampusRecruitment"] = 2] = "CampusRecruitment";
    })(CreateRequestJobRecruitmentType = ExternalApplication2.CreateRequestJobRecruitmentType || (ExternalApplication2.CreateRequestJobRecruitmentType = {}));
    let CreateRequestDeliveryType;
    ((CreateRequestDeliveryType2) => {
      CreateRequestDeliveryType2[CreateRequestDeliveryType2["HRVisit"] = 1] = "HRVisit";
      CreateRequestDeliveryType2[CreateRequestDeliveryType2["CandidateDelivery"] = 2] = "CandidateDelivery";
      CreateRequestDeliveryType2[CreateRequestDeliveryType2["TalentRecommend"] = 3] = "TalentRecommend";
      CreateRequestDeliveryType2[CreateRequestDeliveryType2["Others"] = 4] = "Others";
    })(CreateRequestDeliveryType = ExternalApplication2.CreateRequestDeliveryType || (ExternalApplication2.CreateRequestDeliveryType = {}));
    let UpdateRequestJobRecruitmentType;
    ((UpdateRequestJobRecruitmentType2) => {
      UpdateRequestJobRecruitmentType2[UpdateRequestJobRecruitmentType2["SocialRecruitment"] = 1] = "SocialRecruitment";
      UpdateRequestJobRecruitmentType2[UpdateRequestJobRecruitmentType2["CampusRecruitment"] = 2] = "CampusRecruitment";
    })(UpdateRequestJobRecruitmentType = ExternalApplication2.UpdateRequestJobRecruitmentType || (ExternalApplication2.UpdateRequestJobRecruitmentType = {}));
    let UpdateRequestDeliveryType;
    ((UpdateRequestDeliveryType2) => {
      UpdateRequestDeliveryType2[UpdateRequestDeliveryType2["HRVisit"] = 1] = "HRVisit";
      UpdateRequestDeliveryType2[UpdateRequestDeliveryType2["CandidateDelivery"] = 2] = "CandidateDelivery";
      UpdateRequestDeliveryType2[UpdateRequestDeliveryType2["TalentRecommend"] = 3] = "TalentRecommend";
      UpdateRequestDeliveryType2[UpdateRequestDeliveryType2["Others"] = 4] = "Others";
    })(UpdateRequestDeliveryType = ExternalApplication2.UpdateRequestDeliveryType || (ExternalApplication2.UpdateRequestDeliveryType = {}));
  })(ExternalApplication = Hire2.ExternalApplication || (Hire2.ExternalApplication = {}));
  let ExternalInterview;
  ((ExternalInterview2) => {
    let CreateRequestParticipateStatus;
    ((CreateRequestParticipateStatus2) => {
      CreateRequestParticipateStatus2[CreateRequestParticipateStatus2["NotStart"] = 1] = "NotStart";
      CreateRequestParticipateStatus2[CreateRequestParticipateStatus2["Participated"] = 2] = "Participated";
      CreateRequestParticipateStatus2[CreateRequestParticipateStatus2["NotPaticipated"] = 3] = "NotPaticipated";
    })(CreateRequestParticipateStatus = ExternalInterview2.CreateRequestParticipateStatus || (ExternalInterview2.CreateRequestParticipateStatus = {}));
    let UpdateRequestParticipateStatus;
    ((UpdateRequestParticipateStatus2) => {
      UpdateRequestParticipateStatus2[UpdateRequestParticipateStatus2["NotStart"] = 1] = "NotStart";
      UpdateRequestParticipateStatus2[UpdateRequestParticipateStatus2["Participated"] = 2] = "Participated";
      UpdateRequestParticipateStatus2[UpdateRequestParticipateStatus2["NotPaticipated"] = 3] = "NotPaticipated";
    })(UpdateRequestParticipateStatus = ExternalInterview2.UpdateRequestParticipateStatus || (ExternalInterview2.UpdateRequestParticipateStatus = {}));
  })(ExternalInterview = Hire2.ExternalInterview || (Hire2.ExternalInterview = {}));
  let ExternalInterviewAssessment;
  ((ExternalInterviewAssessment2) => {
    let CreateRequestConclusion;
    ((CreateRequestConclusion2) => {
      CreateRequestConclusion2[CreateRequestConclusion2["Fail"] = 1] = "Fail";
      CreateRequestConclusion2[CreateRequestConclusion2["Pass"] = 2] = "Pass";
      CreateRequestConclusion2[CreateRequestConclusion2["ToBeDetermined"] = 3] = "ToBeDetermined";
    })(CreateRequestConclusion = ExternalInterviewAssessment2.CreateRequestConclusion || (ExternalInterviewAssessment2.CreateRequestConclusion = {}));
    let PatchRequestConclusion;
    ((PatchRequestConclusion2) => {
      PatchRequestConclusion2[PatchRequestConclusion2["Fail"] = 1] = "Fail";
      PatchRequestConclusion2[PatchRequestConclusion2["Pass"] = 2] = "Pass";
      PatchRequestConclusion2[PatchRequestConclusion2["ToBeDetermined"] = 3] = "ToBeDetermined";
    })(PatchRequestConclusion = ExternalInterviewAssessment2.PatchRequestConclusion || (ExternalInterviewAssessment2.PatchRequestConclusion = {}));
  })(ExternalInterviewAssessment = Hire2.ExternalInterviewAssessment || (Hire2.ExternalInterviewAssessment = {}));
  let ExternalReferralReward;
  ((ExternalReferralReward2) => {
    let CreateRequestRuleType;
    ((CreateRequestRuleType2) => {
      CreateRequestRuleType2[CreateRequestRuleType2["Onboard"] = 1] = "Onboard";
      CreateRequestRuleType2[CreateRequestRuleType2["Processe"] = 2] = "Processe";
      CreateRequestRuleType2[CreateRequestRuleType2["Active"] = 3] = "Active";
      CreateRequestRuleType2[CreateRequestRuleType2["OpenSource"] = 4] = "OpenSource";
      CreateRequestRuleType2[CreateRequestRuleType2["Other"] = 5] = "Other";
    })(CreateRequestRuleType = ExternalReferralReward2.CreateRequestRuleType || (ExternalReferralReward2.CreateRequestRuleType = {}));
    let CreateRequestStage;
    ((CreateRequestStage2) => {
      CreateRequestStage2[CreateRequestStage2["ToBeConfirmed"] = 1] = "ToBeConfirmed";
      CreateRequestStage2[CreateRequestStage2["Confirmed"] = 2] = "Confirmed";
      CreateRequestStage2[CreateRequestStage2["Paid"] = 3] = "Paid";
    })(CreateRequestStage = ExternalReferralReward2.CreateRequestStage || (ExternalReferralReward2.CreateRequestStage = {}));
  })(ExternalReferralReward = Hire2.ExternalReferralReward || (Hire2.ExternalReferralReward = {}));
  let TalentPool;
  ((TalentPool2) => {
    let BatchChangeTalentPoolRequestOptionType;
    ((BatchChangeTalentPoolRequestOptionType2) => {
      BatchChangeTalentPoolRequestOptionType2[BatchChangeTalentPoolRequestOptionType2["Add"] = 1] = "Add";
      BatchChangeTalentPoolRequestOptionType2[BatchChangeTalentPoolRequestOptionType2["Remove"] = 2] = "Remove";
    })(BatchChangeTalentPoolRequestOptionType = TalentPool2.BatchChangeTalentPoolRequestOptionType || (TalentPool2.BatchChangeTalentPoolRequestOptionType = {}));
    let MoveTalentRequestAddType;
    ((MoveTalentRequestAddType2) => {
      MoveTalentRequestAddType2[MoveTalentRequestAddType2["OnlyAdd"] = 1] = "OnlyAdd";
      MoveTalentRequestAddType2[MoveTalentRequestAddType2["AddAndRemoveFromOrigin"] = 2] = "AddAndRemoveFromOrigin";
    })(MoveTalentRequestAddType = TalentPool2.MoveTalentRequestAddType || (TalentPool2.MoveTalentRequestAddType = {}));
  })(TalentPool = Hire2.TalentPool || (Hire2.TalentPool = {}));
  let TalentBlocklist;
  ((TalentBlocklist2) => {
    let ChangeTalentBlockRequestOption;
    ((ChangeTalentBlockRequestOption2) => {
      ChangeTalentBlockRequestOption2[ChangeTalentBlockRequestOption2["Add"] = 1] = "Add";
      ChangeTalentBlockRequestOption2[ChangeTalentBlockRequestOption2["Remove"] = 2] = "Remove";
    })(ChangeTalentBlockRequestOption = TalentBlocklist2.ChangeTalentBlockRequestOption || (TalentBlocklist2.ChangeTalentBlockRequestOption = {}));
  })(TalentBlocklist = Hire2.TalentBlocklist || (Hire2.TalentBlocklist = {}));
  let InterviewRecord;
  ((InterviewRecord2) => {
    let Attachment;
    ((Attachment2) => {
      let GetQueryLanguage;
      ((GetQueryLanguage2) => {
        GetQueryLanguage2[GetQueryLanguage2["Zh"] = 1] = "Zh";
        GetQueryLanguage2[GetQueryLanguage2["En"] = 2] = "En";
      })(GetQueryLanguage = Attachment2.GetQueryLanguage || (Attachment2.GetQueryLanguage = {}));
    })(Attachment = InterviewRecord2.Attachment || (InterviewRecord2.Attachment = {}));
  })(InterviewRecord = Hire2.InterviewRecord || (Hire2.InterviewRecord = {}));
  let Offer;
  ((Offer2) => {
    let OfferStatusRequestOfferStatus;
    ((OfferStatusRequestOfferStatus2) => {
      OfferStatusRequestOfferStatus2[OfferStatusRequestOfferStatus2["Approving"] = 2] = "Approving";
      OfferStatusRequestOfferStatus2[OfferStatusRequestOfferStatus2["Withdrawn"] = 3] = "Withdrawn";
      OfferStatusRequestOfferStatus2[OfferStatusRequestOfferStatus2["Approved"] = 4] = "Approved";
      OfferStatusRequestOfferStatus2[OfferStatusRequestOfferStatus2["Rejected"] = 5] = "Rejected";
      OfferStatusRequestOfferStatus2[OfferStatusRequestOfferStatus2["OfferLetterSent"] = 6] = "OfferLetterSent";
      OfferStatusRequestOfferStatus2[OfferStatusRequestOfferStatus2["OfferAccepted"] = 7] = "OfferAccepted";
      OfferStatusRequestOfferStatus2[OfferStatusRequestOfferStatus2["OfferRejected"] = 8] = "OfferRejected";
      OfferStatusRequestOfferStatus2[OfferStatusRequestOfferStatus2["Obsolete"] = 9] = "Obsolete";
      OfferStatusRequestOfferStatus2[OfferStatusRequestOfferStatus2["NoApproval"] = 10] = "NoApproval";
    })(OfferStatusRequestOfferStatus = Offer2.OfferStatusRequestOfferStatus || (Offer2.OfferStatusRequestOfferStatus = {}));
  })(Offer = Hire2.Offer || (Hire2.Offer = {}));
  let TripartiteAgreement;
  ((TripartiteAgreement2) => {
    let CreateRequestState;
    ((CreateRequestState2) => {
      CreateRequestState2[CreateRequestState2["NotStarted"] = 1] = "NotStarted";
      CreateRequestState2[CreateRequestState2["Applied"] = 2] = "Applied";
      CreateRequestState2[CreateRequestState2["StudentProcessing"] = 3] = "StudentProcessing";
      CreateRequestState2[CreateRequestState2["CompanyProcessing"] = 4] = "CompanyProcessing";
      CreateRequestState2[CreateRequestState2["SchoolProcessing"] = 5] = "SchoolProcessing";
      CreateRequestState2[CreateRequestState2["Ended"] = 6] = "Ended";
      CreateRequestState2[CreateRequestState2["Completed"] = 7] = "Completed";
      CreateRequestState2[CreateRequestState2["TerminationProcessing"] = 8] = "TerminationProcessing";
      CreateRequestState2[CreateRequestState2["Terminated"] = 9] = "Terminated";
    })(CreateRequestState = TripartiteAgreement2.CreateRequestState || (TripartiteAgreement2.CreateRequestState = {}));
    let UpdateRequestState;
    ((UpdateRequestState2) => {
      UpdateRequestState2[UpdateRequestState2["NotStarted"] = 1] = "NotStarted";
      UpdateRequestState2[UpdateRequestState2["Applied"] = 2] = "Applied";
      UpdateRequestState2[UpdateRequestState2["StudentProcessing"] = 3] = "StudentProcessing";
      UpdateRequestState2[UpdateRequestState2["CompanyProcessing"] = 4] = "CompanyProcessing";
      UpdateRequestState2[UpdateRequestState2["SchoolProcessing"] = 5] = "SchoolProcessing";
      UpdateRequestState2[UpdateRequestState2["Ended"] = 6] = "Ended";
      UpdateRequestState2[UpdateRequestState2["Completed"] = 7] = "Completed";
      UpdateRequestState2[UpdateRequestState2["TerminationProcessing"] = 8] = "TerminationProcessing";
      UpdateRequestState2[UpdateRequestState2["Terminated"] = 9] = "Terminated";
    })(UpdateRequestState = TripartiteAgreement2.UpdateRequestState || (TripartiteAgreement2.UpdateRequestState = {}));
  })(TripartiteAgreement = Hire2.TripartiteAgreement || (Hire2.TripartiteAgreement = {}));
  let Employee;
  ((Employee2) => {
    let PatchRequestOperation;
    ((PatchRequestOperation2) => {
      PatchRequestOperation2[PatchRequestOperation2["Convert"] = 1] = "Convert";
      PatchRequestOperation2[PatchRequestOperation2["Overboard"] = 2] = "Overboard";
    })(PatchRequestOperation = Employee2.PatchRequestOperation || (Employee2.PatchRequestOperation = {}));
  })(Employee = Hire2.Employee || (Hire2.Employee = {}));
  let Note;
  ((Note2) => {
    let CreateRequestPrivacy;
    ((CreateRequestPrivacy2) => {
      CreateRequestPrivacy2[CreateRequestPrivacy2["Private"] = 1] = "Private";
      CreateRequestPrivacy2[CreateRequestPrivacy2["Public"] = 2] = "Public";
    })(CreateRequestPrivacy = Note2.CreateRequestPrivacy || (Note2.CreateRequestPrivacy = {}));
  })(Note = Hire2.Note || (Hire2.Note = {}));
  let ReferralAccount;
  ((ReferralAccount2) => {
    let WithdrawRequestWithdrawBonusType;
    ((WithdrawRequestWithdrawBonusType2) => {
      WithdrawRequestWithdrawBonusType2[WithdrawRequestWithdrawBonusType2["Point"] = 1] = "Point";
      WithdrawRequestWithdrawBonusType2[WithdrawRequestWithdrawBonusType2["Cash"] = 2] = "Cash";
    })(WithdrawRequestWithdrawBonusType = ReferralAccount2.WithdrawRequestWithdrawBonusType || (ReferralAccount2.WithdrawRequestWithdrawBonusType = {}));
  })(ReferralAccount = Hire2.ReferralAccount || (Hire2.ReferralAccount = {}));
  let OfferSchema;
  ((OfferSchema2) => {
    let GetResponseScenario;
    ((GetResponseScenario2) => {
      GetResponseScenario2[GetResponseScenario2["ApplyOffer"] = 1] = "ApplyOffer";
    })(GetResponseScenario = OfferSchema2.GetResponseScenario || (OfferSchema2.GetResponseScenario = {}));
  })(OfferSchema = Hire2.OfferSchema || (Hire2.OfferSchema = {}));
})(Hire || (Hire = {}));
Internal.define({
  "/hire/v1/locations/query": {
    POST: { name: "hire.location.query", pagination: { argIndex: 1 } }
  },
  "/hire/v1/locations": {
    GET: { name: "hire.location.list", pagination: { argIndex: 0 } }
  },
  "/hire/v1/roles/{role_id}": {
    GET: "hire.role.get"
  },
  "/hire/v1/roles": {
    GET: { name: "hire.role.list", pagination: { argIndex: 0 } }
  },
  "/hire/v1/user_roles": {
    GET: { name: "hire.userRole.list", pagination: { argIndex: 0 } }
  },
  "/hire/v1/jobs/combined_create": {
    POST: "hire.job.combinedCreate"
  },
  "/hire/v1/jobs/{job_id}/combined_update": {
    POST: "hire.job.combinedUpdate"
  },
  "/hire/v1/jobs/{job_id}/update_config": {
    POST: "hire.job.updateConfig"
  },
  "/hire/v1/jobs/{job_id}/managers/batch_update": {
    POST: "hire.job.manager.batchUpdate"
  },
  "/hire/v1/jobs/{job_id}/get_detail": {
    GET: "hire.job.getDetail"
  },
  "/hire/v1/jobs/{job_id}": {
    GET: "hire.job.get"
  },
  "/hire/v1/jobs/{job_id}/recruiter": {
    GET: "hire.job.recruiter"
  },
  "/hire/v1/jobs/{job_id}/config": {
    GET: "hire.job.config"
  },
  "/hire/v1/jobs": {
    GET: { name: "hire.job.list", pagination: { argIndex: 0 } }
  },
  "/hire/v1/jobs/{job_id}/close": {
    POST: "hire.job.close"
  },
  "/hire/v1/jobs/{job_id}/open": {
    POST: "hire.job.open"
  },
  "/hire/v1/job_schemas": {
    GET: { name: "hire.jobSchema.list", pagination: { argIndex: 0 } }
  },
  "/hire/v1/advertisements/{advertisement_id}/publish": {
    POST: "hire.advertisement.publish"
  },
  "/hire/v1/job_publish_records/search": {
    POST: { name: "hire.jobPublishRecord.search", pagination: { argIndex: 1 } }
  },
  "/hire/v1/job_functions": {
    GET: { name: "hire.jobFunction.list", pagination: { argIndex: 0 } }
  },
  "/hire/v1/job_types": {
    GET: { name: "hire.jobType.list", pagination: { argIndex: 0 } }
  },
  "/hire/v1/job_requirements": {
    POST: "hire.jobRequirement.create",
    GET: { name: "hire.jobRequirement.list", pagination: { argIndex: 0 } }
  },
  "/hire/v1/job_requirements/{job_requirement_id}": {
    PUT: "hire.jobRequirement.update",
    DELETE: "hire.jobRequirement.delete"
  },
  "/hire/v1/job_requirements/search": {
    POST: "hire.jobRequirement.listById"
  },
  "/hire/v1/job_requirement_schemas": {
    GET: { name: "hire.jobRequirementSchema.list", pagination: { argIndex: 0 } }
  },
  "/hire/v1/job_processes": {
    GET: { name: "hire.jobProcess.list", pagination: { argIndex: 0 } }
  },
  "/hire/v1/subjects": {
    GET: { name: "hire.subject.list", pagination: { argIndex: 0 } }
  },
  "/hire/v1/talent_tags": {
    GET: { name: "hire.talentTag.list", pagination: { argIndex: 0 } }
  },
  "/hire/v1/registration_schemas": {
    GET: { name: "hire.registrationSchema.list", pagination: { argIndex: 0 } }
  },
  "/hire/v1/interview_feedback_forms": {
    GET: { name: "hire.interviewFeedbackForm.list", pagination: { argIndex: 0 } }
  },
  "/hire/v1/interview_round_types": {
    GET: "hire.interviewRoundType.list"
  },
  "/hire/v1/interview_registration_schemas": {
    GET: { name: "hire.interviewRegistrationSchema.list", pagination: { argIndex: 0 } }
  },
  "/hire/v1/interviewers": {
    GET: { name: "hire.interviewer.list", pagination: { argIndex: 0 } }
  },
  "/hire/v1/interviewers/{interviewer_id}": {
    PATCH: "hire.interviewer.patch"
  },
  "/hire/v1/offer_approval_templates": {
    GET: { name: "hire.offerApprovalTemplate.list", pagination: { argIndex: 0 } }
  },
  "/hire/v1/offer_custom_fields/{offer_custom_field_id}": {
    PUT: "hire.offerCustomField.update"
  },
  "/hire/v1/offer_application_forms/{offer_application_form_id}": {
    GET: "hire.offerApplicationForm.get"
  },
  "/hire/v1/offer_application_forms": {
    GET: { name: "hire.offerApplicationForm.list", pagination: { argIndex: 0 } }
  },
  "/hire/v1/referrals/search": {
    POST: "hire.referral.search"
  },
  "/hire/v1/referral_websites/job_posts": {
    GET: { name: "hire.referralWebsite.jobPost.list", pagination: { argIndex: 0 } }
  },
  "/hire/v1/referral_websites/job_posts/{job_post_id}": {
    GET: "hire.referralWebsite.jobPost.get"
  },
  "/hire/v1/referrals/get_by_application": {
    GET: "hire.referral.getByApplication"
  },
  "/hire/v1/portal_apply_schemas": {
    GET: { name: "hire.portalApplySchema.list", pagination: { argIndex: 0 } }
  },
  "/hire/v1/websites/{website_id}/channels": {
    POST: "hire.website.channel.create",
    GET: { name: "hire.website.channel.list", pagination: { argIndex: 1, itemsKey: "website_channel_list" } }
  },
  "/hire/v1/websites/{website_id}/channels/{channel_id}": {
    DELETE: "hire.website.channel.delete",
    PUT: "hire.website.channel.update"
  },
  "/hire/v1/websites/{website_id}/site_users": {
    POST: "hire.website.siteUser.create"
  },
  "/hire/v1/websites/{website_id}/job_posts/{job_post_id}": {
    GET: "hire.website.jobPost.get"
  },
  "/hire/v1/websites/{website_id}/job_posts/search": {
    POST: { name: "hire.website.jobPost.search", pagination: { argIndex: 2 } }
  },
  "/hire/v1/websites/{website_id}/job_posts": {
    GET: { name: "hire.website.jobPost.list", pagination: { argIndex: 1 } }
  },
  "/hire/v1/websites/{website_id}/deliveries/create_by_resume": {
    POST: "hire.website.delivery.createByResume"
  },
  "/hire/v1/websites/{website_id}/deliveries/create_by_attachment": {
    POST: "hire.website.delivery.createByAttachment"
  },
  "/hire/v1/websites/{website_id}/delivery_tasks/{delivery_task_id}": {
    GET: "hire.website.deliveryTask.get"
  },
  "/hire/v1/websites": {
    GET: { name: "hire.website.list", pagination: { argIndex: 0 } }
  },
  "/hire/v1/agencies/protect": {
    POST: "hire.agency.protect"
  },
  "/hire/v1/agencies/{agency_id}": {
    GET: "hire.agency.get"
  },
  "/hire/v1/agencies/protection_period/search": {
    POST: "hire.agency.protectSearch"
  },
  "/hire/v1/agencies/query": {
    GET: "hire.agency.query"
  },
  "/hire/v1/agencies/get_agency_account": {
    POST: { name: "hire.agency.getAgencyAccount", pagination: { argIndex: 1 } }
  },
  "/hire/v1/agencies/batch_query": {
    POST: { name: "hire.agency.batchQuery", pagination: { argIndex: 1 } }
  },
  "/hire/v1/agencies/operate_agency_account": {
    POST: "hire.agency.operateAgencyAccount"
  },
  "/hire/v1/talents/{talent_id}/external_info": {
    POST: "hire.talent.externalInfo.create",
    PUT: "hire.talent.externalInfo.update"
  },
  "/hire/v1/external_applications": {
    POST: "hire.externalApplication.create",
    GET: { name: "hire.externalApplication.list", pagination: { argIndex: 0 } }
  },
  "/hire/v1/external_applications/{external_application_id}": {
    PUT: "hire.externalApplication.update",
    DELETE: "hire.externalApplication.delete"
  },
  "/hire/v1/external_interviews": {
    POST: "hire.externalInterview.create"
  },
  "/hire/v1/external_interviews/{external_interview_id}": {
    PUT: "hire.externalInterview.update",
    DELETE: "hire.externalInterview.delete"
  },
  "/hire/v1/external_interviews/batch_query": {
    POST: { name: "hire.externalInterview.batchQuery", pagination: { argIndex: 1 } }
  },
  "/hire/v1/external_interview_assessments": {
    POST: "hire.externalInterviewAssessment.create"
  },
  "/hire/v1/external_interview_assessments/{external_interview_assessment_id}": {
    PATCH: "hire.externalInterviewAssessment.patch"
  },
  "/hire/v1/external_offers": {
    POST: "hire.externalOffer.create"
  },
  "/hire/v1/external_offers/{external_offer_id}": {
    PUT: "hire.externalOffer.update",
    DELETE: "hire.externalOffer.delete"
  },
  "/hire/v1/external_offers/batch_query": {
    POST: { name: "hire.externalOffer.batchQuery", pagination: { argIndex: 1 } }
  },
  "/hire/v1/external_background_checks": {
    POST: "hire.externalBackgroundCheck.create"
  },
  "/hire/v1/external_background_checks/{external_background_check_id}": {
    PUT: "hire.externalBackgroundCheck.update",
    DELETE: "hire.externalBackgroundCheck.delete"
  },
  "/hire/v1/external_background_checks/batch_query": {
    POST: { name: "hire.externalBackgroundCheck.batchQuery", pagination: { argIndex: 1 } }
  },
  "/hire/v1/external_referral_rewards": {
    POST: "hire.externalReferralReward.create"
  },
  "/hire/v1/external_referral_rewards/{external_referral_reward_id}": {
    DELETE: "hire.externalReferralReward.delete"
  },
  "/hire/v1/talent_pools/{talent_pool_id}/batch_change_talent_pool": {
    POST: "hire.talentPool.batchChangeTalentPool"
  },
  "/hire/v1/talent_pools/": {
    GET: { name: "hire.talentPool.search", pagination: { argIndex: 0 } }
  },
  "/hire/v1/talent_pools/{talent_pool_id}/talent_relationship": {
    POST: "hire.talentPool.moveTalent"
  },
  "/hire/v1/talents/{talent_id}/tag": {
    POST: "hire.talent.tag"
  },
  "/hire/v1/talents/combined_create": {
    POST: "hire.talent.combinedCreate"
  },
  "/hire/v1/talents/combined_update": {
    POST: "hire.talent.combinedUpdate"
  },
  "/hire/v1/talents/add_to_folder": {
    POST: "hire.talent.addToFolder"
  },
  "/hire/v1/talents/remove_to_folder": {
    POST: "hire.talent.removeToFolder"
  },
  "/hire/v1/talent_folders": {
    GET: { name: "hire.talentFolder.list", pagination: { argIndex: 0 } }
  },
  "/hire/v1/talents/batch_get_id": {
    POST: "hire.talent.batchGetId"
  },
  "/hire/v1/talents": {
    GET: { name: "hire.talent.list", pagination: { argIndex: 0 } }
  },
  "/hire/v1/talent_objects/query": {
    GET: "hire.talentObject.query"
  },
  "/hire/v2/talents/{talent_id}": {
    GET: "hire.talent.get"
  },
  "/hire/v1/talents/{talent_id}/onboard_status": {
    POST: "hire.talent.onboardStatus"
  },
  "/hire/v1/talent_blocklist/change_talent_block": {
    POST: "hire.talentBlocklist.changeTalentBlock"
  },
  "/hire/v1/applications/{application_id}/get_detail": {
    GET: "hire.application.getDetail"
  },
  "/hire/v1/applications/{application_id}/recover": {
    POST: "hire.application.recover"
  },
  "/hire/v1/applications": {
    POST: "hire.application.create",
    GET: { name: "hire.application.list", pagination: { argIndex: 0 } }
  },
  "/hire/v1/applications/{application_id}/terminate": {
    POST: "hire.application.terminate"
  },
  "/hire/v1/applications/{application_id}/transfer_stage": {
    POST: "hire.application.transferStage"
  },
  "/hire/v1/termination_reasons": {
    GET: { name: "hire.terminationReason.list", pagination: { argIndex: 0 } }
  },
  "/hire/v1/applications/{application_id}": {
    GET: "hire.application.get"
  },
  "/hire/v1/applications/diversity_inclusions/search": {
    POST: "hire.diversityInclusion.search"
  },
  "/hire/v1/evaluations": {
    GET: { name: "hire.evaluation.list", pagination: { argIndex: 0 } }
  },
  "/hire/v1/exams": {
    POST: "hire.exam.create"
  },
  "/hire/v1/tests/search": {
    POST: { name: "hire.test.search", pagination: { argIndex: 1 } }
  },
  "/hire/v1/interviews": {
    GET: { name: "hire.interview.list", pagination: { argIndex: 0 } }
  },
  "/hire/v1/interviews/get_by_talent": {
    GET: "hire.interview.getByTalent"
  },
  "/hire/v2/interview_records/{interview_record_id}": {
    GET: "hire.interviewRecord.get"
  },
  "/hire/v2/interview_records": {
    GET: { name: "hire.interviewRecord.list", pagination: { argIndex: 0 } }
  },
  "/hire/v1/interview_records/attachments": {
    GET: "hire.interviewRecord.attachment.get"
  },
  "/hire/v1/minutes": {
    GET: "hire.minutes.get"
  },
  "/hire/v1/questionnaires": {
    GET: { name: "hire.questionnaire.list", pagination: { argIndex: 0 } }
  },
  "/hire/v1/offers": {
    POST: "hire.offer.create",
    GET: { name: "hire.offer.list", pagination: { argIndex: 0 } }
  },
  "/hire/v1/offers/{offer_id}": {
    PUT: "hire.offer.update",
    GET: "hire.offer.get"
  },
  "/hire/v1/applications/{application_id}/offer": {
    GET: "hire.application.offer"
  },
  "/hire/v1/offers/{offer_id}/offer_status": {
    PATCH: "hire.offer.offerStatus"
  },
  "/hire/v1/offers/{offer_id}/intern_offer_status": {
    POST: "hire.offer.internOfferStatus"
  },
  "/hire/v1/background_check_orders": {
    GET: { name: "hire.backgroundCheckOrder.list", pagination: { argIndex: 0 } }
  },
  "/hire/v1/background_check_orders/batch_query": {
    POST: { name: "hire.backgroundCheckOrder.batchQuery", pagination: { argIndex: 1 } }
  },
  "/hire/v1/tripartite_agreements": {
    POST: "hire.tripartiteAgreement.create",
    GET: { name: "hire.tripartiteAgreement.list", pagination: { argIndex: 0 } }
  },
  "/hire/v1/tripartite_agreements/{tripartite_agreement_id}": {
    PUT: "hire.tripartiteAgreement.update",
    DELETE: "hire.tripartiteAgreement.delete"
  },
  "/hire/v1/ehr_import_tasks/{ehr_import_task_id}": {
    PATCH: "hire.ehrImportTask.patch"
  },
  "/hire/v1/applications/{application_id}/transfer_onboard": {
    POST: "hire.application.transferOnboard"
  },
  "/hire/v1/applications/{application_id}/cancel_onboard": {
    POST: "hire.application.cancelOnboard"
  },
  "/hire/v1/employees/{employee_id}": {
    PATCH: "hire.employee.patch",
    GET: "hire.employee.get"
  },
  "/hire/v1/employees/get_by_application": {
    GET: "hire.employee.getByApplication"
  },
  "/hire/v1/todos": {
    GET: { name: "hire.todo.list", pagination: { argIndex: 0 } }
  },
  "/hire/v1/evaluation_tasks": {
    GET: { name: "hire.evaluationTask.list", pagination: { argIndex: 0 } }
  },
  "/hire/v1/exam_marking_tasks": {
    GET: { name: "hire.examMarkingTask.list", pagination: { argIndex: 0 } }
  },
  "/hire/v1/interview_tasks": {
    GET: { name: "hire.interviewTask.list", pagination: { argIndex: 0 } }
  },
  "/hire/v1/notes": {
    POST: "hire.note.create",
    GET: { name: "hire.note.list", pagination: { argIndex: 0 } }
  },
  "/hire/v1/notes/{note_id}": {
    PATCH: "hire.note.patch",
    GET: "hire.note.get",
    DELETE: "hire.note.delete"
  },
  "/hire/v1/resume_sources": {
    GET: { name: "hire.resumeSource.list", pagination: { argIndex: 0 } }
  },
  "/hire/v1/eco_account_custom_fields": {
    POST: "hire.ecoAccountCustomField.create"
  },
  "/hire/v1/eco_account_custom_fields/batch_update": {
    PATCH: "hire.ecoAccountCustomField.batchUpdate"
  },
  "/hire/v1/eco_account_custom_fields/batch_delete": {
    POST: "hire.ecoAccountCustomField.batchDelete"
  },
  "/hire/v1/eco_background_check_custom_fields": {
    POST: "hire.ecoBackgroundCheckCustomField.create"
  },
  "/hire/v1/eco_background_check_custom_fields/batch_update": {
    PATCH: "hire.ecoBackgroundCheckCustomField.batchUpdate"
  },
  "/hire/v1/eco_background_check_custom_fields/batch_delete": {
    POST: "hire.ecoBackgroundCheckCustomField.batchDelete"
  },
  "/hire/v1/eco_background_check_packages": {
    POST: "hire.ecoBackgroundCheckPackage.create"
  },
  "/hire/v1/eco_background_check_packages/batch_update": {
    PATCH: "hire.ecoBackgroundCheckPackage.batchUpdate"
  },
  "/hire/v1/eco_background_check_packages/batch_delete": {
    POST: "hire.ecoBackgroundCheckPackage.batchDelete"
  },
  "/hire/v1/eco_background_checks/update_progress": {
    POST: "hire.ecoBackgroundCheck.updateProgress"
  },
  "/hire/v1/eco_background_checks/update_result": {
    POST: "hire.ecoBackgroundCheck.updateResult"
  },
  "/hire/v1/eco_background_checks/cancel": {
    POST: "hire.ecoBackgroundCheck.cancel"
  },
  "/hire/v1/eco_exam_papers": {
    POST: "hire.ecoExamPaper.create"
  },
  "/hire/v1/eco_exam_papers/batch_update": {
    PATCH: "hire.ecoExamPaper.batchUpdate"
  },
  "/hire/v1/eco_exam_papers/batch_delete": {
    POST: "hire.ecoExamPaper.batchDelete"
  },
  "/hire/v1/eco_exams/{exam_id}/login_info": {
    POST: "hire.ecoExam.loginInfo"
  },
  "/hire/v1/eco_exams/{exam_id}/update_result": {
    POST: "hire.ecoExam.updateResult"
  },
  "/hire/v1/referral_account/enable": {
    POST: "hire.referralAccount.enable"
  },
  "/hire/v1/referral_account/get_account_assets": {
    GET: "hire.referralAccount.getAccountAssets"
  },
  "/hire/v1/referral_account": {
    POST: "hire.referralAccount.create"
  },
  "/hire/v1/referral_account/{referral_account_id}/deactivate": {
    POST: "hire.referralAccount.deactivate"
  },
  "/hire/v1/referral_account/{referral_account_id}/withdraw": {
    POST: "hire.referralAccount.withdraw"
  },
  "/hire/v1/referral_account/reconciliation": {
    POST: "hire.referralAccount.reconciliation"
  },
  "/hire/v1/attachments": {
    POST: "hire.attachment.create"
  },
  "/hire/v1/attachments/{attachment_id}": {
    GET: "hire.attachment.get"
  },
  "/hire/v1/attachments/{attachment_id}/preview": {
    GET: "hire.attachment.preview"
  },
  "/hire/v1/applications/{application_id}/interviews": {
    GET: { name: "hire.application.interview.list", pagination: { argIndex: 1 } }
  },
  "/hire/v1/talent_operation_logs/search": {
    POST: { name: "hire.talentOperationLog.search", pagination: { argIndex: 1 } }
  },
  "/hire/v1/jobs/{job_id}/managers/{manager_id}": {
    GET: "hire.job.manager.get"
  },
  "/hire/v1/offer_schemas/{offer_schema_id}": {
    GET: "hire.offerSchema.get"
  }
});

// src/types/human_authentication.ts
Internal.define({
  "/human_authentication/v1/identities": {
    POST: "humanAuthentication.identity.create"
  }
});

// src/types/im.ts
Internal.define({
  "/im/v1/messages": {
    POST: "im.message.create",
    GET: { name: "im.message.list", pagination: { argIndex: 0 } }
  },
  "/im/v1/messages/{message_id}/reply": {
    POST: "im.message.reply"
  },
  "/im/v1/messages/{message_id}": {
    PUT: "im.message.update",
    DELETE: "im.message.delete",
    GET: "im.message.get",
    PATCH: "im.message.patch"
  },
  "/im/v1/messages/{message_id}/forward": {
    POST: "im.message.forward"
  },
  "/im/v1/messages/merge_forward": {
    POST: "im.message.mergeForward"
  },
  "/im/v1/threads/{thread_id}/forward": {
    POST: "im.thread.forward"
  },
  "/im/v1/messages/{message_id}/push_follow_up": {
    POST: "im.message.pushFollowUp"
  },
  "/im/v1/messages/{message_id}/read_users": {
    GET: { name: "im.message.readUsers", pagination: { argIndex: 1 } }
  },
  "/im/v1/messages/{message_id}/resources/{file_key}": {
    GET: { name: "im.message.resource.get", type: "binary" }
  },
  "/im/v1/batch_messages/{batch_message_id}": {
    DELETE: "im.batchMessage.delete"
  },
  "/im/v1/batch_messages/{batch_message_id}/read_user": {
    GET: "im.batchMessage.readUser"
  },
  "/im/v1/batch_messages/{batch_message_id}/get_progress": {
    GET: "im.batchMessage.getProgress"
  },
  "/im/v1/images": {
    POST: { name: "im.image.create", multipart: true }
  },
  "/im/v1/images/{image_key}": {
    GET: { name: "im.image.get", type: "binary" }
  },
  "/im/v1/files": {
    POST: { name: "im.file.create", multipart: true }
  },
  "/im/v1/files/{file_key}": {
    GET: { name: "im.file.get", type: "binary" }
  },
  "/im/v1/messages/{message_id}/urgent_app": {
    PATCH: "im.message.urgentApp"
  },
  "/im/v1/messages/{message_id}/urgent_sms": {
    PATCH: "im.message.urgentSms"
  },
  "/im/v1/messages/{message_id}/urgent_phone": {
    PATCH: "im.message.urgentPhone"
  },
  "/im/v1/messages/{message_id}/reactions": {
    POST: "im.message.reaction.create",
    GET: { name: "im.message.reaction.list", pagination: { argIndex: 1 } }
  },
  "/im/v1/messages/{message_id}/reactions/{reaction_id}": {
    DELETE: "im.message.reaction.delete"
  },
  "/im/v1/pins": {
    POST: "im.pin.create",
    GET: { name: "im.pin.list", pagination: { argIndex: 0 } }
  },
  "/im/v1/pins/{message_id}": {
    DELETE: "im.pin.delete"
  },
  "/im/v2/url_previews/batch_update": {
    POST: "im.urlPreview.batchUpdate"
  },
  "/im/v1/chats": {
    POST: "im.chat.create",
    GET: { name: "im.chat.list", pagination: { argIndex: 0 } }
  },
  "/im/v1/chats/{chat_id}": {
    DELETE: "im.chat.delete",
    PUT: "im.chat.update",
    GET: "im.chat.get"
  },
  "/im/v1/chats/{chat_id}/moderation": {
    PUT: "im.chat.moderation.update",
    GET: "im.chat.moderation.get"
  },
  "/im/v1/chats/{chat_id}/top_notice/put_top_notice": {
    POST: "im.chat.topNotice.putTopNotice"
  },
  "/im/v1/chats/{chat_id}/top_notice/delete_top_notice": {
    POST: "im.chat.topNotice.deleteTopNotice"
  },
  "/im/v1/chats/search": {
    GET: { name: "im.chat.search", pagination: { argIndex: 0 } }
  },
  "/im/v1/chats/{chat_id}/link": {
    POST: "im.chat.link"
  },
  "/im/v1/chats/{chat_id}/managers/add_managers": {
    POST: "im.chat.managers.addManagers"
  },
  "/im/v1/chats/{chat_id}/managers/delete_managers": {
    POST: "im.chat.managers.deleteManagers"
  },
  "/im/v1/chats/{chat_id}/members": {
    POST: "im.chat.members.create",
    DELETE: "im.chat.members.delete",
    GET: "im.chat.members.get"
  },
  "/im/v1/chats/{chat_id}/members/me_join": {
    PATCH: "im.chat.members.meJoin"
  },
  "/im/v1/chats/{chat_id}/members/is_in_chat": {
    GET: "im.chat.members.isInChat"
  },
  "/im/v1/chats/{chat_id}/announcement": {
    PATCH: "im.chat.announcement.patch",
    GET: "im.chat.announcement.get"
  },
  "/im/v1/chats/{chat_id}/chat_tabs": {
    POST: "im.chat.tab.create"
  },
  "/im/v1/chats/{chat_id}/chat_tabs/delete_tabs": {
    DELETE: "im.chat.tab.deleteTabs"
  },
  "/im/v1/chats/{chat_id}/chat_tabs/update_tabs": {
    POST: "im.chat.tab.updateTabs"
  },
  "/im/v1/chats/{chat_id}/chat_tabs/sort_tabs": {
    POST: "im.chat.tab.sortTabs"
  },
  "/im/v1/chats/{chat_id}/chat_tabs/list_tabs": {
    GET: "im.chat.tab.listTabs"
  },
  "/im/v1/chats/{chat_id}/menu_tree": {
    POST: "im.chat.menuTree.create",
    DELETE: "im.chat.menuTree.delete",
    GET: "im.chat.menuTree.get"
  },
  "/im/v1/chats/{chat_id}/menu_items/{menu_item_id}": {
    PATCH: "im.chat.menuItem.patch"
  },
  "/im/v1/chats/{chat_id}/menu_tree/sort": {
    POST: "im.chat.menuTree.sort"
  },
  "/im/v2/app_feed_card": {
    POST: "im.appFeedCard.create"
  },
  "/im/v2/app_feed_card/batch": {
    PUT: "im.appFeedCard.batch.update",
    DELETE: "im.appFeedCard.batch.delete"
  },
  "/im/v2/feed_cards/bot_time_sentive": {
    PATCH: "im.feedCard.botTimeSentive"
  },
  "/im/v2/chat_button": {
    PUT: "im.chatButton.update"
  },
  "/im/v2/feed_cards/{feed_card_id}": {
    PATCH: "im.feedCard.patch"
  },
  "/im/v2/biz_entity_tag_relation": {
    GET: "im.bizEntityTagRelation.get",
    POST: "im.bizEntityTagRelation.create",
    PUT: "im.bizEntityTagRelation.update"
  },
  "/im/v2/tags": {
    POST: "im.tag.create"
  },
  "/im/v2/tags/{tag_id}": {
    PATCH: "im.tag.patch"
  }
});

// src/types/lingo.ts
Internal.define({
  "/lingo/v1/drafts": {
    POST: "lingo.draft.create"
  },
  "/lingo/v1/drafts/{draft_id}": {
    PUT: "lingo.draft.update"
  },
  "/lingo/v1/entities": {
    POST: "lingo.entity.create",
    GET: { name: "lingo.entity.list", pagination: { argIndex: 0, itemsKey: "entities" } }
  },
  "/lingo/v1/entities/{entity_id}": {
    PUT: "lingo.entity.update",
    DELETE: "lingo.entity.delete",
    GET: "lingo.entity.get"
  },
  "/lingo/v1/entities/match": {
    POST: "lingo.entity.match"
  },
  "/lingo/v1/entities/search": {
    POST: { name: "lingo.entity.search", pagination: { argIndex: 1, itemsKey: "entities" } }
  },
  "/lingo/v1/entities/highlight": {
    POST: "lingo.entity.highlight"
  },
  "/lingo/v1/classifications": {
    GET: { name: "lingo.classification.list", pagination: { argIndex: 0 } }
  },
  "/lingo/v1/repos": {
    GET: "lingo.repo.list"
  },
  "/lingo/v1/files/upload": {
    POST: { name: "lingo.file.upload", multipart: true }
  },
  "/lingo/v1/files/{file_token}/download": {
    GET: { name: "lingo.file.download", type: "binary" }
  }
});

// src/types/mail.ts
var Mail;
((Mail2) => {
  let UserMailbox;
  ((UserMailbox2) => {
    let Folder;
    ((Folder2) => {
      let ListQueryFolderType;
      ((ListQueryFolderType2) => {
        ListQueryFolderType2[ListQueryFolderType2["System"] = 1] = "System";
        ListQueryFolderType2[ListQueryFolderType2["User"] = 2] = "User";
      })(ListQueryFolderType = Folder2.ListQueryFolderType || (Folder2.ListQueryFolderType = {}));
    })(Folder = UserMailbox2.Folder || (UserMailbox2.Folder = {}));
    let Event;
    ((Event2) => {
      let SubscribeRequestEventType;
      ((SubscribeRequestEventType2) => {
        SubscribeRequestEventType2[SubscribeRequestEventType2["Message"] = 1] = "Message";
      })(SubscribeRequestEventType = Event2.SubscribeRequestEventType || (Event2.SubscribeRequestEventType = {}));
      let UnsubscribeRequestEventType;
      ((UnsubscribeRequestEventType2) => {
        UnsubscribeRequestEventType2[UnsubscribeRequestEventType2["Message"] = 1] = "Message";
      })(UnsubscribeRequestEventType = Event2.UnsubscribeRequestEventType || (Event2.UnsubscribeRequestEventType = {}));
    })(Event = UserMailbox2.Event || (UserMailbox2.Event = {}));
  })(UserMailbox = Mail2.UserMailbox || (Mail2.UserMailbox = {}));
})(Mail || (Mail = {}));
Internal.define({
  "/mail/v1/user_mailboxes/{user_mailbox_id}/folders": {
    POST: "mail.userMailbox.folder.create",
    GET: "mail.userMailbox.folder.list"
  },
  "/mail/v1/user_mailboxes/{user_mailbox_id}/folders/{folder_id}": {
    DELETE: "mail.userMailbox.folder.delete",
    PATCH: "mail.userMailbox.folder.patch"
  },
  "/mail/v1/user_mailboxes/{user_mailbox_id}/messages/get_by_card": {
    GET: "mail.userMailbox.message.getByCard"
  },
  "/mail/v1/user_mailboxes/{user_mailbox_id}/messages": {
    GET: { name: "mail.userMailbox.message.list", pagination: { argIndex: 1 } }
  },
  "/mail/v1/user_mailboxes/{user_mailbox_id}/messages/{message_id}": {
    GET: "mail.userMailbox.message.get"
  },
  "/mail/v1/user_mailboxes/{user_mailbox_id}/messages/send": {
    POST: "mail.userMailbox.message.send"
  },
  "/mail/v1/user_mailboxes/{user_mailbox_id}/messages/{message_id}/attachments/download_url": {
    GET: "mail.userMailbox.message.attachment.downloadUrl"
  },
  "/mail/v1/user_mailboxes/{user_mailbox_id}/event/subscribe": {
    POST: "mail.userMailbox.event.subscribe"
  },
  "/mail/v1/user_mailboxes/{user_mailbox_id}/event/subscription": {
    GET: "mail.userMailbox.event.subscription"
  },
  "/mail/v1/user_mailboxes/{user_mailbox_id}/event/unsubscribe": {
    POST: "mail.userMailbox.event.unsubscribe"
  },
  "/mail/v1/user_mailboxes/{user_mailbox_id}/rules": {
    POST: "mail.userMailbox.rule.create",
    GET: "mail.userMailbox.rule.list"
  },
  "/mail/v1/user_mailboxes/{user_mailbox_id}/rules/{rule_id}": {
    DELETE: "mail.userMailbox.rule.delete",
    PUT: "mail.userMailbox.rule.update"
  },
  "/mail/v1/user_mailboxes/{user_mailbox_id}/rules/reorder": {
    POST: "mail.userMailbox.rule.reorder"
  },
  "/mail/v1/user_mailboxes/{user_mailbox_id}/mail_contacts": {
    POST: "mail.userMailbox.mailContact.create",
    GET: { name: "mail.userMailbox.mailContact.list", pagination: { argIndex: 1 } }
  },
  "/mail/v1/user_mailboxes/{user_mailbox_id}/mail_contacts/{mail_contact_id}": {
    DELETE: "mail.userMailbox.mailContact.delete",
    PATCH: "mail.userMailbox.mailContact.patch"
  },
  "/mail/v1/mailgroups": {
    POST: "mail.mailgroup.create",
    GET: { name: "mail.mailgroup.list", pagination: { argIndex: 0 } }
  },
  "/mail/v1/mailgroups/{mailgroup_id}": {
    DELETE: "mail.mailgroup.delete",
    PATCH: "mail.mailgroup.patch",
    PUT: "mail.mailgroup.update",
    GET: "mail.mailgroup.get"
  },
  "/mail/v1/mailgroups/{mailgroup_id}/managers/batch_create": {
    POST: "mail.mailgroup.manager.batchCreate"
  },
  "/mail/v1/mailgroups/{mailgroup_id}/managers/batch_delete": {
    POST: "mail.mailgroup.manager.batchDelete"
  },
  "/mail/v1/mailgroups/{mailgroup_id}/managers": {
    GET: { name: "mail.mailgroup.manager.list", pagination: { argIndex: 1 } }
  },
  "/mail/v1/mailgroups/{mailgroup_id}/members": {
    POST: "mail.mailgroup.member.create",
    GET: { name: "mail.mailgroup.member.list", pagination: { argIndex: 1 } }
  },
  "/mail/v1/mailgroups/{mailgroup_id}/members/{member_id}": {
    DELETE: "mail.mailgroup.member.delete",
    GET: "mail.mailgroup.member.get"
  },
  "/mail/v1/mailgroups/{mailgroup_id}/members/batch_create": {
    POST: "mail.mailgroup.member.batchCreate"
  },
  "/mail/v1/mailgroups/{mailgroup_id}/members/batch_delete": {
    DELETE: "mail.mailgroup.member.batchDelete"
  },
  "/mail/v1/mailgroups/{mailgroup_id}/aliases": {
    POST: "mail.mailgroup.alias.create",
    GET: "mail.mailgroup.alias.list"
  },
  "/mail/v1/mailgroups/{mailgroup_id}/aliases/{alias_id}": {
    DELETE: "mail.mailgroup.alias.delete"
  },
  "/mail/v1/mailgroups/{mailgroup_id}/permission_members": {
    POST: "mail.mailgroup.permissionMember.create",
    GET: { name: "mail.mailgroup.permissionMember.list", pagination: { argIndex: 1 } }
  },
  "/mail/v1/mailgroups/{mailgroup_id}/permission_members/{permission_member_id}": {
    DELETE: "mail.mailgroup.permissionMember.delete",
    GET: "mail.mailgroup.permissionMember.get"
  },
  "/mail/v1/mailgroups/{mailgroup_id}/permission_members/batch_create": {
    POST: "mail.mailgroup.permissionMember.batchCreate"
  },
  "/mail/v1/mailgroups/{mailgroup_id}/permission_members/batch_delete": {
    DELETE: "mail.mailgroup.permissionMember.batchDelete"
  },
  "/mail/v1/public_mailboxes": {
    POST: "mail.publicMailbox.create",
    GET: { name: "mail.publicMailbox.list", pagination: { argIndex: 0 } }
  },
  "/mail/v1/public_mailboxes/{public_mailbox_id}": {
    PATCH: "mail.publicMailbox.patch",
    PUT: "mail.publicMailbox.update",
    GET: "mail.publicMailbox.get",
    DELETE: "mail.publicMailbox.delete"
  },
  "/mail/v1/public_mailboxes/{public_mailbox_id}/remove_to_recycle_bin": {
    DELETE: "mail.publicMailbox.removeToRecycleBin"
  },
  "/mail/v1/public_mailboxes/{public_mailbox_id}/members": {
    POST: "mail.publicMailbox.member.create",
    GET: { name: "mail.publicMailbox.member.list", pagination: { argIndex: 1 } }
  },
  "/mail/v1/public_mailboxes/{public_mailbox_id}/members/{member_id}": {
    DELETE: "mail.publicMailbox.member.delete",
    GET: "mail.publicMailbox.member.get"
  },
  "/mail/v1/public_mailboxes/{public_mailbox_id}/members/clear": {
    POST: "mail.publicMailbox.member.clear"
  },
  "/mail/v1/public_mailboxes/{public_mailbox_id}/members/batch_create": {
    POST: "mail.publicMailbox.member.batchCreate"
  },
  "/mail/v1/public_mailboxes/{public_mailbox_id}/members/batch_delete": {
    DELETE: "mail.publicMailbox.member.batchDelete"
  },
  "/mail/v1/public_mailboxes/{public_mailbox_id}/aliases": {
    POST: "mail.publicMailbox.alias.create",
    GET: "mail.publicMailbox.alias.list"
  },
  "/mail/v1/public_mailboxes/{public_mailbox_id}/aliases/{alias_id}": {
    DELETE: "mail.publicMailbox.alias.delete"
  },
  "/mail/v1/user_mailboxes/{user_mailbox_id}": {
    DELETE: "mail.userMailbox.delete"
  },
  "/mail/v1/user_mailboxes/{user_mailbox_id}/aliases": {
    POST: "mail.userMailbox.alias.create",
    GET: "mail.userMailbox.alias.list"
  },
  "/mail/v1/user_mailboxes/{user_mailbox_id}/aliases/{alias_id}": {
    DELETE: "mail.userMailbox.alias.delete"
  },
  "/mail/v1/users/query": {
    POST: "mail.user.query"
  }
});

// src/types/mdm.ts
Internal.define({
  "/mdm/v3/batch_country_region": {
    GET: "mdm.batchCountryRegion.get"
  },
  "/mdm/v3/country_regions": {
    GET: "mdm.countryRegion.list"
  },
  "/mdm/v1/user_auth_data_relations/bind": {
    POST: "mdm.userAuthDataRelation.bind"
  },
  "/mdm/v1/user_auth_data_relations/unbind": {
    POST: "mdm.userAuthDataRelation.unbind"
  }
});

// src/types/minutes.ts
Internal.define({
  "/minutes/v1/minutes/{minute_token}/media": {
    GET: "minutes.minute.media.get"
  },
  "/minutes/v1/minutes/{minute_token}/transcript": {
    GET: { name: "minutes.minute.transcript.get", type: "binary" }
  },
  "/minutes/v1/minutes/{minute_token}/statistics": {
    GET: "minutes.minute.statistics.get"
  },
  "/minutes/v1/minutes/{minute_token}": {
    GET: "minutes.minute.get"
  }
});

// src/types/moments.ts
Internal.define({
  "/moments/v1/posts/{post_id}": {
    GET: "moments.post.get"
  }
});

// src/types/okr.ts
var Okr;
((Okr2) => {
  let Period;
  ((Period2) => {
    let PatchRequestStatus;
    ((PatchRequestStatus2) => {
      PatchRequestStatus2[PatchRequestStatus2["NormalStatus"] = 1] = "NormalStatus";
      PatchRequestStatus2[PatchRequestStatus2["MarkInvalid"] = 2] = "MarkInvalid";
      PatchRequestStatus2[PatchRequestStatus2["HiddenPeriod"] = 3] = "HiddenPeriod";
    })(PatchRequestStatus = Period2.PatchRequestStatus || (Period2.PatchRequestStatus = {}));
    let PatchResponseStatus;
    ((PatchResponseStatus2) => {
      PatchResponseStatus2[PatchResponseStatus2["NormalStatus"] = 1] = "NormalStatus";
      PatchResponseStatus2[PatchResponseStatus2["MarkInvalid"] = 2] = "MarkInvalid";
      PatchResponseStatus2[PatchResponseStatus2["HiddenPeriod"] = 3] = "HiddenPeriod";
    })(PatchResponseStatus = Period2.PatchResponseStatus || (Period2.PatchResponseStatus = {}));
  })(Period = Okr2.Period || (Okr2.Period = {}));
  let ProgressRecord;
  ((ProgressRecord2) => {
    let CreateRequestTargetType;
    ((CreateRequestTargetType2) => {
      CreateRequestTargetType2[CreateRequestTargetType2["Objective"] = 2] = "Objective";
      CreateRequestTargetType2[CreateRequestTargetType2["KeyResult"] = 3] = "KeyResult";
    })(CreateRequestTargetType = ProgressRecord2.CreateRequestTargetType || (ProgressRecord2.CreateRequestTargetType = {}));
  })(ProgressRecord = Okr2.ProgressRecord || (Okr2.ProgressRecord = {}));
  let Image;
  ((Image2) => {
    let UploadFormTargetType;
    ((UploadFormTargetType2) => {
      UploadFormTargetType2[UploadFormTargetType2["Objective"] = 2] = "Objective";
      UploadFormTargetType2[UploadFormTargetType2["KeyResult"] = 3] = "KeyResult";
    })(UploadFormTargetType = Image2.UploadFormTargetType || (Image2.UploadFormTargetType = {}));
  })(Image = Okr2.Image || (Okr2.Image = {}));
})(Okr || (Okr = {}));
Internal.define({
  "/okr/v1/periods": {
    POST: "okr.period.create",
    GET: { name: "okr.period.list", pagination: { argIndex: 0 } }
  },
  "/okr/v1/periods/{period_id}": {
    PATCH: "okr.period.patch"
  },
  "/okr/v1/period_rules": {
    GET: "okr.periodRule.list"
  },
  "/okr/v1/users/{user_id}/okrs": {
    GET: "okr.user.okr.list"
  },
  "/okr/v1/okrs/batch_get": {
    GET: "okr.batchGet"
  },
  "/okr/v1/progress_records": {
    POST: "okr.progressRecord.create"
  },
  "/okr/v1/progress_records/{progress_id}": {
    DELETE: "okr.progressRecord.delete",
    PUT: "okr.progressRecord.update",
    GET: "okr.progressRecord.get"
  },
  "/okr/v1/images/upload": {
    POST: { name: "okr.image.upload", multipart: true }
  },
  "/okr/v1/reviews/query": {
    GET: "okr.review.query"
  }
});

// src/types/optical_char_recognition.ts
Internal.define({
  "/optical_char_recognition/v1/image/basic_recognize": {
    POST: "opticalCharRecognition.image.basicRecognize"
  }
});

// src/types/passport.ts
var Passport;
((Passport2) => {
  let Session2;
  ((Session3) => {
    let LogoutRequestLogoutType;
    ((LogoutRequestLogoutType2) => {
      LogoutRequestLogoutType2[LogoutRequestLogoutType2["UserID"] = 1] = "UserID";
      LogoutRequestLogoutType2[LogoutRequestLogoutType2["IdpCredentialID"] = 2] = "IdpCredentialID";
      LogoutRequestLogoutType2[LogoutRequestLogoutType2["SessionUUID"] = 3] = "SessionUUID";
    })(LogoutRequestLogoutType = Session3.LogoutRequestLogoutType || (Session3.LogoutRequestLogoutType = {}));
  })(Session2 = Passport2.Session || (Passport2.Session = {}));
})(Passport || (Passport = {}));
Internal.define({
  "/passport/v1/sessions/query": {
    POST: "passport.session.query"
  },
  "/passport/v1/sessions/logout": {
    POST: "passport.session.logout"
  }
});

// src/types/payroll.ts
var Payroll;
((Payroll2) => {
  let CostAllocationDetail;
  ((CostAllocationDetail2) => {
    let ListQueryReportType;
    ((ListQueryReportType2) => {
      ListQueryReportType2[ListQueryReportType2["Default"] = 0] = "Default";
      ListQueryReportType2[ListQueryReportType2["Accrued"] = 1] = "Accrued";
      ListQueryReportType2[ListQueryReportType2["Paid"] = 2] = "Paid";
    })(ListQueryReportType = CostAllocationDetail2.ListQueryReportType || (CostAllocationDetail2.ListQueryReportType = {}));
  })(CostAllocationDetail = Payroll2.CostAllocationDetail || (Payroll2.CostAllocationDetail = {}));
  let CostAllocationReport;
  ((CostAllocationReport2) => {
    let ListQueryReportType;
    ((ListQueryReportType2) => {
      ListQueryReportType2[ListQueryReportType2["Default"] = 0] = "Default";
      ListQueryReportType2[ListQueryReportType2["Accrued"] = 1] = "Accrued";
      ListQueryReportType2[ListQueryReportType2["Paid"] = 2] = "Paid";
    })(ListQueryReportType = CostAllocationReport2.ListQueryReportType || (CostAllocationReport2.ListQueryReportType = {}));
  })(CostAllocationReport = Payroll2.CostAllocationReport || (Payroll2.CostAllocationReport = {}));
})(Payroll || (Payroll = {}));
Internal.define({
  "/payroll/v1/acct_items": {
    GET: { name: "payroll.acctItem.list", pagination: { argIndex: 0 } }
  },
  "/payroll/v1/paygroups": {
    GET: { name: "payroll.paygroup.list", pagination: { argIndex: 0 } }
  },
  "/payroll/v1/datasources": {
    GET: { name: "payroll.datasource.list", pagination: { argIndex: 0, itemsKey: "datasources" } }
  },
  "/payroll/v1/datasource_records/save": {
    POST: "payroll.datasourceRecord.save"
  },
  "/payroll/v1/datasource_records/query": {
    POST: { name: "payroll.datasourceRecord.query", pagination: { argIndex: 1, itemsKey: "records" } }
  },
  "/payroll/v1/payment_activitys/archive": {
    POST: "payroll.paymentActivity.archive"
  },
  "/payroll/v1/payment_activitys": {
    GET: { name: "payroll.paymentActivity.list", pagination: { argIndex: 0, itemsKey: "payment_activitys" } }
  },
  "/payroll/v1/payment_activity_details": {
    GET: "payroll.paymentActivityDetail.list"
  },
  "/payroll/v1/payment_detail/query": {
    POST: "payroll.paymentDetail.query"
  },
  "/payroll/v1/cost_allocation_details": {
    GET: "payroll.costAllocationDetail.list"
  },
  "/payroll/v1/cost_allocation_reports": {
    GET: "payroll.costAllocationReport.list"
  },
  "/payroll/v1/cost_allocation_plans": {
    GET: { name: "payroll.costAllocationPlan.list", pagination: { argIndex: 0 } }
  }
});

// src/types/performance.ts
var Performance;
((Performance2) => {
  let UserGroupUserRel;
  ((UserGroupUserRel2) => {
    let WriteRequestScopeVisibleSetting;
    ((WriteRequestScopeVisibleSetting2) => {
      WriteRequestScopeVisibleSetting2[WriteRequestScopeVisibleSetting2["NotLimit"] = 0] = "NotLimit";
      WriteRequestScopeVisibleSetting2[WriteRequestScopeVisibleSetting2["BackendAdminNotVisible"] = 1] = "BackendAdminNotVisible";
    })(WriteRequestScopeVisibleSetting = UserGroupUserRel2.WriteRequestScopeVisibleSetting || (UserGroupUserRel2.WriteRequestScopeVisibleSetting = {}));
  })(UserGroupUserRel = Performance2.UserGroupUserRel || (Performance2.UserGroupUserRel = {}));
})(Performance || (Performance = {}));
Internal.define({
  "/performance/v1/semesters": {
    GET: "performance.semester.list"
  },
  "/performance/v2/activity/query": {
    POST: "performance.activity.query"
  },
  "/performance/v2/additional_informations/query": {
    POST: { name: "performance.additionalInformation.query", pagination: { argIndex: 1, itemsKey: "additional_informations" } }
  },
  "/performance/v2/additional_informations/import": {
    POST: "performance.additionalInformation.import"
  },
  "/performance/v2/additional_informations/batch": {
    DELETE: "performance.additionalInformations.batch.delete"
  },
  "/performance/v2/user_group_user_rels/write": {
    POST: "performance.userGroupUserRel.write"
  },
  "/performance/v2/reviewees/query": {
    POST: "performance.reviewee.query"
  },
  "/performance/v2/review_templates/query": {
    POST: { name: "performance.reviewTemplate.query", pagination: { argIndex: 1, itemsKey: "review_templates" } }
  },
  "/performance/v2/indicators/query": {
    POST: { name: "performance.indicator.query", pagination: { argIndex: 1, itemsKey: "indicators" } }
  },
  "/performance/v2/questions/query": {
    POST: { name: "performance.question.query", pagination: { argIndex: 1, itemsKey: "tag_based_questions" } }
  },
  "/performance/v2/metric_libs/query": {
    POST: { name: "performance.metricLib.query", pagination: { argIndex: 1 } }
  },
  "/performance/v2/metric_templates/query": {
    POST: { name: "performance.metricTemplate.query", pagination: { argIndex: 1 } }
  },
  "/performance/v2/metric_fields/query": {
    POST: "performance.metricField.query"
  },
  "/performance/v2/metric_tags": {
    GET: { name: "performance.metricTag.list", pagination: { argIndex: 0 } }
  },
  "/performance/v1/stage_tasks/find_by_user_list": {
    POST: "performance.stageTask.findByUserList"
  },
  "/performance/v1/stage_tasks/find_by_page": {
    POST: "performance.stageTask.findByPage"
  },
  "/performance/v2/metric_details/query": {
    POST: "performance.metricDetail.query"
  },
  "/performance/v2/metric_details/import": {
    POST: "performance.metricDetail.import"
  },
  "/performance/v2/review_datas/query": {
    POST: "performance.reviewData.query"
  }
});

// src/types/personal_settings.ts
Internal.define({
  "/personal_settings/v1/system_statuses": {
    POST: "personalSettings.systemStatus.create",
    GET: { name: "personalSettings.systemStatus.list", pagination: { argIndex: 0 } }
  },
  "/personal_settings/v1/system_statuses/{system_status_id}": {
    DELETE: "personalSettings.systemStatus.delete",
    PATCH: "personalSettings.systemStatus.patch"
  },
  "/personal_settings/v1/system_statuses/{system_status_id}/batch_open": {
    POST: "personalSettings.systemStatus.batchOpen"
  },
  "/personal_settings/v1/system_statuses/{system_status_id}/batch_close": {
    POST: "personalSettings.systemStatus.batchClose"
  }
});

// src/types/report.ts
var Report;
((Report2) => {
  let Rule;
  ((Rule2) => {
    let QueryQueryIncludeDeleted;
    ((QueryQueryIncludeDeleted2) => {
      QueryQueryIncludeDeleted2[QueryQueryIncludeDeleted2["Exclude"] = 0] = "Exclude";
      QueryQueryIncludeDeleted2[QueryQueryIncludeDeleted2["Include"] = 1] = "Include";
    })(QueryQueryIncludeDeleted = Rule2.QueryQueryIncludeDeleted || (Rule2.QueryQueryIncludeDeleted = {}));
  })(Rule = Report2.Rule || (Report2.Rule = {}));
})(Report || (Report = {}));
Internal.define({
  "/report/v1/rules/query": {
    GET: "report.rule.query"
  },
  "/report/v1/rules/{rule_id}/views/remove": {
    POST: "report.rule.view.remove"
  },
  "/report/v1/tasks/query": {
    POST: "report.task.query"
  }
});

// src/types/search.ts
var Search;
((Search2) => {
  let DataSource2;
  ((DataSource3) => {
    let CreateRequestState;
    ((CreateRequestState2) => {
      CreateRequestState2[CreateRequestState2["Online"] = 0] = "Online";
      CreateRequestState2[CreateRequestState2["Offline"] = 1] = "Offline";
    })(CreateRequestState = DataSource3.CreateRequestState || (DataSource3.CreateRequestState = {}));
    let CreateRequestConnectType;
    ((CreateRequestConnectType2) => {
      CreateRequestConnectType2[CreateRequestConnectType2["Default"] = 0] = "Default";
      CreateRequestConnectType2[CreateRequestConnectType2["Callback"] = 1] = "Callback";
    })(CreateRequestConnectType = DataSource3.CreateRequestConnectType || (DataSource3.CreateRequestConnectType = {}));
    let PatchRequestState;
    ((PatchRequestState2) => {
      PatchRequestState2[PatchRequestState2["Online"] = 0] = "Online";
      PatchRequestState2[PatchRequestState2["Offline"] = 1] = "Offline";
    })(PatchRequestState = DataSource3.PatchRequestState || (DataSource3.PatchRequestState = {}));
    let ListQueryView;
    ((ListQueryView2) => {
      ListQueryView2[ListQueryView2["FULL"] = 0] = "FULL";
      ListQueryView2[ListQueryView2["BASIC"] = 1] = "BASIC";
    })(ListQueryView = DataSource3.ListQueryView || (DataSource3.ListQueryView = {}));
  })(DataSource2 = Search2.DataSource || (Search2.DataSource = {}));
})(Search || (Search = {}));
Internal.define({
  "/search/v2/message": {
    POST: { name: "search.message.create", pagination: { argIndex: 1 } }
  },
  "/search/v2/app": {
    POST: { name: "search.app.create", pagination: { argIndex: 1 } }
  },
  "/search/v2/data_sources": {
    POST: "search.dataSource.create",
    GET: { name: "search.dataSource.list", pagination: { argIndex: 0 } }
  },
  "/search/v2/data_sources/{data_source_id}": {
    DELETE: "search.dataSource.delete",
    PATCH: "search.dataSource.patch",
    GET: "search.dataSource.get"
  },
  "/search/v2/data_sources/{data_source_id}/items": {
    POST: "search.dataSource.item.create"
  },
  "/search/v2/data_sources/{data_source_id}/items/{item_id}": {
    DELETE: "search.dataSource.item.delete",
    GET: "search.dataSource.item.get"
  },
  "/search/v2/schemas": {
    POST: "search.schema.create"
  },
  "/search/v2/schemas/{schema_id}": {
    DELETE: "search.schema.delete",
    PATCH: "search.schema.patch",
    GET: "search.schema.get"
  }
});

// src/types/security_and_compliance.ts
var SecurityAndCompliance;
((SecurityAndCompliance2) => {
  let DeviceRecord;
  ((DeviceRecord2) => {
    let MineResponseDeviceOwnership;
    ((MineResponseDeviceOwnership2) => {
      MineResponseDeviceOwnership2[MineResponseDeviceOwnership2["Unknown"] = 0] = "Unknown";
      MineResponseDeviceOwnership2[MineResponseDeviceOwnership2["Personal"] = 1] = "Personal";
      MineResponseDeviceOwnership2[MineResponseDeviceOwnership2["Company"] = 2] = "Company";
    })(MineResponseDeviceOwnership = DeviceRecord2.MineResponseDeviceOwnership || (DeviceRecord2.MineResponseDeviceOwnership = {}));
    let MineResponseDeviceStatus;
    ((MineResponseDeviceStatus2) => {
      MineResponseDeviceStatus2[MineResponseDeviceStatus2["Unknown"] = 0] = "Unknown";
      MineResponseDeviceStatus2[MineResponseDeviceStatus2["Trusted"] = 1] = "Trusted";
      MineResponseDeviceStatus2[MineResponseDeviceStatus2["Untrusted"] = 2] = "Untrusted";
    })(MineResponseDeviceStatus = DeviceRecord2.MineResponseDeviceStatus || (DeviceRecord2.MineResponseDeviceStatus = {}));
    let CreateRequestDeviceSystem;
    ((CreateRequestDeviceSystem2) => {
      CreateRequestDeviceSystem2[CreateRequestDeviceSystem2["Windows"] = 1] = "Windows";
      CreateRequestDeviceSystem2[CreateRequestDeviceSystem2["MacOS"] = 2] = "MacOS";
      CreateRequestDeviceSystem2[CreateRequestDeviceSystem2["Linux"] = 3] = "Linux";
      CreateRequestDeviceSystem2[CreateRequestDeviceSystem2["Android"] = 4] = "Android";
      CreateRequestDeviceSystem2[CreateRequestDeviceSystem2["IOS"] = 5] = "IOS";
      CreateRequestDeviceSystem2[CreateRequestDeviceSystem2["OpenHarmony"] = 6] = "OpenHarmony";
    })(CreateRequestDeviceSystem = DeviceRecord2.CreateRequestDeviceSystem || (DeviceRecord2.CreateRequestDeviceSystem = {}));
    let CreateRequestDeviceOwnership;
    ((CreateRequestDeviceOwnership2) => {
      CreateRequestDeviceOwnership2[CreateRequestDeviceOwnership2["Unknown"] = 0] = "Unknown";
      CreateRequestDeviceOwnership2[CreateRequestDeviceOwnership2["Personal"] = 1] = "Personal";
      CreateRequestDeviceOwnership2[CreateRequestDeviceOwnership2["Company"] = 2] = "Company";
    })(CreateRequestDeviceOwnership = DeviceRecord2.CreateRequestDeviceOwnership || (DeviceRecord2.CreateRequestDeviceOwnership = {}));
    let CreateRequestDeviceStatus;
    ((CreateRequestDeviceStatus2) => {
      CreateRequestDeviceStatus2[CreateRequestDeviceStatus2["Unknown"] = 0] = "Unknown";
      CreateRequestDeviceStatus2[CreateRequestDeviceStatus2["Trusted"] = 1] = "Trusted";
      CreateRequestDeviceStatus2[CreateRequestDeviceStatus2["Untrusted"] = 2] = "Untrusted";
    })(CreateRequestDeviceStatus = DeviceRecord2.CreateRequestDeviceStatus || (DeviceRecord2.CreateRequestDeviceStatus = {}));
    let ListQueryDeviceOwnership;
    ((ListQueryDeviceOwnership2) => {
      ListQueryDeviceOwnership2[ListQueryDeviceOwnership2["Unknown"] = 0] = "Unknown";
      ListQueryDeviceOwnership2[ListQueryDeviceOwnership2["Personal"] = 1] = "Personal";
      ListQueryDeviceOwnership2[ListQueryDeviceOwnership2["Company"] = 2] = "Company";
    })(ListQueryDeviceOwnership = DeviceRecord2.ListQueryDeviceOwnership || (DeviceRecord2.ListQueryDeviceOwnership = {}));
    let ListQueryDeviceStatus;
    ((ListQueryDeviceStatus2) => {
      ListQueryDeviceStatus2[ListQueryDeviceStatus2["Unknown"] = 0] = "Unknown";
      ListQueryDeviceStatus2[ListQueryDeviceStatus2["Trusted"] = 1] = "Trusted";
      ListQueryDeviceStatus2[ListQueryDeviceStatus2["Untrusted"] = 2] = "Untrusted";
    })(ListQueryDeviceStatus = DeviceRecord2.ListQueryDeviceStatus || (DeviceRecord2.ListQueryDeviceStatus = {}));
    let ListQueryDeviceTerminalType;
    ((ListQueryDeviceTerminalType2) => {
      ListQueryDeviceTerminalType2[ListQueryDeviceTerminalType2["Unknown"] = 0] = "Unknown";
      ListQueryDeviceTerminalType2[ListQueryDeviceTerminalType2["Mobile"] = 1] = "Mobile";
      ListQueryDeviceTerminalType2[ListQueryDeviceTerminalType2["PC"] = 2] = "PC";
    })(ListQueryDeviceTerminalType = DeviceRecord2.ListQueryDeviceTerminalType || (DeviceRecord2.ListQueryDeviceTerminalType = {}));
    let ListQueryOs;
    ((ListQueryOs2) => {
      ListQueryOs2[ListQueryOs2["Unknown"] = 0] = "Unknown";
      ListQueryOs2[ListQueryOs2["Windows"] = 1] = "Windows";
      ListQueryOs2[ListQueryOs2["MacOS"] = 2] = "MacOS";
      ListQueryOs2[ListQueryOs2["Linux"] = 3] = "Linux";
      ListQueryOs2[ListQueryOs2["Android"] = 4] = "Android";
      ListQueryOs2[ListQueryOs2["IOS"] = 5] = "IOS";
      ListQueryOs2[ListQueryOs2["OpenHarmony"] = 6] = "OpenHarmony";
    })(ListQueryOs = DeviceRecord2.ListQueryOs || (DeviceRecord2.ListQueryOs = {}));
    let UpdateRequestDeviceOwnership;
    ((UpdateRequestDeviceOwnership2) => {
      UpdateRequestDeviceOwnership2[UpdateRequestDeviceOwnership2["Unknown"] = 0] = "Unknown";
      UpdateRequestDeviceOwnership2[UpdateRequestDeviceOwnership2["Personal"] = 1] = "Personal";
      UpdateRequestDeviceOwnership2[UpdateRequestDeviceOwnership2["Company"] = 2] = "Company";
    })(UpdateRequestDeviceOwnership = DeviceRecord2.UpdateRequestDeviceOwnership || (DeviceRecord2.UpdateRequestDeviceOwnership = {}));
    let UpdateRequestDeviceStatus;
    ((UpdateRequestDeviceStatus2) => {
      UpdateRequestDeviceStatus2[UpdateRequestDeviceStatus2["Unknown"] = 0] = "Unknown";
      UpdateRequestDeviceStatus2[UpdateRequestDeviceStatus2["Trusted"] = 1] = "Trusted";
      UpdateRequestDeviceStatus2[UpdateRequestDeviceStatus2["Untrusted"] = 2] = "Untrusted";
    })(UpdateRequestDeviceStatus = DeviceRecord2.UpdateRequestDeviceStatus || (DeviceRecord2.UpdateRequestDeviceStatus = {}));
  })(DeviceRecord = SecurityAndCompliance2.DeviceRecord || (SecurityAndCompliance2.DeviceRecord = {}));
})(SecurityAndCompliance || (SecurityAndCompliance = {}));
Internal.define({
  "/security_and_compliance/v2/device_records/mine": {
    GET: "securityAndCompliance.deviceRecord.mine"
  },
  "/security_and_compliance/v2/device_records": {
    POST: "securityAndCompliance.deviceRecord.create",
    GET: { name: "securityAndCompliance.deviceRecord.list", pagination: { argIndex: 0 } }
  },
  "/security_and_compliance/v2/device_records/{device_record_id}": {
    GET: "securityAndCompliance.deviceRecord.get",
    PUT: "securityAndCompliance.deviceRecord.update",
    DELETE: "securityAndCompliance.deviceRecord.delete"
  },
  "/security_and_compliance/v2/device_apply_records/{device_apply_record_id}": {
    PUT: "securityAndCompliance.deviceApplyRecord.update"
  },
  "/security_and_compliance/v1/openapi_logs/list_data": {
    POST: "securityAndCompliance.openapiLog.listData"
  }
});

// src/types/sheets.ts
Internal.define({
  "/sheets/v3/spreadsheets": {
    POST: "sheets.spreadsheet.create"
  },
  "/sheets/v3/spreadsheets/{spreadsheet_token}": {
    PATCH: "sheets.spreadsheet.patch",
    GET: "sheets.spreadsheet.get"
  },
  "/sheets/v3/spreadsheets/{spreadsheet_token}/sheets/query": {
    GET: "sheets.spreadsheet.sheet.query"
  },
  "/sheets/v3/spreadsheets/{spreadsheet_token}/sheets/{sheet_id}": {
    GET: "sheets.spreadsheet.sheet.get"
  },
  "/sheets/v3/spreadsheets/{spreadsheet_token}/sheets/{sheet_id}/move_dimension": {
    POST: "sheets.spreadsheet.sheet.moveDimension"
  },
  "/sheets/v3/spreadsheets/{spreadsheet_token}/sheets/{sheet_id}/find": {
    POST: "sheets.spreadsheet.sheet.find"
  },
  "/sheets/v3/spreadsheets/{spreadsheet_token}/sheets/{sheet_id}/replace": {
    POST: "sheets.spreadsheet.sheet.replace"
  },
  "/sheets/v3/spreadsheets/{spreadsheet_token}/sheets/{sheet_id}/filter": {
    POST: "sheets.spreadsheet.sheet.filter.create",
    PUT: "sheets.spreadsheet.sheet.filter.update",
    GET: "sheets.spreadsheet.sheet.filter.get",
    DELETE: "sheets.spreadsheet.sheet.filter.delete"
  },
  "/sheets/v3/spreadsheets/{spreadsheet_token}/sheets/{sheet_id}/filter_views": {
    POST: "sheets.spreadsheet.sheet.filterView.create"
  },
  "/sheets/v3/spreadsheets/{spreadsheet_token}/sheets/{sheet_id}/filter_views/{filter_view_id}": {
    PATCH: "sheets.spreadsheet.sheet.filterView.patch",
    GET: "sheets.spreadsheet.sheet.filterView.get",
    DELETE: "sheets.spreadsheet.sheet.filterView.delete"
  },
  "/sheets/v3/spreadsheets/{spreadsheet_token}/sheets/{sheet_id}/filter_views/query": {
    GET: "sheets.spreadsheet.sheet.filterView.query"
  },
  "/sheets/v3/spreadsheets/{spreadsheet_token}/sheets/{sheet_id}/filter_views/{filter_view_id}/conditions": {
    POST: "sheets.spreadsheet.sheet.filterView.condition.create"
  },
  "/sheets/v3/spreadsheets/{spreadsheet_token}/sheets/{sheet_id}/filter_views/{filter_view_id}/conditions/{condition_id}": {
    PUT: "sheets.spreadsheet.sheet.filterView.condition.update",
    GET: "sheets.spreadsheet.sheet.filterView.condition.get",
    DELETE: "sheets.spreadsheet.sheet.filterView.condition.delete"
  },
  "/sheets/v3/spreadsheets/{spreadsheet_token}/sheets/{sheet_id}/filter_views/{filter_view_id}/conditions/query": {
    GET: "sheets.spreadsheet.sheet.filterView.condition.query"
  },
  "/sheets/v3/spreadsheets/{spreadsheet_token}/sheets/{sheet_id}/float_images": {
    POST: "sheets.spreadsheet.sheet.floatImage.create"
  },
  "/sheets/v3/spreadsheets/{spreadsheet_token}/sheets/{sheet_id}/float_images/{float_image_id}": {
    PATCH: "sheets.spreadsheet.sheet.floatImage.patch",
    GET: "sheets.spreadsheet.sheet.floatImage.get",
    DELETE: "sheets.spreadsheet.sheet.floatImage.delete"
  },
  "/sheets/v3/spreadsheets/{spreadsheet_token}/sheets/{sheet_id}/float_images/query": {
    GET: "sheets.spreadsheet.sheet.floatImage.query"
  }
});

// src/types/speech_to_text.ts
Internal.define({
  "/speech_to_text/v1/speech/file_recognize": {
    POST: "speechToText.speech.fileRecognize"
  },
  "/speech_to_text/v1/speech/stream_recognize": {
    POST: "speechToText.speech.streamRecognize"
  }
});

// src/types/task.ts
Internal.define({
  "/task/v2/tasks": {
    POST: "task.create",
    GET: { name: "task.list", pagination: { argIndex: 0 } }
  },
  "/task/v2/tasks/{task_guid}": {
    PATCH: "task.patch",
    GET: "task.get",
    DELETE: "task.delete"
  },
  "/task/v2/tasks/{task_guid}/add_members": {
    POST: "task.addMembers"
  },
  "/task/v2/tasks/{task_guid}/remove_members": {
    POST: "task.removeMembers"
  },
  "/task/v2/tasks/{task_guid}/tasklists": {
    GET: "task.tasklists"
  },
  "/task/v2/tasks/{task_guid}/add_tasklist": {
    POST: "task.addTasklist"
  },
  "/task/v2/tasks/{task_guid}/remove_tasklist": {
    POST: "task.removeTasklist"
  },
  "/task/v2/tasks/{task_guid}/add_reminders": {
    POST: "task.addReminders"
  },
  "/task/v2/tasks/{task_guid}/remove_reminders": {
    POST: "task.removeReminders"
  },
  "/task/v2/tasks/{task_guid}/add_dependencies": {
    POST: "task.addDependencies"
  },
  "/task/v2/tasks/{task_guid}/remove_dependencies": {
    POST: "task.removeDependencies"
  },
  "/task/v2/tasks/{task_guid}/subtasks": {
    POST: "task.subtask.create",
    GET: { name: "task.subtask.list", pagination: { argIndex: 1 } }
  },
  "/task/v2/tasklists": {
    POST: "task.tasklist.create",
    GET: { name: "task.tasklist.list", pagination: { argIndex: 0 } }
  },
  "/task/v2/tasklists/{tasklist_guid}": {
    GET: "task.tasklist.get",
    PATCH: "task.tasklist.patch",
    DELETE: "task.tasklist.delete"
  },
  "/task/v2/tasklists/{tasklist_guid}/add_members": {
    POST: "task.tasklist.addMembers"
  },
  "/task/v2/tasklists/{tasklist_guid}/remove_members": {
    POST: "task.tasklist.removeMembers"
  },
  "/task/v2/tasklists/{tasklist_guid}/tasks": {
    GET: { name: "task.tasklist.tasks", pagination: { argIndex: 1 } }
  },
  "/task/v2/tasklists/{tasklist_guid}/activity_subscriptions": {
    POST: "task.tasklist.activitySubscription.create",
    GET: "task.tasklist.activitySubscription.list"
  },
  "/task/v2/tasklists/{tasklist_guid}/activity_subscriptions/{activity_subscription_guid}": {
    GET: "task.tasklist.activitySubscription.get",
    PATCH: "task.tasklist.activitySubscription.patch",
    DELETE: "task.tasklist.activitySubscription.delete"
  },
  "/task/v2/comments": {
    POST: "task.comment.create",
    GET: { name: "task.comment.list", pagination: { argIndex: 0 } }
  },
  "/task/v2/comments/{comment_id}": {
    GET: "task.comment.get",
    PATCH: "task.comment.patch",
    DELETE: "task.comment.delete"
  },
  "/task/v2/attachments/upload": {
    POST: { name: "task.attachment.upload", multipart: true }
  },
  "/task/v2/attachments": {
    GET: { name: "task.attachment.list", pagination: { argIndex: 0 } }
  },
  "/task/v2/attachments/{attachment_guid}": {
    GET: "task.attachment.get",
    DELETE: "task.attachment.delete"
  },
  "/task/v2/sections": {
    POST: "task.section.create",
    GET: { name: "task.section.list", pagination: { argIndex: 0 } }
  },
  "/task/v2/sections/{section_guid}": {
    GET: "task.section.get",
    PATCH: "task.section.patch",
    DELETE: "task.section.delete"
  },
  "/task/v2/sections/{section_guid}/tasks": {
    GET: { name: "task.section.tasks", pagination: { argIndex: 1 } }
  },
  "/task/v2/custom_fields": {
    POST: "task.customField.create",
    GET: { name: "task.customField.list", pagination: { argIndex: 0 } }
  },
  "/task/v2/custom_fields/{custom_field_guid}": {
    GET: "task.customField.get",
    PATCH: "task.customField.patch"
  },
  "/task/v2/custom_fields/{custom_field_guid}/add": {
    POST: "task.customField.add"
  },
  "/task/v2/custom_fields/{custom_field_guid}/remove": {
    POST: "task.customField.remove"
  },
  "/task/v2/custom_fields/{custom_field_guid}/options": {
    POST: "task.customField.option.create"
  },
  "/task/v2/custom_fields/{custom_field_guid}/options/{option_guid}": {
    PATCH: "task.customField.option.patch"
  },
  "/task/v1/tasks/{task_id}/complete": {
    POST: "task.complete"
  },
  "/task/v1/tasks/{task_id}/uncomplete": {
    POST: "task.uncomplete"
  },
  "/task/v1/tasks/{task_id}/reminders": {
    POST: "task.reminder.create",
    GET: { name: "task.reminder.list", pagination: { argIndex: 1 } }
  },
  "/task/v1/tasks/{task_id}/reminders/{reminder_id}": {
    DELETE: "task.reminder.delete"
  },
  "/task/v1/tasks/{task_id}/comments/{comment_id}": {
    PUT: "task.comment.update"
  },
  "/task/v1/tasks/{task_id}/followers": {
    POST: "task.follower.create",
    GET: { name: "task.follower.list", pagination: { argIndex: 1 } }
  },
  "/task/v1/tasks/{task_id}/followers/{follower_id}": {
    DELETE: "task.follower.delete"
  },
  "/task/v1/tasks/{task_id}/batch_delete_follower": {
    POST: "task.batchDeleteFollower"
  },
  "/task/v1/tasks/{task_id}/collaborators": {
    POST: "task.collaborator.create",
    GET: { name: "task.collaborator.list", pagination: { argIndex: 1 } }
  },
  "/task/v1/tasks/{task_id}/collaborators/{collaborator_id}": {
    DELETE: "task.collaborator.delete"
  },
  "/task/v1/tasks/{task_id}/batch_delete_collaborator": {
    POST: "task.batchDeleteCollaborator"
  }
});

// src/types/tenant.ts
Internal.define({
  "/tenant/v2/tenant/assign_info_list/query": {
    GET: "tenant.productAssignInfo.query"
  },
  "/tenant/v2/tenant/query": {
    GET: "tenant.query"
  }
});

// src/types/translation.ts
Internal.define({
  "/translation/v1/text/detect": {
    POST: "translation.text.detect"
  },
  "/translation/v1/text/translate": {
    POST: "translation.text.translate"
  }
});

// src/types/trust_party.ts
Internal.define({
  "/trust_party/v1/collaboration_tenants": {
    GET: { name: "trustParty.collaborationTenant.list", pagination: { argIndex: 0, itemsKey: "target_tenant_list" } }
  },
  "/trust_party/v1/collaboration_tenants/{target_tenant_key}/visible_organization": {
    GET: { name: "trustParty.collaborationTenant.visibleOrganization", pagination: { argIndex: 1, itemsKey: "collaboration_entity_list" } }
  },
  "/trust_party/v1/collaboration_tenants/{target_tenant_key}": {
    GET: "trustParty.collaborationTenant.get"
  },
  "/trust_party/v1/collaboration_tenants/{target_tenant_key}/collaboration_users/{target_user_id}": {
    GET: "trustParty.collaborationTenant.collaborationUser.get"
  },
  "/trust_party/v1/collaboration_tenants/{target_tenant_key}/collaboration_departments/{target_department_id}": {
    GET: "trustParty.collaborationTenant.collaborationDepartment.get"
  }
});

// src/types/vc.ts
var Vc;
((Vc2) => {
  let Meeting;
  ((Meeting2) => {
    let Recording;
    ((Recording2) => {
      let SetPermissionRequestActionType;
      ((SetPermissionRequestActionType2) => {
        SetPermissionRequestActionType2[SetPermissionRequestActionType2["Authorize"] = 0] = "Authorize";
        SetPermissionRequestActionType2[SetPermissionRequestActionType2["Revoke"] = 1] = "Revoke";
      })(SetPermissionRequestActionType = Recording2.SetPermissionRequestActionType || (Recording2.SetPermissionRequestActionType = {}));
    })(Recording = Meeting2.Recording || (Meeting2.Recording = {}));
  })(Meeting = Vc2.Meeting || (Vc2.Meeting = {}));
  let Report2;
  ((Report3) => {
    let GetDailyQueryUnit;
    ((GetDailyQueryUnit2) => {
      GetDailyQueryUnit2[GetDailyQueryUnit2["CN"] = 0] = "CN";
      GetDailyQueryUnit2[GetDailyQueryUnit2["VA"] = 1] = "VA";
      GetDailyQueryUnit2[GetDailyQueryUnit2["SG"] = 2] = "SG";
      GetDailyQueryUnit2[GetDailyQueryUnit2["JP"] = 3] = "JP";
    })(GetDailyQueryUnit = Report3.GetDailyQueryUnit || (Report3.GetDailyQueryUnit = {}));
    let GetTopUserQueryOrderBy;
    ((GetTopUserQueryOrderBy2) => {
      GetTopUserQueryOrderBy2[GetTopUserQueryOrderBy2["MeetingCount"] = 1] = "MeetingCount";
      GetTopUserQueryOrderBy2[GetTopUserQueryOrderBy2["MeetingDuration"] = 2] = "MeetingDuration";
    })(GetTopUserQueryOrderBy = Report3.GetTopUserQueryOrderBy || (Report3.GetTopUserQueryOrderBy = {}));
    let GetTopUserQueryUnit;
    ((GetTopUserQueryUnit2) => {
      GetTopUserQueryUnit2[GetTopUserQueryUnit2["CN"] = 0] = "CN";
      GetTopUserQueryUnit2[GetTopUserQueryUnit2["VA"] = 1] = "VA";
      GetTopUserQueryUnit2[GetTopUserQueryUnit2["SG"] = 2] = "SG";
      GetTopUserQueryUnit2[GetTopUserQueryUnit2["JP"] = 3] = "JP";
    })(GetTopUserQueryUnit = Report3.GetTopUserQueryUnit || (Report3.GetTopUserQueryUnit = {}));
  })(Report2 = Vc2.Report || (Vc2.Report = {}));
  let Export;
  ((Export2) => {
    let MeetingListRequestMeetingStatus;
    ((MeetingListRequestMeetingStatus2) => {
      MeetingListRequestMeetingStatus2[MeetingListRequestMeetingStatus2["Ongoing"] = 1] = "Ongoing";
      MeetingListRequestMeetingStatus2[MeetingListRequestMeetingStatus2["Past"] = 2] = "Past";
      MeetingListRequestMeetingStatus2[MeetingListRequestMeetingStatus2["Future"] = 3] = "Future";
    })(MeetingListRequestMeetingStatus = Export2.MeetingListRequestMeetingStatus || (Export2.MeetingListRequestMeetingStatus = {}));
    let MeetingListRequestMeetingType;
    ((MeetingListRequestMeetingType2) => {
      MeetingListRequestMeetingType2[MeetingListRequestMeetingType2["All"] = 1] = "All";
      MeetingListRequestMeetingType2[MeetingListRequestMeetingType2["Meeting"] = 2] = "Meeting";
      MeetingListRequestMeetingType2[MeetingListRequestMeetingType2["ShareScreen"] = 3] = "ShareScreen";
    })(MeetingListRequestMeetingType = Export2.MeetingListRequestMeetingType || (Export2.MeetingListRequestMeetingType = {}));
    let ParticipantListRequestMeetingStatus;
    ((ParticipantListRequestMeetingStatus2) => {
      ParticipantListRequestMeetingStatus2[ParticipantListRequestMeetingStatus2["Ongoing"] = 1] = "Ongoing";
      ParticipantListRequestMeetingStatus2[ParticipantListRequestMeetingStatus2["Past"] = 2] = "Past";
      ParticipantListRequestMeetingStatus2[ParticipantListRequestMeetingStatus2["Future"] = 3] = "Future";
    })(ParticipantListRequestMeetingStatus = Export2.ParticipantListRequestMeetingStatus || (Export2.ParticipantListRequestMeetingStatus = {}));
    let GetResponseStatus;
    ((GetResponseStatus2) => {
      GetResponseStatus2[GetResponseStatus2["InProgress"] = 1] = "InProgress";
      GetResponseStatus2[GetResponseStatus2["Failed"] = 2] = "Failed";
      GetResponseStatus2[GetResponseStatus2["Done"] = 3] = "Done";
    })(GetResponseStatus = Export2.GetResponseStatus || (Export2.GetResponseStatus = {}));
  })(Export = Vc2.Export || (Vc2.Export = {}));
  let ScopeConfig;
  ((ScopeConfig2) => {
    let GetQueryScopeType;
    ((GetQueryScopeType2) => {
      GetQueryScopeType2[GetQueryScopeType2["RoomLevel"] = 1] = "RoomLevel";
      GetQueryScopeType2[GetQueryScopeType2["Room"] = 2] = "Room";
    })(GetQueryScopeType = ScopeConfig2.GetQueryScopeType || (ScopeConfig2.GetQueryScopeType = {}));
    let CreateRequestScopeType;
    ((CreateRequestScopeType2) => {
      CreateRequestScopeType2[CreateRequestScopeType2["RoomLevel"] = 1] = "RoomLevel";
      CreateRequestScopeType2[CreateRequestScopeType2["Room"] = 2] = "Room";
    })(CreateRequestScopeType = ScopeConfig2.CreateRequestScopeType || (ScopeConfig2.CreateRequestScopeType = {}));
  })(ScopeConfig = Vc2.ScopeConfig || (Vc2.ScopeConfig = {}));
  let MeetingList;
  ((MeetingList2) => {
    let GetQueryMeetingStatus;
    ((GetQueryMeetingStatus2) => {
      GetQueryMeetingStatus2[GetQueryMeetingStatus2["Ongoing"] = 1] = "Ongoing";
      GetQueryMeetingStatus2[GetQueryMeetingStatus2["Past"] = 2] = "Past";
      GetQueryMeetingStatus2[GetQueryMeetingStatus2["Future"] = 3] = "Future";
    })(GetQueryMeetingStatus = MeetingList2.GetQueryMeetingStatus || (MeetingList2.GetQueryMeetingStatus = {}));
    let GetQueryMeetingType;
    ((GetQueryMeetingType2) => {
      GetQueryMeetingType2[GetQueryMeetingType2["All"] = 1] = "All";
      GetQueryMeetingType2[GetQueryMeetingType2["Meeting"] = 2] = "Meeting";
      GetQueryMeetingType2[GetQueryMeetingType2["ShareScreen"] = 3] = "ShareScreen";
    })(GetQueryMeetingType = MeetingList2.GetQueryMeetingType || (MeetingList2.GetQueryMeetingType = {}));
  })(MeetingList = Vc2.MeetingList || (Vc2.MeetingList = {}));
  let ParticipantList;
  ((ParticipantList2) => {
    let GetQueryMeetingStatus;
    ((GetQueryMeetingStatus2) => {
      GetQueryMeetingStatus2[GetQueryMeetingStatus2["Ongoing"] = 1] = "Ongoing";
      GetQueryMeetingStatus2[GetQueryMeetingStatus2["Past"] = 2] = "Past";
      GetQueryMeetingStatus2[GetQueryMeetingStatus2["Future"] = 3] = "Future";
    })(GetQueryMeetingStatus = ParticipantList2.GetQueryMeetingStatus || (ParticipantList2.GetQueryMeetingStatus = {}));
  })(ParticipantList = Vc2.ParticipantList || (Vc2.ParticipantList = {}));
  let Alert;
  ((Alert2) => {
    let ListQueryQueryType;
    ((ListQueryQueryType2) => {
      ListQueryQueryType2[ListQueryQueryType2["Room"] = 1] = "Room";
      ListQueryQueryType2[ListQueryQueryType2["Erc"] = 2] = "Erc";
      ListQueryQueryType2[ListQueryQueryType2["Sip"] = 3] = "Sip";
    })(ListQueryQueryType = Alert2.ListQueryQueryType || (Alert2.ListQueryQueryType = {}));
  })(Alert = Vc2.Alert || (Vc2.Alert = {}));
  let RoomConfig;
  ((RoomConfig2) => {
    let SetCheckboardAccessCodeRequestScope;
    ((SetCheckboardAccessCodeRequestScope2) => {
      SetCheckboardAccessCodeRequestScope2[SetCheckboardAccessCodeRequestScope2["Tenant"] = 1] = "Tenant";
      SetCheckboardAccessCodeRequestScope2[SetCheckboardAccessCodeRequestScope2["CountryDistrict"] = 2] = "CountryDistrict";
      SetCheckboardAccessCodeRequestScope2[SetCheckboardAccessCodeRequestScope2["City"] = 3] = "City";
      SetCheckboardAccessCodeRequestScope2[SetCheckboardAccessCodeRequestScope2["Building"] = 4] = "Building";
      SetCheckboardAccessCodeRequestScope2[SetCheckboardAccessCodeRequestScope2["Floor"] = 5] = "Floor";
      SetCheckboardAccessCodeRequestScope2[SetCheckboardAccessCodeRequestScope2["Room"] = 6] = "Room";
    })(SetCheckboardAccessCodeRequestScope = RoomConfig2.SetCheckboardAccessCodeRequestScope || (RoomConfig2.SetCheckboardAccessCodeRequestScope = {}));
    let SetCheckboardAccessCodeRequestValidDay;
    ((SetCheckboardAccessCodeRequestValidDay2) => {
      SetCheckboardAccessCodeRequestValidDay2[SetCheckboardAccessCodeRequestValidDay2["Day"] = 1] = "Day";
      SetCheckboardAccessCodeRequestValidDay2[SetCheckboardAccessCodeRequestValidDay2["Week"] = 7] = "Week";
      SetCheckboardAccessCodeRequestValidDay2[SetCheckboardAccessCodeRequestValidDay2["Month"] = 30] = "Month";
    })(SetCheckboardAccessCodeRequestValidDay = RoomConfig2.SetCheckboardAccessCodeRequestValidDay || (RoomConfig2.SetCheckboardAccessCodeRequestValidDay = {}));
    let SetRoomAccessCodeRequestScope;
    ((SetRoomAccessCodeRequestScope2) => {
      SetRoomAccessCodeRequestScope2[SetRoomAccessCodeRequestScope2["Tenant"] = 1] = "Tenant";
      SetRoomAccessCodeRequestScope2[SetRoomAccessCodeRequestScope2["CountryDistrict"] = 2] = "CountryDistrict";
      SetRoomAccessCodeRequestScope2[SetRoomAccessCodeRequestScope2["City"] = 3] = "City";
      SetRoomAccessCodeRequestScope2[SetRoomAccessCodeRequestScope2["Building"] = 4] = "Building";
      SetRoomAccessCodeRequestScope2[SetRoomAccessCodeRequestScope2["Floor"] = 5] = "Floor";
      SetRoomAccessCodeRequestScope2[SetRoomAccessCodeRequestScope2["Room"] = 6] = "Room";
    })(SetRoomAccessCodeRequestScope = RoomConfig2.SetRoomAccessCodeRequestScope || (RoomConfig2.SetRoomAccessCodeRequestScope = {}));
    let SetRoomAccessCodeRequestValidDay;
    ((SetRoomAccessCodeRequestValidDay2) => {
      SetRoomAccessCodeRequestValidDay2[SetRoomAccessCodeRequestValidDay2["Day"] = 1] = "Day";
      SetRoomAccessCodeRequestValidDay2[SetRoomAccessCodeRequestValidDay2["Week"] = 7] = "Week";
      SetRoomAccessCodeRequestValidDay2[SetRoomAccessCodeRequestValidDay2["Month"] = 30] = "Month";
    })(SetRoomAccessCodeRequestValidDay = RoomConfig2.SetRoomAccessCodeRequestValidDay || (RoomConfig2.SetRoomAccessCodeRequestValidDay = {}));
    let QueryQueryScope;
    ((QueryQueryScope2) => {
      QueryQueryScope2[QueryQueryScope2["Tenant"] = 1] = "Tenant";
      QueryQueryScope2[QueryQueryScope2["CountryDistrict"] = 2] = "CountryDistrict";
      QueryQueryScope2[QueryQueryScope2["City"] = 3] = "City";
      QueryQueryScope2[QueryQueryScope2["Building"] = 4] = "Building";
      QueryQueryScope2[QueryQueryScope2["Floor"] = 5] = "Floor";
      QueryQueryScope2[QueryQueryScope2["Room"] = 6] = "Room";
    })(QueryQueryScope = RoomConfig2.QueryQueryScope || (RoomConfig2.QueryQueryScope = {}));
    let SetRequestScope;
    ((SetRequestScope2) => {
      SetRequestScope2[SetRequestScope2["Tenant"] = 1] = "Tenant";
      SetRequestScope2[SetRequestScope2["CountryDistrict"] = 2] = "CountryDistrict";
      SetRequestScope2[SetRequestScope2["City"] = 3] = "City";
      SetRequestScope2[SetRequestScope2["Building"] = 4] = "Building";
      SetRequestScope2[SetRequestScope2["Floor"] = 5] = "Floor";
      SetRequestScope2[SetRequestScope2["Room"] = 6] = "Room";
    })(SetRequestScope = RoomConfig2.SetRequestScope || (RoomConfig2.SetRequestScope = {}));
  })(RoomConfig = Vc2.RoomConfig || (Vc2.RoomConfig = {}));
})(Vc || (Vc = {}));
Internal.define({
  "/vc/v1/reserves/apply": {
    POST: "vc.reserve.apply"
  },
  "/vc/v1/reserves/{reserve_id}": {
    DELETE: "vc.reserve.delete",
    PUT: "vc.reserve.update",
    GET: "vc.reserve.get"
  },
  "/vc/v1/reserves/{reserve_id}/get_active_meeting": {
    GET: "vc.reserve.getActiveMeeting"
  },
  "/vc/v1/meetings/{meeting_id}/invite": {
    PATCH: "vc.meeting.invite"
  },
  "/vc/v1/meetings/{meeting_id}/kickout": {
    POST: "vc.meeting.kickout"
  },
  "/vc/v1/meetings/{meeting_id}/set_host": {
    PATCH: "vc.meeting.setHost"
  },
  "/vc/v1/meetings/{meeting_id}/end": {
    PATCH: "vc.meeting.end"
  },
  "/vc/v1/meetings/{meeting_id}": {
    GET: "vc.meeting.get"
  },
  "/vc/v1/meetings/list_by_no": {
    GET: { name: "vc.meeting.listByNo", pagination: { argIndex: 0, itemsKey: "meeting_briefs" } }
  },
  "/vc/v1/meetings/{meeting_id}/recording/start": {
    PATCH: "vc.meeting.recording.start"
  },
  "/vc/v1/meetings/{meeting_id}/recording/stop": {
    PATCH: "vc.meeting.recording.stop"
  },
  "/vc/v1/meetings/{meeting_id}/recording": {
    GET: "vc.meeting.recording.get"
  },
  "/vc/v1/meetings/{meeting_id}/recording/set_permission": {
    PATCH: "vc.meeting.recording.setPermission"
  },
  "/vc/v1/reports/get_daily": {
    GET: "vc.report.getDaily"
  },
  "/vc/v1/reports/get_top_user": {
    GET: "vc.report.getTopUser"
  },
  "/vc/v1/exports/meeting_list": {
    POST: "vc.export.meetingList"
  },
  "/vc/v1/exports/participant_list": {
    POST: "vc.export.participantList"
  },
  "/vc/v1/exports/participant_quality_list": {
    POST: "vc.export.participantQualityList"
  },
  "/vc/v1/exports/resource_reservation_list": {
    POST: "vc.export.resourceReservationList"
  },
  "/vc/v1/exports/{task_id}": {
    GET: "vc.export.get"
  },
  "/vc/v1/exports/download": {
    GET: { name: "vc.export.download", type: "binary" }
  },
  "/vc/v1/room_levels": {
    POST: "vc.roomLevel.create",
    GET: { name: "vc.roomLevel.list", pagination: { argIndex: 0 } }
  },
  "/vc/v1/room_levels/del": {
    POST: "vc.roomLevel.del"
  },
  "/vc/v1/room_levels/{room_level_id}": {
    PATCH: "vc.roomLevel.patch",
    GET: "vc.roomLevel.get"
  },
  "/vc/v1/room_levels/mget": {
    POST: "vc.roomLevel.mget"
  },
  "/vc/v1/room_levels/search": {
    GET: "vc.roomLevel.search"
  },
  "/vc/v1/rooms": {
    POST: "vc.room.create",
    GET: { name: "vc.room.list", pagination: { argIndex: 0, itemsKey: "rooms" } }
  },
  "/vc/v1/rooms/{room_id}": {
    DELETE: "vc.room.delete",
    PATCH: "vc.room.patch",
    GET: "vc.room.get"
  },
  "/vc/v1/rooms/mget": {
    POST: "vc.room.mget"
  },
  "/vc/v1/rooms/search": {
    POST: "vc.room.search"
  },
  "/vc/v1/scope_config": {
    GET: "vc.scopeConfig.get",
    POST: "vc.scopeConfig.create"
  },
  "/vc/v1/reserve_configs/reserve_scope": {
    GET: "vc.reserveConfig.reserveScope"
  },
  "/vc/v1/reserve_configs/{reserve_config_id}": {
    PATCH: "vc.reserveConfig.patch"
  },
  "/vc/v1/reserve_configs/{reserve_config_id}/form": {
    GET: "vc.reserveConfig.form.get",
    PATCH: "vc.reserveConfig.form.patch"
  },
  "/vc/v1/reserve_configs/{reserve_config_id}/admin": {
    GET: "vc.reserveConfig.admin.get",
    PATCH: "vc.reserveConfig.admin.patch"
  },
  "/vc/v1/reserve_configs/{reserve_config_id}/disable_inform": {
    GET: "vc.reserveConfig.disableInform.get",
    PATCH: "vc.reserveConfig.disableInform.patch"
  },
  "/vc/v1/meeting_list": {
    GET: { name: "vc.meetingList.get", pagination: { argIndex: 0, itemsKey: "meeting_list" } }
  },
  "/vc/v1/participant_list": {
    GET: { name: "vc.participantList.get", pagination: { argIndex: 0, itemsKey: "participants" } }
  },
  "/vc/v1/participant_quality_list": {
    GET: { name: "vc.participantQualityList.get", pagination: { argIndex: 0, itemsKey: "participant_quality_list" } }
  },
  "/vc/v1/resource_reservation_list": {
    GET: { name: "vc.resourceReservationList.get", pagination: { argIndex: 0, itemsKey: "room_reservation_list" } }
  },
  "/vc/v1/alerts": {
    GET: { name: "vc.alert.list", pagination: { argIndex: 0 } }
  },
  "/vc/v1/room_configs/set_checkboard_access_code": {
    POST: "vc.roomConfig.setCheckboardAccessCode"
  },
  "/vc/v1/room_configs/set_room_access_code": {
    POST: "vc.roomConfig.setRoomAccessCode"
  },
  "/vc/v1/room_configs/query": {
    GET: "vc.roomConfig.query"
  },
  "/vc/v1/room_configs/set": {
    POST: "vc.roomConfig.set"
  }
});

// src/types/verification.ts
Internal.define({
  "/verification/v1/verification": {
    GET: "verification.get"
  }
});

// src/types/wiki.ts
Internal.define({
  "/wiki/v2/spaces": {
    GET: { name: "wiki.space.list", pagination: { argIndex: 0 } },
    POST: "wiki.space.create"
  },
  "/wiki/v2/spaces/{space_id}": {
    GET: "wiki.space.get"
  },
  "/wiki/v2/spaces/{space_id}/members": {
    GET: { name: "wiki.space.member.list", pagination: { argIndex: 1, itemsKey: "members" } },
    POST: "wiki.space.member.create"
  },
  "/wiki/v2/spaces/{space_id}/members/{member_id}": {
    DELETE: "wiki.space.member.delete"
  },
  "/wiki/v2/spaces/{space_id}/setting": {
    PUT: "wiki.space.setting.update"
  },
  "/wiki/v2/spaces/{space_id}/nodes": {
    POST: "wiki.space.node.create",
    GET: { name: "wiki.space.node.list", pagination: { argIndex: 1 } }
  },
  "/wiki/v2/spaces/get_node": {
    GET: "wiki.space.getNode"
  },
  "/wiki/v2/spaces/{space_id}/nodes/{node_token}/move": {
    POST: "wiki.space.node.move"
  },
  "/wiki/v2/spaces/{space_id}/nodes/{node_token}/update_title": {
    POST: "wiki.space.node.updateTitle"
  },
  "/wiki/v2/spaces/{space_id}/nodes/{node_token}/copy": {
    POST: "wiki.space.node.copy"
  },
  "/wiki/v2/spaces/{space_id}/nodes/move_docs_to_wiki": {
    POST: "wiki.space.node.moveDocsToWiki"
  },
  "/wiki/v2/tasks/{task_id}": {
    GET: "wiki.task.get"
  },
  "/wiki/v1/nodes/search": {
    POST: { name: "wiki.node.search", pagination: { argIndex: 1 } }
  }
});

// src/types/workplace.ts
Internal.define({
  "/workplace/v1/workplace_access_data/search": {
    POST: { name: "workplace.workplaceAccessData.search", pagination: { argIndex: 0 } }
  },
  "/workplace/v1/custom_workplace_access_data/search": {
    POST: { name: "workplace.customWorkplaceAccessData.search", pagination: { argIndex: 0 } }
  },
  "/workplace/v1/workplace_block_access_data/search": {
    POST: { name: "workplace.workplaceBlockAccessData.search", pagination: { argIndex: 0 } }
  }
});

// src/types/index.ts
var AbnormalCode = /* @__PURE__ */ ((AbnormalCode2) => {
  AbnormalCode2[AbnormalCode2["SUCCESS"] = 0] = "SUCCESS";
  AbnormalCode2[AbnormalCode2["FORBIDDEN"] = 1e3] = "FORBIDDEN";
  return AbnormalCode2;
})(AbnormalCode || {});
var AilyMessageContentType = /* @__PURE__ */ ((AilyMessageContentType2) => {
  AilyMessageContentType2["ContentTypeMDX"] = "MDX";
  AilyMessageContentType2["ContentTypeText"] = "TEXT";
  AilyMessageContentType2["ContentTypeClip"] = "CLIP";
  AilyMessageContentType2["ContentTypeSmartCard"] = "SmartCard";
  AilyMessageContentType2["ContentTypeJSON"] = "JSON";
  return AilyMessageContentType2;
})(AilyMessageContentType || {});
var AilyMessageStatus = /* @__PURE__ */ ((AilyMessageStatus2) => {
  AilyMessageStatus2["MessageStatusInProgress"] = "IN_PROGRESS";
  AilyMessageStatus2["MessageStatusCompleted"] = "COMPLETED";
  return AilyMessageStatus2;
})(AilyMessageStatus || {});
var AilySenderType = /* @__PURE__ */ ((AilySenderType2) => {
  AilySenderType2["SenderTypeUser"] = "USER";
  AilySenderType2["SenderTypeAssistant"] = "ASSISTANT";
  return AilySenderType2;
})(AilySenderType || {});
var ColorType = /* @__PURE__ */ ((ColorType2) => {
  ColorType2[ColorType2["SystemColor"] = 0] = "SystemColor";
  ColorType2[ColorType2["CustomColor"] = 1] = "CustomColor";
  return ColorType2;
})(ColorType || {});
var ConnectorArrowStyle = /* @__PURE__ */ ((ConnectorArrowStyle2) => {
  ConnectorArrowStyle2["None"] = "none";
  ConnectorArrowStyle2["LineArrow"] = "line_arrow";
  ConnectorArrowStyle2["TriangleArrow"] = "triangle_arrow";
  ConnectorArrowStyle2["EmptyTriangleArrow"] = "empty_triangle_arrow";
  ConnectorArrowStyle2["CircleArrow"] = "circle_arrow";
  ConnectorArrowStyle2["EmptyCircleArrow"] = "empty_circle_arrow";
  ConnectorArrowStyle2["DiamondArrow"] = "diamond_arrow";
  ConnectorArrowStyle2["EmptyDiamondArrow"] = "empty_diamond_arrow";
  ConnectorArrowStyle2["SingleArrow"] = "single_arrow";
  ConnectorArrowStyle2["MultiArrow"] = "multi_arrow";
  ConnectorArrowStyle2["ExactSingleArrow"] = "exact_single_arrow";
  ConnectorArrowStyle2["ZeroOrMultiArrow"] = "zero_or_multi_arrow";
  ConnectorArrowStyle2["ZeroOrSingleArrow"] = "zero_or_single_arrow";
  ConnectorArrowStyle2["SingleOrMultiArrow"] = "single_or_multi_arrow";
  ConnectorArrowStyle2["XArrow"] = "x_arrow";
  return ConnectorArrowStyle2;
})(ConnectorArrowStyle || {});
var ConnectorLineShape = /* @__PURE__ */ ((ConnectorLineShape2) => {
  ConnectorLineShape2["Straight"] = "straight";
  ConnectorLineShape2["Polyline"] = "polyline";
  ConnectorLineShape2["Curve"] = "curve";
  ConnectorLineShape2["RightAngledPolyline"] = "right_angled_polyline";
  return ConnectorLineShape2;
})(ConnectorLineShape || {});
var CustomFieldValueEnumType = /* @__PURE__ */ ((CustomFieldValueEnumType2) => {
  CustomFieldValueEnumType2["CustomFieldValueEnumTypeText"] = "1";
  CustomFieldValueEnumType2["CustomFieldValueEnumTypePicture"] = "2";
  return CustomFieldValueEnumType2;
})(CustomFieldValueEnumType || {});
var CustomFieldValueType = /* @__PURE__ */ ((CustomFieldValueType2) => {
  CustomFieldValueType2["CustomFieldValueTypeText"] = "1";
  CustomFieldValueType2["CustomFieldValueTypeUrl"] = "2";
  CustomFieldValueType2["CustomFieldValueTypeEnum"] = "3";
  CustomFieldValueType2["CustomFieldValueTypeGenericUser"] = "4";
  CustomFieldValueType2["CustomFieldFieldTypeDirectoryMultiEnum"] = "10";
  CustomFieldValueType2["CustomFieldFieldTypeDirectoryMultiGenericUser"] = "11";
  return CustomFieldValueType2;
})(CustomFieldValueType || {});
var CustomFieldValueUserType = /* @__PURE__ */ ((CustomFieldValueUserType2) => {
  CustomFieldValueUserType2["CustomFieldValueUserTypeEmployee"] = "1";
  return CustomFieldValueUserType2;
})(CustomFieldValueUserType || {});
var DataSource = /* @__PURE__ */ ((DataSource2) => {
  DataSource2[DataSource2["FEISHU_ADMIN"] = 1] = "FEISHU_ADMIN";
  DataSource2[DataSource2["CORE_HR"] = 2] = "CORE_HR";
  DataSource2[DataSource2["DIR_SYNC_VISA_SCIM"] = 3] = "DIR_SYNC_VISA_SCIM";
  return DataSource2;
})(DataSource || {});
var DiagramType = /* @__PURE__ */ ((DiagramType2) => {
  DiagramType2[DiagramType2["UNKOWN"] = 0] = "UNKOWN";
  DiagramType2[DiagramType2["MIND_MAP"] = 1] = "MIND_MAP";
  DiagramType2[DiagramType2["SEQUENCE"] = 2] = "SEQUENCE";
  DiagramType2[DiagramType2["ACTIVITY"] = 3] = "ACTIVITY";
  DiagramType2[DiagramType2["CLASS"] = 4] = "CLASS";
  DiagramType2[DiagramType2["ER"] = 5] = "ER";
  DiagramType2[DiagramType2["FLOWCHART"] = 6] = "FLOWCHART";
  DiagramType2[DiagramType2["STATE"] = 7] = "STATE";
  DiagramType2[DiagramType2["COMPONENT_DIAGRAM"] = 8] = "COMPONENT_DIAGRAM";
  DiagramType2[DiagramType2["STREAMING_ACTIVITY"] = 101] = "STREAMING_ACTIVITY";
  DiagramType2[DiagramType2["STREAMING_SEQUENCE"] = 102] = "STREAMING_SEQUENCE";
  DiagramType2[DiagramType2["TIMELINE_GML"] = 201] = "TIMELINE_GML";
  return DiagramType2;
})(DiagramType || {});
var EmployeeActiveStatusDirectory = /* @__PURE__ */ ((EmployeeActiveStatusDirectory2) => {
  EmployeeActiveStatusDirectory2[EmployeeActiveStatusDirectory2["EmployeeActiveStatusDirectoryUnregister"] = 1] = "EmployeeActiveStatusDirectoryUnregister";
  EmployeeActiveStatusDirectory2[EmployeeActiveStatusDirectory2["EmployeeActiveStatusDirectoryRegister"] = 2] = "EmployeeActiveStatusDirectoryRegister";
  EmployeeActiveStatusDirectory2[EmployeeActiveStatusDirectory2["EmployeeActiveStatusDirectoryFrozen"] = 3] = "EmployeeActiveStatusDirectoryFrozen";
  EmployeeActiveStatusDirectory2[EmployeeActiveStatusDirectory2["EmployeeActiveStatusDirectoryQuit"] = 4] = "EmployeeActiveStatusDirectoryQuit";
  EmployeeActiveStatusDirectory2[EmployeeActiveStatusDirectory2["EmployeeActiveStatusDirectoryUnjoined"] = 5] = "EmployeeActiveStatusDirectoryUnjoined";
  return EmployeeActiveStatusDirectory2;
})(EmployeeActiveStatusDirectory || {});
var EmployeeStaffStatusDirectory = /* @__PURE__ */ ((EmployeeStaffStatusDirectory2) => {
  EmployeeStaffStatusDirectory2[EmployeeStaffStatusDirectory2["EmployeeStaffStatusDirectoryUnResigned"] = 1] = "EmployeeStaffStatusDirectoryUnResigned";
  EmployeeStaffStatusDirectory2[EmployeeStaffStatusDirectory2["EmployeeStaffStatusDirectoryResigned"] = 2] = "EmployeeStaffStatusDirectoryResigned";
  EmployeeStaffStatusDirectory2[EmployeeStaffStatusDirectory2["EmployeeStaffStatusDirectoryPreEntry"] = 3] = "EmployeeStaffStatusDirectoryPreEntry";
  EmployeeStaffStatusDirectory2[EmployeeStaffStatusDirectory2["EmployeeStaffStatusDirectoryCancelledEntry"] = 4] = "EmployeeStaffStatusDirectoryCancelledEntry";
  EmployeeStaffStatusDirectory2[EmployeeStaffStatusDirectory2["EmployeeStaffStatusDirectoryPreResigned"] = 5] = "EmployeeStaffStatusDirectoryPreResigned";
  return EmployeeStaffStatusDirectory2;
})(EmployeeStaffStatusDirectory || {});
var GenderDirectory = /* @__PURE__ */ ((GenderDirectory2) => {
  GenderDirectory2[GenderDirectory2["GenderDirectoryUnknown"] = 0] = "GenderDirectoryUnknown";
  GenderDirectory2[GenderDirectory2["GenderDirectoryMan"] = 1] = "GenderDirectoryMan";
  GenderDirectory2[GenderDirectory2["GenderDirectoryWoman"] = 2] = "GenderDirectoryWoman";
  GenderDirectory2[GenderDirectory2["GenderDirectoryOther"] = 3] = "GenderDirectoryOther";
  return GenderDirectory2;
})(GenderDirectory || {});
var IdentityProvider = /* @__PURE__ */ ((IdentityProvider2) => {
  IdentityProvider2["IdentityProviderAily"] = "AILY";
  IdentityProvider2["IdentityProviderFeishu"] = "FEISHU";
  return IdentityProvider2;
})(IdentityProvider || {});
var MindMapLayout = /* @__PURE__ */ ((MindMapLayout2) => {
  MindMapLayout2["UpDown"] = "up_down";
  MindMapLayout2["LeftRight"] = "left_right";
  MindMapLayout2["TreeLeft"] = "tree_left";
  MindMapLayout2["TreeRight"] = "tree_right";
  MindMapLayout2["TreeBalance"] = "tree_balance";
  MindMapLayout2["VerticalTimeLine"] = "vertical_time_line";
  MindMapLayout2["HorizontalTimeLine"] = "horizontal_time_line";
  return MindMapLayout2;
})(MindMapLayout || {});
var MindMapType = /* @__PURE__ */ ((MindMapType2) => {
  MindMapType2["MindMapText"] = "mind_map_text";
  MindMapType2["MindMapFullRoundRect"] = "mind_map_full_round_rect";
  MindMapType2["MindMapRoundRect"] = "mind_map_round_rect";
  return MindMapType2;
})(MindMapType || {});
var PaintType = /* @__PURE__ */ ((PaintType2) => {
  PaintType2["Marker"] = "marker";
  PaintType2["Highlight"] = "highlight";
  return PaintType2;
})(PaintType || {});
var ResignReasonDirectory = /* @__PURE__ */ ((ResignReasonDirectory2) => {
  ResignReasonDirectory2["ResignReasonDirectoryEmpty"] = "0";
  ResignReasonDirectory2["ResignReasonDirectoryNotSatisfiedWithSalary"] = "1";
  ResignReasonDirectory2["ResignReasonDirectoryWorkingPressure"] = "2";
  ResignReasonDirectory2["ResignReasonDirectoryNotSatisfiedWithWorkContent"] = "3";
  ResignReasonDirectory2["ResignReasonDirectoryLackOfRecognitionOfLeader"] = "4";
  ResignReasonDirectory2["ResignReasonDirectoryCareerDevelopment"] = "5";
  ResignReasonDirectory2["ResignReasonDirectoryLackOfRecognitionOfCompanyCulture"] = "6";
  ResignReasonDirectory2["ResignReasonDirectoryActiveOrganizeBusinessAdjustment"] = "7";
  ResignReasonDirectory2["ResignReasonDirectoryContractNotRenewed"] = "8";
  ResignReasonDirectory2["ResignReasonDirectoryJobHopping"] = "9";
  ResignReasonDirectory2["ResignReasonDirectoryChangeCareer"] = "10";
  ResignReasonDirectory2["ResignReasonDirectoryFamily"] = "11";
  ResignReasonDirectory2["ResignReasonDirectoryPoorHealth"] = "12";
  ResignReasonDirectory2["ResignReasonDirectoryWorkPlace"] = "13";
  ResignReasonDirectory2["ResignReasonDirectoryActiveResignationOtherReason"] = "14";
  ResignReasonDirectory2["ResignReasonDirectoryAccident"] = "15";
  ResignReasonDirectory2["ResignReasonDirectoryDeath"] = "16";
  ResignReasonDirectory2["ResignReasonDirectoryFired"] = "17";
  ResignReasonDirectory2["ResignReasonDirectoryFailedToPassProbationPeriod"] = "18";
  ResignReasonDirectory2["ResignReasonDirectoryNotUpToTheJob"] = "19";
  ResignReasonDirectory2["ResignReasonDirectoryLowWorkOutput"] = "20";
  ResignReasonDirectory2["ResignReasonDirectoryPassiveOrganizeBusinessAdjustment"] = "21";
  ResignReasonDirectory2["ResignReasonDirectoryBreachOfCompanyOrdinance"] = "22";
  ResignReasonDirectory2["ResignReasonDirectoryBreakTheLaw"] = "23";
  ResignReasonDirectory2["ResignReasonDirectoryPassiveResignationOtherReason"] = "24";
  ResignReasonDirectory2["ResignReasonDirectoryOtherReason"] = "25";
  return ResignReasonDirectory2;
})(ResignReasonDirectory || {});
var ResignTypeDirectory = /* @__PURE__ */ ((ResignTypeDirectory2) => {
  ResignTypeDirectory2["ResignTypeDirectoryEmpty"] = "0";
  ResignTypeDirectory2["ResignTypeDirectoryAcitve"] = "1";
  ResignTypeDirectory2["ResignTypeDirectoryPassive"] = "2";
  ResignTypeDirectory2["ResignTypeDirectoryyOther"] = "3";
  return ResignTypeDirectory2;
})(ResignTypeDirectory || {});
var RunStatus = /* @__PURE__ */ ((RunStatus2) => {
  RunStatus2["RunStatusQueued"] = "QUEUED";
  RunStatus2["RunStatusInProgress"] = "IN_PROGRESS";
  RunStatus2["RunStatusRequiresMessage"] = "REQUIRES_MESSAGE";
  RunStatus2["RunStatusCancelled"] = "CANCELLED";
  RunStatus2["RunStatusCompleted"] = "COMPLETED";
  RunStatus2["RunStatusFailed"] = "FAILED";
  RunStatus2["RunStatusExpired"] = "EXPIRED";
  return RunStatus2;
})(RunStatus || {});
var SnapTo = /* @__PURE__ */ ((SnapTo2) => {
  SnapTo2["Auto"] = "auto";
  SnapTo2["Top"] = "top";
  SnapTo2["Right"] = "right";
  SnapTo2["Bottom"] = "bottom";
  SnapTo2["Left"] = "left";
  return SnapTo2;
})(SnapTo || {});
var StyleType = /* @__PURE__ */ ((StyleType2) => {
  StyleType2[StyleType2["Board"] = 1] = "Board";
  StyleType2[StyleType2["Classic"] = 2] = "Classic";
  return StyleType2;
})(StyleType || {});
var SyntaxType = /* @__PURE__ */ ((SyntaxType2) => {
  SyntaxType2[SyntaxType2["UNKOWN"] = 0] = "UNKOWN";
  SyntaxType2[SyntaxType2["PLANT_UML"] = 1] = "PLANT_UML";
  SyntaxType2[SyntaxType2["MERMAID"] = 2] = "MERMAID";
  return SyntaxType2;
})(SyntaxType || {});

// src/index.ts
var src_default = LarkBot;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Feishu,
  FeishuBot,
  Lark,
  LarkBot
});
