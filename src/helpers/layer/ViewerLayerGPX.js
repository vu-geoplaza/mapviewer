import ViewerLayer from "./ViewerLayer";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import GPX from "ol/format/GPX";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import CircleStyle from "ol/style/Circle";
import Style from "ol/style/Style";

class ViewerLayerGPX extends ViewerLayer {
  OLLayer(url, crs) {
    var style = {
      'Point': new Style({
        image: new CircleStyle({
          fill: new Fill({
            color: 'rgba(255,255,0,0.4)'
          }),
          radius: 5,
          stroke: new Stroke({
            color: '#ff0',
            width: 1
          })
        })
      }),
      'LineString': new Style({
        stroke: new Stroke({
          color: '#f00',
          width: 3
        })
      }),
      'MultiLineString': new Style({
        stroke: new Stroke({
          color: '#0f0',
          width: 3
        })
      })
    };
    return new VectorLayer({
      source: new VectorSource({
        url: url,
        format: new GPX()
      }),
      style: function (feature) {
        return style[feature.getGeometry().getType()];
      },
      type: 'gpx',
      visible: this.visible,
      opacity: this.opacity,
      zIndex: this.zindex,
      //legend_img: this.legend_img
    });
  }
}

export default ViewerLayerGPX;
