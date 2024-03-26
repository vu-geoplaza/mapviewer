import ViewerService from "../../service/ViewerService";
import ViewerLayerKerkenBAG from '../layer/ViewerLayerKerkenBAG'
import {ALLOWED_VIEWER_CRS} from "../../../shared";

class ViewerServiceKerkenBAG extends ViewerService {
    constructor(props) {
        super(props);
    }

    async getCapabilities() {
        return 'skip';
    }

    setLayers(layers) {
        this.layers = [];
        for (const l of layers) {
            l.available_crs=ALLOWED_VIEWER_CRS; // not set in getCapabilities
            this.layers.push(new ViewerLayerKerkenBAG(l));
        }
    }


}

export default ViewerServiceKerkenBAG;
