import ViewerLayer from './ViewerLayer'
import {WarpedMapLayer, WarpedMapSource} from '@allmaps/openlayers'


class ViewerLayerAllmaps extends ViewerLayer {
    OLLayer() {
        console.log('**** OLLayer');
        let source = new WarpedMapSource();
         // get the annotation json from the annotation urls and add then to the source.
        for (let annotation_url of this.options.annotation_urls) {
            fetch(annotation_url)
                .then((response) => response.json())
                .then((annotation) => { 
                    if (!('error' in annotation)) {
                        source.addGeoreferenceAnnotation(annotation) 
                    } else {
                        console.log('Error loading annotation: ' + annotation_url + ' ' + annotation.error)
                    }
                })        
            }
        // get the extent from the source?
        return new WarpedMapLayer({
            source: source,
            type: 'allmaps',
            legend_img: this.legend_img,
            visible: this.visible,
            zIndex: this.zindex,
            opacity: this.opacity
        });
    }
}

export default ViewerLayerAllmaps;
