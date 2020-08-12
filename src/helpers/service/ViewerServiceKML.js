import ViewerService from "./ViewerService";
import ViewerLayerKML from "../layer/ViewerLayerKML";
import axios from 'axios';
import {ALLOWED_VIEWER_CRS} from "@/shared"

// static/kloosters_1200.kml
class ViewerServiceKML extends ViewerService {
  async getCapabilities() {
    var me = this;
    return axios.get(me.url).then(function (response) {
      const layers = [];
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(response.data, "text/xml");
      const name = xmlDoc.getElementsByTagName("name")[0].childNodes[0].nodeValue;
      layers.push(new ViewerLayerKML({
        name: name,
        extent_lonlat: null,
        title: name,
        legend_img: '',
        available_crs: ALLOWED_VIEWER_CRS,
      }));
      // maybe try to construct a legend here? or calculate the extent
      return layers;
    });
  }

  setLayers(layers) {
    this.layers = [];
    for (const l of layers) {
      this.layers.push(new ViewerLayerKML(l));
    }
  }
}

export default ViewerServiceKML;
