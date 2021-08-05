<template>
  <div id="feature-info">
    <b-card class="mb-1" no-body v-show='toggle'>
      <b-card-header class="p-1" header-tag="header">
        <a @click='toggle = !toggle' class="fa-pull-left">
          <font-awesome-icon icon="arrow-right"/>
        </a>
        <span class="widget-header-text">{{ $t('featureinfo') }}</span>
      </b-card-header>
      <b-card-body>
        <b-tabs>
          <b-tab :key="index" :title="item.title" class="scroll" v-for="(item, index) in items">
            <span v-html="item.content"></span>
          </b-tab>
        </b-tabs>
      </b-card-body>
    </b-card>
  </div>
</template>

<script>
  import {Mapable} from '@/mixins/mapable.js'; // makes the OL map object available to the component
  import axios from 'axios';
  import {proxyscript} from "@/helpers/proxy";

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
        this.map.on('singleclick', function (evt) {
          me.getFeatureInfo(evt.coordinate, evt.pixel);
        });
      },
      getFeatureInfo: function (coordinate, pixel) {
        this.items = [];
        this.getVectorFeatureInfo(pixel);
        this.getRasterFeatureInfo(coordinate)
      },
      getRasterFeatureInfo(coordinate, proxied) {
        // wmts featureinfo is not yet implemented: https://github.com/openlayers/openlayers/pull/2373
        var me = this;
        const viewResolution = (this.map.getView().getResolution());
        const viewProjection = (this.map.getView().getProjection());
        const layers = this.map.getLayers();
        //TODO: featureInfo for ArcGIS?
        layers.forEach(function (layer) {
          if (layer.get('type') === 'wms') {
            if (layer.getVisible()) {
              // get source from layer
              let url = layer.getSource().getFeatureInfoUrl(
                coordinate, viewResolution, viewProjection,
                {'INFO_FORMAT': 'text/html'});
              if (proxied){
                  const p=encodeURIComponent(url);
                  url= proxyscript + '?url=' + p;
              }
              axios.get(url).then(result => {
                me.addItem(
                  {
                    title: layer.get('label'),
                    content: result.data,
                    zIndex: layer.getZIndex()
                  }
                );
              }, error => {
                if (!proxied){
                  me.getRasterFeatureInfo(coordinate, true)
                }
                console.error(error);
              });
            }
          }
        });
      },
      getVectorFeatureInfo(pixel) {
        // vector features
        var me = this;
        const items = {};
        this.map.forEachFeatureAtPixel(pixel, function (feature, layer) {
          const title = layer.get('label');
          if (typeof items[title] === 'undefined') {
            items[title] = {
              info: [],
              zIndex: layer.getZIndex()
            };
          }
          // make this more sophisticated
          items[title].info.push(feature.get('name'));
        });
        for (const k in items) {
          me.addItem(
            {
              title: k,
              content: items[k].info.join(', '),
              zIndex: items[k].zIndex
            });
        }
      },
      addItem: function (item) {
        this.items.push(item);
        this.toggle = true;
        this.items.sort(function (a, b) {
          return b.zIndex - a.zIndex;
        });
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

  .scroll {
    max-height: 50vh;
    overflow-y: auto;
  }
</style>
