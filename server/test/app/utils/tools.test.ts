/*
 * @Author: cuiweiqiang
 * @Date:   2018-02-06 20:34:39
 * @Last Modified by:   cuiweiqiang
 * @Last Modified time: 2018-02-06 20:59:17
 */
import * as assert from 'assert';

import { hashPassword, comparePasswords } from '../../../app/utils/tools';
describe('工具模块', () => {
    it('密码加密', async () => {
        assert.ok(await hashPassword('123456'));
    });

    it('密码比较', async () => {
        assert.equal(true, await comparePasswords('123456', '$2a$10$PqQUxbQ.Ih5AZFRDC6W1buurfcICGLF2WA6VrUUxMWsbq.GeUZ1Da'));
    });
});