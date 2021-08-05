import ViewerConfig from "@/helpers/ViewerConfig";
import ViewerServiceKerken from "./service/ViewerServiceKerken";
import ViewerServiceKerkenBAG from "./service/ViewerServiceKerkenBAG";
import ViewerWMS from "../service/ViewerWMS";

class KerkConfig extends  ViewerConfig {
  constructor() {
    super();
    this.kerk = {
      filter: {},
      filterchanged: true,
      info_url: 'https://geoplaza.vu.nl/projects/kerken_vue/resources/getKerkInfo.php',
      typeahead_url: 'https://geoplaza.vu.nl/projects/kerken_vue/resources/getTypeaheadData.php',
      filterstate_url: 'https://geoplaza.vu.nl/projects/kerken_vue/resources/getFilterState.php',
      selected_id: '',
      legend_style: 'denominatie',
      pand_id: [],
      id: '',
      data: {
        year: 0,
        geojson: {},
        geojsoncluster: {}
      }
    }
  }

  getService(service_config) {
    console.log(service_config);
    super.getService(service_config);
    if (service_config.type === 'wms') return new ViewerWMS(service_config);
    if (service_config.type === 'kerken') return new ViewerServiceKerken(service_config);
    if (service_config.type === 'kerken_bag') return new ViewerServiceKerkenBAG(service_config);
  }
}

export default KerkConfig;
