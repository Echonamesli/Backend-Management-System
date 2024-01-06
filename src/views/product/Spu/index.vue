<template>
  <div>
    <el-card style="margin: 20px 0px">
      <CategorySelect @getCategoryId="getCategoryId" :show="scene!=0"></CategorySelect>
    </el-card>
    <el-card style="margin: 20px 0px">
      <!-- 三部分进行切换 -->
      <div v-show="scene==0">
        <!-- 展示spu列表的结构 -->
        <el-button
          icon="el-icon-plus"
          type="primary"
          style="margin: 0px 0px 10px"
          @click="addSpu"
          :disabled="!category3Id"
        >添加SPU</el-button>
        <el-table :data="records" style="width: 100%" border>
          <el-table-column type="index" label="序号" width="80"></el-table-column>
          <el-table-column prop="spuName" label="spu名称" width="450"></el-table-column>
          <el-table-column prop="description" label="spu描述" align="center"></el-table-column>
          <el-table-column label="操作" width="400">
            <template slot-scope="{ row, $index }">
              <hint-button
                type="success"
                icon="el-icon-plus"
                size="mini"
                title="添加sku"
                @click="addSku(row)"
              ></hint-button>
              <hint-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                title="修改spu"
                @click="updateSpu(row)"
              ></hint-button>
              <hint-button type="info" icon="el-icon-info" size="mini" title="查看当前spu全部sku列表"  @click="seeSkuList(row)"></hint-button>
              <el-dialog :title="`${spu.spuName}的sku列表`" :visible.sync="dialogTableVisible">
                <el-table :data="skuList" :border="false" style="width:100%">
                  <el-table-column property="skuName" label="名称" ></el-table-column>
                  <el-table-column property="price" label="价格" ></el-table-column>
                  <el-table-column property="weight" label="重量" ></el-table-column>
                  <el-table-column  label="默认图片">
                    <template slot-scope="{row, $index}">
                      <img :src="row.skuDefaultImg" style="width:100px;height:100px">
                      </template>
                  </el-table-column>
                </el-table>
              </el-dialog>
              <template>
                <el-popconfirm title="这是一段内容确定删除吗？" @onConfirm="deleteSpu(row)">
                  <hint-button
                    slot="reference"
                    type="danger"
                    icon="el-icon-delete"
                    size="mini"
                    title="删除spu"
                  ></hint-button>
                </el-popconfirm>
              </template>
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
        <SpuForm v-show="scene==1" @changeScene="changeScene" ref="spu"></SpuForm>
      </div>
      <div>
        <!-- 添加SKU -->
        <SkuForm v-show="scene==2" ref="sku" @changeScene1="changeScene1"></SkuForm>
      </div>
    </el-card>
  </div>
</template>

<script>
//引入子组件
import SpuForm from "./SpuForm";
import SkuForm from "./SkuForm";
export default {
  name: "Spu",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      //控制三级联动的可操作性
      records: [],
      page: 1, //分页器当前第几页
      limit: 3, //当前页展示多少条数据
      total: 0,
      scene: 0, //负责场景切换，0——展示SPU列表数据， 1——添加/修改SPU， 2——添加SKU
      dialogTableVisible: false,
      spu: [],  //当前选中的spu
      skuList: []  //当前选中的spu的sku列表
    };
  },
  components: {
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
    changeScene({ scene, flag }) {
      this.scene = scene;
      if (flag == "添加") {
        this.page = 1;
      }
      this.getSpuList();
    },
    //SpuForm子组件的自定义事件回调
    changeScene1(scene) {
      this.scene = scene;
      this.getSpuList();
    },
    async getSpuList() {
      const { page, limit, category3Id } = this;
      let result = await this.$API.spu.reqSpuList(page, limit, category3Id);
      if (result.code == 200) {
        this.records = result.data.records;
        this.total = result.data.total;
      }
    },
    //分页器当前页数发生变化时，page是分页器组件自动带给我们的参数
    handleCurrentChange(page) {
      this.page = page;
      this.getSpuList();
    },
    //分页器每页显示条数发生变化时，limit是分页器组件自动带给我们的参数
    handleSizeChange(limit) {
      console.log(limit);
      this.limit = limit;
      this.getSpuList();
    },
    //添加SPU按钮的回调
    addSpu() {
      this.scene = 1;
      this.$refs.spu.addSpuData(this.category3Id);
    },
    //修改某一个SPU按钮的回调
    updateSpu(row) {
      this.scene = 1;
      this.$refs.spu.initSpuData(row);
    },
    //删除SPU按钮的回调
    async deleteSpu(row) {
      let result = await this.$API.spu.reqDeleteSpu(row.id);
      if (result.code == 200) {
        this.$message({ type: "success", message: "删除成功" });
        if ((this.records.length = 1)) this.page = this.page - 1;
        this.getSpuList();
      }
    },
    //添加sku按钮的回调
    addSku(row) {
      this.scene = 2;
      //让子组件发请求获取数据
      this.$refs.sku.initData(this.category1Id, this.category2Id, row);
    },
    //点击查看sku列表按钮的回调
    async seeSkuList(row){
      this.spu = row
      let result = await this.$API.sku.reqSkuList(row.id)
      if(result.code == 200){
        this.skuList = result.data
      }
      this.dialogTableVisible = true
    }
  }
};
</script>

<style>
</style>