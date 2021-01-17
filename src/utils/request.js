/**
 * 基于axios封装的请求模块
 */
import axios from 'axios'

const request = axios.create({
    baseURL: 'http://api-toutiao-web.itheima.net/mp/'
})
export default request