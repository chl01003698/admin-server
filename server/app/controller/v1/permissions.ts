/*
 * @Author: cuiweiqiang
 * @Date:   2018-02-05 17:23:43
 * @Last Modified by:   cuiweiqiang
 * @Last Modified time: 2018-03-03 17:43:34
 */

// 权限管理
import * as _ from 'lodash';
import { Controller } from 'egg';
import { permissionField, permissionValidationRule } from '../../common/validators/permissions.model';
import { defaultQuery, pagedQuery, queryValidationRule } from '../../common/query.model';

export default class Permissions extends Controller {
    /**
     * 添加权限
     * POST /api/v1/permission
     */
    public async create() {
        const invalid = this.app.validator.validate(permissionValidationRule, this.ctx.request.body);

        if (invalid) {
            return this.ctx.throw(400, `${invalid[0].field} ${invalid[0].message}`, { code: 103001 });
        }
        const [permission, error] = await this.service.permission.create(this.ctx.request.body);
        if (error) {
            return this.ctx.throw(500, '服务器繁忙请稍后再试', { code: 5030001 });
        }

        this.ctx.body = this.ctx.helper.successReply(permission);
    }

    /**
     * 根据ID获取权限
     * GET /api/v1/permission/:id
     */
    public async show() {
        const invalid = this.app.validator.validate({ id: 'ObjectId' }, this.ctx.params);
        if (invalid) {
            return this.ctx.throw(400, `${invalid[0].field} ${invalid[0].message}`, { code: 103001 });
        }
        const [permission, error] = await this.service.permission.show(this.ctx.params.id);

        if (error) {
            return this.ctx.throw(500, '服务器繁忙请稍后再试', { code: 5030002 });
        }

        if (!permission) {
            return this.ctx.throw(404, '未找到权限', { code: 103002 });
        }

        this.ctx.body = this.ctx.helper.successReply(permission);
    }

    /**
     * 根据ID更新权限
     * PUT /api/v1/permission/:id
     */
    public async update() {
        const invalid = this.app.validator.validate({ id: 'ObjectId' }, this.ctx.params);
        if (invalid) {
            return this.ctx.throw(400, `${invalid[0].field} ${invalid[0].message}`, { code: 103001 });
        }

        const update = { $set: _.pick(this.ctx.request.body, permissionField) };

        if (_.isEmpty(update['$set'])) {
            return this.ctx.throw(400, '缺少更新参数', { code: 103003 });
        }

        const conditions = { _id: this.ctx.params.id };
        const [permission, error] = await this.service.permission.update(conditions, update);

        if (error) {
            return this.ctx.throw(500, '服务器繁忙请稍后再试', { code: 5030003 });
        }

        if (!permission) {
            return this.ctx.throw(404, '未找到权限', { code: 103002 });
        }

        this.ctx.body = this.ctx.helper.successReply(permission);
    }

    /**
     * 列举权限列表
     * GET /api/v1/permissions{?page,size,order,sort}
     */
    public async index() {
        const query = this.ctx.query;

        const conditions = {}; // 查询条件

        if (query['page']) query['page'] = parseInt(query['page']);
        if (query['size']) query['size'] = parseInt(query['size']);

        const queriesInvalid = this.app.validator.validate(queryValidationRule, query);

        if (queriesInvalid) {
            return this.ctx.throw(400, `${queriesInvalid[0].field} ${queriesInvalid[0].message}`, { code: 103001 });
        }

        let listQuery = this.ctx.model.AdminPermission.find(conditions).select('-path');
        const queries: Relationship.Query = queriesInvalid ? defaultQuery() : query;
        listQuery = pagedQuery(listQuery, queries);

        let result = await listQuery;
        let count = await this.ctx.model.AdminPermission.find(conditions).count();
        this.ctx.body = this.ctx.helper.successReply({ docs: result, count });
    }

    /**
     * 根据ID删除权限
     * PUT /api/v1/permission/:id
     */
    public async del() {
        const invalid = this.app.validator.validate({ id: 'ObjectId' }, this.ctx.params);
        if (invalid) {
            return this.ctx.throw(400, `${invalid[0].field} ${invalid[0].message}`, { code: 103001 });
        }

        const update = { $set: { isDeleted: true } };
        const conditions = { _id: this.ctx.params.id };

        const [permission, error] = await this.service.permission.update(conditions, update);

        if (error) {
            return this.ctx.throw(500, '服务器繁忙请稍后再试', { code: 5030003 });
        }

        if (!permission) {
            return this.ctx.throw(404, '未找到权限', { code: 103002 });
        }

        this.ctx.body = this.ctx.helper.successReply(permission);
    }
}