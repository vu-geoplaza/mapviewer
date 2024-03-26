<template>
  <b-navbar-nav>
    <b-nav-item v-b-modal.filtermodal key="filtermodal">{{ $t('filter') }}</b-nav-item>
    <b-nav-item v-b-modal.kerkenlistmodal key="kerkenlistmodal">{{ $t('list') }}</b-nav-item>
    <b-nav-item v-b-modal.aboutmodal key="aboutmodal">{{ $t('about') }}</b-nav-item>
  </b-navbar-nav>
</template>

<script>
export default {
  name: "KerkenNavLeft"
}
</script>

<style scoped>
.nav-item {
  border-left: 1px dotted white;
  border-bottom: none;
}
</style>