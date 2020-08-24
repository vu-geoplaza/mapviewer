<template>
  <b-nav-item @click='zoomExtent()' href="#">overview</b-nav-item>
</template>

<script>
    import {Mapable} from '@/mixins/mapable.js'; // makes the OL map object available to the component
    import {transformExtent} from "ol/proj";
    import {SharedEventBus} from "@/shared";

    export default {
        name: "FitExtent",
        mixins: [Mapable],
        mounted()  {
        const me = this;
        // Some events triggered by the Vue app:
        SharedEventBus.$on('force-fit', function () {
          console.log('force-fit');
          me.zoomExtent();
        });
      },
        methods: {
            zoomExtent() {
                const a = this.map.getLayers().getArray();
                // should be separate function
                var zindex = 0;
                for (const l of a) {
                    if (l.get('type') !== 'base') {
                        if (l.getZIndex() > zindex) {
                            var toplayer = l;
                            zindex = l.getZIndex();
                        }
                    }
                }
                const view = this.map.getView();
                let extent = toplayer.getSource().getExtent();
                if (extent == null) {
                  extent=transformExtent(toplayer.get('extent_lonlat'), 'EPSG:4326', view.getProjection())
                }
                view.fit(extent, { size: this.map.getSize(), padding: [80, 80, 80, 80], maxZoom: 17});
            }
        }
    }
</script>

<style scoped>

</style>
