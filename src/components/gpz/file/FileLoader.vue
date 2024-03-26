<template>
    <b-modal id="uploadmodal" v-bind:title="$t('uploaddata')" @ok="handleOk">
      <b-form-file accept="application/json" v-model="file" class="mt-3" plain></b-form-file>
      <div class="mt-3">{{ $t('selectedfile') }}: {{file && file.name}}</div>
    </b-modal>
</template>

<script>
    export default {
      name: "FileLoader",
      data () {
        return {
          file: null
        }
      },
      methods: {
        handleOk() {
          console.log(this.file.result);
        }
      }
    }
</script>

<style scoped>

</style>

