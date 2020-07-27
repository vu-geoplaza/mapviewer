<template>
  <div class="yearfilter fixed-bottom">
    <vue-slider
      v-on:change="changeYear(value)"
      :min="min"
      :max="max"
      :height=15
      :interval="interval"
      :marks="marks"
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
          clickable: true,
          process: false,
          lazy: true //keep lazy to avoid fetching data while dragging
        },
        value: this.$config.klooster.year_start,
        interval: 1,
        min: 700,
        max: 1800,
        marks: [700,800,900,1000,1100,1200,1300,1400,1500,1600,1700,1800],
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
        }
      },
    }
</script>

<style>
  .vue-slider-mark-label {
    font-weight: bolder;
    font-size: 0.8em;
  }
  .vue-slider-mark-step {
    background-color: white;
    opacity: 0.5;
  }
  .vue-slider-rail, .vue-slider-dot-tooltip, .vue-slider-dot-tooltip-inner {
    border-color: #17a2b8;
    background-color: #17a2b8;
  }
</style>
