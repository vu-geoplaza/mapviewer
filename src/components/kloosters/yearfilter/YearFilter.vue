<template>
  <div>
    <div class="yearbox fixed-top mx-auto bg-info">
      <b-form-input
          class
          v-model="textvalue"
          @input="validateYear(textvalue)"
          @blur="resetBox"
          type="text"
          :number=true
      >
      </b-form-input>
    </div>
    <div class="yearfilter fixed-bottom">
      <vue-slider
          v-on:change="changeYear(slidervalue)"
          :min="min"
          :max="max"
          :height=15
          :interval="interval"
          :marks="marks"
          v-model="slidervalue"
          v-bind="slideoptions"
          :tooltip-formatter="year_str + ': {value}'"
      >
      </vue-slider>
    </div>
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
      textvalue: this.$config.klooster.year,
      slideoptions: {
        tooltip: 'always',
        clickable: true,
        process: false,
        lazy: true //keep lazy to avoid fetching data while dragging
      },
      slidervalue: this.$config.klooster.year,
      interval: 1,
      min: 700,
      max: 1800,
      marks: [700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800],
      year_str: 'Jaar',
      language: this.$i18n.locale
    }
  },
  mounted: function () {
    SharedEventBus.$on('change-language', () => {
      if (this.$i18n.locale === 'nl') {
        this.year_str = 'Jaar';
      } else {
        this.year_str = 'Year';
      }
    });
  },
  methods: {
    changeYear: function (year) {
      console.log('change year');
      this.textvalue=year;
      this.$config.klooster.year = year;
      SharedEventBus.$emit('reload-vector-data');
    },
    validateYear: function (year) {
      console.log('validate year');
      if (year > this.min && year < this.max) {
        this.slidervalue=year;
      }
    },
    resetBox: function () {
      this.textvalue=this.slidervalue;
    }
  }
}
</script>

<style>
.yearbox {
  width: 60px;
  top: 8px !important;
  margin: 0px 20px 0px 20px;
}

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
