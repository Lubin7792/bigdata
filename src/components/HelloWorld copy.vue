<template>
  <div class="hello">
    <!-- <iframe id="myframe1" src="http://10.60.127.130/hhgbi/v5/design/report/18373dfc819c456ea15e6e9d15f8d472/view" width="1280" height="1080" frameborder="0" scrolling="auto" style="position:absolute;top:0;left: 0px;"></iframe>
   <iframe id="myframe2" src="http://10.60.127.130/hhgbi/v5/design/report/18373dfc819c456ea15e6e9d15f8d472/view" width="1280" height="1080" frameborder="0" scrolling="auto"style="position:absolute;top:0;left: 4704px;"></iframe> -->
    <div class="skorke">
      <canvas class="can" ref="canvas" id="skorke01" width="3200" height="1080">
        第一条线
      </canvas>
      <div class="stack">
        <span
          v-for="stack in positionData.stack"
          :style="{ left: stack.x + 'px', top: stack.y + 'px' }"
        ></span>
      </div>
      <div class="ship">
        <img src="../assets/ship.png"   v-for="ship in positionData.ship"
          :style="{ left: ship.x + 'px', top: ship.y + 'px' }"alt="">
      </div>
    </div>
  </div>
</template>

<script>
import { clearInterval } from "timers";
import positionData from "../assets/skroke.js";
import originJSONP from "jsonp";
import jq from "jquery";
const jQuery = new jq();
export default {
  name: "HelloWorld",
  props: {
    msg: String
  },
  data() {
    return {
      bigSrceen: {},
      positionData: positionData
    };
  },
  created() {
    let arrayData = [];
  },
  methods: {
    init(datas) {
      var SK01 = document.getElementById("skorke01");
      var SK01x = SK01.getContext("2d");
      var color = ["chartreuse", "tomato", "gold", "brown"];
      var skroke = function(context, color, x1, y1, x2, y2) {
        context.beginPath();
        context.moveTo(x1, y1);
        context.lineTo(x2, y2);
        context.lineWidth = 1;
        context.strokeStyle = color || "chartreuse";
        context.stroke();
      };
      // var stats = function (data, name) {
      //   let st;
      //   data.map(item => {
      //   if (item.device_belt_name_simplify == name) {
      //     st = item.status=="yx"?"chartreuse":item.status=="gz"?"tomato":"lightseagreen"
      //   }
      // });
      // return st
      // }
      let colorValue = ["chartreuse", "tomato", "lightseagreen"];
      var stats = function(data) {
        // return data=="yx"?"chartreuse":data=="gz"?"tomato":"lightseagreen"
        return colorValue[Math.floor(Math.random() * 3)];
        // console.log(Math.floor(Math.random()*3))
      };
      for (const key in positionData.belt) {
        skroke(
          SK01x,
          stats(positionData.belt[key].sts),
          positionData.belt[key].bx,
          positionData.belt[key].by,
          positionData.belt[key].ex,
          positionData.belt[key].ey
        );
      }
    },
    refreshData() {
      this.timer = setInterval(() => {
        this.axios
          .get("http://127.0.0.1:3000/getData")
          .then(response => {
            this.bigSrceen = response.data;
          })
          .catch(response => {
            console.log("err");
          });
      }, 1000 * 3);
    }
  },
  mounted() {
    this.init();
    console.log(jQuery);

    // this.axios.get()
    /*-------------------AJAX方式-------------------*/
    //  jQuery.ajax({
    //     //移动端登录需要带__device__=iPhone&terminal=H5
    //     url: 'http://10.60.127.130/hhgbi/login/cross/domain',
    //     data: {'fine_username': 'admin', 'fine_password': 'hhgBI@2019', 'validity': -1},
    //     timeout: 5000,
    //     dataType: 'jsonp',
    //     jsonp:"callback",
    //     success: function (res) {
    //         // alert('登录成功');
    //         var token = res.accessToken;
    //         // window.location.href = "http://mobile.finebi.com:37700/webroot/decision/url/mobile"
    //         // 原则上登录成功后不用再带token参数，当前有bug正在修复
    //         document.getElementById("myframe1").src= "http://10.60.127.130/hhgbi/v5/design/report/18373dfc819c456ea15e6e9d15f8d472/view?token=" + token;
    //         document.getElementById("myframe2").src= "http://10.60.127.130/hhgbi/v5/design/report/18373dfc819c456ea15e6e9d15f8d472/view?token=" + token;
    //     },
    //     error: function () {
    //         alert('登录失败');
    //     }
    // });
    // this.axios
    //   .get("http://127.0.0.1:3000/getData")
    //   .then(response => {
    //     this.bigSrceen = response.data;
    //   })
    //   .catch(response => {
    //     console.log("err");
    //   });
    // setTimeout(() => {
    //   this.refreshData()
    // }, 1000*5);
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  },
  watch: {
    bigSrceen: function(data) {
      this.init(data);
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
  width: 5880px;
  height: 1080px;
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
}
.can {
  position: relative;
  top: 0;
  left: 77px;
}
.stack {
  position: absolute;
  left: 150px;
  top: 10px;
}
.stack span {
  position: absolute;
  width: 10px;
  height: 10px;
  background-color: #42b983;
}
.ship{
  position: absolute;
  top: 0px;
  left: 0px;
}
.ship img{
  width: 140px;
  transform: rotate(29deg);
  position: absolute;

}
</style>
