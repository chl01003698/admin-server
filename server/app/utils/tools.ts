/*
 * @Author: cuiweiqiang
 * @Date:   2018-02-03 15:16:34
 * @Last Modified by:   cuiweiqiang
 * @Last Modified time: 2018-02-06 11:36:32
 */
const bcrypt = require('bcryptjs');

export async function hashPassword(password: string) {
    try {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    } catch (error) {
        console.log(error);
        // throw new Error('Hashing failed', error);
    }
};


export async function comparePasswords(inputPassword: string, hashedPassword: string) {
    try {
        return await bcrypt.compare(inputPassword, hashedPassword);
    } catch (error) {
        console.log(error);
        // throw new Error('Comparing failed', error);
    }
};