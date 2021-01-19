/**
 * 基于axios封装的请求模块
 */
import axios from 'axios'

const request = axios.create({
    baseURL: 'http://api-toutiao-web.itheima.net/mp/'
})

// 请求拦截器
request.interceptors.request.use(
    // config 是发送请求是的配置信息对象
    // config 是可以进行修改的
    // 在config中进行设置token，这样所有需要授权的请求都会有这个token
    config => {
        console.log(config);
        const user = JSON.parse(window.localStorage.getItem('user'))
        if (user) {
            config.headers.Authorization = `Bearer ${user.token}`
        }
        return config
    },
    err => {
        return Promise.reject(err)
    }
)
export default request