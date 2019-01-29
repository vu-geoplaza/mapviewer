<template></template>

<script>
  import 'ol/ol.css';
  import {Map, View} from 'ol';
  import TileLayer from 'ol/layer/Tile';
  import OSM from 'ol/source/OSM';
  import { WMSLayer, WMTSLayer, getWMSCapabilities, getWMTSCapabilities } from "@/assets/layerHelpers";
  import { GpzEventBus } from '@/main.js';

  // Add a simple extension to enable layer lookup by layer id
  if (Map.prototype.getLayerByLid === undefined) {
    Map.prototype.getLayerByLid = function (id) {
      var layer;
      this.getLayers().forEach(function (lyr) {
        if (id == lyr.get('lid')) {
          layer = lyr;
        }
      });
      return layer;
    }
  }

  export default {
    name: 'GpzMap',
    data() {
      return {
        mapdata: {
          CRS: 'EPSG:3857',
          services: [
          ]
        }
      }
    },
    mounted () {
      var me=this;
      // Send the event 'ol-map-mounted' with the OL map as payload
      GpzEventBus.$emit('ol-map-mounted', this.map);

      // resize the map, so it fits to parent
      console.log('map mounted');
      window.setTimeout(() => {
        console.log('set target');
        this.map.setTarget(document.getElementById('ol-map-container'));
        this.map.updateSize();
      }, 200);

    },
    created() {
      console.log('map created');
      this.initMap();
      this.addLayers();
      this.wmsLoader('https://geodata.nationaalgeoregister.nl/inspire/sr/ows?');
      this.wmsLoader('https://geodata.nationaalgeoregister.nl/bestandbodemgebruik2015/ows?');
      // this.wmtsLoader('https://geodata.nationaalgeoregister.nl/tiles/service/wmts?'); // deze wordt alleen aangeboden in 28992
    },
    methods: {
      initMap() {
        // create a map object, do not bind it to the DOM yet.
        console.log('init map');
        this.view= new View({
          center: [546677, 6867102],
          zoom: 15
        });
        this.map = new Map({
          layers: [
            new TileLayer({
              source: new OSM(),
              type: 'base'
            })
          ],
          view: this.view
        });
      },
      wmtsLoader: function(url) {
        var me=this;
        getWMTSCapabilities(url, function(service){
          me.addLayersFromWMTS(service);
        });
      },
      wmsLoader: function(url) {
        var me=this;
        getWMSCapabilities(url, function(service){
          me.addLayersFromWMS(service);
        });
      },
      addLayers: function () {
        console.log('add layers')
        for (const service of this.mapdata.services) {
          if (service.type == 'wms') {
            this.addLayersFromWMS(service);

          } else if (service.type == 'wmts') {
            this.addLayersFromWMTS(service);
          }
        }
      },
      addLayersFromWMS(service){
        for (const layer of service.layers) {
          const l=WMSLayer(service,layer);
          l.set('lid', layer.id);
          l.set('name', layer.name);
          l.set('title', layer.title);
          l.set('type', 'wms');
          l.set('legend_img', layer.legend_img);
          l.setVisible(layer.visible);
          this.map.addLayer(l);
        }
      },
      addLayersFromWMTS(service){
        for (const layer of service.layers) {
          const l=WMTSLayer(service,layer)
          l.set('lid', layer.id);
          l.set('name', layer.name);
          l.set('title', layer.title);
          l.set('type', 'wmts');
          l.set('legend_img', layer.legend_img);
          l.setVisible(layer.visible)
          this.map.addLayer(l);
        }
      }
    }
  }
</script>
