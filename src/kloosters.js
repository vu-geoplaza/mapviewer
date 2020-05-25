// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import Vue from 'vue'
import KloosterViewer from "@/KloosterViewer";

import {library} from '@fortawesome/fontawesome-svg-core'
import {faArrowLeft, faArrowRight, faLayerGroup} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'

import axios from 'axios'

library.add(faArrowLeft, faArrowRight, faLayerGroup);

Vue.component('font-awesome-icon', FontAwesomeIcon);

import BootstrapVue from 'bootstrap-vue/dist/bootstrap-vue.esm'


Vue.use(BootstrapVue);

Vue.config.productionTip = false;


function getParam(name) {
  if (name = (new RegExp('[?&]' + encodeURIComponent(name) + '=([^&]*)')).exec(location.search))
    return decodeURIComponent(name[1]);
}

function init(config){
  Vue.prototype.$adminmode = false;
  Vue.prototype.$config = config;

  /* eslint-disable no-new */
  new Vue({
    el: '#gpz',
    components: {KloosterViewer},
    template: '<KloosterViewer/>'
  });
}

init({
  "crs": "EPSG:28992",
  "title": "kloosterkaart",
  "url": "https://geoplaza.vu.nl/projects/viewer/",
  "bbox": [
    4.178080032326394,
    52.15766739943118,
    5.7009904277084384,
    52.586104748698396
  ],
  "services":[]
});
