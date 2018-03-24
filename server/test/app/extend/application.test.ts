/*
 * @Author: cuiweiqiang
 * @Date:   2018-02-07 18:07:17
 * @Last Modified by:   cuiweiqiang
 * @Last Modified time: 2018-02-07 18:08:25
 */

import * as assert from 'assert';
import mock from 'egg-mock';

describe('扩展Application测试', () => {
    let app;
    before(() => {
        // 创建当前应用的 app 实例
        app = mock.app();
        // 等待 app 启动成功，才能执行测试用例
        return app.ready();
    });

    it('测试LRU效果', () => {
        // 设置缓存
        app.lru.set('foo', 'bar');
        // 读取缓存
        assert(app.lru.get('foo') === 'bar');
    });
});