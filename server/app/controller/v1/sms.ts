/*
 * @Author: cuiweiqiang
 * @Date:   2018-02-05 17:23:43
 * @Last Modified by:   cuiweiqiang
 * @Last Modified time: 2018-02-09 14:20:53
 */

// 短信验证码管理
import * as _ from 'lodash';
import * as generate from 'nanoid/generate'

import { Controller } from 'egg';
import { smsField, smsValidationRule } from '../../common/validators/sms.model';
import { defaultQuery, pagedQuery, queryValidationRule } from '../../common/query.model';

export default class Sms extends Controller {
    /**
     * 添加短信验证码
     * POST /api/v1/sms/:mobile
     */
    public async create() {
        const invalid = this.app.validator.validate(smsValidationRule, { mobile: this.ctx.params.mobile });

        if (invalid) {
            return this.ctx.throw(400, `${invalid[0].field} ${invalid[0].message}`, { code: 106001 });
        }

        const code = await this.app.redis.get(`sms:${this.ctx.params.mobile}`);

        if (code) {
            return this.ctx.throw(400, `${this.app.config.sms.minutes * 60} 秒内只允许发送一次`, { code: 106004 });
        }

        const authCode = generate('1234567890', 6);
        const result = await this.ctx.service.sms.send(this.ctx.params.mobile, authCode);

        console.log('authCode=>', authCode);
        console.log('result=>', result);

        if (result.code == 0) {
            this.ctx.body = this.ctx.helper.successReply({});
        } else {
            this.ctx.throw(400, '短信发送失败', result.detail);
        }
    }

    /**
     * 短信验证码验证
     * POST /api/v1/sms/:mobile/:code
     */
    public async verify() {
        let { mobile, code } = this.ctx.params;
        const invalid = this.app.validator.validate(smsValidationRule, { mobile });

        if (invalid) {
            return this.ctx.throw(400, `${invalid[0].field} ${invalid[0].message}`, { code: 106001 });
        }

        let [verifyResult, err] = await this.service.sms.auth(mobile, code);

        if (verifyResult) {
            this.ctx.body = this.ctx.helper.successReply({});
        } else {
            this.ctx.throw(400, err, { code: 106005 });
        }
    }

    /**
     * 根据ID获取短信验证码
     * GET /api/v1/sms/:id
     */
    public async show() {
        const invalid = this.app.validator.validate({ id: 'ObjectId' }, this.ctx.params);
        if (invalid) {
            return this.ctx.throw(400, `${invalid[0].field} ${invalid[0].message}`, { code: 106001 });
        }
        const [sms, error] = await this.service.sms.show(this.ctx.params.id);

        if (error) {
            return this.ctx.throw(500, '服务器繁忙请稍后再试', { code: 5060002 });
        }

        if (!sms) {
            return this.ctx.throw(404, '未找到短信验证码', { code: 106002 });
        }

        this.ctx.body = this.ctx.helper.successReply(sms);
    }

    /**
     * 根据ID更新短信验证码
     * PUT /api/v1/sms/:id
     */
    public async update() {
        const invalid = this.app.validator.validate({ id: 'ObjectId' }, this.ctx.params);
        if (invalid) {
            return this.ctx.throw(400, `${invalid[0].field} ${invalid[0].message}`, { code: 106001 });
        }

        const update = { $set: _.pick(this.ctx.request.body, smsField) };

        if (_.isEmpty(update['$set'])) {
            return this.ctx.throw(400, '缺少更新参数', { code: 106003 });
        }

        const conditions = { _id: this.ctx.params.id };
        const [sms, error] = await this.service.sms.update(conditions, update);

        if (error) {
            return this.ctx.throw(500, '服务器繁忙请稍后再试', { code: 5060003 });
        }

        if (!sms) {
            return this.ctx.throw(404, '未找到短信验证码', { code: 106002 });
        }

        this.ctx.body = this.ctx.helper.successReply(sms);
    }

    /**
     * 列举短信验证码列表
     * GET /api/v1/smss{?page,size,order,sort}
     */
    public async index() {
        const query = this.ctx.query;

        const conditions = { isDeleted: false }; // 查询条件

        if (query['page']) query['page'] = parseInt(query['page']);
        if (query['size']) query['size'] = parseInt(query['size']);

        const queriesInvalid = this.app.validator.validate(queryValidationRule, query);

        if (queriesInvalid) {
            return this.ctx.throw(400, `${queriesInvalid[0].field} ${queriesInvalid[0].message}`, { code: 106001 });
        }

        let listQuery = this.ctx.model.AdminSms.find(conditions);
        const queries: Relationship.Query = queriesInvalid ? defaultQuery() : query;
        listQuery = pagedQuery(listQuery, queries);

        let result = await listQuery;
        this.ctx.body = this.ctx.helper.successReply(result);
    }

    /**
     * 根据ID删除短信验证码
     * PUT /api/v1/sms/:id
     */
    public async del() {
        const invalid = this.app.validator.validate({ id: 'ObjectId' }, this.ctx.params);
        if (invalid) {
            return this.ctx.throw(400, `${invalid[0].field} ${invalid[0].message}`, { code: 106001 });
        }

        const update = { $set: { isDeleted: true } };
        const conditions = { _id: this.ctx.params.id };

        const [sms, error] = await this.service.sms.update(conditions, update);

        if (error) {
            return this.ctx.throw(500, '服务器繁忙请稍后再试', { code: 5060003 });
        }

        if (!sms) {
            return this.ctx.throw(404, '未找到短信验证码', { code: 106002 });
        }

        this.ctx.body = this.ctx.helper.successReply(sms);
    }
}