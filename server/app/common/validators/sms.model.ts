/*
 * @Author: cuiweiqiang
 * @Date:   2018-02-05 17:30:23
 * @Last Modified by:   cuiweiqiang
 * @Last Modified time: 2018-02-07 16:36:42
 */
/**
 * 手机验证码信息校验
 */
export const smsValidationRule = {
    mobile: {
        type: 'string',
        format: /^1[3|4|5|7|8][0-9]\d{4,8}$/,
        max: 11,
        min: 11
    },
    code: {
        type: 'string',
        required: false
    }
};

export const smsField = [
    'mobile',
    'code'
];
