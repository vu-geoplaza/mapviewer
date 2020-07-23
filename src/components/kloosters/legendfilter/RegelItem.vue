<template>
  <b-list-group-item class="p-1">
    <b-card-header header-tag="header" class="p-2" v-bind:class="{ dim: !regel.present }">
      <b-btn v-b-toggle="'regelcard' + index" variant="info" class="regelbutton">
        <span v-if="language === 'nl'">{{ regel.nl }}</span>
        <span v-if="language === 'en'">{{ regel.en }}</span>
      </b-btn>
      <input type="checkbox" v-model="regel.selected" :id="'checkbox' + index" @change="regel_selectparent(index, regels)"/>
    </b-card-header>
    <b-collapse visible :id="'regelcard' + index">
      <b-list-group class="row-fluid">
        <slot/>
      </b-list-group>
    </b-collapse>
  </b-list-group-item>
</template>

<script>
  export default {
    name: "RegelItem",
    props: ['regel', 'index', 'language', 'regels', 'regel_selectparent'],
    methods: {
      regel_select: function (index, regels) {
        this.$parent.$options.methods.regel_select(index, regels)
      }
    }
  }
</script>

<style scoped>
  .row-fluid {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
  }

  .dim {
    opacity: 0.5;
  }

  .regelbutton {

    padding: 2px;
    font-size: 0.9em;
    width: -webkit-calc(100% - 20px);
    width: -moz-calc(100% - 20px);
    width: calc(100% - 20px);
  }



</style>
