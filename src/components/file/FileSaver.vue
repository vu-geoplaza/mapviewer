<template>
    <navbar-item href="#" @click="savedata()">
      save
    </navbar-item>
</template>

<script>
  import {Mapable} from '@/mixins/mapable.js'; // makes the OL map object available to the component
  import {dataHelper} from "@/assets/dataHelpers";
    export default {
      name: "FileSaver",
      mixins: [Mapable],
      methods: {
          savedata() {
            var mapdata = JSON.stringify(dataHelper.mapToData(this.map), null, 2);
            var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(mapdata);
            var downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute("href", dataStr);
            downloadAnchorNode.setAttribute("download", "gpz_map.json");
            document.body.appendChild(downloadAnchorNode); // required for firefox
            downloadAnchorNode.click();
            downloadAnchorNode.remove();
          }
      }
    }
</script>

<style scoped>

</style>
