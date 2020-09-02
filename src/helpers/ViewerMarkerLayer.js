//An empty vector layer to add marker features to.
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import Style from "ol/style/Style";
import CircleStyle from "ol/style/Circle";
import Stroke from "ol/style/Stroke";

export function MarkerLayer() {
    return new VectorLayer({
        type: 'marker',
        lid: 'marker',
        zIndex: 150, //always on top
        visible: false,
        source: new VectorSource({
            features: []
        }),
        style: function (feature) {
            if (feature.get('type') === 'pointMarker') {
                return new Style({
                    image: new CircleStyle({
                        radius: 15,
                        stroke: new Stroke({
                            color: 'red',
                            width: 2,
                        }),
                    }),
                });
            }
            return null;
        }
    })
}