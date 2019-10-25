<style>
@import "./style.css";
</style>
<template>
  <div class="hello">
   <iframe src="http://10.60.127.130/hhgbi/v5/design/report/share/8fe9dc40a3cd4df5a685597dfeffef63?link=eyJhbGciOiJIUzI1NiJ9.eyJyZXBvcnRJZCI6IjhmZTlkYzQwYTNjZDRkZjVhNjg1NTk3ZGZlZmZlZjYzIiwidXNlcklkIjoiYjVmMGMyZWUtNjQwZi00MDM5LWE0ZDQtOTE4YjU1MzU0ODk4IiwianRpIjoiand0In0.NR_pdt1DOvkoJex0ZyNo0iINRfL0qlK4cgWz_ZPk_tc" frameborder="0" width="1280px" height="1110px"  scrolling="auto" style="position:absolute;left: 4480px;top:35px"></iframe>
    <iframe style="position:absolute;left:0px; top:35px" width="1280px" height="1030px" src="http://10.60.127.130/hhgbi/v5/design/report/share/b5d9738d395241aea4554a3643bb1789?link=eyJhbGciOiJIUzI1NiJ9.eyJyZXBvcnRJZCI6ImI1ZDk3MzhkMzk1MjQxYWVhNDU1NGEzNjQzYmIxNzg5IiwidXNlcklkIjoiYjVmMGMyZWUtNjQwZi00MDM5LWE0ZDQtOTE4YjU1MzU0ODk4IiwianRpIjoiand0In0.6TAaAwBwFIWzUlezb5nclYAStGFlmRPHNkm0OJJ7XNo" frameborder="0"></iframe>
    <iframe style="position:absolute;left: 1450px;top:900px" src="http://10.60.127.130/hhgbi/view/report?viewlet=wjytest/%E6%BD%AE%E4%BD%8D%E8%AE%A1.frm" frameborder="0"></iframe>
  <stackdetails v-show='this.stackShow' :stackdata="this.stackdetails"></stackdetails>
    <div class="weather" v-if="weatherData">
      <span class="namebg"></span>
      <span class="titleBig"></span>
      <em></em>
      <p>
        <span class="cc">{{ weatherData.rows[0][0].toFixed(1) }}℃</span>
        &nbsp;
        <span class="sd">{{ weatherData.rows[0][1].toFixed(1) }}%</span>
        &nbsp;
        <span class="fx">{{ weatherData.rows[0][2] }}°</span>
        &nbsp;
        <span class="fs">{{ weatherData.rows[0][3].toFixed(1) }}m/s</span>
        &nbsp;
        <span class="njd">{{ weatherData.rows[0][4] }}m</span>
      </p>
    </div>
    <div class="powerPlant"></div>
    <div class="legend">
      <img src="../assets/Legend.png" alt="" />
    </div>

    <div class="timeaxis" @mouseover="elementBShow()" @mouseenter="on_top_enter" @mouseleave="on_top_leave">
      <img src="../assets/timeaxis.png" class="timebg" alt="">
      <p class="titlemax">设备运行状态</p>
      <div class="timegauge">
        <canvas ref="canvas" id="skorkess" width="1280" height="500">
          标尺
        </canvas>
        <canvas id="skorkeTime" width="1280" height="50"> </canvas>
      </div>
      <div 
      class="elementBox" 
      :style="{top:this.timepopup.value.y -20+ 'px',left:this.timepopup.value.x-4470 + 'px'}"
      v-if="this.timepopup.show" 
      >
        <p>
          设备名称:{{this.timepopup.value.name}}
        </p>
        <p>
          开始时间:{{this.timepopup.value.startime}}
        </p>
        <p>
          结束时间:{{this.timepopup.value.endtime}}
        </p>
        <p>
          设备状态:{{this.timepopup.value.status}}
        </p>
      </div>
      <div class="timecenter" v-if="historyData">
        <swiper :options="swiperOption" class="swiper-wrap" ref="mySwiper" v-if='showNo'>
          <swiper-slide v-for="(item, index) in historyData" :key="index">
            <div class="timeboxs">
              <div v-for="(device, indexO) in item" class="type">
                <span class="title">{{ titleName(indexO) }}:</span>
                <div class="timeBox" :style="timeBoxStyle(historyData)">
                  <div class="transverse">
                    <span
                    class="luprivate"
                      v-for="(unit, indexT) in device"
                      :class="timeClass(unit)"
                      :style="timeStyle(unit)"
                      :data-status="unit.status"
                      :data-endtime="unit.endtime/1000"
                      :data-startime="unit.startime/1000"
                      :data-name="unit.device_name"
                    >
                    <em>
                      
                    </em>
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
    <!-- <shiptime :shiptimedata="this.shipData"></shiptime> -->
    <div class="skorke">
      <div class="svgvan">
        <canvas
          class="can"
          ref="canvas"
          id="skorke01"
          width="3200"
          height="1080"
        >
          皮带
        </canvas>
        <beltBall :svgdata="this.svgdatas"></beltBall>
        <beltPopup
          :stackerDatas="this.machinePosition"
          :popupDatas="this.popupData"
        ></beltPopup>
      </div>
      <div class="stackbutton">
        <button v-on:click="showDis()">展示堆场号</button>
        <button v-on:click="showDisT()">展示堆场量</button>
        <button v-on:click="showDisO()">展示设备号</button>
        <button v-on:click="showDisS()">展示装船量</button>
        <button class="switch" v-on:click="switchTab()"></button>
      </div>
      <div class="stack" v-if="stackData">
        <div class="stackname">
          <p
            v-for="(name, index) in positionData.stackname"
            :style="{ left: name.x - 105 + 'px', top: name.y - 15 + 'px' }"
          >
            {{ index }}#
          </p>
          <p
            v-for="(name, index) in positionData.siloname"
            :style="{ left: name.x - 105 + 'px', top: name.y - 20 + 'px' }"
          >
            {{ index }}
          </p>
        </div>
        <div class="coalpile">
          <i class="blank"
          v-for="(key, index) in positionData.stack"
            @click="stackNames(index,key)"
            :style="{
              left: key.x - 10 + 'px',
              top: key.y - 30 + 'px'
            }"></i>
          <span
            v-for="(key, index) in positionData.stack"
            :style="{
              left: key.x - 10 + 'px',
              top: key.y - 30 + 'px',
              zIndex: key.zindex
            }"
            :class="stackStatus(index)"
            :key="index + 'i'"
          >
            <p class="yardName" v-show="yardName">
              {{ index }}
            </p>
            <p class="yardName" v-show="yardSize">
              {{ stackSize(index) }}
            </p>
          </span>
          <img
            src="../assets/stackframe.png"
            v-for="(key, index) in positionData.stack"
            :style="{ left: key.x - 25 + 'px', top: key.y - 55 + 'px' }"
            :key="index + 1"
            :class="[stackframe(index)]"
            alt=""
          />
          <i class="blank"
            @click="stackNames(index,key)"
            v-for="(key, index) in positionData.silo"
            :style="{ left: key.x - 10 + 'px', top: key.y - 20 + 'px' }"
          ></i>
          <p
            v-for="(key, index) in positionData.silo"
            :style="{ left: key.x - 15 + 'px', top: key.y - 40 + 'px' }"
            :key="index"
            :class="[stacksilo(index)]"
          >
            <span class="siloName" v-show="yardName">
              {{ index }}
            </span>
            <P v-show="yardSize"> {{ stackSize(index) }}</P>
          </p>
        </div>
        <div class="stacker" v-if="beltData">
          <span
            :style="stackerPosition(index)"
            v-for="(key, index) in positionData.stacker"
            :key="index"
            :class="[stackerClass(index)]"
          >
            <p class="stackerName" v-show="deviceName">{{ index }}</p>
            <img src="../assets/stackgz.png" alt="" />
          </span>
        </div>
        <div class="slio">
          <span
            v-for="(key, index) in positionData.silolader"
            :style="slioloaderPosition(key)"
            :class="[stackerrer(index)]"
            :key="index"
            ><p class="slioName" v-show="deviceName">{{ key }}</p>
            
          </span>
        </div>
        <div class="dumper">
          <span
            v-for="(key, index) in positionData.dumper"
            :style="{ left: key.x + 'px', top: key.y + 'px' }"
            :key="index"
            :class="[stackerrer(index), dumpertransfrom(key.transfrom)]"
            alt=""
            ><p
            class="dumperName"
             v-show="deviceName">{{ index }}</p>
            <img src="../assets/stackgz.png" alt="" />
          </span>
        </div>
      </div>
      <div class="ship" v-if="shipData">
        <div
          v-for="(ship, index) in positionData.ship"
          :class="[
            shiptransfrom(ship.transfrom),
            shipShow(index),
            shipstatus(index)
          ]"
          :style="{ left: ship.x - 10 + 'px', top: ship.y + 2 + 'px' }"
          :key="index"
          alt=""
        >
          <span>
            <p v-show="!shipNameSize" :class="[shipnames(index)]">{{ shipName(index) }}</p>
            <p v-show="shipNameSize" :class="[shipnames(index)]">{{ shipSize(index) }}</p>
          </span>
        </div>
      </div>
      <div class="addship" v-if="shipData">
        <div
          v-for="(ship, index) in positionData.addship"
          :class="[shipShow(index)]"
          :style="{ left: ship.x - 10 + 'px', top: ship.y - 2 + 'px' }"
        >
          <p>{{ shipName(index) }}</p>
        </div>
      </div>
      <div class="shiploader" v-if="beltData">
        <span
          v-for="(position, index) in positionData.shiploader"
          :key="index"
          :style="shiploaderPosition(index)"
          :class="[shipOne(index), index, stackerrer(index)]"
          :ref="index"
          alt=""
        >
          <p class="shiplaName" v-show="deviceName">{{ index }}</p>
          <img src="../assets/stackgz.png" alt="" />
        </span>
      </div>
      <div class="track" v-if="trainData">
        <span
          v-for="(item, index) in positionData.track"
          :style="{ left: item.x + 'px', top: item.y + 'px' }"
          :class="{ transfrom: item.transfrom }"
        >
          <em :class="[train(index)]"></em>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import "swiper/dist/css/swiper.css";
import { swiper, swiperSlide } from "vue-awesome-swiper";
import { clearInterval } from "timers";
import beltBall from "./beltBall";
import shiptime from "./shiptime";
import beltPopup from "./beltPopup";
import stackdetails from './stackdetails';
import positionData from "../assets/skroke.js";
import jq from "jquery";
export default {
  name: "HelloWorld",
  data() {
    const that = this;
    return {
       stackdetails:{
        name:'',
        capacity:'',
        x:'',
        y:''
        
      },
      stackShow:false,
      yardName: false,
      yardSize: false,
      deviceName: false,
      shipNameSize:false,
      shiploaderdata: "",
      //皮带装船机等数据
      beltData: null,
      // 煤堆数据
      stackData: null,
      //泊位信息
      shipData: null,
      // 时间轴
      historyData: null,
      trainData: null,
      weatherData: null,
      showNo: true,
      //本地定位数据
      positionData: positionData,
      machinePosition: [],
      timepopup: {
        value: 0,
        show: false
      },
      temporary: {
        stacker: []
      },
      svgdatas: [],
      popupData: [],

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
          delay: 30000,
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
          click: function(e) {
            if (e.srcElement.className.indexOf("luprivate") == -1) {
              return false;
            }
            let value = JSON.parse(JSON.stringify(e.srcElement.dataset));
            if (!!Number(value.name)) {
              value.name = "CD" + value.name;
            }
            switch (value.status) {
              case "yx":
                value.status = "运行";
                break;
              case "tl":
                value.status = "铁路";
                break;
              case "kx":
                value.status = "空闲";
                break;
              case "gz":
                value.status = "故障";
                break;
            }
            let startT = new Date(Number(value.startime));
            let endT = new Date(Number(value.endtime));
            value.startime = startT.getHours() + ":" + startT.getMinutes();
            value.endtime = endT.getHours() + ":" + endT.getMinutes();
            value.x = e.pageX - 20;
            value.y = e.pageY - 500;
            console.log(value.x);
            value.y > 377 ? (value.y = 377) : "";
            value.x > 5510 ? (value.x = 5510) : "";
            that.showValue(value);
            // console.log(e)
            let elemen = e.view;
            // console.log(e.view.getComputedStyle(elemen))
            //     // const realIndex = this.realIndex;
            //     // console.log(e.swiper)
            //     // vm.swiperOption(realIndex)    //要执行函数
          },
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
  computed: {
    
  },
  components: {
    shiptime,
    beltPopup,
    beltBall,
    swiper,
    swiperSlide,
    stackdetails
  },
  methods: {
     switchTab(){
    this.$router.push('/visit')
    },
      stackNames(name,key){
let data;
      data={
       capacity:this.stackSize(name),
       name:name,
       x:key.x+1380,
       y:key.y-30,
      };
        this.stackShow=true;
        this.stackdetails=data;
    },
    shipSize(name){
       let size;
      this.shipData.map(item => {
        if (item[0] == name && !!item[1]) {
          size = Math.round(item[3])+"吨";
        }
      });
      return size;
    },
    stackSize(name) {
      let size;
      this.stackData.rows.map(item => {
        if (item[0] == name) {
          size = Math.round(item[1]) + "吨";
        }
      });
      return size;
    },
    showDis() {
      if(this.yardSize){
        this.yardSize=false;
      }
        this.yardName = !this.yardName;
      
    },
    showDisO() {
      this.deviceName = !this.deviceName;
    },
    showDisT() {
    if(this.yardName){
      this.yardName=false;
    }
  this.yardSize=!this.yardSize;
      
    },
    showDisS(){
      this.shipNameSize=!this.shipNameSize;
    },
    stacksilo(name) {
      let status = {};
      this.stackData.rows.map(item => {
        if (item[0] == name) {
          status.temperature = item[2];
        }
      });
      if (status.temperature > 40) {
        return "gw slio";
      }
      return "slio";
    },
    shiptransfrom(name) {
      if (name) {
        return "transfrom";
      }
    },
    stackframe(name) {
      return "frame";
    },
    train(name) {
      let classname;
      for (const index in this.trainData) {
        if (name.toUpperCase() == this.trainData[index][0]) {
          classname = this.trainData[index][1];
        }
      }
      if (!classname) {
        return "null";
      }
      if (classname == 1) {
        return "one";
      }
      if (classname == 2) {
        return "two";
      }
      if (classname > 2) {
        return "three";
      }
    },
    dumpertransfrom(name) {
      if (name) {
        return "transfrom";
      }
    },
    stackerrer(name) {
      let status;
      for (const key in this.beltData) {
        if (this.beltData[key].device_belt_name_simplify == name) {
          status = this.beltData[key].status;
          if (name.substring(0, 2) == "CD" && name.length > 3) {
            if (status == "gz") {
              return "gzT";
            }
            if (status == "yx") {
              return "yxT";
            }
            if (status == "kx") {
              return "kxT";
            }
          }
        }
      }
      if (status == "gz") {
        return "gz";
      }
      if (status == "yx") {
        return "yx";
      }
      if (status == "kx") {
        return "kx";
      }
    },
    timeClass(value) {
      if (value.status == "yx") {
        return "timeyx";
      }
      if (value.status == "kx") {
        return "timekx";
      }
      if (value.status == "gz") {
        return "timegz";
      }
      if (value.status == "tl") {
        return "timetl";
      }
    },
    elementBShow() {
      this.timepopup.show = false;
    },
    showValue(value) {
      this.timepopup.show = true;
      this.timepopup.value = value;
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
      // if (value.status == "yx") {
      //   color = "#57fef8";
      // }
      // if (value.status == "kx") {
      //   color = "#2b68ff";
      // }
      // if (value.status == "gz") {
      //   color = "red";
      // }
      // if (value.status == "tl") {
      //   color = "#aeaeae";
      // }
      style = { width: widthPx + "px" };
      // style = { width: widthPx + "px", "background-color": color };
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
      // 时间轴数据
    },
    //通过获得的swiper对象来暂停自动播放
    on_top_enter() {
      if (!!this.historyData) {
        this.$refs.mySwiper.swiper.autoplay.stop();
      }
    },
    on_top_leave() {
      if (!!this.historyData) {
        this.$refs.mySwiper.swiper.autoplay.start();
      }
    },
    slioloaderPosition(name) {
      let x, y, style;
      for (let key in this.beltData) {
        if (this.beltData[key].device_belt_name_simplify == name) {
          // 筒仓名称
          let status = this.beltData[key].berth_pile_no;

          for (let index in positionData.silo) {
            if (index == status) {
              y = positionData.silo[index].y - 50;
              x = positionData.silo[index].x - 35;
            }
          }
        }
      }
      style = { left: x + 18 + "px", top: y + 13 + "px" };

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
      let widths = 33;
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
          style = { left: x + "px", top: y - 10 + "px" };

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
    shipstatus(name) {
      //A收集该泊位装船机的状态判断船的状态，首先判断finishtime是否完成，接着判断该泊位上是否有运行的装船机
      //  根据开工时间判断

      let state;
      for (const key in this.shipData) {
        if (name == this.shipData[key][0]) {
          if (this.shipData[key][5]) {
            // state=false;
            return "wc";
          }
          if (this.shipData[key][6]) {
            return "yx";
          } else {
            return "kx";
          }
        }
      }
      //  根据装船机判断
      // let num=[];
      //  for (const key in this.beltData) {
      //    if (name == this.beltData[key].berth_pile_no) {
      //     num.push(this.beltData[key].status)
      //     }
      //  }
      //  if(num.indexOf('yx')==-1){
      //    return 'kx'
      //  }else{
      //    return 'yx'
      //  }
    },
    shipnames(name) {
      if (name.substring(2, 3) == "0") {
        return "left";
      }
      if (name.substring(0, 1) == "1" || name.substring(0, 1) == "3") {
        return "top";
      }
      if (name.substring(0, 1) == "2" || name.substring(0, 1) == "4") {
        return "down";
      }
    },
    shipShow(name) {
      let show;
      this.shipData.map(item => {
        if (item[0] == name && !!item[1]) {
          show = 1;
        }
      });
      return show == 1 ? "show" : "";
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
        if (status == "kx") {
          return "take";
        }
        if (status == "gz") {
          return "take gz";
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
            return "stackDown  name";
          }
        }
        if (status == "kx") {
          return "stack";
        }
        if (status == "gz") {
          return "stack gz";
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
        if (status == "kx") {
          return "take";
        }
        if (status == "gz") {
          return "take gz";
        }
      }
    },
    stackerPosition(name) {
      let x, y, style, indexs;
      for (let key in this.beltData) {
        if (this.beltData[key].device_belt_name_simplify == name) {
          let status = this.beltData[key].berth_pile_no;
          // 发生故障用默认值
          if (status == "zw" || status == "wu") {
            if (!positionData.stacker[name]) {
              return false;
            }
            x = positionData.stacker[name].x + 80;
            y = positionData.stacker[name].y - 20;
            style = { left: x + "px", top: y + "px" };
            return style;
          }
          for (let index in positionData.stack) {
            if (index == status) {
              indexs = positionData.stack[index].zindex;
              let state = this.downUp(index, name);
              if (name == "R1" || name == "R2") {
                y = positionData.stack[index].y - 30 + state * 25;
              } else {
                y = positionData.stack[index].y - 35 + state * 22;
              }
              x = positionData.stack[index].x + 30 * state;
            }
          }
        }
      }
      style = { left: x - 30 + "px", top: y - 2 + "px", zIndex: indexs };
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
        status.capacity < 5000 &&
        status.temperature < 50
      ) {
        return "small";
      }
      if (
        5000 < status.capacity &&
        status.capacity < 10000 &&
        status.temperature < 50
      ) {
        return "minddle";
      }
      if (
        10000 < status.capacity &&
        status.capacity < 15000 &&
        status.temperature < 50
      ) {
        return "big";
      }
      if (
        15000 < status.capacity &&
        status.capacity < 20000 &&
        status.temperature < 50
      ) {
        return "max";
      }
      if (status.capacity > 20000 && status.temperature < 50) {
        return "maxbig";
      }

      if (
        0 < status.capacity &&
        status.capacity < 5000 &&
        status.temperature >= 50
      ) {
        return "smallRed";
      }
      if (
        5000 < status.capacity &&
        status.capacity < 10000 &&
        status.temperature >= 50
      ) {
        return "middleRed";
      }
      if (
        10000 < status.capacity &&
        status.capacity < 15000 &&
        status.temperature >= 50
      ) {
        return "bigRed";
      }
      if (
        15000 < status.capacity &&
        status.capacity < 20000 &&
        status.temperature >= 50
      ) {
        return "maxRed";
      }
      if (status.capacity > 20000 && status.temperature > 50) {
        return "maxbigRed";
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
      let svgdata = [],
        popup = [],
        machine = [],
        sW = 210,
        sT = 10,
        esW = 170,
        esT = 30,
        csW = 130,
        csT = 40,
        cesW = 100,
        cesT = 0;
      datas.map(item => {
        let dataname;
        if (
          item.status == "yx" &&
          item.device_belt_name_simplify.slice(0, 1) == "B"
        ) {
          dataname = item.device_belt_name_simplify;
          for (const key in positionData.belt) {
            if (key == dataname) {
              svgdata.push(positionData.belt[key]);
            }
          }
        }
        if (
          item.status == "gz" &&
          item.device_belt_name_simplify.slice(0, 1) == "B"
        ) {
          dataname = item.device_belt_name_simplify;
          for (const key in positionData.belt) {
            if (key == dataname) {
              let obj = {
                name: dataname,
                x: positionData.belt[key].bx,
                y: positionData.belt[key].by,
                ex: positionData.belt[key].ex,
                ey: positionData.belt[key].ey
              };
              popup.push(obj);
            }
          }
        }
        // 装船机设备
        if (
          item.status == "gz" &&
          item.device_belt_name_simplify.slice(0, 2) == "SL"
        ) {
          dataname = item.device_belt_name_simplify;
          for (const key in positionData.shiploader) {
            if (key == dataname) {
              let obj = {
                name: dataname,
                x: positionData.shiploader[key].x,
                y: positionData.shiploader[key].y - 20
              };
              machine.push(obj);
            }
          }
        }
        // 翻车机
        if (
          item.status == "gz" &&
          item.device_belt_name_simplify.slice(0, 2) == "CD"
        ) {
          dataname = item.device_belt_name_simplify;
          for (const key in positionData.dumper) {
            if (key == dataname) {
              let obj = {
                name: dataname,
                x: positionData.dumper[key].x + csW,
                y: positionData.dumper[key].y - csT,
                ex: positionData.dumper[key].x + cesW,
                ey: positionData.dumper[key].y - cesT
              };
              machine.push(obj);
            }
          }
        }
        // 堆取料机
        if (
          item.status == "gz" &&
          item.device_belt_name_simplify.slice(0, 1) == "R"
        ) {
          dataname = item.device_belt_name_simplify;
          let obj = {
            name: dataname,
            x:
              Number(this.stackerPosition(dataname).left.replace(/px/g, "")) +
              sW,
            y:
              Number(this.stackerPosition(dataname).top.replace(/px/g, "")) -
              sT,
            ex:
              Number(this.stackerPosition(dataname).left.replace(/px/g, "")) +
              esW,
            ey:
              Number(this.stackerPosition(dataname).top.replace(/px/g, "")) +
              esT
          };
          machine.push(obj);
        }
        if (
          item.status == "gz" &&
          item.device_belt_name_simplify.slice(0, 2) == "SR"
        ) {
          dataname = item.device_belt_name_simplify;
          let obj = {
            name: dataname,
            x:
              Number(this.stackerPosition(dataname).left.replace(/px/g, "")) +
              sW,
            y:
              Number(this.stackerPosition(dataname).top.replace(/px/g, "")) -
              sT,
            ex:
              Number(this.stackerPosition(dataname).left.replace(/px/g, "")) +
              esW,
            ey:
              Number(this.stackerPosition(dataname).top.replace(/px/g, "")) +
              esT
          };
          machine.push(obj);
        }
        if (
          item.status == "gz" &&
          item.device_belt_name_simplify.slice(0, 1) == "S" &&
          item.device_belt_name_simplify.slice(1, 2) != "L" &&
          item.device_belt_name_simplify.slice(1, 2) != "F"
        ) {
          dataname = item.device_belt_name_simplify;
          let obj = {
            name: dataname,
            x:
              Number(this.stackerPosition(dataname).left.replace(/px/g, "")) +
              sW,
            y:
              Number(this.stackerPosition(dataname).top.replace(/px/g, "")) -
              sT,
            ex:
              Number(this.stackerPosition(dataname).left.replace(/px/g, "")) +
              esW,
            ey:
              Number(this.stackerPosition(dataname).top.replace(/px/g, "")) +
              esT
          };
          machine.push(obj);
        }
      });
      this.machinePosition = machine;
      this.popupData = popup;
      this.svgdatas = svgdata;
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
          color = "#1a4443";
        }
        if (status == "yx" || status2 == "yx") {
          color = "green";
        }
        if (status == "gz" || status2 == "gz") {
          color = "a03d3d";
        }
        return color;
      };
      var skroke = function(context, color, x1, y1, x2, y2) {
        context.beginPath();
        context.moveTo(x1, y1);
        context.lineTo(x2, y2);
        context.lineWidth = 2;
        context.strokeStyle = color || "#1a4443";
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
                ? "green"
                : item.status == "gz"
                ? "#a03d3d"
                : "#1a4443";
            // : "red";
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
    this.getWeather();

      }, 1000 * 120);
    },
    getWeather() {
      this.axios
        .get("/getWeather")
        .then(response => {
          this.weatherData = response.data;
        })
        .catch(response => {
          console.log(response);
        });
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
          this.trainData = response.data.rows;
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
    },
    getShiphistory() {
      this.axios
        .get("/getShiphistory")
        .then(response => {
          // this.handle(response.data);
          console.log(response);
        })

        .catch(response => {
          console.log(response);
        });
    }
  },
  mounted() {
    //设备弹窗
    document.addEventListener('click', (e) => {
    if(e.target.className!='blank'){
      this.stackShow=false;
    }
    console.log()
    })
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
    // this.getShiphistory();
    this.getWeather();
    // this.init();
    // this.axios.get()
    /*-------------------AJAX方式-------------------*/
    // jq.ajax({
    //   //移动端登录需要带__device__=iPhone&terminal=H5
    //   url: "http://10.60.127.130/hhgbi/login/cross/domain",
    //   data: {
    //     fine_username: "bigscreen",
    //     fine_password: "bigscreen_2019",
    //     validity: -1
    //   },
    //   timeout: 5000,
    //   dataType: "jsonp",
    //   jsonp: "callback",
    //   success: function(res) {
    //     // alert('登录成功');
    //     var token = res.accessToken;
    //     // window.location.href = "http://mobile.finebi.com:37700/webroot/decision/url/mobile"
    //     // 原则上登录成功后不用再带token参数，当前有bug正在修复
    //     // document.getElementById("myframe1").src= "http://10.60.127.130/hhgbi/v5/design/report/6d6cb0683bbf44e8bd406119943f2943/view?token=" + token;
    //     // document.getElementById("myframe2").src= "http://10.60.127.130/hhgbi/v5/design/report/2e78077d3e424219a89cccdab450109c/view?token=" + token;
    //   },
    //   error: function() {
    //     alert("登录失败");
    //   }
    // });

    setTimeout(() => {
      this.refreshData();
    }, 1000 * 2);
  },
  beforeDestroy() {
    if (this.timertime) {
      clearInterval(this.timer); // 在Vue实例销毁前，清除我们的定时器
    }
    if (this.timer) {
      window.clearInterval(this.timer);
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
