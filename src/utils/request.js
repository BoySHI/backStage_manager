/**
 * 基于axios封装的请求模块
 */
import axios from 'axios'
import router from '@/router'
// import JSONbig from 'json-bigint'

const request = axios.create({
    baseURL: 'http://api-toutiao-web.itheima.net/mp/',

    // 定制后端返回的原始数据处理，data为未经过处理的后端的字符串数据
    // transformRequest: [function(data, headers) {
    //     // Do whatever you want to transform the data
    //     try {
    //         return JSONbig.parse(data);
    //     } catch (err) {
    //         return data
    //     }
    // }]
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

// 响应拦截器
request.interceptors.response.use((res) => {
    return res
}, (err) => {
    console.log(err)
    if (err.res && err.res.status === 401) {
        // 清除本地存储
        window.localStorage.removeItem('user')
            // 跳转到登录页面
        router.push('/login')
    }
    return Promise.reject(err)
})
export default request