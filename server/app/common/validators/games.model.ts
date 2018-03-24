/*
 * @Author: cuiweiqiang
 * @Date:   2018-02-05 17:30:23
 * @Last Modified by:   cuiweiqiang
 * @Last Modified time: 2018-02-06 17:18:12
 */

/**
 * 游戏信息校验
 */
export const gameValidationRule = {
    gameId: {
        type: 'string',
        required: true
    },
    gameName: {
        type: 'string',
        required: true
    }
};

export const gameField = [
    'gameId',
    'gameName'
];
