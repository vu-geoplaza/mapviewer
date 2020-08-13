import ViewerService from "../../service/ViewerService";
import ViewerLayerKloosterLocaties from '../layer/ViewerLayerKloosterLocaties'
import {ALLOWED_VIEWER_CRS} from "@/shared"
import {plain_symbols, svg_url} from '@/helpers/kloosters/KloosterSymbols'

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
      legend_img: svg_url + plain_symbols['klooster'],
      available_crs: ALLOWED_VIEWER_CRS,
    }));
    layers.push(new ViewerLayerKloosterLocaties({
      name: 'kapittels',
      extent_lonlat: extent,
      title: 'kapittels',
      legend_img: svg_url + plain_symbols['kapittel'],
      available_crs: ALLOWED_VIEWER_CRS,
    }));
    layers.push(new ViewerLayerKloosterLocaties({
      name: 'uithoven',
      extent_lonlat: extent,
      title: 'uithoven',
      legend_img: svg_url + plain_symbols['uithof'],
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
