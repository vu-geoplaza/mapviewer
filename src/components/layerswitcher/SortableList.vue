<template>
  <ul class="list">
    <slot />
  </ul>
</template>

<script>
  import { ContainerMixin }  from "vue-slicksort";
  export default {
    mixins: [ContainerMixin]
  }
</script>

<style>
  .list {
    background-color: ivory;
  }
</style>
