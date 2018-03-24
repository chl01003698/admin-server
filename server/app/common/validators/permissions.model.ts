/*
 * @Author: cuiweiqiang
 * @Date:   2018-02-05 17:30:23
 * @Last Modified by:   cuiweiqiang
 * @Last Modified time: 2018-02-06 17:15:11
 */

/**
 * 权限信息校验
 */
export const permissionValidationRule = {
    username: { type: 'string', required: true },
    password: { type: 'string', required: true },
    realName: { type: 'string' },
    nickName: { type: 'string' },
    avatar: { type: 'string' },
    type: { type: 'inter', default: 0 }
};

export const permissionField = [];