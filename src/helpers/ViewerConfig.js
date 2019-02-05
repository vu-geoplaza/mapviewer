import ViewerWMS from './service/ViewerWMS'
import ViewerWMTS from './service/ViewerWMTS'
import ViewerServiceTileArcGIS from "./service/ViewerServiceTileArcGIS";

class ViewerConfig {
  crs='EPSG:3857';
  bbox= [
    2.7906529317858966,
    52.1414097243633,
    7.713581591837995,
    53.640264162792946
  ]; // Nederland
  services=[];
  readJSON(json) {
    if (json.crs) this.crs = json.crs;
    if (json.bbox) this.bbox=json.bbox;
    if (json.services) {
      this.services=[];
      for (const s of json.services) {
        this.services.push(this.getService(s));
      }
    }
  };
  getService(service) {
    if (service.type==='wms') return new ViewerWMS(service);
    if (service.type==='wmts') return new ViewerWMTS(service);
    if (service.type==='arcgis_image'||service.type==='arcgis_tile') return new ViewerServiceTileArcGIS(service);
  }
}

export default ViewerConfig;


