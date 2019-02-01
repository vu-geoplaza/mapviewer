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
    setView,
    layerHelper
  } from "@/assets/layerHelpers";
  import {GpzEventBus} from '@/main.js';
  import {transformExtent} from "ol/proj";
  import proj4 from 'proj4';
  import View from "ol/View";

  proj4.defs("EPSG:28992", "+proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +y_0=463000 +ellps=bessel +units=m +no_defs");
  register(proj4);

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
        mapdata: {
          CRS: 'EPSG:28992',
          bbox: [3.31497114423, 50.803721015, 7.09205325687, 53.5104033474],
          available_crs: [],
          services: [{}]
        },
        map: Object
      }
    },
    mounted() {
      // Send the event 'ol-map-mounted' with the OL map as payload
      GpzEventBus.$emit('ol-map-mounted', this.map);
      GpzEventBus.$on('change-projection', crs => {
        this.reProject(crs)
      });

      // resize the map, so it fits to parent
      console.log('map mounted');
      window.setTimeout(() => {
        console.log('set target');
        var div=document.getElementById('ol-map-container');
        this.map.setTarget(div);
        this.map.updateSize();
        // fit to view
        this.map.getView().fit(transformExtent(this.mapdata.bbox, 'EPSG:4326', this.map.getView().getProjection()), {size: [div.clientWidth,div.clientHeight], nearest: true});
      }, 200);

    },
    created() {
      console.log('map created');

      this.initMap();
    },
    methods: {
      async fetchData(url) {
        //return
      },
      initMap: function () {
        var me = this;
        // create a map object, do not bind it to the DOM yet.

        console.log('init map crs: ' + this.mapdata.CRS);
        const view = new View({
          projection: this.mapdata.CRS
        });

        this.map = new Map({
          view: view,
        });
        this.map.available_crs = [this.mapdata.CRS];

        console.log('call getinstance from map.vue');
        // TODO: clean this up.
        this.mapdata=fetch('/static/data.json').then(function (response) {
          if (!response.ok) {
            throw new Error("HTTP error " + response.status);
          }
          return response.json();
        }).then(function(data){
          me.mapdata=data;
          const view = new View({
            projection: me.mapdata.CRS
          });
          view.fit(transformExtent(me.mapdata.bbox, 'EPSG:4326', view.getProjection()), me.map.getSize());
          me.map.setView(view);

          me.setBaseLayer(data.CRS);
          me.addLayers(data);
        });
      },
      reProject: function (crs) {
        console.log('reproject to ' + crs);
        this.removeBaseLayers();
        const extent = transformExtent(this.map.getView(this.map.getSize()).calculateExtent(), this.mapdata.CRS, crs);
        this.mapdata.CRS = crs;
        const view = new View({
          projection: this.mapdata.CRS
        });
        view.fit(extent, {size: this.map.getSize(), nearest: true});

        this.map.setView(view);
        this.setBaseLayer(crs);
      },
      addLayers(mapdata) {
        var me = this;
        for (const service of mapdata.services) {
          layerHelper.getLayersInstance(service, mapdata.CRS, mapdata.order).then(function (serviceData) {
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
