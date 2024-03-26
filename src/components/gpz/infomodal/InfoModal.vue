<template>
  <b-modal id="infomodal" size="lg" v-bind:title="$t('layersshown')">
    <b-row>
      <b-col md="12">
      <ul v-for="service in services" v-bind:key="service.url">
        <li>
          <b>{{service.type}}</b>: {{service.url}}
        </li>
        <ul v-for="layer in service.layers" v-bind:key="layer.title">
          <li>
            {{layer.title}}
          </li>
        </ul>
      </ul>
        <b-button v-if="admminmode" href="#" @click="savedata()">{{ $t('downloadconfig') }}</b-button>
      </b-col>
    </b-row>
  </b-modal>
</template>

<script>
  import {Mapable} from "../../../mixins/mapable";
  import {ViewerDataHelper} from "@/helpers/ViewerDataHelpers";

  export default {
    name: 'LayerSwitcher',
    mixins: [Mapable],
    data: function () {
      return {
        services: this.$config.services,
        admminmode: this.$adminmode,
      }
    },
    methods: {
      savedata: function() {
        const data = ViewerDataHelper.olmapToConfigData(this.map);
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
  #infomodal {
    width: 80%;
  }
  li {
    text-align: left;
    word-wrap: break-word;
  }
</style>
