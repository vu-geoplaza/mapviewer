import ViewerConfig from "@/helpers/ViewerConfig";

class KloosterConfig extends  ViewerConfig {
  klooster = {
    language: 'nl',
    //"filter": ['benedictijnen', 'benedictinessen'],
    filter: [],
    info_url: 'https://geoplaza.vu.nl/projects/kloosters_vue/resources/getKloosterInfo.php',
    selected_id: '',
    year: 1300,
    id: '',
    data: {
      year: 0,
      geojson: {}
    }
  }
}

export default KloosterConfig;
