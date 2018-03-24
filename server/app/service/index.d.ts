/*
 * @Author: cuiweiqiang
 * @Date:   2018-02-06 11:54:40
 * @Last Modified by:   cuiweiqiang
 * @Last Modified time: 2018-03-02 10:53:55
 */

import Activity from './activity';
import Broadcast from './broadcast';
import Channel from './channel';
import Decoration from './decoration';
import Game from './game';
import Group from './group';
import GroupPermission from './groupPermission';
import Message from './message';
import Parameter from './parameter';
import Permission from './permission';
import Player from './player';
import SensitiveWord from './sensitiveWord';
import Sms from './sms';
import Subscript from './subscript';
import User from './user';
import UserGroup from './userGroup';

declare module 'egg' {
    export interface IService {
        activity: Activity;
        broadcast: Broadcast;
        channel: Channel;
        decoration: Decoration;
        game: Game;
        group: Group;
        groupPermission: GroupPermission,
        message: Message,
        parameter: Parameter,
        permission: Permission,
        player: Player,
        sensitiveWord: SensitiveWord,
        sms: Sms,
        subscript: Subscript,
        user: User,
        userGroup: UserGroup
    }
}