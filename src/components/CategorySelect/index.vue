<template>
  <div>
    <el-form :inline="true" :model="cForm" class="demo-form-inline">
      <el-form-item label="一级分类">
        <el-select v-model="cForm.category1Id" placeholder="请选择" @change="handler1" :disabled="show">
          <el-option
            v-for="(c1, index) in category1List"
            :key="c1.id"
            :label="c1.name"
            :value="c1.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select v-model="cForm.category2Id" placeholder="请选择" @change="handler2" :disabled="show">
          <el-option
            v-for="(c2, index) in category2List"
            :key="c2.id"
            :label="c2.name"
            :value="c2.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select v-model="cForm.category3Id" placeholder="请选择" @change="handler3" :disabled="show">
          <el-option
            v-for="(c3, index) in category3List"
            :key="c3.id"
            :label="c3.name"
            :value="c3.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "CategorySelect",
  props:['show'],
  data() {
    return {
      cForm: {
        category1Id: "",
        category2Id: "",
        category3Id: ""
      },
      category1List: [],
      category2List: [],
      category3List: []
    };
  },

  mounted() {
    this.getCategory1List();
  },

  methods: {
    //获取一级分类下拉列表选项
    async getCategory1List() {
      let result = await this.$API.attr.reqCategory1List();
      if (result.code == 200) {
        this.category1List = result.data;
      }
    },
    //当一级分类发生变化时，获取二级分类下拉列表选项
    async handler1() {
      this.cForm.category2Id = "";
      this.cForm.category3Id = "";
      this.category2List = [];
      this.category3List = [];
      const { category1Id } = this.cForm;
      //传递给父组件
      this.$emit("getCategoryId", { categoryId: category1Id, level: 1 });
      let result = await this.$API.attr.reqCategory2List(category1Id);
      if (result.code == 200) {
        this.category2List = result.data;
      }
    },
    //当二级分类发生变化时，获取三级分类下拉列表选项
    async handler2() {
      this.cForm.category3Id = "";
      this.category3List = [];
      const { category2Id } = this.cForm;
      //传递给父组件
      this.$emit("getCategoryId", { categoryId: category2Id, level: 2 });
      let result = await this.$API.attr.reqCategory3List(category2Id);
      if (result.code == 200) {
        this.category3List = result.data;
      }
    },
    //三级分类选择完毕后就要发请求,把三个id传递给父组件
    async handler3() {
      const { category3Id } = this.cForm;
      //传递给父组件
      this.$emit("getCategoryId", { categoryId: category3Id, level: 3 });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>