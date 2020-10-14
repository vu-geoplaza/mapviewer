// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import Vue from 'vue'
import KloosterViewer from "@/KloosterViewer";

import KloosterConfig from "@/helpers/kloosters/KloosterConfig";

import {getParam, hashCode} from './shared'

Vue.config.productionTip = false;

function getState(config) {
    const key = hashCode(config.title);
    config.hash=key; // only calculate once
    let def_config = {
        'crs': config.crs,
        'baselayer': config.baselayer,
        'bbox': config.bbox,
        'year': config.klooster.year,
        'language': config.klooster.language,
        'filter': []
    }
    if (!localStorage[key]) {
        localStorage[key] = JSON.stringify(def_config);
    } else {
        const s = JSON.parse(localStorage[key]);
        config.crs = s.crs;
        config.baselayer = s.baselayer;
        config.bbox = s.bbox;
        config.klooster.year = s.year
        config.klooster.language = s.language
        config.klooster.filter = s.filter
    }
    return config;
}


function init(config) {
    Vue.prototype.$adminmode = false;
    config = getState(config);
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


Vue.prototype.$kloosterkaartmode = mode;
if (mode === 'all') {
    config.readJSON({
        title: 'Kloosterkaart',
        url: 'https://geoplaza.vu.nl/cms/research/kloosterkaart/',
        bbox: [
            2.946307507057729,
            50.53321086134227,
            7.708880749245228,
            53.84820079687907
        ],
        crs: "EPSG:3857",
        available_crs: ["EPSG:3857", "EPSG:28992", "EPSG:4326"],
        baselayer: "light",
        cluster_resolution: 10,
        services: [{
            url: 'https://geoplaza.vu.nl/projects/kloosters_vue/resources/getGeoJSONAll.php',
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
} else if (mode == 'single') {
    config.readJSON({
        title: 'Klooster',
        url: 'https://geoplaza.vu.nl/cms/research/kloosterkaart/',
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
            url: 'https://geoplaza.vu.nl/projects/kloosters_vue/resources/getGeoJSONAll.php?name=single',
            type: 'kloosters_single',
            layers: [{
                "id": "kloosters_single",
                "title": "kloosters_single",
                "label": "kloosters_single",
                "visible": true,
                "opacity": 1.0,
                "zindex": 93
            }]
        }]
    });
} else {
    config.readJSON({
        title: 'Kloosterkaart',
        url: 'https://geoplaza.vu.nl/cms/research/kloosterkaart/',
        bbox: [
            2.946307507057729,
            50.53321086134227,
            7.708880749245228,
            53.84820079687907
        ],
        crs: "EPSG:3857",
        available_crs: ["EPSG:3857", "EPSG:28992", "EPSG:4326"],
        baselayer: "light",
        cluster_resolution: 10,
        services: [{
            url: 'https://geoplaza.vu.nl/projects/kloosters_vue/resources/getGeoJSONYear.php',
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
