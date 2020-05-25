import ViewerService from "./ViewerService";
import axios from 'axios';
import ViewerLayerGeoJSON from "../layer/ViewerLayerGeoJSON";
import {ALLOWED_VIEWER_CRS} from "@/shared"

// static/kloosters_1200.kml
class ViewerServiceGeoJSON extends ViewerService {
  async getCapabilities() {
    var me = this;
    return axios.get(me.url).then(function (response) {
      const layers = [];
        extent = [ // netherlands for now
          3.076515,50.296118,7.685279,53.582500
        ];
      layers.push(new ViewerLayerGeoJSON({
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
      this.layers.push(new ViewerLayerGeoJSON(l));
    }
  };
}

export default ViewerServiceGeoJSON;
