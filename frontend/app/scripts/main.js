import Vue from 'vue';
import VueRouter from 'vue-router';
import Vuex from 'vuex';
import axios from 'axios';
import App from './views/layouts/app';
import routes from './routers';
import store from './store';
// import store from './store/store'
import API from './config/api';

import iView from 'iview';
import 'iview/dist/styles/iview.css';

Vue.config.productionTip = false;
Vue.use(VueRouter);
Vue.use(Vuex);
Vue.use(iView);
//Vue.prototype.$http = axios;  //axios 设置为全局变量
axios.defaults.baseURL = API.baseURL;

//axios.config.baseURL = 'http://10.21.3.91:18080/'


const router = new VueRouter({
  mode: 'history',
  routes
});

new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
  store: new Vuex.Store(store)
  // store: store
});
