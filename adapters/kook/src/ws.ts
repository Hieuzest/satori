import { Adapter, Context, Schema, Time, Universal } from '@satorijs/core'
import { KookBot } from './bot'
import { adaptSession } from './utils'
import { Payload, Signal } from './types'

const heartbeatIntervals = [6, 2, 4]

export class WsClient<C extends Context = Context> extends Adapter.WsClient<C, KookBot<C, KookBot.BaseConfig & WsClient.Options>> {
  _sn = 0
  _session_id?: string
  _ping: NodeJS.Timeout
  _heartbeat: NodeJS.Timeout
  _hello: NodeJS.Timeout

  async prepare() {
    let { url } = await this.bot.request('GET', '/gateway/index?compress=0')
    if (this._session_id) url += `&resume=1&sn=${this._sn}&session_id=${this._session_id}`
    const headers = { Authorization: `Bot ${this.bot.config.token}` }
    return this.bot.ctx.http.ws(url, { headers })
  }

  heartbeat() {
    if (!this.socket || this.bot.status !== Universal.Status.ONLINE) {
      clearInterval(this._heartbeat)
      return
    }
    let trials = 0
    const send = () => {
      if (!this.socket) return
      if (trials >= 2) {
        return this.socket.close(1000)
      }
      this.socket.send(JSON.stringify({ s: Signal.ping, sn: this._sn }))
      this._ping = setTimeout(send, heartbeatIntervals[trials++] * Time.second)
    }
    send()
  }

  async accept() {
    this._sn = 0
    this._hello = setTimeout(() => this.socket?.close(1000), 6 * Time.second)
    clearInterval(this._heartbeat)

    this.socket.addEventListener('message', async ({ data }) => {
      let parsed: Payload
      data = data.toString()
      try {
        parsed = JSON.parse(data)
      } catch (error) {
        return this.bot.logger.warn('cannot parse message', data)
      }

      this.bot.logger.debug('[receive] %o', parsed)
      if (parsed.s === Signal.event) {
        this._sn = Math.max(this._sn, parsed.sn)
        const session = await adaptSession(this.bot, parsed.d)
        if (session) this.bot.dispatch(session)
      } else if (parsed.s === Signal.hello) {
        if (parsed.d['code']) {
          return this.bot.logger.error('gateway error')
        }
        this._session_id = parsed.d['session_id']
        this._heartbeat = setInterval(() => this.heartbeat(), Time.minute * 0.5)
        clearTimeout(this._hello)
        await this.bot.getLogin()
        this.bot.online()
      } else if (parsed.s === Signal.pong) {
        clearTimeout(this._ping)
      } else if (parsed.s === Signal.reconnect) {
        this._session_id = undefined
        this.socket.close(1000)
      }
    })
  }
}

export namespace WsClient {
  export interface Options extends Adapter.WsClientConfig {
    protocol: 'ws'
    token: string
  }

  export const Options: Schema<Options> = Schema.intersect([
    Schema.object({
      protocol: Schema.const('ws').required(process.env.KOISHI_ENV !== 'browser'),
      token: Schema.string().description('机器人的用户令牌。').role('secret').required(),
    }),
    Adapter.WsClientConfig,
  ])
}
