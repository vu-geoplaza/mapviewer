class ViewerService {

  constructor(config) {
    /**
     * The type of service (e.g. wms, wmts, kml, etc.)
     *
     * @type {string}
     */
    this.type = '';

    /**
     * The URL of the service endpoint or the data file
     *
     * @type {string}
     */
    this.url = '';

    /**
     * The layers this service provides
     *
     * @type {Array}
     */
    this.layers = [];

    if (config.type) this.type = config.type;
    if (config.url) this.url = config.url;
    if (config.layers) {
      this.setLayers(config.layers);
    }
  }

  /**
   * Taking a ViewerService object get all layer properties from the service endpoint/datafile
   *
   * @param crs
   * @returns {Promise<ViewerService>}
   */
  async getInstance(crs) {
    var me = this;
    console.log('get service instance wtih crs: ' + crs);
    await this.getCapabilities().then(function (clayers) {
      if (clayers!=='skip') {
        if (me.layers.length > 0) {
          me.layers = me.mergeLayers(me.layers, clayers);
        } else {
          me.layers = clayers;
        }
      }
      var i = 0;
      for (const layer of me.layers) {
        console.log('set ol with ' + me.url + ' and ' + crs);
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
    console.log(me);
    return me;
  }

  /**
   * Retrieve all layers from the Service Url/data file
   *
   * @returns {Promise<Array>}
   */
  async getCapabilities() {
    // gets overwritten in all the subclasses;
    return [];
  }
  /**
   * Set layer properties from config
   *
   * @param layers
   */
  setLayers() {
    // gets overwritten in all the subclasses;
  }

  /**
   * Merge the layers array retrieved by getCapabilities with the layers array of the config.
   * Overrides the default layer properties with the ones provided in the config.
   *
   * @param layers
   * @param clayers
   * @returns {Array}
   */
  mergeLayers(layers,clayers) {
    const complayers=[];
    const compare = this.compareByTitle(layers, clayers);
    for (const title in compare.t2) {
      const cindex=compare.t2[title];
      const index=compare.t1[title];
      if (index > -1) {
        const lyr=clayers[cindex];
        lyr.id = layers[index].id;
        lyr.label = layers[index].label;
        lyr.visible = layers[index].visible;
        lyr.opacity = layers[index].opacity;
        lyr.zindex = layers[index].zindex;
        complayers.push(lyr);
      }
    }
    return complayers;
  }

  /**
   * Given 2 arrays of Objects with a property 'title' this returns 2 arrays:
   * t1: all titles of arr1 as t1[<title>]=<index of arr1>
   * t2: all titles of arr2 that are also in arr1 as t2[<title>]=<index of arr2>
   *
   * @param arr1 @type {Array}
   * @param arr2 @type {Array}
   * @returns {{t1: Array, t2: Array}}
   */
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
