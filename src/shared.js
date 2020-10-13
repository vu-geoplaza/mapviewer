import Vue from "vue";
import proj4 from "proj4";
import {register} from "ol/proj/proj4";
import {get as getProjection} from "ol/proj";
import {library} from '@fortawesome/fontawesome-svg-core'
import {faArrowLeft, faArrowRight, faLayerGroup, faDotCircle, faMapMarkerAlt, faWindowClose} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'

library.add(faArrowLeft, faArrowRight, faLayerGroup, faDotCircle, faMapMarkerAlt, faWindowClose);

Vue.component('font-awesome-icon', FontAwesomeIcon);

proj4.defs("EPSG:28992", "+title=Amersfoort / RD New +proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +y_0=463000 +ellps=bessel +units=m +towgs84=565.417,50.3319,465.552,-0.398957,0.343988,-1.8774,4.0725 +no_defs");
register(proj4);
getProjection('EPSG:28992').setExtent([-285401.92, 22598.08, 595401.92, 903401.92]);

import { LayoutPlugin, ModalPlugin, CardPlugin, TablePlugin, NavbarPlugin, ButtonPlugin, ListGroupPlugin, ImagePlugin,
    OverlayPlugin, TabsPlugin, LinkPlugin, SpinnerPlugin, VBModalPlugin, FormInputPlugin, FormSelectPlugin, EmbedPlugin, FormCheckboxPlugin, FormPlugin } from 'bootstrap-vue'
Vue.use(LayoutPlugin);
Vue.use(ModalPlugin);
Vue.use(VBModalPlugin);
Vue.use(CardPlugin);
Vue.use(TablePlugin);
Vue.use(NavbarPlugin);
Vue.use(ButtonPlugin);
Vue.use(ListGroupPlugin);
Vue.use(ImagePlugin);
Vue.use(OverlayPlugin);
Vue.use(TabsPlugin);
Vue.use(LinkPlugin);
Vue.use(SpinnerPlugin);
Vue.use(FormInputPlugin);
Vue.use(FormSelectPlugin);
Vue.use(EmbedPlugin);
Vue.use(FormCheckboxPlugin);
Vue.use(FormPlugin);

export const SharedEventBus = new Vue();
// Projections supported by the Viewer. A projection will only be available if all layers support it.
export const ALLOWED_VIEWER_CRS = ['EPSG:28992', 'EPSG:4326', 'EPSG:3857'];

export function getParam(name) {
    let param = (new RegExp('[?&]' + encodeURIComponent(name) + '=([^&]*)')).exec(location.search);
    if (param)
        return decodeURIComponent(param[1]);
}