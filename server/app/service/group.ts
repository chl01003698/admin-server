/*
 * @Author: cuiweiqiang
 * @Date:   2018-02-06 18:41:41
 * @Last Modified by:   cuiweiqiang
 * @Last Modified time: 2018-02-09 14:20:46
 */
import { Service, Context } from 'egg';

export default class Group extends Service {
    constructor(ctx: Context) {
        super(ctx);
    }

    async create(data) {
        try {
            const group = new this.ctx.model.AdminGroup(data);
            const savedGroup = await group.save();
            return [savedGroup, null];
        } catch (err) {
            this.ctx.logger.error(err);
            return [null, err]
        }
    }

    async show(id) {
        const group = await this.ctx.model.AdminGroup.findById(id);
        return [group, null];
    }

    async update(cond, updates) {
        try {
            const group = await this.ctx.model.AdminGroup.update(cond, updates, {});
            return [group, null];
        } catch (err) {
            this.ctx.logger.error(err);
            return [null, err]
        }
    }
}