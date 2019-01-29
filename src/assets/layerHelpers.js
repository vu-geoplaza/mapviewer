import TileLayer from 'ol/layer/Tile';
import TileWMS from 'ol/source/TileWMS';

export function WMSLayer(service, layer){
  var l = new TileLayer({
    source: new TileWMS({
      url: service.url,
      params: {'LAYERS': layer.name},
      transition: 0
    })
  });
  return l;
}

