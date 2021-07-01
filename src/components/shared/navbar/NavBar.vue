<template>
  <b-navbar toggleable="md" type="dark" variant="info">
    <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
    <b-navbar-brand v-if="brand" :href="href" target="_blank">{{ title }}</b-navbar-brand>
    <b-collapse is-nav id="nav_collapse">
      <b-navbar-nav>
        <BaseLayerSwitcher/>
        <FitExtent/>
        <b-nav-item v-if="showInfo" v-b-modal.infomodal key="infomodal">info</b-nav-item>
        <b-nav-item v-if="showKloosterList" v-b-modal.kloosterlistmodal key="kloosterlistmodal">view list</b-nav-item>
        <b-nav-item v-if="showKloosterDownload" v-b-modal.downloadmodal key="downloadmodal">about</b-nav-item>
        <b-nav-item v-if="showKerkFilter" v-b-modal.filtermodal key="filtermodal">filter</b-nav-item>
        <b-nav-item v-if="showKerkenList" v-b-modal.kerkenlistmodal key="kerkenlistmodal">view list</b-nav-item>
        <b-nav-item v-if="admminmode" v-b-modal.servicemodal key="servicemodal">add service</b-nav-item>
        <FileSaver v-if="admminmode"/>
      </b-navbar-nav>
      <b-navbar-nav class="ml-auto">
        <KloosterModeSwitcher v-if="showKloosterDownload"/>
        <LanguageSwitcher v-if="showLanguage"/>
        <GeoLocation/>
      </b-navbar-nav>
    </b-collapse>

  </b-navbar>

</template>

<script>
  import FitExtent from '../fitextent/FitExtent'
  import FileSaver from '@/components/gpz/file/FileSaver'
  import BaseLayerSwitcher from "@/components/shared/baselayerswitcher/BaseLayerSwitcher";
  import LanguageSwitcher from "@/components/kloosters/languageswitcher/LanguageSwitcher";
  import KloosterModeSwitcher from "@/components/kloosters/kloostermodeswitcher/KloosterModeSwitcher";
  import GeoLocation from "@/components/shared/geolocation/GeoLocation";


  export default {
    name: "NavBar",
    components: {
      LanguageSwitcher,
      KloosterModeSwitcher,
      BaseLayerSwitcher,
      FitExtent,
      FileSaver,
      GeoLocation,
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
        showInfo: true,
        showKloosterList: false,
        showKloosterDownload: false,
        showKerkFilter: false,
        showKerkenList: false,
        showLanguage: false,
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
          //alert(this.url);
        }
      },
      set_custom() {
        if (this.$kloosterkaartmode === 'all' || this.$kloosterkaartmode === 'by_year') {
          this.showKloosterDownload = true;
          this.showLanguage = true;
          this.showInfo = false;
        } else {
          this.showKloosterDownload = false;
          this.showLanguage = false;
          this.showInfo = true;
        }
        if (this.$kloosterkaartmode === 'by_year') {
          this.showKloosterList = true;
        } else {
          this.showKloosterList = false;
        }
        if (this.$config.title==='Kerkenkaart'){
          this.showKerkFilter = true;
          this.showKerkenList = true;
          this.showInfo = false;
        }
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

