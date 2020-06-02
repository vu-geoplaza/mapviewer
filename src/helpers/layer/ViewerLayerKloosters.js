import ViewerLayer from "./ViewerLayer";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import {symbols} from '@/helpers/kloosters/KloosterSymbols'
import Style from "ol/style/Style";
import Icon from "ol/style/Icon";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import Text from "ol/style/Text";
import axios from 'axios';
import Vue from 'vue'
import {SharedEventBus} from "@/shared";

class ViewerLayerKloosters extends ViewerLayer {
  config=Vue.prototype.$config;
  constructor(props) {
    super(props);
    this.styleCache = [];
  };

  OLLayer(url, crs) {
    let me = this;
    let vectorReader=function(data){
      let format = new GeoJSON;
      let features = format.readFeatures(data, {
        dataProjection: 'EPSG:4326',
        featureProjection: me.config.crs
      });
      for (var i = 0, len = features.length; i < len; i++) {
        if (features[i].get('type') == 'klooster') { // should loose this in the php
          if (me.config.klooster.filter.includes(features[i].get('orde'))||(me.config.klooster.filter.length==0)){
            source.addFeature(features[i]);
          }
        }
      }
      SharedEventBus.$emit('kloostersource-loaded', features);
    };
    let source= new VectorSource({
      loader: function () {
        console.log('***** vectorloader');
        let params={
          filter: me.config.klooster.filter,
          begin: me.config.klooster.year_start,
          end: me.config.klooster.year_end
        };
        if (me.config.klooster.data.year_start==me.config.klooster.year_start&&me.config.klooster.data.year_end==me.config.klooster.year_end){
          vectorReader(me.config.klooster.data.features);
        } else {
          return axios.post(url, params).then(function (response) {
            console.log('response finished');
            me.config.klooster.data.features=response.data;
            vectorReader(me.config.klooster.data.features)
          }).catch(function (error) {
            console.error(error);
            document.getElementById("gpz").innerHTML = "<h4>Could not load data: " + error.message + "</h4>";
          });
        }
      }
    });

    return new VectorLayer({
      source: source,
      style: function (feature, resolution) {
        var language = me.config.klooster.language;
        var orde = feature.get('ordenaam');
        var type = feature.get('type');
        const labelResolutionLevel = 30;
        const iconExt = '.svg';

        if (language == 'nl') {
          var naam = feature.get('TI');
        } else {
          var naam = feature.get('TIE');
        }

        var uq = orde;
        if (resolution < labelResolutionLevel) {
          uq = uq + '_' + naam;
        }

        var style = me.styleCache[uq];
        if (style) {
          return [style];
        } else {
          var iconscale = 1;
          if ((typeof symbols[orde] !== 'undefined')) {
            var symbol = symbols[orde];
          } else {
            symbol = 'square_white';
          }
          me.styleCache[uq] = new Style({
            image: new Icon({
              scale: iconscale,
              src: 'https://geoplaza.labs.vu.nl/projects/kloosters_dev/svg/' + symbol + iconExt,
              opacity: 0.85
            }),
            text: new Text({
              font: '14px Calibri,sans-serif',
              fill: new Fill({color: '#000'}),
              stroke: new Stroke({
                color: '#fff', width: 2
              }),
              offsetY: 25,
              text: resolution < labelResolutionLevel ? naam : ''
            })
          });
          return [me.styleCache[uq]];
        }
      },
      type: 'kloosters',
      visible: true,
      opacity: 1,
      zIndex: 93,
    });
  }
}

export default ViewerLayerKloosters;

