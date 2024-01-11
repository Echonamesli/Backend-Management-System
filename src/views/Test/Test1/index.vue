<template>
  <div>
        <h3>我是测试文件1</h3>
       <el-button type="primary" v-show="$store.state.user.buttons.indexOf('btn.Add1')!=-1">添加按钮1</el-button>
       <el-button type="primary"  v-show="$store.state.user.buttons.indexOf('btn.Add2')!=-1">添加按钮2</el-button>

  </div>
</template>

<script>
export default {
  name: 'test1',
}
</script>

<style scoped>

</style>
