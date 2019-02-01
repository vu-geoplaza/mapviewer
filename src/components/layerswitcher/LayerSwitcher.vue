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
    created() {
      console.log('switcher created')
      //this.initSwitcher()
    },
    data() {
      return {
        items: [],
        toggle: true
      }
    },
    methods: {
      /**
       * This function is executed, after the map is bound (see mixins/Mapable)
       */
      onMapBound() {
        var me = this;
        me.initSwitcher();
        // react on added / removed layers
        me.map.getLayers().on('change:length', function (evt) {
          me.initSwitcher();
        });
      },
      initSwitcher() {
        // get the needed info for the switcher from the map object (from Mapable)
        console.log('init layer switcher');
        var layers = this.map.getLayers();
        // clone to only reverse the order for the list
        //var layerArrClone = layers.getArray().slice(0);
        //layers = layerArrClone.reverse();
        var layerItems = [];
        layers.forEach(function (layer) {
          if (layer.get('type') === 'wms'||layer.get('type') === 'wmts') {
            layerItems.push({
              id: layer.get('lid'),
              name: layer.get('name'),
              title: layer.get('title'),
              visible: layer.getVisible(),
              opacity: layer.getOpacity(),
              legend_img: layer.get('legend_img'),
              zIndex: layer.getZIndex()
            });
          }
        });
        layerItems.sort(function(a,b){
          return b.zIndex - a.zIndex;
        });
        this.items = layerItems;
        this.init=true;
      }
    },
    watch: {
      items: {
        handler(val, oldVal) {
          if (!this.init) { // don't run on initializing thw switcher itself
            // Update the map when something changes in the switcher.
            // Looks like it's to messy to isolate exactly what is changed
            console.log('items handler tripped')
            var zindex = 100;
            for (const item of val) {
              const l = this.map.getLayerByLid(item.id);
              l.setVisible(item.visible);
              l.setZIndex(zindex);
              zindex--;
            }
            this.init=false;
            this.map.updateSize();
          }
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
    max-height: 80vh;
    overflow-y: auto;
  }


</style>
