// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import Vue from 'vue'
import GpzViewer from './GpzViewer'

import {library} from '@fortawesome/fontawesome-svg-core'
import {faArrowLeft, faArrowRight, faLayerGroup} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'
import ViewerConfig from './helpers/ViewerConfig'
import axios from 'axios'

import {register} from 'ol/proj/proj4'
import {get as getProjection} from 'ol/proj'
import proj4 from 'proj4';

proj4.defs("EPSG:28992", "+title=Amersfoort / RD New +proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +y_0=463000 +ellps=bessel +units=m +towgs84=565.417,50.3319,465.552,-0.398957,0.343988,-1.8774,4.0725 +no_defs");
register(proj4);
getProjection('EPSG:28992').setExtent([-285401.92, 22598.08, 595401.92, 903401.92]);

library.add(faArrowLeft, faArrowRight, faLayerGroup);

Vue.component('font-awesome-icon', FontAwesomeIcon);

import BootstrapVue from 'bootstrap-vue/dist/bootstrap-vue.esm'

Vue.use(BootstrapVue);

Vue.config.productionTip = false;

// Admin mode adds add services and Save config options to the viewer
const adminmode = document.getElementById("gpz").dataset.adminmode;

function getParam(name) {
  if (name = (new RegExp('[?&]' + encodeURIComponent(name) + '=([^&]*)')).exec(location.search))
    return decodeURIComponent(name[1]);
}

function init(config){
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
}

// get the viewer config from an online json file
function initWithDatafile(datafile) {
  axios.get(datafile).then(function (response) {
    // make app config accessible for all components
    const config = new ViewerConfig();
    config.readJSON(response.data);
    init(config);
  }).catch(function (error) {
    console.error(error);
    document.getElementById("gpz").innerHTML = "<h4>Could not load map config: " + error.message + "</h4>";
    // or just start the viewer with no layers?
  });
}

// build a viewer config with one single url
function initWithUrl(url, type, crs){
  if (typeof type==='undefined'){
    type='wms';
  }
  if (typeof crs==='undefined'){
    crs='EPSG:3857'
  }
  const config = new ViewerConfig();
  config.readJSON({
    crs: crs,
    services: [
      {
        url: url,
        type: type
      }
    ]
  });
  init(config);
}


// datafile in parameters
var datafile = getParam('datafile');
// datafile as data tag on div gpz or url(s) as get parameters
if (typeof datafile === 'undefined') {
  var url=getParam('url');
  var type=getParam('type');
  var crs=getParam('crs');
  if (typeof url==='undefined') {
    datafile = document.getElementById("gpz").dataset.configfile;
    initWithDatafile(datafile);
  } else {
    initWithUrl(url, type, crs);
  }
} else {
  initWithDatafile(datafile);
}



