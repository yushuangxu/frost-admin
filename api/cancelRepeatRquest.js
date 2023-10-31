//取消重复请求
import Axios from 'axios';
import { generateReqKey } from './commonFuns';

const pendingRequest = new Map();
export function addPendingRequest(config) {
    if (config.cancelRequest) {
        const requestKey = generateReqKey(config);
        if (pendingRequest.has(requestKey)) {
            config.cancelToken = new Axios.CancelToken((cancel) => {
                //cancel函数的参数会作为promise的error捕获
                cancel(`${config.url} 请求已经取消`);
            });
        } else {
            config.cancelToken =
                config.cancelToken ||
                new Axios.CancelToken((cancel) => {
                    pendingRequest.set(requestKey, cancel);
                });
        }
    }
}

//removePendingRequest: 检查是否存在重复请求,若存在则取消已发到请求
export function removePendingRequest(response) {
    if (response && response.config && response.config.cancelRequest) {
        const requestKey = generateReqKey(response.config);
        //判断是否有这个key
        if (pendingRequest.has(requestKey)) {
            const cancelToken = pendingRequest.get(requestKey);
            cancelToken(requestKey);
            pendingRequest.delete(requestKey);
        }
    }
}
