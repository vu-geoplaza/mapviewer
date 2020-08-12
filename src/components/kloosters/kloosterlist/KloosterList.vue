<template>
  <b-modal ref="kloosterlistmodal" id="kloosterlistmodal" size="lg" v-bind:title="title" header-bg-variant="info" header-text-variant="light"
           ok-only>
    <b-row align-h="center">
      <h5>{{ subtitle }}</h5>
    </b-row>
    <b-row>
      <b-col md="12">
        <b-list-group horizontal="md" flush v-model="items">
          <b-list-group-item v-for="(item, index) in items" v-bind:key="index" href="#"
                             @click="selectKlooster(item.geom)">
            <b-img :src="item.image"/>&nbsp;{{ item.label }}
          </b-list-group-item>
        </b-list-group>
      </b-col>
    </b-row>
  </b-modal>
</template>

<script>
    import {SharedEventBus} from "@/shared";
    import {Mapable} from "@/mixins/mapable";
    import {symbols} from "@/helpers/kloosters/KloosterSymbols";

    export default {
        name: "KloosterList",
        mixins: [Mapable],
        data: function () {
            return {
                title: '',
                subtitle: '',
                items: [],
                language: this.$config.klooster.language, // list of klooster names
            }
        },
        mounted: function () {
            console.log('init kloosterlist');
            SharedEventBus.$on('kloostersource-loaded', () => {
                this.updateList(this.getFeaturesFromMap());
            });
            SharedEventBus.$on('change-language', () => {
                this.updateList(this.getFeaturesFromMap());
            });
        },
        methods: {
            getFeaturesFromMap: function () {
                return this.map.getLayerByLid('kloosters_by_year').getSource().getFeatures();
            },
            setTitle: function() {
                if (this.language==='nl') {
                    this.title = 'Getoonde kloosters';
                    this.subtitle = 'Klik om in te zoomen op klooster'

                }  else {
                    this.title = 'Monasteries shown';
                    this.subtitle = 'Click to zoom in on monastery';
                }
            },
            updateList: function (features) {
                function compare( a, b ) {
                    if ( a.label < b.label ){
                        return -1;
                    }
                    if ( a.label > b.label ){
                        return 1;
                    }
                    return 0;
                }

                this.setTitle();

                this.items = [];
                let me = this;
                features.forEach(function (cluster) {
                    cluster.get('features').forEach(function(feature){
                      const orde=feature.get('ordenaam');
                      let symbol = 'square_white';
                      if ((typeof symbols[orde] !== 'undefined')) {
                        symbol = symbols[orde];
                      }
                      const image='https://geoplaza.vu.nl/projects/kloosters_vue/svg/' + symbol + '.svg'
                      if (me.$config.klooster.language === 'en') {
                        me.items.push({label: feature.get('name_en'), geom: feature.getGeometry(), image: image});
                      } else {
                        me.items.push({label: feature.get('name_nl'), geom: feature.getGeometry(), image: image});
                      }
                    });
                });
                this.title=this.title + ' (' +  me.items.length + ')';
                me.items.sort(compare);
            },
            selectKlooster: function (geom) {
                this.map.getView().fit(geom, {
                    maxZoom: 15,
                    padding: [100, 100, 100, 100],
                    duration: 200
                });
                this.$refs['kloosterlistmodal'].hide();

            }
        }
    }

</script>

<style scoped>

</style>
