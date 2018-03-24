/*
 * @Author: cuiweiqiang
 * @Date:   2018-02-05 17:23:43
 * @Last Modified by:   cuiweiqiang
 * @Last Modified time: 2018-02-10 17:37:12
 */

// 消息管理
import * as _ from 'lodash';
import { Controller } from 'egg';
import { messageField, messageValidationRule } from '../../common/validators/messages.model';
import { defaultQuery, pagedQuery, queryValidationRule } from '../../common/query.model';

const SEARCH_FIELD = ['title', 'to'];

export default class Messages extends Controller {
    /**
     * 添加消息
     * POST /api/v1/message
     */
    public async create() {
        const invalid = this.app.validator.validate(messageValidationRule, this.ctx.request.body);

        if (invalid) {
            return this.ctx.throw(400, `${invalid[0].field} ${invalid[0].message}`, { code: 107001 });
        }
        const [message, error] = await this.service.message.create(this.ctx.request.body);
        if (error) {
            return this.ctx.throw(500, '服务器繁忙请稍后再试', { code: 5070001 });
        }

        this.ctx.body = this.ctx.helper.successReply(message);
    }

    /**
     * 根据ID获取消息
     * GET /api/v1/message/:id
     */
    public async show() {
        const invalid = this.app.validator.validate({ id: 'ObjectId' }, this.ctx.params);
        if (invalid) {
            return this.ctx.throw(400, `${invalid[0].field} ${invalid[0].message}`, { code: 107001 });
        }
        const [message, error] = await this.service.message.show(this.ctx.params.id);

        if (error) {
            return this.ctx.throw(500, '服务器繁忙请稍后再试', { code: 5070002 });
        }

        if (!message) {
            return this.ctx.throw(404, '未找到消息', { code: 107002 });
        }

        this.ctx.body = this.ctx.helper.successReply(message);
    }

    /**
     * 根据ID更新消息
     * PUT /api/v1/message/:id
     */
    public async update() {
        const invalid = this.app.validator.validate({ id: 'ObjectId' }, this.ctx.params);
        if (invalid) {
            return this.ctx.throw(400, `${invalid[0].field} ${invalid[0].message}`, { code: 107001 });
        }

        const update = { $set: _.pick(this.ctx.request.body, messageField) };

        if (_.isEmpty(update['$set'])) {
            return this.ctx.throw(400, '缺少更新参数', { code: 107003 });
        }

        const conditions = { _id: this.ctx.params.id };
        const [message, error] = await this.service.message.update(conditions, update);

        if (error) {
            return this.ctx.throw(500, '服务器繁忙请稍后再试', { code: 5070003 });
        }

        if (!message) {
            return this.ctx.throw(404, '未找到消息', { code: 107002 });
        }

        this.ctx.body = this.ctx.helper.successReply(message);
    }

    /**
     * 列举消息列表
     * GET /api/v1/messages{?page,size,order,sort}
     */
    public async index() {
        const query = this.ctx.query;

        let conditions = _.pick(query, SEARCH_FIELD);
        this.ctx.helper.removeEmpty(conditions);
        if (_.isEmpty(conditions)) {

            conditions = { isDeleted: false }; // 查询条件
        } else {
            Object.assign(conditions, { isDeleted: false });
        }

        if (query['page']) query['page'] = parseInt(query['page']);
        if (query['size']) query['size'] = parseInt(query['size']);

        const queriesInvalid = this.app.validator.validate(queryValidationRule, query);

        if (queriesInvalid) {
            return this.ctx.throw(400, `${queriesInvalid[0].field} ${queriesInvalid[0].message}`, { code: 107001 });
        }

        let listQuery = this.ctx.model.AdminMessage.find(conditions);
        const queries: Relationship.Query = queriesInvalid ? defaultQuery() : query;
        listQuery = pagedQuery(listQuery, queries);

        let result = await listQuery;
        let count = await this.ctx.model.AdminMessage.find(conditions).count();
        this.ctx.body = this.ctx.helper.successReply({ docs: result, count });
    }

    /**
     * 根据ID删除消息
     * PUT /api/v1/message/:id
     */
    public async del() {
        const invalid = this.app.validator.validate({ id: 'ObjectId' }, this.ctx.params);
        if (invalid) {
            return this.ctx.throw(400, `${invalid[0].field} ${invalid[0].message}`, { code: 107001 });
        }

        const update = { $set: { isDeleted: true } };
        const conditions = { _id: this.ctx.params.id };

        const [message, error] = await this.service.message.update(conditions, update);

        if (error) {
            return this.ctx.throw(500, '服务器繁忙请稍后再试', { code: 5070003 });
        }

        if (!message) {
            return this.ctx.throw(404, '未找到消息', { code: 107002 });
        }

        this.ctx.body = this.ctx.helper.successReply(message);
    }
}