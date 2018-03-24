/*
 * @Author: cuiweiqiang
 * @Date:   2018-03-01 20:37:45
 * @Last Modified by:   cuiweiqiang
 * @Last Modified time: 2018-03-01 20:50:19
 */
import { Service, Context } from 'egg';

export default class UserGroup extends Service {
    constructor(ctx: Context) {
        super(ctx);
    }

    async create(data) {
        try {
            const userGroup = new this.ctx.model.AdminUserGroup(data);
            const savedUserGroup = await userGroup.save();
            return [savedUserGroup, null];
        } catch (err) {
            this.ctx.logger.error(err);
            return [null, err]
        }
    }

    async show(id) {
        const userGroup = await this.ctx.model.AdminUserGroup.findById(id);
        return [userGroup, null];
    }

    async update(cond, updates) {
        try {
            const userGroup = await this.ctx.model.AdminUserGroup.update(cond, updates, {});
            return [userGroup, null];
        } catch (err) {
            this.ctx.logger.error(err);
            return [null, err]
        }
    }
}