/*
 * @Author: cuiweiqiang
 * @Date:   2018-02-05 18:17:09
 * @Last Modified by:   cuiweiqiang
 * @Last Modified time: 2018-02-07 16:36:39
 */

/**
 * 游戏角标信息校验
 */
export const subscriptValidationRule = {
    subscriptName: {
        type: 'string',
        required: true
    },
    subscriptImg: {
        type: 'string',
        required: true
    },
};

export const subscriptField = [
    'subscriptName',
    'subscriptImg'
];