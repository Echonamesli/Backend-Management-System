<template>
  <div>
    <el-form ref="form" :model="spu" label-width="80px">
      <el-form-item label="SPU名称">
        <el-input v-model="spu.spuName" placeholder="SPU名称"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select v-model="spu.tmId" placeholder="请选择品牌">
          <el-option
            v-for="item in tradeMarkList"
            :key="item.id"
            :label="item.tmName"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input type="textarea" v-model="spu.description" placeholder="SPU描述" :rows="3"></el-input>
      </el-form-item>
      <el-form-item label="图片">
        <el-upload
          action="/admin/product/upload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :file-list="spuImageList"
          :on-success="handleSuccess"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt />
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select v-model="attrIdAndAttrName" :placeholder="`还有${unSelectedSaleAttr.length}项未选择`">
          <el-option
            v-for="item in unSelectedSaleAttr"
            :key="item.id"
            :label="item.name"
            :value="`${item.id}:${item.name}`"
          ></el-option>
        </el-select>
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!attrIdAndAttrName"
          @click="addSaleAttr"
        >添加销售属性</el-button>
        <el-table style="width:100%" :data="spu.spuSaleAttrList" border>
          <el-table-column type="index" label="序号" width="80"></el-table-column>
          <el-table-column prop="saleAttrName" label="属性名" width="300"></el-table-column>
          <el-table-column prop="spuSaleAttrValueList" label="属性值名称列表" width="400">
            <template slot-scope="{row, $index}">
              <el-tag
                :key="tag.id"
                v-for="(tag, $index) in row.spuSaleAttrValueList"
                closable
                :disable-transitions="false"
                @close="row.spuSaleAttrValueList.splice(index,1)"
              >{{tag.saleAttrValueName}}</el-tag>
              <el-input
                class="input-new-tag"
                v-if="row.inputVisible"
                v-model="row.inputValue"
                ref="saveTagInput"
                size="small"
                @blur="handleInputConfirm(row)"
              ></el-input>
              <el-button v-else class="button-new-tag" size="small" @click="showInput(row)">添加</el-button>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{row, $index}">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                slot="reference"
                @click="spu.spuSaleAttrList.splice($index,1)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SpuForm",

  data() {
    return {
      dialogImageUrl: "", //控制照片墙的预览对话框显示与否
      dialogVisible: false,
      spu: {
        category3Id: "",
        description: "",
        tmId: "", //品牌id
        spuName: "",
        //图片列表
        spuImageList: [
          // {
          //   id: 0,
          //   imgName: "",
          //   imgUrl: "",
          //   spuId: 0
          // }
        ],
        //表格——销售属性及属性值
        spuSaleAttrList: [
          // {
          //   baseSaleAttrId: 0,
          //   id: 0,
          //   saleAttrName: "",
          //   spuId: 0,
          //   spuSaleAttrValueList: [
          //     {
          //       baseSaleAttrId: 0,
          //       id: 0,
          //       isChecked: "",
          //       saleAttrName: "",
          //       saleAttrValueName: "",
          //       spuId: 0
          //     }
          //   ]
          // }
        ]
      },
      tradeMarkList: [], //存储品牌信息
      spuImageList: [], //存储spu图片数据
      saleAttrList: [], //整个平台的销售属性——颜色、尺寸、版本
      attrIdAndAttrName: "" //未选择的销售属性的id和name
    };
  },
  computed: {
    //计算出还未选择的销售属性
    unSelectedSaleAttr() {
      let result = this.saleAttrList.filter(item => {
        return this.spu.spuSaleAttrList.every(
          item1 => item1.saleAttrName != item.name
        );
      });
      return result;
    }
  },
   //子组件的mounted在父组件mounted执行之前就执行了，而且只执行一次，v-show只是控制该子组件的显示与隐藏
  mounted() {},
  methods: {
    //照片墙移除照片
    handleRemove(file, fileList) {
      //file:删除的那张照片
      //fileList：删除完某一张之后剩余的其它图片
      console.log(file, fileList);
    },
    //照片墙预览照片
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    //照片墙图片上传成功
    handleSuccess(response, file, fileList) {
      //console.log(response, file, fileList);
      //收集图片
      this.spuImageList = fileList;
    },
    //初始化SpuForm数据
    async initSpuData(spu) {
      let spuResult = await this.$API.spu.reqSpu(spu.id);
      if (spuResult.code == 200) {
        this.spu = spuResult.data;
      }
      let tradeMarkResult = await this.$API.spu.reqTradeMarkList();
      if (tradeMarkResult.code == 200) {
        this.tradeMarkList = tradeMarkResult.data;
      }
      let spuImageResult = await this.$API.spu.reqSpuImageList(spu.id);
      if (spuImageResult.code == 200) {
        this.spuImageList = spuImageResult.data;
        this.spuImageList.forEach(item => {
          item.name = item.imgName;
          item.url = item.imgUrl;
        });
      }
      let baseSaleAttrResult = await this.$API.spu.reqBaseSaleAttrList();
      if (baseSaleAttrResult.code == 200) {
        this.saleAttrList = baseSaleAttrResult.data;
      }
    },
    //点击添加SPU按钮的时候发请求获取初始数据
    async addSpuData(category3Id) {
      this.spu.category3Id = category3Id;
      let tradeMarkResult = await this.$API.spu.reqTradeMarkList();
      if (tradeMarkResult.code == 200) {
        this.tradeMarkList = tradeMarkResult.data;
      }
      let baseSaleAttrResult = await this.$API.spu.reqBaseSaleAttrList();
      if (baseSaleAttrResult.code == 200) {
        this.saleAttrList = baseSaleAttrResult.data;
      }
    },
    //添加新的销售属性
    addSaleAttr() {
      const [baseSaleAttrId, saleAttrName] = this.attrIdAndAttrName.split(":");
      this.spu.spuSaleAttrList.push({
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: []
      });
      this.attrIdAndAttrName = "";
    },
    //表格里添加属性值的按钮
    showInput(row) {
      this.$set(row, "inputVisible", true);
      this.$set(row, "inputValue", "");
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    //表格里属性值失去焦点
    handleInputConfirm(row) {
      let inputValue = row.inputValue;
      if (inputValue.trim() == "") {
        this.$message("属性值不能为空");
        return;
      }
      //属性值不能重复
      let isRepeat = row.spuSaleAttrValueList.every(
        item => item.saleAttrValueName != inputValue
      );
      if (!isRepeat) return;
      row.spuSaleAttrValueList.push({
        baseSaleAttrId: row.baseSaleAttrId,
        saleAttrValueName: inputValue
      });
      row.inputVisible = false;
      row.inputValue = "";
    },
    //保存按钮的回调——添加或修改SPU
    async addOrUpdateSpu() {
      this.spu.spuImageList = this.spuImageList.map(item => {
        return {
          imageName: item.name,
          imageUrl: (item.response && item.response.data) || item.url //新图和旧图区分开
        };
      });
      let result = await this.$API.spu.reqAddOrUpdateSpu(this.spu);
      if (result.code == 200) {
        this.$message({ type: "success", message: "保存成功" });
        this.$emit("changeScene", {
          scene: 0,
          flag: this.spu.id ? "修改" : "添加"
        });
      }
      //清除data数据
      Object.assign(this._data, this.$options.data());
    },
    //取消按钮的回调
    cancel() {
      this.$emit("changeScene", { scene: 0, flag: "" });
      //清除data数据，this.$options.data()可以重置整个组件的数据
      Object.assign(this._data, this.$options.data());
    }
  }
};
</script>

<style lang="scss" scoped>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>