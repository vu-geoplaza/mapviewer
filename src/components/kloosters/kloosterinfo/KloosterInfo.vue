<template>
  <b-modal ref="kloosterinfomodal" size="lg" v-bind:title="title" header-bg-variant="info" header-text-variant="light"
           ok-only>
    <b-overlay
      :show="showoverlay"
      spinner-large
      rounded="sm"
    >
    <b-row>
      <b-col md="12">

        <b-tabs>
          <b-tab :key="index" :title="item.title" class="scroll" v-for="(item, index) in items">
            <b-row align-h="center">
              <b-link v-bind:href="item.kl_url" target="_blank" center>Kloosterlijst Website</b-link>
            </b-row>
            <b-row>
              <b-img v-bind:src="item.photo_url" fluid rounded center alt=" "></b-img>
            </b-row>
            <b-row align-h="center">
              <span><i>{{ item.photo_caption }}</i></span>
            </b-row>
            <b-table thead-class="hidden_header" striped :items="item.rows">
              <template v-slot:cell(key)="data">
                <span v-html="data.value"></span>
              </template>
              <template v-slot:cell(value)="data">
                <span v-html="data.value"></span>
              </template>
            </b-table>
          </b-tab>
        </b-tabs>

      </b-col>
    </b-row>
    </b-overlay>
  </b-modal>
</template>

<script>
    import {lang} from '@/helpers/kloosters/lang.js';
    import {Mapable} from '@/mixins/mapable.js';
    import axios from "axios"; // makes the OL map object available to the component
    export default {
        name: "KloosterInfo",
        mixins: [Mapable],
        data: function () {
            return {
                title: 'Info',
                items: [],
                showoverlay: true
            }
        },
        methods: {
            /**
             * This function is executed, after the map is bound (see mixins/Mapable)
             */
            onMapBound() {
                var me = this;
                // bind an onclick for the featureInfo
                this.map.on('singleclick', function (evt) {
                    me.handleInfoClick(evt.coordinate, evt.pixel);
                });
            },
            handleInfoClick(coordinate, pixel) {
                this.items = [];
                var me = this;
                let n=0;
                this.map.forEachFeatureAtPixel(pixel, function (feature, layer) {
                    if (n<6) { // browser slow if showing many tabs
                        me.showoverlay = true;
                        me.$refs['kloosterinfomodal'].show();
                        me.showInfo(feature.get("id"), feature.get("type"), feature.get('val'));
                    }
                    n++;
                });
            },
            addItem(item) {
                this.items.push(item);
                this.showoverlay=false;
            },
            showInfo(id, type, year) {
                let item = {
                    photo_url: '',
                    photo_caption: '',
                    kl_url: '',
                    rows: [],
                    title: ''
                };
                let me = this;
                const language = this.$config.klooster.language;
                const skip = ['foto', 'FO', 'id', 'photo_url', 'kl_url', 'photo_caption']; // fields left out of the table
                let paramstring = 'id=' + id + '&type=' + type + '&year=' + year + '&language=' + language;
                axios.get(this.$config.klooster.info_url+'?' + paramstring).then(result => {
                    const data=result.data.features[0].properties;
                    item.photo_url = data.photo_url;
                    item.photo_caption = data.photo_caption;
                    item.kl_url = data.kl_url;
                    for (var key in data) {
                        if (!skip.includes(key)) {
                            item.rows.push({key: '<b>' + key + '</b>', value: data[key]});
                        }
                        item.title = data['type'];
                        item.title = item.title + ' ' + id;
                    }
                    me.addItem(item);
                }, error => {
                    console.error(error);
                });
            }
        }
    }

</script>

<style scoped>

</style>
<style>
  .hidden_header {
    display: none;
  }
</style>
