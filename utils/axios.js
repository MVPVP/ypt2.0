import axios from 'axios'
import router from '../router'
// 全局的 axios 默认值
//"192.168.0.1"开发服；
//"192.168.11.51"测试服；
//"192.168.1.120"海宏；
//"192.168.126.119"谢丹；
// axios.defaults.baseURL = "http://192.168.11.51:6001/gateway/app"; 
axios.defaults.baseURL = "http://192.168.11.51:6001/gateway";
axios.defaults.timeout = 120000;

// 添加请求拦截器
axios.interceptors.request.use(
    (config) => {
        // 在发送请求之前做些什么
        if (config.url.indexOf('/user/login') < 0) {
            config.headers = {
                'accessToken': sessionStorage.getItem('session_accessToken'),
                'userId': sessionStorage.getItem('session_userId')
            }
        }
        return config;
    }, (error) => {
        // 对请求错误做些什么
        console.log('cuowu');
        return Promise.reject(error);
    }
)

// 添加响应拦截器
axios.interceptors.response.use(
    (response) => {
        console.log('response');
        // 对响应数据做点什么
        switch (response.data.code) {
        case 3: //token无效处理；
            router.push({
                path: '/login'
            });
            break;

        default:
            break;
        }
        return response;
    }, (error) => {
        // 对响应错误做点什么
        console.log('cuowu01');
        return Promise.reject(error);
    }
);
// 封装get方法
function get(url, params = {}) {
    return new Promise((resolve, reject) => {
        axios.get(url, {
        params: params
        }).then((response) => {
        resolve(response);
        }).catch((error) => {
        reject(error);
        })
    })
}
// 封装post方法
function post(url, datas = {}) {
    return new Promise((resolve, reject) => {
        axios.post(url, datas).then((response) => {
            resolve(response);
        })
        .catch((error) => {
            reject(error);
        })
    })
}

export {
    get,
    post
};
