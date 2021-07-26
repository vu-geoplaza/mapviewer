<template>
  <b-navbar-nav>
  <b-nav-item v-b-modal.infomodal key="infomodal">info</b-nav-item>
  <b-nav-item v-if="admminmode" v-b-modal.servicemodal key="servicemodal">add service</b-nav-item>
  </b-navbar-nav>
</template>

<script>

export default {
  name: "GpzNavLeft",
  components: {
  },
  data() {
    return {
      admminmode: this.$adminmode,
    }
  },
}
</script>

<style scoped>
.nav-item {
  border-left: 1px dotted white;
  border-bottom: none;
}
</style>