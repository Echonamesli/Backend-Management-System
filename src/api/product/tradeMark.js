import request from '@/utils/request'

//获取品牌列表接口
export const reqTradeMarkList = (page, limit) => request({url: `/product/baseTrademark/${page}/${limit}`,method: 'get'})