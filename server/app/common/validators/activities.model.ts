/*
 * @Author: cuiweiqiang
 * @Date:   2018-02-05 17:30:23
 * @Last Modified by:   cuiweiqiang
 * @Last Modified time: 2018-02-09 11:12:23
 */
/**
 * 活动信息校验
 */
export const activityValidationRule = {
    activityName: {
        type: 'string',
        required: true
    },
    activityDescription: {
        type: 'string',
        required: false,
        allowEmpty: true
    },
    activityImg: {
        type: 'string',
        required: true
    },
    activeGame: {
        type: 'string',
        required: true
    },
    activeModel: [1, 2],
    jumpLink: {
        type: 'string',
        required: false,
        allowEmpty: true
    },

    startAt: {
        type: 'string',
        format: /^\d{4}\-\d{2}\-\d{2} \d{2}:\d{2}$/,
        required: true
    },
    endAt: {
        type: 'string',
        format: /^\d{4}\-\d{2}\-\d{2} \d{2}:\d{2}$/,
        required: true
    },
};

export const activityField = [
    'activityName',
    'activityDescription',
    'activityImg',
    'activeGame',
    'activeModel',
    'jumpLink',
    'subscript',
    'startAt',
    'endAt'
];

