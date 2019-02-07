<template>
  <b-nav-item-dropdown text="projection">
    <b-dropdown-item v-on:click="switchProjection(item.code)" v-for="(item, index) in items" :index="index" :key="index" :item="item">
      {{ item.name }}&nbsp;{{ item.active }}
    </b-dropdown-item>
  </b-nav-item-dropdown>
</template>

<script>
  import {Mapable} from '@/mixins/mapable.js'; // makes the OL map object available to the component
  import {GpzEventBus} from '@/main.js';

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
          if (crs==='EPSG:28992') { name='Amersfoort / RD New' }
          if (crs==='EPSG:3857') { name='WGS 84 / Pseudo-Mercator' }
          if (crs==='EPSG:4326') { name='World Geodetic System 1984' }
          let active='';
          if (crs===current){ active='*' }

          this.items.push({name: name, code: crs, active: active});
        }
      },
      switchProjection(crs) {
        GpzEventBus.$emit('change-projection', crs);
        for (const item in this.items){
          if (item.code===crs) {
            item.active='*'
          } else {
            item.active=''
          }
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
