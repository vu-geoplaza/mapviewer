<template>
  <div id="feature-info">
    <b-card v-show='toggle' no-body class="mb-1">
      <b-card-header header-tag="header" class="p-1">
        <a @click='toggle = !toggle' class="fa-pull-left">
          <font-awesome-icon icon="arrow-right" />
        </a>
        <span class="widget-header-text">Feature Info</span>
      </b-card-header>
      <b-card-body>
        <b-tabs>
          <b-tab v-for="(item, index) in items" :key="index" :title="item.title">
            <span v-html="item.content"></span>
          </b-tab>
        </b-tabs>
      </b-card-body>
    </b-card>
  </div>
</template>

<script>
  import {Mapable} from '@/mixins/mapable.js'; // makes the OL map object available to the component
  import axios from "axios";

  export default {
    name: "FeatureInfo",
    mixins: [Mapable],

    data() {
      return {
        toggle: false,
        items: [{
          title: 'empty'
        }]
      }
    },
    methods: {
      /**
       * This function is executed, after the map is bound (see mixins/Mapable)
       */
      onMapBound() {
        var me = this;
        // bind an onclick for the featureInfo
        console.log('register map click')
        this.map.on('singleclick', function (evt) {
          me.getFeatureInfo(evt.coordinate);
        });
      },
      getFeatureInfo: function (coordinate) {
        var me = this;
        this.items = [];
        const viewResolution = (this.map.getView().getResolution());
        const viewProjection = (this.map.getView().getProjection());
        const layers = this.map.getLayers();
        layers.forEach(function (layer) {
          if (layer.get('type') === 'wms') {
            if (layer.getVisible()) {
              // get source from layer
              let url = layer.getSource().getGetFeatureInfoUrl(
                coordinate, viewResolution, viewProjection,
                {'INFO_FORMAT': 'text/html'});
              axios({method: "GET", "url": url}).then(result => {
                me.addItem(
                  {
                    title: layer.get('name'),
                    content: result.data
                  }
                );
              }, error => {
                console.error(error);
              });
            }
          }
        });
      },
      addItem: function(item){
        this.items.push(item);
        this.toggle = true;
      }
    }
  }
</script>

<style scoped>

  #feature-info {
    background-color: azure;
    z-index: 1000;
    opacity: 0.95;
  }
</style>
