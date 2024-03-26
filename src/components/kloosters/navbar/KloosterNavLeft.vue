<template>
  <b-navbar-nav>
    <b-nav-item v-if="showKloosterList" v-b-modal.kloosterlistmodal key="kloosterlistmodal">{{ $t('list') }}</b-nav-item>
    <b-nav-item v-b-modal.downloadmodal key="downloadmodal">{{ $t('about') }}</b-nav-item>
  </b-navbar-nav>
</template>

<script>
export default {
  name: "KloosterNavLeft",
  data() {
    return {
      showKloosterList: false,
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      if (this.$kloosterkaartmode === 'by_year') {
        this.showKloosterList = true;
      }
    }
  }
}
</script>

<style scoped>
.nav-item {
  border-left: 1px dotted white;
  border-bottom: none;
}
</style>