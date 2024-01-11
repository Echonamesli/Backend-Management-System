<template>
  <div>
    <el-table style="width:100%" :data="records" border>
      <el-table-column type="index" label="序号" width="80"></el-table-column>
      <el-table-column prop="skuName" label="名称" width="200"></el-table-column>
      <el-table-column prop="skuDesc" label="描述" width></el-table-column>
      <el-table-column label="默认图片" width="180">
        <template slot-scope="{row, $index}">
          <img :src="row.skuDefaultImg" style="width:80px;height:80px" />
        </template>
      </el-table-column>
      <el-table-column prop="weight" label="重量" width="80"></el-table-column>
      <el-table-column prop="price" label="价格" width="80"></el-table-column>
      <el-table-column type label="操作" width>
        <template slot-scope="{row, $index}">
          <el-button
            type="success"
            icon="el-icon-sort-down"
            size="mimi"
            v-if="row.isSale==0"
            @click="sale(row)"
          ></el-button>
          <el-button type="success" icon="el-icon-sort-up" size="mimi" v-else @click="cancel(row)"></el-button>
          <el-button type="primary" icon="el-icon-edit" size="mimi" @click="edit"></el-button>
          <el-button type="info" icon="el-icon-info" size="mimi" @click="getSkuInfo(row)"></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mimi"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="margin-top:20px;textAlign:center"
      layout="prev, pager, next, jumper,sizes, total"
      :total="total"
      :page-size="limit"
      :current-page.sync="page"
      :page-sizes="[3, 6, 9]"
      @current-change="getSkuList"
      @size-change="handleSizeChange"
    ></el-pagination>
    <el-drawer :visible.sync="drawer" :show-close="false" size="40%">
      <el-row>
        <el-col :span="5">名称</el-col>
        <el-col :span="16">{{skuInfo.skuName}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">描述</el-col>
        <el-col :span="16">{{skuInfo.skuDesc}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">价格</el-col>
        <el-col :span="16">{{skuInfo.price}}元</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">平台属性</el-col>
        <el-col :span="16">
          <template>
            <el-tag
              v-for="(attr,index) in skuInfo.skuAttrValueList"
              :key="attr.id"
              style="margin-right: 10px"
            >{{attr.attrId}}-{{attr.valueId}}</el-tag>
          </template>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">商品图片</el-col>
        <el-col :span="16">
          <el-carousel indicator-position="outside" height="400px" width="100%">
            <el-carousel-item v-for="item in skuInfo.skuImageList" :key="item.id">
              <img :src="item.imgUrl" style="width:100%;height:400px" />
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: "Sku",
  data() {
    return {
      page: 1,
      limit: 6,
      records: [], //存储sku列表
      total: 0,
      skuInfo: {}, //存储当前sku详情
      drawer: false
    };
  },
  mounted() {
    this.getSkuList();
  },
  methods: {
    async getSkuList(defaultpage = 1) {
      this.page = defaultpage;
      let result = await this.$API.sku.getSkuList(this.page, this.limit);
      if (result.code == 200) {
        this.records = result.data.records;
        this.total = result.data.total;
      }
    },
    handleSizeChange(limit) {
      this.limit = limit;
      this.getSkuList();
    },
    //上架
    async sale(row) {
      let result = await this.$API.sku.reqSale(row.id);
      if (result.code == 200) {
        row.isSale = 1;
        this.$message({ type: "success", message: "上架成功" });
      }
    },
    //下架
    async cancel(row) {
      let result = await this.$API.sku.reqCancel(row.id);
      if (result.code == 200) {
        row.isSale = 0;
        this.$message({ type: "success", message: "下架成功" });
      }
    },
    //编辑
    edit() {
      this.$message({ type: "info", message: "正在开发中" });
    },
    //获取sku详情
    async getSkuInfo(row) {
      this.drawer = true;
      let result = await this.$API.sku.reqSkuById(row.id);
      if (result.code == 200) {
        this.skuInfo = result.data;
      }
    }
  }
};
</script>

<style scoped>
  >>> .el-row .el-col-5 {
    font-size: 18px;
    text-align: right;
  }
  >>> .el-col {
    margin: 10px 10px;
  }
  >>> .el-carousel__item h3 {
    color: #475669;
    font-size: 18px;
    opacity: 0.75;
    line-height: 300px;
    margin: 0;
  }

  >>> .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  >>> .el-carousel__item:nth-child(2n + 1) {
    background-color: #d3dce6;
  }
  >>> .el-carousel__button {
    width: 10px;
    height: 10px;
    background: red;
    border-radius: 50%;
  }
</style>