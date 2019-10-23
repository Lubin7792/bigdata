<style>
.shiptime{
  position: absolute;
  left: 0;
  top: 30px;
  width: 1260px;
  height: 600px;
  display: inline-block;
}
</style>
<template>
  <div class="shiptime">
    <div v-for="(item,index) in shiptimedata">
      <span>{{item[0]}}</span>
      <span>------------------</span>
      <span>{{item[1]}}</span>
      <span>----</span>
      <span>{{item[3]/item[4]}}</span>
      
      <!-- <p v-for="(name,index) in item">
        {{name}}---{{index}}
      </p> -->
    </div>
  </div>
</template>
<script>
export default {
  props:{
    shiptimedata:{
      type:Array
    }
  }
}
</script>