/*
 * @Author: cuiweiqiang
 * @Date:   2018-02-06 18:00:42
 * @Last Modified by:   cuiweiqiang
 * @Last Modified time: 2018-02-09 14:20:50
 */
import { Service, Context } from 'egg';

export default class Decoration extends Service {
    constructor(ctx: Context) {
        super(ctx);
    }

    async create(data) {
        try {
            const decoration = new this.ctx.model.AdminDecoration(data);
            const savedDecoration = await decoration.save();
            return [savedDecoration, null];
        } catch (err) {
            this.ctx.logger.error(err);
            return [null, err]
        }
    }

    async show(id) {
        const decoration = await this.ctx.model.AdminDecoration.findById(id);
        return [decoration, null];
    }

    async update(cond, updates) {
        try {
            const decoration = await this.ctx.model.AdminDecoration.update(cond, updates, {});
            return [decoration, null];
        } catch (err) {
            this.ctx.logger.error(err);
            return [null, err]
        }
    }
}