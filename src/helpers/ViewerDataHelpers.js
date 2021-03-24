import {transformExtent} from "ol/proj";

export function saveState(config, olmap = null) {
  /**
   *
   */
  let bbox=config.bbox;
  if (olmap !== null){
    const view=olmap.getView();
    bbox=transformExtent( view.calculateExtent(), view.getProjection(), 'EPSG:4326');
  }
  let def_config = {
    'crs': config.crs,
    'baselayer': config.baselayer,
    'bbox': bbox,
    'updated': Date.now()
  }
  if (typeof config.klooster !== 'undefined') {
    def_config.year = config.klooster.year;
    def_config.language = config.klooster.language;
    def_config.filter = config.klooster.filter
  }
  localStorage[config.hash] = JSON.stringify(def_config);
}

export const ViewerDataHelper = {
  /**
   * Translate an OpenLayers map object to a ViewerConfig object that can be written to a json file
   *
   * @param olmap
   */
  olmapToConfigData(olmap){
    const view=olmap.getView();
    const services=[];
    const tmp=[];
    olmap.getLayers().forEach(function(layer){
      const type=layer.get('type');
      if (type!=='base'&&type!=='marker') {
        const lyr={
          id: layer.get('lid'),
          title: layer.get('title'),
          label: layer.get('label'),
          visible: layer.getVisible(),
          opacity: layer.getOpacity(),
          zindex: layer.getZIndex()
        };
        let url='';
        if(type==='kml'||type==='gpx') {
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
    const config= {
      crs: view.getProjection().getCode(),
      title: '',
      url: '#',
      bbox: transformExtent( view.calculateExtent(), view.getProjection(), 'EPSG:4326'),
      services: services
    };
    return config
  }
};
