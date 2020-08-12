<template>

    <b-nav-item href="#" @click="switchlanguage()" right>
      {{language}}
    </b-nav-item>

</template>

<script>
    import {SharedEventBus} from "@/shared";

    export default {
      name: "LanguageSwitcher",
      data: function () {
        return {
          language: this.$config.klooster.language,
        }
      },
      mounted: function () {
        this.language=this.$config.klooster.language;
      },
      methods: {
        switchlanguage() {
          if (this.language==='nl') {
            this.language='en';
          } else {
            this.language='nl';
          }
          this.$config.klooster.language=this.language;
          SharedEventBus.$emit('change-language');
          this.$forceUpdate();
        }
      }
    }
</script>

<style scoped>

</style>
