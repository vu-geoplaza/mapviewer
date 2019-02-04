import ViewerLayerTileArcGIS from "./ViewerLayerTileArcGIS";
import ViewerService from "@/helpers/ViewerService";
import ViewerLayerXYZArcGIS from "@/helpers/ViewerLayerXYZArcGIS";

//https://tiles.arcgis.com/tiles/y59l2kue2wCNNoZS/arcgis/rest/services/25_Amsterdam1_img/MapServer?

// werkt:
//https://tiles.arcgis.com/tiles/y59l2kue2wCNNoZS/arcgis/rest/services/25_Amsterdam1_img/MapServer/tile/12/1346/2104
//https://tiles.arcgis.com/tiles/y59l2kue2wCNNoZS/arcgis/rest/services/25_Amsterdam1_img/MapServer/tile/9/168/259

class ViewerServiceTileArcGIS extends ViewerService {
  async getCapabilities(layer_names) {
    const VIEWER_CRS = ['EPSG:28992', 'EPSG:4326', 'EPSG:3857'];
    const me = this;
    const url = this.url;
    return fetch(url + '?f=json').then(function (response) {
      return response.json();
    }).then(function (data) {
        console.log('-----------extent:');
        console.log(data.fullExtent);
        const extent_lonlat=[data.fullExtent.xmin, data.fullExtent.ymin, data.fullExtent.xmax,data.fullExtent.ymax];
        me.arcCapabilities=data.capabilities;
        if (layer_names.length === 0) {
          for (const layer of data.layers) {
            const options={
              name: layer.name,
              extent_lonlat: extent_lonlat,
              title: layer.name,
              legend_img: '', // see https://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Specialty/ESRI_StateCityHighway_USA/MapServer/legend?f=json
              available_crs: VIEWER_CRS // at least I think so
            };
            if (me.type='arcgis_tile') {
              me.layers.push(new ViewerLayerXYZArcGIS(options));
            } else if (me.type='arcgis_image') {
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
      console.log(me);
      return me;
    })
  };
  setLayers(layers) {
    this.layers = [];
    for (const l of layers) {
      if (me.type='arcgis_tile') {
        this.layers.push(new ViewerLayerXYZArcGIS(l));
      } else if (me.type='arcgis_image') {
        this.layers.push(new ViewerLayerTileArcGIS(l));
      }
    }
  };
}

export default ViewerServiceTileArcGIS;

