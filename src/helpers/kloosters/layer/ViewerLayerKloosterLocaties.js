import ViewerLayer from "../../layer/ViewerLayer";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Cluster from "ol/source/Cluster"
import GeoJSON from "ol/format/GeoJSON";
import Style from "ol/style/Style";
import Icon from "ol/style/Icon";
import Fill from "ol/style/Fill";
import Text from "ol/style/Text";
import axios from 'axios';
import Vue from 'vue'
import {SharedEventBus} from "@/shared";

class ViewerLayerKloosterLocaties extends ViewerLayer {

    constructor(props) {
        super(props);
    }

    OLLayer(url) {
        let me = this;
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
                return axios.get(url + '?name=' + me.name).then(function (response) {
                    vectorReader(response.data);
                }).catch(function (error) {
                    console.error(error);
                    SharedEventBus.$emit('show-message', 'problem loading data: ' + error);
                });
            }
        });
        let clusterSource = new Cluster({
            distance: 20,
            source: source
        });
        let styleCache={};
        return new VectorLayer({
            source: clusterSource,
            style: function (feature) {
                const name = me.name;
                const features = feature.get('features');
                let num = features.length.toString();
                let uq = name + num;
                if (!styleCache[uq]) {
                    if (num == '1') {
                        styleCache[uq] =
                            new Style({
                                image: new Icon({
                                    scale: 0.5,
                                    src: me.legend_img,
                                    opacity: 0.80
                                })
                            });
                    } else {
                        styleCache[uq] =
                            new Style({
                                image: new Icon({
                                    scale: 0.5 + (0.4 * Math.log(num)),
                                    src: me.legend_img,
                                    opacity: 0.80
                                }),
                                text: new Text({
                                    font: '14px Calibri,sans-serif',
                                    fill: new Fill({color: '#fff'}),
                                    offsetY: 0,
                                    text: num
                                }),
                            });
                    }
                }
                return [styleCache[uq]];
            },
            type: me.type,
            visible: this.visible,
            opacity: 0.8,
            zIndex: this.zindex,
            legend_img: me.legend_img,
            cluster_distance: 20,
        });
    }
}

export default ViewerLayerKloosterLocaties;

