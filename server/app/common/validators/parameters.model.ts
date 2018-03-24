/*
 * @Author: cuiweiqiang
 * @Date:   2018-02-05 17:30:23
 * @Last Modified by:   cuiweiqiang
 * @Last Modified time: 2018-02-08 11:49:37
 */

/**
 * 游戏参数信息校验
 */
export const parameterValidationRule = {
    // parameterName: {
    //     type: 'string',
    //     required: true
    // },
    // type: [1, 2, 3, 4, 5], // 1:整型, 2:浮点数, 3:字符串, 4:开关, 5:图片
    parameterData: {
        type: 'object'
    },
    description: [1, 2],
    activeGame: {
        type: 'string'
    },

    // startAt: {
    //     type: 'dateTime',
    //     allowEmpty: true
    // },
    // endAt: {
    //     type: 'dateTime',
    //     allowEmpty: true
    // },
};

export const parameterField = [
    'description',
    // 'parameterName',
    'parameterData',
    'activeGame',
    // 'startAt',
    // 'endAt'
];
