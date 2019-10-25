<template>
  <div

  >
       <div 
    :style="{ left: this.stackdata.x + 'px', top: this.stackdata.y -20+ 'px' }"
       class="stackdetails">
       <p>堆场号:{{this.stackdata.name}}</p>
       <p>堆场量:{{this.stackdata.capacity}}</p>
     </div>
  </div>
</template>
<script>
export default {
  props:{
    stackdata:{
      type:Object
    }
  },
  data() {
    return {
      
    }
  },
  mounted() {
  },
}
</script>