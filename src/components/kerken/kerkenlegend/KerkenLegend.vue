<template>
  <div class="kerkenlegend">
    <a @click='toggle = !toggle' v-show='!toggle' class="open-button">
      <font-awesome-icon icon="layer-group"/>
    </a>
    <b-card v-show='toggle' visible no-body class="p-0">
      <b-card-header header-tag="header" class="p-2">
        <span class="widget-header-text">{{ $t('legend') }}</span>
        <b-button-close @click='toggle = !toggle' class="pull-right">
        </b-button-close>
        <b-form-select v-model="selected_group" v-on:change="showoverlay = true" :options="groups"></b-form-select>
      </b-card-header>
      <b-card-body class="p-0 scroll">
          <b-list-group horizontal="md" flush>
            <b-list-group-item class="p-1" v-for="item in items" v-bind:key="item.text">
              <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                <rect width="20" height="20" :style="'fill: ' + item.color" stroke="black" stroke-width="1"/>
              </svg>
              {{ item.text }}
              <span class="pull-right">{{ item.total }}</span>
            </b-list-group-item>
          </b-list-group>
      </b-card-body>
    </b-card>
  </div>
</template>

<script>
import {kerkLegend} from "@/helpers/kerken/KerkSymbols";
import {SharedEventBus} from "@/shared";

export default {
  name: "KerkenLegend",
  data: function () {
    return {
      groups: ['denominatie'],
      selected_group: 'denominatie',
      items: [],
      toggle: true,
    }
  },
  mounted() {
    this.init();
    SharedEventBus.$on('kerkensource-loaded', () => {
      console.log('update legend totals');
      this.setTotals(this.selected_group, this.$config.kerk.data.geojson.features);
    });
  },
  watch: {
    selected_group() {
      this.setItems(this.selected_group);
      this.$config.kerk.legend_style = this.selected_group;
      SharedEventBus.$emit('reload-vector-data');
    }
  },
  methods: {
    init() {
      this.groups = [];
      this.items = [];
      for (const group in kerkLegend) {
        this.groups.push(group);
      }
      this.selected_group = this.groups[0];
      this.setItems(this.selected_group);
    },
    setItems(group) {
      this.items = [];
      for (const i in kerkLegend[group]) {
        let item = {};
        item.color = kerkLegend[group][i];
        item.text = i;
        item.total = '';
        this.items.push(item);
      }
    },
    setTotals(group, features) {
      let tmp = [];
      features.forEach(function (feature) {
        if (typeof tmp[feature.properties[group]] == 'undefined') {
          tmp[feature.properties[group]] = 1;
        } else {
          tmp[feature.properties[group]]++
        }
      });
      this.items.forEach(function (item) {
        item.total = tmp[item.text];
      });
    }
  }
}
</script>

<style scoped>
.open-button {
  border: 1px solid black;
  font-size: 19px;
  text-align: center;
  position: absolute;
  height: 30px;
  width: 30px;
  top: 30px;
  left: 30px;
  background-color: white;
}
</style>