<template>
  <b-modal id="servicemodal" title="Add layers from url" @ok="handleOk">
    <b-row>
    <b-col sm="8">
      <b-form-input v-model="serviceurl" type="url" placeholder="enter url...">{{ serviceurl }}</b-form-input>
    </b-col>
    <b-col sm="4">
      <b-form-select v-model="selected" :options="options" class="mb-3"/>
    </b-col>
    </b-row>
  </b-modal>
</template>

<script>
  import {GpzEventBus} from '@/main.js';
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
            value: "arcgis_image",
            text: "ArcGIS Image"
          },
          ,
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
          GpzEventBus.$emit('add-service', {url: this.serviceurl, type: this.selected});
        }
      }
    }
  }
</script>

<style scoped>

</style>
