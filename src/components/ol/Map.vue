<template></template>

<script>
  import 'ol/ol.css';
  import {Map, transform} from 'ol';
  import TileLayer from 'ol/layer/Tile';
  import OSM from 'ol/source/OSM';
  import {register} from 'ol/proj/proj4'
  import {
    WMSLayer,
    WMTSLayer,
    getWMSCapabilities,
    getWMTSCapabilities,
    BRT,
    base4326,
    setView
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
          extent: [-285401.92, 22598.08, 595401.9199999999, 903401.9199999999],
          available_crs: [],
          services: []
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
        this.map.setTarget(document.getElementById('ol-map-container'));
        this.map.updateSize();
      }, 200);

    },
    created() {
      console.log('map created');
      this.initMap();
    },
    methods: {
      initMap() {
        // create a map object, do not bind it to the DOM yet.
        console.log('init map crs: ' + this.mapdata.CRS);
        const view=new View({
          projection: this.mapdata.CRS
        });
        view.fit(this.mapdata.extent,{size: [1920,1080], nearest: true});
        this.map = new Map({
          view: view,
        });
        console.log(this.map.getView());
        this.map.available_crs = [this.mapdata.CRS];
        this.addLayers();
        this.wmsLoader('https://geodata.nationaalgeoregister.nl/inspire/sr/ows?');
        this.wmsLoader('https://geodata.nationaalgeoregister.nl/bestandbodemgebruik2015/ows?');
        this.wmtsLoader('https://geodata.nationaalgeoregister.nl/tiles/service/wmts?');

        this.setBaseLayer();
      },
      reProject: function (crs) {
        console.log('reproject to ' + crs);
        this.removeBaseLayers();
        const extent = transformExtent(this.map.getView(this.map.getSize()).calculateExtent(),this.mapdata.CRS,crs);
        this.mapdata.CRS = crs;
        const view=new View({
          projection: this.mapdata.CRS
        });
        view.fit(extent, {size: this.map.getSize(), nearest: true});

        this.map.setView(view);
        this.setBaseLayer();
      },
      wmtsLoader: function (url) {
        var me = this;
        getWMTSCapabilities(url, function (service) {
          me.addLayersFromWMTS(service);
        });
      },
      wmsLoader: function (url) {
        var me = this;
        getWMSCapabilities(url, function (service) {
          me.addLayersFromWMS(service);
        });
      },
      addLayers: function () {
        console.log('add layers');
        for (const service of this.mapdata.services) {
          if (service.type === 'wms') {
            this.addLayersFromWMS(service);

          } else if (service.type === 'wmts') {
            this.addLayersFromWMTS(service);
          }
        }
      },
      addLayersFromWMS(service) {
        for (const layer of service.layers) {
          const l = WMSLayer(service, layer);
          l.setVisible(layer.visible);
          this.calcAvailableCRS(layer.available_crs);
          console.log(l.get('name'));
          this.map.addLayer(l);
        }
      },
      addLayersFromWMTS(service) {
        for (const layer of service.layers) {
          const l = WMTSLayer(service, layer, this.mapdata.CRS);
          l.setVisible(layer.visible);
          this.calcAvailableCRS(layer.available_crs);
          this.map.addLayer(l);
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
      setBaseLayer() {
        if (this.mapdata.CRS==='EPSG:3857') {
          console.log('add OSM base layer');
          this.map.addLayer(new TileLayer({
            source: new OSM(),
            type: 'base'
          }));
        } else if (this.mapdata.CRS==='EPSG:28992') {
          this.map.addLayer(BRT());
        } else if (this.mapdata.CRS==='EPSG:4326') {
          this.map.addLayer(base4326());
        }
      },
      removeBaseLayers() {
        var me=this;
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
