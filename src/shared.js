import Vue from "vue";

export const GpzEventBus = new Vue();
// Projections supported by the Viewer. A projection will only be available if all layers support it.
export const ALLOWED_VIEWER_CRS = ['EPSG:28992', 'EPSG:4326', 'EPSG:3857'];
