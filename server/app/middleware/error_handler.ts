/*
 * @Author: cuiweiqiang
 * @Date:   2018-02-02 20:05:35
 * @Last Modified by:   cuiweiqiang
 * @Last Modified time: 2018-02-06 12:34:45
 */

import { Application, Context } from 'egg';

export default (option, app: Application) => {
    return async function errHandler(ctx: Context, next): Promise<void> {
        try {
            await next();
        } catch (err) {
            // 所有的异常都在 app 上触发一个 error 事件，框架会记录一条错误日志
            app.emit('error', err, this);

            ctx.status = err.status || 500;

            const message = (ctx.status === 500) && (app.config.env === 'prod')
                ? 'Internal Server Error'
                : err.message;

            ctx.body = {
                status: {
                    code: err.code || 'unknow',
                    message
                }
            };
        }
    };
};
