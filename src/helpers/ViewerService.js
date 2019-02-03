import ViewerLayer from './ViewerLayer';

class ViewerService {
  type = '';
  url = '';
  layers = [];

  constructor(servicejson) {
    console.log(servicejson);
    if (servicejson.type) this.type = servicejson.type;
    if (servicejson.url) this.url = servicejson.url;
    if (servicejson.layers) {
      this.setLayers(servicejson.layers);
    }
    console.log(this);
  }

  async getServiceInstance(crs) {
    var me = this;
    var layer_names = [];
    for (const l of me.layers) {
      layer_names.push(l.title);
    }
    var service = await this.getCapabilities(layer_names).then(function (cservice) {
      // this is confused
      var i=0;
      for (const layer of cservice.layers){
        console.log(layer);
        const ol = layer.OLLayer(cservice.url, crs);
        if (layer.ol !== false) {
          cservice.layers[i].ol=ol;
        }
        i++;
      }
      return cservice;
    });
    return service;
  }

}

export default ViewerService;
