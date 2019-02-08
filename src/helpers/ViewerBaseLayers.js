import TileLayer from 'ol/layer/Tile';
import TileWMS from 'ol/source/TileWMS';
import WMTS from 'ol/source/WMTS.js';
import WMTSTileGrid from 'ol/tilegrid/WMTS';
import Projection from 'ol/proj/Projection';
import {getTopLeft} from 'ol/extent';
import OSM from "ol/source/OSM";
import XYZ from "ol/source/XYZ";
import Attribution from "ol/control/Attribution";

const uuidv4 = require('uuid/v4');

export const BRT_EXTENT = [-285401.92, 22598.08, 595401.9199999999, 903401.9199999999];
export const BRT_RESOLUTIONS = [3440.640, 1720.320, 860.160, 430.080, 215.040, 107.520, 53.760, 26.880, 13.440, 6.720, 3.360, 1.680, 0.840, 0.420, 0.210];


export function OSMstandard() {
  return new TileLayer({
    source: new OSM(),
    type: 'base',
    code: 'osm',
    name: 'OpenStreetMap standard'
  })
}

export function CartoLight() {
  return new TileLayer({
    type: 'base',
    name: 'Carto-light',
    code: 'light',
    visible: false,
    source: new XYZ({
      url: 'http://{1-4}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
      attributions: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>, created by <a href="http://geoplaza.vu.nl/cms">VU Geoplaza</a>'
    })

  })
}

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
    code: 'brt',
    name: 'BRT Achtergrondkaart',
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

export function Luchtfoto() {
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
    visible: false,
    code: 'lucht',
    name: 'Luchtfoto 25cm',
    source: new WMTS({
      attributions: 'Kaartgegevens: &copy; <a href="https://www.kadaster.nl">Kadaster</a>',
      url: 'https://geodata.nationaalgeoregister.nl/luchtfoto/rgb/wmts?',
      layer: 'Actueel_ortho25',
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
    code: 'aho',
    name: 'ahocevar geospatial',
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

