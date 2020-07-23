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
        <b-list-group horizontal="md" flush v-model="regels">
          <RegelItem v-for="(regel, index) in regels" v-bind:index="index" v-bind:key="index" v-bind:regel="regel"
                     v-bind:language="language" v-bind:regels="regels" v-bind:regel_selectparent="regel_select">
            <OrdeItem v-for="(orde_index, index2) in regel.orde_index" v-bind:index="index2"
                      v-bind:key="orde_index" v-bind:orde="orden[orde_index]" v-bind:present="orden[orde_index].present"
                      v-bind:language="language"/>
          </RegelItem>
        </b-list-group>
      </b-card-body>
    </b-card>
    </b-overlay>
  </div>
</template>

<script>
    import {symbolsCat, symbols} from '@/helpers/kloosters/KloosterSymbols'
    import {SharedEventBus} from "@/shared";
    import OrdeItem from "@/components/kloosters/legendfilter/OrdeItem";
    import RegelItem from "@/components/kloosters/legendfilter/RegelItem";

    export default {
        name: "LegendFilter",
        components: {RegelItem, OrdeItem},
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
                changed: true,
                toggle: true,
                showoverlay: true
            }
        },
        mounted: function () {
            console.log('init legendfilter');
            this.init();
            var me = this;
            SharedEventBus.$on('kloostersource-loaded', () => {
                me.present(this.$config.klooster.data.geojson.features);
                me.changed = !me.changed;
                me.$forceUpdate(); // todo: should be posible without a forceupdate
            });
            SharedEventBus.$on('change-language', () => {
                this.language = this.$config.klooster.language;
            });
        },
        watch: {},
        methods: {
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
                this.showoverlay=true;
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
                this.showoverlay=false;
            },
            regel_select: function (index, regels) {
                console.log('in parent regel_select with index: ' + index);
                console.log(this.regels[index]); // why the fuck is this undefined???? 'this' is an 'input' object??
                this.$config.klooster.filter = [];
                for (let i = 0; i < regels.length; i++) {
                    for (let j = 0; j < regels[i].orde_index.length; j++) {
                        let orde_index = regels[i].orde_index[j];
                        if (regels[i].selected) {
                            this.$config.klooster.filter.push(this.orden[orde_index].nl);
                        }
                    }
                }
                this.regels=regels;
                console.log('update filter');
                SharedEventBus.$emit('reload-vector-data');
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
    top: 0px;
    max-height: 80vh;
    overflow-y: auto;
  }


</style>
