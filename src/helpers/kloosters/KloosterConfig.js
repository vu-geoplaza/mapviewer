import ViewerConfig from "@/helpers/ViewerConfig";

class KloosterConfig extends  ViewerConfig {
  klooster = {
    language: "en",
    //"filter": ['benedictijnen', 'benedictinessen'],
    filter: [],
    info_url: 'https://geoplaza.labs.vu.nl/projects/kloosters_dev/resources/getKloosterInfo3.php',
    selected_id: '',
    year_start: 1300,
    year_end: 1300,
    data: {
      year_start: 0,
      year_end: 0,
      geojson: {}
    }
  }
}

export default KloosterConfig;
