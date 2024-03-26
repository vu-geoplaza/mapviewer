import ViewerService from "../../service/ViewerService";
import ViewerLayerKerken from '../layer/ViewerLayerKerken'
import ViewerLayerKerkenClustered from "../layer/ViewerLayerKerkenClustered";
import {ALLOWED_VIEWER_CRS} from "../../../shared";

class ViewerServiceKerken extends ViewerService {
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
            if (l.title=='kerken'){
                this.layers.push(new ViewerLayerKerken(l));
            } else {
                this.layers.push(new ViewerLayerKerkenClustered(l));
            }
        }
    }


}

export default ViewerServiceKerken;
