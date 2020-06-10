import ViewerService from "../service/ViewerService";
import ViewerLayerKloostersByYear from "./ViewerLayerKloostersByYear";
import {ALLOWED_VIEWER_CRS} from "@/shared"
import ViewerConfig from "@/helpers/ViewerConfig";

// static/kloosters_1200.kml
class ViewerServiceKloostersByYear extends ViewerService {
  constructor(props) {
    super(props);
    console.log("props");
    console.log(props);
    this.klooster_options = props.klooster_options;
  };

  async getCapabilities() {
      console.log('get klooster capabilities')
      const layers = [];
      const extent = [ // netherlands for now
        3.076515,50.296118,7.685279,53.582500
      ];
      // add kapittels and uithoven later?
      layers.push(new ViewerLayerKloostersByYear({
        name: 'kloosters_by_year',
        extent_lonlat: extent,
        title: 'kloosters_by_year',
        legend_img: '',
        available_crs: ALLOWED_VIEWER_CRS,
      }));
      return layers;
  };

  setLayers(layers) {
    this.layers = [];
    for (const l of layers) {
      this.layers.push(new ViewerLayerKloostersByYear(l));
    }
  };


}

export default ViewerServiceKloostersByYear;
