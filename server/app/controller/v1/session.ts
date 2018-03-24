/*
 * @Author: cuiweiqiang
 * @Date:   2018-02-03 12:03:00
 * @Last Modified by:   cuiweiqiang
 * @Last Modified time: 2018-03-05 16:07:37
 */

// 登录验证相关
import * as _ from 'lodash';
import { Controller } from 'egg';
import { generate } from 'shortid';
import * as svgCaptcha from 'svg-captcha';
import * as moment from 'moment';

import { smsField, smsValidationRule } from '../../common/validators/sms.model';

const SELECT_FIELD = ['_id', 'username', 'nickname', 'mobile', 'email', 'createdAt', 'last_login_time', 'last_login_ip', 'status'];

async function verifyCaptcha(ctx, shortId, text) {
    let captcha = await ctx.app.redis.get(shortId);
    return text.toLowerCase() === captcha.toLowerCase();
}

function isNeedVerifyMobile(user, currentIP) {
    let result = true;

    if (user.bindMobile
        && !user.firstLogin
        && (currentIP == user.last_login_ip)
        && (Date.now() - user.last_login_time < (7 * 24 * 60 * 60 * 1000))
    ) {
        result = false;
    }

    return result;
}

export default class Common extends Controller {
    /**
     * 获取验证码
     * GET /api/v1/captcha
     */
    public async getCaptcha(ctx) {
        const c = svgCaptcha.create({
            ignoreChars: '01oOiIlLzZ',
            noise: 2,
            background: '#11eeee'
        });

        const shortId = generate();

        ctx.app.redis.set(shortId, c.text);
        ctx.body = {
            id: shortId,
            data: encodeURIComponent(c.data)
        };
    };

    public async changePasswd(ctx) {
        let { password, newPassword } = ctx.request.body;

        ctx.assert(newPassword && password, 400, '缺少参数', { code: 101001 });

        let user = await ctx.model.AdminUser.findById(ctx.request.uid);

        if (!user) {
            ctx.throw(500, '服务器繁忙，请稍后再试');
        }

        let [error, isMatch] = await user.comparePassword(password);

        if (error) {
            ctx.throw(500, '服务器繁忙，请稍后再试');
        }

        if (!isMatch) {
            ctx.throw(400, '原密码错误，请检查');
        }

        user.password = newPassword;

        await user.save();

        ctx.body = ctx.helper.successReply();
    }

    /**
     * 登录
     * POST /api/v1/login
     */
    public async login(ctx) {
        let { username, password, captchaId, captcha } = ctx.request.body;

        ctx.assert(
            captchaId && captcha && await verifyCaptcha(ctx, captchaId, captcha),
            400, '验证码错误', { code: 101002 }
        );

        ctx.assert(username && password, 400, '缺少用户名或密码', { code: 101001 });

        let query = { username };

        let [err, user] = await ctx.model.AdminUser.getAuthenticated(query, password, 'comparePassword', ctx.request.ip);
        if (err) {
            ctx.throw(404, err, { code: 101003 });
        }

        let reason = [];
        if (!user.bindMobile) {
            reason.push('未绑定手机');
        }

        if (user.firstLogin) {
            reason.push('第一次登陆');
        }

        if (ctx.request.ip != user.pre_last_login_ip) {
            reason.push('登录IP发生变化');
        }

        if (Date.now() - user.last_login_time > (7 * 24 * 60 * 60 * 1000)) {
            reason.push('未登录时间过长');
        }

        user.reason = reason;
        user.needVerifyMobile = isNeedVerifyMobile(user, ctx.request.ip);

        const jwtStr = ctx.helper.jwtHelper.createJwt(_.pick(user, [...SELECT_FIELD, 'needVerifyMobile', 'reason']), ctx.app.config.jwtAuth.privateKey, '');

        ctx.cookies.set(ctx.app.config.jwtAuth.cookieName, jwtStr, {
            httpOnly: false,
            // domain: 'freelog.com',
            overwrite: true,
            expires: moment().add(1, 'days').toDate()
        })

        ctx.body = ctx.helper.successReply(_.pick(user, [...SELECT_FIELD, 'needVerifyMobile']));
    }

    /**
     * 登录后的手机验证
     * POST /api/v1/login/verifyMobile
     * [needVerifyMobile description]
     */
    public async needVerifyMobile() {
        let { mobile, code } = this.ctx.request.body as any;
        const invalid = this.app.validator.validate(smsValidationRule, { mobile });

        if (invalid) {
            return this.ctx.throw(400, `${invalid[0].field} ${invalid[0].message}`, { code: 106001 });
        }

        let [smsVerifyResult, err] = await this.service.sms.auth(mobile, code);

        if (smsVerifyResult) {
            let jwtString = this.ctx.cookies.get('authInfo')

            if (!jwtString) {
                return this.ctx.throw(401, '登录已经过期，请重新登录');
            }

            let verifyResult = this.ctx.helper.jwtHelper.verifyJwt(jwtString, this.ctx.app.config.jwtAuth.publicKey);

            if (!verifyResult.isVerify) {
                return this.ctx.throw(401, '登录已经过期，请重新登录');
            }

            let user = await this.ctx.model.AdminUser.findById(verifyResult.payLoad._id);
            user.bindMobile = true;
            user.firstLogin = false;
            user.needSMScode = false;
            user.mobile = mobile;
            await user.save();

            user = user.toJSON();
            user.needVerifyMobile = false;

            const jwtStr = this.ctx.helper.jwtHelper.createJwt(_.pick(user, [...SELECT_FIELD, 'needVerifyMobile']), this.ctx.app.config.jwtAuth.privateKey, '');

            this.ctx.cookies.set(this.ctx.app.config.jwtAuth.cookieName, jwtStr, {
                httpOnly: false,
                // domain: 'freelog.com',
                overwrite: true,
                expires: moment().add(1, 'days').toDate()
            })

            this.ctx.body = this.ctx.helper.successReply(_.pick(user, [...SELECT_FIELD, 'needVerifyMobile']));
            this.ctx.body = this.ctx.helper.successReply({});
        } else {
            this.ctx.throw(400, err, { code: 106005 });
        }

    }

    /**
     * 注销
     * POST /api/v1/logout
     */
    public async logout(ctx) {
        ctx.cookies.set(ctx.app.config.jwtAuth.cookieName, null, {
            // domain: 'freelog.com'
        });
        ctx.status = 200;
        ctx.body = 'POST /api/v1/logout'
    }
}
