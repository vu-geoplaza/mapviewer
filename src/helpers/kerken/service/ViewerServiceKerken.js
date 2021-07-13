import ViewerService from "../../service/ViewerService";
import ViewerLayerKerken from '../layer/ViewerLayerKerken'
import ViewerLayerKerkenClustered from "../layer/ViewerLayerKerkenClustered";

class ViewerServiceKerken extends ViewerService {
    constructor(props) {
        super(props);
        this.kerk_options = props.kerk_options;
    }

    async getCapabilities() {
        return 'skip';
    }

    setLayers(layers) {
        this.layers = [];
        for (const l of layers) {
            if (l.title=='kerken'){
                this.layers.push(new ViewerLayerKerken(l));
            } else {
                this.layers.push(new ViewerLayerKerkenClustered(l));
            }
        }
    }


}

export default ViewerServiceKerken;
