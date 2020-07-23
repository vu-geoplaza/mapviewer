<template>
  <div class="yearfilter fixed-bottom">
    <vue-slider
      v-on:drag-end="changeYear(value)"
      :min="min"
      :max="max"
      :interval="interval"
      v-model="value"
      v-bind="slideoptions"
      :tooltip-formatter="year_str + ': {value}'"
      >
    </vue-slider>
  </div>
</template>

<script>
    import {SharedEventBus} from '@/shared';
    import VueSlider from "vue-slider-component";
    import 'vue-slider-component/theme/default.css';

    export default {
      components: {
        VueSlider
      },
        name: "YearFilter",
    data() {
      return {
        slideoptions: {
          tooltip: 'always',
          clickable: false,
        },
        value: this.$config.klooster.year_start,
        interval: 1,
        min: 700,
        max: 1800,
        year_str: 'Year',
        language: this.$config.klooster.language
      }
    },
      mounted: function () {
        SharedEventBus.$on('change-language', () => {
          this.language = this.$config.klooster.language;
          if (this.language==='nl'){
            this.year_str='Jaar';
          } else {
            this.year_str='Year';
          }
        });
      },
      methods: {
        changeYear: function(year){
          console.log('change year');
          this.$config.klooster.year_start = year;
          this.$config.klooster.year_end = year;
          SharedEventBus.$emit('reload-vector-data');
        },
      },
      watch: {
        value: function (val) {
          //console.log(val);
        }
      },
    }
</script>

<style scoped>

</style>
