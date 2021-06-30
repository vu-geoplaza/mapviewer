<template>
  <b-nav-item @click='zoomExtent()' href="#">overview</b-nav-item>
</template>

<script>
    import {Mapable} from '@/mixins/mapable.js'; // makes the OL map object available to the component
    import {transformExtent} from "ol/proj";
    import {SharedEventBus} from "@/shared";
    import {Vector} from "ol/layer";

    export default {
        name: "FitExtent",
        mixins: [Mapable],
        mounted()  {
        const me = this;
        // Some events triggered by the Vue app:
        SharedEventBus.$on('force-fit', function () {
          me.zoomExtent();
        });
      },
        methods: {
            zoomExtent() {
                const a = this.map.getLayers().getArray();
                // should be separate function
                let zindex = 0;
                for (const l of a) {
                    if (l.get('type') !== 'base'&&l.get('type') !== 'marker') {
                        if (l.getZIndex() > zindex) {
                            var toplayer = l;
                            zindex = l.getZIndex();
                        }
                    }
                }
                const view = this.map.getView();
                let extent = null;
                if (typeof toplayer.get('extent_lonlat') !== 'undefined'){
                  extent=transformExtent(toplayer.get('extent_lonlat'), 'EPSG:4326', view.getProjection())
                }
                if (toplayer instanceof Vector) {
                  extent = toplayer.getSource().getExtent();
                }
              if (extent !== null) {
                view.fit(extent, {size: this.map.getSize(), padding: [80, 80, 80, 80], maxZoom: 17});
              } else {
                SharedEventBus.$emit('show-message', 'could not get extent of top layer', 'warning');
              }
            }
        }
    }
</script>

<style scoped>

</style>
