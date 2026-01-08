import { Session, Universal } from '@satorijs/core';
import { MatrixBot } from './bot';
import * as Matrix from './types';
export declare const decodeUser: (data: Matrix.Profile, id: string) => Universal.User;
export declare function adaptMessage(bot: MatrixBot, data: Matrix.ClientEvent, message?: Universal.Message, payload?: Universal.MessageLike): Promise<Universal.Message>;
export declare function adaptSession(bot: MatrixBot, event: Matrix.ClientEvent): Promise<Session>;
export declare function dispatchSession(bot: MatrixBot, event: Matrix.ClientEvent): Promise<void>;
