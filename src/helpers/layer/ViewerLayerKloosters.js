import ViewerLayer from "./ViewerLayer";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import {symbols} from '@/helpers/kloosters/KloosterSymbols'
import Style from "ol/style/Style";
import Icon from "ol/style/Icon";
import CircleStyle from "ol/style/Circle";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import Text from "ol/style/Text";

import Vue from 'vue'

class ViewerLayerKloosters extends ViewerLayer {
  config=Vue.prototype.$config;
  constructor(props) {
    super(props);
    this.data = props.data;

    this.styleCache = [];
  };

  OLLayer(url, crs) {
    var me = this;
    let source = new VectorSource({
      loader: function () {
        // better to do the post request here?
        console.log('***** vectorloader');
        let format = new GeoJSON;
        let features = format.readFeatures(me.data, {
          dataProjection: 'EPSG:4326',
          featureProjection: me.config.crs
        });
        this.addFeatures(features);
      }
      //projection: crs
    });

    return new VectorLayer({
      source: source,
      //style: gpxStyle,

      style: function (feature, resolution) {
        var language = me.config.klooster.language;
        var orde = feature.get('ordenaam');
        var type = feature.get('type');
        const labelZoomLevel = 100;
        const iconExt = '.svg';

        if (language == 'nl') {
          var naam = feature.get('TI');
        } else {
          var naam = feature.get('TIE');
        }

        var uq = orde;
        if (resolution < labelZoomLevel) {
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
              text: resolution < labelZoomLevel ? naam : ''
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

