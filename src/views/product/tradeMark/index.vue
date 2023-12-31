<template>
  <div>
    <el-button type="primary" icon="el-icon-plus" style="margin:10px 0px" @click="showDialog">添加</el-button>
    <el-table :data="records" border style="width: 100%">
      <el-table-column label="序号" type="index" width="80" prop="id" align="center"></el-table-column>
      <el-table-column label="品牌名称" prop="tmName" align="center"></el-table-column>
      <el-table-column label="品牌LOGO" prop="logoUrl" align="center">
        <template slot-scope="{row}">
          <img :src="row.logoUrl" alt style="width:50px;height:50px" />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="{row}">
          <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateTradeMark(row)">修改</el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteTradeMark(row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="margin-top:20px;textAlign:center"
      layout="prev, pager, next, jumper, sizes, total"
      :total="total"
      :page-size="limit"
      :current-page.sync="page"
      :page-sizes="[3, 6, 9, 12]"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    ></el-pagination>
    <!-- 对话框 -->
    <el-dialog :title="tmForm.id?'修改品牌':'添加品牌'" :visible.sync="dialogFormVisible">
      <el-form :model="tmForm" :rules="rules" ref="ruleForm" style="width:80%">
        <el-form-item label="品牌名称" label-width="120px" prop="tmName">
          <el-input v-model="tmForm.tmName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="120px" prop="logoUrl">
          <el-upload
            class="avatar-uploader"
            action="/admin/product/upload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="reqAddOrUpdateTradeMark">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "tradeMark",
  data() {
    return {
      //代表当前获取的是分页器第几页数据
      page: 1,
      //每页显示条目个数
      limit: 6,
      //接口返回的列表总数
      total: 0,
      // //接口返回的当前要展示的列表数组
      records: [],
      //控制对话框展示
      dialogFormVisible: false,
      //收集对话框的品牌信息
      tmForm: { tmName: "", logoUrl: "" },
      //表单验证
      rules: {
        tmName: [
          { required: true, message: "请输入品牌名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "change" }
        ],
        logoUrl: [{ required: true, message: "请选择品牌图片" }]
      }
    };
  },
  mounted() {
    // console.log(this.$API);
    this.getPageList();
  },
  methods: {
    //获取品牌列表
    async getPageList() {
      const { page, limit } = this;
      let result = await this.$API.tradeMark.reqTradeMarkList(page, limit);
      const { code, data } = result;
      if (code == 200) {
        this.total = data.total;
        this.records = data.records;
      }
    },
    //分页器页数变化时
    async handleCurrentChange(page) {
      //console.log(page);
      let result = await this.$API.tradeMark.reqTradeMarkList(page, this.limit);
      const { code, data } = result;
      if (code == 200) {
        this.total = data.total;
        this.records = data.records;
      }
    },
    //每页显示条目个数发生变化时
    async handleSizeChange(pageSize) {
      //console.log(pageSize);
      let result = await this.$API.tradeMark.reqTradeMarkList(
        this.page,
        pageSize
      );
      const { code, data } = result;
      if (code == 200) {
        this.total = data.total;
        this.records = data.records;
        this.limit = pageSize;
      }
    },
    //点击添加品牌的按钮
    showDialog() {
      this.dialogFormVisible = true;
      this.tmForm = { tmName: "", logoUrl: "" };
    },
    //点击修改品牌的按钮
    updateTradeMark(row) {
      //console.log(row);  //row就是每一行的el-table  :data="records"  所有row里由服务器分配的每一个id
      this.dialogFormVisible = true;
      this.tmForm = { ...row }; //row是服务器返回的数据，tmForm是表格中展示的数据，不能 this.tmForm = row，因为这样是它们指向一个引用，修改表格数据的时候服务器数据也会变
    },
    //点击删除品牌的按钮
    deleteTradeMark(row) {
      this.$confirm(`确定删除${row.tmName}`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async() => {
          let result = await this.$API.tradeMark.deleteTradeMark(row.id);
          if (result.code == 200) {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
           this.page = this.records.length > 1 ? this.page : this.page-1
           this.getPageList()
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //对话框的确定按钮
    reqAddOrUpdateTradeMark() {
      //表单验证通过再去书写业务逻辑
      this.$refs.ruleForm.validate(async valid => {
        if (valid) {
          this.dialogFormVisible = false;
          let result = await this.$API.tradeMark.reqAddOrUpdateTradeMark(
            this.tmForm
          );
          if (result.code == 200) {
            this.$message({
              message: this.tmForm.id ? "修改品牌成功" : "添加品牌成功",
              type: "success"
            });
          }
          //重新获取列表数据，如果添加品牌，停留在第一页，如果修改品牌，应该留在当前页面
          if (this.tmForm.id) {
            this.getPageList();
          } else {
            this.page = Math.ceil(this.total / this.limit);
            this.getPageList();
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //上传图片
    handleAvatarSuccess(res, file) {
      //res的data是上传的这张图片在服务器上的真实地址：http://139.198.127.41:9000/sph/20231231/doni.jpg"
      //而现在展示的tmForm的logoUrl是本地的地址："blob:http://localhost:9528/f3d096c6-6067-4f43-a526-750ac1b53834"
      //console.log(res, file);
      //收集这张图片在真实服务器上的地址，用来后续发请求带给服务器
      this.tmForm.logoUrl = res.data;
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    }
  }
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>