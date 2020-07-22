import ViewerLayer from "../../layer/ViewerLayer";
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
import Cluster from "ol/source/Cluster";
import CircleStyle from "ol/style/Circle";
import { isMobile } from 'mobile-device-detect';

class ViewerLayerKloostersByYear extends ViewerLayer {

  constructor(props) {
    super(props);
    this.styleCache = [];
  };

  OLLayer(url, crs) {
    let klooster_config = Vue.prototype.$config.klooster;
    let me = this;
    let vectorReader=function(data){
      console.log('***** vectorReader');
      let format = new GeoJSON;
      let features = format.readFeatures(data, {
        dataProjection: 'EPSG:4326',
        featureProjection: Vue.prototype.$config.crs
      });
      let featuresToAdd=[];
      for (var i = 0, len = features.length; i < len; i++) {
          if (klooster_config.filter.includes(features[i].get('ordenaam'))||(klooster_config.filter.length==0)){
            features[i].setId(features[i].get("klooster_id"));
            featuresToAdd.push(features[i]);
        }
      }
      source.addFeatures(featuresToAdd);
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
          console.log('reload from config');
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
    let clusterDistance=0;
    if (isMobile){
      clusterDistance=15; //mostly because mobile devices are slower
    }
    let clusterSource = new Cluster({
      distance: clusterDistance,
      source: source
    });

    return new VectorLayer({
      source: clusterSource,
      style: function (feature, resolution) {
        var language = klooster_config.language;
        const features = feature.get('features');
        const num = features.length;

        var orde = features[0].get('ordenaam');
        const labelResolutionLevel = 5;
        const iconExt = '.svg';

        if (language == 'nl') {
          var naam = features[0].get('name_nl');
        } else {
          var naam = features[0].get('name_en');
        }

        var uq = num;
        if (num==1) {
          uq = orde + resolution;
        }

        var style = me.styleCache[uq];
        if (style) {
          return [style];
        } else {
          if (num==1) {
            var iconscale = 0.8;
            if ((typeof symbols[orde] !== 'undefined')) {
              var symbol = symbols[orde];
            } else {
              symbol = 'square_white';
            }
            if (klooster_config.filter.includes(orde)) {
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
          } else {
            me.styleCache[uq] = new Style({
              image: new CircleStyle({
                fill: new Fill({
                  color: '#ff0000'
                }),
                radius: 7 * Math.sqrt(Math.sqrt(num)),
                stroke: new Stroke({
                  color: '#fff',
                  width: 1
                })
              }),
              text: new Text({
                font: '14px Calibri,sans-serif',
                fill: new Fill({color: '#fff'}),
                offsetY: 0,
                text: num.toString()
              }),
            });
          }
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

