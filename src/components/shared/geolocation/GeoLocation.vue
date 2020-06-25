<template>

    <b-nav-item href="#" @click="geoLocate()" right>
      <b-spinner v-if="showspinner" small></b-spinner>
        my location
    </b-nav-item>

</template>

<script>
    import {Mapable} from "@/mixins/mapable";
    import Geolocation from "ol/Geolocation";
    import Style from "ol/style/Style";
    import Circle from "ol/style/Circle";
    import Fill from "ol/style/Fill";
    import Stroke from "ol/style/Stroke";
    import Point from "ol/geom/Point";
    import VectorLayer from "ol/layer/Vector";
    import VectorSource from "ol/source/Vector";
    import Feature from "ol/Feature";

  //zoom to user's location
    export default {
        name: "GeoLocation",
        mixins: [Mapable],
        data: function () {
            return {
                showspinner: false
            }
        },
        methods: {
            geoLocate: function() { //Shouldn't this be moved to the Map.vue component?
                this.showspinner=true;
                let centered=false;
                let view=this.map.getView();
                let geolocation = new Geolocation({
                    // take the projection to use from the map's view
                    projection: view.getProjection(),
                    tracking: true
                });
                var positionFeature = new Feature();
                positionFeature.setStyle(new Style({
                    image: new Circle({
                        radius: 6,
                        fill: new Fill({
                            color: '#3399CC'
                        }),
                        stroke: new Stroke({
                            color: '#fff',
                            width: 2
                        })
                    })
                }));
                new VectorLayer({
                    map: this.map,
                    source: new VectorSource({
                        features: [positionFeature]
                    })
                });
                let me=this;
                geolocation.on('change', function(evt) {
                    me.showspinner=true
                    let coordinates = geolocation.getPosition();
                    positionFeature.setGeometry(coordinates ?
                        new Point(coordinates) : null);
                    if (!centered) {
                        view.setCenter(coordinates);
                        view.setZoom(15);
                        centered=true;
                    }
                    me.showspinner=false;
                });
            }
        }

  }
</script>

<style scoped>

</style>
