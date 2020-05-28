// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import Vue from 'vue'
import KloosterViewer from "@/KloosterViewer";

import {library} from '@fortawesome/fontawesome-svg-core'
import {faArrowLeft, faArrowRight, faLayerGroup} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'

library.add(faArrowLeft, faArrowRight, faLayerGroup);

Vue.component('font-awesome-icon', FontAwesomeIcon);

import BootstrapVue from 'bootstrap-vue/dist/bootstrap-vue.esm'
import KloosterConfig from "@/helpers/kloosters/KloosterConfig";


Vue.use(BootstrapVue);

Vue.config.productionTip = false;


function getParam(name) {
  if (name = (new RegExp('[?&]' + encodeURIComponent(name) + '=([^&]*)')).exec(location.search))
    return decodeURIComponent(name[1]);
}

function init(config){
  Vue.prototype.$adminmode = false;
  Vue.prototype.$config = config; // might it be wiser to just use a global variable for this?

  /* eslint-disable no-new */
  new Vue({
    el: '#gpz',
    components: {KloosterViewer},
    template: '<KloosterViewer/>'
  });
}

let config = new KloosterConfig(); // default settings

config.readJSON({
  title: 'Kloosterkaart',
  services: [{
  url: 'https://geoplaza.labs.vu.nl/projects/kloosters_dev/resources/getGeoJSON2.php',
  type: 'kloosters',
  layers: [{
    "id": "kloosters",
    "title": "kloosters",
    "label": "kloosters",
    "visible": true,
    "opacity": 1.0,
    "zindex": 93
  }]
}]});
init(config);
