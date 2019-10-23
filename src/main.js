import Vue from 'vue'
import VueRouter from 'vue-router';
import App from './App.vue'
import store from './store'
import axios from 'axios'
import Routers from './router/routre';
import VueAxios from 'vue-axios'
import qs from 'qs'

Vue.prototype.$axios = axios    //全局注册，使用方法为:this.$axios
Vue.prototype.qs = qs           //全局注册，使用方法为:this.qs
Vue.use(VueAxios, axios);
Vue.config.productionTip = false

Vue.use(VueRouter);
const RouterConfig = {
  // 使用 HTML5 的 History 路由模式
  //   mode: "history",
  routes: Routers
};
const router = new VueRouter(RouterConfig);
router.beforeEach((to, from, next) => {
  window.document.title = '黄骅港综合数据分析平台';
  next();
});
router.afterEach((to, from, next) => {
  window.scrollTo(0, 0);
});
new Vue({
   el: '#app',
     router: router,
  render: h => h(App)
}).$mount('#app')
