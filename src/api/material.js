import request from '@/utils/request'

// 获取用户素材列表
export const getUserImage = params => {
    return request({
        method: 'GET',
        url: 'v1_0/user/images',
        params
    })
}

// 上传素材图片
export const upLoadImages = data => {
    return request({
        method: 'POST',
        url: 'v1_0/user/images',
        data
    })
}

// 收藏图片素材
export const collectImage = (imageId) => {
    return request({
        method: 'PUT',
        url: `v1_0/user/images/${imageId}`,
        // data: {
        //     collect：'collect'
        // }
    })
}