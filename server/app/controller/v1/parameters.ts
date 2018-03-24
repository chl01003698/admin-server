/*
 * @Author: cuiweiqiang
 * @Date:   2018-02-05 17:23:43
 * @Last Modified by:   cuiweiqiang
 * @Last Modified time: 2018-02-09 14:20:55
 */

// 游戏参数管理
import * as _ from 'lodash';
import { Controller } from 'egg';
import { parameterField, parameterValidationRule } from '../../common/validators/parameters.model';
import { defaultQuery, pagedQuery, queryValidationRule } from '../../common/query.model';

export default class Parameters extends Controller {
    /**
     * 添加游戏参数
     * POST /api/v1/parameter
     */
    public async create() {
        const invalid = this.app.validator.validate(parameterValidationRule, this.ctx.request.body);

        if (invalid) {
            return this.ctx.throw(400, `${invalid[0].field} ${invalid[0].message}`, { code: 104001 });
        }
        const [parameter, error] = await this.service.parameter.create(this.ctx.request.body);
        if (error) {
            return this.ctx.throw(500, '服务器繁忙请稍后再试', { code: 5040001 });
        }

        this.ctx.body = this.ctx.helper.successReply(parameter);
    }

    /**
     * 根据ID获取游戏参数
     * GET /api/v1/parameter/:id
     */
    public async show() {
        const invalid = this.app.validator.validate({ id: 'ObjectId' }, this.ctx.params);
        if (invalid) {
            return this.ctx.throw(400, `${invalid[0].field} ${invalid[0].message}`, { code: 104001 });
        }
        const [parameter, error] = await this.service.parameter.show(this.ctx.params.id);

        if (error) {
            return this.ctx.throw(500, '服务器繁忙请稍后再试', { code: 5040002 });
        }

        if (!parameter) {
            return this.ctx.throw(404, '未找到游戏参数', { code: 104002 });
        }

        this.ctx.body = this.ctx.helper.successReply(parameter);
    }

    /**
     * 根据ID更新游戏参数
     * PUT /api/v1/parameter/:id
     */
    public async update() {
        const invalid = this.app.validator.validate({ id: 'ObjectId' }, this.ctx.params);
        if (invalid) {
            return this.ctx.throw(400, `${invalid[0].field} ${invalid[0].message}`, { code: 104001 });
        }

        const update = { $set: _.pick(this.ctx.request.body, parameterField) };

        if (_.isEmpty(update['$set'])) {
            return this.ctx.throw(400, '缺少更新参数', { code: 104003 });
        }

        const conditions = { _id: this.ctx.params.id };
        const [parameter, error] = await this.service.parameter.update(conditions, update);

        if (error) {
            return this.ctx.throw(500, '服务器繁忙请稍后再试', { code: 5040003 });
        }

        if (!parameter) {
            return this.ctx.throw(404, '未找到游戏参数', { code: 104002 });
        }

        this.ctx.body = this.ctx.helper.successReply(parameter);
    }

    /**
     * 列举游戏参数列表
     * GET /api/v1/parameters{?page,size,order,sort}
     */
    public async index() {
        const query = this.ctx.query;

        const conditions = { isDeleted: false }; // 查询条件

        if (query['page']) query['page'] = parseInt(query['page']);
        if (query['size']) query['size'] = parseInt(query['size']);

        const queriesInvalid = this.app.validator.validate(queryValidationRule, query);

        if (queriesInvalid) {
            return this.ctx.throw(400, `${queriesInvalid[0].field} ${queriesInvalid[0].message}`, { code: 104001 });
        }

        let listQuery = this.ctx.model.AdminParameter.find(conditions);
        const queries: Relationship.Query = queriesInvalid ? defaultQuery() : query;
        listQuery = pagedQuery(listQuery, queries);

        let result = await listQuery;
        let count = await this.ctx.model.AdminParameter.find(conditions).count();
        this.ctx.body = this.ctx.helper.successReply({ docs: result, count });
    }

    /**
     * 根据ID删除游戏参数
     * PUT /api/v1/parameter/:id
     */
    public async del() {
        const invalid = this.app.validator.validate({ id: 'ObjectId' }, this.ctx.params);
        if (invalid) {
            return this.ctx.throw(400, `${invalid[0].field} ${invalid[0].message}`, { code: 104001 });
        }

        const update = { $set: { isDeleted: true } };
        const conditions = { _id: this.ctx.params.id };

        const [parameter, error] = await this.service.parameter.update(conditions, update);

        if (error) {
            return this.ctx.throw(500, '服务器繁忙请稍后再试', { code: 5040003 });
        }

        if (!parameter) {
            return this.ctx.throw(404, '未找到游戏参数', { code: 104002 });
        }

        this.ctx.body = this.ctx.helper.successReply(parameter);
    }
}