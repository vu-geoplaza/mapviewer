import ViewerLayer from "../../layer/ViewerLayer";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import Style from "ol/style/Style";
import Fill from "ol/style/Fill";
import Text from "ol/style/Text";
import axios from 'axios';
import Vue from 'vue'
import {kerkLegend} from "../KerkSymbols";
import Stroke from "ol/style/Stroke";
import RegularShape from "ol/style/RegularShape";
import {SharedEventBus} from "@/shared";


class ViewerLayerKerken extends ViewerLayer {

    constructor(props) {
        super(props);

        this.styleCache = [];
    }

    OLLayer(url) {
        let me = this;
        let vectorReader = function (data) {
            let format = new GeoJSON;
            let features = format.readFeatures(data, {
                dataProjection: 'EPSG:4326',
                featureProjection: Vue.prototype.$config.crs
            });
            let featuresAdd = []
            features.forEach((feature) => {
                feature.setId(feature.get('id'));
                featuresAdd.push(feature);
            });
            source.addFeatures(featuresAdd);
            SharedEventBus.$emit('kerkensource-loaded');
        };
        let source = new VectorSource({
            loader: function () {
                if (Vue.prototype.$config.filterchanged || Object.keys(Vue.prototype.$config.kerk.data.geojson).length === 0) {
                    console.log('filter changed, new request');
                    return axios.post(url, {'filter': Vue.prototype.$config.kerk.filter}).then(function (response) {
                        Vue.prototype.$config.kerk.data.geojson = response.data;
                        Vue.prototype.$config.filterchanged = false;
                        vectorReader(response.data);
                    }).catch(function (error) {
                        console.error(error);
                        SharedEventBus.$emit('show-message', 'problem loading data: ' + error);
                    });
                } else {
                    // nothing changed, probably just a legend switch
                    console.log('filter unchanged, reuse old data');
                    vectorReader(Vue.prototype.$config.kerk.data.geojson);
                }
            }
        });
        return new VectorLayer({
            visible: true,
            style: function (feature, resolution) {
                 if (resolution > 25) {
                    return [];
                }
                const legendStyle = Vue.prototype.$config.kerk.legend_style.replace(' ', '_');
                const labelResolutionLevel = 5;

                let cat = feature.get(legendStyle);
                let naam = feature.get('naam');
                let ingebruik = feature.get('ingebruik');

                let uq = cat;
                if (resolution < labelResolutionLevel) {
                    uq = cat + '_' + naam;
                }

                let style = me.styleCache[uq];
                let symbolcolor = '#fff';
                if (typeof kerkLegend[legendStyle][cat] !== 'undefined') {
                    symbolcolor = kerkLegend[legendStyle][cat];
                }
                if (!style) {
                    //console.log('no cached style for ' + uq)

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

                }
                me.styleCache[uq] = style;
                return style;
            },
            opacity: 1,
            //minZoom: 12,
            source: source,
            zIndex: this.zindex,
        });
    }
}

export default ViewerLayerKerken;

