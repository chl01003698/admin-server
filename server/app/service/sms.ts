/*
 * @Author: cuiweiqiang
 * @Date:   2018-02-06 18:41:41
 * @Last Modified by:   cuiweiqiang
 * @Last Modified time: 2018-02-09 14:20:44
 */
import * as sf from 'sf'
import { phone, SMS } from 'yunpian-sdk'
import * as _ from 'lodash'

import { Service, Context } from 'egg';

export default class Sms extends Service {
    constructor(ctx: Context) {
        super(ctx);
    }

    async send(mobile: string, authCode: string) {
        const config = this.app.config.sms;

        const sms = new SMS({
            apikey: config.key
        });

        let sendResult;
        if (phone(mobile)) {
            const minutes = config.minutes
            let content = config.template
            content = content.replace('#code#', authCode)
            content = sf(content, { code: authCode, minutes: minutes })
            sendResult = await sms.singleSend({
                mobile,
                text: content
            })
            console.log('sendResult', sendResult);


            if (sendResult.code == 0) {
                this.app.redis.setex(`sms:${mobile}`, minutes * 60, authCode);
                this.app.lru.set(`sms:${mobile}`, authCode, 5 * minutes * 60);
                await this.service.sms.create({ mobile, code: authCode });
            }
        }
        return sendResult;
    }

    async auth(mobile: string, code: string) {
        let result = false
        const realCode = await this.app.redis.get(`sms:${mobile}`);

        let err = null;
        const delayCode = await this.app.lru.get(`sms:${mobile}`);
        if (!delayCode) {
            err = '验证码不存在或已过期';
        } else if (_.isString(realCode) && realCode == code) {
            result = true
        } else {
            err = '验证码不匹配';
        }
        return [result, err]
    }

    async create(data) {
        try {
            const sms = new this.ctx.model.AdminSms(data);
            const savedSms = await sms.save();
            return [savedSms, null];
        } catch (err) {
            this.ctx.logger.error(err);
            return [null, err]
        }
    }

    async show(id) {
        const sms = await this.ctx.model.AdminSms.findById(id);
        return [sms, null];
    }

    async update(cond, updates) {
        try {
            const sms = await this.ctx.model.AdminSms.update(cond, updates, {});
            return [sms, null];
        } catch (err) {
            this.ctx.logger.error(err);
            return [null, err]
        }
    }
}