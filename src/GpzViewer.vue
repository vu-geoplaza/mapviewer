<template>

  <b-container id="app" fluid>
    <div id="ol-map-container" ref="gpzmap">
      <OlMap/>
    </div>
    <NavBar/>
    <InfoMessage/>
    <b-row class="main-row">
      <b-col md="4" lg="3">
        <LayerSwitcher/>
      </b-col>
    </b-row>

    <b-row align-v="end">
      <b-col class="rb-col p-0" offset-md="6" md="6">
        <FeatureInfo/>
      </b-col>
    </b-row>

    <!--<FileLoader />-->
    <ServiceLoader/>
    <InfoModal/>
  </b-container>
</template>

<script>
    import LayerSwitcher from './components/shared/layerswitcher/LayerSwitcher'
    import OlMap from './components/shared/ol/Map'
    import {SharedEventBus} from './shared'
    import FeatureInfo from "./components/gpz/featureinfo/FeatureInfo";
    import NavBar from "./components/shared/navbar/NavBar";
    import ServiceLoader from "./components/gpz/serviceloader/ServiceLoader";
    import InfoModal from "./components/gpz/infomodal/InfoModal";
    import InfoMessage from "./components/shared/InfoMessage/InfoMessage";

    export default {
        mounted: function () {
            SharedEventBus.$emit('app-mounted');
            console.log('app mounted')
            console.log('app version: ' + process.env.VUE_APP_VERSION);
        },
        name: 'GpzViewer',
        components: {
            InfoModal,
            ServiceLoader,
            NavBar,
            FeatureInfo,
            LayerSwitcher,
            OlMap,
            InfoMessage
        },
    }
</script>
<style>
  @import '../node_modules/bootstrap/dist/css/bootstrap.css';
  @import '../node_modules/bootstrap-vue/dist/bootstrap-vue.css';

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-size: 14px;
    text-align: center;
    color: #2c3e50;
    width: 100%;
    height: 100%;
    overflow: hidden;
    padding-right: 0px;
    padding-left: 0px;
    position: relative;
    top: 0px;
    left: 0px;
  }

  #app .main-row {
    position: relative;
    top: 0;
    height: 0px;
  }

  #app .container {
    max-width: 100%;
  }

  #ol-map-container {
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0px;
    bottom: 0px;
    left: 0px;
    right: 0px;
  }

  #app .rb-col {
    position: absolute;
    right: 0px;
    bottom: 0px;
  }

  #app .pull-right {
    float: right;
  }

  #app .layerswitcher {
    background-color: azure;
    z-index: 1000;
    opacity: 0.95;
  }

  #app .navbar {
    z-index: 999;
    opacity: 0.95;
  }

  #app .widget-header-text {
    font-weight: bold;
    font-size: 1.2em;
  }

  #app .ol-zoom {
    left: unset !important;
    right: .5em;
    top: 5em !important;
  }

  #app .navbar .nav-link {
    color: white;
  }
</style>

