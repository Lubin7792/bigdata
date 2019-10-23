<template>
  <div id="app">
   
     <router-view></router-view>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import production from './components/production'
export default {
  name: 'app',
  components: {
    HelloWorld,
    production
  }
}
</script>

<style>
#app {
  font-family: 'Microsoft YaHei', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #fff;
  font-family: 微软雅黑;
  /* color: #2c3e50; */
}
body{
  margin: 0;
}
html {
  background-color: #092039;
  /* overflow-y: hidden; 
 overflow-x: hidden;  */
}
</style>
