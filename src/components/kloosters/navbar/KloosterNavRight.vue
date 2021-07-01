<template>
  <b-navbar-nav>
    <KloosterModeSwitcher v-if="showSwitcher"/>
    <LanguageSwitcher v-if="showLanguage"/>
  </b-navbar-nav>
</template>

<script>
import LanguageSwitcher from "../languageswitcher/LanguageSwitcher";
import KloosterModeSwitcher from "../kloostermodeswitcher/KloosterModeSwitcher";

export default {
  name: "KloosterNavRight",
  components: {
    LanguageSwitcher,
    KloosterModeSwitcher
  },
  data() {
    return {
      showLanguage: false,
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
        this.showLanguage = true;
      } else {
        this.showSwitcher = false;
        this.showLanguage = false;
      }
    }
  }
}
</script>

<style scoped>

</style>