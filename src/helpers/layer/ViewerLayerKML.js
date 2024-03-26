import ViewerLayer from "./ViewerLayer";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import KML from "ol/format/KML";

class ViewerLayerKML extends ViewerLayer {
  OLLayer(url) {
    return new VectorLayer({
      source: new VectorSource({
        url: url,
        format: new KML()
      }),
      type: 'kml',
      visible: this.visible,
      opacity: this.opacity,
      zIndex: this.zindex,
      //legend_img: this.legend_img
    });
  }
}

export default ViewerLayerKML;
