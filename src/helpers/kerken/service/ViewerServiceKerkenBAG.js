import ViewerService from "../../service/ViewerService";
import ViewerLayerKerkenBAG from '../layer/ViewerLayerKerkenBAG'

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
            this.layers.push(new ViewerLayerKerkenBAG(l));
        }
    }


}

export default ViewerServiceKerkenBAG;
