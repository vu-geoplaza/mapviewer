import ViewerLayer from "./ViewerLayer";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import CircleStyle from "ol/style/Circle";
import Style from "ol/style/Style";

let colorIndex = -1;
const colorArray =
  [ '#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6',
    '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
    '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A',
    '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
    '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC',
    '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
    '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680',
    '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
    '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3',
    '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'];

function defaultStyle(feature) {
  let style = null;
  const type = feature.getGeometry().getType();
  if (type == 'Point') {
    style = new Style({
      image: new CircleStyle({
        fill: new Fill({
          color: 'rgba(255,255,0,0.4)'
        }),
        radius: 5,
        stroke: new Stroke({
          color: '#ff0',
          width: 1
        })
      })
    })
  } else if (type == 'LineString') {
    style = new Style({
      stroke: new Stroke({
        color: '#f00',
        width: 3
      })
    })
  } else {
    if (colorIndex < colorArray.length) {
      colorIndex = colorIndex + 1;
    } else {
      colorIndex = 0;
    }
    // store the color as a value in the feature
    if (feature.get('color') === undefined) {
      feature.set('color', colorArray[colorIndex]);
    }
    style = new Style({
      stroke: new Stroke({
        color: feature.get('color'),
        width: 3
      })
    });
  }
  return style;
}

class ViewerLayerGeoJSON extends ViewerLayer {
  OLLayer(url, crs) {
    return new VectorLayer({
      source: new VectorSource({
        url: url,
        format: new GeoJSON()
      }),
      style: defaultStyle,
      type: 'geojson',
      visible: this.visible,
      opacity: this.opacity,
      zIndex: this.zindex,
      //legend_img: this.legend_img
    });
  }
}

export default ViewerLayerGeoJSON;
