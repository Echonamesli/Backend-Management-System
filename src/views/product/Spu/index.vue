<template>
  <div>
    <el-card style="margin: 20px 0px">
      <CategorySelect @getCategoryId="getCategoryId" :show="!show"></CategorySelect>
    </el-card>
    <el-card style="margin: 20px 0px">
      <!-- 三部分进行切换 -->
      <div v-show="scene==0">
        <!-- 展示spu列表的结构 -->
        <el-button icon="el-icon-plus" type="primary" style="margin: 0px 0px 10px" @click="addSpu" :disabled="!category3Id">添加SPU</el-button>
        <el-table :data="records" style="width: 100%" border>
          <el-table-column type="index" label="序号" width="80"></el-table-column>
          <el-table-column prop="spuName" label="spu名称" width="450"></el-table-column>
          <el-table-column prop="description" label="spu描述" align="center"></el-table-column>
          <el-table-column label="操作" width="400">
            <template slot-scope="{ row, $index }">
              <hint-button type="success" icon="el-icon-plus" size="mini" title="添加sku"></hint-button>
              <hint-button type="warning" icon="el-icon-edit" size="mini"  title="修改spu" @click="updateSpu(row)"></hint-button>
              <hint-button type="info" icon="el-icon-info" size="mini"  title="查看当前spu全部sku列表"></hint-button>
              <hint-button type="danger" icon="el-icon-delete" size="mini"  title="删除spu"></hint-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          style="margin-top:20px;textAlign:center"
          layout="prev, pager, next, jumper,sizes, total"
          :total="total"
          :page-size="limit"
          :current-page.sync="page"
          :page-sizes="[2,3, 6, 9]"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        ></el-pagination>
      </div>
      <div>
        <!-- 添加或者修改SPU -->
        <SpuForm  v-show="scene==1" @changeScene="changeScene" ref="spu"></SpuForm>
      </div>
      <div >
        <!-- 添加SKU -->
        <SkuForm v-show="scene==2"></SkuForm>
      </div>
    </el-card>
  </div>
</template>

<script>
//引入子组件
import SpuForm from './SpuForm'
import SkuForm from './SkuForm'
export default {
  name: "Spu",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      //控制三级联动的可操作性
      show: true,
      records: [],
      page: 1,//分页器当前第几页
      limit: 2, //当前页展示多少条数据
      total:0,
      scene: 0, //负责场景切换，0——展示SPU列表数据， 1——添加/修改SPU， 2——添加SKU
    };
  },
  components:{
    SpuForm,
    SkuForm
  },
  methods: {
    //三级联动的自定义事件
    getCategoryId({ categoryId, level }) {
      if (level == 1) {
        this.category1Id = categoryId;
        this.category2Id = "";
        this.category3Id = "";
      } else if (level == 2) {
        this.category2Id = categoryId;
        this.category3Id = "";
      } else {
        this.category3Id = categoryId;
        this.getSpuList();
      }
    },
    //SpuForm子组件的自定义事件回调
    changeScene(scene){
      this.scene = scene
    },
    async getSpuList() {
      const {page, limit, category3Id} = this
      let result = await this.$API.spu.reqSpuList(page, limit, category3Id)
      if(result.code == 200){
        this.records = result.data.records
        this.total = result.data.total
      }
    },
    //分页器当前页数发生变化时，page是分页器组件自动带给我们的参数
    handleCurrentChange(page){
      console.log(page);
      this.page = page
      this.getSpuList()
    },
    //分页器每页显示条数发生变化时，limit是分页器组件自动带给我们的参数
    handleSizeChange(limit){
      console.log(limit);
      this.limit = limit
      this.getSpuList()
    },
    //添加SPU按钮的回调
    addSpu(){
      this.scene = 1
    },
    //修改某一个SPU按钮的回调
    updateSpu(row){
      this.scene = 1
      this.$refs.spu.initSpuData(row)
    },

  }
};
</script>

<style>
</style>