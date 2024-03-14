import service from '../../api/axios';

export const getList = (data) =>
    service({
        url: '/extract/list',
        method: 'get',
        data: data,
    });
export const add = (data) =>
    service({
        url: '/extract/add',
        method: 'post',
        data: data,
    });
export const getInfo = (data) =>
    service({
        url: '/extract/info',
        method: 'post',
        data: data,
    });
export const dele = (data) =>
    service({
        url: '/extract/delete',
        method: 'post',
        data: data,
    });

export const update = (data) =>
    service({
        url: '/extract/update',
        method: 'post',
        data: data,
    });
