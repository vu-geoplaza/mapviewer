<template>
  <b-navbar toggleable="md" type="dark" variant="info">
    <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
    <b-navbar-brand v-if="brand" :href="href" target="_blank">{{ title }}</b-navbar-brand>
    <b-collapse is-nav id="nav_collapse">
      <b-navbar-nav>
        <ProjectionSwitcher/>
        <BaseLayerSwitcher/>
        <FitExtent/>
        <b-nav-item v-b-modal.infomodal>info</b-nav-item>
        <b-nav-item v-if="admminmode" v-b-modal.servicemodal>add service</b-nav-item>
        <FileSaver v-if="admminmode" />
        <b-nav-item  v-if="showList" v-b-modal.kloosterlistmodal>view list</b-nav-item>
        <b-nav-item  v-if="showDownload" v-b-modal.downloadmodal>download</b-nav-item>
      </b-navbar-nav>
      <b-navbar-nav class="ml-auto">
        <LanguageSwitcher v-if="showLanguage"/>
        <GeoLocation/>
      </b-navbar-nav>
    </b-collapse>

  </b-navbar>

</template>

<script>
  import ProjectionSwitcher from "@/components/shared/projectionswitcher/ProjectionSwitcher";
  import FitExtent from '../fitextent/FitExtent'
  import FileLoader from '@/components/gpz/file/FileLoader'
  import FileSaver from '@/components/gpz/file/FileSaver'
  import BaseLayerSwitcher from "@/components/shared/baselayerswitcher/BaseLayerSwitcher";
  import InfoModal from "@/components/gpz/infomodal/InfoModal"
  import LanguageSwitcher from "@/components/kloosters/languageswitcher/LanguageSwitcher";
  import KloosterList from "@/components/kloosters/kloosterlist/KloosterList";
  import GeoLocation from "@/components/shared/geolocation/GeoLocation";
  import DownloadModal from "@/components/kloosters/downloadmodal/DownloadModal";

  export default {
    name: "NavBar",
    components: {LanguageSwitcher, BaseLayerSwitcher, ProjectionSwitcher, FitExtent, FileLoader, FileSaver, InfoModal, KloosterList, GeoLocation, DownloadModal},
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
        showList: false,
        showDownload: false,
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
        if (this.$kloosterkaartmode==='all'||this.$kloosterkaartmode==='by_year'){
          this.showDownload=true;
          this.showLanguage=true;
        }
        if (this.$kloosterkaartmode==='by_year') {
          this.showList = true;
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

