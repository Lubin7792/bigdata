import Vue from 'vue'
import App from './App.vue'
import store from './store'
import axios from 'axios'
import VueAxios from 'vue-axios'
import qs from 'qs'

Vue.prototype.$axios = axios    //全局注册，使用方法为:this.$axios
Vue.prototype.qs = qs           //全局注册，使用方法为:this.qs
Vue.use(VueAxios, axios);
Vue.config.productionTip = false



new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
