<template>
  <b-list-group-item class="p-1">
    <b-card-header header-tag="header" class="p-2" v-bind:class="{ dim: !regel.present }">
      <b-btn v-b-toggle="'regelcard' + index" variant="info" class="regelbutton" v-on:click="regel_select(index)">
        <span v-if="language === 'nl'">{{ regel.nl }}</span>
        <span v-if="language === 'en'">{{ regel.en }}</span>
      </b-btn>
    </b-card-header>
    <b-collapse :id="'regelcard' + index" v-model="regel.selected">
      <b-list-group class="row-fluid">
        <slot />
      </b-list-group>
    </b-collapse>
  </b-list-group-item>
</template>

<script>
  import {SharedEventBus} from "@/shared";
  import OrdeItem from "@/components/kloosters/legendfilter/OrdeItem";
  export default {
    name: "RegelItem",
    props: ['regel', 'index', 'language', 'regels'],
    methods: {
      regel_select: function(index) {
        this.$parent.regel_select(index);
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
    width: 100%;
  }


</style>
