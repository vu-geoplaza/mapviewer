import ViewerLayer from "../../layer/ViewerLayer";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Cluster from "ol/source/Cluster"
import GeoJSON from "ol/format/GeoJSON";
import Style from "ol/style/Style";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import Text from "ol/style/Text";
import axios from 'axios';
import Vue from 'vue'
import {SharedEventBus} from "@/shared";
import {lang} from '@/helpers/kloosters/lang.js';
import Icon from "ol/style/Icon";
import {plain_symbols} from '@/helpers/kloosters/KloosterSymbols'

class ViewerLayerKloosterSingle extends ViewerLayer {

  constructor(props) {
    super(props);
    this.styleCache = [];
  }

  OLLayer(url) {
    let klooster_config = Vue.prototype.$config.klooster;
    const symbol_url = klooster_config.symbol_url;
    let me = this;
    let vectorReader = function (data) {
      let format = new GeoJSON;
      let features = format.readFeatures(data, {
        dataProjection: 'EPSG:4326',
        featureProjection: Vue.prototype.$config.crs
      });
      source.addFeatures(features);
      // Unique case where we want to auto-zoom on load
      SharedEventBus.$emit('force-fit');
    };
    let source = new VectorSource({
      loader: function () {
        return axios.get(url + '&id=' + klooster_config.id).then(function (response) {
          vectorReader(response.data);
        }).catch(function (error) {
          console.error(error);
          SharedEventBus.$emit('show-message', 'problem loading data: ' + error);
        });
      }
    });
    let clusterSource = new Cluster({
      distance: 0,
      source: source
    });

    return new VectorLayer({
      source: clusterSource,
      style: function (feature) {
        const features = feature.get('features');
        const type = features[0].get('type');
        let image = symbol_url + plain_symbols['klooster'];
        let years=[];
        let label = '';
        if (type=='uithof'){
          image = symbol_url + plain_symbols['uithof'];
          if (klooster_config.language=="en") {
            label = lang[3]['en'];
          } else {
            label = lang[3]['nl'];
          }
        } else {
          for (feature of features){
            if (feature.get('type')=='klooster'){
              years.unshift(feature.get('val'));
            }
          }
          if (klooster_config.language=="en") {
            label = 'from ' + years.join(' & from ');
          } else {
            label = 'vanaf ' + years.join(' & vanaf ');
          }
        }

        let uq = label;
        var style = me.styleCache[uq];
        if (style) {
          return [style];
        } else {
          me.styleCache[uq] =
            new Style({
              image: new Icon({
                scale: 0.5,
                src: image,
                opacity: 0.80
              }),
              text: new Text({
                font: '14px Calibri,sans-serif',
                fill: new Fill({color: '#000'}),
                stroke: new Stroke({
                  color: '#fff', width: 2
                }),
                offsetY: 15,
                text: label
              })
            });
          return [me.styleCache[uq]];
        }
      },
      type: me.type,
      visible: this.visible,
      opacity: 0.8,
      zIndex: this.zindex,
      legend_img: me.legend_img
    });
  }
}

export default ViewerLayerKloosterSingle;

