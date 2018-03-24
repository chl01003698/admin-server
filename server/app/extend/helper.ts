/*
 * @Author: cuiweiqiang
 * @Date:   2018-02-06 14:57:15
 * @Last Modified by:   cuiweiqiang
 * @Last Modified time: 2018-03-01 15:53:43
 */
import jwtHelper from './helper/jwt_helper';
function removeEmpty(obj: Object) {
    Object.entries(obj).forEach(([key, val]) => {
        if (val && typeof val === 'object') {
            removeEmpty(val)
        } else if (val == null) {
            delete obj[key]
        }
    });
}


export default {
    successReply(data: any): Object {
        return {
            'status': {
                'code': 0,
                'message': 'success'
            },
            data,
        }
    },
    removeEmpty,
    jwtHelper
}