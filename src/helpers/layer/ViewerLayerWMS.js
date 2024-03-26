import ViewerLayer from './ViewerLayer'
import TileLayer from "ol/layer/Tile";
import TileWMS from "ol/source/TileWMS";

class ViewerLayerWMS extends ViewerLayer {
  OLLayer(url) {
    return new TileLayer({
      source: new TileWMS({
        url: url,
        params: {'LAYERS': this.name, 'TILED': 'true'},
        transition: 0,

      }),
      type: 'wms',
      visible: this.visible,
      opacity: this.opacity,
      zIndex: this.zindex,
      legend_img: this.legend_img
    });
  }
}

export default ViewerLayerWMS;
