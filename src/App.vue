<template>
    <b-container id="app" fluid>
      <NavBar />
      <div id="ol-map-container" ref="gpzmap"><GpzMap /></div>
      <b-row align-v="start">
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
    </b-container>
</template>

<script>
  import LayerSwitcher from './components/layerswitcher/LayerSwitcher'
  import GpzMap from './components/ol/Map'
  import { GpzEventBus } from './main.js'
  import FeatureInfo from "./components/featureinfo/FeatureInfo";
  import NavBar from "@/components/navbar/NavBar";
  import FileLoader from "@/components/file/FileLoader"

  export default {
    mounted() {
      GpzEventBus.$emit('app-mounted');
      console.log('app mounted')
    },
    name: 'App',
    components: {
      NavBar,
      FeatureInfo,
      LayerSwitcher,
      GpzMap,
      FileLoader
    },
  }
</script>


<style>
  @import '../node_modules/bootstrap/dist/css/bootstrap.css';
  @import '../node_modules/bootstrap-vue/dist/bootstrap-vue.css';

  body {
    overflow: hidden;
  }

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }

  .container {
    max-width: 100%;
    padding-right: 0px;
    padding-left: 0px;
  }


  #ol-map-container {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }

  .container-fluid {
    padding-right: 0px;
    padding-left: 0px;
  }
  .rb-col {
    position: absolute;
    right: 0px;
    bottom: 0px;
  }

  .pull-right {
    float: right;
  }

  .layerswitcher {
    background-color: azure;
    z-index: 1000;
    opacity: 0.95;


  }

  .navbar {
    z-index: 999;
    opacity: 0.95;
  }

  .widget-header-text {
    font-weight: bold;
    font-size: 1.2em;
  }

  .ol-zoom {
    left: unset !important;
    right: .5em;
    top: 5em;
  }

  .navbar .nav-link {
    color: white;
  }
</style>

