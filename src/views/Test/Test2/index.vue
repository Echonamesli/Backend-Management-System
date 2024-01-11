<template>
  <div>
       <h3>我是测试文件2</h3>
       <el-button type="primary" v-show="$store.state.user.buttons.indexOf('btn.Add3')!=-1">添加按钮3</el-button>
  </div>
</template>

<script>
export default {
  name: 'test2',
}
</script>

<style scoped>

</style>
