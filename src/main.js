// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import Vue from 'vue'
import App from './App'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faArrowLeft,faArrowRight,faLayerGroup } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faArrowLeft,faArrowRight,faLayerGroup);

Vue.component('font-awesome-icon', FontAwesomeIcon);


import BootstrapVue from 'bootstrap-vue'
Vue.use(BootstrapVue);

Vue.config.productionTip = false;

export const GpzEventBus = new Vue();

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
});
