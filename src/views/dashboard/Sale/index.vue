<template>
  <div>
    <el-card class="box-card" style="margin:10px 0px">
      <div slot="header" class="clearfix">
        <el-tabs v-model="activeName" class="tab">
          <el-tab-pane label="销售额" name="sale"></el-tab-pane>
          <el-tab-pane label="访问量" name="visit"></el-tab-pane>
        </el-tabs>
        <div class="right">
          <span @click="setDay">今日</span>
          <span @click="setWeek">本周</span>
          <span @click="setMonth">本月</span>
          <span @click="setYear">本年</span>
          <el-date-picker
            v-model="date"
            class="date"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            size="mini"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </div>
      </div>
      <div>
        <el-row :gutter="10">
          <el-col :span="18">
            <div class="charts" ref="charts">aaaa</div>
          </el-col>
          <el-col :span="6" class="el-col-right">
            <h3 class>门店{{title}}排名</h3>
            <ul>
              <li>
                <span class="rindex">1</span>
                <span>肯德基</span>
                <span class="rvalue">379042</span>
              </li>
              <li>
                <span class="rindex">2</span>
                <span>麦当劳</span>
                <span class="rvalue">379042</span>
              </li>
              <li>
                <span class="rindex">3</span>
                <span>塔斯汀</span>
                <span class="rvalue">379042</span>
              </li>
              <li>
                <span>4</span>
                <span>华莱士</span>
                <span class="rvalue">379042</span>
              </li>
              <li>
                <span>5</span>
                <span>真功夫</span>
                <span class="rvalue">379042</span>
              </li>
              <li>
                <span>6</span>
                <span>星巴克</span>
                <span class="rvalue">379042</span>
              </li>
              <li>
                <span>7</span>
                <span>海底捞</span>
                <span class="rvalue">379042</span>
              </li>
            </ul>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
import * as echarts from "echarts";
import dayjs from "dayjs";
import { mapState } from "vuex";
export default {
  name: "Sale",

  data() {
    return { activeName: "sale", mycharts: null, date: [] };
  },
  computed: {
    title() {
      return this.activeName == "sale" ? "销售额" : "访问量";
    },
    ...mapState({
      listState: state => state.home.list
    })
  },
  watch: {
    title: {
      handler(newV, oldV) {
        //console.log(newV,oldV);
        //每次title变化就重新修改图标的标题
        this.mycharts.setOption({
          title: {
            text: newV + "趋势"
          },
          xAxis: {
            data:
              newV == "销售额"
                ? this.listState.orderFullYearAxis
                : this.listState.userFullYearAxis
          },
          series: [
            {
              name: "Direct",
              type: "bar",
              barWidth: "60%",
              data:
                newV == "销售额"
                  ? this.listState.orderFullYear
                  : this.listState.userFullYear,
              color: "blue"
            }
          ]
        });
      }
    },
    listState() {
      this.mycharts.setOption({
        title: {
          text: this.title + "趋势"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            data: this.listState.orderFullYearAxis,
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            data: ["0", "100", "200", "300", "400", "500"]
          }
        ],
        series: [
          {
            name: "Direct",
            type: "bar",
            barWidth: "60%",
            data: this.listState.orderFullYear,
            color: "blue"
          }
        ]
      });
    }
  },
  mounted() {
    this.mycharts = echarts.init(this.$refs.charts);
    this.mycharts.setOption({
      title: {
        text: this.title + "趋势"
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow"
        }
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true
      },
      xAxis: [
        {
          type: "category",
          data: [],
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      yAxis: [
        {
          type: "value",
          data: ["0", "100", "200", "300", "400", "500"]
        }
      ],
      series: [
        {
          name: "Direct",
          type: "bar",
          barWidth: "60%",
          data: [],
          color: "blue"
        }
      ]
    });
  },

  methods: {
    setDay() {
      const today = dayjs().format("YYYY-MM-DD");
      this.date = [today, today];
    },
    setWeek() {
      const start = dayjs()
        .day(1)
        .format("YYYY-MM-DD"); //获取当前日期所在周的第一天（周一）
      const end = dayjs()
        .day(7)
        .format("YYYY-MM-DD"); //表示获取当前日期所在周的第七天（周日）
      this.date = [start, end];
    },
    setMonth() {
      const start = dayjs()
        .startOf("month")
        .format("YYYY-MM-DD");
      const end = dayjs()
        .endOf("month")
        .format("YYYY-MM-DD");
      this.date = [start, end];
    },
    setYear() {
      const start = dayjs()
        .startOf("year")
        .format("YYYY-MM-DD");
      const end = dayjs()
        .endOf("year")
        .format("YYYY-MM-DD");
      this.date = [start, end];
    }
  }
};
</script>

<style scoped>
>>> .el-card__header {
  border-bottom: none;
}
.clearfix {
  display: flex;
  justify-content: space-between;
  position: relative;
}
.tab {
  width: 100%;
}
.right {
  position: absolute;
  right: 0px;
  span {
    margin: 0px 15px;
  }
}

.date {
  width: 250px;
  margin: 0 20px;
}
.charts {
  width: 100%;
  height: 300px;
}
ul {
  list-style: none;
  width: 100%;
  height: 300px;
  padding: 0px;
}
ul li {
  height: 8%;
  margin: 10px 0px;
}
.el-col-right span {
  margin: 0px 20px;
}
.rindex {
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background: black;
  color: white;
  text-align: center;
  float: left;
  line-height: 25px;
}
.rvalue {
  float: right;
}
</style>