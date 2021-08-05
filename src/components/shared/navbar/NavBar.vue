<template>
  <b-navbar toggleable="md" type="dark" variant="info">
    <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
    <b-navbar-brand v-if="brand" :href="href" target="_blank">{{ title }}</b-navbar-brand>
    <b-collapse is-nav id="nav_collapse">
      <b-navbar-nav>
        <BaseLayerSwitcher/>
        <FitExtent/>
        <KerkenNavLeft v-if="KerkenNav"/>
        <KloosterNavLeft v-if="KloosterNav"/>
        <GpzNavLeft v-if="GpzNav"/>
      </b-navbar-nav>
      <b-navbar-nav class="ml-auto">
        <KloosterNavRight v-if="KloosterNav"/>
        <b-nav-item href="#" @click="switchlanguage()" right>
          {{ button_language }}
        </b-nav-item>
      </b-navbar-nav>
    </b-collapse>
    <b-navbar-nav class="ml-auto controls" v-if="mobile">
      <GeoLocation/>
      <b-nav-item @click="toggle_fullscreen()" right>
        <font-awesome-icon icon="expand"/>
      </b-nav-item>
    </b-navbar-nav>
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
import {api as fullscreen} from 'vue-fullscreen'
import {isMobile} from 'mobile-device-detect';
import {SharedEventBus} from "../../../shared";

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
  computed: {
    button_language() {
      if (this.$i18n.locale == 'nl') {
        return 'en';
      }
      return 'nl';
    }
  },
  mounted() {
    this.set_title();
    this.set_custom();
    if (isMobile) {
      this.mobile = true;
    }
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
      mobile: false,
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
        this.KloosterNav = true;
      } else if (this.$config.title === 'Kerkenkaart') {
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
    },
    switchlanguage() {
      if (this.$i18n.locale === 'nl') {
        this.$i18n.locale = 'en';
      } else {
        this.$i18n.locale = 'nl';
      }
      SharedEventBus.$emit('change-language');
      this.$forceUpdate();
    }
  }
}
</script>

<style>
#nav_collapse .nav-item:not(:first-child) {
  border-left: 1px dotted white;
  border-bottom: none;
}

.show .nav-item {
  border-left: none;
  border-bottom: 1px dotted white;
}

.controls {
  flex-direction: row !important;
  font-size: 1.3rem;
}

.controls .nav-link {
  padding-right: 0.5rem !important;
  padding-left: 0.5rem !important;
}
</style>

