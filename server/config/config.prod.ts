/*
 * @Author: cuiweiqiang
 * @Date:   2018-02-02 20:13:22
 * @Last Modified by:   cuiweiqiang
 * @Last Modified time: 2018-03-01 17:05:24
 */
import { EggAppConfig } from 'egg';

export interface Prod {
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

export default (appInfo: EggAppConfig): Prod => {
    let momgo_url = 'mongodb://127.0.0.1:27017/test1';
    let redis_host = '127.0.0.1';

    if (process.env['MONGODB']) {
        momgo_url = process.env['MONGODB'];
    }

    if (process.env['REDIS_HOST']) {
        redis_host = process.env['REDIS_HOST'];
    }

    return {
        middleware: ['errorHandler', 'notfoundHandler'],
        mongoose: {
            url: momgo_url,
            option: {},
        },
        redis: {
            host: redis_host,
            port: 6379,
            db: 1,
        },
    };
};

exports.middleware = ['auth'];