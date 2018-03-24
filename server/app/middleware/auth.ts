/*
 * @Author: cuiweiqiang
 * @Date:   2018-02-03 15:52:01
 * @Last Modified by:   cuiweiqiang
 * @Last Modified time: 2018-03-05 15:56:24
 */
import { Application, Context } from 'egg';

export default (option, app: Application) => {
    return async function auth(ctx: Context, next): Promise<void> {
        let jwtStr = ctx.cookies.get('authInfo')

        if (!jwtStr) {
            return ctx.throw(401, '登录已经过期，请重新登录');
        }

        let verifyResult = ctx.helper.jwtHelper.verifyJwt(jwtStr, ctx.app.config.jwtAuth.publicKey);

        if (!verifyResult.isVerify) {
            return ctx.throw(401, '登录已经过期，请重新登录');
        }

        ctx.request.uid = verifyResult.payLoad._id;

        let path = ctx.request.path;
        if (ctx.request.path[ctx.request.path.length - 1] == '/') {
            path = path.substring(0, path.length - 1);
        }
        if (/\/api\/v1\/sms\//.test(path) || /\/api\/v1\/login\/verifyMobile/.test(path)) {
            return await next();
        }
        if (verifyResult.payLoad.needVerifyMobile) {
            return ctx.throw(403, JSON.stringify(verifyResult.payLoad.reason), { code: 500403 });
        }

        await next();
    };
};