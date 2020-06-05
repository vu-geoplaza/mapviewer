import ViewerConfig from "@/helpers/ViewerConfig";

class KloosterConfig extends  ViewerConfig {
  klooster = {
    language: "en",
    //"filter": ['benedictijnen', 'benedictinessen'],
    filter: [],
    selected_id: '',
    year_start: 1200,
    year_end: 1200,
    data: {
      year_start: 0,
      year_end: 0,
      geojson: {}
    }
  }
}

export default KloosterConfig;