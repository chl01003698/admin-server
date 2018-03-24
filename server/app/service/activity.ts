/*
 * @Author: cuiweiqiang
 * @Date:   2018-02-06 18:41:41
 * @Last Modified by:   cuiweiqiang
 * @Last Modified time: 2018-02-09 20:24:00
 */
import { Service, Context } from 'egg';

export default class Activity extends Service {
    constructor(ctx: Context) {
        super(ctx);
    }

    async create(data) {
        if (data.subscript == '') {
            delete data.subscript
        }

        try {
            const activity = new this.ctx.model.AdminActivity(data);
            const savedActivity = await activity.save();
            return [savedActivity, null];
        } catch (err) {
            this.ctx.logger.error(err);
            return [null, err]
        }
    }

    async show(id) {
        const activity = await this.ctx.model.AdminActivity.findById(id);
        return [activity, null];
    }

    async update(cond, updates) {
        try {
            const activity = await this.ctx.model.AdminActivity.update(cond, updates, {});
            return [activity, null];
        } catch (err) {
            this.ctx.logger.error(err);
            return [null, err]
        }
    }
}