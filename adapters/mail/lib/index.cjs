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
  IMAP: () => IMAP,
  MailBot: () => MailBot,
  MailMessageEncoder: () => MailMessageEncoder,
  SMTP: () => SMTP,
  adaptMessage: () => adaptMessage,
  default: () => src_default,
  dispatchSession: () => dispatchSession,
  randomId: () => randomId
});
module.exports = __toCommonJS(src_exports);

// src/bot.ts
var import_core4 = require("@satorijs/core");

// src/mail.ts
var import_node_imap = __toESM(require("node-imap"), 1);
var import_nodemailer = require("nodemailer");
var import_mailparser = require("mailparser");
var import_core2 = require("@satorijs/core");

// src/utils.ts
var import_core = require("@satorijs/core");
var import_html5parser = require("html5parser");
async function adaptMessage(bot, mail, message, payload) {
  message.id = message.messageId = mail.messageId;
  let content = "";
  if (!mail.html) {
    content = import_core.segment.escape(mail.text);
  } else {
    let visit = function(nodes) {
      for (const node of nodes) {
        if (node.type === import_html5parser.SyntaxKind.Text) {
          content += import_core.segment.escape(decodeHE(node.value).trim() || " ");
        } else {
          switch (node.name) {
            case "a": {
              const href = node.attributeMap.href?.value.value || "#";
              content += `<a href="${href}">`;
              visit(node.body);
              content += "</a>";
              break;
            }
            case "strong":
            case "b": {
              content += "<b>";
              visit(node.body);
              content += "</b>";
              break;
            }
            case "br": {
              content += "\n";
              break;
            }
            case "code": {
              content += "<code>";
              visit(node.body);
              content += "</code>";
              break;
            }
            case "s":
            case "del": {
              content += "<s>";
              visit(node.body);
              content += "</s>";
              break;
            }
            case "i":
            case "em": {
              content += "<i>";
              visit(node.body);
              content += "</i>";
              break;
            }
            case "p": {
              content += "<p>";
              visit(node.body);
              content += "</p>";
              break;
            }
            case "sub": {
              content += "<sub>";
              visit(node.body);
              content += "</sub>";
              break;
            }
            case "u": {
              content += "<u>";
              visit(node.body);
              content += "</u>";
              break;
            }
            case "img": {
              const src = node.attributeMap.src?.value.value;
              const alt = node.attributeMap.src?.value.value;
              if (!src) {
                if (alt) content += alt;
                break;
              }
              if (src.match(/^(data|https?):/)) {
                content += `<img src="${src}"/>`;
                break;
              }
              break;
            }
            // ignore
            case "head":
            case "script":
            case "style":
            case "meta":
              break;
            default:
              if (node.body) visit(node.body);
          }
        }
      }
    };
    __name(visit, "visit");
    visit((0, import_html5parser.parse)(mail.html, { setAttributeMap: true }));
  }
  content = content.trim();
  message.content = content;
  message.elements ||= import_core.segment.parse(content);
  if (!payload) return message;
  payload.timestamp = +mail.date;
  payload.user = {
    id: mail.from.value[0].address,
    name: mail.from.value[0].name
  };
  payload.guild = {
    id: payload.user.id
  };
  payload.channel = {
    id: `private:${payload.user.id}`,
    type: import_core.Universal.Channel.Type.DIRECT
  };
  return message;
}
__name(adaptMessage, "adaptMessage");
async function dispatchSession(bot, mail) {
  const session = bot.session();
  session.type = "message";
  if (!await adaptMessage(bot, mail, session.event.message = {}, session.event)) {
    return null;
  }
  (0, import_core.defineProperty)(session, "mail", mail);
  bot.dispatch(session);
}
__name(dispatchSession, "dispatchSession");
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

// src/mail.ts
var IMAP = class extends import_core2.Adapter {
  constructor(ctx, bot) {
    super(ctx);
    this.bot = bot;
    this.imap = new import_node_imap.default({
      user: bot.config.username,
      password: bot.config.password,
      host: bot.config.imap.host,
      port: bot.config.imap.port,
      tls: bot.config.imap.tls
    });
    this.imap.on("error", (error) => {
      bot.logger.error(error);
    });
  }
  static {
    __name(this, "IMAP");
  }
  static reusable = true;
  imap;
  async connect(bot) {
    this.imap.on("ready", () => {
      this.imap.openBox("INBOX", false, this.inbox.bind(this));
    });
    this.imap.on("close", () => {
      if (!bot.isActive) return;
      bot.logger.info("IMAP disconnected, will reconnect in 3s...");
      bot.status = import_core2.Universal.Status.RECONNECT;
      setTimeout(() => {
        if (!bot.isActive) return;
        this.imap.connect();
      }, 3e3);
    });
    this.imap.connect();
  }
  stop() {
    this.imap.end();
  }
  inbox(error) {
    if (error) {
      this.bot.logger.error(error);
      return;
    }
    this.bot.online();
    this.scan();
    this.imap.on("mail", this.scan.bind(this));
  }
  scan() {
    this.imap.search(["UNSEEN"], (error, uids) => {
      if (error) {
        this.bot.logger.error(error);
        return;
      }
      if (uids.length === 0) return;
      this.imap.setFlags(uids, ["\\SEEN"], (error2) => {
        if (error2) this.bot.logger.error(error2);
      });
      const mails = this.imap.fetch(uids, { bodies: "" });
      mails.on("message", (message) => {
        message.once("body", (stream) => {
          (0, import_mailparser.simpleParser)(stream, (error2, mail) => {
            if (error2) {
              this.bot.logger.error(error2);
              return;
            }
            dispatchSession(this.bot, mail);
          });
        });
      });
    });
  }
};
var SMTP = class {
  static {
    __name(this, "SMTP");
  }
  transporter;
  from;
  constructor(config) {
    this.transporter = (0, import_nodemailer.createTransport)({
      host: config.smtp.host,
      port: config.smtp.port,
      secure: config.smtp.tls,
      auth: {
        user: config.username,
        pass: config.password
      }
    });
    const address = config.selfId || config.username;
    this.from = config.name ? `${config.name} <${address}>` : address;
  }
  async send(options) {
    const info = await this.transporter.sendMail({
      ...options,
      from: this.from
    });
    return info.messageId;
  }
};

// src/message.ts
var import_core3 = require("@satorijs/core");
var letters = "abcdefghijklmnopqrstuvwxyz";
function randomId() {
  return Array(8).fill(0).map(() => letters[Math.floor(Math.random() * letters.length)]).join("");
}
__name(randomId, "randomId");
var MailMessageEncoder = class extends import_core3.MessageEncoder {
  static {
    __name(this, "MailMessageEncoder");
  }
  buffer = "";
  reply;
  attachments = [];
  figure = false;
  async flush() {
    if (!this.buffer && this.attachments.length === 0) return;
    const messageId = await this.bot.internal.send({
      to: this.session.channelId.substring(8),
      html: `<pre>${this.buffer}</pre>`,
      attachments: this.attachments,
      inReplyTo: this.reply,
      subject: this.bot.config.subject
    });
    const session = this.bot.session();
    session.messageId = messageId;
    session.timestamp = +/* @__PURE__ */ new Date();
    session.userId = this.bot.selfId;
    this.results.push(session.event.message);
    session.app.emit(session, "send", session);
    this.buffer = "";
    this.reply = void 0;
    this.attachments = [];
  }
  async visit(element) {
    const { type, attrs, children } = element;
    if (type === "text") {
      this.buffer += attrs.content;
    } else if (type === "br") {
      this.buffer += "<br>";
    } else if (["b", "strong", "i", "em", "u", "ins", "s", "del", "p", "code", "li", "ul", "ol", "blockquote"].includes(type)) {
      this.buffer += `<${type}>`;
      await this.render(children);
      this.buffer += `</${type}>`;
    } else if (type === "a") {
      this.buffer += `<a href=${attrs.href}>`;
      await this.render(children);
      this.buffer += `</a>`;
    } else if (type === "at") {
      if (attrs.id) {
        this.buffer += `<a href="mailto:${attrs.id}">@${attrs.id}</a>`;
      }
    } else if (type === "sharp" && attrs.id) {
      this.buffer += ` #${attrs.id} `;
    } else if (["image", "audio", "video", "file"].includes(type) && (attrs.src || attrs.url)) {
      let url = attrs.src || attrs.url;
      if (!url.match(/^https?:/)) {
        const cid = randomId();
        const { filename, type: type2, data } = await this.bot.ctx.http.file(url);
        this.attachments.push({
          cid,
          filename,
          content: Buffer.from(data),
          contentType: type2
        });
        url = `cid:${cid}`;
      }
      if (type === "image") {
        this.buffer += `<img src="${url}" />`;
      } else if (type === "audio") {
        this.buffer += `<audio src="${url}" controls />`;
      } else if (type === "video") {
        this.buffer += `<video src="${url}" controls />`;
      }
    } else if (type === "quote") {
      this.reply = attrs.id;
    } else if (type === "message") {
      if (this.figure) {
        await this.render(children);
        this.buffer += "<br/>";
      } else {
        await this.flush();
        await this.render(children, true);
      }
    } else if (type === "figure") {
      this.figure = true;
      await this.render(children);
      this.figure = false;
    } else {
      await this.render(children);
    }
  }
};

// src/bot.ts
var MailBot = class extends import_core4.Bot {
  static {
    __name(this, "MailBot");
  }
  static MessageEncoder = MailMessageEncoder;
  static inject = ["http"];
  internal;
  constructor(ctx, config) {
    super(ctx, config, "mail");
    this.selfId = config.selfId || config.username;
    this.user.name = this.config.username;
    this.internal = new SMTP(this.config);
    this.ctx.plugin(IMAP, this);
  }
};
((MailBot2) => {
  MailBot2.Config = import_core4.Schema.object({
    username: import_core4.Schema.string().description("用户名。").required(),
    password: import_core4.Schema.string().description("密码或授权码。").required(),
    selfId: import_core4.Schema.string().description("邮件地址 (默认与用户名相同)。"),
    name: import_core4.Schema.string().description("发送邮件时显示的名称。"),
    subject: import_core4.Schema.string().description("机器人发送的邮件主题。").default("Koishi"),
    imap: import_core4.Schema.intersect([
      import_core4.Schema.object({
        host: import_core4.Schema.string().description("IMAP 服务器地址。").required(),
        tls: import_core4.Schema.boolean().description("是否开启 TLS 加密。").default(true)
      }).description("IMAP 设置"),
      import_core4.Schema.union([
        import_core4.Schema.object({
          tls: import_core4.Schema.const(true),
          port: import_core4.Schema.number().description("IMAP 服务器端口。").default(993)
        }),
        import_core4.Schema.object({
          tls: import_core4.Schema.const(false),
          port: import_core4.Schema.number().description("IMAP 服务器端口。").default(143)
        })
      ])
    ]),
    smtp: import_core4.Schema.intersect([
      import_core4.Schema.object({
        host: import_core4.Schema.string().description("SMTP 服务器地址。").required(),
        tls: import_core4.Schema.boolean().description("是否开启 TLS 加密。").default(true)
      }).description("SMTP 设置"),
      import_core4.Schema.union([
        import_core4.Schema.object({
          tls: import_core4.Schema.const(true),
          port: import_core4.Schema.number().description("SMTP 服务器端口。").default(465)
        }),
        import_core4.Schema.object({
          tls: import_core4.Schema.const(false),
          port: import_core4.Schema.number().description("SMTP 服务器端口。").default(25)
        })
      ])
    ])
  });
})(MailBot || (MailBot = {}));

// src/index.ts
var src_default = MailBot;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  IMAP,
  MailBot,
  MailMessageEncoder,
  SMTP,
  adaptMessage,
  dispatchSession,
  randomId
});
