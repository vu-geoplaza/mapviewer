<template>
  <b-modal ref="kloosterinfomodal" size="lg" v-bind:title="title" header-bg-variant="info" header-text-variant="light" ok-only>
    <b-row  align-h="center">
      <b-link v-bind:href="kl_url" target="_blank" center>Kloosterlijst Website</b-link>
    </b-row>
    <b-row>
      <b-img v-bind:src="photo_url" fluid rounded center alt=" "></b-img>
    </b-row>
    <b-row align-h="center">
      <b-col>{{ photo_caption }}</b-col>
    </b-row>
    <b-row>
      <b-col md="12">
        <b-table thead-class="hidden_header" striped :items="items">
          <template v-slot:cell(key)="data">
            <span v-html="data.value"></span>
          </template>
          <template v-slot:cell(value)="data">
            <span v-html="data.value"></span>
          </template>
        </b-table>
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
        photo_url: '',
        photo_caption: '',
        kl_url: '',
        title: 'klooster info',
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
      handleInfoClick(coordinate, pixel){
        var me=this;
        this.map.forEachFeatureAtPixel(pixel, function (feature, layer) {
          const title = layer.get('label'); // is this kloosters
          if (title=='kloosters'){
            me.showKloosterInfo(feature.get('klooster_id'));
          }
        });
      },
      showKloosterInfo(id){
        const kloosterlijst_baseurl = 'https://www2.fgw.vu.nl/oz/kloosterlijst/';
        let me=this;
        const language=this.$config.klooster.language;
        const skip=['foto','TI','FO']; // fields left out of the table
        let params={
          id: id,
          language: language
        };
        axios.post('https://geoplaza.labs.vu.nl/projects/kloosters_dev/resources/getKloosterInfo2.php', params).then(result => {
          // update
          this.items=[];
          this.photo_url=kloosterlijst_baseurl + 'foto/' + result.data.ID + '.JPG';
          this.photo_caption=result.data.FO;
          this.kl_url=kloosterlijst_baseurl + 'kdetails.php?ID=' + result.data.ID;
          for (var key in result.data){
            if (!skip.includes(key)){
              this.items.push({key: '<b>' + lang[key][language] + '</b>', value: result.data[key]}); //can't figure out how to format one column
            }
            this.title=result.data.TI;
          }
          //open modal
          this.$refs['kloosterinfomodal'].show();
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
