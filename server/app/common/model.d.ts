/*
 * @Author: cuiweiqiang
 * @Date:   2018-02-02 19:23:33
 * @Last Modified by:   cuiweiqiang
 * @Last Modified time: 2018-03-05 15:31:31
 */
declare namespace Relationship {
    interface TokenBase {
        iat: number; //生成时间
        exp?: number; //有效期至
        nbf?: number; //开始生效
        aud?: string | number; //接受者
        sub?: string | number; //主题
        iss?: string | number; //来源
    }

    type Token<T> = TokenBase & T;

    interface ModelBase {
        _id: string; //文档id
        createAt: Date; //创建时间
        updateAt: Date; //修改时间
        etag?: () => string; //获取etag值
    }

    interface ModelStatic {
        listEtag?: (list: ModelBase[], extra?: string) => string; //获取列表的etag值
    }

    interface UserBase {
        username: string; //用户名
        password: string; //密码
        realName?: string; //真实姓名
        nickName?: string; //昵称
        avatar?: string; //头像
        userRoleType: number;
        bindMobile: boolean;
        firstLogin: boolean;
        needSMScode: boolean;
        needVerifyMobile: boolean;
        mobile: string;

        type: number; //成员类型 0: 游客 1：正式成员 10：超管

        static async getAuthenticated(query, password: string, compareName: string, clientIp: string);
    }

    type User = ModelBase & UserBase;
    type Starring = ModelBase & StarringBase;
    interface Query {
        page?: number;
        size?: number;
        order?: 'asc' | 'desc';
        sort?: string;
    }
}