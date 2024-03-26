<template>
  <b-nav-item-dropdown v-bind:text="$t('baselayer')">
    <b-dropdown-item v-on:click="switchBaseLayer(item.code)" v-for="(item, index) in items" :index="index" :key="index"
                     :item="item">
      {{ item.name }}&nbsp;<span v-if="item.active">*</span>
    </b-dropdown-item>
  </b-nav-item-dropdown>
</template>

<script>
  import {Mapable} from '@/mixins/mapable.js';
  import {SharedEventBus} from "@/shared"; // makes the OL map object available to the component
  export default {
    name: "BaseLayerSwitcher",
    mixins: [Mapable],
    data() {
      return {
        items: [],
        active_projection: ''
      }
    },
    methods: {
      onMapBound() {
        var me = this;
        me.initSwitcher();

        me.map.getLayers().on('change:length', function () {
          me.initSwitcher(me.map.getView().getProjection().getCode());
        });
        //switch to preferred baselayer (should always be set).
        me.switchBaseLayer(me.$config.baselayer);
      },
      initSwitcher() {
        var me=this;
        const items=[]
        let active_projection = '';
        console.log('init baselayer switcher');
        console.log('available projections: ' + me.$config.available_crs.join(', '));
        var layers = this.map.getLayers();
        layers.forEach(function (layer) {
          if (layer.get('type') === 'base') {
            let active=false;
            if (layer.getVisible()){
              active=true;
              active_projection=layer.get('projcode');
            }
            if (me.$config.available_crs.includes(layer.get('projcode'))){
              items.push({
                  active: active,
                  code: layer.get('code'),
                  name: layer.get('name'),
                  projcode: layer.get('projcode')
                })
            }
          }
        });
        this.items=items;
        this.active_projection = active_projection;
      },
      switchBaseLayer: function (code) {
        this.$config.baselayer=code;
        let me=this;
        this.map.getLayers().forEach(function (layer) {
          if (layer.get('type') === 'base') {
            if (layer.get('code') === code) {
              const crs=layer.get('projcode');
              if (crs!==me.active_projection){
                me.active_projection=crs;
                SharedEventBus.$emit('change-projection', crs);
              }
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
