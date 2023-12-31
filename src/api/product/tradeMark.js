import request from '@/utils/request'

//获取品牌列表接口
export const reqTradeMarkList = (page, limit) => request({ url: `/product/baseTrademark/${page}/${limit}`, method: 'get' })

//添加或者修改品牌
export const reqAddOrUpdateTradeMark = (tradeMark) => {
    if (tradeMark.id) {
        //如果带给服务器id就说明是修改品牌
        return request({ url: '/product/baseTrademark/update', method: 'put', data:tradeMark })
    } else {
        //如果没有带给服务器id就说明是新增品牌
        return request({ url: '/product/baseTrademark/save', method: 'post',data:tradeMark })
    }
}

//删除品牌
export const deleteTradeMark = (id) => request({url: `/product/baseTrademark/remove/${id}`, method: 'delete'})
