/*
 * @Author: cuiweiqiang
 * @Date:   2018-02-05 17:23:43
 * @Last Modified by:   cuiweiqiang
 * @Last Modified time: 2018-02-23 18:22:28
 */

// 活动管理
import * as _ from 'lodash';
import { Controller } from 'egg';
import { activityField, activityValidationRule } from '../../common/validators/activities.model';
import { defaultQuery, pagedQuery, queryValidationRule } from '../../common/query.model';

const SEARCH_FIELD = ['activityName', 'activeModel', 'status'];

export default class Activitys extends Controller {
    /**
     * 添加活动
     * POST /api/v1/activity
     */
    public async create() {
        const invalid = this.app.validator.validate(activityValidationRule, this.ctx.request.body);

        if (invalid) {
            return this.ctx.throw(400, `${invalid[0].field} ${invalid[0].message}`, { code: 105001 });
        }
        const [activity, error] = await this.service.activity.create(this.ctx.request.body);
        if (error) {
            return this.ctx.throw(500, '服务器繁忙请稍后再试', { code: 5050001 });
        }

        this.ctx.body = this.ctx.helper.successReply(activity);
    }

    public async swap() {
        //this.ctx.throw(400, 'This API was Deprecated !', { code: 5050004 });
        const UNIQUE_NUMBER = 1000000;
        let { fid, sid } = this.ctx.params;

        let f_doc = await this.ctx.model.AdminActivity.find({ _id: fid, isDeleted: false });
        let s_doc = await this.ctx.model.AdminActivity.find({ _id: sid, isDeleted: false });

        if (_.isEmpty(f_doc) || _.isEmpty(s_doc)) {
            this.ctx.body.throw(404, '活动不存在，请重试', { code: 105004 });
        } else {
            f_doc = f_doc[0];
            s_doc = s_doc[0];
        }

        const f_update = { $set: { activitySortFlag: s_doc.activitySortFlag } }
        const s_update = { $set: { activitySortFlag: f_doc.activitySortFlag } }

        await this.service.activity.update({ _id: f_doc._id }, { $set: { activitySortFlag: UNIQUE_NUMBER } });
        const [, s_error] = await this.service.activity.update({ _id: s_doc._id }, s_update);
        const [, f_error] = await this.service.activity.update({ _id: f_doc._id }, f_update);

        if (f_error || s_error) {
            await this.service.activity.update({ _id: f_doc._id }, s_update);
            await this.service.activity.update({ _id: s_doc._id }, f_update);

            this.ctx.throw(500, f_error || s_error, { code: 5050004 });
        } else {
            this.ctx.body = this.ctx.helper.successReply({});
        }
    }

    /**
     * 根据ID获取活动
     * GET /api/v1/activity/:id
     */
    public async show() {
        const invalid = this.app.validator.validate({ id: 'ObjectId' }, this.ctx.params);
        if (invalid) {
            return this.ctx.throw(400, `${invalid[0].field} ${invalid[0].message}`, { code: 105001 });
        }
        const [activity, error] = await this.service.activity.show(this.ctx.params.id);

        if (error) {
            return this.ctx.throw(500, '服务器繁忙请稍后再试', { code: 5050002 });
        }

        if (!activity) {
            return this.ctx.throw(404, '未找到活动', { code: 105002 });
        }

        this.ctx.body = this.ctx.helper.successReply(activity);
    }

    /**
     * 根据ID更新活动
     * PUT /api/v1/activity/:id
     */
    public async update() {
        const invalid = this.app.validator.validate({ id: 'ObjectId' }, this.ctx.params);
        if (invalid) {
            return this.ctx.throw(400, `${invalid[0].field} ${invalid[0].message}`, { code: 105001 });
        }

        const update = { $set: _.pick(this.ctx.request.body, activityField) };

        if (_.isEmpty(update['$set'])) {
            return this.ctx.throw(400, '缺少更新参数', { code: 105003 });
        }

        const conditions = { _id: this.ctx.params.id };
        const [activity, error] = await this.service.activity.update(conditions, update);

        if (error) {
            return this.ctx.throw(500, '服务器繁忙请稍后再试', { code: 5050003 });
        }

        if (!activity) {
            return this.ctx.throw(404, '未找到活动', { code: 105002 });
        }

        this.ctx.body = this.ctx.helper.successReply(activity);
    }

    /**
     * 列举活动列表
     * GET /api/v1/activities{?page,size,order,sort}
     */
    public async index() {
        let query = this.ctx.query;

        let conditions = _.pick(query, SEARCH_FIELD);
        this.ctx.helper.removeEmpty(conditions);
        if (_.isEmpty(conditions)) {

            conditions = { isDeleted: false }; // 查询条件
        } else {
            Object.assign(conditions, { isDeleted: false });
        }

        if (query['page']) query['page'] = parseInt(query['page']);
        if (query['size']) query['size'] = parseInt(query['size']);

        query.sort = 'activitySortFlag';
        query.order = 'asc';

        const queriesInvalid = this.app.validator.validate(queryValidationRule, query);

        if (queriesInvalid) {
            return this.ctx.throw(400, `${queriesInvalid[0].field} ${queriesInvalid[0].message}`, { code: 105001 });
        }

        let listQuery = this.ctx.model.AdminActivity.find(conditions);
        const queries: Relationship.Query = queriesInvalid ? defaultQuery() : query;
        listQuery = pagedQuery(listQuery, queries);

        let result = await listQuery;
        let count = await this.ctx.model.AdminActivity.find(conditions).count();
        this.ctx.body = this.ctx.helper.successReply({ docs: result, count });
    }

    /**
     * 根据ID删除活动
     * PUT /api/v1/activity/:id
     */
    public async del() {
        const invalid = this.app.validator.validate({ id: 'ObjectId' }, this.ctx.params);
        if (invalid) {
            return this.ctx.throw(400, `${invalid[0].field} ${invalid[0].message}`, { code: 105001 });
        }

        const update = { $set: { isDeleted: true } };
        const conditions = { _id: this.ctx.params.id };

        const [activity, error] = await this.service.activity.update(conditions, update);

        if (error) {
            return this.ctx.throw(500, '服务器繁忙请稍后再试', { code: 5050003 });
        }

        if (!activity) {
            return this.ctx.throw(404, '未找到活动', { code: 105002 });
        }

        this.ctx.body = this.ctx.helper.successReply(activity);
    }
}