<template>
  <div class="legendfilter">
    <a @click='toggle = !toggle' v-show='!toggle' class="open-button">
      <font-awesome-icon icon="layer-group"/>
    </a>
    <b-card v-show='toggle' visible no-body class="p-0">
      <b-card-header header-tag="header" class="p-2">
        <span class="widget-header-text">Legenda</span>
        <a @click='toggle = !toggle' class="pull-right">
          <font-awesome-icon icon="arrow-left"/>
        </a>
      </b-card-header>
      <b-card-body class="p-0 scroll">
        <b-list-group horizontal="md" flush>
          <b-list-group-item v-for="(regel, index) in regels" :index="index" :key="index" :item="regel" class="p-1"
                             v-bind:class="{ dim: !regels[index].present }">
            <b-card-header header-tag="header" class="p-2">
              <b-btn v-b-toggle="'regelcard' + index" variant="info" class="regelbutton" v-on:click="regel_select(index)">{{ regel.nl }}</b-btn>
            </b-card-header>
            <b-collapse :id="'regelcard' + index" v-model="regels[index].selected">
              <b-list-group class="row-fluid">
                <b-list-group-item v-for="(orde_index, index2) in regels[index].orde_index" :index="index2"
                                   :key="index2" :item="orden[orde_index].nl"
                                   class="p-1 col-lg-6 col-md-12 col-xs-12 col-sm-6 clearfix"
                                   :class="{ hide: !orden[orde_index].present }">
                  <b-img :src="orden[orde_index].symbol"/>
                  {{ orden[orde_index].nl }}
                </b-list-group-item>
              </b-list-group>
            </b-collapse>
          </b-list-group-item>
        </b-list-group>
      </b-card-body>
    </b-card>
  </div>
</template>

<script>
    import {symbolsCat, symbols} from '@/helpers/kloosters/KloosterSymbols'
    import {Mapable} from "@/mixins/mapable";
    import {SharedEventBus} from "@/shared";

    export default {
        name: "LegendFilter",
        mixins: [Mapable],
        data: function () {
            return {
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
                toggle: true
            }
        },
        mounted: function () {
            console.log('init legendfilter');
            this.init();
            var me = this;
            SharedEventBus.$on('kloostersource-loaded', () => {
                console.log(this.$config.klooster.data)
                me.present(this.$config.klooster.data.geojson.features);
                this.$forceUpdate();
            });
        },
        watch: {
        },
        methods: {
            regel_select: function(index){
                this.regels[index].selected=!this.regels[index].selected;
                this.$config.klooster.filter=[];
                for (let i = 0; i < this.regels.length; i++) {
                    for (let j = 0; j < this.regels[i].orde_index.length; j++) {
                        let orde_index = this.regels[i].orde_index[j];
                        if (this.regels[i].selected) {
                            this.$config.klooster.filter.push(this.orden[orde_index].nl);
                        }
                    }
                }
                console.log('update filter');
                console.log(this.$config.klooster.filter);
                SharedEventBus.$emit('change-vector-data');
            },
            present: function (features) {
                let tmp = [];
                features.forEach(function (feature) {
                    if (typeof tmp[feature.properties.ordenaam] == 'undefined') {
                        tmp.push(feature.properties.ordenaam);
                    }
                });
                let n = 0;

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
                let regel_index = 0;
                let orde_index = 0;
                for (const regel in symbolsCat.data) {
                    this.regels[regel_index] = {
                        nl: regel,
                        en: symbolsCat.translation[regel],
                        present: true,
                        selected: true,
                        orde_index: []
                    };
                    for (const orde in symbolsCat.data[regel]) {
                        this.regels[regel_index].orde_index.push(orde_index);
                        this.orden[orde_index] = {
                            nl: orde,
                            en: symbolsCat.data[regel][orde].en,
                            present: false,
                            symbol: 'https://geoplaza.labs.vu.nl/projects/kloosters_dev/svg/' + symbolsCat.data[regel][orde].symbol + '.svg',
                            selected: true
                        };
                        orde_index++;
                    }
                    regel_index++;
                }
                this.$forceUpdate();
            }
        }
    }
</script>

<style scoped>
  .row-fluid {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
  }

  .hide {
    display: none;
  }

  .dim {
    opacity: 0.5;
  }

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
    top: 0px;
    max-height: 80vh;
    overflow-y: auto;
  }

  .regelbutton {
    width: 100%;
  }

  .card-header {
  }
</style>
