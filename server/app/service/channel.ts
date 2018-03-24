/*
 * @Author: cuiweiqiang
 * @Date:   2018-02-06 15:58:28
 * @Last Modified by:   cuiweiqiang
 * @Last Modified time: 2018-02-09 14:20:51
 */
import { Service, Context } from 'egg';

export default class Channel extends Service {
    constructor(ctx: Context) {
        super(ctx);
    }

    async create(data) {
        try {
            const channel = new this.ctx.model.AdminChannel(data);
            const savedChannel = await channel.save();
            return [savedChannel, null];
        } catch (err) {
            this.ctx.logger.error(err);
            return [null, err]
        }
    }

    async show(id) {
        const channel = await this.ctx.model.AdminChannel.findById(id);
        return [channel, null];
    }

    async update(cond, updates) {
        try {
            const channel = await this.ctx.model.AdminChannel.update(cond, updates, {});
            return [channel, null];
        } catch (err) {
            this.ctx.logger.error(err);
            return [null, err]
        }
    }
}