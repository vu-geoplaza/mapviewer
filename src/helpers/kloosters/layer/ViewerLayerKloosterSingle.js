import ViewerLayer from "../../layer/ViewerLayer";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Cluster from "ol/source/Cluster"
import GeoJSON from "ol/format/GeoJSON";
import Style from "ol/style/Style";
import Icon from "ol/style/Icon";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import Text from "ol/style/Text";
import axios from 'axios';
import Vue from 'vue'
import {SharedEventBus} from "@/shared";

class ViewerLayerKloosterSingle extends ViewerLayer {

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
      source.addFeatures(features);
      me.extent_lonlat=source.getExtent();
      // Unique case where we want to auto-zoom on load
      SharedEventBus.$emit('force-fit');
    };
    let source = new VectorSource({
      loader: function () {
        return axios.get(url + '&id=' + klooster_config.id).then(function (response) {
          vectorReader(response.data);
        }).catch(function (error) {
          console.error(error);
          document.getElementById("gpz").innerHTML = "<h4>Could not load data: " + error.message + "</h4>";
        });
      }
    });
    let clusterSource = new Cluster({
      distance: 0,
      source: source
    });

    return new VectorLayer({
      source: clusterSource,
      style: function (feature, resolution) {
        const features = feature.get('features');
        const type = features[0].get('type');
        let image='https://geoplaza.vu.nl/projects/kloosters/svg/circle_m_0.svg';

        let years=[];
        let label = ''
        if (type=='uithof'){
          image='https://geoplaza.vu.nl/projects/kloosters/svg/house.svg';
          label = type;
        } else {
          for (feature of features){
            years.unshift(feature.get('val'));
          }
          label = 'from' + years.join(' & from');
        }

        let uq = label;
        var style = me.styleCache[uq];
        if (style) {
          return [style];
        } else {
          me.styleCache[uq] =
            new Style({
              image: new Icon({
                scale: 1,
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
      extent_lonlat: me.extent,
      type: me.type,
      visible: this.visible,
      opacity: 0.8,
      zIndex: this.zindex,
      legend_img: me.legend_img
    });
  }
}

export default ViewerLayerKloosterSingle;

