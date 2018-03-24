/*
 * @Author: cuiweiqiang
 * @Date:   2018-02-06 19:47:22
 * @Last Modified by:   cuiweiqiang
 * @Last Modified time: 2018-02-24 11:25:37
 */
//角标管理
import * as _ from 'lodash';
import { Controller } from 'egg';
import { subscriptField, subscriptValidationRule } from '../../common/validators/subscripts.model';
import { defaultQuery, pagedQuery, queryValidationRule } from '../../common/query.model';


export default class Subscripts extends Controller {
    /**
     * 添加角标
     * POST /api/v1/subscript
     */
    public async create() {
        const invalid = this.app.validator.validate(subscriptValidationRule, this.ctx.request.body);

        if (invalid) {
            return this.ctx.throw(400, `${invalid[0].field} ${invalid[0].message}`, { code: 111001 });
        }
        const [subscript, error] = await this.service.subscript.create(this.ctx.request.body);
        if (error) {
            return this.ctx.throw(500, '服务器繁忙请稍后再试', { code: 5110001 });
        }

        this.ctx.body = this.ctx.helper.successReply(subscript);
    }

    /**
     * 根据ID获取角标
     * GET /api/v1/subscript/:id
     */
    public async show() {
        const invalid = this.app.validator.validate({ id: 'ObjectId' }, this.ctx.params);
        if (invalid) {
            return this.ctx.throw(400, `${invalid[0].field} ${invalid[0].message}`, { code: 111001 });
        }
        const [subscript, error] = await this.service.subscript.show(this.ctx.params.id);

        if (error) {
            return this.ctx.throw(500, '服务器繁忙请稍后再试', { code: 5110002 });
        }

        if (!subscript) {
            return this.ctx.throw(404, '未找到角标', { code: 111002 });
        }

        this.ctx.body = this.ctx.helper.successReply(subscript);
    }

    /**
     * 根据ID更新角标
     * PUT /api/v1/subscript/:id
     */
    public async update() {
        const invalid = this.app.validator.validate({ id: 'ObjectId' }, this.ctx.params);
        if (invalid) {
            return this.ctx.throw(400, `${invalid[0].field} ${invalid[0].message}`, { code: 111001 });
        }

        const update = { $set: _.pick(this.ctx.request.body, subscriptField) };

        if (_.isEmpty(update['$set'])) {
            return this.ctx.throw(400, '缺少更新参数', { code: 111003 });
        }

        const conditions = { _id: this.ctx.params.id };
        const [subscript, error] = await this.service.subscript.update(conditions, update);

        if (error) {
            return this.ctx.throw(500, '服务器繁忙请稍后再试', { code: 5110003 });
        }

        if (!subscript) {
            return this.ctx.throw(404, '未找到角标', { code: 111002 });
        }

        this.ctx.body = this.ctx.helper.successReply(subscript);
    }

    /**
     * 列举角标列表
     * GET /api/v1/subscripts{?page,size,order,sort}
     */
    public async index() {
        const query = this.ctx.query;

        const conditions = { isDeleted: false }; // 查询条件

        if (query['page']) query['page'] = parseInt(query['page']);
        if (query['size']) query['size'] = parseInt(query['size']);

        const queriesInvalid = this.app.validator.validate(queryValidationRule, query);

        if (queriesInvalid) {
            return this.ctx.throw(400, `${queriesInvalid[0].field} ${queriesInvalid[0].message}`, { code: 111001 });
        }

        let listQuery = this.ctx.model.AdminSubscript.find(conditions);
        const queries: Relationship.Query = queriesInvalid ? defaultQuery() : query;
        listQuery = pagedQuery(listQuery, queries);

        let result = await listQuery;
        let count = await this.ctx.model.AdminSubscript.find(conditions).count();
        this.ctx.body = this.ctx.helper.successReply({ docs: result, count });
    }

    /**
     * 根据ID删除角标
     * PUT /api/v1/subscript/:id
     */
    public async del() {
        const invalid = this.app.validator.validate({ id: 'ObjectId' }, this.ctx.params);
        if (invalid) {
            return this.ctx.throw(400, `${invalid[0].field} ${invalid[0].message}`, { code: 111001 });
        }

        let queryRef = await this.ctx.model.AdminActivity.find({ isDeleted: false, subscript: this.ctx.params.id })
        if (queryRef.length > 0) {
            return this.ctx.throw(400, '该角标已经被活动使用不能删除!', { code: 111003 });
        }

        const update = { $set: { isDeleted: true } };
        const conditions = { _id: this.ctx.params.id };

        const [subscript, error] = await this.service.subscript.update(conditions, update);

        if (error) {
            return this.ctx.throw(500, '服务器繁忙请稍后再试', { code: 5110003 });
        }

        if (!subscript) {
            return this.ctx.throw(404, '未找到角标', { code: 111002 });
        }

        this.ctx.body = this.ctx.helper.successReply(subscript);
    }
}