<template>
  <b-nav-item-dropdown text="base layer">
    <b-dropdown-item v-on:click="switchBaseLayer(item.code)" v-for="(item, index) in items" :index="index" :key="index"
                     :item="item">
      {{ item.name }}&nbsp;<span v-if="item.active">*</span>
    </b-dropdown-item>
  </b-nav-item-dropdown>
</template>

<script>
  import {Mapable} from '@/mixins/mapable.js'; // makes the OL map object available to the component
  import {GpzEventBus} from '@/main.js';

  export default {
    name: "BaseLayerSwitcher",
    mixins: [Mapable],
    data() {
      return {
        items: []
      }
    },
    methods: {
      onMapBound() {
        var me = this;
        me.initSwitcher();

        me.map.getLayers().on('change:length', function () {
          me.initSwitcher(me.map.getView().getProjection().getCode());
        });
      },
      initSwitcher() {
        const items=[]
        console.log('init baselayer switcher');
        var layers = this.map.getLayers();
        layers.forEach(function (layer) {
          if (layer.get('type') === 'base') {
            let active=false;
            if (layer.getVisible()){
              active=true;
            }
            items.push({
                active: active,
                code: layer.get('code'),
                name: layer.get('name')
              })
          }
        });
        this.items=items;
      },
      switchBaseLayer: function (code) {
        this.map.getLayers().forEach(function (layer) {
          if (layer.get('type') === 'base') {
            if (layer.get('code') === code) {
              layer.setVisible(true);
            } else {
              layer.setVisible(false);
            }
          }
        });
        for (const i in this.items) {
          if (this.items[i].code === code) {
            this.items[i].active = true;
          } else {
            this.items[i].active = false;
          }
        }
      }
    }
  }

</script>

<style scoped>
  .nav-item {
    list-style: none;
  }
</style>
