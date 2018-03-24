/*
 * @Author: cuiweiqiang
 * @Date:   2018-03-02 10:46:59
 * @Last Modified by:   cuiweiqiang
 * @Last Modified time: 2018-03-03 17:52:12
 */
import { Service, Context } from 'egg';

export default class GroupPermission extends Service {
    constructor(ctx: Context) {
        super(ctx);
    }

    /**
     * [create description]
     * @param {[Object]} data [{gid, permissions:[]}]
     */
    async create(data) {
        let { gid, permissions } = data;

        let permission = [];

        for (let i = permissions.length; i--;) {
            let tmp = await this.ctx.model.AdminPermission.findById(permissions[i]);
            if (!tmp) {
                return [, `permission[${permissions[i]}] not exist`];
            }
            permission.push(tmp)
        };

        let agp = await this.ctx.model.AdminGroupPermission.findOne({ group: gid });

        if (agp) {
            await this.ctx.model.AdminGroupPermission.update({ group: gid }, { $set: { permission } }, {});
        } else {
            await (new this.ctx.model.AdminGroupPermission({ group: gid, permission })).save();
        }

        return [true, null];
    }

    async createByFlag(data) {
        let { gid, permissions } = data;

        let permission;

        for (let i = permissions.length; i--;) {
            let tmp = await this.ctx.model.AdminPermission.findByFlag(permissions[i]);
            if (!tmp) {
                return [, `permission[${permissions[i]}] not exist`];
            }
            permission.push(permissions[i])
        };

        await (new this.ctx.model.AdminGroupPermission({ group: gid, permission })).save();

        return [true, null];
    }

    async show(group) {
        const groupPermission = await this.ctx.model.AdminGroupPermission.findOne({ group }).populate('permission');
        return [(groupPermission && groupPermission.permission) || [], null];
    }

    async update(cond, updates) {
        try {
            const groupPermission = await this.ctx.model.AdminGroupPermission.update(cond, updates, {});
            return [groupPermission, null];
        } catch (err) {
            this.ctx.logger.error(err);
            return [null, err]
        }
    }
}