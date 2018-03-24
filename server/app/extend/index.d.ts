/*
 * @Author: cuiweiqiang
 * @Date:   2018-02-06 15:12:08
 * @Last Modified by:   cuiweiqiang
 * @Last Modified time: 2018-03-01 15:53:54
 */

import { successReply, removeEmpty, jwtHelper } from './helper/tools';

declare module 'egg' {
    export interface IHelper {
        successReply,
        removeEmpty,
        jwtHelper
    }
}