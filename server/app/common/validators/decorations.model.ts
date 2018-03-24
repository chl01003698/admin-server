/*
 * @Author: cuiweiqiang
 * @Date:   2018-02-05 17:30:23
 * @Last Modified by:   cuiweiqiang
 * @Last Modified time: 2018-02-06 17:18:04
 */

/**
 * 装修信息校验
 */
export const decorationValidationRule = {
    decorationName: {
        type: 'string',
        required: true
    },
    decorationImg: {
        type: 'string',
        required: true
    }
};

export const decorationField = [
    'decorationName',
    'decorationImg'
];