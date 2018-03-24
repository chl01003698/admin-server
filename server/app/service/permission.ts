/*
 * @Author: cuiweiqiang
 * @Date:   2018-02-06 18:41:41
 * @Last Modified by:   cuiweiqiang
 * @Last Modified time: 2018-02-09 14:20:45
 */
import { Service, Context } from 'egg';

export default class Permission extends Service {
    constructor(ctx: Context) {
        super(ctx);
    }

    async create(data) {
        try {
            const permission = new this.ctx.model.AdminPermission(data);
            const savedPermission = await permission.save();
            return [savedPermission, null];
        } catch (err) {
            this.ctx.logger.error(err);
            return [null, err]
        }
    }

    async show(id) {
        const permission = await this.ctx.model.AdminPermission.findById(id);
        return [permission, null];
    }

    async update(cond, updates) {
        try {
            const permission = await this.ctx.model.AdminPermission.update(cond, updates, {});
            return [permission, null];
        } catch (err) {
            this.ctx.logger.error(err);
            return [null, err]
        }
    }
}