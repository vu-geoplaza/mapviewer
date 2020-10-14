<template>
  <div class="legendfilter">
    <b-overlay
        :show="showoverlay"
        spinner-large
        rounded="sm"
    >
      <a @click='toggle = !toggle' v-show='!toggle' class="open-button">
        <font-awesome-icon icon="layer-group"/>
      </a>
      <b-card v-show='toggle' visible no-body class="p-0">
        <b-card-header header-tag="header" class="p-2">
          <span class="widget-header-text" v-if="language==='nl'">Legenda</span>
          <span class="widget-header-text" v-if="language==='en'">Legend</span>
          <b-button-close @click='toggle = !toggle' class="pull-right">
          </b-button-close>
        </b-card-header>
        <b-card-body class="p-0 scroll">
          <b-list-group horizontal="md" flush>
            <b-list-group-item class="p-1" v-for="(regel, index) in regels" v-bind:key="index">
              <b-card-header header-tag="header" class="p-2" v-bind:class="{ dim: !regel.present }">
                <b-form inline>
                  <b-btn v-b-toggle="'regelcard' + index" variant="info" class="regelbutton">
                    <span v-if="language === 'nl'">{{ regel.nl }}</span>
                    <span v-if="language === 'en'">{{ regel.en }}</span>
                  </b-btn>
                  <b-form-checkbox v-model="regel.selected" @change="regel_select()"></b-form-checkbox>
                </b-form>&nbsp;

              </b-card-header>
              <b-collapse visible :id="'regelcard' + index">
                <b-list-group class="row-fluid">
                  <b-list-group-item v-for="(orde_index, index2) in regel.orde_index" v-bind:key="index2"
                                     class="p-1 col-lg-6 col-md-12 col-xs-12 col-sm-6 clearfix ordeblock"
                                     v-show="present"
                                     v-bind:class="{ dim: !orden[orde_index].present }">
                    <b-img :src="orden[orde_index].symbol"/>
                    <span v-if="language === 'nl'">{{ orden[orde_index].nl }}</span>
                    <span v-if="language === 'en'">{{ orden[orde_index].en }}</span>
                    <b-form-checkbox v-model="orden[orde_index].selected" @change="orde_select()" inline class="float-right mr-0"></b-form-checkbox>
                  </b-list-group-item>
                </b-list-group>
              </b-collapse>
            </b-list-group-item>
          </b-list-group>
        </b-card-body>
      </b-card>
    </b-overlay>
  </div>
</template>

<script>
import {symbolsCat} from '@/helpers/kloosters/KloosterSymbols'
import {SharedEventBus} from "@/shared";

export default {
  name: "LegendFilter",
  data: function () {
    return {
      language: this.$config.klooster.language,
      regels: [{
        nl: '',
        en: '',
        orde_index: [],
        present: false,
        selected: true
      }],
      orden: [{
        nl: '',
        en: '',
        symbol: '',
        present: false,
        selected: true
      }],
      toggle: true,
      showoverlay: true
    }
  },
  mounted: function () {
    console.log('init legendfilter');
    this.init();
    var me = this;

    SharedEventBus.$on('kloostersource-loaded', () => {
      console.log('update legend');
      me.present(me.$config.klooster.data.geojson.features);
    });
    SharedEventBus.$on('change-language', () => {
      this.language = this.$config.klooster.language;
    });
  },
  methods: {
    present: function (features) {
      console.log('set present');
      let tmp = [];
      features.forEach(function (feature) {
        if (typeof tmp[feature.properties.ordenaam] == 'undefined') {
          tmp.push(feature.properties.ordenaam);
        }
      });
      for (let i = 0; i < this.orden.length; i++) {
        if (tmp.includes(this.orden[i].nl)) {
          this.orden[i].present = true;
        } else {
          this.orden[i].present = false;
        }
      }
      for (let i = 0; i < this.regels.length; i++) {
        this.regels[i].present = false;
        for (let j = 0; j < this.regels[i].orde_index.length; j++) {
          let orde_index = this.regels[i].orde_index[j];
          if (this.orden[orde_index].present) {
            this.regels[i].present = true;
            break;
          }
        }
      }
    },
    init: function () {
      console.log(this.$config.klooster.filter);
      this.showoverlay = true;
      let regel_index = 0;
      let orde_index = 0;
      for (const regel in symbolsCat.data) {
        this.regels.splice(regel_index, 1, {
          nl: regel,
          en: symbolsCat.translation[regel],
          present: true,
          selected: true,
          orde_index: []
        });
        for (const orde in symbolsCat.data[regel]) {
          this.regels[regel_index].orde_index.push(orde_index); //might not be detected by Vue
          this.orden.splice(orde_index, 1, {
            nl: orde,
            en: symbolsCat.data[regel][orde].en,
            present: false,
            symbol: 'https://geoplaza.vu.nl/projects/kloosters_vue/svg/' + symbolsCat.data[regel][orde].symbol + '.svg',
            selected: true
          });
          orde_index++;
        }
        regel_index++;
      }
      this.showoverlay = false;
    },
    regel_select: function () {
      this.$nextTick(() => { // wait for b-form-checkbox to update
        this.$config.klooster.filter = [];
        for (let i = 0; i < this.regels.length; i++) {
          for (let j = 0; j < this.regels[i].orde_index.length; j++) {
            let orde_index = this.regels[i].orde_index[j];
            if (this.regels[i].selected) {
              if (this.orden[orde_index].selected) {
                this.$config.klooster.filter.push(this.orden[orde_index].nl);
              }
            }
          }
        }

        console.log('update filter');
        SharedEventBus.$emit('reload-vector-data');
      });
    },
    orde_select: function () {
      var me=this;
      this.$nextTick(() => { // wait for b-form-checkbox to update
        me.$config.klooster.filter = [];
        for (let i = 0; i < me.regels.length; i++) {
          for (let j = 0; j < me.regels[i].orde_index.length; j++) {
            let orde_index = me.regels[i].orde_index[j];
            if (this.orden[orde_index].selected) {
              this.$config.klooster.filter.push(me.orden[orde_index].nl);
            }
          }
        }
        console.log('update filter');
        SharedEventBus.$emit('reload-vector-data');
      });
    }
  }
}
</script>

<style scoped>


ul {
  list-style-type: none;
  padding: 0;
}

li {
  list-style-type: none;
}

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

.scroll {
  top: 0;
  max-height: 80vh;
  overflow-y: auto;
}

.row-fluid {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
}

.regelbutton {
  padding: 2px;
  margin-right: 2px;
  font-size: 0.9em;
  width: -webkit-calc(100% - 27px);
  width: -moz-calc(100% - 27px);
  width: calc(100% - 27px);
}

.ordeblock {
  font-size: 0.85em;
}

.dim {
  opacity: 0.4;
}

.hidden {
  display: none;
}

</style>
