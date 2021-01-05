<template>
  <!-- one per group -->
  <b-modal ref="filtermodal" id="filtermodal" ok-only size="lg" title="filter" @ok="handleOk">
    <b-list-group horizontal="md" flush>
      <b-list-group-item class="p-1" v-for="(group, index) in groups" v-bind:key="group.key">
        <b-form-group>
          {{ group.name }}
          <b-form-checkbox
              v-model="group.selected"
              :indeterminate="group.indeterminate"
              @change="toggleAll(index)"
          >
          </b-form-checkbox>
          <b-form-checkbox-group :label="group.name"
            :id="group.name"
            v-model="group.item_selected"
            :options="group.item_options"
            :name="group.name"
            @change="toggleItem(index, group.item_selected)"
          >
          </b-form-checkbox-group>
        </b-form-group>
      </b-list-group-item>
    </b-list-group>
  </b-modal>
</template>

<script>
import {kerkLegend} from "@/helpers/kerken/KerkSymbols";
import {SharedEventBus} from "@/shared";

export default {
  name: "KerkenFilter",
  data: function () {
    return {
      groups: [{
        key: 0,
        name: '',
        selected: true,
        indeterminate: false,
        item_options: [],
        item_selected: []
      }],
      toggle: true,
      showoverlay: true,
      maxKey: 0,
    }
  },
  mounted: function () {
    console.log('init legendfilter');
    this.init();
  },
  methods: {
    handleOk() {
      this.applyFilter();
    },
    init: function () {
      this.groups = [];
      for (const group in kerkLegend) {
        let g = {};
        g.name = group;
        g.key = this.getKey();
        g.selected = true;
        g.indeterminate = false;
        g.item_options = [];
        g.item_selected= [];
        for (const item in kerkLegend[group]) {
          //g.item_options.push({text: item, value: item});
          g.item_options.push(item);
          g.item_selected.push(item);
        }
        console.log(g);
        this.groups.push(g);
      }
    },
    getKey() {
      this.maxKey++;
      return this.maxKey;
    },
    toggleAll: function(i) {
      //let checked =true
      console.log(this.groups[i].name);
      console.log(this.groups[i].selected);
      this.groups[i].item_selected = this.groups[i].selected? this.groups[i].item_options.slice() : []
    },
    toggleItem: function (index, item_selected){
      console.log(item_selected.length, this.groups[index].item_options.length, this.groups[index].key);
      if (item_selected.length===0){
        this.groups[index].indeterminate = false;
        this.groups[index].selected = false;
      } else if (item_selected.length === this.groups[index].item_options.length){
        this.groups[index].indeterminate = false;
        this.groups[index].selected = true;
      } else {
        this.groups[index].indeterminate = true;
        this.groups[index].selected = false;
      }
      this.groups[index].key = this.getKey();
    },
    applyFilter: function (){
      let filter={};
      for (var i = 0; i < this.groups.length; i++) {
        console.log(this.groups[i].name);
        if (this.groups[i].item_selected.length!==this.groups[i].item_options.length){
          filter[this.groups[i].name]=this.groups[i].item_selected;
        }
      }
      console.log(filter);
      this.$config.kerk.filter=filter;
      // call map reload
      console.log(this.$config.kerk.filter);
      SharedEventBus.$emit('reload-vector-data');
    }
  }
}
</script>

<style scoped>
.itemblock {
  font-size: 0.85em;
}

.row-fluid {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
}

.groupbutton {
  padding: 2px;
  margin-right: 2px;
  font-size: 0.9em;
  width: -webkit-calc(100% - 31px);
  width: -moz-calc(100% - 31px);
  width: calc(100% - 31px);

}

.card-header {
  padding: 3px;
}

.grouplist {
  padding: 0px 3px 0px 3px;
}
</style>
