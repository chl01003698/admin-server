/*
 * @Author: cuiweiqiang
 * @Date:   2018-02-02 20:55:41
 * @Last Modified by:   cuiweiqiang
 * @Last Modified time: 2018-02-06 20:49:12
 */
import { EggAppConfig } from 'egg';

export interface UnitTest {
    middleware: string[];
    mongoose: {
        url: string;
        option: object;
    };
    redis: {
        host: string;
        port: number;
        db: number;
    },
}

export default (appInfo: EggAppConfig): UnitTest => {
    return {
        middleware: ['errorHandler', 'notfoundHandler'],
        mongoose: {
            url: 'mongodb://127.0.0.1:27017/test1',
            option: {},
        },
        redis: {
            host: '127.0.0.1',
            port: 6379,
            db: 1
        },
    };
};

exports.middleware = ['auth'];