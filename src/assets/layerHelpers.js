import TileLayer from 'ol/layer/Tile';
import TileWMS from 'ol/source/TileWMS';
import WMSCapabilities from 'ol/format/WMSCapabilities.js';
import WMTSCapabilities from 'ol/format/WMTSCapabilities.js';
import WMTS from 'ol/source/WMTS.js';
const uuidv4 = require('uuid/v4');

export function WMSLayer(service, layer){
  var l = new TileLayer({
    source: new TileWMS({
      url: service.url,
      params: {'LAYERS': layer.name},
      transition: 0,
      lid: layer.id,
      name: layer.name,
      title: layer.title,
      type: 'wms',
      legend_img: layer.legend_img,
      visible: layer.visible
    })
  });
  return l;
}
export function WMTSLayer(service, layer){
  var l = new TileLayer({
    source: new WMTS({
      url: service.url,
      params: {
        'layer': layer.title,
        matrixSet: 'EPSG:3857'
      },
      transition: 0,
      lid: layer.id,
      name: layer.name,
      title: layer.title,
      type: 'wmts',
      legend_img: layer.legend_img,
      visible: layer.visible
    })
  });
  return l;
}

export function getWMSCapabilities(input_url, callback){
  const url = input_url.substring(0, input_url.indexOf('?'));
  const service={
    type: 'wms',
    url: url + '?',
    layers: []
  }
  const parser = new WMSCapabilities();
  fetch(url + '?request=GetCapabilities&service=WMS').then(function(response) {
    return response.text();
  }).then(function(text) {
    const result = parser.read(text);
    for (const layer of result.Capability.Layer.Layer) {
      //console.log(layer);
      service.layers.push({
        id: uuidv4(),
        name: layer.Name,
        title: layer.Title,
        opacity: 0.8,
        visible: false,
        legend_img: `${url}?service=WMS&request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=${layer.Name}&version=1.3.0&SLD_VERSION=1.1.0`
      });
    }
    callback(service);
  });
}

export function getWMTSCapabilities(input_url, callback){
  const url = input_url.substring(0, input_url.indexOf('?'));
  const service={
    type: 'wmts',
    url: url + '?',
    layers: []
  }
  const parser = new WMTSCapabilities();
  fetch(url + '?request=GetCapabilities&service=WMTS').then(function(response) {
    return response.text();
  }).then(function(text) {
    const result = parser.read(text);
    console.log(result)
    for (const layer of result.Contents.Layer) {
      console.log(layer);
      service.layers.push({
        id: uuidv4(),
        name: layer.Name,
        title: layer.Title,
        opacity: 0.8,
        visible: false,
        legend_img: `${url}?service=WMTS&request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=${layer.Name}&version=1.3.0&SLD_VERSION=1.1.0`
      });
    }
    callback(service);
  });
}
