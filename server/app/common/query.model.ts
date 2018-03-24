/*
 * @Author: cuiweiqiang
 * @Date:   2018-02-02 19:50:27
 * @Last Modified by:   cuiweiqiang
 * @Last Modified time: 2018-02-11 10:52:45
 */
import { DocumentQuery } from 'mongoose';
import Query = Relationship.Query;
/**
 * 查询字符串信息校验
 */
export const queryValidationRule = {
    page: {
        type: 'int',
        min: 1,
        required: false,
    },
    size: {
        type: 'int',
        min: 1,
        max: 100,
        required: false,
    },
    order: {
        type: 'string',
        required: false,
    },
    sort: {
        type: 'string',
        required: false,
    },
};

export function defaultQuery(): Query {
    return {
        page: 1,
        size: 10,
    };
}

export function pagedQuery(documentQuery: DocumentQuery<any, any>, queries: Query) {
    documentQuery = documentQuery.skip((queries.page - 1) * queries.size).limit(queries.size);
    if (queries.sort) {
        documentQuery = documentQuery.sort({ [queries.sort]: queries.order === 'asc' ? 1 : -1 });
    }
    return documentQuery;
}
