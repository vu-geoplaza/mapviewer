<template>
    <b-modal id="uploadmodal" title="Upload data file" @ok="handleOk">
      <b-form-file accept="application/json" v-model="file" class="mt-3" plain></b-form-file>
      <div class="mt-3">Selected file: {{file && file.name}}</div>
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
        handleOk(evt) {
          console.log(this.file);
          console.log(this.file.result);
        }
      }
    }
</script>

<style scoped>

</style>

