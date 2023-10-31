import Qs from 'qs';
export function generateReqKey(config) {
    //响应的时候,response.config中的data 是一个字符串,所以需要转换一下
    if (config && config.data && isJsonstr(config.data)) {
        config.data = JSON.parse(config.data);
    }
    const { method, url, data } = config; //请求方法,参数,地址
    return [method, url, Qs.stringify(data)].join('&'); //拼接
}

//判断一个字符是否是JSON字符串
export const isJsonstr = (str) => {
    if (typeof str === 'string') {
        try {
            const obj = JSON.parse(str);
            if (typeof obj === 'object' && obj) {
                return true;
            } else {
                return false;
            }
        } catch (err) {
            // console.log('error :' + str + '!!!' + e);
        }
    }
};
