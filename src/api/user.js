import request from '@/utils/request'
import mockRequest from '@/utils/mockRequest'

export function login(data) {
  return request({
    url: '/acl/index/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/acl/index/info',
    method: 'get',
    params: { token }
  })
}

//这个是接口是在mock（mock-server文件里定义了基础路径是process.env.VUE_APP_MOCK_API）下的user写的模拟接口。
//所以要用mockRequest发起请求(baseURL: process.env.VUE_APP_MOCK_API也就是mock-api)
export function logout() {
  return mockRequest({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}
