/*
 * @Author: cuiweiqiang
 * @Date:   2018-02-06 21:01:02
 * @Last Modified by:   cuiweiqiang
 * @Last Modified time: 2018-02-07 15:27:30
 */
import * as assert from 'assert';
import mock from 'egg-mock';

describe('根目录测试', () => {
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

    it('should status 200 and get the body', () => {
        // 对 app 发起 `GET /` 请求
        return app.httpRequest()
            .get('/')
            .expect(500);
    });
});