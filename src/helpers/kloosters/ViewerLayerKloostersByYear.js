import ViewerLayer from "../layer/ViewerLayer";
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

class ViewerLayerKloostersByYear extends ViewerLayer {

  constructor(props) {
    super(props);
    this.styleCache = [];
  };

  OLLayer(url, crs) {
    let klooster_config = Vue.prototype.$config.klooster;
    let me = this;
    let vectorReader=function(data){
      let format = new GeoJSON;
      let features = format.readFeatures(data, {
        dataProjection: 'EPSG:4326',
        featureProjection: Vue.prototype.$config.crs
      });
      for (var i = 0, len = features.length; i < len; i++) {
          if (klooster_config.filter.includes(features[i].get('ordenaam'))||(klooster_config.filter.length==0)){
            features[i].setId(features[i].get("klooster_id"));
            source.addFeature(features[i]);
        }
      }
      SharedEventBus.$emit('kloostersource-loaded');
    };
    let source= new VectorSource({
      loader: function () {
        console.log('***** vectorloader');
        let params={
          filter: [],
          begin: klooster_config.year_start,
          end: klooster_config.year_end
        };
        if (klooster_config.data.year_start==klooster_config.year_start&&klooster_config.data.year_end==klooster_config.year_end){
          vectorReader(klooster_config.data.geojson);
        } else {
          return axios.post(url, params).then(function (response) {
            console.log('response finished');
            Vue.prototype.$config.klooster.data.year_start=klooster_config.year_start;
            Vue.prototype.$config.klooster.data.year_end=klooster_config.year_end;
            Vue.prototype.$config.klooster.data.geojson=response.data;
            vectorReader(response.data)
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
        var language = klooster_config.language;
        var orde = feature.get('ordenaam');
        var type = feature.get('type');
        const labelResolutionLevel = 5;
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
          if (klooster_config.filter.includes(orde)){
            // hide
          }
          me.styleCache[uq] = new Style({
            image: new Icon({
              scale: iconscale,
              src: 'https://geoplaza.labs.vu.nl/projects/kloosters_dev/svg/' + symbol + iconExt,
              opacity: 0.80
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
      type: 'kloosters_by_year',
      visible: true,
      opacity: 1,
      zIndex: 93,
    });
  }
}

export default ViewerLayerKloostersByYear;

