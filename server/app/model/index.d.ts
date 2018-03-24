/*
 * @Author: cuiweiqiang
 * @Date:   2018-02-02 20:04:02
 * @Last Modified by:   cuiweiqiang
 * @Last Modified time: 2018-02-26 10:07:14
 */
import { Mongoose, Model, Document } from 'mongoose';

declare module 'egg' {
    export interface IModel {
        AdminActivity: Model,
        AdminBroadcast: Model,
        AdminChannel: Model,
        AdminDecoration: Model,
        AdminGame: Model,
        AdminGroup: Model,
        AdminGroupPermission: Model,
        AdminMessage: Model,
        AdminParameter: Model,
        AdminPermission: Model,
        AdminSms: Model,
        AdminSubscript: Model,
        AdminUser: Model<Relationship.User & Document> & Relationship.ModelStatic,
        AdminUserGroup: Model,
        Mail: Model,
        User: Model,
        Agent: Model,
        Curator: Model
    }
}
