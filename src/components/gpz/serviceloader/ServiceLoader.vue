<template>
  <b-modal id="servicemodal" v-bind:title="$t('addlayersurl')" @ok="handleOk">
    <b-row>
    <b-col sm="8">
      <b-form-input v-model="serviceurl" type="url" v-bind:placeholder="$t('enterurl')">{{ serviceurl }}</b-form-input>
    </b-col>
    <b-col sm="4">
      <b-form-select v-model="selected" :options="options" class="mb-3"/>
    </b-col>
    </b-row>
  </b-modal>
</template>

<script>
  import {SharedEventBus} from '@/shared';
  export default {
    name: "ServiceLoader",
    data() {
      return {
        selected: null,
        options: [
          {
            value:null,
            text: 'select type'
          },
          {
          value: "wms",
          text: "WMS"
        },
          {
            value: "wmts",
            text: "WMTS"
          },
          {
            value: "gpx",
            text: "GPX"
          },
          {
            value: "kml",
            text: "KML"
          },
          {
            value: "arcgis_image",
            text: "ArcGIS Image"
          },
          {
            value: "arcgis_tile",
            text: "ArcGIS Tile"
          }

        ],
        serviceurl: ""
      }
    },
    methods: {
      handleOk() {
        if (this.selected!==null){
          console.log('add service' + this.serviceurl );
          SharedEventBus.$emit('add-service', {url: this.serviceurl, type: this.selected});
        }
      }
    }
  }
</script>

<style scoped>

</style>
