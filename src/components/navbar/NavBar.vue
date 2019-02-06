<template>
  <b-navbar toggleable="md" type="dark" variant="info">

    <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>

    <b-navbar-brand  v-if="admminmode" href="#">VU Geoplaza</b-navbar-brand>

    <b-collapse is-nav id="nav_collapse">
      <ProjectionSwitcher/>
      <ZoomToExtent/>
        <b-navbar-nav v-if="admminmode">
          <b-nav-item v-b-modal.servicemodal>add service</b-nav-item>
        </b-navbar-nav>
        <b-navbar-nav v-if="admminmode">
          <FileSaver/>
        </b-navbar-nav>

    </b-collapse>

  </b-navbar>

</template>

<script>
  import ProjectionSwitcher from "@/components/ProjectionSwitcher/ProjectionSwitcher";
  import ZoomToExtent from './ZoomToExtent'
  import FileLoader from '@/components/file/FileLoader'
  import FileSaver from '@/components/file/FileSaver'

  export default {
    name: "NavBar",
    components: {ProjectionSwitcher, ZoomToExtent, FileLoader, FileSaver},
    data() {
      return {
        admminmode: this.$adminmode
      }
    }
  }
</script>

<style scoped>

</style>

