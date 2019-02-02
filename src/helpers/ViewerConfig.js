import ViewerService from './ViewerService'

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
        this.services.push(new ViewerService(s));
      }
    }
  };
}

export default ViewerConfig;


