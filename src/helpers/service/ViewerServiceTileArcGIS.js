import ViewerLayerTileArcGIS from "../layer/ViewerLayerTileArcGIS";
import ViewerService from "./ViewerService";
import ViewerLayerXYZArcGIS from "../layer/ViewerLayerXYZArcGIS";
import {transformExtent} from "ol/proj";
import axios from 'axios';
import {ALLOWED_VIEWER_CRS} from "@/shared"

class ViewerServiceTileArcGIS extends ViewerService {
  constructor(props) {
    super(props);
    this.url = this.url.substr(0, this.url.indexOf('MapServer') + 9);
  }

  async getCapabilities() {
    const url = this.url;
    var me = this;
    return axios.get(url + '?f=json').then(function (response) {
      const layers=[];
      const data = response.data;
      const extent_lonlat = transformExtent(
        [data.fullExtent.xmin, data.fullExtent.ymin, data.fullExtent.xmax, data.fullExtent.ymax],
        'EPSG:' + data.fullExtent.spatialReference.wkid,
        'EPSG:4326');
        for (const layer of data.layers) {
          const options = {
            name: layer.name,
            extent_lonlat: extent_lonlat,
            title: layer.name,
            legend_img: '', // see https://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Specialty/ESRI_StateCityHighway_USA/MapServer/legend?f=json
            available_crs: ALLOWED_VIEWER_CRS // at least I think so
          };
          if (me.type == 'arcgis_tile') {
            layers.push(new ViewerLayerXYZArcGIS(options));
          } else if (me.type == 'arcgis_image') {
            layers.push(new ViewerLayerTileArcGIS(options));
          }
        }
      return layers;
    })
  }

  setLayers(layers) {
    this.layers = [];
    for (const l of layers) {
      if (this.type == 'arcgis_tile') {
        this.layers.push(new ViewerLayerXYZArcGIS(l));
      } else if (this.type == 'arcgis_image') {
        this.layers.push(new ViewerLayerTileArcGIS(l));
      }
    }
  }
}

export default ViewerServiceTileArcGIS;

