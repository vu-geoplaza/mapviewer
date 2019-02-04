import ViewerLayer from './ViewerLayer';

class ViewerService {
  type = '';
  url = '';
  arcCapabilities=null;
  layers = [];

  constructor(config) {
    console.log(config);
    if (config.type) this.type = config.type;
    if (config.url) this.url = config.url;
    if (config.arcCapabilities) this.url = config.arcCapabilities;
    if (config.layers) {
      this.setLayers(config.layers);
    }
    console.log(this);
  }

  async getServiceInstance(crs) {
    var me = this;
    var layer_names = [];
    for (const l of me.layers) {
      layer_names.push(l.title);
    }
    // do I need these return values? but if not how do I await?
    var service = await this.getCapabilities(layer_names).then(function (cservice) {
      var i=0;
      for (const layer of cservice.layers){
        console.log(layer);
        layer.setOL(cservice.url, crs);
        if (layer.ol !== false) {
          cservice.layers[i].ol=layer.ol;
        } else {
          // unset
          cservice.layers[i].splice(i,1);
        }
        i++;
      }
      return cservice;
    });
    return service;
  }

}

export default ViewerService;
