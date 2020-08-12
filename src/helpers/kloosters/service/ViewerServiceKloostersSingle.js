import ViewerService from "../../service/ViewerService";
import ViewerLayerKloosterSingle from '../layer/ViewerLayerKloosterSingle'
import {ALLOWED_VIEWER_CRS} from "@/shared"

// static/kloosters_1200.kml
class ViewerServiceKloostersSingle extends ViewerService {
  constructor(props) {
    super(props);
    this.klooster_options = props.klooster_options;
  }

  async getCapabilities() {
    const layers = [];
    layers.push(new ViewerLayerKloosterSingle({
      name: 'kloosters_single',
      //extent_lonlat: extent,
      title: 'kloosters_single',
      legend_img: 'https://geoplaza.vu.nl/projects/kloosters/svg/circle_m_0.svg',
      available_crs: ALLOWED_VIEWER_CRS,
    }));
    return layers;
  }

  setLayers(layers) {
    this.layers = [];
    for (const l of layers) {
      this.layers.push(new ViewerLayerKloosterSingle(l));
    }
  }


}

export default ViewerServiceKloostersSingle;
