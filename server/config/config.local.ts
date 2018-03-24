/*
 * @Author: cuiweiqiang
 * @Date:   2018-02-02 20:12:13
 * @Last Modified by:   cuiweiqiang
 * @Last Modified time: 2018-02-28 17:28:49
 */
import { EggAppConfig } from 'egg';

export interface Local {
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
    security: {
        domainWhiteList: Array<string>
    };
    cors: {
        origin: string,
        allowMethods: string
    }

}

export default (appInfo: EggAppConfig): Local => {
    return {
        middleware: ['errorHandler', 'notfoundHandler'],
        mongoose: {
            url: 'mongodb://127.0.0.1:27017/test1',
            option: {},
        },
        redis: {
            host: '127.0.0.1',
            port: 6379,
            db: 0,
        },

        security: {
            domainWhiteList: ['http://127.0.0.1'],
        },
        cors: {
            origin: '*',
            allowMethods: 'GET,HEAD,PUT,POST,DELETE,OPTIONS'
        }
    };
};

exports.middleware = ['auth'];