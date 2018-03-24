/*
 * @Author: cuiweiqiang
 * @Date:   2018-02-23 18:14:36
 * @Last Modified by:   cuiweiqiang
 * @Last Modified time: 2018-02-24 10:24:12
 */
// import { Subscription } from 'egg';
const Subscription = require('egg').Subscription;

export default  class CheckMail extends Subscription {
    // 通过 schedule 属性来设置定时任务的执行间隔等配置
    static get schedule() {
        return {
            interval: '1m', // 1 分钟间隔
            type: 'all', // 指定所有的 worker 都需要执行
        };
    }

    // subscribe 是真正定时任务执行时被运行的函数
    async subscribe() {
        const res = await this.ctx.curl('http://127.0.0.1:7001', {
            dataType: 'text',
        });
        this.ctx.app.cache = res.data;
    }
}