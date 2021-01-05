<template>
  <!-- one per group -->
  <b-modal ref="filtermodal" id="filtermodal" ok-only size="lg" title="filter">
    <b-list-group horizontal="md" flush>
      <b-list-group-item class="p-1" v-for="(group, index) in groups" v-bind:key="index">
        <b-card-header header-tag="header">
          <b-form inline>
          <b-btn v-b-toggle="'groupcard' + index" variant="info" class="groupbutton">
          {{ group.name }}
          </b-btn>
          <b-form-checkbox v-model="group.selected" :indeterminate="group.indeterminate"></b-form-checkbox>
          </b-form>
        </b-card-header>
        <b-collapse visible :id="'groupcard' + index">
          <b-list-group class="row-fluid grouplist">
            <b-list-group-item v-for="(item, index2) in group.items" v-bind:key="index2"
                               class="p-1 col-lg-4 col-md-12 col-xs-12 col-sm-6 clearfix itemblock"
                               v-bind:class="{ dim: !item.present }">
              {{ item.name }}
              <b-form-checkbox v-model="item.selected" inline class="float-right mr-0"></b-form-checkbox>
            </b-list-group-item>
          </b-list-group>
        </b-collapse>
      </b-list-group-item>
    </b-list-group>
  </b-modal>
</template>

<script>
import {kerkLegend} from "@/helpers/kerken/KerkSymbols";
export default {
  name: "KerkenFilter",
  data: function () {
    return {
      groups: [{
        name: '',
        selected: true,
        indeterminate: false,
        items: [{
          name: '',
          present: false, // item present on the map
          selected: true, // item has selected state
        }]
      }],
      toggle: true,
      showoverlay: true
    }
  },
  mounted: function () {
    console.log('init legendfilter');
    this.init();
  },
  watch: {
    selected(newValue, oldValue) {
      // Handle changes in individual flavour checkboxes
      if (newValue.length === 0) {
        this.indeterminate = false
        this.allSelected = false
      } else if (newValue.length === this.flavours.length) {
        this.indeterminate = false
        this.allSelected = true
      } else {
        this.indeterminate = true
        this.allSelected = false
      }
    }
  },
  methods: {
    init: function () {
      this.groups=[];
      for (const group in kerkLegend) {
        let g = {};
        g.name = group;
        g.selected = true;
        g.indeterminate = false;
        g.items = [];
        for (const item in kerkLegend[group]) {
          console.log(item)
          let i = {};
          i.name = item;
          i.present = true;
          i.selected = true;
          g.items.push(i);
        }
        this.groups.push(g);
      }
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