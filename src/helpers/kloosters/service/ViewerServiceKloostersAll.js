import ViewerService from "../../service/ViewerService";
import ViewerLayerKloosterLocaties from '../layer/ViewerLayerKloosterLocaties'
import {ALLOWED_VIEWER_CRS} from "@/shared"

// static/kloosters_1200.kml
class ViewerServiceKloostersAll extends ViewerService {
  constructor(props) {
    super(props);
    this.klooster_options = props.klooster_options;
  }

  async getCapabilities() {
    const layers = [];
    const extent = [
      -1.86027801047121,
      49.854107444730744,
      12.20222198952879,
      54.35672339723146
    ]; // Nederland
    // add kapittels and uithoven later?
    layers.push(new ViewerLayerKloosterLocaties({
      name: 'kloosters',
      extent_lonlat: extent,
      title: 'kloosters',
      legend_img: 'https://geoplaza.vu.nl/projects/kloosters/svg/circle_m_0.svg',
      available_crs: ALLOWED_VIEWER_CRS,
    }));
    layers.push(new ViewerLayerKloosterLocaties({
      name: 'kapittels',
      extent_lonlat: extent,
      title: 'kapittels',
      legend_img: 'https://geoplaza.vu.nl/projects/kloosters/svg/kapittel.svg',
      available_crs: ALLOWED_VIEWER_CRS,
    }));
    layers.push(new ViewerLayerKloosterLocaties({
      name: 'uithoven',
      extent_lonlat: extent,
      title: 'uithoven',
      legend_img: 'https://geoplaza.vu.nl/projects/kloosters/svg/house.svg',
      available_crs: ALLOWED_VIEWER_CRS,
    }));
    return layers;
  }

  setLayers(layers) {
    this.layers = [];
    for (const l of layers) {
      this.layers.push(new ViewerLayerKloosterLocaties(l));
    }
  }


}

export default ViewerServiceKloostersAll;
