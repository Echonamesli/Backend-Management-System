<template>
  <!-- echarts容器 -->
  <!-- 需要注意的是，使用这种方法在调用 echarts.init 时需保证容器已经有宽度和高度了 -->
  <div style="width:100%;height:100%" class="charts" ref="charts"></div>
</template>

<script>
import * as echarts from "echarts";
export default {
  name: "lineChart",
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
          type: "line",
          data: [10, 4, 66, 36, 89, 8,34,29,48],
          //拐点样式
          itemStyle: {
            opacity: 0
          },
          //折线样式
          lineStyle: {
            color: "purple"
          },
          //填充区域颜色
          areaStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: "purple" // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: "white" // 100% 处的颜色
                }
              ],
              global: false // 缺省为 false
            }
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