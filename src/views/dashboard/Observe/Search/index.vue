<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <div class="search-header">
          <span>线上热门搜索</span>
          <el-dropdown>
            <span>
              <i class="el-icon-more"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>黄金糕</el-dropdown-item>
              <el-dropdown-item>狮子头</el-dropdown-item>
              <el-dropdown-item>螺蛳粉</el-dropdown-item>
              <el-dropdown-item>双皮奶</el-dropdown-item>
              <el-dropdown-item>蚵仔煎</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div>
        <el-row :gutter="10">
          <el-col :span="12">
            <lineCharts />
          </el-col>
          <el-col :span="12">
            <lineCharts />
          </el-col>
        </el-row>
        <el-table
          :data="tableData"
          style="width: 100%"
          :default-sort="{prop: 'date', order: 'descending'}"
          border
        >
          <el-table-column label="排名" width="80" type="index"></el-table-column>
          <el-table-column label="搜索关键字" sortable width="180"></el-table-column>
          <el-table-column label="用户数" sortable></el-table-column>
          <el-table-column label="周涨幅" sortable></el-table-column>
        </el-table>
        <el-pagination layout="prev, pager, next" :total="1000" class="pagination"></el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import lineCharts from "./lineCharts";
export default {
  name: "Search",

  data() {
    return {
      tableData: [{}]
    };
  },
  components: { lineCharts },
  mounted() {},

  methods: {}
};
</script>

<style scoped>
.search-header {
  display: flex;
  justify-content: space-between;
}
.pagination{
    float:right
}
</style>