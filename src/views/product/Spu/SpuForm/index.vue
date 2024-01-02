<template>
  <div>
    <el-form ref="form" :model="spu" label-width="80px">
      <el-form-item label="SPU名称">
        <el-input v-model="spu.spuName" placeholder="SPU名称"></el-input>
      </el-form-item>
      <el-form-item  label="品牌">
        <el-select v-model="spu.tradeMark" placeholder="请选择品牌">
            <el-option v-for="item in tradeMarkList" :key="item.id" :label="item.tmName" :value="item.tmName"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input type="textarea" v-model="spu.description" placeholder="SPU描述" :rows="3"></el-input>
      </el-form-item>
      <el-form-item label="图片">
        <el-upload
          action="https://jsonplaceholder.typicode.com/posts/"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt />
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select placeholder="还有3未选择">
          <el-option v-for="item in tradeMarkList" :key="item.id" :label="item.tmName" :value="item.tmName"></el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-plus">添加销售属性</el-button>
        <el-table style="width:100%" border>
          <el-table-column type="index" label="序号" width="80"></el-table-column>
          <el-table-column prop="prop" label="属性名" width="300"></el-table-column>
          <el-table-column prop="prop" label="属性值名称列表" width="400"></el-table-column>
          <el-table-column prop="prop" label="操作" width></el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">保存</el-button>
        <el-button @click="$emit('changeScene', 0)">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SpuForm",

  data() {
    return {  dialogImageUrl: "", dialogVisible: false, spu: {}, tradeMarkList:[] };
  },

  mounted() {},

  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    //初始化SpuForm数据
    async initSpuData(spu) {
      let spuResult = await this.$API.spu.reqSpu(spu.id);
      if(spuResult.code == 200){
        this.spu = spuResult.data
      }
      let tradeMarkResult = await this.$API.spu.reqTradeMarkList()
      if(tradeMarkResult.code == 200){
        this.tradeMarkList = tradeMarkResult.data
      }
      console.log(tradeMarkResult);
      // reqSpuImageList
      // reqBaseSaleAttrList
    }
  }
  //子组件的mounted在父组件mounted执行之前就执行了，而且只执行一次，v-show只是控制该子组件的显示与隐藏
};
</script>

<style lang="scss" scoped>
</style>