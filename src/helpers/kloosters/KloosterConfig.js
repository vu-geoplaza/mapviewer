import ViewerConfig from "@/helpers/ViewerConfig";

class KloosterConfig extends  ViewerConfig {
  klooster = {
    language: 'nl',
    //"filter": ['benedictijnen', 'benedictinessen'],
    filter: [],
    info_url: 'https://geoplaza.vu.nl/projects/kloosters_vue/resources/getKloosterInfo.php',
    selected_id: '',
    year_start: 1300,
    year_end: 1300,
    id: '',
    data: {
      year_start: 0,
      year_end: 0,
      geojson: {}
    }
  }
}

export default KloosterConfig;
