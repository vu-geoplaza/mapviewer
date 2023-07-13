// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import Vue from 'vue'
import i18n from './i18n'
import GpzViewer from './GpzViewer'

import ViewerConfig from './helpers/ViewerConfig'
import axios from 'axios'

import {register} from 'ol/proj/proj4'
import {get as getProjection} from 'ol/proj'
import proj4 from 'proj4';

import {getParam, hashCode, SharedEventBus} from './shared'
import {saveState} from "./helpers/ViewerDataHelpers";

proj4.defs("EPSG:28992", "+title=Amersfoort / RD New +proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +y_0=463000 +ellps=bessel +units=m +towgs84=565.417,50.3319,465.552,-0.398957,0.343988,-1.8774,4.0725 +no_defs");
register(proj4);
getProjection('EPSG:28992').setExtent([-285401.92, 22598.08, 595401.92, 903401.92]);

Vue.config.productionTip = false;
Vue.prototype.$nomenu = false;
// Admin mode adds add services and Save config options to the viewer
const adminmode = document.getElementById("gpz").dataset.adminmode;

function getState(config) {
    const key = hashCode(config.title);
    config.hash = key; // only calculate once
    if (!localStorage[key]) {
        saveState(config);
    } else {
        const delta = 1000 * 3600 * 24; // 1 day
        const s = JSON.parse(localStorage[key]);
        if (Date.now() - s.updated < delta) {
            config.crs = s.crs;
            config.baselayer = s.baselayer;
            config.bbox = s.bbox;
        }
    }
    return config;
}

function init(config) {
    config = getState(config)
    Vue.prototype.$config = config;
    if (adminmode === "1") {
        Vue.prototype.$adminmode = true;
    } else {
        Vue.prototype.$adminmode = false;
    }

    /* eslint-disable no-new */
    new Vue({
        el: '#gpz',
        render: h => h(GpzViewer),
        components: {GpzViewer},
        template: '<GpzViewer/>',
        i18n
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
        SharedEventBus.$emit('show-message', 'problem loading datafile: ' + error);
    });
}

// build a viewer config with one single url
function initWithUrl(url, type, crs) {
    if (typeof type === 'undefined') {
        type = 'wms';
    }
    if (typeof crs === 'undefined') {
        crs = 'EPSG:3857'
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

async function initWithCdm(cdmrec) {
    const config = new ViewerConfig();
    config.readJSON({
        crs: 'EPSG:3857',
        services: [
            {
                url: cdmrec,
                type: 'allmapscdm',
                options: {
                    cdmrec: cdmrec,
                    fit: true,
                    single: true
                }
            }
        ]
    });
    init(config);
}


// datafile in parameters
var datafile = getParam('datafile');
var cdmrec = getParam('cdm');
if (typeof cdmrec !== 'undefined') {
  console.log('***** Opening cdm record ' + cdmrec)
    initWithCdm(cdmrec);

} else {

// datafile as data tag on div gpz or url(s) as get parameters
    if (typeof datafile === 'undefined') {
        var url = getParam('url');
        var type = getParam('type');
        var crs = getParam('crs');
        if (typeof url === 'undefined') {
            datafile = document.getElementById("gpz").dataset.configfile;
            initWithDatafile(datafile);
        } else {
            initWithUrl(url, type, crs);
        }
    } else {
        initWithDatafile(datafile);
    }
}


