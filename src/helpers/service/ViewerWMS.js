import ViewerService from './ViewerService'
import WMSCapabilities from "ol/format/WMSCapabilities";
import ViewerLayerWMS from "../layer/ViewerLayerWMS";
import axios from 'axios';

class ViewerWMS extends ViewerService {
  async getCapabilities(layer_names) {
    const url = this.url.substring(0, this.url.indexOf('?'));
    const me = this;
    const parser = new WMSCapabilities();
    console.log('start get capabilities');
    return axios.get(url + '?request=GetCapabilities&service=WMS',).then(function (response) {
      const result = parser.read(response.data);
      if (layer_names.length === 0) {
        for (const layer of result.Capability.Layer.Layer) {
          me.layers.push(new ViewerLayerWMS({
            name: layer.Name,
            extent_lonlat: layer.EX_GeographicBoundingBox,
            title: layer.Title,
            legend_img: `${url}?service=WMS&request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=${layer.Name}&version=1.3.0&SLD_VERSION=1.1.0`,
            available_crs: layer.CRS
          }));
        }
      } else {
        for (const layer of result.Capability.Layer.Layer) {
          const index = layer_names.indexOf(layer.Title);
          if (index > -1) {
            me.layers[index].name = layer.Name;
            me.layers[index].extent_lonlat = layer.EX_GeographicBoundingBox;
            me.layers[index].title = layer.Title;
            me.layers[index].legend_img = `${url}?service=WMS&request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=${layer.Name}&version=1.3.0&SLD_VERSION=1.1.0`;
            me.layers[index].available_crs = layer.CRS;
            console.log(me.layers[index])
          }
        }
      }
      console.log('return get capabilities');
      return me;
    });
  };
  setLayers(layers) {
    this.layers = [];
    for (const l of layers) {
      this.layers.push(new ViewerLayerWMS(l));
    }
  };
}

export default ViewerWMS;
