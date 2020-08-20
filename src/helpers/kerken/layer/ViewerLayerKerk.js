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
import ol_style_Chart from "ol-ext/style/Chart";

class ViewerLayerKerk extends ViewerLayer {

    constructor(props) {
        super(props);
        this.styleCache = [];
    }

    setStyle(legendStyle) {
        // make sure this is called on vector reload, we can trigger that when the filter changes
        function chartData(features) {
            var index = [];
            var index_num = 0;
            var pie_colors = [];
            var pie_data = [];
            for (var i = 0; i < features.length; i++) {
                var cat = features[i].get(legendClass);
                if (typeof index[cat] == "undefined") {
                    index[cat] = index_num;
                    index_num++;
                }
                var n = index[cat];
                if (typeof pie_colors[n] == "undefined") {
                    pie_colors[n] = kerkLegend[legendClass][cat];
                }
                if (typeof pie_data[n] !== "undefined") {
                    pie_data[n]++;
                } else {
                    pie_data[n] = 1;
                }
            }
            var pie_colors_sorted = [];
            var pie_data_sorted = [];
            for (cat in classification[legendClass]) {
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
        let style = function (feature, resolution) {
            var features = feature.get('features');
            var num = features.length;
            var cat = features[0].get(legendStyle);
            var naam = features[0].get('naam');
            var ingebruik = features[0].get('ingebruik');
            var id = features[0].get('kerk_id');

            var uq = legendClass + '_' + resolution + '_' + id;
            if (num == 1) {
                if (zoomLevel > labelZoomLevel) {
                    uq = cat + '_' + naam;
                } else {
                    uq = cat
                }
            }
            var style = me.styleCache[uq];
            if (typeof kerkLegend[legendStyle][cat] == 'undefined') {
                var symbolcolor = '#fff';
            } else {
                var symbolcolor = kerkLegend[legendStyle][cat];
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
                            text: zoomLevel > labelZoomLevel ? naam + ' (' + ingebruik + ')' : ''
                        })
                    });
                } else {
                    var cdata = chartData(features, num)
                    var size = 8 * Math.sqrt(Math.sqrt(num));
                    style = new Style({
                        zindex: num,
                        image: new ol_style_Chart({
                            type: 'pie',
                            offsetY: 0,
                            data: cdata['data'],
                            colors: cdata['colors'],
                            rotateWithView: true,
                            radius: size,
                            animation: false,
                            stroke: new Stroke({
                                color: '#fff',
                                width: 0
                            }),
                        })
                    });
                }
                me.styleCache[uq] = style;
            }
            return style;
        }
    }

    OLLayer(url) {
        let me = this;
        const clusterDistance=50;
        const layer = new VectorLayer({
            visible: this.visible,
            opacity: 0.8,
            zIndex: this.zindex,
            cluster_distance: clusterDistance,
            cluster_zoomlevel: 13
        });
        let vectorReader = function (data) {
            let format = new GeoJSON;
            let features = format.readFeatures(data, {
                dataProjection: 'EPSG:4326',
                featureProjection: Vue.prototype.$config.crs
            });
            source.addFeatures(features);
            layer.setStyle(Vue.prototype.$config.kerk.legend_style);
        };
        let source = new VectorSource({
            loader: function () {
                return axios.get(url).then(function (response) {
                    vectorReader(response.data);
                }).catch(function (error) {
                    console.error(error);
                    document.getElementById("gpz").innerHTML = "<h4>Could not load data: " + error.message + "</h4>";
                });
            }
        });
        let clusterSource = new Cluster({
            distance: clusterDistance,
            source: source
        });
        layer.setSource(clusterSource);

        return layer;
    }
}

export default ViewerLayerKerk;

