/*
 * @Author: cuiweiqiang
 * @Date:   2018-02-05 17:23:43
 * @Last Modified by:   cuiweiqiang
 * @Last Modified time: 2018-02-09 14:20:57
 */

// 装修管理
import * as _ from 'lodash';
import { Controller } from 'egg';
import { decorationField, decorationValidationRule } from '../../common/validators/decorations.model';
import { defaultQuery, pagedQuery, queryValidationRule } from '../../common/query.model';

export default class Decorations extends Controller {
    /**
     * 添加装修方案
     * POST /api/v1/decoration
     */
    public async create() {
        const invalid = this.app.validator.validate(decorationValidationRule, this.ctx.request.body);

        if (invalid) {
            return this.ctx.throw(400, `${invalid[0].field} ${invalid[0].message}`, { code: 108001 });
        }
        const [decoration, error] = await this.service.decoration.create(this.ctx.request.body);
        if (error) {
            return this.ctx.throw(500, '服务器繁忙请稍后再试', { code: 5080001 });
        }

        this.ctx.body = this.ctx.helper.successReply(decoration);
    }

    /**
     * 根据ID获取装修方案
     * GET /api/v1/decoration/:id
     */
    public async show() {
        const invalid = this.app.validator.validate({ id: 'ObjectId' }, this.ctx.params);
        if (invalid) {
            return this.ctx.throw(400, `${invalid[0].field} ${invalid[0].message}`, { code: 108001 });
        }
        const [decoration, error] = await this.service.decoration.show(this.ctx.params.id);

        if (error) {
            return this.ctx.throw(500, '服务器繁忙请稍后再试', { code: 5080002 });
        }

        if (!decoration) {
            return this.ctx.throw(404, '未找到装修方案', { code: 108002 });
        }

        this.ctx.body = this.ctx.helper.successReply(decoration);
    }

    /**
     * 根据ID更新装修方案
     * PUT /api/v1/decoration/:id
     */
    public async update() {
        const invalid = this.app.validator.validate({ id: 'ObjectId' }, this.ctx.params);
        if (invalid) {
            return this.ctx.throw(400, `${invalid[0].field} ${invalid[0].message}`, { code: 108001 });
        }

        const update = { $set: _.pick(this.ctx.request.body, decorationField) };

        if (_.isEmpty(update['$set'])) {
            return this.ctx.throw(400, '缺少更新参数', { code: 100003 });
        }

        const conditions = { _id: this.ctx.params.id };
        const [decoration, error] = await this.service.decoration.update(conditions, update);

        if (error) {
            return this.ctx.throw(500, '服务器繁忙请稍后再试', { code: 5080003 });
        }

        if (!decoration) {
            return this.ctx.throw(404, '未找到装修方案', { code: 108002 });
        }

        this.ctx.body = this.ctx.helper.successReply(decoration);
    }

    /**
     * 列举装修方案列表
     * GET /api/v1/decorations{?page,size,order,sort}
     */
    public async index() {
        const query = this.ctx.query;

        const conditions = { isDeleted: false }; // 查询条件

        if (query['page']) query['page'] = parseInt(query['page']);
        if (query['size']) query['size'] = parseInt(query['size']);

        const queriesInvalid = this.app.validator.validate(queryValidationRule, query);

        if (queriesInvalid) {
            return this.ctx.throw(400, `${queriesInvalid[0].field} ${queriesInvalid[0].message}`, { code: 108001 });
        }

        let listQuery = this.ctx.model.AdminDecoration.find(conditions);
        const queries: Relationship.Query = queriesInvalid ? defaultQuery() : query;
        listQuery = pagedQuery(listQuery, queries);

        let result = await listQuery;
        this.ctx.body = this.ctx.helper.successReply(result);
    }

    /**
     * 根据ID删除装修方案
     * PUT /api/v1/decoration/:id
     */
    public async del() {
        const invalid = this.app.validator.validate({ id: 'ObjectId' }, this.ctx.params);
        if (invalid) {
            return this.ctx.throw(400, `${invalid[0].field} ${invalid[0].message}`, { code: 109001 });
        }

        const update = { $set: { isDeleted: true } };
        const conditions = { _id: this.ctx.params.id };

        const [decoration, error] = await this.service.decoration.update(conditions, update);

        if (error) {
            return this.ctx.throw(500, '服务器繁忙请稍后再试', { code: 5090003 });
        }

        if (!decoration) {
            return this.ctx.throw(404, '未找到渠道', { code: 109002 });
        }

        this.ctx.body = this.ctx.helper.successReply(decoration);
    }

}