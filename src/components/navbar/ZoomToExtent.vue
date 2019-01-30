<template>
  <b-navbar-nav>
    <b-nav-item @click='zoomExtent()' href="#">fit</b-nav-item>
  </b-navbar-nav>
</template>

<script>
  import {Mapable} from '@/mixins/mapable.js'; // makes the OL map object available to the component
  import {transformExtent} from "ol/proj";
    export default {
      name: "ZoomToExtent",
      mixins: [Mapable],
      methods: {
        zoomExtent() {
          const a=this.map.getLayers().getArray();
          const toplayer=a[a.length - 1];
          console.log(toplayer);
          const view=this.map.getView()
          const extent=toplayer.get('extent_lonlat');
          if (extent!==undefined) {
            view.fit(transformExtent(extent, 'EPSG:4326', view.getProjection()), this.map.getSize());
          }
        }
      }
    }
</script>

<style scoped>

</style>
