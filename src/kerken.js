// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import Vue from 'vue'
import KerkViewer from "@/KerkViewer";

import BootstrapVue from 'bootstrap-vue/dist/bootstrap-vue.esm'
import KerkConfig from "./helpers/kerken/KerkConfig";

//import {getParam} from './shared'

Vue.use(BootstrapVue);

Vue.config.productionTip = false;

function init(config) {
  Vue.prototype.$adminmode = false;
  Vue.prototype.$config = config; // might it be wiser to just use a global variable for this?
  console.log(config);
  document.title=config.title;
  /* eslint-disable no-new */
  new Vue({
    el: '#gpz',
    render: h => h(KerkViewer),
    components: {KerkViewer},
    template: '<KerkViewer/>'
  });
}
Vue.prototype.$nomenu = false;

let config = new KerkConfig(); // default settings

  config.readJSON({
    title: 'Kerkenkaart',
    url: 'https://geoplaza.vu.nl/cms/research/kerkenkaart/',
    bbox: [
      2.946307507057729,
      50.53321086134227,
      7.708880749245228,
      53.84820079687907
    ],
    crs: "EPSG:3857",
    available_crs: ["EPSG:3857", "EPSG:28992", "EPSG:4326"],
    baselayer: "light",
    services: [{
      url: 'https://geoplaza.vu.nl/projects/kerken/resources/getGeoJSON.php',
      type: 'kerken',
      layers: [{
        "id": "kerken",
        "title": "kerken",
        "label": "kerken",
        "visible": true,
        "opacity": 1.0,
        "zindex": 100
      }]
    }]
  });


init(config);

