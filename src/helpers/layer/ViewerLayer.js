//const uuidv4 = require('uuid/v4');
const { v4: uuidv4 } = require('uuid');

class ViewerLayer {
  /**
   * @type {string}
   */
  id = uuidv4();

  /**
   * @type {string}
   */
  title = '';

  /**
   * @type {string}
   */
  name = '';

  /**
   * @type {string}
   */
  label = '';

  /**
   * @type {number}
   */
  opacity = 0.8;

  /**
   * @type {boolean}
   */
  visible = false;

  /**
   * @type {number}
   */
  zindex = null;

  // Will be set by capabilities parser:

  /**
   * @type {Array}
   */
  extent_lonlat = null;

  /**
   * @type {string}
   */
  legend_img = '';

  /**
   * @type {Array}
   */
  available_crs = [];

  /**
   * WMTS Layer options
   *
   * @type {Object}
   */
  options = null;

  /**
   * @type {OL.layer Object}
   */
  ol = null;

  constructor(config) {
    if (config.id) this.id=  config.id;
    if (config.title) this.title = config.title;
    if (config.name) this.name = config.name;
    if (config.label) {
      this.label = config.label;
    } else {
      this.label = this.title;
    }
    if (config.opacity) this.opacity = config.opacity;
    if (config.visible) this.visible = config.visible;
    if (config.zindex) this.zindex = config.zindex;
    if (config.extent_lonlat) this.extent_lonlat = config.extent_lonlat;
    if (config.available_crs) this.available_crs = config.available_crs;
    if (config.options) this.options = config.options;
    if (config.legend_img) this.legend_img = config.legend_img;
  };
  setOL(url, crs) {
    const ollayer=this.OLLayer(url, crs);
    if (ollayer) {
      this.ol=ollayer;
      this.setCustomOLValues();
      return true;
    } else {
      return false;
    }
  };

  /**
   * Set this.ollayer property
   *
   * @param url @type {string}
   * @param crs @type {string}
   * @returns {boolean, ol.layer Object}
   */
  OLLayer(url, crs){
    return false;
  }

  /**
   *
   * Set the custom values on OL layer
   *
   */
  setCustomOLValues(){
    this.ol.set('lid',this.id);
    this.ol.set('name', this.name);
    this.ol.set('label',this.label);
    this.ol.set('title', this.title);
    this.ol.set('extent_lonlat', this.extent_lonlat);
  }
}

export default ViewerLayer;
