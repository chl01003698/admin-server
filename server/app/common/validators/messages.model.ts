/*
 * @Author: cuiweiqiang
 * @Date:   2018-02-05 17:30:23
 * @Last Modified by:   cuiweiqiang
 * @Last Modified time: 2018-02-26 16:19:39
 */

/**
 * 消息信息校验
 */
export const messageValidationRule = {
    type: [0, 1],  // 0: 系统，1: 个人

    title: 'string',     // 邮件标题
    btnTitle: 'string',      // 按钮标题
    subtitle: 'string',      // 副标题
    content: {
        type: 'string',
        allowEmpty: true
    },  // 邮件内容
    items: {
        type: 'array',
        itemType: 'object',
        required: false,
        rule: {
            type: [0, 1], // 0: 货币, 1: 物品
            itemId: 'string', // 货币类型或则物品ID
            count: 'number',  // 货币数量或则物品数量
        }
    },

    // weight: 'number',  // 邮件优先级权重, 越高越优先展示

    timing: {
        required: false,
        type: 'boolean',
        allowEmpty: true
    },
    date: {
        type: 'string',
        format: /^\d{4}\-\d{2}\-\d{2} \d{2}:\d{2}$/,
        required: false
    }
};

export const messageField = [
    'type',
    'sender',
    'to',
    'title',
    'btnTitle',
    'subtitle',
    'content',
    'items',
    'weight',
    'timing',
    'date'
];
