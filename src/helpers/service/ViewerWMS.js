import ViewerService from './ViewerService'
import WMSCapabilities from "ol/format/WMSCapabilities";
import ViewerLayerWMS from "../layer/ViewerLayerWMS";
import axios from 'axios';

class ViewerWMS extends ViewerService {
  async getCapabilities() {
    const url = this.url.substring(0, this.url.indexOf('?'));
    const parser = new WMSCapabilities();
    const layers=[];
    return axios.get(url + '?request=GetCapabilities&service=WMS',).then(function (response) {
      const result = parser.read(response.data);
      for (const layer of result.Capability.Layer.Layer) {
        layers.push(new ViewerLayerWMS({
          name: layer.Name,
          extent_lonlat: layer.EX_GeographicBoundingBox,
          title: layer.Title,
          legend_img: `${url}?service=WMS&request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=${layer.Name}&version=1.3.0&SLD_VERSION=1.1.0`,
          available_crs: layer.CRS
        }));
      }
      return layers;
    });
  };
  setLayers(layers) {
    this.layers = [];
    for (const l of layers) {
      this.layers.push(new ViewerLayerWMS(l));
    }
  };
}

// get Capabilities returns all layers then merge them in service

export default ViewerWMS;
