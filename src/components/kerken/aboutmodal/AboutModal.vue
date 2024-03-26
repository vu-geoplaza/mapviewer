<template>
  <b-modal ref="aboutmodal" id="aboutmodal" ok-only size="lg" v-bind:title="$t('aboutmap')">
    <b-row>
      <b-col md="12">
        <span v-if="$i18n.locale=='nl'">
            <p>Kerkendatabase samengesteld door <a target="_blank" href="https://www.hermanwesselink.nl/index.php?page=onderzoek-kerkgebouwen-1800-1970">Herman
              Wesselink</a></p>

            <p>Heeft u vragen, opmerkingen of aanvullende informatie? Stuur dan een <a href="mailto:hermanwesselink78@gmail.com?cc=geoplaza.ub@vu.nl&amp;subject=kerkenkaart">email</a>.</p>

            <p><i>Laatste update: {{ updated }}</i></p>
          </span>
        <span v-if="$i18n.locale=='en'">
            <p>Database of dutch churches created and managed by <a target="_blank" href="https://www.hermanwesselink.nl/index.php?page=onderzoek-kerkgebouwen-1800-1970">Herman
              Wesselink</a></p>

            <p>Questions, remarks or information? Send an <a href="mailto:hermanwesselink78@gmail.com?cc=geoplaza.ub@vu.nl&amp;subject=kerkenkaart">email</a>.</p>

            <p><i>Last updated: {{ updated }}</i></p>
          </span>
      </b-col>
    </b-row>
  </b-modal>
</template>

<script>
export default {
  name: "AboutModal",
  data: function () {
    return {
      updated: '2024-03-20'
    }
  },
  computed: {
  }

}
</script>

<style scoped>

</style>