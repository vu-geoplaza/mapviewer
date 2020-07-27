import ViewerService from "../../service/ViewerService";
import ViewerLayerKloostersByYear from "../layer/ViewerLayerKloostersByYear";
import {ALLOWED_VIEWER_CRS} from "@/shared"

// static/kloosters_1200.kml
class ViewerServiceKloostersByYear extends ViewerService {
  constructor(props) {
    super(props);
    this.klooster_options = props.klooster_options;
  };

  async getCapabilities() {
      const layers = [];
      const extent = [
        -1.86027801047121,
        49.854107444730744,
        12.20222198952879,
        54.35672339723146
      ]; // Nederland
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
