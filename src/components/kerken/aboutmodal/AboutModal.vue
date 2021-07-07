<template>
  <b-modal ref="aboutmodal" id="aboutmodal" ok-only size="lg" title="About">
    <b-row>
      <b-col md="12">
        <p>Kerkendatabase samengesteld door <a target="_blank" href="https://www.hermanwesselink.nl/index.php?page=onderzoek-kerkgebouwen-1800-1970">Herman
          Wesselink</a></p>

        <p>Heeft u vragen, opmerkingen of aanvullende informatie? Stuur dan een <a href="mailto:hermanwesselink78@gmail.com?cc=geoplaza.ub@vu.nl&amp;subject=kerkenkaart">email</a>.</p>

        <p><i>Laatste update: {{ updated }}</i></p>
      </b-col>
    </b-row>
  </b-modal>
</template>

<script>
export default {
  name: "AboutModal",
  data: function () {
    return {
      updated: '2021-02-22'
    }
  }
}
</script>

<style scoped>

</style>