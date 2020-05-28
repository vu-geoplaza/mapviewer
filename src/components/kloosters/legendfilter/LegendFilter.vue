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
          <b-list-group-item v-for="(item, index) in regels" :index="index" :key="index" :item="item" class="p-1" v-bind:class="{ notpresent: regels_np[index] }">
            <b-card-header header-tag="header" class="p-2">
              {{ item }}
            </b-card-header>
            <b-list-group class="row-fluid">
              <b-list-group-item v-for="(item2, index2) in orden[index]" :index="index2" :key="index2" :item="item2"
                                 class="p-1 col-lg-6 col-md-12 col-xs-12 col-sm-12 clearfix"
                                 v-bind:class="{ notpresent: orden_np[index][index2] }">
                <b-img :src="symbols[index][index2]"/>
                {{ item2 }}
              </b-list-group-item>
            </b-list-group>
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
        regels: [],
        regels_np: [],
        regels_en: [],
        orden: [],
        orden_np: [],
        orden_en: [],
        symbols: [],
        toggle: true
      }
    },
    mounted: function () {
      console.log('init legendfilter');
      this.init();
      var me = this;
      SharedEventBus.$on('kloostersource-loaded', (features) => {
        me.present(features);
        this.$forceUpdate();
      });
    },
    methods: {
      present: function (features) {
        let tmp = [];
        features.forEach(function (feature) {
          if (typeof tmp[feature.get('ordenaam')] == 'undefined') {
            tmp.push(feature.get('ordenaam'));
          }
        });
        console.log(tmp);
        let n = 0;
        for (var i = 0; i < this.orden.length; i++) {
          this.orden_np[i] = [];
          this.regels_np[i]=true;
          for (var j = 0; j < this.orden[i].length; j++) {
            if (tmp.includes(this.orden[i][j])) {
              this.regels_np[i]=false;
              this.orden_np[i][j] = false;
            } else {
              this.orden_np[i][j] = true;
            }
          }
        }
        console.log(this.orden_np);
      },
      init: function () {
        let r = 0;
        for (const regel in symbolsCat.data) {
          this.regels[r] = regel;
          this.regels_en[r] = symbolsCat.translation[regel];
          this.regels_np[r]=true;
          let o = 0;
          for (const orde in symbolsCat.data[regel]) {
            if (typeof this.orden[r] == 'undefined') {
              this.orden[r] = [];
              this.orden_np[r] = [];
              this.orden_en[r] = [];
              this.symbols[r] = [];
            }
            this.orden[r][o] = orde;
            this.orden_np[r][o] = true;
            this.orden_en[r][o] = symbolsCat.data[regel][orde].en;
            this.symbols[r][o] = 'https://geoplaza.labs.vu.nl/projects/kloosters_dev/svg/' + symbolsCat.data[regel][orde].symbol + '.svg';
            o = o + 1;
          }
          r = r + 1;
        }
        this.$forceUpdate();
        console.log(this.orden);
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

  .notpresent {
    display: none;
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


</style>
