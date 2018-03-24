/*
 * @Author: cuiweiqiang
 * @Date:   2018-02-07 17:53:38
 * @Last Modified by:   cuiweiqiang
 * @Last Modified time: 2018-02-07 17:57:36
 */
const LRU = Symbol('Application#lru');
import * as  LRUCache from 'ylru';

export default {
    get lru() {
        if (!this[LRU]) {
            this[LRU] = new LRUCache(1000);
        }
        return this[LRU];
    },
};