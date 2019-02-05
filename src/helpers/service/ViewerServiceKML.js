import ViewerService from "./ViewerService";
import ViewerLayerKML from "../layer/ViewerLayerKML";

// static/kloosters_1200.kml
class ViewerServiceKML extends ViewerService {
  async getCapabilities(layer_names) {
    const VIEWER_CRS = ['EPSG:28992', 'EPSG:4326', 'EPSG:3857'];
    var me=this;
    return fetch(me.url).then(function (response) {
      return response.text();
    }).then(function (text) {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(text,"text/xml");
      console.log(xmlDoc);
      const name = xmlDoc.getElementsByTagName("name")[0].childNodes[0].nodeValue;
      if (layer_names.length===0){
        me.layers.push(new ViewerLayerKML({
          name: name,
          extent_lonlat: null,
          title: name,
          legend_img: '',
          available_crs: VIEWER_CRS,
        }));
      } else {
        me.layers[0].name = name;
        me.layers[0].extent_lonlat = null;
        me.layers[0].title = name;
        me.layers[0].legend_img = '';
        me.layers[0].available_crs = VIEWER_CRS;        
      }

      // maybe try to construct a legend here? or calculate the extent

      return me;
    });
  };
  setLayers(layers) {
    this.layers = [];
    for (const l of layers) {
      this.layers.push(new ViewerLayerKML(l));
    }
  };
}

export default ViewerServiceKML;
