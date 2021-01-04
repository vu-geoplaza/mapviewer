<template>
  <b-container id="app" fluid>
    <OlMap/>
    <NavBar v-show="!nomenu"/>
    <b-row align-h="between">
      <b-col md="4" lg="3" align-self="baseline">
        <!--<LayerSwitcher/>-->
      </b-col>
      <b-col md="4" align-self="baseline">
        <KerkInfo />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
  import OlMap from './components/shared/ol/Map'
  import {SharedEventBus} from './shared'
  import NavBar from "./components/shared/navbar/NavBar";
  import KerkInfo from "./components/kerken/kerkinfo/KerkInfo";
  export default {
    mounted: function () {
      SharedEventBus.$emit('app-mounted');
      console.log('app mounted');
      console.log('app version: ' + process.env.VUE_APP_VERSION);
    },
    name: 'KerkViewer',
    components: {
      KerkInfo,
      NavBar,
      OlMap
    },
    data() {
      return {
        title: this.$config.title,
        nomenu: this.$nomenu
      }
    }
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
  #app .yearfilter {
    bottom: 55px;
    margin: 0px 20px 0px 20px;
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

  #app .legendfilter {
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

