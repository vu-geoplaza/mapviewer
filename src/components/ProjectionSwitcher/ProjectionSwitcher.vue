<template>
  <b-nav-item-dropdown text="projection">
    <b-dropdown-item v-on:click="switchProjection(item.name)" v-for="(item, index) in items" :index="index" :key="index" :item="item">
      {{ item.name }}
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
          me.initSwitcher();
        });
      },
      initSwitcher() {
        this.items=[];
        console.log('ínit proj switcher');
        for (const crs of this.map.available_crs) {
          this.items.push({name: crs});
        }
      },
      switchProjection(crs) {
        GpzEventBus.$emit('change-projection', crs);
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
