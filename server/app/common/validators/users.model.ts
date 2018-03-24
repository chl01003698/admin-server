/*
 * @Author: cuiweiqiang
 * @Date:   2018-02-02 19:52:08
 * @Last Modified by:   cuiweiqiang
 * @Last Modified time: 2018-03-03 15:27:30
 */

/**
 * 用户信息校验
 */
export const userValidationRule = {
    username: {
        type: 'string',
        required: true,
        format: /^[a-zA-Z0-9_]*$/,
        max: 12,
        min: 3
    },
    password: {
        type: 'string',
        required: true
    },
    mobile: {
        type: 'string',
        required: false
    },
    email: {
        allowEmpty: true,
        type: 'email'
    },
};

export function isUser(user: Relationship.User): user is Relationship.User {
    return !!(user && (user._id.length > 0) && (user.username.length > 0) && (user.password.length > 0));
}

export const userBaseSelect = () => {
    return {
        _id: 1,
        username: 1,
        password: 1,
    };
};

export const userRegularSelect = () => {
    return {
        _id: 1,
        username: 1,
        password: 1,
        realName: 1,
        nickName: 1,
        avatar: 1,
        type: 1,
    };
};
