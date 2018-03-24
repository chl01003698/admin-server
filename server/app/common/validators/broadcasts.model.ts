/*
 * @Author: cuiweiqiang
 * @Date:   2018-02-05 17:30:23
 * @Last Modified by:   cuiweiqiang
 * @Last Modified time: 2018-02-09 18:16:13
 */

/**
 * 广播信息校验
 */
export const broadcastValidationRule = {
    broadcastName: {
        type: 'string',
        required: true
    },
    content: {
        type: 'string',
        required: true
    },
    type: [1, 2], // 1. 系统； 2.大厅
    activeGame: {
        type: 'string',
        required: true
    },
    activeModel: [1, 2], // 1: 积分赛，2: 好友局

    startAt: {
        type: 'string',
        format: /^\d{4}\-\d{2}\-\d{2} \d{2}:\d{2}$/,
        required: true
    },
    endAt: {
        type: 'string',
        format: /^\d{4}\-\d{2}\-\d{2} \d{2}:\d{2}$/,
        required: true
    }
};

export const broadcastField = [
    'broadcastName',
    'content',
    'type',
    'activeGame',
    'activeModel',
    'startAt',
    'endAt'
];