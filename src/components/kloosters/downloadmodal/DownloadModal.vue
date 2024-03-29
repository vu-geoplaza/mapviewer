<template>
  <b-modal ref="downloadmodal" id="downloadmodal" ok-only size="lg" v-bind:title="$t('aboutmap')">
    <b-row>
      <b-col md="12">
        <span v-if="$i18n.locale=='nl'">
        <p>De Kloosterkaart toont de kloosters van alle orden die in Nederland gedurende de Middeleeuwen en de Vroegmoderne
        Tijd (tot 1800) vertegenwoordigd zijn geweest. De kaart is een visualisatie van de gegevens die zijn verzameld
        in de Kloosterlijst: Beknopt overzicht van de Nederlandse kloosters tot 1800 (<a
              href="https://geoplaza.vu.nl/projects/kloosterlijst/nl/">link</a>).</p>
        <p><i>Meer informatie op de <a
            href="https://geoplaza.vu.nl/cms/research/kloosterkaart/">Geoplaza website</a></i></p>
        <h5>Download in het Nederlands</h5>
        <ul>
          <li><a v-bind:href="url + 'type=kloosters_by_year&language=nl&year=' + year">Kloosters in {{ year }}</a></li>
          <li><a v-bind:href="url + 'type=kloosters&language=nl'">Alle Kloosterlokaties</a></li>
          <li><a v-bind:href="url + 'type=kapittels&language=nl'">Kapittels</a></li>
          <li><a v-bind:href="url + 'type=uithoven&language=nl'">Uithoven</a></li>
        </ul>
        <p>De bestanden zijn in het <i><a href="https://geojson.org/" target="_blank">GeoJSON</a></i> formaat, geschikt voor gebruik in GIS applicaties.</p>
                  <p><b>Gebruik alstublieft de volgende referentie:<br></b>
          Goudriaan, K. (2021). <i>Kloosterkaart en Kloosterlijst <span class='year'></span></i> [Data set]. Opgehaald op {{ today }}, van {{ current_url }}</p>
        </span>
        <span v-if="$i18n.locale=='en'">
        <p>The Map of Monasteries shows the monasteries of all orders which have been represented in the present-day
          Netherlands during the Middle Ages and Early Modern period (until 1800). The map visualises the data assembled
          for the Census: Monasteries in the Netherlands until 1800 (<a
              href="https://geoplaza.vu.nl/projects/kloosterlijst/en/">link</a>).</p>
        <p><i>More information on the <a
            href="https://geoplaza.vu.nl/cms/research/map-of-monasteries/">Geoplaza website</a></i></p>
        <h5>Download in English</h5>
        <ul>
          <li><a v-bind:href="url + 'type=kloosters_by_year&language=en&year=' + year">Monasteries in {{ year }}</a>
          </li>
          <li><a v-bind:href="url + 'type=kloosters&language=en'">All Monastery locations</a></li>
          <li><a v-bind:href="url + 'type=kapittels&language=en'">Collegiate Churches</a></li>
          <li><a v-bind:href="url + 'type=uithoven&language=en'">Granges and Refuges</a></li>
        </ul>
        <p>All downloads are in <i><a href="https://geojson.org/" target="_blank">GeoJSON</a></i> format, suitable for use in GIS applications.</p>

        <p><b>Please use the following attribution:<br></b>
          Goudriaan, K. (2021). <i>Kloosterkaart en Kloosterlijst <span class='year'></span></i> [Data set]. Retrieved
          on {{ today }}, from {{ current_url }}</p>
          </span>
        <p></p>
        <hr>
        <p>
          <a rel="license" href="https://creativecommons.org/licenses/by-nc/4.0/"><img alt="Creative Commons License"
                                                                                       style="border-width:0"
                                                                                       src="https://i.creativecommons.org/l/by-nc/4.0/88x31.png"></a><br>
          This work is licensed
          under a <a rel="license" href="https://creativecommons.org/licenses/by-nc/4.0/">Creative Commons
          Attribution-NonCommercial 4.0 International License</a>
        </p>
      </b-col>
    </b-row>
  </b-modal>
</template>

<script>
import {SharedEventBus} from "@/shared";

export default {
  name: "DownloadModal",
  data: function () {
    return {
      url: this.$config.klooster.download_url,
      year: this.$config.klooster.year,
      today: new Date().toJSON().slice(0, 10),
      current_url: window.location
    }
  },
  mounted: function () {
    var me = this;
    SharedEventBus.$on('kloostersource-loaded', () => {
      me.year = this.$config.klooster.year;
      me.$forceUpdate(); // todo: should be posible without a forceupdate
    });
  },
}
</script>

<style scoped>

</style>

