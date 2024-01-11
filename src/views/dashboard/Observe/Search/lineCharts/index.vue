<template>
  <div>
    <div class="header">
      <span style="margin-right:25px">搜索用户数</span>
      <svg
        t="1704611683286"
        class="icon"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="1453"
        width="16"
        height="16"
      >
        <path
          d="M536 480v192a16 16 0 0 1-16 16h-16a16 16 0 0 1-16-16V480a16 16 0 0 1 16-16h16a16 16 0 0 1 16 16z m-32-128h16a16 16 0 0 1 16 16v32a16 16 0 0 1-16 16h-16a16 16 0 0 1-16-16v-32a16 16 0 0 1 16-16z m8 448c159.056 0 288-128.944 288-288s-128.944-288-288-288-288 128.944-288 288 128.944 288 288 288z m0 48c-185.568 0-336-150.432-336-336s150.432-336 336-336 336 150.432 336 336-150.432 336-336 336z"
          fill="#000000"
          p-id="1454"
        />
      </svg>
    </div>
    <div class="main">
      <span class="main-title">144578</span>
      <span class="main-content">16.6</span>
      <i class="el-icon-caret-top" style="color: greenyellow"></i>
      <i class="el-icon-caret-bottom" style="color: red"></i>
    </div>
    <div class="footer">
      <div style="width:100%;height:50%" class="charts" ref="charts"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
export default {
  name: "lineCharts",

  data() {
    return {};
  },

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
          data: [10, 4, 66, 36, 89, 8, 34, 29, 48],
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

<style scoped>
.header {
  display: flex;
  align-items: center;
}
.main {
  margin: 10px 0px;
}
.main-title {
  margin-right: 30px;
  font-size: 30px;
}
.main-content {
  margin-right: 10px;
}
</style>