<template>
  <b-list-group-item
    class="p-1 col-lg-6 col-md-12 col-xs-12 col-sm-6 clearfix"
    v-show="present">
    <b-img :src="orde.symbol"/>
    <span v-if="language === 'nl'">{{ orde.nl }}</span>
    <span v-if="language === 'en'">{{ orde.en }}</span>
  </b-list-group-item>
</template>

<script>
    export default {
        name: "OrdeItem",
        props: ['index', 'language', 'orde', 'present'],
    }
</script>

<style scoped>
  .hide {
    display: none;
  }

</style>
