import ViewerServiceAllmaps from "./ViewerServiceAllmaps";
import {SharedEventBus} from "@/shared";
import ViewerLayerAllmaps from "../layer/ViewerLayerAllmaps";
//import {ALLOWED_VIEWER_CRS} from "@/shared";

/*
https://observablehq.com/@allmaps/allmaps-openlayers-plugin
The source of the layer is an array of annotionUrls.
 */

class ViewerServiceAllmapsCdm extends ViewerServiceAllmaps {
    async getCapabilities() {
        const cdmrec=this.options.cdmrec;
        const layers = [];
        console.log('get capabalities for cdm record: ' + cdmrec);
        console.log(this);
        let $url = 'https://geoplaza.vu.nl/projects/cdm-allmaps/getRecord.php?id=' + cdmrec;
        if (this.options.single) {
            $url += '&single=true';
        }
        return fetch($url)
                .then((response) => response.json())
                .then((data) => { 
                    for (const layer of data.services[0].layers) {
                        layers.push(new ViewerLayerAllmaps ({
                            id: layer.id,
                            visible: layer.id==cdmrec ? true : false,
                            name: layer.title,
                            title: layer.title,
                            extent_lonlat: layer.bbox,
                            options: {
                                annotation_urls: layer.options.annotation_urls,
                                iiif_urls: layer.options.iiif_urls
                            },
                            legend_img: '', // TODO: Cdm thumbnail?
                            available_crs: ['EPSG:3857']
                        }));
                    }
                    if (layers.length===0) {
                        SharedEventBus.$emit('show-message', 'No georeferenced images for CONTENTdm record ' + cdmrec);
                    }
                    return layers;
                }).catch((error) => {
                    console.log('Error loading cdm record: ' + cdmrec + ' ' + error)
                    SharedEventBus.$emit('show-message', 'Could not load georeference for CONTENTdm record ' + cdmrec + '\n Error: ' + error);
                    return [];
                });
    }
}

export default ViewerServiceAllmapsCdm;
