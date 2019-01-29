<template></template>

<script>
  import 'ol/ol.css';
  import {Map, View} from 'ol';
  import TileLayer from 'ol/layer/Tile';
  import OSM from 'ol/source/OSM';
  import { WMSLayer } from "@/assets/layerHelpers";

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
          title: 'BAG',
          CRS: 'EPSG:3857',
          services: [
            {
              type: 'wms',
              url: 'http://mapsrv.ubvu.vu.nl/proxy/pub/service?',
              layers: [
                {
                  id: 1000,
                  name: 'bag_dec2016:panden',
                  // Should calculate this:
                  legend_img: 'http://mapsrv.ubvu.vu.nl/proxy/pub/service?&version=1.1.1&service=WMS&request=GetLegendGraphic&layer=bag_dec2016:panden&format=image/png&foo=',
                  opacity: 0.8,
                  visible: true
                },
                {
                  id: 1001,
                  name: 'bag_dec2016:panden_bouwjaar',
                  legend_img: 'http://mapsrv.ubvu.vu.nl/proxy/pub/service?&version=1.1.1&service=WMS&request=GetLegendGraphic&layer=bag_dec2016:panden_bouwjaar&format=image/png&foo=',
                  opacity: 0.4,
                  visible: false
                },
                {
                  id: 1002,
                  name: 'bag_dec2016:verblijfsobject_gebruiksdoel',
                  legend_img: 'http://mapsrv.ubvu.vu.nl/proxy/pub/service?&version=1.1.1&service=WMS&request=GetLegendGraphic&layer=bag_dec2016:verblijfsobject_gebruiksdoel&format=image/png&foo=',
                  opacity: 1.0,
                  visible: false
                }
              ]
            }
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
      addLayers: function () {
        console.log('add layers')
        for (const service of this.mapdata.services) {
          if (service.type == 'wms') {
            for (const layer of service.layers) {
              const l=WMSLayer(service,layer)
              l.set('lid', layer.id);
              l.set('name', layer.name);
              l.set('type', 'wms');
              l.set('legend_img', layer.legend_img);
              l.setVisible(layer.visible)
              this.map.addLayer(l);
            }
          }
        }
      }
    }
  }
</script>
