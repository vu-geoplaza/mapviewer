<template>
    <b-nav-item href="#" @click="savedata()">
      save
    </b-nav-item>
</template>

<script>
  import {Mapable} from '@/mixins/mapable.js'; // makes the OL map object available to the component
  import {ViewerDataHelper} from "@/helpers/ViewerDataHelpers";
    export default {
      name: "FileSaver",
      mixins: [Mapable],
      methods: {
          savedata() {
            //alert( encodeURIComponent( btoa( JSON.stringify(ViewerDataHelper.olmapToConfigData(this.map))) ) );
            const data=ViewerDataHelper.olmapToConfigData(this.map);
            data.title = this.$config.title;
            data.url = this.$config.url;
            var config = JSON.stringify(data, null, 2);
            var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(config);
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
