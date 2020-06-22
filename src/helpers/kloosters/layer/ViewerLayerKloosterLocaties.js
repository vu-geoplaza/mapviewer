import ViewerLayer from "../../layer/ViewerLayer";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import Style from "ol/style/Style";
import Icon from "ol/style/Icon";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import Text from "ol/style/Text";
import axios from 'axios';
import Vue from 'vue'

class ViewerLayerKloosterLocaties extends ViewerLayer {

  constructor(props) {
    super(props);
    this.styleCache = [];
  };

  OLLayer(url, crs) {
    let klooster_config = Vue.prototype.$config.klooster;
    let me = this;
    let vectorReader = function (data) {
      let format = new GeoJSON;
      let features = format.readFeatures(data, {
        dataProjection: 'EPSG:4326',
        featureProjection: Vue.prototype.$config.crs
      });
      for (var i = 0, len = features.length; i < len; i++) {
        features[i].setId(features[i].get("klooster_id"));
        source.addFeature(features[i]);
      }
    };
    let source = new VectorSource({
      loader: function () {
        console.log('***** vectorloader' + me.name);
        return axios.get(url + '?name=' + me.name).then(function (response) {
          console.log('response finished');
          vectorReader(response.data);
        }).catch(function (error) {
          console.error(error);
          document.getElementById("gpz").innerHTML = "<h4>Could not load data: " + error.message + "</h4>";
        });
      }
    });

    return new VectorLayer({
      source: source,
      style: function (feature, resolution) {
        const name = me.name;
        const language = klooster_config.language;
        const labelResolutionLevel = 5;
        var label = name + ': ' + feature.get('id');

        var uq = name;
        if (resolution < labelResolutionLevel) {
          uq = uq + '_' + label;
        }

        var style = me.styleCache[uq];
        if (style) {
          return [style];
        } else {
            me.styleCache[uq] = new Style({
              image: new Icon({
                scale: 0.75,
                src: me.legend_img,
                opacity: 0.80
              }),
              text: new Text({
                font: '14px Calibri,sans-serif',
                fill: new Fill({color: '#000'}),
                stroke: new Stroke({
                  color: '#fff', width: 2
                }),
                offsetY: 25,
                text: resolution < labelResolutionLevel ? label : ''
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

export default ViewerLayerKloosterLocaties;

