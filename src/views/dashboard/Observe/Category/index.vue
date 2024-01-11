<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <div class="category-header">
          <span>销售额类别占比</span>
          <el-radio-group v-model="radio1">
            <el-radio-button label="全部渠道"></el-radio-button>
            <el-radio-button label="线上"></el-radio-button>
            <el-radio-button label="门店"></el-radio-button>
          </el-radio-group>
        </div>
      </div>
      <div>
        <div class="charts" ref="charts"></div>
      </div>
    </el-card>
  </div>
</template>

<script>
import * as echart from "echarts";
export default {
  name: "Category",

  data() {
    return { radio1: "全部渠道" };
  },

  mounted() {
    let mycharts = echart.init(this.$refs.charts);
    mycharts.setOption({
      tooltip: {
        trigger: "item"
      },
      title: {
        text: "Search",
        subtext: "1111",
        left: "center",
        top: "center"
      },
      series: [
        {
          name: "Access From",
          type: "pie",
          radius: ["40%", "70%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: "#fff",
            borderWidth: 2
          },
          label: {
            show: true,
            position: "outside"
          },
          labelLine: {
            show: true
          },
          data: [
            { value: 1048, name: "Search" },
            { value: 735, name: "Direct" },
            { value: 580, name: "Email" },
            { value: 484, name: "Union Ads" },
            { value: 300, name: "Video Ads" }
          ]
        }
      ]
    });
    //给图表绑定事件
    mycharts.on("mouseover", function(params) {
      const { name, value } = params.data;
      mycharts.setOption({
        title: {
          text: name,
          subtext: value,
          left: "center",
          top: "center"
        }
      });
    });
  },

  methods: {}
};
</script>

<style scoped>
.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.charts {
  width: 100%;
  height: 300px;
}
</style>