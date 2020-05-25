import ViewerService from "./ViewerService";
import axios from 'axios';
import ViewerLayerGPX from "../layer/ViewerLayerGPX";
import {ALLOWED_VIEWER_CRS} from "@/shared"

// static/kloosters_1200.kml
class ViewerServiceGPX extends ViewerService {
  async getCapabilities() {
    var me = this;
    return axios.get(me.url).then(function (response) {
      const layers = [];
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(response.data, "text/xml");
      console.log('xmlDoc.getElementsByTagName("bounds")');
      let extent = null;
      if (xmlDoc.getElementsByTagName("bounds").length > 0) {
        const bounds = xmlDoc.getElementsByTagName("bounds")[0];
        extent = [
          parseFloat(bounds.getAttribute('minlon')),
          parseFloat(bounds.getAttribute('minlat')),
          parseFloat(bounds.getAttribute('maxlon')),
          parseFloat(bounds.getAttribute('maxlat'))
        ];
      }
      layers.push(new ViewerLayerGPX({
        name: me.url.substr(me.url.lastIndexOf('/') + 1),
        extent_lonlat: extent,
        title: me.url.substr(me.url.lastIndexOf('/') + 1),
        legend_img: '',
        available_crs: ALLOWED_VIEWER_CRS,
      }));
      // maybe try to construct a legend here? or calculate the extent
      return layers;
    });
  };

  setLayers(layers) {
    this.layers = [];
    for (const l of layers) {
      this.layers.push(new ViewerLayerGPX(l));
    }
  };
}

export default ViewerServiceGPX;
