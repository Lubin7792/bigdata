<style>
.popUp {
  z-index: 199;
}
</style>
<template>
  <div>
    <svg class="smile popUp" width="3200" height="1080" v-if="popupDatas">
       <image xlink:href="../assets/errer.gif" :x="belt.x-13"
        :y="belt.y-58" width="80px" height="80px" />
     <text :x="this.belt.x+5" :y="this.belt.y-10" fill="white">
        {{ this.belt.name }}
      </text>
      <line
        :x1="this.belt.ex"
        :y1="this.belt.ey"
        :x2="this.belt.x"
        :y2="this.belt.y+3"
        style="stroke:tomato;stroke-width:2"
      />
      
      <!-- <text
        :x="stacker.x-10"
        :y="stacker.y+15"
        fill="red"
        v-if="stacker"
      >
        {{ stacker.name }}
      </text> 
      <line
        v-if="stacker"
        :x1="stacker.x"
        :y1="stacker.y"
        <!-- :x2="stacker.ex" -->
        :y2="stacker.ey"
        style="stroke:tomato;stroke-width:2"
      /> -->
    </svg>
  </div>
</template>
<script>
export default {
  props: {
    stackerDatas: {
      type: Array
    },
    popupDatas: {
      type: Array
    }
  },
  data() {
    return {
      stackerOrder:[],
      index: 0,
      order: [],

      belt: {
        x: null,
        y: null,
        name: null,
        ex: null,
        ey: null
      },
      stacker: {}
    };
  },
  methods: {
    stackerPosition(data) {
      for (const key in data) {
        if (data[key].name.substring(0, 2) == "SL") {
          let value = data[key].name;
          data[key].x = Number(
            this.$parent.$refs[value][0].style.left.replace(/px/g, "")
          )+80;
          data[key].y =
            Number(this.$parent.$refs[value][0].style.top.replace(/px/g, "")) -
            30;
          data[key].ex =
            Number(this.$parent.$refs[value][0].style.left.replace(/px/g, ""))+40
            ;
          data[key].ey =
            Number(this.$parent.$refs[value][0].style.top.replace(/px/g, "")) +
            10;
        }
      }
      if (this.timerStacker) {
        window.clearInterval(this.timerStacker);
      }
       let arraydata = [];
      this.stackerOrder = [];
      for (let index = 0; index < data.length; index++) {
        arraydata.push(index);
      }

      function randomsort(a, b) {
        return Math.random() > 0.5 ? -1 : 1;
      }
      arraydata.sort(randomsort);
      this.stackerOrder = JSON.parse(JSON.stringify(arraydata));

      this.timerStacker = setInterval(() => {
        this.stackerSvg(data, arraydata);
      }, 9000);

    },
    stackerSvg(data,arraydata){
      let num = null;
      if(this.stackerOrder.length == 0){
        this.stackerOrder=JSON.parse(JSON.stringify(arraydata));
      }
      num = this.stackerOrder.pop();
      this.stacker = data[num];


    },
    beltSvg(data, arraydata) {
      let num = null;
      if (this.order.length == 0) {
        this.order = JSON.parse(JSON.stringify(arraydata));
      }
      num = this.order.pop();
      let width = 20;
      if (data[num].y == data[num].ey) {
        let statu = 1;
        data[num].x > data[num].ex ? (statu = 1) : (statu = -1);
        this.belt.name = data[num].name;
        this.belt.x = data[num].x + width * 2;
        this.belt.y = data[num].y - width * 2;
        if (statu == -1) {
          this.belt.ex = data[num].x - (width * statu) / 2;
        } else {
          this.belt.ex = data[num].x - width * statu;
        }
        this.belt.ey = data[num].y;
      } else {
        let status = 1;
        data[num].y > data[num].ey ? (status = 1) : (status = -1);
        this.belt.name = data[num].name;
        this.belt.x = data[num].x + width * 2;
        this.belt.y = data[num].y - width;
        this.belt.ex = data[num].x - width * status;
        this.belt.ey = data[num].y - width * status;
      }
    },
    beltPopup(newdata, olddata) {
      if (this.timerBelt) {
        window.clearInterval(this.timerBelt);
      }
      let arraydata = [];
      this.order = [];
      for (let index = 0; index < newdata.length; index++) {
        arraydata.push(index);
      }

      function randomsort(a, b) {
        return Math.random() > 0.5 ? -1 : 1;
      }
      arraydata.sort(randomsort);
      this.order = JSON.parse(JSON.stringify(arraydata));

      this.timerBelt = setInterval(() => {
        this.beltSvg(newdata, arraydata);
      }, 10000);
    }
  },
  watch: {
    popupDatas: function(data, olddata) {
      this.beltPopup(data, olddata);
    },
    stackerDatas: function(data) {
      this.stackerPosition(data);
    }
  }
};
</script>