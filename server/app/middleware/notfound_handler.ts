/*
 * @Author: cuiweiqiang
 * @Date:   2018-02-02 20:07:10
 * @Last Modified by:   cuiweiqiang
 * @Last Modified time: 2018-02-06 11:39:12
 */
import { Application, Context } from 'egg';

export default (option, app: Application) => {
    return async function notfound_handler(ctx: Context, next): Promise<void> {
        await next();
        if (ctx.status === 404 || ctx.realStatus === 404) {
            ctx.throw(404, 'Path Not Found', { code: 1000404 });
        }
    };
};
