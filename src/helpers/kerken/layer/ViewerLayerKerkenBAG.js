import ViewerLayer from "../../layer/ViewerLayer";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import Vue from "vue";
import axios from "axios";
import GeoJSON from "ol/format/GeoJSON";
import Style from "ol/style/Style";
import {SharedEventBus} from "../../../shared";

class ViewerLayerKerkenBAG extends ViewerLayer {

    constructor(props) {
        super(props);
        this.styleCache = [];
    }

    OLLayer(url) {

        let source = new VectorSource({
            loader: function () {
                console.log('trip bag loader');
                let pand_id=Vue.prototype.$config.kerk.pand_id;
                if (pand_id.length>0) {
                    let filter = '<Filter>';
                    if (pand_id.length>1) filter += '<OR>';
                    for (const id of pand_id) {
                        filter+='<PropertyIsEqualTo><PropertyName>identificatie</PropertyName><Literal>' + id + '</Literal></PropertyIsEqualTo>';
                    }
                    if (pand_id.length>1) filter += '</OR>';
                    filter += '</Filter>';
                    return axios.get(url, {
                        params: {
                            request: 'GetFeature',
                            service: 'WFS',
                            version: '2.0.0',
                            typeNames: 'bag:pand',
                            count: pand_id.length,
                            outputFormat: 'application/json',
                            srsname: 'EPSG:4326',
                            filter: filter
                        }
                    }).then(function (response) {
                        console.log('response finished');
                        Vue.prototype.$config.kerk.pand_id = [];
                        let format = new GeoJSON;
                        let features = format.readFeatures(response.data, {
                            dataProjection: 'EPSG:4326',
                            featureProjection: Vue.prototype.$config.crs
                        });
                        source.addFeatures(features);
                    }).catch(function (error) {
                        SharedEventBus.$emit('show-message', 'problem loading bag pand: ' + error);
                        console.error(error);
                    });
                }
            }

        });
        return new VectorLayer({
            visible: true,
            style: new Style({
                stroke: new Stroke({
                    color: 'rgba(0, 0, 255, 1.0)',
                    width: 2
                }),
                fill: new Fill({
                    color: 'rgba(0, 0, 255, 0.3)'
                }),
            }),
            opacity: 1,
            source: source,
            zIndex: this.zindex,
        });
    }
}

export default ViewerLayerKerkenBAG;

