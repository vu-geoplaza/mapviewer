import ViewerConfig from "@/helpers/ViewerConfig";

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
        geojson: {}
      }
    }
  }

}

export default KerkConfig;
