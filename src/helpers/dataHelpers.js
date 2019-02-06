import {transformExtent} from "ol/proj";

export const dataHelper = {
  /**
   * Translate an OpenLayers map object to a mapdata object
   *
   * @param olmap
   */
  olmapToConfigData(olmap){
    const view=olmap.getView();
    const services=[];
    const tmp=[];
    olmap.getLayers().forEach(function(layer){
      const type=layer.get('type');
      if (type!=='base') {
        const lyr={
          id: layer.get('lid'),
          title: layer.get('title'),
          label: layer.get('label'),
          visible: layer.getVisible(),
          opacity: layer.getOpacity(),
          zindex: layer.getZIndex()
        };
        let url='';
        if(type==='kml') {
          url=layer.getSource().getUrl();
        } else {
          url=layer.getSource().getUrls()[0];
        }
        if (typeof tmp[url] === 'undefined') {
          tmp[url]=[];
        }
        if (typeof tmp[url][type] === 'undefined') {
          tmp[url][type]=[];
        }
        tmp[url][type].push(lyr);

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
      crs: view.getProjection().getCode(),
      bbox: transformExtent( view.calculateExtent(), view.getProjection(), 'EPSG:4326'),
      services: services
    };
    return mapdata
  }
};
