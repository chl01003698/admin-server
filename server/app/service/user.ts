/*
 * @Author: cuiweiqiang
 * @Date:   2018-02-06 18:41:41
 * @Last Modified by:   cuiweiqiang
 * @Last Modified time: 2018-03-03 17:15:33
 */
import { Service, Context } from 'egg';

export default class User extends Service {
    constructor(ctx: Context) {
        super(ctx);
    }

    async create(data) {
        if (data.group) {
            let group = await this.ctx.model.AdminGroup.findById(data.group);
            if (!group) {
                return [, 'group is not exist'];
            }
        }
        try {
            const user = new this.ctx.model.AdminUser(data);
            const savedUser = await user.save();
            return [savedUser, null];
        } catch (err) {
            this.ctx.logger.error(err);
            return [null, err]
        }
    }

    async show(id) {
        const user = await this.ctx.model.AdminUser.findById(id);
        return [user, null];
    }

    async update(cond, updates) {
        try {
            const user = await this.ctx.model.AdminUser.update(cond, updates, {});
            return [user, null];
        } catch (err) {
            this.ctx.logger.error(err);
            return [null, err]
        }
    }
}