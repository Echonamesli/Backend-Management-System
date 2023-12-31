<template>
  <div>
    <el-card style="margin:20px 0px">
      <CategorySelect @getCategoryId="getCategoryId"></CategorySelect>
    </el-card>
    <el-card style="margin:20px 0px">
     <div v-show="isShowTable">
       <el-button icon="el-icon-plus" type="primary" style="margin:0px 0px 10px" :disabled="!category3Id" @click="isShowTable=false">添加属性</el-button>
      <!-- 表格：展示平台属性 -->
      <el-table :data="attrList" style="width: 100%" border>
        <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
        <el-table-column prop="attrName" label="属性名称" width="150" align="center"></el-table-column>
        <el-table-column prop="address" label="属性值列表" align="center">
          <template slot-scope="{row, $index}">
            <el-tag
              type="success"
              v-for="item in row.attrValueList"
              :key="item.id"
              style="margin: 0px 10px"
            >{{item.valueName}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="操作" width="150" align="center">
          <template slot-scope="{row, $index}">
            <el-button type="warning" icon="el-icon-edit" size="mini"  @click="isShowTable=false"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
          </template>
        </el-table-column>
      </el-table>
     </div>
     <div v-show="!isShowTable">
      <el-form :inline="true" ref="form">
        <el-form-item label="属性名">
            <el-input placeholder="请输入属性名"></el-input>
        </el-form-item>
      </el-form>
      <el-button icon="el-icon-plus" type="primary" style="margin:0px 0px 10px" :disabled="true" @click="isShowTable=false">添加属性值</el-button>
       <el-button>取消</el-button>
       <el-table :data="attrList" style="{width: 100%; margin: 10px 0px}" border>
        <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
        <el-table-column prop="attrName" label="属性值名称" width="250" align="center"></el-table-column>
        <el-table-column prop="address" label="操作" align="center">
        </el-table-column>
      </el-table>
      <el-button type="primary">保存</el-button>
      <el-button  @click="isShowTable="true">取消</el-button>
     </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Attr",
  data() {
    return {
      isShowTable: false,  
      category1Id: "",
      category2Id: "",
      category3Id: "",
      attrList: []
    };
  },
  methods: {
    //自定义事件的回调
    getCategoryId({ categoryId, level }) {
      switch (level) {
        case 1:
          this.category1Id = categoryId;
          this.category2Id = "";
          this.category3Id = "";
          break;
        case 2:
          this.category2Id = categoryId;
          this.category3Id = "";
          break;
        case 3:
          this.category3Id = categoryId;
          break;
      }
    }
  },
  //category3Id有了之后就发请求
  watch: {
    async category3Id(newV, oldV) {
      if (newV !== "") {
        const { category1Id, category2Id } = this;
        let result = await this.$API.attr.reqAttrList(
          category1Id,
          category2Id,
          newV
        );
        if (result.code == 200) {
          this.attrList = result.data;
        }
      }
    }
  }
};
</script>

<style>
</style>