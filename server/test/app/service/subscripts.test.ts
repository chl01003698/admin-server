/*
 * @Author: cuiweiqiang
 * @Date:   2018-02-06 21:11:18
 * @Last Modified by:   cuiweiqiang
 * @Last Modified time: 2018-02-06 21:29:28
 */
import * as assert from 'assert';
import mock from 'egg-mock';

describe('[服务层测试] 角标服务测试', () => {
    let app;

    before(() => {
        // 创建当前应用的 app 实例
        app = mock.app();
        // 等待 app 启动成功，才能执行测试用例
        return app.ready();
    });

    it('获取 ctx 对象', () => {
        const ctx = app.mockContext();
        assert(ctx.method === 'GET');
        assert(ctx.url === '/');
    });
});