import TileLayer from "ol/layer/Tile";
import TileArcGISRest from "ol/source/TileArcGISRest"
import ViewerLayer from "./ViewerLayer";

class ViewerLayerTileArcGIS extends ViewerLayer {
  OLLayer(url){
    return new TileLayer({
      source: new TileArcGISRest({
        url: url
      }),
      //legend_img: this.legend_img,
      type: 'arcgis_image',
      visible: this.visible,
      zIndex: this.zindex,
      opacity: this.opacity,
    });
  }
}

export default ViewerLayerTileArcGIS;
