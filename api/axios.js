import axios from 'axios';
import { notification } from 'antd';
// import { addPendingRequest, removePendingRequest } from './cancelRepeatRquest';
const baseURL =
    process.env.NODE_ENV === 'development' ? '/api' : 'http://viewer.frost.pub';
const service = axios.create({
    // 联调

    baseURL: baseURL,
    headers: {
        get: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        },
        post: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        },
    },
    // 是否跨站点访问控制请求
    withCredentials: true,
    timeout: 30000,
    validateStatus() {
        // 使用async-await，处理reject情况较为繁琐，所以全部返回resolve，在业务代码中处理异常
        return true;
    },
});

//返回结果处理
const responseHandle = {
    200: (response) => {
        return response.data.data;
    },
    401: (response) => {
        notification.error({
            message: '错误',
            description: response.data.msg,
        });
    },
    404: (response) => {
        notification.error({
            message: '错误',
            description: response.data.msg,
        });
    },
    500: (response) => {
        notification.error({
            message: '错误',
            description: response.data.msg,
        });
    },
};
//请求拦截器
service.interceptors.request.use(
    function (config) {
        const token = localStorage.getItem('token');
        config.headers['Authorization'] = token;

        if (
            config.method.toLocaleLowerCase() === 'get' ||
            config.method.toLocaleLowerCase() === 'delete'
        ) {
            config.params = config.data;
        } else {
            notification.error({
                message: '请求错误',
                description: '不允许此类请求!',
            });
        }

        return config;
    },
    function (error) {
        return Promise.reject(error);
    },
);
//响应拦截器

service.interceptors.response.use(
    function (response) {
        return responseHandle[response?.data?.code](response);
    },
    function (error) {
        return Promise.reject(error);
    },
);
export default service;
