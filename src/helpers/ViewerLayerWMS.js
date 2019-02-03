import ViewerLayer from './ViewerLayer'
import TileLayer from "ol/layer/Tile";
import TileWMS from "ol/source/TileWMS";

class ViewerLayerWMS extends ViewerLayer {
  OLLayer(url,crs) {
    return new TileLayer({
      source: new TileWMS({
        url: url,
        params: {'LAYERS': this.name},
        transition: 0,

      }),
      lid: this.id,
      name: this.name,
      title: this.title,
      extent_lonlat: this.extent_lonlat,
      type: 'wms',
      legend_img: this.legend_img,
      visible: this.visible,
      opacity: this.opacity,
      zIndex: this.zindex
    });
  }
}

export default ViewerLayerWMS;
