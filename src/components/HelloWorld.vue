<template>
  <div class="hello">
    <!-- <iframe id="myframe1"  width="1280px" height="1110px" frameborder="0" scrolling="auto" style="position:absolute;top:-30px;left: 0px;"></iframe> -->
    <!-- <iframe id="myframe2"  width="1280px" height="1110px" frameborder="0" scrolling="auto"style="position:absolute;top:-30px;left:4480px;"></iframe> -->
    <div class="timeaxis" @mouseenter="on_top_enter" @mouseleave="on_top_leave">
      <div class="timegauge">
        <canvas ref="canvas" id="skorkess" width="1280" height="500">
          标尺
        </canvas>
        <canvas id="skorkeTime" width="1280" height="50"> </canvas>
      </div>
      <div class="timecenter" v-if="historyData">
        <swiper :options="swiperOption" class="swiper-wrap" ref="mySwiper">
          <swiper-slide v-for="(item, index) in historyData" :key="index">
            <div class="timebox">
              <div v-for="(device, indexO) in item" class="type">
                <span class="title">{{ titleName(indexO) }}:</span>
                <div class="timeBox" :style="timeBoxStyle(historyData)">
                  <div class="transverse">
                    <span
                      v-for="(unit, indexT) in device"
                      :style="timeStyle(unit)"
                    >
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </swiper-slide>
          <div
            class="swiper-pagination"
            v-for="(item, index) in positionData.number"
            :key="index"
            slot="pagination"
          ></div>
        </swiper>
      </div>
    </div>
    <div class="skorke">
      <div class="svgvan">
        <canvas
          class="can"
          ref="canvas"
          id="skorke01"
          width="3200"
          height="1080"
        >
          第一条线
        </canvas>
        <svg
          class="smile"
          version="1.1"
          width="5200"
          height="1080"
          baseProfile="full"
          v-if="svgdatas"
        >
          <defs>
            <radialGradient
              id="grad1"
              cx="50%"
              cy="50%"
              r="50%"
              fx="50%"
              fy="50%"
            >
              <stop offset="0%" style="stop-color:rgba(255,0,0,1)" />
              <stop offset="100%" style="stop-color:rgba(255,255,255,0.1)" />
            </radialGradient>
          </defs>

          <circle
            v-for="(value,index) in this.svgdatas"
            :cx="0"
            :cy="0"
            r="6"
            fill="url(#grad1)"
          >
            <animateMotion
              :path="svgpath(value)"
              begin="0s"
              :dur="svgtime(value)"
              repeatCount="indefinite"
              from="1"
              to="3"
            />
          </circle>
        </svg>
      </div>
      <div class="stack" v-if="stackData">
        <div class="coalpile">
          <span
            v-for="(key, index) in positionData.stack"
            :style="{ left: key.x + 'px', top: key.y - 20 + 'px' }"
            :class="stackStatus(index)"
            @click="stackNames(index)"
            :key="index"
            >{{ index }}</span
          >
          <img
            src="../assets/silo.png"
            v-for="(key, index) in positionData.silo"
            :style="{ left: key.x + 50 + 'px', top: key.y - 15 + 'px' }"
            :key="index"
            alt=""
          />
        </div>
        <div class="stacker" v-if="beltData">
          <span
            :style="stackerPosition(index)"
            v-for="(key, index) in positionData.stacker"
            :key="index"
            :class="stackerClass(index)"
            @click="stackNames(index)"
            >{{ index }}
          </span>
        </div>
        <div class="slio">
          <span
            v-for="(key, index) in positionData.silolader"
            :style="slioloaderPosition(key)"
            :key="index"
          >
          </span>
        </div>
        <div class="dumper">
          <span
            src="../assets/dumper.png"
            v-for="(key, index) in positionData.dumper"
            :style="{ left: key.x + 50 + 'px', top: key.y - 25 + 'px' }"
            :key="index"
            :class="{ transfrom: key.transfrom }"
            alt=""
          ></span>
        </div>
      </div>
      <div class="ship" v-if="shipData">
        <span
          v-for="(ship, index) in positionData.ship"
          :style="{ left: ship.x + 'px', top: ship.y + 40 + 'px' }"
          :class="{ transfrom: ship.transfrom, show: shipShow(index) }"
          :key="index"
          alt=""
          >{{ shipName(index) }}
        </span>
      </div>
      <div class="shiploader" v-if="beltData">
        <span
          v-for="(position, index) in positionData.shiploader"
          :key="index"
          :style="shiploaderPosition(index)"
          :class="[shipOne(index)]"
          alt=""
        ></span>
      </div>
    </div>
  </div>
</template>

<script>
import "swiper/dist/css/swiper.css";
import { swiper, swiperSlide } from "vue-awesome-swiper";
import { clearInterval } from "timers";
import positionData from "../assets/skroke.js";
import jq from "jquery";
export default {
  name: "HelloWorld",
  props: {
    msg: String
  },
  data() {
    const that = this;
    return {
      //皮带装船机等数据
      beltData: null,
      // 煤堆数据
      stackData: null,
      //泊位信息
      shipData: null,
      // 时间轴
      historyData: null,
      //本地定位数据
      positionData: positionData,
      svgdatas:[],
      // 装船机位置
      berthPosition: {},
      imgIndex: 1,
      swiperOption: {
        //是一个组件自有属性，如果notNextTick设置为true，组件则不会通过NextTick来实例化swiper，也就意味着你可以在第一时间获取到swiper对象，假如你需要刚加载遍使用获取swiper对象来做什么事，那么这个属性一定要是true
        notNextTick: true,
        //循环
        loop: true,
        //设定初始化时slide的索引
        initialSlide: 0,
        //自动播放
        autoplay: {
          delay: 3000000,
          stopOnLastSlide: false,
          /* 触摸滑动后是否继续轮播 */
          disableOnInteraction: false
        },
        //滑动速度
        speed: 800,
        //滑动方向
        direction: "horizontal",
        //小手掌抓取滑动
        grabCursor: true,
        on: {
          //滑动之后回调函数
          slideChangeTransitionStart: function() {
            /* realIndex为滚动到当前的slide索引值 */
            that.imgIndex = this.realIndex - 1;
          }
        },
        //分页器设置
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
          type: "bullets"
        }
      }
    };
  },
  created() {},
  computed: {},
  components: {
    swiper,
    swiperSlide
  },
  methods: {
    svgtime(value){
      let times
      // 两点之间的距离
      // let blength = Math.floor(Math.sqrt(Math.pow(value.bx,2)+Math.pow(value.by,2)));
      // let elength = Math.floor(Math.sqrt(Math.pow(value.ex,2)+Math.pow(value.ey,2)));
      // times= Math.ceil(Math.abs((elength-blength)/70))  
       let dx = Math.abs(value.bx - value.ex);
       let dy = Math.abs(value.by - value.ey);
       times = Math.ceil(Math.sqrt(Math.pow(dx,2)+Math.pow(dy,2))/70);
      times<2?times=2:'';
      return times;
    },
    svgpath(value){
   
      // let path = M10*n+","+50 T170,70"
      let path ="M"+value.bx+","+value.by+" "+ "T"+value.ex+","+value.ey;
      return path
    },
    timeBoxStyle(data) {
      let nowTime = new Date(data.ship.SL1[0].endtime / 1000);
      let m = nowTime.getMinutes();
      let num = (m / 60) * 45.83 + 1100;

      let style = { width: num + "px" };
      return style;
    },
    timeInit(data) {
      let nowTime = new Date(data.ship.SL1[0].endtime / 1000);
      let h = nowTime.getHours();
      let m = nowTime.getMinutes();
      let array = [];
      for (let index = h + 1; index > 0; index--) {
        array.unshift(index);
      }
      for (let index = 24; index > h - 1; index--) {
        array.unshift(index);
      }
      var SKT = document.getElementById("skorkess");
      var SKTC = SKT.getContext("2d");
      SKTC.clearRect(0, 0, 1280, 1080);
      SKTC.lineWidth = 1;
      // SKTC.globalAlpha=0.1;
      var skrokeb = function(color, x1, y1, x2, y2) {
        SKTC.moveTo(x1, y1);
        SKTC.lineTo(x2, y2);
        SKTC.strokeStyle = color || "white";
        SKTC.stroke();
      };
      var SKTime = document.getElementById("skorkeTime");
      var SKTi = SKTime.getContext("2d");
      SKTi.clearRect(0, 0, 1280, 1080);
      let x = 60,
        y = 20;
      array.map((item, index) => {
        skrokeb("#00b4ff", x + index * 45.83, y, x + index * 45.83, y + 460);
        SKTi.fillStyle = "#FFF";
        SKTi.font = "16px Arial";
        SKTi.fillText(item, x + index * 45.83, y);
      });
    },
    timeStyle(value) {
      let widthPx, color, style;
      widthPx = ((value.endtime - value.startime) / 1000000) * (11 / 864);
      if (widthPx > 1300) {
        widthPx = 1200;
      }
      if (value.status == "yx") {
        color = "#57fef8";
      }
      if (value.status == "kx") {
        color = "#2b68ff";
      }
      if (value.status == "gz") {
        color = "red";
      }
      if (value.status == "tl") {
        color = "#aeaeae";
      }
      style = { width: widthPx + "px", "background-color": color };
      return style;
    },
    titleName(name) {
      if (parseInt(name)) {
        return "CD" + name;
      } else {
        return name;
      }
    },
    handle(data, cdData) {
      let dumper = {},
        stack = {},
        take = {},
        ship = {},
        history = {},
        cdhistory = [];

      data.map((value, index) => {
        var pushData = function(name) {
          if (name[value.device_name]) {
            name[value.device_name].unshift(value);
          } else {
            name[value.device_name] = [];
            name[value.device_name].push(value);
          }
        };
        // dumper
        if (
          value.device_name.substring(0, 1) == "S" &&
          value.device_name.length == 2
        ) {
          pushData(stack);
        }
        if (value.device_name.substring(0, 2) == "CD") {
          pushData(dumper);
        }
        if (
          value.device_name.substring(0, 1) == "R" ||
          value.device_name.substring(0, 2) == "SR"
        ) {
          pushData(take);
        }
        if (value.device_name.substring(0, 2) == "SL") {
          pushData(ship);
        }
      });

      cdData.map((item, index) => {
        let obj = {
          device_name: item[0].substring(2),
          startime: item[1] * 1000000,
          endtime: item[2] * 1000000,
          status: item[3]
        };
        cdhistory.push(obj);
      });
      cdhistory.map((value, index) => {
        if (dumper[value.device_name]) {
          dumper[value.device_name].push(value);
        } else {
          dumper[value.device_name] = [];
          dumper[value.device_name].push(value);
        }
      });
      for (const key in dumper) {
        dumper[key] = dumper[key].sort((a, b) => b.startime - a.startime);
      }
      history.take = take;
      history.stack = stack;
      history.dumper = dumper;
      history.ship = ship;
      this.historyData = history;
    },
    //通过获得的swiper对象来暂停自动播放
    on_top_enter() {
      this.$refs.mySwiper.swiper.autoplay.stop();
    },
    on_top_leave() {
      this.$refs.mySwiper.swiper.autoplay.start();
    },
    slioloaderPosition(name) {
      let x, y, style;
      for (let key in this.beltData) {
        if (this.beltData[key].device_belt_name_simplify == name) {
          // 筒仓名称
          let status = this.beltData[key].berth_pile_no;

          for (let index in positionData.silo) {
            if (index == status) {
              y = positionData.silo[index].y - 43;
              x = positionData.silo[index].x + 35;
            }
          }
        }
      }
      style = { left: x + "px", top: y + "px" };

      return style;
    },
    // 装船机方向

    shipOne(name) {
      let berth,
        run,
        state = 0;
      for (let key in this.beltData) {
        if (name == this.beltData[key].device_belt_name_simplify) {
          //泊位号
          berth = this.beltData[key].berth_pile_no;
          run = this.beltData[key].status;
          if (run == "gz") {
            state = "gzdown";
            if (300 < berth && berth < 400) {
              state = "gup";
            }
            if (100 < berth && berth < 200) {
              state = "gup";
            }
            if ("100" == berth || berth == "200" || berth == "400") {
              state = "gleft";
            }
          }
          if (run == "yx") {
            state = "yxdown";

            if (300 < berth && berth < 400) {
              state = "yup";
            }
            if (100 < berth && berth < 200) {
              state = "yup";
            }
            if ("100" == berth || berth == "200" || berth == "400") {
              state = "yleft";
            }
          }
          if (run == "kx") {
            state = "kxdown";

            if (300 < berth && berth < 400) {
              state = "up";
            }
            if (100 < berth && berth < 200) {
              state = "up";
            }
            if ("100" == berth || berth == "200" || berth == "400") {
              state = "left";
            }
          }
        }
      }
      return state;
    },
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
          if (this.berthPosition[berth]) {
            this.berthPosition[berth] = this.berthPosition[berth] + 1;
          } else {
            this.berthPosition[berth] = 1;
          }
          let berthPlural = 0;
          // 判断对应的泊位
          if (300 < berth && berth < 400) {
            let plural = Number(berth) + 100;
            if (this.berthPosition[plural]) {
              berthPlural = this.berthPosition[plural];
            }
          }
          if (400 < berth && berth < 500) {
            let plural = Number(berth) - 100;
            if (this.berthPosition[plural]) {
              berthPlural = this.berthPosition[plural];
            }
          }
          let num = this.berthPosition[berth] + berthPlural - 1;
          x = positionData.ship[berth].xx + widths * num;
          y = positionData.ship[berth].yy;
          style = { left: x + "px", top: y - 5 + "px" };

          //装船机个数
          let nums = 0;
          for (let key in this.berthPosition) {
            nums = nums + this.berthPosition[key];
            if (nums == 10) {
              for (let vv in this.berthPosition) {
                this.berthPosition[vv] = 0;
              }
            }
          }
          return style;
        }
      }
    },
    //垛位信息
    shipName(name) {
      let show;
      this.shipData.map(item => {
        if (item[0] == name && !!item[1]) {
          show = item[1];
        }
      });
      return show;
    },
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
    stackerClass(name) {
      let stack,
        status,
        upDown = 0;
      for (let key in this.beltData) {
        if (this.beltData[key].device_belt_name_simplify == name) {
          stack = this.beltData[key].berth_pile_no;
          status = this.beltData[key].status;
        }
      }

      for (let key in positionData.dev_pile) {
        if (name == key) {
          let up = positionData.dev_pile[key].u;
          let down = positionData.dev_pile[key].d;
          if (stack.substring(0, up.length) == up && up.length != 0) {
            upDown = 1;
          }

          if (stack.substring(0, down.length) == down && down.length != 0) {
            upDown = -1;
          }
        }
      }
      if (name.substring(0, 2) == "SR") {
        if (status == "yx") {
          if (upDown == 1) {
            return "takeUp";
          }
          if (upDown == -1) {
            return "takeDown";
          }
          return "take";
        }
        if (status == "kx" || status == "gz") {
          return "take";
        }
      }

      if (name.substring(0, 1) == "S" && name.substring(1, 2) != "R") {
        if (status == "yx") {
          if (upDown == 0) {
            return "stack";
          }
          if (upDown == 1) {
            return "stackUp";
          }
          if (upDown == -1) {
            return "stackDown";
          }
        }
        if (status == "kx" || status == "gz") {
          return "stack";
        }
      }
      if (name.substring(0, 1) == "R") {
        if (status == "yx") {
          if (upDown == 0) {
            return "take";
          }
          if (upDown == 1) {
            return "takeUp";
          }
          if (upDown == -1) {
            return "takeDown";
          }
        }
        if (status == "kx" || status == "gz") {
          return "take";
        }
      }
    },
    stackerPosition(name) {
      // console.log(name,"name")
      let x, y, style;
      for (let key in this.beltData) {
        if (this.beltData[key].device_belt_name_simplify == name) {
          let status = this.beltData[key].berth_pile_no;
          // 发生故障用默认值
          if (status == "zw") {
            x = positionData.stacker[name].x - 20;
            y = positionData.stacker[name].y - 7;
            style = { left: x + "px", top: y + "px" };
            return style;
          }
          for (let index in positionData.stack) {
            if (index == status) {
              let state = this.downUp(index, name);
              if (name == "R1" || name == "R2") {
                y = positionData.stack[index].y - 30 + state * 25;
              } else {
                y = positionData.stack[index].y - 35 + state * 22;
              }

              // if (name == "R1" || name == "R2") {
              //   y = positionData.stack[index].y - 63 ;
              // } else {
              //   y = positionData.stack[index].y -58;
              // }
              x = positionData.stack[index].x + 30 * state;
            }
          }
        }
      }
      style = { left: x + "px", top: y + "px" };

      return style;
    },
    downUp(index, name) {
      let plusOr = 0;
      for (let key in positionData.dev_pile) {
        if (name == key) {
          let up = positionData.dev_pile[key].u;
          let down = positionData.dev_pile[key].d;
          if (index.substring(0, up.length) == up && up.length != 0) {
            plusOr = 1;
          }

          if (index.substring(0, down.length) == down && down.length != 0) {
            plusOr = -1;
          }
        }
      }
      return plusOr;
    },
    // downUp(index, name) {
    //   let plusOr = 0;
    //   for (let key in positionData.dev_pile) {
    //     if (name == key) {
    //       let up = positionData.dev_pile[key].u;
    //       let down = positionData.dev_pile[key].d;
    //       if (index.substring(0, up.length) == up && up.length != 0) {
    //         plusOr = 1;
    //       }

    //       if (index.substring(0, down.length) == down && down.length != 0) {
    //         plusOr = -1;
    //       }
    //     }
    //   }
    //   return plusOr;
    // },
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
      // 堆场大小温度状态
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
      let svgname,svgdata=[];
      datas.map(item => {
          if((item.status=="yx")&&(item.device_belt_name_simplify.slice(0,1)=="B")){
            svgname = item.device_belt_name_simplify; 
            for (const key in positionData.belt) {
              if(key == svgname){
                svgdata.push(positionData.belt[key])
              }
            }
          }
           
          });
           this.svgdatas= svgdata;
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
          color = "#47d442";
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
        // ADD线
        if (name.indexOf("ADD") != -1) {
          name = name.substring(3);
        }
        datas.map(item => {
          if (name == item.device_belt_name_simplify) {
            st =
              item.status == "yx"
                ? "#47d442"
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
        this.getHistory();
      }, 1000 * 60);
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
    },
    getTrain() {
      this.axios
        .get("/getTrain")
        .then(response => {
          // console.log(response.data.rows);
        })
        .catch(response => {
          console.log(response.data);
        });
    },
    getHistoryCd(datas) {
      this.axios
        .get("/getHistoryCd")
        .then(response => {
          this.handle(datas, response.data.rows);
        })
        .catch(response => {
          console.log(response);
        });
    },
    getHistory() {
      this.axios
        .get("/getHistory")
        .then(response => {
          // this.handle(response.data);
          return response.data;
        })
        .then(datas => {
          this.getHistoryCd(datas);
        })
        .catch(response => {
          console.log(response);
        });
    }
  },
  mounted() {
    //皮带
    this.getBelt();
    //堆场
    this.getStack();
    //船
    this.getShip();
    //火车
    this.getTrain();
    //时间轴历史数据
    // this.getHistoryCd();
    this.getHistory();
    // this.init();
    // this.axios.get()
    /*-------------------AJAX方式-------------------*/
    jq.ajax({
      //移动端登录需要带__device__=iPhone&terminal=H5
      url: "http://10.60.127.130/hhgbi/login/cross/domain",
      data: {
        fine_username: "bigscreen",
        fine_password: "bigscreen_2019",
        validity: -1
      },
      timeout: 5000,
      dataType: "jsonp",
      jsonp: "callback",
      success: function(res) {
        // alert('登录成功');
        var token = res.accessToken;
        // window.location.href = "http://mobile.finebi.com:37700/webroot/decision/url/mobile"
        // 原则上登录成功后不用再带token参数，当前有bug正在修复
        // document.getElementById("myframe1").src= "http://10.60.127.130/hhgbi/v5/design/report/6d6cb0683bbf44e8bd406119943f2943/view?token=" + token;
        // document.getElementById("myframe2").src= "http://10.60.127.130/hhgbi/v5/design/report/2e78077d3e424219a89cccdab450109c/view?token=" + token;
      },
      error: function() {
        alert("登录失败");
      }
    });

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
    historyData: function(data) {
      if (data) {
        //   var SKT = document.getElementById("skorkess");
        // console.log(SKT)
        //   console.log(data)
        this.timeInit(data);
      }
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
  background: url("../assets/BG.png") top center no-repeat;
  background-size: 3200px;
  width: 3200px;
  height: 1080px;
}
.can {
  position: absolute;
  top: 0;
  left: 77px;
  /* z-index: 1; */
}
.smile {
  position: absolute;
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
  width: 50px;
  height: 50px;
  color: #fff;
  /* opacity: 0.8; */
}
.stack .coalpile img {
  position: absolute;
  width: 50px;
  height: 40px;
  opacity: 0.8;
}
.stack .coalpile .bigRed {
  background: url("../assets/bigRed.png") bottom center no-repeat;
  background-size: 40px;
}
.stack .coalpile .smallRed {
  background: url("../assets/smallRed.png") bottom center no-repeat;
  background-size: 30px;
}
.stack .coalpile .maxRed {
  background: url("../assets/maxRed.png") bottom center no-repeat;
  background-size: 50px;
}
.stack .coalpile .big {
  background: url("../assets/big.png") bottom center no-repeat;
  background-size: 40px;
}
.stack .coalpile .small {
  background: url("../assets/small.png") bottom center no-repeat;
  background-size: 30px;
}
.stack .coalpile .max {
  background: url("../assets/max.png") bottom center no-repeat;
  background-size: 50px;
}
.stack .coalpile .null {
  /* background-color: blueviolet; */
}
.stack .stacker span {
  width: 150px;
  height: 60px;
  background: url("../assets/take.png") top center no-repeat;
  background-size: 60px;
  position: absolute;
  display: inline-block;
  z-index: 6;
  color: #fff;
  /* transform: rotateY(180deg) */
}
.stack .stacker .stack {
  background-image: url("../assets/stack.png");
  background-position: 100% 100%;
}
.stack .stacker .stackUp {
  background-image: url("../assets/stackUp.gif");
  background-position: 10% 100%;
}
.stack .stacker .stackDown {
  background-image: url("../assets/stackDown.gif");
  background-position: 1% 100%;
}
.stack .stacker .take {
  height: 65px;
  background-image: url("../assets/take.png");

  background-position: 100% 100%;
}
.stack .stacker .takeUp {
  background-image: url("../assets/takeUp.gif");
  background-position: 10% 100%;
}
.stack .stacker .takeDown {
  background-image: url("../assets/takeDown.gif");
  background-position: 0% 100%;
}
.ship {
  position: absolute;
  top: 0px;
  left: 0px;
}
.ship span {
  width: 180px;
  height: 200px;
  color: #fff;
  border: 0;
  position: absolute;
  display: none;
  background: url("../assets/ship.png") top center no-repeat;
  background-size: 180px;
}

.ship .transfrom {
  background: url("../assets/shipTansfrom.png") top center no-repeat;
  background-size: 120px;
}
.ship .show {
  display: inline-block;
}
.shiploader {
  position: absolute;
  top: 0;
  left: 0;
}
.shiploader span {
  position: absolute;
  width: 60px;
  height: 50px;
  background-size: 60px;
}
.shiploader .gzdown {
  background-image: url("../assets/shiploadergzdown.png");
}
.shiploader .kxdown {
  background-image: url("../assets/shiploadergzdown.png");
}
.shiploader .yxdown {
  background-image: url("../assets/shiploaderyxdown.gif");
}

.shiploader .left {
  background-image: url("../assets/shiploaderleft.png");
}
.shiploader .yleft {
  background-image: url("../assets/shiploaderyleft.gif");
}
.shiploader .gleft {
  background-image: url("../assets/shiploaderleft.png");
}
.shiploader .up {
  background-image: url("../assets/shiploaderup.png");
}
.shiploader .gup {
  background-image: url("../assets/shiploadergup.png");
}
.shiploader .yup {
  background-image: url("../assets/shiploaderyup.gif");
}
.stack .dumper span {
  width: 120px;
  height: 100px;
  background: url("../assets/dumperTansfrom.png") top center no-repeat;
  position: absolute;
  background-size: 80px;
}
.stack .dumper .transfrom {
  background: url("../assets/dumper.png") top center no-repeat;

  background-size: 120px;
}
.slio span {
  width: 60px;
  height: 50px;
  background: url("../assets/siloloader.png") top center no-repeat;
  position: absolute;
  background-size: 55px;
}
html {
  background-color: #092039;
  /* overflow-y: hidden; 
 overflow-x: hidden; */
}
body {
  position: relative;
  top: -3px;
}
.timeaxis .type {
  width: 100%;
  height: 26px;
}
.timeaxis .timeBox {
  width: 1100px;
  float: left;
  overflow: hidden;
  padding-top: 7px;
}
.timeaxis .transverse {
  width: 6000px;
  float: right;
  overflow: hidden;
}
.timeaxis .title {
  float: left;
  color: #fff;
  font-size: 12px;
  line-height: 20px;
  height: 20px;
  width: 40px;
}

.timeaxis {
  position: absolute;
  top: 30px;
  left: 30px;
  width: 1200px;
  height: 500px;
  padding-right: 20px;
  padding-left: 20px;
  background-color: #111d3a;
}
.timeaxis .timebox {
  height: 470px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
.timeaxis .timegauge {
  position: absolute;
  left: -1px;
  top: 0;
  z-index: 0;
}
.timeaxis .timegauge #skorkess {
  opacity: 0.6;
}
.timeaxis .timegauge #skorkeTime {
  position: absolute;
  left: -6px;
  top: -10px;
}
.timeaxis .timecenter {
  width: 1200px;
  position: absolute;
  left: 20px;
  top: 20px;
}
.timeaxis .swiper-container {
  height: 500px;
}
.timeaxis .transverse span {
  float: right;
  width: 4px;
  height: 6px;
  display: inline-block;
  background-color: antiquewhite;
}
.timeaxis .swiper-pagination-bullet {
  width: 12px;
  height: 12px;
}
</style>
