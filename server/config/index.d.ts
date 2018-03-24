/*
 * @Author: cuiweiqiang
 * @Date:   2018-02-02 20:12:38
 * @Last Modified by:   cuiweiqiang
 * @Last Modified time: 2018-03-01 16:33:55
 */
import { Context, EggAppConfig, Service } from 'egg';
import { Mongoose } from 'mongoose';
import { Default } from './config.default'
import { Local } from './config.local'
import { Prod } from './config.prod'
import { UnitTest } from './config.unittest'
import { SuperTest, Test } from 'supertest';

declare module 'egg' {
    export interface Application {
        validator: {
            validate: (rule: object | string, obj: object) => object | void;
            addRule: (ruleName: string, rule: objetc | RegExp) => void;
        };
        lru: lru;
        redis: redis;
        mongoose: Mongoose;
        config: IAppConfig;
        jwt: jwt;
    }

    export interface Controller {
        config: IAppConfig;
    }

    export interface Service {
        config: IAppConfig;
    }

    export interface Context {
        model: IModel;
    }

    export interface IModel { }
    export type LocalConfig = EggAppConfig & Default & Local;
    export type ProdConfig = EggAppConfig & Default & Prod;
    export type UnitTestConfig = EggAppConfig & Default & UnitTest;
    export type IAppConfig = LocalConfig | ProdConfig | UnitTestConfig;
}
