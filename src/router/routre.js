import VueRouter from "vue-router";
import Visit from "../components/HelloWorld.vue";
import Production from '../components/production.vue';
const Routers = [{
    path: '/visit',
    name: 'visit',
    component: Visit
  },
  {
    path: '/production',
    name: 'production',
    component: Production
  },
  {
    path: "*",
    redirect: '/visit'
  }
];

export default Routers;