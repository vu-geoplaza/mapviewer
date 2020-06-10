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
                             @click="selectKlooster(item.id)">
            {{ item.label }}
          </b-list-group-item>
        </b-list-group>
      </b-col>
    </b-row>
  </b-modal>
</template>

<script>
    import {SharedEventBus} from "@/shared";
    import {Mapable} from "@/mixins/mapable";

    export default {
        name: "KloosterList",
        mixins: [Mapable],
        data: function () {
            return {
                title: '',
                subtitle: '',
                items: [],
                language: this.$config.klooster.language // list of klooster names
            }
        },
        mounted: function () {
            console.log('init kloosterlist');
            var me = this;
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
                features.forEach(function (feature) {
                    if (me.$config.klooster.language === 'en') {
                        me.items.push({label: feature.get('TIE'), id: feature.getId()});
                    } else {
                        me.items.push({label: feature.get('TI'), id: feature.getId()});
                    }
                });
                me.items.sort(compare);
            },
            getFeatureById: function (id) {
                return this.map.getLayerByLid('kloosters_by_year').getSource().getFeatureById(id);
            },
            selectKlooster: function (id) {
                // get feature
                const feature = this.getFeatureById(id);
                // Zoom to feature
                this.map.getView().fit(feature.getGeometry(), {
                    maxZoom: 15,
                    padding: [100, 100, 100, 100],
                    duration: 200
                });
                // Highlight feature

                //closemodal
                this.$refs['kloosterlistmodal'].hide();

            }
        }
    }

</script>

<style scoped>

</style>
