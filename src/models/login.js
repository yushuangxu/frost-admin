import service from '../../api/axios';

export const login = (data) => service({
    url: '/user/login',
    method: 'post',
    data: data,
})