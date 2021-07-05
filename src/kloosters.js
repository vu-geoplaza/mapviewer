// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import Vue from 'vue'
import KloosterViewer from "@/KloosterViewer";

import KloosterConfig from "@/helpers/kloosters/KloosterConfig";

import {getParam, hashCode, SharedEventBus} from './shared'
import {saveState} from "./helpers/ViewerDataHelpers";
import axios from "axios";

Vue.config.productionTip = false;

function getState(config) {
    const key = hashCode(config.title + "3");
    config.hash=key; // only calculate once
    if (!localStorage[key]) {
        saveState(config);
    } else {
        const delta = 1000 * 3600 * 24; // 1 day
        const s = JSON.parse(localStorage[key]);
        if (Date.now() - s.updated < delta) {
            config.crs = s.crs;
            config.baselayer = s.baselayer;
            config.bbox = s.bbox;
            config.klooster.year = s.year
            config.klooster.language = s.language
            config.klooster.filter = s.filter
        }
    }
    return config;
}


function init(config) {
    Vue.prototype.$adminmode = false;

    Vue.prototype.$config = config; // might it be wiser to just use a global variable for this?
    document.title = config.title;

    /* eslint-disable no-new */
    new Vue({
        el: '#gpz',
        render: h => h(KloosterViewer),
        components: {KloosterViewer},
        template: '<KloosterViewer/>'
    });
}

Vue.prototype.$nomenu = false;

let mode = 'by_year';
let config = new KloosterConfig(); // default settings
config = getState(config);

if (typeof getParam('nomenu') === 'string') {
    Vue.prototype.$nomenu = true;
}

if (typeof getParam('year') === 'string') {
    config.klooster.year = parseInt(getParam('year'));
}
if (typeof getParam('id') === 'string') {
    mode = 'single';
    config.klooster.id = getParam('id');
}
if (typeof getParam('mode') === 'string') {
    if (getParam('mode') === 'all') {
        mode = 'all';
        config.klooster.mode = 'all';
    }
}
if (typeof getParam('language') === 'string') {
    if (getParam('language') == 'en') {
        config.klooster.language = 'en';
    }
}

// get the viewer config from an online json file
function initWithDatafile(datafile) {
    axios.get(datafile).then(function (response) {
        config.readJSON(response.data);
        init(config);
    }).catch(function (error) {
        console.error(error);
        SharedEventBus.$emit('show-message', 'problem loading datafile: ' + error);
    });
}

Vue.prototype.$kloosterkaartmode = mode;
if (mode === 'all') {
    initWithDatafile('static/kloosters_all.json')
} else if (mode == 'single') {
    initWithDatafile('static/kloosters_single.json')
} else {
    initWithDatafile('static/kloosters_year.json')
}

