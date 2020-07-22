<template>
  <b-modal ref="downloadmodal" id="downloadmodal" ok-only size="lg" title="Download data">
    <b-row>
      <b-col md="12">
        <p>Nederlands</p>
        <ul>
          <li><a v-bind:href="url + 'type=kloosters_by_year&language=nl&year=' + year">Kloosters in {{ year }}</a></li>
          <li><a v-bind:href="url + 'type=kloosters&language=nl'">Alle Kloosterlokaties</a></li>
          <li><a v-bind:href="url + 'type=kapittels&language=nl'">Kapittels</a></li>
          <li><a v-bind:href="url + 'type=uithoven&language=nl'">Uithoven</a></li>
        </ul>
        <p>English</p>
        <ul>
          <li><a v-bind:href="url + 'type=kloosters_by_year&language=en&year=' + year">Monasteries in {{ year }}</a></li>
          <li><a v-bind:href="url + 'type=kloosters&language=en'">All Monastery locations</a></li>
          <li><a v-bind:href="url + 'type=kapittels&language=en'">Collegiate Churches</a></li>
          <li><a v-bind:href="url + 'type=uithoven&language=en'">Granges and Refuges</a></li>
        </ul>
        <p>All downloads are in GeoJSON format.</p>
        <p><b>Please use the following attribution:<br></b>
          Goudriaan, K. (2017). <i>Kloosterkaart en Kloosterlijst <span class='year'></span></i> [Data set]. Retrieved on {{ today }}, from {{ current_url }}</p>
        <p></p>
        <hr>
        <p>
          <a rel="license" href="https://creativecommons.org/licenses/by-nc/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-nc/4.0/88x31.png"></a><br>
          This work is licensed
          under a <a rel="license" href="https://creativecommons.org/licenses/by-nc/4.0/">Creative Commons
          Attribution-NonCommercial 4.0 International License</a>
        </p>
      </b-col>
    </b-row>
  </b-modal>
</template>

<script>
    export default {
        name: "DownloadModal",
        data: function () {
          return {
            url: 'https://geoplaza.labs.vu.nl/projects/kloosters_dev/resources/downloadGeoJSON.php?',
            year: this.$config.klooster.year_start,
            today: new Date().toJSON().slice(0,10),
            current_url: window.location
          }
      }
    }
</script>

<style scoped>

</style>

