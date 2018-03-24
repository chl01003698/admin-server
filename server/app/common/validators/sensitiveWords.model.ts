/*
 * @Author: cuiweiqiang
 * @Date:   2018-02-05 17:30:23
 * @Last Modified by:   cuiweiqiang
 * @Last Modified time: 2018-02-06 19:42:21
 */

/**
 * 敏感词信息校验
 */
export const sensitiveWordValidationRule = {
    path: {
        type: 'url',
        required: true
    },
};

export const sensitiveWordField = ['path'];