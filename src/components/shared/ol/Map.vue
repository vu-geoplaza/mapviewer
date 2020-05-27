<template></template>

<script>
  import 'ol/ol.css';
  import Map from 'ol/Map';
  import {
    OSMstandard,
    BRT,
    base4326, CartoLight, Luchtfoto, BingRoad, OpenTopo
  } from "@/helpers/ViewerBaseLayers";
  import {SharedEventBus,ALLOWED_VIEWER_CRS} from '@/shared';
  import {transformExtent} from "ol/proj";
  import View from "ol/View";
  import VectorLayer from "ol/layer/Vector";

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
      // Send the event 'ol-map-mounted' with the OL map as payload
      SharedEventBus.$emit('ol-map-mounted', this.map);
      SharedEventBus.$on('change-projection', crs => {
        this.$config.setCrs(crs);
        this.reProject(crs);
      });
      const me = this;
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
      document.addEventListener('visibilitychange', function(){
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
        console.log('set target');
        var div=document.getElementById('ol-map-container');
        this.map.setTarget(div);
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
        const config=this.$config;
        console.log('init map crs: ' + config.crs);
        const view = new View({
          projection: config.crs
        });

        this.map = new Map({
          view: view,
        });
        this.map.available_crs = [config.crs];

        view.fit(transformExtent(config.bbox, 'EPSG:4326', view.getProjection()), this.map.getSize());
        this.map.setView(view);

        this.setBaseLayer(config.crs);
        console.log('start adding layers');
        this.addLayers(config);

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
        this.clearVectorLayers();
        this.map.setView(view);
        this.setBaseLayer(crs);
      },
      clearVectorLayers() {
        var layers = this.map.getLayers();
        layers.forEach(function (layer) {
          if (layer instanceof VectorLayer) { // should set a generic vector/tile type
            layer.getSource().refresh();
          }
        });
      },
      addLayers(config) {
        var me = this;
        for (const service of config.services) {
          console.log(service);
          service.getInstance(config.crs).then(function (serviceData) {
            for (const layer of serviceData.layers) {
              console.log('add layer '+layer.title);
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
      setBaseLayer(crs) {
        console.log('set base layer');
        if (crs === 'EPSG:3857') {
          this.map.addLayer(OSMstandard());
          this.map.addLayer(CartoLight());
          this.map.addLayer(BingRoad());
          this.map.addLayer(OpenTopo());
        } else if (crs === 'EPSG:28992') {
          this.map.addLayer(BRT());
          this.map.addLayer(Luchtfoto());
        } else if (crs === 'EPSG:4326') {
          this.map.addLayer(base4326());
        }
      },
      removeBaseLayers() {
        const layers=this.map.getLayers();
        var to_remove=[];
        layers.forEach(function (layer) {
          if (layer != undefined) {
            if (layer.get('type') === 'base') {
              to_remove.push(layer);
            }
          }
        });
        for (const layer of to_remove){
          this.map.removeLayer(layer);
        }
      }
    }
  }
</script>
