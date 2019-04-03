import ViewerWMS from './service/ViewerWMS'
import ViewerWMTS from './service/ViewerWMTS'
import ViewerServiceTileArcGIS from "./service/ViewerServiceTileArcGIS";
import ViewerServiceKML from "./service/ViewerServiceKML";
import ViewerServiceGPX from "./service/ViewerServiceGPX";

class ViewerConfig {
  title = '';
  url = '';
  crs = 'EPSG:3857';
  bbox = [
    2.7906529317858966,
    52.1414097243633,
    7.713581591837995,
    53.640264162792946
  ]; // Nederland
  services = [];

  readJSON(json) {
    if (json.crs) this.crs = json.crs;
    if (json.bbox) this.bbox = json.bbox;
    if (json.title) this.title = json.title;
    if (json.url) this.url = json.url;
    if (json.services) {
      this.services = [];
      for (const s of json.services) {
        this.services.push(this.getService(s));
      }
    }
  };

  getService(service_config) {
    if (service_config.type === 'wms') return new ViewerWMS(service_config);
    if (service_config.type === 'wmts') return new ViewerWMTS(service_config);
    if (service_config.type === 'arcgis_image' || service_config.type === 'arcgis_tile') return new ViewerServiceTileArcGIS(service_config);
    if (service_config.type === 'kml') return new ViewerServiceKML(service_config);
    if (service_config.type === 'gpx') return new ViewerServiceGPX(service_config);
  }
}

export default ViewerConfig;


