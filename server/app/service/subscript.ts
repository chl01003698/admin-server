/*
 * @Author: cuiweiqiang
 * @Date:   2018-02-06 18:41:41
 * @Last Modified by:   cuiweiqiang
 * @Last Modified time: 2018-02-09 14:20:43
 */
import { Service, Context } from 'egg';

export default class Subscript extends Service {
    constructor(ctx: Context) {
        super(ctx);
    }

    async create(data) {
        try {
            const subscript = new this.ctx.model.AdminSubscript(data);
            const savedSubscript = await subscript.save();
            return [savedSubscript, null];
        } catch (err) {
            this.ctx.logger.error(err);
            return [null, err]
        }
    }

    async show(id) {
        const subscript = await this.ctx.model.AdminSubscript.findById(id);
        return [subscript, null];
    }

    async update(cond, updates) {
        try {
            const subscript = await this.ctx.model.AdminSubscript.update(cond, updates, {});
            return [subscript, null];
        } catch (err) {
            this.ctx.logger.error(err);
            return [null, err]
        }
    }
}