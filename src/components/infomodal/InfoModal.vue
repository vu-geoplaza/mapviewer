<template>
  <b-modal id="infomodal" size="lg" title="Layers shown on this map">
    <b-row>
      <b-col md="12">
      <ul v-for="service in services" :key="service">
        <li>
          <b>{{service.type}}</b>: {{service.url}}
        </li>
        <ul v-for="layer in service.layers" :key="layer">
          <li>
            {{layer.title}}
          </li>
        </ul>
      </ul>
      </b-col>
    </b-row>
  </b-modal>
</template>

<script>
  export default {
    name: 'LayerSwitcher',
    data: function () {
      return {
        services: this.$config.services,
      }
    },
  }
</script>
<style scoped>
  #infomodal {
    width: 80%;
  }
  li {
    text-align: left;
    word-wrap: break-word;
  }
</style>
