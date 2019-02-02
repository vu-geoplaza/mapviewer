const uuidv4 = require('uuid/v4');

class ViewerLayer {
  id = uuidv4();
  title = '';
  name = '';
  label = '';
  opacity = 0.8;
  visible = false;
  zindex = null;
  // Will be set by capabilities parser:
  extent_lonlat = null;
  legend_img = '';
  available_crs = [];
  options = null;
  ol = null;

  constructor(layerjson) {
    if (layerjson.id) this.id=  layerjson.id;
    if (layerjson.title) this.title = layerjson.title;
    if (layerjson.name) this.name = layerjson.name;
    if (layerjson.label) {
      this.label = layerjson.label;
    } else {
      this.label = this.title;
    }
    if (layerjson.opacity) this.opacity = layerjson.opacity;
    if (layerjson.visible) this.visible = layerjson.visible;
    if (layerjson.zindex) this.zindex = layerjson.zindex;
  };

  /**
   * use to merge a layer from config with the cap layers
   *
   * @param layer
   */
  mergeConfigSettings(layer){
    this.id = layer.id;
    this.opacity = layer.opacity;
    this.visible = layer.visible;
    this.zindex = layer.zindex;
  };
}

export default ViewerLayer;
