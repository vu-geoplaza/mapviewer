import ViewerWMS from './service/ViewerWMS'
import ViewerWMTS from './service/ViewerWMTS'
import ViewerServiceTileArcGIS from "./service/ViewerServiceTileArcGIS";
import ViewerServiceKML from "./service/ViewerServiceKML";
import ViewerServiceGPX from "./service/ViewerServiceGPX";
import ViewerServiceGeoJSON from "./service/ViewerServiceGeoJSON";
import ViewerServiceKloostersByYear from "./kloosters/service/ViewerServiceKloostersByYear";
import ViewerServiceKloostersAll from "./kloosters/service/ViewerServiceKloostersAll";
import ViewerServiceKloostersSingle from "./kloosters/service/ViewerServiceKloostersSingle";

class ViewerConfig {
  constructor() {
    this.title = 'Geoplaza';
    this.url = '';
    this.crs = 'EPSG:3857';
    this.available_crs = ['EPSG:3857', 'EPSG:28992', 'EPSG:4326'];
    this.baselayer = 'osm';
    this.cluster_resolution = 0;
    this.bbox = [
      2.7906529317858966,
      52.1414097243633,
      7.713581591837995,
      53.640264162792946
    ]; // Nederland
    this.services = [];
  }



  setCrs(crs) {
    this.crs=crs;
  }

  readJSON(json) {
    if (json.crs) this.crs = json.crs;
    if (this.crs === 'EPSG:28992') {
      this.baselayer = 'brt';
    } else if (this.crs === 'EPSG:28992') {
      this.baselayer = 'aho';
    }
    if (json.available_crs) {
      this.available_crs = json.available_crs;
    }
    if (json.baselayer) this.baselayer = json.baselayer;
    if (json.cluster_resolution) this.cluster_resolution = json.cluster_resolution;
    if (json.bbox) this.bbox = json.bbox;
    if (json.title) this.title = json.title;
    if (json.url) this.url = json.url;
    if (json.services) {
      this.services = [];
      for (const s of json.services) {
        this.services.push(this.getService(s));
      }
    }
  }

  getService(service_config) {
    if (service_config.type === 'wms') return new ViewerWMS(service_config);
    if (service_config.type === 'wmts') return new ViewerWMTS(service_config);
    if (service_config.type === 'arcgis_image' || service_config.type === 'arcgis_tile') return new ViewerServiceTileArcGIS(service_config);
    if (service_config.type === 'kml') return new ViewerServiceKML(service_config);
    if (service_config.type === 'gpx') return new ViewerServiceGPX(service_config);
    if (service_config.type === 'geojson') return new ViewerServiceGeoJSON(service_config);
    if (service_config.type === 'kloosters_by_year') return new ViewerServiceKloostersByYear(service_config);
    if (service_config.type === 'kloosters_all') return new ViewerServiceKloostersAll(service_config);
    if (service_config.type === 'kloosters_single') return new ViewerServiceKloostersSingle(service_config);
  }
}

export default ViewerConfig;


