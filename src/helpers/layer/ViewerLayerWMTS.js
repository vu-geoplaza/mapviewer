import ViewerLayer from './ViewerLayer'
import TileLayer from "ol/layer/Tile";
import WMTS from "ol/source/WMTS";

class ViewerLayerWMTS extends ViewerLayer {
  OLLayer(url,crs) {
    if (typeof this.options[crs] === 'undefined') {
      console.log(this.title + ' is not available at this CRS');
      return false;
    } else {
      return new TileLayer({
        source: new WMTS(this.options[crs]),
        type: 'wmts',
        legend_img: this.legend_img,
        visible: this.visible,
        zIndex: this.zindex,
        opacity: this.opacity,
      });
    }
  }

}

export default ViewerLayerWMTS;
