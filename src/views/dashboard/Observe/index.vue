<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="12">
        <Search />
      </el-col>
      <el-col :span="12">
        <Category />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Search from "./Search";
import Category from "./Category";
export default {
  name: "Observe",

  data() {
    return {};
  },
  components: { Search, Category },
  mounted() {},

  methods: {}
};
</script>

<style lang="scss" scoped>
</style>