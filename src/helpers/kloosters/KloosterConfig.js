import ViewerConfig from "@/helpers/ViewerConfig";
import ViewerServiceKloostersByYear from "./service/ViewerServiceKloostersByYear";
import ViewerServiceKloostersAll from "./service/ViewerServiceKloostersAll";
import ViewerServiceKloostersSingle from "./service/ViewerServiceKloostersSingle";

class KloosterConfig extends  ViewerConfig {
  constructor() {
    super();
    this.klooster = {
      language: 'nl',
      //"filter": ['benedictijnen', 'benedictinessen'],
      symbol_url: '',
      download_url: '',
      info_url: '',
      filter: [],
      selected_id: '',
      year: 1300,
      id: '',
      data: {
        year: 0,
        geojson: {}
      }
    }
  }

  readJSON(json) {
    if (json.klooster){
      if (json.klooster.info_url) this.klooster.info_url = json.klooster.info_url;
      if (json.klooster.download_url) this.klooster.download_url = json.klooster.download_url;
      if (json.klooster.symbol_url) this.klooster.symbol_url = json.klooster.symbol_url;
    }
    super.readJSON(json)
  }

  getService(service_config) {
    if (service_config.type === 'kloosters_by_year') return new ViewerServiceKloostersByYear(service_config);
    if (service_config.type === 'kloosters_all') return new ViewerServiceKloostersAll(service_config);
    if (service_config.type === 'kloosters_single') return new ViewerServiceKloostersSingle(service_config);
    super.getService(service_config);
  }

}

export default KloosterConfig;
