import ViewerService from './ViewerService'
import WMTSCapabilities from "ol/format/WMTSCapabilities";
import {optionsFromCapabilities} from "ol/source/WMTS";
import ViewerLayerWMTS from "../layer/ViewerLayerWMTS";
import axios from 'axios';

const VIEWER_CRS = ['EPSG:28992', 'EPSG:4326', 'EPSG:3857'];

class ViewerWMTS extends ViewerService {
  async getCapabilities() {
    // TODO test this
    const url = this.url.substring(0, this.url.indexOf('?'));
    const parser = new WMTSCapabilities();
    return axios.get(url + '?request=GetCapabilities&service=WMTS').then(function (response) {
      const layers = [];
      const result = parser.read(response.data);
      for (const layer of result.Contents.Layer) {
        const crs = [];
        const options = {};
        // see: https://openlayers.org/en/latest/examples/wmts-layer-from-capabilities.html
        let ok = false;
        for (const link of layer.TileMatrixSetLink) {
          crs.push(link.TileMatrixSet);
          // this will only work for known projections
          if (VIEWER_CRS.indexOf(link.TileMatrixSet) > -1) {
            const o = optionsFromCapabilities(result, {
              layer: layer.Identifier,
              matrixSet: link.TileMatrixSet
            });
            options[link.TileMatrixSet] = o;
            ok=true;
          }
        }
        if (ok) {
          layers.push(new ViewerLayerWMTS({
            name: layer.Name,
            title: layer.Title,
            extent_lonlat: layer.WGS84BoundingBox,
            // I think this is never defined
            legend_img: '',
            available_crs: crs,
            options: options
          }));
        }
      }
      console.log('return get capabilities');
      console.log(layers);
      return layers;
    });
  };

  setLayers(layers) {
    this.layers = [];
    for (const l of layers) {
      this.layers.push(new ViewerLayerWMTS(l));
    }
  };
}

export default ViewerWMTS;
