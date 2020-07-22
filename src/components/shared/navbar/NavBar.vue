<template>
  <b-navbar toggleable="md" type="dark" variant="info">

    <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>

    <b-navbar-brand v-if="brand" :href="href">{{ title }}</b-navbar-brand>

    <b-collapse is-nav id="nav_collapse">
      <ProjectionSwitcher/>
      <BaseLayerSwitcher/>
      <FitExtent/>
      <b-navbar-nav>
        <b-nav-item v-b-modal.infomodal>info</b-nav-item>
      </b-navbar-nav>
      <b-navbar-nav v-if="admminmode">
        <b-nav-item v-b-modal.servicemodal>add service</b-nav-item>
      </b-navbar-nav>
      <b-navbar-nav v-if="admminmode">
        <FileSaver/>
      </b-navbar-nav>
      <b-navbar-nav v-if="title === 'Kloosterkaart'||title === 'Kloosterlocaties'">
        <b-nav-item v-b-modal.kloosterlistmodal>list</b-nav-item>
      </b-navbar-nav>
      <b-navbar-nav v-if="title === 'Kloosterkaart'||title === 'Kloosterlocaties'">
        <b-nav-item v-b-modal.downloadmodal>download</b-nav-item>
      </b-navbar-nav>
      <b-navbar-nav class="ml-auto">
        <LanguageSwitcher v-if="title === 'Kloosterkaart'||title === 'Kloosterlocaties'"/>
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
      this.set_title()
    },
    data() {
      return {
        admminmode: this.$adminmode,
        title: '',
        href: '#',
        brand: false
      }
    },
    methods: {
      set_title() {
        if (typeof this.$config.title !== 'undefined' || this.$config.title == '') {
          this.title = this.$config.title;
          //alert(this.title);
          this.brand = true;
        }
        if (typeof this.$config.url !== 'undefined' || this.$config.url == '') {
          this.href = this.$config.url;
          //alert(this.url);
        }
      }
    }
  }
</script>

<style scoped>

</style>

