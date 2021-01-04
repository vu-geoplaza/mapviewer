import ViewerConfig from "@/helpers/ViewerConfig";

class KerkConfig extends  ViewerConfig {
  constructor() {
    super();
    this.kerk = {
      filter: [],
      info_url: 'https://geoplaza.vu.nl/projects/kerken_vue/resources/getKerkInfo.php',
      selected_id: '',
      legend_style: 'denominatie',
      id: '',
      data: {
        year: 0,
        geojson: {}
      }
    }
  }

}

export default KerkConfig;
