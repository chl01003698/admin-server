/*
 * @Author: cuiweiqiang
 * @Date:   2018-02-05 17:23:43
 * @Last Modified by:   cuiweiqiang
 * @Last Modified time: 2018-02-09 14:20:57
 */
// 游戏管理
import * as _ from 'lodash';
import { Controller } from 'egg';
import { gameField, gameValidationRule } from '../../common/validators/games.model';
import { defaultQuery, pagedQuery, queryValidationRule } from '../../common/query.model';

export default class Games extends Controller {
    /**
     * 添加游戏
     * POST /api/v1/game
     */
    public async create() {
        const invalid = this.app.validator.validate(gameValidationRule, this.ctx.request.body);

        if (invalid) {
            return this.ctx.throw(400, `${invalid[0].field} ${invalid[0].message}`, { code: 110001 });
        }
        const [game, error] = await this.service.game.create(this.ctx.request.body);

        if (error) {
            if (error.code == 11000) {
                return this.ctx.throw(400, '游戏ID重复', { code: 110002 });
            }
            return this.ctx.throw(500, '服务器繁忙请稍后再试', { code: 5100001 });
        }

        this.ctx.body = this.ctx.helper.successReply(game);
    }

    /**
     * 根据ID获取游戏
     * GET /api/v1/game/:id
     */
    public async show() {
        const invalid = this.app.validator.validate({ id: 'ObjectId' }, this.ctx.params);
        if (invalid) {
            return this.ctx.throw(400, `${invalid[0].field} ${invalid[0].message}`, { code: 110001 });
        }
        const [game, error] = await this.service.game.show(this.ctx.params.id);

        if (error) {
            return this.ctx.throw(500, '服务器繁忙请稍后再试', { code: 5100002 });
        }

        if (!game) {
            return this.ctx.throw(404, '未找到游戏', { code: 110003 });
        }

        this.ctx.body = this.ctx.helper.successReply(game);
    }

    /**
     * 根据ID更新游戏
     * PUT /api/v1/game/:id
     */
    public async update() {
        const invalid = this.app.validator.validate({ id: 'ObjectId' }, this.ctx.params);
        if (invalid) {
            return this.ctx.throw(400, `${invalid[0].field} ${invalid[0].message}`, { code: 110001 });
        }

        const update = { $set: _.pick(this.ctx.request.body, gameField) };

        if (_.isEmpty(update['$set'])) {
            return this.ctx.throw(400, '缺少更新参数', { code: 110004 });
        }

        const conditions = { _id: this.ctx.params.id };
        const [game, error] = await this.service.game.update(conditions, update);

        if (error) {
            return this.ctx.throw(500, '服务器繁忙请稍后再试', { code: 5100003 });
        }

        if (!game) {
            return this.ctx.throw(404, '未找到游戏', { code: 110005 });
        }

        this.ctx.body = this.ctx.helper.successReply(game);
    }

    /**
     * 列举游戏列表
     * GET /api/v1/games{?page,size,order,sort}
     */
    public async index() {
        const query = this.ctx.query;

        const conditions = { isDeleted: false }; // 查询条件

        if (query['page']) query['page'] = parseInt(query['page']);
        if (query['size']) query['size'] = parseInt(query['size']);

        const queriesInvalid = this.app.validator.validate(queryValidationRule, query);

        if (queriesInvalid) {
            return this.ctx.throw(400, `${queriesInvalid[0].field} ${queriesInvalid[0].message}`, { code: 110006 });
        }

        let listQuery = this.ctx.model.AdminGame.find(conditions);
        const queries: Relationship.Query = queriesInvalid ? defaultQuery() : query;
        listQuery = pagedQuery(listQuery, queries);

        let result = await listQuery;
        let count = await this.ctx.model.AdminGame.find(conditions).count();
        this.ctx.body = this.ctx.helper.successReply({ docs: result, count });
    }

    /**
     * 根据ID删除游戏
     * PUT /api/v1/game/:id
     */
    public async del() {
        const invalid = this.app.validator.validate({ id: 'ObjectId' }, this.ctx.params);
        if (invalid) {
            return this.ctx.throw(400, `${invalid[0].field} ${invalid[0].message}`, { code: 102001 });
        }

        const update = { $set: { isDeleted: true } };
        const conditions = { _id: this.ctx.params.id };

        const [game, error] = await this.service.game.update(conditions, update);

        if (error) {
            return this.ctx.throw(500, '服务器繁忙请稍后再试', { code: 5020003 });
        }

        if (!game) {
            return this.ctx.throw(404, '未找到用户组', { code: 102002 });
        }

        this.ctx.body = this.ctx.helper.successReply(conditions);
    }
}