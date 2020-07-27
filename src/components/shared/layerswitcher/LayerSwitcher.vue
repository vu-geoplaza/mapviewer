<template>
<div class="layerswitcher">
  <a @click='toggle = !toggle' v-show='!toggle' class="open-button">
    <font-awesome-icon icon="layer-group" />
  </a>
    <b-card v-show='toggle' visible no-body class="mb-1">
      <b-card-header header-tag="header" class="p-2">
        <span class="widget-header-text">Layers</span>
        <a @click='toggle = !toggle' class="pull-right">
          <font-awesome-icon icon="arrow-left" />
        </a>
      </b-card-header>
        <b-card-body class="p-2 scroll">
          <SortableList lockAxis="y" v-model="items" :useDragHandle="true">
            <SortableItem v-for="(item, index) in items" :index="index" :key="index" :item="item"/>
          </SortableList>
        </b-card-body>
    </b-card>
</div>
</template>

<script>
  import SortableItem from './SortableItem.vue';
  import SortableList from './SortableList.vue';
  import {Mapable} from '@/mixins/mapable.js'; // makes the OL map object available to the component

  export default {
    name: 'LayerSwitcher',
    mixins: [Mapable],
    components: {
      SortableItem,
      SortableList
    },
    data: function () {
      return {
        items: [],
        toggle: true
      }
    },
    methods: {
      /**
       * This function is executed, after the map is bound (see mixins/Mapable)
       */
      onMapBound: function () {
        var me = this;
        me.initSwitcher();
        // react on added / removed layers
        me.map.getLayers().on('change:length', function (evt) {
          me.initSwitcher();
        });
      },
      /**
       * get all the layers from the map, create the switcher items, sort them by the layer zIndex
       */
      initSwitcher: function () {
        // get the needed info for the switcher from the map object (from Mapable)
        console.log('init layer switcher');
        var layers = this.map.getLayers();
        var layerItems = [];
        layers.forEach(function (layer) {
          if (layer.get('type') !== 'base') {
            layerItems.push({
              id: layer.get('lid'),
              label: layer.get('label'),
              visible: layer.getVisible(),
              opacity: layer.getOpacity() * 100,
              legend_img: layer.get('legend_img'),
              zIndex: layer.getZIndex()
            });
          }
        });
        layerItems.sort(function (a, b) {
          return b.zIndex - a.zIndex;
        });
        this.items = layerItems;
        this.init = true;
      }
    },
    watch: {
      items: {
        /**
         * automatically called when the items array changes.
         * Will set the zIndex of the map layers in the same order as the switcher
         *
         * Would be better to just update the changed layer, but don't know how
         *
         * @param val
         * @param oldVal
         */
        handler: function (val, oldVal) {
          if (!this.init) { // don't run on initializing the switcher itself, might mess up the order when asynchronously adding layers
            var zindex = 100;
            for (const item of val) {
              const l = this.map.getLayerByLid(item.id); // or bind the layer object to the switcher?
              l.setOpacity(item.opacity/100);
              l.setVisible(item.visible);
              l.setZIndex(zindex);
              zindex--;
            }
            this.map.updateSize();
          }
          this.init = false;
        },
        deep: true
      }
    }
  };

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h1, h2 {
    font-weight: normal;
  }

  a {
    color: #42b983;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    list-style-type: none;
  }

  .pull-left {
    float: left;
  }

  .open-button {
    border: 1px solid black;
    font-size: 19px;
    text-align: center;
    position: absolute;
    height: 30px;
    width: 30px;
    top: 30px;
    left: 30px;
    background-color: white;
  }

  .scroll {
    top: 0px;
    max-height: 80vh;
    overflow-y: auto;
  }


</style>
