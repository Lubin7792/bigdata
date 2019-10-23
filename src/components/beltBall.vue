<template>
  <div>
    <div class="nowtime" v-if="nowtime">
      <em></em>

      <span class="year">{{ this.nowtime.year }}</span>
      <span class="time">{{ this.nowtime.now }}</span>
    </div>
    <svg
          class="smile"
          version="1.1"
          width="3200"
          height="1080"
          baseProfile="full"
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
              <stop offset="0%" style="stop-color:rgba(132,230,208,0.25)" />
              <stop offset="100%" style="stop-color:rgba(255,255,255,0.15)" />
            </radialGradient>
          </defs>

          <circle
            v-for="(value,index) in this.svgdata"
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
</template>
<script>
export default {
  props:{
    svgdata:{
      type:Array
    }
  },
  data(){
    return{
      nowtime: "",
    }
  },
  mounted() {
     this.timertime = setInterval(() => {
      let time;
      var now = new Date();
      let n, y, r, s, f, m;
      n = now.getFullYear();
      y = now.getMonth() + 1;
      r = now.getDate();
      s = now.getHours();
      // s=now.toLocaleString('chinese', { hour12: false })
      if (s < 10) {
        s = "0" + s;
      }

      f = now.getMinutes();
      if (f < 10) {
        f = "0" + f;
      }
      time={
        year:" " + n + "年  " + y + "月" + r + "日  ",
        now:" " + s + ":" + f
      }
     
      this.nowtime=time;
    }, 1000 * 2);
  },
  methods:{
     svgpath(value){
   
      // let path = M10*n+","+50 T170,70"
      let path ="M"+value.bx+","+value.by+" "+ "T"+value.ex+","+value.ey;
      return path
    },
     svgtime(value){
      let times
      // 两点之间的距离
       let dx = Math.abs(value.bx - value.ex);
       let dy = Math.abs(value.by - value.ey);
       times = Math.ceil(Math.sqrt(Math.pow(dx,2)+Math.pow(dy,2))/50);
      times<2?times=2:'';
      return times;
    },
  }
}
</script>