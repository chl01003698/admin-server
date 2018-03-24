/*
 * @Author: cuiweiqiang
 * @Date:   2018-02-05 17:23:43
 * @Last Modified by:   cuiweiqiang
 * @Last Modified time: 2018-03-03 17:32:36
 */

// 用户组管理
import * as _ from 'lodash';
import { Controller } from 'egg';
import { groupField, groupValidationRule } from '../../common/validators/groups.model';
import { defaultQuery, pagedQuery, queryValidationRule } from '../../common/query.model';

export default class Groups extends Controller {
    /**
     * 添加用户组
     * POST /api/v1/groups
     */
    public async create() {
        const invalid = this.app.validator.validate(groupValidationRule, this.ctx.request.body);

        if (invalid) {
            return this.ctx.throw(400, `${invalid[0].field} ${invalid[0].message}`, { code: 102001 });
        }
        const [group, error] = await this.service.group.create(this.ctx.request.body);
        if (error) {
            return this.ctx.throw(500, '服务器繁忙请稍后再试', { code: 5020001 });
        }

        this.ctx.body = this.ctx.helper.successReply(group);
    }

    /**
     * 根据ID获取用户组
     * GET /api/v1/groups/:id
     */
    public async show() {
        const invalid = this.app.validator.validate({ id: 'ObjectId' }, this.ctx.params);
        if (invalid) {
            return this.ctx.throw(400, `${invalid[0].field} ${invalid[0].message}`, { code: 102001 });
        }
        const [group, error] = await this.service.group.show(this.ctx.params.id);

        if (error) {
            return this.ctx.throw(500, '服务器繁忙请稍后再试', { code: 5020002 });
        }

        if (!group) {
            return this.ctx.throw(404, '未找到用户组', { code: 102002 });
        }

        this.ctx.body = this.ctx.helper.successReply(group);
    }

    /**
     * 获取用户组下所有用户
     * GET /api/v1/groups/:id/users
     */
    public async getUsers() {
        const invalid = this.app.validator.validate({ id: 'ObjectId' }, this.ctx.params);
        if (invalid) {
            return this.ctx.throw(400, `${invalid[0].field} ${invalid[0].message}`, { code: 102004 });
        }

        const query = this.ctx.query;

        const conditions = {
            group: this.ctx.params.id,
            isDeleted: false
        }; // 查询条件

        if (query['page']) query['page'] = parseInt(query['page']);
        if (query['size']) query['size'] = parseInt(query['size']);

        const queriesInvalid = this.app.validator.validate(queryValidationRule, query);

        if (queriesInvalid) {
            return this.ctx.throw(400, `${queriesInvalid[0].field} ${queriesInvalid[0].message}`, { code: 102001 });
        }

        let listQuery = this.ctx.model.AdminUserGroup.find(conditions);
        const queries: Relationship.Query = queriesInvalid ? defaultQuery() : query;
        listQuery = pagedQuery(listQuery, queries);

        let result = await listQuery;
        let count = await this.ctx.model.AdminUserGroup.find(conditions).count();
        this.ctx.body = this.ctx.helper.successReply({ docs: result, count });
    }

    /**
     * 获取用户组权限
     * GET /api/v1/groups/:id/permissions
     */
    public async getPermissions() {
        const invalid = this.app.validator.validate({ id: 'ObjectId' }, this.ctx.params);
        if (invalid) {
            return this.ctx.throw(400, `${invalid[0].field} ${invalid[0].message}`, { code: 102004 });
        }

        const [groupPermission, error] = await this.ctx.service.groupPermission.show(this.ctx.params.id);
        if (error) {
            return this.ctx.throw(400, error, { code: 102005 });
        }

        this.ctx.body = this.ctx.helper.successReply(groupPermission);
    }

    /**
     * 为用户组分配权限
     * POST /api/v1/groups/:id/permissions
     */
    public async assignPermissions() {
        const invalid = this.app.validator.validate({ id: 'ObjectId' }, this.ctx.params);
        if (invalid) {
            return this.ctx.throw(400, `${invalid[0].field} ${invalid[0].message}`, { code: 102004 });
        }
        let body = this.ctx.request.body;
        if (!(body as any).permissions ){//|| (body as any).permissions.length <= 1) {
            // return this.ctx.throw(400, '传入权限列表不能为空', { code: 102004 });
            (body as any).permissions = [];
        }
        const [groupPermission, error] = await this.ctx.service.groupPermission.create({ gid: this.ctx.params.id, permissions: (body as any).permissions });
        if (error) {
            return this.ctx.throw(400, error, { code: 102005 });
        }

        this.ctx.body = this.ctx.helper.successReply();
    }


    /**
     * 为用户组分配用户
     * POST /api/v1/groups/:id/:uid
     */
    public async assignUser() {
        const invalid = this.app.validator.validate({ id: 'ObjectId', uid: 'ObjectId' }, this.ctx.params);
        if (invalid) {
            return this.ctx.throw(400, `${invalid[0].field} ${invalid[0].message}`, { code: 102004 });
        }

        let user = await this.ctx.model.AdminUser.findById(this.ctx.params.uid);

        if (!user) {
            this.ctx.throw(400, '用户不存在', { code: 102005 });
        }

        if (user.userRoleType == 0) {
            this.ctx.throw(400, '不允许对管理员进行此操作', { code: 102006 });
        }

        const [userGroup, error] = await this.service.userGroup.create({ group: this.ctx.params.id, user: this.ctx.params.uid });
        if (error) {
            return this.ctx.throw(500, '服务器繁忙请稍后再试', { code: 5020001 });
        }

        this.ctx.body = this.ctx.helper.successReply();
    }

    /**
     * 为用户组移除用户
     * DELETE /api/v1/groups/:id/:uid
     */
    public async removeUser() {
        const invalid = this.app.validator.validate({ id: 'ObjectId', uid: 'ObjectId' }, this.ctx.params);
        if (invalid) {
            return this.ctx.throw(400, `${invalid[0].field} ${invalid[0].message}`, { code: 102004 });
        }

        let user = await this.ctx.model.AdminUser.findById(this.ctx.params.uid);

        if (!user) {
            this.ctx.throw(400, '用户不存在', { code: 102005 });
        }

        if (user.userRoleType == 0) {
            this.ctx.throw(400, '不允许对管理员进行此操作', { code: 102006 });
        }

        let queryUG = await this.ctx.model.AdminUserGroup.find({ group: this.ctx.params.id, user: this.ctx.params.uid, isDeleted: false });

        if (!queryUG || queryUG.length <= 0) {
            this.ctx.throw(400, '用户不在当前组', { code: 102005 });
        }

        const update = { $set: { isDeleted: true } };
        const conditions = { group: this.ctx.params.id, user: this.ctx.params.uid };

        const [, error] = await this.service.userGroup.update(conditions, update);

        if (error) {
            return this.ctx.throw(500, '服务器繁忙请稍后再试', { code: 5020001 });
        }

        this.ctx.body = this.ctx.helper.successReply();
    }

    /**
     * 根据ID更新用户组
     * PUT /api/v1/groups/:id
     */
    public async update() {
        const invalid = this.app.validator.validate({ id: 'ObjectId' }, this.ctx.params);
        if (invalid) {
            return this.ctx.throw(400, `${invalid[0].field} ${invalid[0].message}`, { code: 102001 });
        }

        const update = { $set: _.pick(this.ctx.request.body, groupField) };

        if (_.isEmpty(update['$set'])) {
            return this.ctx.throw(400, '缺少更新参数', { code: 102003 });
        }

        const conditions = { _id: this.ctx.params.id };
        const [group, error] = await this.service.group.update(conditions, update);

        if (error) {
            return this.ctx.throw(500, '服务器繁忙请稍后再试', { code: 5020003 });
        }

        if (!group) {
            return this.ctx.throw(404, '未找到用户组', { code: 102002 });
        }

        this.ctx.body = this.ctx.helper.successReply(group);
    }

    /**
     * 列举用户组列表
     * GET /api/v1/groups{?page,size,order,sort}
     */
    public async index() {
        const query = this.ctx.query;

        const conditions = { isDeleted: false }; // 查询条件

        if (query['page']) query['page'] = parseInt(query['page']);
        if (query['size']) query['size'] = parseInt(query['size']);

        const queriesInvalid = this.app.validator.validate(queryValidationRule, query);

        if (queriesInvalid) {
            return this.ctx.throw(400, `${queriesInvalid[0].field} ${queriesInvalid[0].message}`, { code: 102001 });
        }

        let listQuery = this.ctx.model.AdminGroup.find(conditions);
        const queries: Relationship.Query = queriesInvalid ? defaultQuery() : query;
        listQuery = pagedQuery(listQuery, queries);

        let result = await listQuery;
        let count = await this.ctx.model.AdminGroup.find(conditions).count();
        this.ctx.body = this.ctx.helper.successReply({ docs: result, count });
    }

    /**
     * 根据ID删除用户组
     * PUT /api/v1/groups/:id
     */
    public async del() {
        const invalid = this.app.validator.validate({ id: 'ObjectId' }, this.ctx.params);
        if (invalid) {
            return this.ctx.throw(400, `${invalid[0].field} ${invalid[0].message}`, { code: 102001 });
        }

        let ex = await this.ctx.model.AdminUserGroup.find({ group: this.ctx.params.id });

        if (ex.length > 0) {
            return this.ctx.throw(400, '用户组正在使用中，不得删除', { code: 102003 });
        }

        const update = { $set: { isDeleted: true } };
        const conditions = { _id: this.ctx.params.id };

        const [group, error] = await this.service.group.update(conditions, update);

        if (error) {
            return this.ctx.throw(500, '服务器繁忙请稍后再试', { code: 5020003 });
        }

        if (!group) {
            return this.ctx.throw(404, '未找到用户组', { code: 102002 });
        }

        this.ctx.body = this.ctx.helper.successReply(group);
    }
}