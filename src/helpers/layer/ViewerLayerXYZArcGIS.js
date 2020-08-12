import TileLayer from "ol/layer/Tile";
import ViewerLayer from "./ViewerLayer";
import XYZ from "ol/source/XYZ";

class ViewerLayerXYZArcGIS extends ViewerLayer {
  OLLayer(url){
    return new TileLayer({
      source: new XYZ({
        url: url + '/tile/{z}/{y}/{x}'
      }),
      type: 'arcgis_tile',
      //legend_img: this.legend_img,
      visible: this.visible,
      zIndex: this.zindex,
      opacity: this.opacity,
    });
  }
}

export default ViewerLayerXYZArcGIS;
