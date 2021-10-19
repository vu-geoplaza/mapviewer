import ViewerLayer from "../../layer/ViewerLayer";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import Style from "ol/style/Style";
import axios from 'axios';
import Vue from 'vue'
import {kerkLegend} from "../KerkSymbols";
import Stroke from "ol/style/Stroke";
import Chart from "ol-ext/style/Chart";
import {SharedEventBus} from "../../../shared";
import Text from "ol/style/Text";
import Fill from "ol/style/Fill";
//import {SharedEventBus} from "@/shared";


function chartData(feature, legendStyle) {
    let fcat=legendStyle;
    if (legendStyle=='denominatie'){
        fcat='denominatie_laatst';
    }
    let index = [];
    let index_num = 0;
    let pie_colors = [];

    let pie_data = feature.get(fcat).cnt;
    let pie_cat = feature.get(fcat).cat;

    for (let i=0; i < pie_cat.length; i++){
        if (typeof index[pie_cat[i]] == "undefined") {
            index[pie_cat[i]] = index_num;
            index_num++;
        }
        pie_colors[i]=kerkLegend[legendStyle][pie_cat[i]]
    }
    let num=0;
    let pie_colors_sorted = [];
    let pie_data_sorted = [];
    for (const cat in kerkLegend[legendStyle]) {
        if (typeof index[cat] !== 'undefined') {
            index_num = index[cat];
            pie_colors_sorted.push(pie_colors[index_num]);
            pie_data_sorted.push(pie_data[index_num]);
            num=num+pie_data[index_num];
        }
    }
    return {
        num: num,
        colors: pie_colors_sorted,
        data: pie_data_sorted
    }
}

class ViewerLayerKerkenClustered extends ViewerLayer {

    constructor(props) {
        super(props);

        this.styleCache = [];
    }

    OLLayer(url) {
        let me=this;
        let vectorReader = function (data) {
            let format = new GeoJSON;
            let features = format.readFeatures(data, {
                dataProjection: 'EPSG:4326',
                featureProjection: Vue.prototype.$config.crs
            });
            let featuresAdd = []
            features.forEach((feature) => {
                feature.setId(feature.get('id'));
                feature.set('type', 'cluster');
                featuresAdd.push(feature);
            });
            source.addFeatures(featuresAdd);
            SharedEventBus.$emit('kerkenclustersource-loaded');
        };
        let source = new VectorSource({
            loader: function () {
                let cluster='provincie';
                if (me.id=='kerken_gemeente'){
                    cluster='gemeente';
                }
                if (Vue.prototype.$config.filterchanged > 0 || typeof Vue.prototype.$config.kerk.data.geojsoncluster[cluster]=='undefined') {
                    console.log('filter changed, new '+cluster+' request ' + Vue.prototype.$config.filterchanged);
                    return axios.post(url, {'filter': Vue.prototype.$config.kerk.filter, 'cluster': cluster}).then(function (response) {
                        Vue.prototype.$config.kerk.data.geojsoncluster.last = cluster;
                        Vue.prototype.$config.kerk.data.geojsoncluster[cluster]=response.data;
                        Vue.prototype.$config.filterchanged--;
                        me.styleCache = [];
                        vectorReader(response.data);
                    }).catch(function (error) {
                        console.error(error);
                        SharedEventBus.$emit('show-message', 'problem loading data: ' + error);
                    });
                } else {
                    // nothing changed, probably just a legend switch
                    console.log('filter unchanged, reuse old data');
                    vectorReader(Vue.prototype.$config.kerk.data.geojsoncluster[cluster]);
                }
            }
        });
        let minResolution=200;
        let maxResolution=20000;
        if (me.id=='kerken_gemeente'){
            maxResolution=200;
            minResolution=25;
        }

        return new VectorLayer({
            visible: true,
            style: function (feature) {
                const legendStyle = Vue.prototype.$config.kerk.legend_style.replace(' ', '_');
                const plaats=feature.get('plaats');
                let style = me.styleCache[plaats+legendStyle];
                if (!style) {
                    let cdata = chartData(feature, legendStyle);
                    let size = 8 * Math.sqrt(Math.sqrt(cdata['num']));
                    style = new Style({
                        image: new Chart({
                            type: 'pie',
                            offsetY: 0,
                            data: cdata['data'],
                            colors: cdata['colors'],
                            rotateWithView: true,
                            radius: size,
                            animation: false,
                            stroke: new Stroke({
                                color: '#fff',
                                width: 2
                            }),
                        }),
                            text: new Text({
                            font: '14px Calibri,sans-serif',
                            fill: new Fill({color: '#000'}),
                            stroke: new Stroke({
                                color: '#fff', width: 2
                            }),
                            offsetY: size+5,
                            text: plaats,
                        })
                    })
                    me.styleCache[plaats]= style;
                }
                return style;
            },
            minResolution: minResolution,
            maxResolution: maxResolution,
            opacity: 1,
            source: source,
            zIndex: this.zindex,
        });
    }
}

export default ViewerLayerKerkenClustered;

