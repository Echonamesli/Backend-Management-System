<template>
  <div>
    <el-button type="primary" icon="el-icon-plus" style="margin:10px 0px">添加</el-button>
    <el-table :data="records" border style="width: 100%">
      <el-table-column label="序号" type='index' width='80' prop='id' align="center"></el-table-column>
      <el-table-column label="品牌名称" prop='tmName' align="center"></el-table-column>
      <el-table-column label="品牌LOGO" prop="logoUrl" align="center">
        <template slot-scope="{row}">
          <img :src="row.logoUrl" alt="" style="width:50px;height:50px">
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" >
        <template slot-scope="{}">
          <el-button type="warning" icon='el-icon-edit' size="mini">修改</el-button>
          <el-button type="danger"  icon='el-icon-delete' size="mini">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
     <el-pagination 
     style="margin-top:20px;textAlign:center"
    layout="prev, pager, next, jumper, sizes, total"
    :total="total" :page-size="limit" :page-sizes="[3, 6, 9, 12]" @current-change='handleCurrentChange' @size-change='handleSizeChange'>
  </el-pagination>
  </div>
</template>

<script>
export default {
    name:'tradeMark',
    data(){
      return{
        //代表当前获取的是分页器第几页数据
        page: 1,
        //每页显示条目个数
        limit: 6,
        //接口返回的列表总数
        total:0,
        // //接口返回的当前要展示的列表数组
        records:[]
      }
    },
    mounted(){
      // console.log(this.$API);
      this.getPageList()
    },
    methods: {
      //获取品牌列表
      async getPageList(){
        const {page, limit} = this
        let result = await this.$API.tradeMark.reqTradeMarkList(page, limit)
        const { code, data} = result
        if(code == 200){
          this.total = data.total
          this.records = data.records
        }
      },
      //分页器页数变化时
      async handleCurrentChange(page){
        //console.log(page);
        let result = await this.$API.tradeMark.reqTradeMarkList(page, this.limit)
        const { code, data} = result
        if(code == 200){
          this.total = data.total
          this.records = data.records
        }
      },
      //每页显示条目个数发生变化时
      async handleSizeChange(pageSize){
        //console.log(pageSize);
        let result = await this.$API.tradeMark.reqTradeMarkList(this.page, pageSize)
        const { code, data} = result
        if(code == 200){
          this.total = data.total
          this.records = data.records
          this.limit = pageSize
        }
      }
    }
}
</script>

<style>

</style>