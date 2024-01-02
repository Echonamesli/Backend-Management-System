import request from '@/utils/request'

//获取SPU列表数据
export const reqSpuList = (page, limit, category3Id) => request({url: `/product/${page}/${limit}`, method: 'get', params: {category3Id}})

//点击编辑按钮获取某一个SPU信息
export const reqSpu = (spuId) => request({url: `/product/getSpuById/${spuId}`, method: 'get'})

//获取品牌下拉框数据
export const reqTradeMarkList = () => request({url: '/product/baseTrademark/getTrademarkList', method: 'get'})

//获取SPU图片
export const reqSpuImageList = (spuId) => request({url: `/product/spuImageList/${spuId}`, method: 'get'})

//获取平台中全部的销售属性(共三个)
export const reqBaseSaleAttrList = () => request({url: '/product/baseSaleAttrList', method: 'get'})