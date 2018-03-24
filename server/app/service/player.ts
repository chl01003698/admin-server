/*
 * @Author: cuiweiqiang
 * @Date:   2018-02-24 16:38:08
 * @Last Modified by:   cuiweiqiang
 * @Last Modified time: 2018-02-24 16:39:33
 */
import { Service, Context } from 'egg';

export default class Player extends Service {
    constructor(ctx: Context) {
        super(ctx);
    }

    async show(id) {
        const player = await this.ctx.model.User.findById(id);
        return [player, null];
    }
}