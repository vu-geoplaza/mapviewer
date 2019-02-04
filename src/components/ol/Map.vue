<template></template>

<script>
  import 'ol/ol.css';
  import {Map, transform} from 'ol';
  import TileLayer from 'ol/layer/Tile';
  import OSM from 'ol/source/OSM';
  import {register} from 'ol/proj/proj4'
  import {
    BRT,
    base4326,
    setView
  } from "@/helpers/layerHelpers";
  import ViewerService from '@/helpers/ViewerService'
  import {GpzEventBus} from '@/main.js';
  import {transformExtent} from "ol/proj";
  import View from "ol/View";
  import ViewerWMS from '@/helpers/ViewerWMS'
  import ViewerWMTS from '@/helpers/ViewerWMTS'
  // Add a simple extension to enable layer lookup by layer id
  if (Map.prototype.getLayerByLid === undefined) {
    Map.prototype.getLayerByLid = function (id) {
      var layer;
      this.getLayers().forEach(function (lyr) {
        if (id === lyr.get('lid')) {
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
        map: Object
      }
    },
    mounted() {
      // Send the event 'ol-map-mounted' with the OL map as payload
      GpzEventBus.$emit('ol-map-mounted', this.map);
      GpzEventBus.$on('change-projection', crs => {
        this.reProject(crs)
      });
      var me=this;
      GpzEventBus.$on('add-service', options => {
        // TODO rewrite to use ViewerService
        const service = this.$config.getService({
          type: options.type,
          url: options.url
        });
        console.log('adding service');
        service.getServiceInstance(service, this.map.getView().getProjection().getCode()).then(function (serviceData) {
          for (const layer of serviceData.layers) {
            console.log('add layer ' + layer.title);
            me.calcAvailableCRS(layer.available_crs);
            me.map.addLayer(layer.ol);
          }
        });
      });

      // resize the map, so it fits to parent
      console.log('map mounted');
      window.setTimeout(() => {
        console.log('set target');
        var div=document.getElementById('ol-map-container');
        this.map.setTarget(div);
        this.map.updateSize();
        // fit to view
        this.map.getView().fit(transformExtent(this.$config.bbox, 'EPSG:4326', this.map.getView().getProjection()), {size: [div.clientWidth,div.clientHeight], nearest: true});
      }, 200);

    },
    created() {
      console.log('map created');

      this.initMap();
    },
    methods: {
      initMap: function () {
        var me = this;
        // create a map object, do not bind it to the DOM yet.
        const mapdata=this.$config;
        console.log('init map crs: ' + mapdata.crs);
        const view = new View({
          projection: mapdata.crs
        });

        this.map = new Map({
          view: view,
        });
        this.map.available_crs = [mapdata.crs];

        view.fit(transformExtent(mapdata.bbox, 'EPSG:4326', view.getProjection()), this.map.getSize());
        this.map.setView(view);

        this.setBaseLayer(mapdata.crs);
        this.addLayers(mapdata);

      },

      reProject: function (crs) {
        console.log('reproject to ' + crs);
        this.removeBaseLayers();
        const curview=this.map.getView(this.map.getSize());
        const extent = transformExtent(curview.calculateExtent(), curview.getProjection().getCode(), crs);
        const view = new View({
          projection: crs
        });
        view.fit(extent, {size: this.map.getSize(), nearest: true});

        this.map.setView(view);
        this.setBaseLayer(crs);
      },
      addLayers(mapdata) {
        var me = this;
        for (const service of mapdata.services) {
          service.getServiceInstance(service, mapdata.crs).then(function (serviceData) {
            for (const layer of serviceData.layers) {
              console.log('add layer '+layer.title);
              me.calcAvailableCRS(layer.available_crs);
              me.map.addLayer(layer.ol);
            }
          });
        }
      },
      calcAvailableCRS(arr_crs) {
        const allowedCRS = ['EPSG:28992', 'EPSG:3857', 'EPSG:4326'];
        if (this.map.available_crs.length <= 1) {
          this.map.available_crs = allowedCRS;
        }
        const new_arr = [];
        for (const crs of this.map.available_crs) {
          if ((arr_crs.indexOf(crs) > -1) && (new_arr.indexOf(crs) === -1) && (allowedCRS.indexOf(crs) > -1)) {
            new_arr.push(crs);
          }
        }
        this.map.available_crs = new_arr;
      },
      setBaseLayer(crs) {
        console.log('set base layer');
        if (crs === 'EPSG:3857') {
          this.map.addLayer(new TileLayer({
            source: new OSM(),
            type: 'base'
          }));
        } else if (crs === 'EPSG:28992') {
          this.map.addLayer(BRT());
        } else if (crs === 'EPSG:4326') {
          this.map.addLayer(base4326());
        }
      },
      removeBaseLayers() {
        var me = this;
        this.map.getLayers().forEach(function (layer) {
          if (layer != undefined) {
            if (layer.get('type') === 'base') {
              me.map.removeLayer(layer);
            }
          }
        });
      }
    }
  }
</script>
