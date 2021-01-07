<template>
  <div>
    <b-form-select v-model="selected_option" :options="search_options"></b-form-select>
    <vue-bootstrap-typeahead
        v-model="query"
        :data="search_items"
        :placeholder="'Zoek op ' + selected_option"
        @hit="itemSelected"
        ref="typeahead"
    />
    <b-button variant="success" v-for="(item, index) in selected_items" v-bind:key="item.name + index" @click="itemDeselected(item)">{{ item.option }}: {{ item.name }}</b-button>
  </div>
</template>

<script>
import VueBootstrapTypeahead from 'vue-bootstrap-typeahead';
import axios from "axios";

export default {
  name: "KerkenSearch",
  components: {
    VueBootstrapTypeahead
  },
  data() {
    return {
      query: '',
      selected_option: 'architect',
      search_options: ['architect', 'plaats', 'gemeente', 'provincie', 'naam'],
      search_items: [],
      selected_items: []
    }
  },
  mounted: function () {
    console.log('init kerkensearch');
    this.init();
  },
  watch: {
    selected_option() { //
      this.fetchTypeAheadList(this.selected_option);
    }
  },
  methods: {
    init() {
      console.log(this.selected_items);
      this.filterToSelections();
      this.filterChanged();
    },
    filterChanged() {
      this.search_items = [];
      this.fetchTypeAheadList(this.selected_option);
    },
    fetchTypeAheadList(option) {
      if (option !== null) {
        axios.post(this.$config.kerk.typeahead_url, {
          filter: this.$config.kerk.filter,
          list: option
        }).then((res) => {
          console.log(res.data);
          this.search_items = res.data;
        })
      }
    },
    itemSelected(item) {
      this.addSelectedItem(this.selected_option, item);
      this.selectionsToFilter();
      this.$refs.typeahead.inputValue = "";
    },
    itemDeselected(selected_item){
      this.removeSelectedItem(selected_item);
      this.selectionsToFilter();
    },
    addSelectedItem(option, item){
      this.selected_items.push({option: option, name: item});
      this.sokey++;
    },
    removeSelectedItem(item) {
      let si = [];
      for (var i = 0; i < this.selected_items.length; i++) {
        if (this.selected_items[i].name!==item.name){
          si.push(this.selected_items[i]);
        }
      }
      this.selected_items = si;
    },
    selectionsToFilter(){
      let f={};
      for (const o in this.$config.kerk.filter){
        delete this.$config.kerk.filter[o];
      }
      for (let i = 0; i < this.selected_items.length; i++) {
        if (this.selected_items[i].option in f) {
          f[this.selected_items[i].option].push(this.selected_items[i].name)
        } else {
          f[this.selected_items[i].option] = [this.selected_items[i].name]
        }
      }
      for (const o in f){
        this.$config.kerk.filter[o]=f[o];
      }
    },
    filterToSelections(){
      this.selected_items=[];
      for (const o in this.$config.kerk.filter) {
        if (this.search_options.includes(o)) {
          for (let i = 0; i < this.$config.kerk.filter[o].length; i++) {
            this.addSelectedItem(o, this.$config.kerk.filter[o][i]);
          }
        }
      }
    }
  }
}
</script>

<style scoped>

</style>