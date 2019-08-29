<template>
  <div class="hello">
    <!-- <iframe id="myframe1"  width="1280" height="1080" frameborder="0" scrolling="auto" style="position:absolute;top:0;left: 0px;"></iframe>
   <iframe id="myframe2"  width="1280" height="1080" frameborder="0" scrolling="auto"style="position:absolute;top:0;left:4480px;"></iframe> -->
    <div class="skorke">
      <canvas class="can" ref="canvas" id="skorke01" width="3200" height="1080">
        第一条线
      </canvas>
      <div class="stack" v-if="stackData">
        <div class="coalpile">
          <span
            v-for="(key, index) in positionData.stack"
            :style="{ left: key.x + 'px', top: key.y - 7 + 'px' }"
            :class="stackStatus(index)"
            :key="index"
            >{{ stackName(index).capacity }}</span
          >
        </div>
        <div class="stacker" v-if="beltData">
          <span
            :style="stackerPosition(index)"
            v-for="(key, index) in positionData.stacker"
            :key="index"
          ></span>
        </div>
      </div>
      <div class="ship" v-if="shipData">
        <img
          src="../assets/ship.png"
          v-for="(ship, index) in positionData.ship"
          :style="{ left: ship.x + 'px', top: ship.y + 'px' }"
          :class="{ transfrom: ship.transfrom, show: shipShow(index) }"
          :key="index"
          alt=""
        />
      </div>
      <div class="shiploader" v-if="beltData">
        <img
          src="../assets/shiploader.png"
          v-for="(position, index) in positionData.shiploader"
          :key="index"
          :style="shiploaderPosition(index)"
          alt=""
        />
      </div>
    </div>
  </div>
</template>

<script>
import { clearInterval } from "timers";
import positionData from "../assets/skroke.js";
import jq from "jquery";
export default {
  name: "HelloWorld",
  props: {
    msg: String
  },
  data() {
    return {
      //皮带装船机等数据
      beltData: null,
      // 煤堆数据
      stackData: null,
      //泊位信息
      shipData: null,
      //本地定位数据
      positionData: positionData,
      // 装船机位置
      berthPosition: {},
      berthNumber: true
    };
  },
  created() {},
  computed: {},
  methods: {
    // 装船机位置
    shiploaderPosition(name) {
      let x, y, style, berth;
      let widths = 40;
      if (name == "SLK" || name == "SL7" || name == "SL12") {
        x = positionData.shiploader[name].x;
        y = positionData.shiploader[name].y;
        style = { left: x + "px", top: y + "px" };
        return style;
      }
   
      for (let key in this.beltData) {

        if (name == this.beltData[key].device_belt_name_simplify) {
          // 泊位号
          berth = this.beltData[key].berth_pile_no;
            if(this.berthPosition[berth]){
            this.berthPosition[berth]=this.berthPosition[berth] + 1;
          }else{
            this.berthPosition[berth]=1;
          }
          let num =this.berthPosition[berth]-1;
          console.log(name,berth,"___",this.berthPosition)
            x = positionData.ship[berth].xx + widths*num;
            y = positionData.ship[berth].yy;
            style = { left: x + "px", top: y + "px" };


       if(berth == 404){
         for (let vv in this.berthPosition){
           this.berthPosition[vv]=0;
         } 

         return style;
       }
          return style;

        }
      }
      
    },
    //垛位信息
    shipShow(name) {
      let show;
      this.shipData.map(item => {
        if (item[0] == name && !!item[1]) {
          show = 1;
        }
      });
      return show == 1 ? true : false;
    },
    // 堆取料机
    stackerPosition(name) {
      let x, y, style;
      for (let key in this.beltData) {
        if (this.beltData[key].device_belt_name_simplify == name) {
          let status = this.beltData[key].berth_pile_no;
          // 发生故障用默认值
          if (status == "zw") {
            x = positionData.stacker[name].x - 20;
            y = positionData.stacker[name].y - 35;
            style = { left: x + "px", top: y + "px" };
            return style;
          }
          for (let index in positionData.stack) {
            if (index == status) {
              x = positionData.stack[index].x + 50;
              y = positionData.stack[index].y - 35;
            }
          }
        }
      }
      style = { left: x + "px", top: y + "px" };
      return style;
    },
    stackStatus(name) {
      let status = {};
      this.stackData.rows.map(item => {
        if (item[0] == name) {
          status.capacity = item[1];
          status.temperature = item[2];
        }
      });
      // 堆场信息核对
      // console.log(status.capacity, status.temperature, name);
      if (
        0 < status.capacity &&
        status.capacity < 6000 &&
        status.temperature < 50
      ) {
        return "small";
      }
      if (
        6000 < status.capacity &&
        status.capacity < 12000 &&
        status.temperature < 50
      ) {
        return "big";
      }
      if (status.capacity > 12000 && status.temperature < 50) {
        return "max";
      }
      if (
        0 < status.capacity &&
        status.capacity < 6000 &&
        status.temperature > 50
      ) {
        return "smallRed";
      }
      if (
        6000 < status.capacity &&
        status.capacity < 12000 &&
        status.temperature > 50
      ) {
        return "bigRed";
      }
      if (status.capacity > 12000 && status.temperature > 50) {
        return "maxRed";
      }
      if (status.capacity == 0) {
        return "null";
      }
      return "null";
    },
    stackName(name) {
      let status = {};
      this.stackData.rows.map(item => {
        if (item[0] == name) {
          status.capacity = item[1];
          status.temperature = item[2];
        }
      });
      return status;
    },
    init(datas) {
      var SK01 = document.getElementById("skorke01");
      var SK01x = SK01.getContext("2d");
      SK01x.clearRect(0, 0, 3200, 1080);
      var colorStatus = function(name) {
        let status, status2, color;
        datas.map(item => {
          if (item.device_belt_name_simplify == name + "1") {
            status = item.status;
          }
        });
        datas.map(item => {
          if (item.device_belt_name_simplify == name + "2") {
            status2 = item.status;
          }
        });
        if (status == "kx" && status2 == "kx") {
          color = "#bfbfbf";
        }
        if (status == "yx" || status2 == "yx") {
          color = "chartreuse";
        }
        if (status == "gz" || status2 == "gz") {
          color = "tomato";
        }
        return color;
      };
      var skroke = function(context, color, x1, y1, x2, y2) {
        context.beginPath();
        context.moveTo(x1, y1);
        context.lineTo(x2, y2);
        context.lineWidth = 2;
        context.strokeStyle = color || "white";
        context.stroke();
      };
      var stats = function(name) {
        let st;
        if (name == "BQ7") {
          return (st = colorStatus("BQ7"));
        }
        if (name == "BQ8") {
          return (st = colorStatus("BQ8"));
        }
        if (name == "BQ9") {
          return (st = colorStatus("BQ9"));
        }
        if (name == "BQ10") {
          return (st = colorStatus("BQ10"));
        }
        name == "BDQT" ? (name = "BDQ") : "";
        name == "BQ3T" ? (name = "BD3") : "";
        name == "SRS" ? (name = "SF") : "";
        datas.map(item => {
          if (name == item.device_belt_name_simplify) {
            st =
              item.status == "yx"
                ? "chartreuse"
                : item.status == "gz"
                ? "tomato"
                : "#bfbfbf";
          }
        });
        return st;
      };
      for (const key in positionData.belt) {
        skroke(
          SK01x,
          stats(key),
          positionData.belt[key].bx,
          positionData.belt[key].by,
          positionData.belt[key].ex,
          positionData.belt[key].ey
        );
      }
    },
    refreshData() {
      this.timer = setInterval(() => {
        this.getBelt();
        this.getStack();
        this.getShip();
      }, 1000 * 6000);
    },
    getBelt() {
      this.axios
        .get("/getBelt")
        .then(response => {
          this.beltData = response.data;
        })
        .catch(response => {
          console.log(response);
        });
    },
    getStack() {
      this.axios
        .get("/getStack")
        .then(response => {
          this.stackData = response.data;
        })
        .catch(response => {
          console.log(response.data);
        });
    },
    getShip() {
      this.axios
        .get("/getShip")
        .then(response => {
          this.shipData = response.data.rows;
        })
        .catch(response => {
          console.log(response.data);
        });
    }
  },
  mounted() {
    this.getBelt();
    this.getStack();
    this.getShip();
    // this.init();
    // this.axios.get()
    /*-------------------AJAX方式-------------------*/
    //  jq.ajax({
    //     //移动端登录需要带__device__=iPhone&terminal=H5
    //     url: 'http://10.60.127.130/hhgbi/login/cross/domain',
    //     data: {'fine_username': 'bigscreen', 'fine_password': 'bigscreen_2019', 'validity': -1},
    //     timeout: 5000,
    //     dataType: 'jsonp',
    //     jsonp:"callback",
    //     success: function (res) {
    //         // alert('登录成功');
    //         var token = res.accessToken;
    //         // window.location.href = "http://mobile.finebi.com:37700/webroot/decision/url/mobile"
    //         // 原则上登录成功后不用再带token参数，当前有bug正在修复
    //         document.getElementById("myframe1").src= "http://10.60.127.130/hhgbi/v5/design/report/6d6cb0683bbf44e8bd406119943f2943/view?token=" + token;
    //         document.getElementById("myframe2").src= "http://10.60.127.130/hhgbi/v5/design/report/2e78077d3e424219a89cccdab450109c/view?token=" + token;

    //     },
    //     error: function () {
    //         alert('登录失败');
    //     }
    // });

    setTimeout(() => {
      this.refreshData();
    }, 1000 * 1);
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  },
  watch: {
    beltData: function(data) {
      this.init(data);
    },
    berthNumber:function(data){
      // this.berthNumber={};
    }

  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style >
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.hello {
  width: 5760px;
  height: 1080px;
  overflow: hidden;
}
iframe {
  position: absolute;
  left: 0;
  top: 0;
}
.skorke {
  position: absolute;
  left: 1280px;
  top: 0;
  background: url("../assets/BG.jpg") top center no-repeat;
  background-size: 3200px;
  width: 3200px;
}
.can {
  position: relative;
  top: 0;
  left: 77px;
}
.stack {
  position: absolute;
  left: 100px;
  top: 5px;
}
.stack .coalpile span {
  position: absolute;
  width: 100px;
  height: 40px;
  opacity: 0.8;
}
.stack .coalpile .bigRed {
  background: url("../assets/bigRed.png") top center no-repeat;
  background-size: 40px;
}
.stack .coalpile .smallRed {
  background: url("../assets/smallRed.png") top center no-repeat;
  background-size: 30px;
}
.stack .coalpile .maxRed {
  background: url("../assets/maxRed.png") top center no-repeat;
  background-size: 50px;
}
.stack .coalpile .big {
  background: url("../assets/big.png") top center no-repeat;
  background-size: 40px;
}
.stack .coalpile .small {
  background: url("../assets/small.png") top center no-repeat;
  background-size: 30px;
}
.stack .coalpile .max {
  background: url("../assets/max.png") top center no-repeat;
  background-size: 50px;
}
.stack .coalpile .null {
  background-color: blueviolet;
}
.stack .stacker span {
  width: 60px;
  height: 100px;
  background: url("../assets/stacker.png") top center no-repeat;
  background-size: 60px;
  position: absolute;
}
.ship {
  position: absolute;
  top: 0px;
  left: 0px;
}
.ship img {
  width: 180px;
  transform: rotate(29deg);
  position: absolute;
  display: none;
}
.ship .transfrom {
  transform: rotate(75deg);
}
.ship .show {
  display: inline-block;
}
.shiploader {
  position: absolute;
  top: 0;
  left: 0;
}
.shiploader img {
  position: absolute;
  width: 40px;
}
</style>
