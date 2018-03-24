/*
 * @Author: cuiweiqiang
 * @Date:   2018-02-06 18:21:58
 * @Last Modified by:   cuiweiqiang
 * @Last Modified time: 2018-02-09 14:20:52
 */
import { Service, Context } from 'egg';

export default class Broadcast extends Service {
    constructor(ctx: Context) {
        super(ctx);
    }

    async create(data) {
        try {
            const broadcast = new this.ctx.model.AdminBroadcast(data);
            const savedBroadcast = await broadcast.save();
            return [savedBroadcast, null];
        } catch (err) {
            this.ctx.logger.error(err);
            return [null, err]
        }
    }

    async show(id) {
        const broadcast = await this.ctx.model.AdminBroadcast.findById(id);
        return [broadcast, null];
    }

    async update(cond, updates) {
        try {
            const broadcast = await this.ctx.model.AdminBroadcast.update(cond, updates, {});
            return [broadcast, null];
        } catch (err) {
            this.ctx.logger.error(err);
            return [null, err]
        }
    }
}