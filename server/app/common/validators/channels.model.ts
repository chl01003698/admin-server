/*
 * @Author: cuiweiqiang
 * @Date:   2018-02-05 17:34:41
 * @Last Modified by:   cuiweiqiang
 * @Last Modified time: 2018-02-06 17:17:56
 */

/**
 * 渠道信息校验
 */
export const channelValidationRule = {
    channelId: {
        type: 'string',
        required: true
    },
    channelName: {
        type: 'string',
        required: true
    },
};

export const channelField = [
    'channelId',
    'channelName'
];