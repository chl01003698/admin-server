/*
 * @Author: cuiweiqiang
 * @Date:   2018-02-05 17:33:59
 * @Last Modified by:   cuiweiqiang
 * @Last Modified time: 2018-02-09 14:20:58
 */
// 渠道管理
import * as _ from 'lodash';
import { Controller } from 'egg';
import { channelField, channelValidationRule } from '../../common/validators/channels.model';
import { defaultQuery, pagedQuery, queryValidationRule } from '../../common/query.model';

export default class Channels extends Controller {
    /**
     * 添加渠道
     * POST /api/v1/channel
     */
    public async create() {
        const invalid = this.app.validator.validate(channelValidationRule, this.ctx.request.body);

        if (invalid) {
            return this.ctx.throw(400, `${invalid[0].field} ${invalid[0].message}`, { code: 109001 });
        }
        const [channel, error] = await this.service.channel.create(this.ctx.request.body);
        if (error) {
            return this.ctx.throw(500, '服务器繁忙请稍后再试', { code: 5090001 });
        }

        this.ctx.body = this.ctx.helper.successReply(channel);
    }

    /**
     * 根据ID获取渠道
     * GET /api/v1/channel/:id
     */
    public async show() {
        const invalid = this.app.validator.validate({ id: 'ObjectId' }, this.ctx.params);
        if (invalid) {
            return this.ctx.throw(400, `${invalid[0].field} ${invalid[0].message}`, { code: 109001 });
        }
        const [channel, error] = await this.service.channel.show(this.ctx.params.id);

        if (error) {
            return this.ctx.throw(500, '服务器繁忙请稍后再试', { code: 5090002 });
        }

        if (!channel) {
            return this.ctx.throw(404, '未找到渠道', { code: 109002 });
        }

        this.ctx.body = this.ctx.helper.successReply(channel);
    }

    /**
     * 根据ID更新渠道
     * PUT /api/v1/channel/:id
     */
    public async update() {
        const invalid = this.app.validator.validate({ id: 'ObjectId' }, this.ctx.params);
        if (invalid) {
            return this.ctx.throw(400, `${invalid[0].field} ${invalid[0].message}`, { code: 109001 });
        }

        const update = { $set: _.pick(this.ctx.request.body, channelField) };

        if (_.isEmpty(update['$set'])) {
            return this.ctx.throw(400, '缺少更新参数', { code: 109003 });
        }

        const conditions = { _id: this.ctx.params.id };
        const [channel, error] = await this.service.channel.update(conditions, update);

        if (error) {
            return this.ctx.throw(500, '服务器繁忙请稍后再试', { code: 5090003 });
        }

        if (!channel) {
            return this.ctx.throw(404, '未找到渠道', { code: 109002 });
        }

        this.ctx.body = this.ctx.helper.successReply(channel);
    }

    /**
     * 列举渠道列表
     * GET /api/v1/channels{?page,size,order,sort}
     */
    public async index() {
        const query = this.ctx.query;

        const conditions = { isDeleted: false }; // 查询条件

        if (query['page']) query['page'] = parseInt(query['page']);
        if (query['size']) query['size'] = parseInt(query['size']);

        const queriesInvalid = this.app.validator.validate(queryValidationRule, query);

        if (queriesInvalid) {
            return this.ctx.throw(400, `${queriesInvalid[0].field} ${queriesInvalid[0].message}`, { code: 109001 });
        }

        let listQuery = this.ctx.model.AdminChannel.find(conditions);
        const queries: Relationship.Query = queriesInvalid ? defaultQuery() : query;
        listQuery = pagedQuery(listQuery, queries);

        let result = await listQuery;
        this.ctx.body = this.ctx.helper.successReply(result);
    }

    /**
     * 根据ID删除渠道
     * PUT /api/v1/channel/:id
     */
    public async del() {
        const invalid = this.app.validator.validate({ id: 'ObjectId' }, this.ctx.params);
        if (invalid) {
            return this.ctx.throw(400, `${invalid[0].field} ${invalid[0].message}`, { code: 109001 });
        }

        const update = { $set: { isDeleted: true } };
        const conditions = { _id: this.ctx.params.id };

        const [channel, error] = await this.service.channel.update(conditions, update);

        if (error) {
            return this.ctx.throw(500, '服务器繁忙请稍后再试', { code: 5090003 });
        }

        if (!channel) {
            return this.ctx.throw(404, '未找到渠道', { code: 109002 });
        }

        this.ctx.body = this.ctx.helper.successReply(channel);
    }
}