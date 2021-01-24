/**
 * 用户相关请求模块
 */
import request from '../utils/request'

// 登录请求
export const login = data => {
    return request({
        method: 'POST',
        url: 'v1_0/authorizations',
        data
    })
}

// 获取用户信息
export const getUserProfile = () => {
    return request({
        method: 'GET',
        url: 'v1_0/user/profile'
    })
}

// 修改用户头像
export const updataUserPhoto = data => {
    return request({
        method: 'PATCH',
        url: 'v1_0/user/photo',
        data
    })
}

// 修改用户基本信息
export const updataUserProfile = data => {
    return request({
        method: 'PATCH',
        url: 'v1_0/user/profile',
        data
    })
}