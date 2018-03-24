/*
 * @Author: cuiweiqiang
 * @Date:   2018-02-06 11:50:42
 * @Last Modified by:   cuiweiqiang
 * @Last Modified time: 2018-02-09 14:22:42
 */
import { Service, Context } from 'egg';

export default class Game extends Service {
    constructor(ctx: Context) {
        super(ctx);
    }

    async create(data) {
        try {
            const game = new this.ctx.model.AdminGame(data);
            const savedGame = await game.save();
            return [savedGame, null];
        } catch (err) {
            this.ctx.logger.error(err);
            return [null, err]
        }
    }

    async show(id) {
        const game = await this.ctx.model.AdminGame.findById(id);
        return [game, null];
    }

    async update(cond, updates) {
        try {
            const game = await this.ctx.model.AdminGame.update(cond, updates, {});
            return [game, null];
        } catch (err) {
            this.ctx.logger.error(err);
            return [null, err]
        }
    }
}