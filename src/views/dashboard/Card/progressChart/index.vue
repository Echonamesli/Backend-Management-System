<template>
  <!-- echarts容器 -->
  <!-- 需要注意的是，使用这种方法在调用 echarts.init 时需保证容器已经有宽度和高度了 -->
  <div style="width:100%;height:100%" class="charts" ref="charts"></div>
</template>

<script>
import * as echarts from "echarts";
export default {
  name: "progressChart",
  mounted() {
    //初始化echarts实例
    let lineCharts = echarts.init(this.$refs.charts);
    lineCharts.setOption({
      xAxis: {
        //隐藏x轴
        show: false,
        min: 0,
        max: 100
      },
      yAxis: {
        //隐藏y轴
        show: false,
        //y轴均分
        type: "category"
      },
      series: [
        {
          type: "bar",
          data: [78],
          color: "blue",
          //柱状图宽度
          barWidth: 10,
          color: "yellowgreen",
          showBackground: true,
          //背景颜色设置
          backgroundStyle: {
            color: "rgba(180, 180, 180, 0.2)"
          },
          //文本标签
          label: {
            show: true,
            //改变文本内容
            formatter: '|',
            //文本标签位置调试
             position: 'right'
          }
        }
      ],
      //布局调试
      grid: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
      }
    });
  },

  methods: {}
};
</script>

<style lang="scss" scoped>
</style>