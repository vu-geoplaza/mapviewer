import ViewerService from "../../service/ViewerService";
import ViewerLayerKerkenBAG from '../layer/ViewerLayerKerkenBAG'
import {ALLOWED_VIEWER_CRS} from "@/shared"

class ViewerServiceKerkenBAG extends ViewerService {
    constructor(props) {
        super(props);
    }

    async getCapabilities() {
        const layers = [];
        const extent = [
            -1.86027801047121,
            49.854107444730744,
            12.20222198952879,
            54.35672339723146
        ]; // Nederland
        layers.push(new ViewerLayerKerkenBAG({
            id: 'kerken_bag',
            name: 'kerken_bag',
            extent_lonlat: extent,
            title: 'kerken_bag',
            available_crs: ALLOWED_VIEWER_CRS,
        }));
        return layers;
    }

    setLayers(layers) {
        this.layers = [];
        for (const l of layers) {
            this.layers.push(new ViewerLayerKerkenBAG(l));
        }
    }


}

export default ViewerServiceKerkenBAG;
