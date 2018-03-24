/*
 * @Author: cuiweiqiang
 * @Date:   2018-02-02 20:01:36
 * @Last Modified by:   cuiweiqiang
 * @Last Modified time: 2018-02-24 15:19:05
 */
import Activities from './activities';
import Broadcasts from './broadcasts';
import Channels from './channels';
import Decorations from './decorations';
import Files from './files';
import Games from './games';
import Groups from './groups';
import Messages from './messages';
import Parameters from './parameters';
import Permissions from './permissions';
import Players from './players';
import SensitiveWords from './sensitiveWords';
import Session from './session';
import Sms from './sms';
import Users from './users';

declare module 'egg' {
    export interface IController {
        activities: Activities,
        broadcasts: Broadcasts,
        channels: Channels,
        decorations: Decorations,
        files: Files,
        games: Games,
        groups: Groups,
        messages: Messages,
        parameters: Parameters,
        permissions: Permissions,
        players: Players,
        sensitiveWords: SensitiveWords,
        session: Session,
        sms: Sms,
        users: Users,
    }
}