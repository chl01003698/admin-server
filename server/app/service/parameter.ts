/*
 * @Author: cuiweiqiang
 * @Date:   2018-02-06 18:41:41
 * @Last Modified by:   cuiweiqiang
 * @Last Modified time: 2018-02-09 14:20:45
 */
import { Service, Context } from 'egg';

export default class Parameter extends Service {
    constructor(ctx: Context) {
        super(ctx);
    }

    async create(data) {
        try {
            const parameter = new this.ctx.model.AdminParameter(data);
            const savedParameter = await parameter.save();
            return [savedParameter, null];
        } catch (err) {
            this.ctx.logger.error(err);
            return [null, err]
        }
    }

    async show(id) {
        const parameter = await this.ctx.model.AdminParameter.findById(id);
        return [parameter, null];
    }

    async update(cond, updates) {
        try {
            const parameter = await this.ctx.model.AdminParameter.update(cond, updates, {});
            return [parameter, null];
        } catch (err) {
            this.ctx.logger.error(err);
            return [null, err]
        }
    }
}