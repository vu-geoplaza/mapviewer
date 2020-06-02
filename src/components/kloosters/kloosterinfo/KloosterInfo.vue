<template>
  <div id="kloosterinfo">
    <b-card class="mb-1" no-body v-show='toggle'>
      <b-card-header class="p-1" header-tag="header">
        <a @click='toggle = !toggle' class="fa-pull-left">
          <font-awesome-icon icon="arrow-right"/>
        </a>
        <span class="widget-header-text">Klooster Info</span>
      </b-card-header>
      <b-card-body>
        <b-tabs>
          <b-tab :key="index" :title="item.title" class="scroll" v-for="(item, index) in items">
            <span v-html="item.content"></span>
          </b-tab>
        </b-tabs>
      </b-card-body>
    </b-card>
  </div>

</template>

<script>
    import {Mapable} from '@/mixins/mapable.js'; // makes the OL map object available to the component
    export default {
        name: "KloosterInfo",
        mixins: [Mapable],
        methods: {
            /**
             * This function is executed, after the map is bound (see mixins/Mapable)
             */
            onMapBound() {
                var me = this;
                // bind an onclick for the featureInfo
                this.map.on('singleclick', function (evt) {
                    console.log(evt);
                    me.getFeatureInfo(evt.coordinate, evt.pixel);
                });
            }
        },
    }
</script>

<style scoped>

</style>
