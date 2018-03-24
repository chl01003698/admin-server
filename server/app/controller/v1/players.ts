/*
 * @Author: cuiweiqiang
 * @Date:   2018-02-24 15:18:24
 * @Last Modified by:   cuiweiqiang
 * @Last Modified time: 2018-02-24 16:37:56
 */
import * as _ from 'lodash';
import { Controller } from 'egg';
import { defaultQuery, pagedQuery, queryValidationRule } from '../../common/query.model';

const SEARCH_FIELD = ['activityName', 'activeModel', 'status'];

export default class Players extends Controller {

    /**
    * 根据ID获取消息
    * GET /api/v1/player/:id
    */
    public async show() {
        const invalid = this.app.validator.validate({ id: 'ObjectId' }, this.ctx.params);
        if (invalid) {
            return this.ctx.throw(400, `${invalid[0].field} ${invalid[0].player}`, { code: 114001 });
        }
        const [player, error] = await this.service.player.show(this.ctx.params.id);

        if (error) {
            return this.ctx.throw(500, '服务器繁忙请稍后再试', { code: 5140002 });
        }

        if (!player) {
            return this.ctx.throw(404, '未找到玩家', { code: 114002 });
        }

        this.ctx.body = this.ctx.helper.successReply(player);
    }

    public async index() {
        let query = this.ctx.query;

        let conditions = _.pick(query, SEARCH_FIELD);
        this.ctx.helper.removeEmpty(conditions);
        if (_.isEmpty(conditions)) {
            conditions = { agent: { $exists: false }, curator: { $exists: false  }}; // 查询条件
        } else {
            Object.assign(conditions, { agent: { $exists: false }, curator: { $exists: false  }});
        }

        if (query['page']) query['page'] = parseInt(query['page']);
        if (query['size']) query['size'] = parseInt(query['size']);

        const queriesInvalid = this.app.validator.validate(queryValidationRule, query);

        if (queriesInvalid) {
            return this.ctx.throw(400, `${queriesInvalid[0].field} ${queriesInvalid[0].message}`, { code: 110006 });
        }

        let listQuery = this.ctx.model.User.find(conditions);
        const queries: Relationship.Query = queriesInvalid ? defaultQuery() : query;
        listQuery = pagedQuery(listQuery, queries);

        let result = await listQuery;
        let count = await this.ctx.model.User.find(conditions).count();
        this.ctx.body = this.ctx.helper.successReply({ docs: result, count });
    }

    public async lock() { }
}