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
  };
  async getServiceInstance(crs) {
    var me = this;
    console.log('get service instance');
    var service = await this.getCapabilities().then(function (clayers) {
      if (me.layers.length > 0) {
        me.layers = me.mergeLayers(me.layers, clayers);
      } else {
        me.layers = clayers;
      }
      var i = 0;
      for (const layer of me.layers) {
        console.log(layer);
        layer.setOL(me.url, crs);
        if (layer.ol !== false) {
          me.layers[i].ol = layer.ol;
        } else {
          // unset
          me.layers[i].splice(i, 1);
        }
        i++;
      }
      return me;
    });
    return me;
  };

  async getCapabilities() {
    // gets overwritten in all the subclasses;
    return [];
  };

  setLayers(layers) {
    // gets overwritten in all the subclasses;
  };
  mergeLayers(layers,clayers) {
    const complayers=[];
    const compare = this.compareByTitle(layers, clayers);
    for (const title in compare.t2) {
      const cindex=compare.t2[title];
      const index=compare.t1[title];
      if (index > -1) {
        const lyr=clayers[cindex];
        lyr.id = layers[index].id;
        lyr.label = layers[index].label
        lyr.visible = layers[index].visible;
        lyr.opacity = layers[index].opacity;
        lyr.zindex = layers[index].zindex
        complayers.push(lyr);
      }
    }
    return complayers;
  };
  compareByTitle(arr1, arr2) {
    //hmmm
    let i = 0;
    const t1 = [];
    for (const a1 of arr1) {
      t1[a1.title] = i;
      i++;
    }
    i = 0;
    const t2 = [];
    for (const a2 of arr2) {
      if (a2.title in t1) {
        t2[a2.title] = i;
      }
      i++;
    }
    return {
      t1: t1, // indices of arr1
      t2: t2 // intersection + indices of arr2
    }
  }
}

export default ViewerService;
