import TileLayer from 'ol/layer/Tile';
import TileWMS from 'ol/source/TileWMS';
import WMSCapabilities from 'ol/format/WMSCapabilities.js';
import WMTSCapabilities from 'ol/format/WMTSCapabilities.js';
import WMTS from 'ol/source/WMTS.js';
import WMTSTileGrid from 'ol/tilegrid/WMTS';
import Projection from 'ol/proj/Projection';
import {getTopLeft} from 'ol/extent';
import {fromLonLat} from "ol/proj";
import {optionsFromCapabilities} from 'ol/source/WMTS';

const uuidv4 = require('uuid/v4');

export const BRT_EXTENT = [-285401.92, 22598.08, 595401.9199999999, 903401.9199999999];
export const BRT_RESOLUTIONS = [3440.640, 1720.320, 860.160, 430.080, 215.040, 107.520, 53.760, 26.880, 13.440, 6.720, 3.360, 1.680, 0.840, 0.420, 0.210];

const VIEWER_CRS = ['EPSG:28992', 'EPSG:4326', 'EPSG:3857'];

export function BRT() {
// Geldigheidsgebied van het tiling schema in RD-coördinaten:
  var projectionExtent = BRT_EXTENT;
  var projection = new Projection({code: 'EPSG:28992', units: 'm', extent: projectionExtent});
// Resoluties (pixels per meter) van de zoomniveaus:
  var resolutions = BRT_RESOLUTIONS;
  //var size = ol.extent.getWidth(projectionExtent) / 256;
// Er zijn 15 (0 tot 14) zoomniveaus beschikbaar van de WMTS-service voor de BRT-Achtergrondkaart:
  var matrixIds = new Array(15);
  for (var z = 0; z < 15; ++z) {
    matrixIds[z] = 'EPSG:28992:' + z;
  }
  return new TileLayer({
    type: 'base',
    opacity: 1.0,
    zIndex: 1,
    source: new WMTS({
      attributions: 'Kaartgegevens: &copy; <a href="https://www.kadaster.nl">Kadaster</a>',
      url: 'https://geodata.nationaalgeoregister.nl/tiles/service/wmts?',
      layer: 'brtachtergrondkaart',
      matrixSet: 'EPSG:28992',
      format: 'image/png',
      projection: projection,
      tileGrid: new WMTSTileGrid({
        origin: getTopLeft(projectionExtent),
        resolutions: resolutions,
        matrixIds: matrixIds
      }),
      style: 'default',
      wrapX: false
    })
  })
}

export function base4326() {
  return new TileLayer({
    zIndex: 1,
    type: 'base',
    source: new TileWMS({
      url: 'https://ahocevar.com/geoserver/wms',
      crossOrigin: '',
      params: {
        'LAYERS': 'ne:NE1_HR_LC_SR_W_DR',
        'TILED': true
      },
      projection: 'EPSG:4326'
    })
  })
}

export const layerHelper = {
  /**
   * return an array of ol layer instances part of this service
   *
   * @param serviceData
   */
  getLayersInstance: async function (serviceData, crs, order) {
    var me = this;
    serviceData.layers = (typeof serviceData.layers === 'undefined') ? [] : serviceData.layers;
    if (serviceData.type === 'wms') {
      var service = await this.getWMSCapabilities(serviceData.url).then(function (cap_service) {
        return me.merge(serviceData, cap_service, crs, order);
      });
      return service;
    } else if (serviceData.type === 'wmts') {
      var service = await this.getWMTSCapabilities(serviceData.url).then(function (cap_service) {
        return me.merge(serviceData, cap_service, crs, order);
      });
      return service;
    }
  },
  merge(serviceData, cap_service, crs, order) {
    const service = serviceData;
    console.log('after get capabilities');
    if (serviceData.layers.length === 0) {
      console.log('no specific layers asked, adding all');
      var layers = [];
      console.log(cap_service);
      for (const layer of cap_service.layers) {
        layer.opacity = 0.8;
        layer.visible = false;
        layer.id = uuidv4();
        if (service.type === 'wms') {
          layer.ol = this.WMSLayer(cap_service, layer);
        } else if (service.type === 'wmts') {
          layer.ol = this.WMTSLayer(cap_service, layer, crs);
        }
        if (layer.ol!==false) {
          layers.push(layer);
        }
      }
      service.layers = layers;
    } else {
      var layer_names = [];
      for (const l of serviceData.layers) {
        layer_names.push(l.title);
      }
      service.ol_layers = [];
      for (const layer of cap_service.layers) {
        const index = layer_names.indexOf(layer.title);
        if (index > -1) {
          // should have better merge, but ok for just 2 attributes
          console.log(serviceData);
          layer.id = serviceData.layers[index].id;
          layer.opacity = serviceData.layers[index].opacity;
          layer.visible = serviceData.layers[index].visible;
          layer.zIndex = 100-order.indexOf(layer.id);
          console.log(order);
          console.log(layer.id);
          console.log('***** add with zindex ' + layer.zIndex)
          if (service.type === 'wms') {
            layer.ol = this.WMSLayer(cap_service, layer);
          } else if (service.type === 'wmts') {
            layer.ol = this.WMTSLayer(cap_service, layer, crs);
          }
          service.layers[index] = layer;
        }
      }
    }
    console.log('returning updated service 1');
    return service
  },
  getWMSCapabilities: async function (input_url) {
    const url = input_url.substring(0, input_url.indexOf('?'));
    const service = {
      type: 'wms',
      url: url + '?',
      layers: []
    };
    const parser = new WMSCapabilities();
    console.log('start get capabilities');
    return fetch(url + '?request=GetCapabilities&service=WMS').then(function (response) {
      return response.text();
    }).then(function (text) {
      const result = parser.read(text);
      for (const layer of result.Capability.Layer.Layer) {
        service.layers.push({
          name: layer.Name,
          extent_lonlat: layer.EX_GeographicBoundingBox,
          title: layer.Title,
          legend_img: `${url}?service=WMS&request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=${layer.Name}&version=1.3.0&SLD_VERSION=1.1.0`,
          available_crs: layer.CRS
        });
      }
      console.log('return get capabilities');
      return service;
    });
  },
  getWMTSCapabilities: async function (input_url) {
    const url = input_url.substring(0, input_url.indexOf('?'));
    const service = {
      type: 'wmts',
      url: url + '?',
      layers: []
    };
    const parser = new WMTSCapabilities();
    return fetch(url + '?request=GetCapabilities&service=WMTS').then(function (response) {
      return response.text();
    }).then(function (text) {
      const result = parser.read(text);
      for (const layer of result.Contents.Layer) {
        //console.log(layer);
        const crs = [];
        const options = {};
        // see: https://openlayers.org/en/latest/examples/wmts-layer-from-capabilities.html
        var ok=true;
        for (const link of layer.TileMatrixSetLink) {
          crs.push(link.TileMatrixSet);
          // this will only work for known projections
          if (VIEWER_CRS.indexOf(link.TileMatrixSet) > -1) {
            const o = optionsFromCapabilities(result, {
              layer: layer.Title,
              matrixSet: link.TileMatrixSet
            });
            options[link.TileMatrixSet] = o;
          }
        }
          service.layers.push({
            name: layer.Name,
            title: layer.Title,
            extent_lonlat: layer.WGS84BoundingBox,
            opacity: 0.8,
            visible: false,
            legend_img: `${url}?service=WMTS&request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=${layer.Name}&version=1.3.0&SLD_VERSION=1.1.0`,
            available_crs: crs,
            options: options

        });

        console.log('return get capabilities');
      }
      return service;
    });
  },
  WMSLayer(service, layer) {
    console.log(layer.visible);
    return new TileLayer({
      source: new TileWMS({
        url: service.url,
        params: {'LAYERS': layer.name},
        transition: 0,

      }),
      lid: layer.id,
      name: layer.name,
      title: layer.title,
      extent_lonlat: layer.extent_lonlat,
      type: 'wms',
      legend_img: layer.legend_img,
      visible: layer.visible,
      opacity: layer.opacity,
      zIndex: layer.zIndex
    });
  },
  WMTSLayer(service, layer, crs) {
    if (typeof layer.options[crs] === 'undefined') {
      console.log(layer.title + ' is not available at this CRS');
      return false;
    } else {
      return new TileLayer({
        source: new WMTS(layer.options[crs]),
        lid: layer.id,
        name: layer.name,
        title: layer.title,
        extent_lonlat: layer.extent_lonlat,
        type: 'wmts',
        legend_img: layer.legend_img,
        visible: layer.visible,
        zIndex: layer.zIndex
      });
    }
  }
};

