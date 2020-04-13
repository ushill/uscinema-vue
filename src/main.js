// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'

Vue.prototype.axios = axios
Vue.prototype.axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';

Vue.config.productionTip = false
// Vue.prototype.server_host = 'http://192.168.1.100:5004'
Vue.prototype.server_host_java = 'http://47.105.137.128:8080'
Vue.prototype.server_host_static = 'http://47.105.137.128:9090'
Vue.prototype.IsPC = function() {
  var userAgentInfo = navigator.userAgent;
  var Agents = ["Android", "iPhone",
    "SymbianOS", "Windows Phone",
    "iPad", "iPod"];
  var flag = true;
  for (var v = 0; v < Agents.length; v++) {
    if (userAgentInfo.indexOf(Agents[v]) > 0) {
      flag = false;
      break;
    }
  }
  return flag;
}

Vue.prototype.appwid = function() {
// console.log('screen-width', window.screen.width)
  var appwid = 1170
  if(!this.IsPC()){
    if(window.screen.width <= 460){
// this.wid =
    }else if(window.screen.width < 768){
      appwid = window.screen.width * 3.33 * 0.95
    }else if(window.screen.width < 992){
      appwid = window.screen.width * 3.33 * 0.75
    }else{
      appwid = window.screen.width * 3.33 * 0.7
    }
  }
// console.log(appwid)
  return appwid
}

// Vue.prototype.route_before_login =
Vue.prototype.global = {route_before_login: '/', token: '', user: {id: '', username: '', nickname: '', image: '', is_critic: 0}}
// Vue.prototype.global.token = sessionStorage.getItem("token");
Vue.prototype.global.token = sessionStorage.getItem("token")
if(!Vue.prototype.global.token){
  Vue.prototype.global.token = localStorage.getItem("token")
}

Vue.prototype.global.user.id = sessionStorage.getItem("user_id")
if(Vue.prototype.global.user.id){
  Vue.prototype.global.user.nickname = sessionStorage.getItem("user_nickname")
  Vue.prototype.global.user.image = sessionStorage.getItem("user_image")
  Vue.prototype.global.user.is_critic = sessionStorage.getItem("is_critic")
  Vue.prototype.global.user.username = sessionStorage.getItem("username")
  Vue.prototype.global.user.username = localStorage.getItem("user_authority")
}else{
  Vue.prototype.global.user.id = localStorage.getItem("user_id")
  if(Vue.prototype.global.user.id){
    Vue.prototype.global.user.nickname = localStorage.getItem("user_nickname")
    Vue.prototype.global.user.image = localStorage.getItem("user_image")
    Vue.prototype.global.user.is_critic = localStorage.getItem("is_critic")
    Vue.prototype.global.user.username = localStorage.getItem("username")
    Vue.prototype.global.user.username = localStorage.getItem("user_authority")
  }
}

// console.log('fkj,', Vue.prototype.global)
// 注册一个全局自定义指令 `v-focus`
Vue.directive('focus', {
// 当被绑定的元素插入到 DOM 中时……
  inserted: function (el) {
    // 聚焦元素
    el.focus()
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
