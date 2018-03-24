/*
 * @Author: cuiweiqiang
 * @Date:   2018-02-06 18:41:41
 * @Last Modified by:   cuiweiqiang
 * @Last Modified time: 2018-02-10 17:32:33
 */
import { Service, Context } from 'egg';

export default class Message extends Service {
    constructor(ctx: Context) {
        super(ctx);
    }

    async create(data) {
        try {
            if (!data.timing) {
                let mail = new this.ctx.model.Mail(data);
                let ret = await mail.save();
                if (ret) {
                    data.status = 1
                } else {
                    data.status = 2
                }
            }

            const message = new this.ctx.model.AdminMessage(data);
            const savedMessage = await message.save();
            
            return [savedMessage, null];
        } catch (err) {
            this.ctx.logger.error(err);
            return [null, err]
        }
    }

    async show(id) {
        const message = await this.ctx.model.AdminMessage.findById(id);
        return [message, null];
    }

    async update(cond, updates) {
        try {
            const message = await this.ctx.model.AdminMessage.update(cond, updates, {});
            return [message, null];
        } catch (err) {
            this.ctx.logger.error(err);
            return [null, err]
        }
    }
}