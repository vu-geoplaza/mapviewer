<template>
  <b-nav-item-dropdown text="projection">
    <b-dropdown-item v-on:click="switchProjection(item.code)" v-for="(item, index) in items" :index="index" :key="index" :item="item">
      {{ item.name }}&nbsp;<span v-if="item.active">*</span>
    </b-dropdown-item>
  </b-nav-item-dropdown>
</template>

<script>
  import {Mapable} from '@/mixins/mapable.js'; // makes the OL map object available to the component
  import {SharedEventBus} from '@/shared';

  export default {
    name: "ProjectionSwitcher",
    mixins: [Mapable],
    data() {
      return {
        items: []
      }
    },
    methods: {
      /**
       * This function is executed, after the map is bound (see mixins/Mapable)
       */
      onMapBound() {
        var me = this;
        //me.initSwitcher();
        me.map.getLayers().on('change:length', function () {
          me.initSwitcher(me.map.getView().getProjection().getCode());
        });
      },
      initSwitcher(current) {
        this.items=[];
        console.log('ínit proj switcher');
        for (const crs of this.map.available_crs) {
          let name=crs;
          if (crs==='EPSG:28992') { name='Rijksdriehoekstelsel' }
          if (crs==='EPSG:3857') { name='Web Mercator (OSM/Bing)' }
          if (crs==='EPSG:4326') { name='World Geodetic System 1984' }
          let active=false;
          if (crs===current){ active=true }

          this.items.push({name: name, code: crs, active: active});
        }
      },
      switchProjection(crs) {
        SharedEventBus.$emit('change-projection', crs);
        var i=0;
        for (const item in this.items){
          this.items[i].active=false;
          if (item.code===crs) { this.items[i]=true }
          i++;
        }
        console.log('switch to' + crs);
      }
    },

  }
</script>

<style scoped>
  .nav-item {
    list-style: none;
  }
</style>
