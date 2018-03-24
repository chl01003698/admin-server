/*
 * @Author: cuiweiqiang
 * @Date:   2018-02-06 11:41:11
 * @Last Modified by:   cuiweiqiang
 * @Last Modified time: 2018-03-01 14:34:58
 */
import { createReadStream } from 'fs';
import { Controller } from 'egg'

const permissions = [{ "level": 1, "order": 1, "permissionFlag": 101, "descresption": "首页", "path": "/api/v1/" },
{ "level": 1, "order": 2, "permissionFlag": 102, "descresption": "权限管理" },
{ "level": 2, "order": 1, "permissionFlag": 10201, "descresption": "权限列表" },
{ "level": 2, "order": 2, "permissionFlag": 10202, "descresption": "管理员管理", "path": "/api/v1/users" },
{ "level": 2, "order": 3, "permissionFlag": 10203, "descresption": "用户组管理", "path": "/api/v1/groups" },
{ "level": 1, "order": 3, "permissionFlag": 103, "descresption": "游戏管理" },
{ "level": 2, "order": 1, "permissionFlag": 10301, "descresption": "参数列表", "path": "/api/v1/parameters" },
{ "level": 2, "order": 2, "permissionFlag": 10302, "descresption": "活动管理", "path": "/api/v1/activities" },
{ "level": 2, "order": 3, "permissionFlag": 10303, "descresption": "广播管理", "path": "/api/v1/broadcasts" },
{ "level": 2, "order": 4, "permissionFlag": 10304, "descresption": "消息管理", "path": "/api/v1/messages" },
{ "level": 2, "order": 5, "permissionFlag": 10305, "descresption": "装修管理", "path": "/api/v1/decorations" },
{ "level": 2, "order": 6, "permissionFlag": 10306, "descresption": "游戏管理", "path": "/api/v1/games" },
{ "level": 2, "order": 7, "permissionFlag": 10307, "descresption": "玩家列表", "path": "/api/v1/players" },
{ "level": 2, "order": 8, "permissionFlag": 10308, "descresption": "角标管理", "path": "/api/v1/subscripts" }];

class HomeController extends Controller {
    async index() {
        // const user = new this.ctx.model.AdminUser({ username: 'admin', password: '123456' });
        // await user.save();
        this.ctx.body = 'hi, egg';

        // permissions.forEach(async i => {
        //     let tmp = new this.ctx.model.AdminPermission(i);
        //     await tmp.save()
        // })
    }

    async doc() {
        if (this.app.env == 'prod') {
            this.ctx.status = 404;
        } else {
            this.ctx.type = 'html';
            this.ctx.body = await createReadStream(__dirname + '/../public/api.html');
        }
    }
}

module.exports = HomeController;
