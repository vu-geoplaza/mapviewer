<template>
  <div id="feature-info">
    <b-card no-body v-show='toggle'>
      <b-card-header class="p-2" header-tag="header">
        <button type="button" class="close" aria-label="Close" @click='toggle = !toggle'>
          <span aria-hidden="true">&times;</span>
        </button>
        <span class="widget-header-text">Feature Info</span>
      </b-card-header>
      <b-card-body class="pl-2 pr-0">
        <b-overlay :show="showoverlay" spinner-large rounded="sm">
          <b-tabs>
            <b-tab lazy :key="index" :title="item.title" class="scroll"
                   v-for="(item, index) in items" @click="addMarker(item.feature)">
              <b-table thead-class="hidden_header" striped :items="item.rows">

                <template v-slot:cell(key)="data">
                  <span v-html="data.value"></span>
                </template>
                <template v-slot:cell(value)="data">
                  <span v-html="data.value"></span>
                </template>
              </b-table>
            </b-tab>
          </b-tabs>
        </b-overlay>
      </b-card-body>
    </b-card>
  </div>
</template>

<script>
import {Mapable} from '@/mixins/mapable.js';
import axios from "axios";
import {SharedEventBus} from "@/shared";
import {formatInfo} from "../../../helpers/kerken/KerkInfoFormat";
export default {
  name: "KerkInfo",
  mixins: [Mapable],
  components: {

  },
  data: function () {
    return {
      toggle: false,
      title: 'Info',
      items: [],
      names: [],
      t: [],
      showoverlay: true,
      toshow: -1
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
        me.handleInfoClick(evt.coordinate, evt.pixel);
      });
      SharedEventBus.$on('kerk-selected', feature => {
        me.toggle = true;
        this.items = [];
        me.addMarker(feature);
        me.showInfo(feature);
      })
    },
    handleInfoClick(coordinate, pixel) {
      this.clearMarkers();
      this.toggle = false;
      this.items = [];
      var me = this;
      let n = 0;
      const max = 10;
      this.toshow = 10
      this.map.forEachFeatureAtPixel(pixel, function (feature) {
        if (!feature.get('features')&&feature.get('type')!=='pointMarker') {
          if (n <= max) { // browser slow if showing many tabs
            me.showoverlay = true;
            me.toggle = true;
            me.addMarker(feature);
            me.showInfo(feature);
          }
          n++;
        } else { // clustered feature
          const features = feature.get('features');
          if (features.length<=max) {
            me.showoverlay = true;
            me.toggle = true;
            me.addMarker(features[0]);
            for (var i = 0; i < features.length; i++) {
              if (n <= max) { // browser slow if showing many tabs
                me.showInfo(features[i]);
              }
              n++;
            }
          }
        }
      });
      this.toshow=n;
    },
    addItem(item) {
      this.items.push(item);
      this.showoverlay = false;
    },
    clearMarkers(){
      this.map.getLayerByLid('marker').getSource().clear();
    },
    addMarker(feature){
      this.clearMarkers();
      const markerLayer = this.map.getLayerByLid('marker');
      const markerSource = markerLayer.getSource();
      let marker = feature.clone();
      marker.set('type', 'pointMarker'); // determines the styling
      markerSource.addFeature(marker);
      markerLayer.setVisible(true);
    },
    showInfo(feature) {
      const id=feature.get("id");
      let item = {
        rows: [],
        title: '',
      };
      let me = this;
      let paramstring = 'id=' + id;
      axios.get(this.$config.kerk.info_url + '?' + paramstring).then(result => {
        const data = result.data.features[0].properties;
        item=formatInfo(data);
        item.feature = feature;
        item.title = id.toString();
        me.addItem(item);
        me.addBAGId(data.bag_pand_id);
        if (me.toshow == me.items.length) me.showBAG();
      }, error => {
        console.error(error);
      });
    },
    addBAGId(id){
      if(this.$config.kerk.pand_id.indexOf(id) === -1) {
        this.$config.kerk.pand_id.push(id);
      }
    },
    showBAG() {
      if (this.$config.kerk.pand_id.length>0){
        SharedEventBus.$emit('reload-vector-data');
      }
    }
  }
}

</script>

<style scoped>

</style>
<style>
.hidden_header {
  display: none;
}

#feature-info {
  background-color: azure;
  position: relative;
  opacity: 0.95;
  z-index: 1050;
}

.scroll {
  padding-right: 15px;
  max-height: calc(100vh - 280px);;
  overflow-y: auto;
}
ul {
  list-style-type: none;
  padding: 0;
  margin-bottom: 0 !important;
}
li {
  list-style-type: none;
}
</style>
