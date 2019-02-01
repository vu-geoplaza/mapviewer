<template>
  <b-navbar toggleable="md" type="dark" variant="info">

    <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>

    <b-navbar-brand href="#">VU Geoplaza</b-navbar-brand>

    <b-collapse is-nav id="nav_collapse">
        <ProjectionSwitcher />|
        <ZoomToExtent />|
      <!--<b-navbar-nav>
        <b-nav-item><b-btn v-b-modal.uploadmodal>upload</b-btn></b-nav-item>
      </b-navbar-nav>-->
      <b-navbar-nav>
        <b-nav-item v-b-modal.servicemodal>add service</b-nav-item>
      </b-navbar-nav>|
      <b-navbar-nav>
        <FileSaver />
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
      components: {ProjectionSwitcher,ZoomToExtent,FileLoader,FileSaver},
    }
</script>

<style scoped>

</style>

