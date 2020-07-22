// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import Vue from 'vue'
import KloosterViewer from "@/KloosterViewer";

import BootstrapVue from 'bootstrap-vue/dist/bootstrap-vue.esm'
import KloosterConfig from "@/helpers/kloosters/KloosterConfig";

Vue.use(BootstrapVue);

Vue.config.productionTip = false;


function getParam(name) {
  if (name = (new RegExp('[?&]' + encodeURIComponent(name) + '=([^&]*)')).exec(location.search))
    return decodeURIComponent(name[1]);
}

function init(config) {
  Vue.prototype.$adminmode = false;
  Vue.prototype.$config = config; // might it be wiser to just use a global variable for this?

  /* eslint-disable no-new */
  new Vue({
    el: '#gpz',
    components: {KloosterViewer},
    template: '<KloosterViewer/>'
  });
}

let mode = 'by_year';
let config = new KloosterConfig(); // default settings
if (typeof getParam('year') === 'string') {
  config.klooster.year_start = parseInt(getParam('year'));
  config.klooster.year_end = config.klooster.year_start;
}
if (typeof getParam('mode') === 'string') {
  if (getParam('mode') === 'all') {
    mode = 'all';
  }
}
if (mode === 'all') {
  config.readJSON({
    title: 'VU Geoplaza Kloosterlocaties',
    url: 'https://geoplaza.vu.nl/cms/research/kloosterkaart/',
    bbox: [
      2.946307507057729,
      50.53321086134227,
      7.708880749245228,
      53.84820079687907
    ],
    crs: "EPSG:3857",
    baselayer: "light",
    services: [{
      url: 'https://geoplaza.labs.vu.nl/projects/kloosters_dev/resources/getGeoJSONAll.php',
      type: 'kloosters_all',
      layers: [
        {
          "id": "kloosters",
          "title": "kloosters",
          "label": "kloosters",
          "visible": true,
          "opacity": 1.0,
          "zindex": 93
        },
        {
          "id": "kapittels",
          "title": "kapittels",
          "label": "kapittels",
          "visible": true,
          "opacity": 1.0,
          "zindex": 92
        },
        {
          "id": "uithoven",
          "title": "uithoven",
          "label": "uithoven",
          "visible": true,
          "opacity": 1.0,
          "zindex": 91
        },
      ]
    }]
  });
} else {
  config.readJSON({
    title: 'VU Geoplaza Kloosterkaart',
    url: 'https://geoplaza.vu.nl/cms/research/kloosterkaart/',
    bbox: [
      2.946307507057729,
      50.53321086134227,
      7.708880749245228,
      53.84820079687907
    ],
    crs: "EPSG:3857",
    baselayer: "light",
    services: [{
      url: 'https://geoplaza.labs.vu.nl/projects/kloosters_dev/resources/getGeoJSON2.php',
      type: 'kloosters_by_year',
      layers: [{
        "id": "kloosters_by_year",
        "title": "kloosters_by_year",
        "label": "kloosters_by_year",
        "visible": true,
        "opacity": 1.0,
        "zindex": 93
      }]
    }]
  });
}
init(config);
