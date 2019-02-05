import ViewerLayer from '../layer/ViewerLayer';

class ViewerService {
  type = '';
  url = '';
  layers = [];

  constructor(config) {
    console.log(config);
    if (config.type) this.type = config.type;
    if (config.url) this.url = config.url;
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
    console.log('get service instance');
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
  };
  async getCapabilities(layer_names) {
    // get overwritten in all the subclasses;
    return this;
  };
  setLayers(layers) {
    // get overwritten in all the subclasses;
  };
}

export default ViewerService;
