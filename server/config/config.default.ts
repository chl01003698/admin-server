/*
 * @Author: cuiweiqiang
 * @Date:   2018-02-02 11:22:41
 * @Last Modified by:   cuiweiqiang
 * @Last Modified time: 2018-03-01 16:15:33
 */
import * as fs from 'fs';
import { EggAppConfig } from 'egg';

export interface Default {
    /**
     * token加解密
     */
    tokenSecret: string;
    keys: string;

    security: {
        csrf: {
            enable: boolean;
        },
    };

    jwtAuth: {
        cookieName: string;
        privateKey: string;
        publicKey: string;
    },

    sms: {
        key: string,
        minutes: number,
        template: string,
        registerTemplate: string,
    },

    oss: {
        client: {
            accessKeyId: string,
            accessKeySecret: string,
            bucket: string,
            endpoint: string,
            // timeout: string,
        },
    };

    multipart: {
        fileExtensions: Array<string>,
    };

}

export default (appInfo: EggAppConfig): Default => {
    return {
        keys: appInfo.name + 'd83a1518140cea42b52a92cf80d4f733',
        tokenSecret: '',
        security: {
            csrf: {
                enable: false,
            },
        },

        jwtAuth: {
            cookieName: 'authInfo',
            privateKey: fs.readFileSync(__dirname + '/auth_key/private_key.pem').toString(),
            publicKey: fs.readFileSync(__dirname + '/auth_key/public_key.pem').toString()
        },

        sms: {
            key: 'b38226f48679c7eab0cd6835cab0f0fc',
            minutes: 1,
            template: '【369互娱】您的手机验证码是#code#',
            registerTemplate: '',
        },

        oss: {
            client: {
                accessKeyId: 'LTAIwSBscf6NZLWJ',
                accessKeySecret: 'KeVFLSLa2iqFCW1DXGVS340xoybh48',
                bucket: 'chess-admin',
                endpoint: 'oss-cn-beijing.aliyuncs.com',
                // timeout: '60s',
            },
        },

        multipart: {
            fileExtensions: ['.jpg', '.jpeg', '.png'],
        },
    };
};