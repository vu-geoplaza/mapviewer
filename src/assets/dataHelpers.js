import {transformExtent} from "ol/proj";

export const dataHelper = {
  /**
   * Translate an OpenLayers map object to a mapdata object
   *
   * @param olmap
   */
  mapToData(olmap){
    const view=olmap.getView();
    const services=[];
    const tmp=[];
    const order=[];
    olmap.getLayers().forEach(function(layer){
      const type=layer.get('type');
      if (type==='wms'||type==='wmts') {
        const lyr={
          id: layer.get('lid'),
          title: layer.get('title'),
          visible: layer.getVisible(),
          opacity: layer.getOpacity(),
        };
        const url=layer.getSource().getUrls()[0];
        if (typeof tmp[url] === 'undefined') {
          tmp[url]=[];
        }
        if (typeof tmp[url][type] === 'undefined') {
          tmp[url][type]=[];
        }
        tmp[url][type].push(lyr);
        order.push(layer.get('lid'));
      }
    });

    for (const url in tmp){
      for (const type in tmp[url]){
        services.push({
          url: url,
          type: type,
          layers: tmp[url][type]
        });
      }
    }
    const mapdata= {
      CRS: view.getProjection().getCode(),
      bbox: transformExtent( view.calculateExtent(), view.getProjection(), 'EPSG:4326'),
      order: order.reverse(),
      services: services
    };
    return mapdata
  }
};
