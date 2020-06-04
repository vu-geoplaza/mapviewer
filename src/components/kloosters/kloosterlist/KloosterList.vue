<template>
  <b-modal id="kloosterlistmodal" size="lg" v-bind:title="title" header-bg-variant="info" header-text-variant="light"
           ok-only>
    <b-row>
      <b-col md="12">
      <b-list-group horizontal="md" flush v-model="items">
        <b-list-group-item v-for="(item, index) in items" v-bind:key="index" href="#" @click="selectKlooster(item.id)">
          {{ item.label }}
        </b-list-group-item>
      </b-list-group>
      </b-col>
    </b-row>
  </b-modal>
</template>

<script>
  import {SharedEventBus} from "@/shared";

  export default {
    name: "KloosterList",
    data: function () {
      return {
        title: 'klooster lijst',
        items: [] // list of klooster names
      }
    },
    mounted: function () {
      console.log('init kloosterlist');
      var me = this;
      SharedEventBus.$on('kloostersource-loaded', () => {
        this.updateList(this.$config.klooster.data.geojson.features);
      });
      SharedEventBus.$on('change-language', () => {
        this.updateList(this.$config.klooster.data.geojson.features);
      });
    },
    methods: {
      updateList: function (features) {
        this.items = [];
        let me = this;
        console.log(features);
        features.forEach(function (feature) {
          if (me.$config.klooster.language === 'en') {
            me.items.push({label: feature.properties.TIE, id: feature.properties.klooser_id});
          } else {
            me.items.push({label: feature.properties.TI, id: feature.properties.klooser_id});
          }
        });
      },
      selectKlooster: function (id) {
        // Zoom to feature
        // Highlight feature
      }
    }
  }

</script>

<style scoped>

</style>
