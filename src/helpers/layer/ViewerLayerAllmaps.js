import ViewerLayer from './ViewerLayer'
import {WarpedMapLayer, WarpedMapSource} from '@allmaps/openlayers'
import axios from "axios";


class ViewerLayerAllmaps extends ViewerLayer {
    OLLayer() {
        console.log('**** OLLayer');
        let source = new WarpedMapSource();
        // get the annotation json from the annotation urls and add then to the source.
        for (let annotation_url of this.options.annotation_urls) {
            axios.get(annotation_url).then(function (response) {
                source.addGeorefAnnotation(response.data);
            });
        }
        // get the extent from the source?
        return new WarpedMapLayer({
            source: source,
            type: 'allmaps',
            legend_img: this.legend_img,
            visible: this.visible,
            zIndex: this.zindex,
            opacity: this.opacity,
        });
    }
}

export default ViewerLayerAllmaps;
