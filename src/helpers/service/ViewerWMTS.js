import ViewerService from './ViewerService'
import WMTSCapabilities from "ol/format/WMTSCapabilities";
import {optionsFromCapabilities} from "ol/source/WMTS";
import ViewerLayerWMTS from "../layer/ViewerLayerWMTS";
import axios from 'axios';

const VIEWER_CRS = ['EPSG:28992', 'EPSG:4326', 'EPSG:3857'];

class ViewerWMTS extends ViewerService {
   async getCapabilities(layer_names) {
     // TODO test this
     const url = this.url.substring(0, this.url.indexOf('?'));

     const me = this;
    service.layers=[];
    const parser = new WMTSCapabilities();
    return axios.get(url + '?request=GetCapabilities&service=WMTS').then(function (response) {
      const result = parser.read(response.data);
      for (const layer of result.Contents.Layer) {
        //console.log(layer);
        const crs = [];
        const options = {};
        // see: https://openlayers.org/en/latest/examples/wmts-layer-from-capabilities.html
        var ok = true;
        for (const link of layer.TileMatrixSetLink) {
          crs.push(link.TileMatrixSet);
          // this will only work for known projections
          if (VIEWER_CRS.indexOf(link.TileMatrixSet) > -1) {
            const o = optionsFromCapabilities(result, {
              layer: layer.Title,
              matrixSet: link.TileMatrixSet
            });
            options[link.TileMatrixSet] = o;
          }
        }
        if (layer_name.length===0) {
          me.layers.push(new ViewerLayerWMTS({
            name: layer.Name,
            title: layer.Title,
            extent_lonlat: layer.WGS84BoundingBox,
            legend_img: `${url}?service=WMTS&request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=${layer.Name}&version=1.3.0&SLD_VERSION=1.1.0`,
            available_crs: crs,
            options: options
          }));
        } else {
          const index = layer_names.indexOf(layer.Title);
          if (index > -1) {
            me.layers[index].name= layer.Name;
            me.layers[index].extent_lonlat= layer.WGS84BoundingBox;
            me.layers[index].legend_img= `${url}?service=WMTS&request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=${layer.Name}&version=1.3.0&SLD_VERSION=1.1.0`;
            me.layers[index].available_crs= crs;
            me.layers[index].options= options;
          }
        }

        console.log('return get capabilities');
      }
      return me;
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
