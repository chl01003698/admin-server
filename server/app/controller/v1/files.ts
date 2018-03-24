/*
 * @Author: cuiweiqiang
 * @Date:   2018-02-08 19:10:54
 * @Last Modified by:   cuiweiqiang
 * @Last Modified time: 2018-02-09 11:27:20
 */
import { v4 } from 'uuid';
import { Controller } from 'egg';
import * as sendToWormhole from 'stream-wormhole';

export default class Files extends Controller {
    public async uploadImage() {
        const parts = this.ctx.multipart({ autoFields: true });
        let stream;
        let result;
        while ((stream = await parts()) != null) {
            const filename = v4();
            try {
                result = await this.ctx.oss.put(filename, stream);
            } catch (err) {
                await sendToWormhole(stream);
                throw err;
            }
        }

        this.ctx.body = this.ctx.helper.successReply({
            url: result.url
        });
    }

    public async downloadImage() {
        const url = this.ctx.query.imgUrl.replace("http://chess-admin.oss-cn-beijing.aliyuncs.com/",'');;
        if (!url) {
            this.ctx.throw(400, 'imgUrl 参数不能为空', { code: 113001 });
        }

        let response;
        try {
            response = await this.ctx.oss.getStream(url);
        } catch (err) {
            if (err.status == 404) {
                this.ctx.throw(404, '图片未找到', { code: 113002 });
            } else {
                this.ctx.throw(500, '图片服务繁忙，请稍后再试', { code: 513002 });
            }
        }

        this.ctx.type = 'jpg';
        this.ctx.body = response.stream;
    }
}