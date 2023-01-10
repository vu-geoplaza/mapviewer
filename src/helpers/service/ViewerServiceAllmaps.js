import ViewerService from "./ViewerService";
import ViewerLayerAllmaps from "../layer/ViewerLayerAllmaps";
import {ALLOWED_VIEWER_CRS} from "@/shared";

/*
https://observablehq.com/@allmaps/allmaps-openlayers-plugin
The source of the layer is an array of annotionUrls.
 */

class ViewerServiceAllmaps extends ViewerService {
    async getCapabilities() {
        return "skip";
    }

    setLayers(layers) {
        this.layers = [];
        for (const l of layers) {
            console.log(l)
            let extent = [ // netherlands for now
                3.076515, 50.296118, 7.685279, 53.582500
            ];
            this.layers.push(new ViewerLayerAllmaps({
                name: l.name,
                options: {
                    annotation_urls: l.options.annotation_urls
                },
                extent_lonlat: extent,
                title: l.title,
                legend_img: '',
                available_crs: ALLOWED_VIEWER_CRS,
            }));
        }
    }
}

export default ViewerServiceAllmaps;
