<template>
  <div>
    <el-form label-width="80px">
      <el-form-item label="SPU名称">{{spu.spuName}}</el-form-item>
      <el-form-item label="SKU名称">
        <el-input v-model="skuInfo.skuName" placeholder="SKU名称"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input v-model="skuInfo.price" placeholder="价格(元)" type="number"></el-input>
      </el-form-item>
      <el-form-item label="重量(千克)">
        <el-input v-model="skuInfo.weight" placeholder="重量(千克)"></el-input>
      </el-form-item>
      <el-form-item label="规格描述">
        <el-input type="textarea" v-model="skuInfo.skuDesc" :rows="3"></el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <el-form :inline="true" class="demo-form-inline" label-width="80px">
          <el-form-item :label="attr.attrName" v-for="(attr,index) in attrInfoList" :key="attr.id">
            <el-select v-model="attr.attrIdAndValueId" placeholder="请选择">
              <el-option
                :label="attrValue.valueName"
                v-for="(attrValue,index) in attr.attrValueList"
                :key="attrValue.id"
                :value="`${attr.id}:${attrValue.id}`"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-form :inline="true" class="demo-form-inline" label-width="80px">
          <el-form-item
            :label="saleAttr.saleAttrName"
            v-for="(saleAttr,index) in spuSaleAttrList"
            :key="saleAttr.id"
          >
            <el-select v-model="saleAttr.attrIdAndValueId" placeholder="请选择">
              <el-option
                :label="saleAttrValue.saleAttrValueName"
                :value="`${saleAttr.id}:${saleAttrValue.id}`"
                v-for="(saleAttrValue,index) in saleAttr.spuSaleAttrValueList"
                :key="saleAttrValue.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片列表">
        <el-table
          border
          ref="multipleTable"
          :data="spuImageList"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="80"></el-table-column>
          <el-table-column label="图片" width="350">
            <template slot-scope="{row, $index}">
              <img :src="row.imgUrl" style="width:100px;height:100px" />
            </template>
          </el-table-column>
          <el-table-column prop="imgName" label="名称"></el-table-column>
          <el-table-column prop="name" label="操作" width="300">
            <template slot-scope="{row, $index}">
              <el-button type="primary" v-if="row.isDefault==0" @click="changeDefault(row)">设置默认</el-button>
              <el-button v-else>默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button type="primary" @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SkuForm",

  data() {
    return {
      spuImageList: [],
      spuSaleAttrList: [],
      attrInfoList: [],
      //收集sku数据，保存的时候提交给服务器
      skuInfo: {
        category3Id: "",
        spuId: "",
        tmId: "",
        skuName: "",
        price: 0,
        weight: "",
        skuDesc: "",
        //平台属性
        skuAttrValueList: [
          {
            valueId: 0,
            attrId: 0
          }
        ],
        skuDefaultImg: "",
        //图片
        skuImageList: [
          //   {
          //     id: 0,
          //     imgName: "string",
          //     imgUrl: "string",
          //     isDefault: "string",
          //     skuId: 0,
          //     spuImgId: 0
          //   }
        ],
        //销售属性
        skuSaleAttrValueList: [
          //   {
          //     id: 0,
          //     saleAttrId: 0,
          //     saleAttrName: "string",
          //     saleAttrValueId: 0,
          //     saleAttrValueName: "string",
          //     skuId: 0,
          //     spuId: 0
          //   }
        ]
      },
      spu: {}, // 父组件给的spu数据
      imageList: [] //勾选中的图片数组
    };
  },

  mounted() {},

  methods: {
    //获取初始一系列数据
    async initData(category1Id, category2Id, spu) {
      this.skuInfo.category3Id = spu.category3Id;
      this.skuInfo.spuId = spu.id;
      this.skuInfo.tmId = spu.tmId;
      this.spu = spu;
      //获取图片数据
      let result = await this.$API.sku.reqSpuImageList(spu.id);
      if (result.code == 200) {
        let temp = result.data;
        temp.forEach(element => {
          element.isDefault = 0; //每张图片都为设置默认状态
        });
        this.spuImageList = temp;
      }
      //获取销售属性数据
      let result1 = await this.$API.sku.reqSpuSaleAttrList(spu.id);
      if (result1.code == 200) {
        this.spuSaleAttrList = result1.data;
      }
      //获取平台属性数据
      let result2 = await this.$API.sku.reqAttrInfoList(
        category1Id,
        category2Id,
        spu.category3Id
      );
      if (result2.code == 200) {
        this.attrInfoList = result2.data;
      }
    },
    //table表格复选框按钮
    handleSelectionChange(selection) {
      this.imageList = selection;
    },
    //图片排他，只能有一个图片是默认状态，其它均为设置默认
    changeDefault(row) {
      this.spuImageList.forEach(item => {
        item.isDefault = 0;
      });
      //点击的设为默认
      row.isDefault = 1;
      //收集默认图片的地址
      this.skuInfo.skuDefaultImg = row.imgUrl;
    },
    cancel() {
      this.$emit("changeScene1", 0);
      Object.assign(this._data, this.$options.data());
    },
    async save() {
      const { attrInfoList, skuInfo, imageList, spuSaleAttrList } = this;
      //整理平台属性数据
      skuInfo.skuAttrValueList = attrInfoList.reduce((prev, item) => {
        if (item.attrIdAndValueId) {
          const [attrId, valueId] = item.attrIdAndValueId.split(":");
          let obj = { attrId, valueId };
          prev.push(obj);
        }
        return prev;
      }, []);
      //整理销售属性数据
      skuInfo.skuSaleAttrValueList = spuSaleAttrList.reduce((prev, item) => {
        if (item.attrIdAndValueId) {
          const [saleAttrId, saleAttrValueId] = item.attrIdAndValueId.split(
            ":"
          );
          prev.push({ saleAttrId, saleAttrValueId });
        }
        return prev;
      }, []);
      //整理图片数据
      skuInfo.skuImageList = imageList.map(item => {
        return {
          imgName: item.imgName,
          imgUrl: item.imgUrl,
          isDefault: item.isDefault,
          spuImgid: item.id
        };
      });
      let result = await this.$API.sku.reqAddSku(skuInfo);
      if (result.code == 200) {
        this.$message({ type: "success", message: "添加SKU成功" });
        this.$emit("changeScene1", 0);
        Object.assign(this._data, this.$options.data());
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>