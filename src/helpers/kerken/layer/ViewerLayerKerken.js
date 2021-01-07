import ViewerLayer from "../../layer/ViewerLayer";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Cluster from "ol/source/Cluster"
import GeoJSON from "ol/format/GeoJSON";
import Style from "ol/style/Style";
import Fill from "ol/style/Fill";
import Text from "ol/style/Text";
import axios from 'axios';
import Vue from 'vue'
import {kerkLegend} from "../KerkSymbols";
import Stroke from "ol/style/Stroke";
import RegularShape from "ol/style/RegularShape";
import Chart from "ol-ext/style/Chart";

function chartData(features, legendStyle) {
    let index = [];
    let index_num = 0;
    let pie_colors = [];
    let pie_data = [];
    for (let i = 0; i < features.length; i++) {
        let cat = features[i].get(legendStyle);
        if (typeof index[cat] == "undefined") {
            index[cat] = index_num;
            index_num++;
        }
        let n = index[cat];
        if (typeof pie_colors[n] == "undefined") {
            pie_colors[n] = kerkLegend[legendStyle][cat];
        }
        if (typeof pie_data[n] !== "undefined") {
            pie_data[n]++;
        } else {
            pie_data[n] = 1;
        }
    }
    let pie_colors_sorted = [];
    let pie_data_sorted = [];
    for (const cat in kerkLegend[legendStyle]) {
        if (typeof index[cat] !== 'undefined') {
            index_num = index[cat];
            pie_colors_sorted.push(pie_colors[index_num]);
            pie_data_sorted.push(pie_data[index_num]);
        }
    }
    return {
        colors: pie_colors_sorted,
        data: pie_data_sorted
    }
}

class ViewerLayerKerken extends ViewerLayer {

    constructor(props) {
        super(props);

        this.styleCache = [];
    }

    OLLayer(url) {
        let me=this;
        const clusterDistance = 50;

        let vectorReader = function (data) {
            let format = new GeoJSON;
            let features = format.readFeatures(data, {
                dataProjection: 'EPSG:4326',
                featureProjection: Vue.prototype.$config.crs
            });
            source.addFeatures(features);
        };
        let source = new VectorSource({
            loader: function () {
                console.log('*** reload kerk source');
                if (Vue.prototype.$config.filterchanged||Object.keys(Vue.prototype.$config.kerk.data.geojson).length === 0) {
                    console.log('filter changed, new request');
                    return axios.post(url, {'filter': Vue.prototype.$config.kerk.filter}).then(function (response) {
                        Vue.prototype.$config.kerk.data.geojson = response.data;
                        Vue.prototype.$config.filterchanged = false;
                        vectorReader(response.data);

                    }).catch(function (error) {
                        console.error(error);
                        document.getElementById("gpz").innerHTML = "<h4>Could not load data: " + error.message + "</h4>";
                    });
                } else {
                    // nothing changed, probably just a legend switch
                    console.log('filter unchanged, reuse old data');
                    vectorReader(Vue.prototype.$config.kerk.data.geojson);
                }
            }
        });
        let clusterSource = new Cluster({
            distance: clusterDistance,
            source: source
        });
        return new VectorLayer({
            visible: true,
            style: function (feature, resolution) {
                const legendStyle = Vue.prototype.$config.kerk.legend_style.replace(' ','_');
                const labelResolutionLevel = 5;

                let features = feature.get('features');
                let num = features.length;
                let cat = features[0].get(legendStyle);
                let naam = features[0].get('naam');
                let ingebruik = features[0].get('ingebruik');
                let id = features[0].get('id');

                let uq = legendStyle + '_' + Math.floor(resolution) + '_' + id;
                if (num == 1) {
                    if (resolution < labelResolutionLevel) {
                        uq = cat + '_' + naam;
                    } else {
                        uq = cat
                    }
                }
                let style = me.styleCache[uq];
                let symbolcolor = '#fff';
                if (typeof kerkLegend[legendStyle][cat] !== 'undefined') {
                    symbolcolor = kerkLegend[legendStyle][cat];
                }
                if (!style) {
                    //console.log('no cached style for ' + uq)
                    if (num == 1) {
                        style = new Style({
                            image: new RegularShape({
                                radius: 8,
                                points: 4,
                                angle: Math.PI / 4,
                                stroke: new Stroke({
                                    color: '#606060'
                                }),
                                fill: new Fill({
                                    color: symbolcolor
                                }),
                            }),
                            text: new Text({
                                font: '14px Calibri,sans-serif',
                                fill: new Fill({color: '#000'}),
                                stroke: new Stroke({
                                    color: '#fff', width: 2
                                }),
                                offsetY: 15,
                                text: resolution < labelResolutionLevel ? naam + ' (' + ingebruik + ')' : ''
                            })
                        });
                    } else {
                        let cdata = chartData(features, legendStyle);
                        let size = 8 * Math.sqrt(Math.sqrt(num));
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
                            })
                        });
                    }

                    me.styleCache[uq] = style;
                }
                return style;
            },
            opacity: 1,
            source: clusterSource,
            zIndex: this.zindex,
            cluster_distance: clusterDistance,
        });
    }
}

export default ViewerLayerKerken;

