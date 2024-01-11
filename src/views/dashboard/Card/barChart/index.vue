<template>
  <!-- echarts容器 -->
  <!-- 需要注意的是，使用这种方法在调用 echarts.init 时需保证容器已经有宽度和高度了 -->
  <div style="width:100%;height:100%" class="charts" ref="charts"></div>
</template>

<script>
import * as echarts from "echarts";
export default {
  name: "barChart",
  mounted() {
    //初始化echarts实例
    let lineCharts = echarts.init(this.$refs.charts);
    lineCharts.setOption({
      xAxis: {
        //隐藏x轴
        show: false,
        //x轴均分
        type: "category"
      },
      yAxis: {
        //隐藏y轴
        show: false
      },
      series: [
        {
            type: 'bar',
            data: [5, 20, 36, 10, 10, 20,16,44,20],
            color: 'blue'
        }
      ],
      //布局调试
      grid: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
      },
      tooltip:{}
    });
  },

  methods: {}
};
</script>

<style lang="scss" scoped>
</style>