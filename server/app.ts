/*
 * @Author: cuiweiqiang
 * @Date:   2018-02-02 11:11:45
 * @Last Modified by:   cuiweiqiang
 * @Last Modified time: 2018-02-07 17:54:44
 */

import { Application } from 'egg';
import Redis = require('ioredis');

export default (app: Application) => {
    app.validator.addRule('ObjectId', /^[0-9a-fA-F]{24}$/);
    app.beforeStart(async () => {
        const redisConfig = await app.config.redis;
        app.redis = new Redis(Object.assign(redisConfig, {
            retryStrategy: (times) => {
                return Math.min(times * 50, 2000);
            }
        }));
    });
};
