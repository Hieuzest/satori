"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  SatoriAdapter: () => SatoriAdapter,
  SatoriBot: () => SatoriBot,
  default: () => src_default
});
module.exports = __toCommonJS(src_exports);

// src/ws.ts
var import_core2 = require("@satorijs/core");

// src/bot.ts
var import_core = require("@satorijs/core");
function createInternal(bot, prefix = "") {
  return new Proxy(() => {
  }, {
    apply(target, thisArg, args) {
      const key = prefix.slice(1);
      bot.logger.debug("[request.internal]", key, args);
      const impl = /* @__PURE__ */ __name(async (pagination2 = false) => {
        const request = await import_core.JsonForm.encode(args);
        if (pagination2) {
          request.headers.set("Satori-Pagination", "true");
        }
        const response = await bot.request("/v1/" + bot.getInternalUrl(`/_api/${key}`, {}, true), {
          method: "POST",
          headers: Object.fromEntries(request.headers.entries()),
          data: request.body,
          responseType: "arraybuffer"
        });
        return await import_core.JsonForm.decode({ body: response.data, headers: response.headers });
      }, "impl");
      let promise;
      const result = {};
      for (const key2 of ["then", "catch", "finally"]) {
        result[key2] = (...args2) => {
          return (promise ??= impl())[key2](...args2);
        };
      }
      let pagination;
      result.next = async function() {
        pagination ??= await impl(true);
        if (!pagination.data) throw new Error("Invalid pagination response");
        if (pagination.data.length) return { done: false, value: pagination.data.shift() };
        if (!pagination.next) return { done: true, value: void 0 };
        args = pagination.next;
        pagination = await impl(true);
        return this.next();
      };
      result[Symbol.asyncIterator] = function() {
        return this;
      };
      result[Symbol.for("satori.pagination")] = () => {
        return impl(true);
      };
      return result;
    },
    get(target, key, receiver) {
      if (typeof key === "symbol" || key in target) {
        return Reflect.get(target, key, receiver);
      }
      return createInternal(bot, prefix + "." + key);
    }
  });
}
__name(createInternal, "createInternal");
var SatoriBot = class extends import_core.Bot {
  static {
    __name(this, "SatoriBot");
  }
  internal = createInternal(this);
  constructor(ctx, config) {
    super(ctx, config, config.adapter);
    this.logger = ctx.logger("satori");
    Object.assign(this, (0, import_core.omit)(config, ["sn", "adapter"]));
    this.defineInternalRoute("/*path", async ({ method, params, query, headers, body }) => {
      const response = await this.request(`/v1/${this.getInternalUrl("/" + params.path, query, true)}`, {
        method,
        headers,
        data: method === "GET" || method === "HEAD" ? null : body,
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
  request(url, config) {
    return this.adapter.http(url, {
      ...config,
      headers: {
        ...config.headers,
        "Satori-Platform": this.platform,
        "Satori-User-ID": this.user?.id,
        "X-Platform": this.platform,
        "X-Self-ID": this.user?.id
      }
    });
  }
};
for (const [key, method] of Object.entries(import_core.Universal.Methods)) {
  SatoriBot.prototype[method.name] = async function(...args) {
    let payload;
    if (method.name === "createUpload") {
      payload = new FormData();
      for (const { data, type, filename } of args) {
        payload.append("file", new Blob([data], { type }), filename);
      }
    } else {
      payload = {};
      for (const [index, field] of method.fields.entries()) {
        if ((method.name === "createMessage" || method.name === "editMessage") && field.name === "content") {
          const session = this.session({
            type: "send",
            channel: { id: args[0], type: 0 },
            ...args[3]?.session?.event
          });
          session.elements = await session.transform(import_core.h.normalize(args[index]));
          if (await session.app.serial(session, "before-send", session, args[3] ?? {})) return;
          payload[field.name] = session.elements.join("");
        } else if (field.name === "referrer") {
          payload[field.name] = args[index];
        } else {
          payload[field.name] = import_core.Universal.transformKey(args[index], import_core.snakeCase);
        }
      }
    }
    this.logger.debug("[request]", key, payload);
    const result = await this.request("/v1/" + key, {
      method: "POST",
      data: payload
    });
    return import_core.Universal.transformKey(result, import_core.camelCase);
  };
}

// src/ws.ts
var SatoriAdapter = class extends import_core2.Adapter.WsClientBase {
  constructor(ctx, config) {
    super(ctx, config);
    this.ctx = ctx;
    this.config = config;
    this.logger = ctx.logger("satori");
    this.http = ctx.http.extend({
      endpoint: config.endpoint,
      headers: {
        "Authorization": `Bearer ${config.token}`
      }
    });
    ctx.on("ready", () => this.start());
    ctx.on("dispose", () => this.stop());
  }
  static {
    __name(this, "SatoriAdapter");
  }
  static schema = true;
  static reusable = true;
  static inject = ["http"];
  http;
  logger;
  _status = import_core2.Universal.Status.OFFLINE;
  sequence;
  timeout;
  _metaDispose;
  getActive() {
    return this._status !== import_core2.Universal.Status.OFFLINE && this._status !== import_core2.Universal.Status.DISCONNECT;
  }
  setStatus(status, error) {
    this._status = status;
    if (status === import_core2.Universal.Status.ONLINE) return;
    for (const bot of this.bots) {
      bot.status = status;
      bot.error = error;
    }
  }
  async prepare() {
    return this.http.ws("/v1/events");
  }
  getBot(login, action) {
    let bot = this.bots.find((bot2) => bot2.config.sn === login.sn);
    if (bot) {
      if (action === "created") {
        this.logger.warn("bot already exists when login created, sn = %s, adapter = %s", login.sn, login.adapter);
      } else if (action === "updated") {
        bot.update(login);
      } else if (action === "removed") {
        bot.dispose();
      }
      return bot;
    } else if (!action) {
      this.logger.warn("bot not found when non-login event received, sn = %s, adapter = %s", action, login.sn, login.adapter);
      return;
    }
    bot = new SatoriBot(this.ctx, login);
    bot.adapter = this;
    this.bots.push(bot);
  }
  accept(socket) {
    socket.send(JSON.stringify({
      op: import_core2.Universal.Opcode.IDENTIFY,
      body: {
        token: this.config.token,
        sn: this.sequence
      }
    }));
    clearInterval(this.timeout);
    this.timeout = setInterval(() => {
      if (socket !== this.socket) return;
      socket.send(JSON.stringify({
        op: import_core2.Universal.Opcode.PING,
        body: {}
      }));
    }, import_core2.Time.second * 10);
    socket.addEventListener("message", async ({ data }) => {
      let parsed;
      data = data.toString();
      try {
        parsed = import_core2.Universal.transformKey(JSON.parse(data), import_core2.camelize);
      } catch (error) {
        return this.logger.warn("cannot parse message", data);
      }
      if (parsed.op === import_core2.Universal.Opcode.READY) {
        this.logger.debug("ready");
        for (const login of parsed.body.logins) {
          this.getBot(login);
        }
        this._metaDispose?.();
        this._metaDispose = this.ctx.satori.proxyUrls.add(...parsed.body.proxyUrls ?? []);
      }
      if (parsed.op === import_core2.Universal.Opcode.META) {
        this._metaDispose?.();
        this._metaDispose = this.ctx.satori.proxyUrls.add(...parsed.body.proxyUrls ?? []);
      }
      if (parsed.op === import_core2.Universal.Opcode.EVENT) {
        const { sn, type, login } = parsed.body;
        this.sequence = sn;
        const bot = this.getBot(login, type.startsWith("login-") ? type.slice(6) : void 0);
        if (!bot) return;
        const session = bot.session(parsed.body);
        if (typeof parsed.body.message?.content === "string") {
          session.content = parsed.body.message.content;
        }
        if (parsed.body._type && parsed.body.type !== "internal") {
          session.setInternal(parsed.body._type, parsed.body._data);
        }
        bot.dispatch(session);
        if (type === "message-created" && session.userId === login.user?.id) {
          session.app.emit(session, "send", session);
        }
      }
    });
    socket.addEventListener("close", () => {
      clearInterval(this.timeout);
      this._metaDispose?.();
    });
  }
  async start() {
    this.setStatus(import_core2.Universal.Status.CONNECT);
    await super.start();
  }
  async stop() {
    this.setStatus(import_core2.Universal.Status.DISCONNECT);
    await super.stop();
  }
};
((SatoriAdapter2) => {
  SatoriAdapter2.Config = import_core2.Schema.intersect([
    import_core2.Schema.object({
      endpoint: import_core2.Schema.string().description("API 终结点。").required(),
      token: import_core2.Schema.string().description("API 访问令牌。")
    }),
    import_core2.Adapter.WsClientConfig
  ]);
})(SatoriAdapter || (SatoriAdapter = {}));

// src/index.ts
var src_default = SatoriAdapter;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  SatoriAdapter,
  SatoriBot
});
