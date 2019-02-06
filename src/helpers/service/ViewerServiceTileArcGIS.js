import ViewerLayerTileArcGIS from "../layer/ViewerLayerTileArcGIS";
import ViewerService from "./ViewerService";
import ViewerLayerXYZArcGIS from "../layer/ViewerLayerXYZArcGIS";
import {transformExtent} from "ol/proj";
import axios from 'axios';

class ViewerServiceTileArcGIS extends ViewerService {
  constructor(props) {
    super(props);
    this.url = this.url.substr(0, this.url.indexOf('MapServer') + 9);
  };

  async getCapabilities(layer_names) {
    const VIEWER_CRS = ['EPSG:28992', 'EPSG:4326', 'EPSG:3857'];
    const me = this;
    const url = this.url;
    return axios.get(url + '?f=json').then(function (response) {
      const data = response.data;
      const extent_lonlat = transformExtent(
        [data.fullExtent.xmin, data.fullExtent.ymin, data.fullExtent.xmax, data.fullExtent.ymax],
        'EPSG:' + data.fullExtent.spatialReference.wkid,
        'EPSG:4326');
      if (layer_names.length === 0) {
        for (const layer of data.layers) {
          const options = {
            name: layer.name,
            extent_lonlat: extent_lonlat,
            title: layer.name,
            legend_img: '', // see https://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Specialty/ESRI_StateCityHighway_USA/MapServer/legend?f=json
            available_crs: VIEWER_CRS // at least I think so
          }
          if (me.type = 'arcgis_tile') {
            me.layers.push(new ViewerLayerXYZArcGIS(options));
          } else if (me.type = 'arcgis_image') {
            me.layers.push(new ViewerLayerTileArcGIS(options));
          }
        }
      } else {
        for (const layer of data.layers) {
          const index = layer_names.indexOf(layer.name);
          if (index > -1) {
            me.layers[index].name = layer.name;
            me.layers[index].extent_lonlat = extent_lonlat;
            me.layers[index].title = layer.name;
            me.layers[index].legend_img = '';
            me.layers[index].available_crs = VIEWER_CRS;
          }
        }
      }
      console.log(data);
      console.log(me);
      return me;
    })
  };

  setLayers(layers) {
    this.layers = [];
    for (const l of layers) {
      if (this.type = 'arcgis_tile') {
        this.layers.push(new ViewerLayerXYZArcGIS(l));
      } else if (this.type = 'arcgis_image') {
        this.layers.push(new ViewerLayerTileArcGIS(l));
      }
    }
  };
}

export default ViewerServiceTileArcGIS;

