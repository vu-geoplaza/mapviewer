<template>
  <div class="yearfilter fixed-bottom">
    <vue-slider
      v-on:drag-end="changeYear(value)"
      :min="min"
      :max="max"
      :interval="interval"
      v-model="value"
      v-bind="slideoptions">
    </vue-slider>
  </div>
</template>

<script>
    import {SharedEventBus} from '@/shared';
    import vueSlider from "vue-slider-component";

    export default {
      components: {
        vueSlider
      },
        name: "YearFilter",
    data() {
      return {
        slideoptions: {
          tooltip: 'always',
          clickable: false
        },
        value: this.$config.klooster.year_start,
        interval: 1,
        min: 700,
        max: 1800,

      }
    },
      methods: {
        changeYear: function(year){
          console.log('change year');
          this.$config.klooster.year_start = year;
          this.$config.klooster.year_end = year;
          SharedEventBus.$emit('change-vector-data');
        }
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
