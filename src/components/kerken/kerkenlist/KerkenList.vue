<template>
  <b-modal ref="kerkenlistmodal" id="kerkenlistmodal" size="lg" v-bind:title="title" header-bg-variant="info"
           header-text-variant="light"
           ok-only>
    <b-row align-h="center">
      <h5>{{ subtitle }}</h5>
    </b-row>
    <b-row>
      <b-col md="12">
        <b-input-group>
          <b-form-input
              v-model="keyword"
              placeholder="zoek"
              type="text"
          >
          </b-form-input>
        </b-input-group>
        <b-pagination
            v-model="currentPage"
            :total-rows="rows"
            :per-page="perPage"
            aria-controls="list-table"
        ></b-pagination>
        <b-table
            id="list-table"
            :items="filtered_items"
            :fields="fields"
            :per-page="perPage"
            :current-page="currentPage"
            selectable
            @row-clicked="selectKerk"
            small
        ></b-table>
      </b-col>
    </b-row>
  </b-modal>
</template>

<script>
import {SharedEventBus} from "@/shared";
import {Mapable} from "@/mixins/mapable";

export default {
  name: "KerkenList",
  mixins: [Mapable],
  data: function () {
    return {
      fields: [{
        key: 'plaats',
        sortable: 'true'
      },
        {
          key: 'naam',
          sortable: 'true'
        }
      ],
      keyword: '',
      perPage: 10,
      currentPage: 1,
      title: '',
      subtitle: '',
      items: [],
    }
  },
  computed: {
    filtered_items() {
      if (this.keyword) {
        return this.items.filter(item => item.plaats.toLowerCase().includes(this.keyword.toLowerCase()) || item.naam.toLowerCase().includes(this.keyword.toLowerCase()));
      } else {
        return this.items;
      }
    },
    rows() {
      return this.filtered_items.length
    }
  },
  mounted: function () {
    console.log('init kloosterlist');
    SharedEventBus.$on('kerkensource-loaded', () => {
      this.updateList(this.getFeaturesFromMap());
    });
  },
  methods: {
    getFeaturesFromMap: function () {
      return this.map.getLayerByLid('kerken').getSource().getFeatures();
      //return this.map.getLayerByLid('kerken').getSource().getSource().getFeatures();
    },
    setTitle: function () {
      this.title = 'Getoonde kerken';
      this.subtitle = 'Klik om in te zoomen op kerk'
    },
    updateList: function (features) {
      this.setTitle();

      this.items = [];
      let me = this;
      features.forEach(function (feature) {
        //console.log(feature);
        let plaats = feature.get('plaats');
        let naam = feature.get('naam');
        if (naam == null) {
          naam = '';
        }
        if (plaats == null) {
          plaats = '';
        }
        me.items.push({plaats: plaats, naam: naam, id: feature.get('id')});
      });

      this.items = this.items.sort((a, b) => {
        let fa = a.plaats.toLowerCase(), fb = b.plaats.toLowerCase();
        let na = a.naam.toLowerCase(), nb = b.naam.toLowerCase();
        if (fa < fb) {
          return -1
        } else if (fa > fb) {
          return 1
        } else {
          if (na < nb) {
            return -1
          } else if (na > nb) {
            return 1
          }
        }
        return 0
      })
      this.title = this.title + ' (' + me.items.length + ')';
    },
    selectKerk: function (item) {
      const feature = this.map.getLayerByLid('kerken').getSource().getSource().getFeatureById(item.id);
      const geom = feature.getGeometry();
      this.map.getView().fit(geom, {
        maxZoom: 15,
        padding: [100, 100, 100, 100],
        duration: 200,
      });
      SharedEventBus.$emit('kerk-selected', feature);
      this.$refs['kerkenlistmodal'].hide();
    }
  }
}

</script>

<style scoped>

</style>
