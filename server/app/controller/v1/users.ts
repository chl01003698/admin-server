/*
 * @Author: cuiweiqiang
 * @Date:   2018-02-02 19:59:22
 * @Last Modified by:   cuiweiqiang
 * @Last Modified time: 2018-03-05 12:17:40
 */
// 用户管理

import { Controller } from 'egg';
import { defaultQuery, pagedQuery, queryValidationRule } from '../../common/query.model';
import { isUser, userBaseSelect, userRegularSelect, userValidationRule } from '../../common/validators/users.model';

const SELECT_FIELD = ['username', 'nickname', 'mobile', 'email', 'createdAt', 'last_login_ip', 'status', 'needSMScode'];

export default class Users extends Controller {
    /**
     * 创建新用户
     * POST /api/v1/users
     * request body
     * [description]
     */
    public async create() {
        const { app, ctx } = this;
        const invalid = app.validator.validate(userValidationRule, ctx.request.body);
        if (invalid) {
            return ctx.throw(400, `${invalid[0].field} ${invalid[0].message}`, { code: 101001 });
        }

        const user = new ctx.model.AdminUser(ctx.request.body);
        const savedUser = await user.save();

        ctx.body = ctx.helper.successReply(savedUser);
    }

    /**
      * 获取用户信息
      * GET /api/v1/users/:id
      */
    public async show() {
        const { app, ctx, config } = this;
        const invalid = app.validator.validate({ id: 'ObjectId' }, ctx.params);
        if (invalid) {
            ctx.throw(400);
        }

        const user = await ctx.model.AdminUser.findOne({ _id: ctx.params.id }).select(SELECT_FIELD);

        if (!user) {
            ctx.throw(404);
        }

        this.ctx.body = this.ctx.helper.successReply(user);
    }

    /**
     * 修改用户信息
     * PUT /api/v1/users/:id
     */
    public async update() {
        const { ctx } = this;
        const invalid = this.app.validator.validate({ id: 'ObjectId' }, ctx.params);
        if (invalid) {
            ctx.throw(400);
        }
        const conditions = { _id: ctx.params.id };
        const update = { $set: ctx.request.body };
        await ctx.model.AdminUser.update(conditions, update, {});
        this.ctx.body = this.ctx.helper.successReply({});
    }

    /**
     * 列举用户信息
     * GET /api/v1/users{?page,size,order,sort,nickName}
     */
    public async index() {
        const { app, ctx } = this;
        const type = ctx.query.type || 0;
        const query = ctx.query;

        const conditions = { isDeleted: false }; // 查询条件

        if (ctx.query.nickName) {
            conditions['nickName'] = query.nickName;
            delete query['nickName'];
        }

        if (query['page']) query['page'] = parseInt(query['page']);
        if (query['size']) query['size'] = parseInt(query['size']);
        let listQuery = ctx.model.AdminUser.find(conditions).select(SELECT_FIELD);

        const queriesInvalid = app.validator.validate(queryValidationRule, query);
        const queries: Relationship.Query = queriesInvalid ? defaultQuery() : query;
        listQuery = pagedQuery(listQuery, queries);

        let result = await listQuery;
        let count = await this.ctx.model.AdminUser.find(conditions).count();
        this.ctx.body = this.ctx.helper.successReply({ docs: result, count });
    }
}