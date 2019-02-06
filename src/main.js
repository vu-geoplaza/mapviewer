// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import Vue from 'vue'
import GpzViewer from './GpzViewer'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faArrowLeft,faArrowRight,faLayerGroup } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import ViewerConfig from './helpers/ViewerConfig'
import axios from 'axios'

import {register} from 'ol/proj/proj4'
import proj4 from 'proj4';
proj4.defs("EPSG:28992", "+proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +y_0=463000 +ellps=bessel +units=m +no_defs");
register(proj4);

library.add(faArrowLeft,faArrowRight,faLayerGroup);

Vue.component('font-awesome-icon', FontAwesomeIcon);

import BootstrapVue from 'bootstrap-vue/dist/bootstrap-vue.esm'
Vue.use(BootstrapVue);

Vue.config.productionTip = false;

export const GpzEventBus = new Vue();
const datafile=document.getElementById("gpz").dataset.configfile;
const adminmode=document.getElementById("gpz").dataset.adminmode;

try {
  axios.get(datafile).then(function (response) {
      // make app config accessible for all components
      const config = new ViewerConfig();
      config.readJSON(response.data);
      console.log(config);
      Vue.prototype.$config = config;
      if (adminmode === "1") {
        Vue.prototype.$adminmode = true;
      } else {
        Vue.prototype.$adminmode = false;
      }

      /* eslint-disable no-new */
      new Vue({
        el: '#gpz',
        components: {GpzViewer},
        template: '<GpzViewer/>'
      });
    });
} catch (e) {
  console.error(e)
}


