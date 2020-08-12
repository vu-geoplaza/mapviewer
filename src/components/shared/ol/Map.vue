<template></template>

<script>
  import 'ol/ol.css';
  import Map from 'ol/Map';
  import {
    OSMstandard,
    BRT,
    base4326, CartoLight, Luchtfoto, BingRoad, BingAerial, OpenTopo
  } from "@/helpers/ViewerBaseLayers";
  import {SharedEventBus, ALLOWED_VIEWER_CRS} from '@/shared';
  import {transformExtent} from "ol/proj";
  import View from "ol/View";
  import VectorLayer from "ol/layer/Vector";
  import BaseLayerSwitcher from "../baselayerswitcher/BaseLayerSwitcher";

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
    name: 'OlMap',
    data() {
      return {
        map: Object
      }
    },
    mounted() {
      const me = this;
      // Send the event 'ol-map-mounted' with the OL map as payload
      SharedEventBus.$emit('ol-map-mounted', this.map);

      // Some events triggered by the Vue app:
      SharedEventBus.$on('change-language', function () {
        // we might need to force a label change
        me.clearVectorLayers();
      });
      SharedEventBus.$on('reload-vector-data', function () {
        me.clearVectorLayers();
      });
      SharedEventBus.$on('change-projection', crs => {
        this.$config.setCrs(crs);
        this.reProject(crs);
      });
      SharedEventBus.$on('add-service', options => {
        const service = this.$config.getService({
          type: options.type,
          url: options.url
        });
        let crs = this.map.getView().getProjection().getCode();
        console.log('adding service with ' + crs);
        service.getInstance(crs).then(function (serviceData) {
          for (const layer of serviceData.layers) {
            console.log('add layer ' + layer.title);
            me.calcAvailableCRS(layer.available_crs);
            me.map.addLayer(layer.ol);
          }
        });
      });

      // refreshes the map when the user goes back to an inactive browser tab
      document.addEventListener('visibilitychange', function () {
        if (!document.hidden) {
          //setTimeout( function() { me.map.renderSync();}, 200);
          //renderSync is not enough, force source reload?
          console.log('refresh layers');
          me.map.getLayers().forEach(function (layer) {
            layer.changed();
          });
        }
      });

      // resize the map, so it fits to parent
      console.log('map mounted');
      window.setTimeout(() => {
        var div = document.getElementById('ol-map-container');
        this.map.setTarget(div);
        // fit to view
        this.map.getView().fit(transformExtent(this.$config.bbox, 'EPSG:4326', this.map.getView().getProjection()), {
          size: [div.clientWidth, div.clientHeight],
          nearest: true
        });
      }, 200);
      this.map.on('pointermove', evt => {
        if (!evt.dragging) {
          this.map.getTargetElement().style.cursor = this.map.hasFeatureAtPixel(this.map.getEventPixel(evt.originalEvent)) ? 'pointer' : '';
        }
      });
    },
    created() {
      console.log('map created');

      this.initMap();
    },
    methods: {
      initMap: function () {
        var me = this;
        // create a map object, do not bind it to the DOM yet.
        const config = this.$config;
        console.log('init map crs: ' + config.crs);
        const view = new View({
          projection: config.crs,
          enableRotation: false
        });

        this.map = new Map({
          view: view
        });
        this.map.available_crs = config.available_crs;

        view.fit(transformExtent(config.bbox, 'EPSG:4326', view.getProjection()), this.map.getSize());
        this.map.setView(view);

        this.setBaseLayers(config.available_crs);
        console.log('start adding layers');
        this.addLayers(config);

      },
      reProject: function (crs) {
        console.log('reproject to ' + crs);
        const curview = this.map.getView(this.map.getSize());
        const extent = transformExtent(curview.calculateExtent(), curview.getProjection().getCode(), crs);
        const view = new View({
          projection: crs
        });
        view.fit(extent, {size: this.map.getSize(), nearest: true});
        this.clearVectorLayers();
        this.map.setView(view);
      },
      clearVectorLayers() {
        var layers = this.map.getLayers();
        layers.forEach(function (layer) {
          if (layer instanceof VectorLayer) { // should set a generic vector/tile type
            const source = layer.getSource();
            if (!source.getSource()) {
              source.refresh();
            } else { // Cluster
              source.getSource().refresh();

            }
          }
        });
      },
      addLayers(config) {
        var me = this;
        for (const service of config.services) {
          service.getInstance(config.crs).then(function (serviceData) {
            for (const layer of serviceData.layers) {
              console.log('add layer ' + layer.title);
              me.calcAvailableCRS(layer.available_crs);
              me.map.addLayer(layer.ol);
            }
          });
        }
      },
      calcAvailableCRS(arr_crs) {
        if (this.map.available_crs.length <= 1) {
          this.map.available_crs = ALLOWED_VIEWER_CRS;
        }
        const new_arr = [];
        for (const crs of this.map.available_crs) {
          if ((arr_crs.indexOf(crs) > -1) && (new_arr.indexOf(crs) === -1) && (ALLOWED_VIEWER_CRS.indexOf(crs) > -1)) {
            new_arr.push(crs);
          }
        }
        this.map.available_crs = new_arr;
      },
      setBaseLayers(available_crs) {
        console.log('set base layer');
        console.log(available_crs);
        if (available_crs.includes('EPSG:3857')) {
          this.map.addLayer(OSMstandard());
          this.map.addLayer(CartoLight());
          this.map.addLayer(BingRoad());
          this.map.addLayer(BingAerial());
        }
        if (available_crs.includes('EPSG:28992')) {

          this.map.addLayer(OpenTopo());
          this.map.addLayer(BRT());
          this.map.addLayer(Luchtfoto());
        }
        if (available_crs.includes('EPSG:4326')) {
          this.map.addLayer(base4326());
        }
      },
      removeBaseLayers() {
        const layers = this.map.getLayers();
        var to_remove = [];
        layers.forEach(function (layer) {
          if (layer != undefined) {
            if (layer.get('type') === 'base') {
              to_remove.push(layer);
            }
          }
        });
        for (const layer of to_remove) {
          this.map.removeLayer(layer);
        }
      }
    }
  }
</script>
