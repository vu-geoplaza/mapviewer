// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import Vue from 'vue'
import i18n from './i18n'
import KerkViewer from "@/KerkViewer";

import BootstrapVue from 'bootstrap-vue/dist/bootstrap-vue.esm'
import KerkConfig from "./helpers/kerken/KerkConfig";

//import {getParam} from './shared'

Vue.use(BootstrapVue);

Vue.config.productionTip = false;

function init(config) {
    Vue.prototype.$adminmode = false;
    Vue.prototype.$config = config;
    document.title = config.title;
    /* eslint-disable no-new */
    new Vue({
        el: '#gpz',
        render: h => h(KerkViewer),
        components: {KerkViewer},
        template: '<KerkViewer/>',
        i18n
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
    cluster_resolution: 10,
    services: [
        {
            url: 'https://geoplaza.vu.nl/projects/kerken_vue/resources/getGeoJSON.php',
            type: 'kerken',
            layers: [
                {
                    "id": "kerken",
                    "title": "kerken",
                    "label": "kerken",
                    "visible": true,
                    "opacity": 1.0,
                    "zindex": 100
                },
                {
                    "id": "kerken_provincie",
                    "title": "kerken_provincie",
                    "label": "kerken_provincie",
                    "visible": true,
                    "opacity": 1.0,
                    "zindex": 101
                },
                {
                    "id": "kerken_gemeente",
                    "title": "kerken_gemeente",
                    "label": "kerken_gemeente",
                    "visible": true,
                    "opacity": 1.0,
                    "zindex": 102
                }
            ]
        },
        {
            url: 'https://service.pdok.nl/lv/bag/wfs/v2_0?',
            type: "kerken_bag",
            layers: [
                {
                    "id": "kerken_bag",
                    "title": "kerken_bag",
                    "label": "kerken_bag",
                    "visible": true,
                    "opacity": 0.8,
                    "zindex": 99
                }
            ]
        },
    ]
});


init(config);

