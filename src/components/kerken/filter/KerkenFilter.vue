<template>
  <!-- one per group -->
  <b-modal ref="filtermodal" id="filtermodal" ok-only size="lg" title="filter" @ok="handleOk">
    <b-row>
      <b-col md="12">
        <KerkenSearch ref="searchForm"></KerkenSearch>
      </b-col>
    </b-row>
    <b-row>
      <b-col md="12">
      <b-list-group flush>
        <b-list-group-item class="px-0" v-for="(group, index) in groups" v-bind:key="group.key">
          <b-card>
            <b-form-group>
              <b-card-header header-tag="header" class="p-2">
                <b-form-checkbox
                    v-model="group.selected"
                    :indeterminate="group.indeterminate"
                    @change="toggleAll(index)"
                >{{ group.name }}
                </b-form-checkbox>
              </b-card-header>
              <b-card-body class="px-3 py-0">
                <b-form-checkbox-group
                    class="m-0"
                    :label="group.name"
                    :id="group.name"
                    v-model="group.item_selected"
                    style="column-count: 2;"
                    :options="group.item_options"
                    :name="group.name"
                    @change="toggleItem(index, group.item_selected)"
                    stacked

                >
                </b-form-checkbox-group>
              </b-card-body>
            </b-form-group>
          </b-card>
        </b-list-group-item>
      </b-list-group>
      </b-col>
    </b-row>
  </b-modal>
</template>

<script>
import {kerkLegend} from "@/helpers/kerken/KerkSymbols";
import {SharedEventBus} from "@/shared";
import KerkenSearch from "./KerkenSearch";
import axios from "axios";
import Vue from "vue";

export default {
  name: "KerkenFilter",
  components: {KerkenSearch},
  data: function () {
    return {
      groups: [{
        key: 0,
        name: '',
        selected: true,
        indeterminate: false,
        item_options: [],
        item_selected: [],
        item_present: [],
      }],
      toggle: true,
      showoverlay: true,
      filterstate: {},
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
        g.item_selected = [];
        g.item_present = [];
        for (const item in kerkLegend[group]) {
          //g.item_options.push({text: item, value: item});
          g.item_options.push(item);
          g.item_selected.push(item);
          g.item_present.push(item);
        }
        this.groups.push(g);
      }
    },
    fetchFilterState(option) {
      if (option !== null) {
        axios.post(this.$config.kerk.filterstate_url, {
          filter: this.$config.kerk.filter,
        }).then((res) => {
          this.filterstate = res.data;
        })
      }
    },
    getKey() {
      // make sure every group can get a new unique key when needed, so DOM is updated.
      this.maxKey++;
      return this.maxKey;
    },
    toggleAll: function (i) {
      this.groups[i].item_selected = this.groups[i].selected ? this.groups[i].item_options.slice() : [];
      this.setGlobal();
      this.$refs.searchForm.filterChanged();
    },
    toggleItem: function (index, item_selected) {
      if (item_selected.length === 0) {
        this.groups[index].indeterminate = false;
        this.groups[index].selected = false;
      } else if (item_selected.length === this.groups[index].item_options.length) {
        this.groups[index].indeterminate = false;
        this.groups[index].selected = true;
      } else {
        this.groups[index].indeterminate = true;
        this.groups[index].selected = false;
      }
      this.groups[index].key = this.getKey();
      this.setGlobal();
      this.$refs.searchForm.filterChanged();
    },
    setGlobal() {
      let filter = {};
      for (var i = 0; i < this.groups.length; i++) {
        if (this.groups[i].item_selected.length !== this.groups[i].item_options.length) {
          filter[this.groups[i].name] = this.groups[i].item_selected;
        }
      }
      this.$config.kerk.filter = filter;
    },
    applyFilter: function () {
      // call map reload
      Vue.prototype.$config.filterchanged = 3; // Need to reload 3 layers
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
