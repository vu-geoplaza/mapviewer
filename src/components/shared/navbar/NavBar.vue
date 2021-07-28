<template>
  <b-navbar toggleable="md" type="dark" variant="info">
    <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
    <b-navbar-brand v-if="brand" :href="href" target="_blank">{{ title }}</b-navbar-brand>
    <b-collapse is-nav id="nav_collapse">
      <b-navbar-nav>
        <BaseLayerSwitcher/>
        <FitExtent/>
        <KerkenNavLeft v-if="KerkenNav" />
        <KloosterNavLeft v-if="KloosterNav" />
        <GpzNavLeft v-if="GpzNav" />
      </b-navbar-nav>
      <b-navbar-nav class="ml-auto">
        <KloosterNavRight v-if="KloosterNav" />
        <GeoLocation/>
        <b-nav-item @click="toggle_fullscreen()">fullscreen</b-nav-item>
      </b-navbar-nav>
    </b-collapse>

  </b-navbar>

</template>

<script>
  import FitExtent from '../fitextent/FitExtent'
  import BaseLayerSwitcher from "@/components/shared/baselayerswitcher/BaseLayerSwitcher";
  import GeoLocation from "@/components/shared/geolocation/GeoLocation";
  import KerkenNavLeft from "@/components/kerken/navbar/KerkenNavLeft";
  import KloosterNavLeft from "@/components/kloosters/navbar/KloosterNavLeft";
  import KloosterNavRight from "@/components/kloosters/navbar/KloosterNavRight";
  import GpzNavLeft from "@/components/gpz/navbar/GpzNavLeft";
  import { api as fullscreen } from 'vue-fullscreen'

  export default {
    name: "NavBar",
    components: {
      BaseLayerSwitcher,
      FitExtent,
      GeoLocation,
      KerkenNavLeft,
      KloosterNavLeft,
      KloosterNavRight,
      GpzNavLeft,
    },
    mounted() {
      this.set_title();
      this.set_custom();
    },
    data() {
      return {
        admminmode: this.$adminmode,
        title: '',
        href: '#',
        brand: false,
        KerkenNav: false,
        KloosterNav: false,
        GpzNav: false,
        fullscreen: false,
        teleport: true,
      }
    },
    methods: {
      set_title() {
        if (typeof this.$config.title !== 'undefined' || this.$config.title == '') {
          this.title = this.$config.title;
          this.brand = true;
        }
        if (typeof this.$config.url !== 'undefined' || this.$config.url == '') {
          this.href = this.$config.url;
        }
      },
      set_custom() {
        if (typeof this.$kloosterkaartmode !== 'undefined') {
          this.KloosterNav=true;
        } else if (this.$config.title==='Kerkenkaart'){
          this.KerkenNav = true;
        } else {
          this.GpzNav = true;
        }
      },
      toggle_fullscreen() {
        fullscreen.toggle(this.$el.querySelector('#app'), {
          teleport: this.teleport,
          callback: (isFullscreen) => {
            this.fullscreen = isFullscreen
          },
        })
      }
    }
  }
</script>

<style>
  .nav-item:not(:first-child) {
    border-left: 1px dotted white;
    border-bottom: none;
  }

  .show .nav-item {
    border-left: none;
    border-bottom: 1px dotted white;
  }
</style>

