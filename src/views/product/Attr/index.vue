<template>
  <div>
    <el-card style="margin: 20px 0px">
      <CategorySelect @getCategoryId="getCategoryId" :show="!isShowTable"></CategorySelect>
    </el-card>
    <el-card style="margin: 20px 0px">
      <div v-show="isShowTable">
        <el-button
          icon="el-icon-plus"
          type="primary"
          style="margin: 0px 0px 10px"
          :disabled="!category3Id"
          @click="addAttr"
        >添加属性</el-button>
        <!-- 表格：展示平台属性 -->
        <el-table :data="attrList" style="width: 100%" border>
          <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="150" align="center"></el-table-column>
          <el-table-column prop="address" label="属性值列表" align="center">
            <template slot-scope="{ row, $index }">
              <el-tag
                type="success"
                v-for="item in row.attrValueList"
                :key="item.id"
                style="margin: 0px 10px"
              >{{ item.valueName }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="操作" width="150" align="center">
            <template slot-scope="{ row, $index }">
              <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateAttr(row)"></el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="!isShowTable">
        <el-form :inline="true" ref="form">
          <el-form-item label="属性名" :model="attrInfo">
            <el-input v-model="attrInfo.attrName" placeholder="请输入属性名" label-width="80px"></el-input>
          </el-form-item>
        </el-form>
        <el-button
          icon="el-icon-plus"
          type="primary"
          :disabled="!attrInfo.attrName.trim().length"
          @click="addAttrValue"
        >添加属性值</el-button>
        <el-button>取消</el-button>
        <el-table :data="attrInfo.attrValueList" style="width: 100%; margin: 20px 0px" border>
          <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
          <el-table-column prop="attrName" label="属性值名称" align="center">
            <template slot-scope="{ row, $index }">
              <el-input
                v-model="row.valueName"
                size="mini"
                placeholder="请输入属性值名称"
                v-if="row.flag"
                @blur="toLook(row)"
                @keyup.native.enter="toLook(row)"
                :ref="$index"
              ></el-input>
              <span v-else @click="toEdit(row, $index)" style="display: block">{{ row.valueName }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="address" width="250" label="操作" align="center">
            <template slot-scope="{ row, $index }">
              <!-- 气泡确认框 -->
              <el-popconfirm :title="`确定删除${row.valueName}?`" @onConfirm="deleteAttrValue($index)">
                <el-button type="danger" icon="el-icon-delete" size="mini" slot="reference"></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" @click="addOrUpdateAttr" :disabled="attrInfo.attrValueList.length<1">保存</el-button>
        <el-button @click="isShowTable = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import cloneDeep from "lodash/cloneDeep";
export default {
  name: "Attr",
  data() {
    return {
      //控制表格显示与隐藏
      isShowTable: true,
      category1Id: "",
      category2Id: "",
      category3Id: "",
      //table平台属性
      attrList: [],
      //添加属性/修改属性--一系列属性信息
      attrInfo: {
        attrName: "", //属性名
        attrValueList: [
          //属性值
          // {
          //   attrId: 0,  //每一个属性值对应的id
          //   valueName: "",  //每一个属性值
          // },
        ],
        categoryId: 0, //三级分类的id
        categoryLevel: 3 //服务器也需要根据这个字段区分几级id
      }
    };
  },
  methods: {
    //给子组件的自定义事件的回调
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
        this.getAttrList();
      }
    },
    //获取平台属性的数据，当用户确定三级分类的时候，可以向服务器发请求获取平台属性进行展示
    async getAttrList() {
      const { category1Id, category2Id, category3Id } = this;
      let result = await this.$API.attr.reqAttrList(
        category1Id,
        category2Id,
        category3Id
      );
      if (result.code == 200) {
        this.attrList = result.data;
      }
    },
    //点击添加属性按钮的回调
    addAttr() {
      this.isShowTable = false;
      this.attrInfo = {
        attrName: "", //属性名
        attrValueList: [],
        categoryId: this.category3Id,
        categoryLevel: 3
      };
    },
    //点击编辑属性按钮的回调
    updateAttr(row) {
      //添加响应式属性
      row.attrValueList.forEach(item => this.$set(item, "flag", false));
      this.isShowTable = false;
      //this.attrInfo = {...row}  //错误,因为扩展运算符只是第一次进行浅拷贝(毫不相干),后面的都是深拷贝(藕断丝连)
      this.attrInfo = cloneDeep(row);
    },
    //点击添加属性值按钮后的回调
    addAttrValue() {
      //如果是从table的编辑属性的按钮过来的,此时新添加的属性值id已经有了
      //flag用于切换当前是查看模式/编辑模式
      //push是经过vue处理的,vue可以检测到
      this.attrInfo.attrValueList.push({
        attrId: this.attrInfo.id,
        valueName: "",
        flag: true
      });
      //input框自动聚焦
      this.$nextTick(() => {
        this.$refs[this.attrInfo.attrValueList.length - 1].focus();
      });
    },
    //失去焦点的事件--从编辑模式切换为查看模式
    toLook(row) {
      if (row.valueName.trim() == "") {
        this.$message("请输入非空属性值");
        return;
      }
      //新增属性值不能和以前的重复
      let isRepeat = this.attrInfo.attrValueList.some(item => {
        if (row !== item) {
          return row.valueName == item.valueName;
        }
      });
      if (isRepeat) return;
      row.flag = false;
    },
    //切换到编辑模式
    toEdit(row, index) {
      row.flag = true;
      //获取input并让input聚焦,渲染dom是异步执行的,要等同步操作全部完成,才会执行异步队列
      this.$nextTick(() => {
        //获取input节点并聚焦
        this.$refs[index].focus();
      });
    },
    //气泡确认框的确定按钮回调
    deleteAttrValue(index) {
      //alert(1111)
      this.attrInfo.attrValueList.splice(index, 1);
    },
    //保存按钮，进行添加属性或修改属性的操作
    async addOrUpdateAttr() {
      //提交给服务器的数据中不应该包含flag字段
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(item => {
        delete item.flag;
        return true;
      });
      try {
        await this.$API.attr.reqAddOrUpdateAttr(this.attrInfo);
        this.isShowTable = true;
        this.$message({ type: "success", message: "保存成功" });
        this.getAttrList()
      } catch (error) {}
    }
  }
};
</script>

<style>
</style>