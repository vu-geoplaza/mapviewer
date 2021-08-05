<template>
  <b-navbar-nav>
    <KloosterModeSwitcher v-if="showSwitcher"/>
  </b-navbar-nav>
</template>

<script>
import KloosterModeSwitcher from "../kloostermodeswitcher/KloosterModeSwitcher";

export default {
  name: "KloosterNavRight",
  components: {
    KloosterModeSwitcher
  },
  data() {
    return {
      showSwitcher: false
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      if (this.$kloosterkaartmode === 'all' || this.$kloosterkaartmode === 'by_year') {
        this.showSwitcher = true;
      } else {
        this.showSwitcher = false;
      }
    }
  }
}
</script>

<style scoped>

</style>