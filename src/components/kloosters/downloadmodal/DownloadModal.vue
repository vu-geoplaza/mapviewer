<template>
  <b-modal ref="downloadmodal" id="downloadmodal" size="lg" title="Download data">
    <b-row>
      <b-col md="12">
        <p>Nederlands</p>
        <ul>
          <li><a v-bind:href="url + 'format=json&year=' + year">Kloosters in {{ year }}</a></li>
          <li><a v-bind:href="url_all + 'type=kloosters&language=nl'">Alle Kloosterlokaties</a></li>
          <li><a v-bind:href="url_all + 'type=kapittels&language=nl'">Kapittels</a></li>
          <li><a v-bind:href="url_all + 'type=uithoven&language=nl'">Uithoven</a></li>
        </ul>
        <p>English</p>
        <ul>
          <li><a v-bind:href="url_all + 'type=kloosters&language=en'">All Monastery locations</a></li>
          <li><a v-bind:href="url_all + 'type=kapittels&language=en'">Collegiate Churches</a></li>
          <li><a v-bind:href="url_all + 'type=uithoven&language=en'">Granges and Refuges</a></li>
        </ul>
        <p><b>Attribution:<br></b>
          Goudriaan, K. (2017). <i>Kloosterkaart en Kloosterlijst <span class='year'></span></i> [Data set]. Retrieved on {{ today }}, from {{ current_url }}</p>
      </b-col>
    </b-row>
  </b-modal>
</template>

<script>
    export default {
        name: "DownloadModal",
        data: function () {
          return {
            url_all: 'https://geoplaza.labs.vu.nl/projects/kloosters_dev/resources/download.php?',
            url: 'https://geoplaza.labs.vu.nl/projects/kloosters_dev/resources/downloadGeoJSON.php?',
            year: this.$config.klooster.year_start,
            today: new Date().toJSON().slice(0,10),
            current_url: window.location
          }
        },
        methods: {
        savedata() {
          const data=ViewerDataHelper.olmapToConfigData(this.map);
          data.title = this.$config.title;
          data.url = this.$config.url;
          var config = JSON.stringify(data, null, 2);
          var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(config);
          var downloadAnchorNode = document.createElement('a');
          downloadAnchorNode.setAttribute("href", dataStr);
          downloadAnchorNode.setAttribute("download", "gpz_map.json");
          document.body.appendChild(downloadAnchorNode); // required for firefox
          downloadAnchorNode.click();
          downloadAnchorNode.remove();
        }
      }
    }
</script>

<style scoped>

</style>

