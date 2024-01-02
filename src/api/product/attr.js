import request from '@/utils/request'
//获取一级分类
export const reqCategory1List = () => request({url: '/product/getCategory1', method: 'get'})
//获取二级列表
export const reqCategory2List = (category1Id) => request({url: `/product/getCategory2/${category1Id}` , method: 'get'})
//获取三级列表
export const reqCategory3List = (category2Id) => request({url: `/product/getCategory2/${category2Id}` , method: 'get'})
//获取平台属性
export const reqAttrList = (category1Id,category2Id, category3Id ) => request({url: `/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`, method: 'get'})
//添加属性与属性值
export const reqAddOrUpdateAttr = (data) => request({url: '/product/saveAttrInfo', method: 'post', data})
