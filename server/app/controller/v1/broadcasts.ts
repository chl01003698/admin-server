/*
 * @Author: cuiweiqiang
 * @Date:   2018-02-05 17:23:43
 * @Last Modified by:   cuiweiqiang
 * @Last Modified time: 2018-02-09 14:20:58
 */
// 广播管理
import * as _ from 'lodash';
import { Controller } from 'egg';
import { broadcastField, broadcastValidationRule } from '../../common/validators/broadcasts.model';
import { defaultQuery, pagedQuery, queryValidationRule } from '../../common/query.model';

export default class Broadcasts extends Controller {
    /**
     * 添加广播
     * POST /api/v1/broadcast
     */
    public async create() {
        const invalid = this.app.validator.validate(broadcastValidationRule, this.ctx.request.body);

        if (invalid) {
            return this.ctx.throw(400, `${invalid[0].field} ${invalid[0].message}`, { code: 106001 });
        }
        const [broadcast, error] = await this.service.broadcast.create(this.ctx.request.body);
        if (error) {
            return this.ctx.throw(500, '服务器繁忙请稍后再试', { code: 5060001 });
        }

        this.ctx.body = this.ctx.helper.successReply(broadcast);
    }

    /**
     * 根据ID获取广播
     * GET /api/v1/broadcast/:id
     */
    public async show() {
        const invalid = this.app.validator.validate({ id: 'ObjectId' }, this.ctx.params);
        if (invalid) {
            return this.ctx.throw(400, `${invalid[0].field} ${invalid[0].message}`, { code: 106001 });
        }
        const [broadcast, error] = await this.service.broadcast.show(this.ctx.params.id);

        if (error) {
            return this.ctx.throw(500, '服务器繁忙请稍后再试', { code: 5060002 });
        }

        if (!broadcast) {
            return this.ctx.throw(404, '未找到广播', { code: 106002 });
        }

        this.ctx.body = this.ctx.helper.successReply(broadcast);
    }

    /**
     * 根据ID更新广播
     * PUT /api/v1/broadcast/:id
     */
    public async update() {
        const invalid = this.app.validator.validate({ id: 'ObjectId' }, this.ctx.params);
        if (invalid) {
            return this.ctx.throw(400, `${invalid[0].field} ${invalid[0].message}`, { code: 106001 });
        }

        const update = { $set: _.pick(this.ctx.request.body, broadcastField) };

        if (_.isEmpty(update['$set'])) {
            return this.ctx.throw(400, '缺少更新参数', { code: 106003 });
        }

        const conditions = { _id: this.ctx.params.id };
        const [broadcast, error] = await this.service.broadcast.update(conditions, update);

        if (error) {
            return this.ctx.throw(500, '服务器繁忙请稍后再试', { code: 5060003 });
        }

        if (!broadcast) {
            return this.ctx.throw(404, '未找到广播', { code: 106002 });
        }

        this.ctx.body = this.ctx.helper.successReply(broadcast);
    }

    /**
     * 列举广播列表
     * GET /api/v1/broadcasts{?page,size,order,sort}
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

        let listQuery = this.ctx.model.AdminBroadcast.find(conditions);
        const queries: Relationship.Query = queriesInvalid ? defaultQuery() : query;
        listQuery = pagedQuery(listQuery, queries);

        let result = await listQuery;
        this.ctx.body = this.ctx.helper.successReply(result);
    }

    /**
     * 根据ID删除广播
     * PUT /api/v1/broadcast/:id
     */
    public async del() {
        const invalid = this.app.validator.validate({ id: 'ObjectId' }, this.ctx.params);
        if (invalid) {
            return this.ctx.throw(400, `${invalid[0].field} ${invalid[0].message}`, { code: 106001 });
        }

        const update = { $set: { isDeleted: true } };
        const conditions = { _id: this.ctx.params.id };
        
        const [broadcast, error] = await this.service.broadcast.update(conditions, update);

        if (error) {
            return this.ctx.throw(500, '服务器繁忙请稍后再试', { code: 5060003 });
        }

        if (!broadcast) {
            return this.ctx.throw(404, '未找到广播', { code: 106002 });
        }

        this.ctx.body = this.ctx.helper.successReply(broadcast);
    }
}