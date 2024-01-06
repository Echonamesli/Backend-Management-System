import request from '@/utils/request'

//获取SKU图片数据
export const reqSpuImageList = (spuId) => request({ url: `/product/spuImageList/${spuId}`, method: 'get' })

//获取销售属性的数据
export const reqSpuSaleAttrList = (spuId) => request({ url: `/product/spuSaleAttrList/${spuId}`, method: 'get' })

//获取平台属性的数据
export const reqAttrInfoList = (category1Id,category2Id, category3Id ) => request({url: `/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`, method: 'get'})

//添加SKU
export const reqAddSku = (skuInfo) => request({url: '/product/saveSkuInfo', method:'post', data:skuInfo})

//添加SKU
export const reqSkuList = (spuId) => request({url: `/product/findBySpuId/${spuId}`, method:'get'})