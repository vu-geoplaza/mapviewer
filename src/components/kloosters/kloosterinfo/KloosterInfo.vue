<template>
  <b-modal ref="kloosterinfomodal" size="lg" v-bind:title="title" header-bg-variant="info" header-text-variant="light"
           ok-only>
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
                items: []
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
                this.map.forEachFeatureAtPixel(pixel, function (feature, layer) {
                    const title = layer.get('label'); // is this kloosters
                    if (title == 'kloosters_by_year') {
                        me.showKloosterInfo(feature.get("id"));
                    } else if (title == 'kloosters') {
                        me.showKloosterInfo(feature.get("id")); // not sure, could be more than one?
                    } else if (title == 'kapittels') {
                        me.showKapittelInfo(feature.get("id"));
                    } else if (title == 'uithoven') {
                        me.showUithofInfo(feature.get("id_ur"));
                    }
                });
            },
            addItem(item) {
                this.items.push(item);
                this.$refs['kloosterinfomodal'].show();
            },
            showKapittelInfo(id) {
                const kloosterlijst_baseurl = 'https://www2.fgw.vu.nl/oz/kloosterlijst/';
                let item={
                    photo_url: '',
                    photo_caption: '',
                    kl_url: '',
                    rows: [],
                    title: ''
                };

                let me = this;
                const language = this.$config.klooster.language;
                let params = {
                    id: id,
                    language: language
                };
                axios.post('https://geoplaza.labs.vu.nl/projects/kloosters_dev/resources/getKapittelInfo2.php', params).then(result => {
                    // update

                    item.kl_url = kloosterlijst_baseurl + 'kdetails.php?ID=' + result.data.ID; //?
                    const skip = ['foto', 'TI', 'FO']; // fields left out of the table
                    for (var key in result.data) {
                        if (!skip.includes(key)) {
                            const field = key;
                            if (typeof lang[key] !== "undefined") {
                                const field = lang[key][language];
                            }
                            item.rows.push({key: '<b>' + field + '</b>', value: result.data[key]}); //can't figure out how to format one column
                        }
                        if (language == "en") {
                            item.title = 'Collegiate church';
                        } else {
                            item.title = 'Kapittel';
                        }
                        item.title = item.title + ' ' + id;
                    }
                    //open modal
                    me.addItem(item);

                }, error => {
                    console.error(error);
                });
            },

            showUithofInfo(id) {
                let item={
                    photo_url: '',
                    photo_caption: '',
                    kl_url: '',
                    rows: [],
                    title: ''
                };
                //https://www2.fgw.vu.nl/oz/kloosterlijst/urshow.php?id_ur=317
                const kloosterlijst_baseurl = 'https://www2.fgw.vu.nl/oz/kloosterlijst/';
                let me = this;
                const language = this.$config.klooster.language;
                const skip = ['foto', 'TI', 'FO']; // fields left out of the table
                let params = {
                    id: id,
                    language: language
                };
                axios.post('https://geoplaza.labs.vu.nl/projects/kloosters_dev/resources/getUithofInfo2.php', params).then(result => {
                    // update
                    item.kl_url = kloosterlijst_baseurl + 'urshow.php?id_ur=' + id; //?
                    for (var key in result.data) {
                        if (!skip.includes(key)) {
                            const field = key;
                            if (typeof lang[key] !== "undefined") {
                                const field = lang[key][language];
                            }
                            item.rows.push({key: '<b>' + field + '</b>', value: result.data[key]}); //can't figure out how to format one column
                        }
                        if (language == "en") {
                            item.title = 'Grange';
                        } else {
                            item.title = 'Uithof';
                        }
                        item.title = item.title + ' ' + id;
                    }
                  me.addItem(item)
                }, error => {
                    console.error(error);
                });
            },
            showKloosterInfo(id) {
                let item={
                    photo_url: '',
                    photo_caption: '',
                    kl_url: '',
                    rows: [],
                    title: ''
                };
                const kloosterlijst_baseurl = 'https://www2.fgw.vu.nl/oz/kloosterlijst/';
                let me = this;
                const language = this.$config.klooster.language;
                const skip = ['foto', 'FO']; // fields left out of the table
                let params = {
                    id: id,
                    language: language
                };
                axios.post('https://geoplaza.labs.vu.nl/projects/kloosters_dev/resources/getKloosterInfo2.php', params).then(result => {

                    item.photo_url = kloosterlijst_baseurl + 'foto/' + result.data.ID + '.JPG';
                    item.photo_caption = result.data.FO;
                    item.kl_url = kloosterlijst_baseurl + 'kdetails.php?ID=' + result.data.ID;
                    for (var key in result.data) {
                        if (!skip.includes(key)) {
                            item.rows.push({key: '<b>' + lang[key][language] + '</b>', value: result.data[key]}); //can't figure out how to format one column
                        }
                        if (language == "en") {
                            item.title = 'Monastery';
                        } else {
                            item.title = 'Klooster';
                        }
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
