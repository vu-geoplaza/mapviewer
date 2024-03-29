<template>
    <div id="feature-info">
        <b-card no-body v-show='toggle'>
            <b-card-header class="p-2" header-tag="header">
                <button type="button" class="close" aria-label="Close" @click='toggle = !toggle'>
                    <span aria-hidden="true">&times;</span>
                </button>
                <span class="widget-header-text">{{ $t('monasteryinfo') }}</span>
            </b-card-header>
            <b-card-body class="pl-2 pr-0">
                <b-overlay :show="showoverlay" spinner-large rounded="sm">
                    <b-tabs>
                        <b-tab lazy :key="index" :title="item.title" class="scroll"
                               v-for="(item, index) in items" @click="addMarker(item.feature)">
                            <b-row align-h="center">
                                <b-col>
                                    <b-link v-bind:href="item.kl_url" target="_blank" center>{{ t[2] }}</b-link>
                                    <b-img v-bind:src="item.photo_url" fluid rounded center alt=" "
                                           @error="handleImageError(index)"></b-img>
                                    <span><i>{{ item.photo_caption }}</i></span>
                                </b-col>
                            </b-row>
                            <b-table thead-class="hidden_header" striped :items="item.rows">
                                <template v-slot:cell(key)="data">
                                    <span v-html="data.value"></span>
                                </template>
                                <template v-slot:cell(value)="data">
                                    <span v-html="data.value"></span>
                                </template>
                            </b-table>
                            <b-row v-if="item.type=='klooster'">
                                <b-col>
                                <b>{{ t[0] }}</b>
                                <b-embed
                                        type="iframe"
                                        v-bind:src="item.map_url"
                                ></b-embed>
                                </b-col>
                            </b-row>
                        </b-tab>
                    </b-tabs>
                </b-overlay>
            </b-card-body>
        </b-card>
    </div>
</template>

<script>
    import {lang} from '@/helpers/kloosters/lang.js';
    import {Mapable} from '@/mixins/mapable.js';
    import axios from "axios";
    import {SharedEventBus} from "@/shared";
    export default {
        name: "KloosterInfo",
        mixins: [Mapable],
        data: function () {
            return {
                toggle: false,
                title: 'Info',
                items: [],
                t: [],
                showoverlay: true,
            }
        },
        methods: {
            /**
             * This function is executed, after the map is bound (see mixins/Mapable)
             */
            onMapBound() {
                var me = this;
                // bind an onclick for the featureInfo
                this.map.on('singleclick', function (evt) {
                    me.handleInfoClick(evt.coordinate, evt.pixel);
                });
                SharedEventBus.$on('klooster-selected', feature => {
                    me.toggle = true;
                    this.items = [];
                    me.addMarker(feature);
                    me.showInfo(feature);
                })
            },
            handleInfoClick(coordinate, pixel) {
                this.clearMarkers();
                this.toggle = false;
                this.items = [];
                var me = this;
                let n = 0;
                const max = 10;
                this.map.forEachFeatureAtPixel(pixel, function (feature) {
                    me.showoverlay = true;
                    me.toggle = true;
                    if (!feature.get('features')&&feature.get('type')!=='pointMarker') {
                        if (n < max) { // browser slow if showing many tabs
                            me.addMarker(feature);
                            me.showInfo(feature);
                        }
                        n++;
                    } else { // clustered feature
                        const features = feature.get('features');
                        me.addMarker(features[0]);
                        for (var i = 0; i < features.length; i++) {
                            if (n < max) { // browser slow if showing many tabs
                                me.showInfo(features[i]);
                            }
                            n++;
                        }
                    }
                });
            },
            addItem(item) {
                this.items.push(item);
                this.showoverlay = false;
            },
            clearMarkers(){
                this.map.getLayerByLid('marker').getSource().clear();
            },
            addMarker(feature){
                this.clearMarkers();
                const markerLayer = this.map.getLayerByLid('marker');
                const markerSource = markerLayer.getSource();
                let marker = feature.clone();
                marker.set('type', 'pointMarker'); // determines the styling
                markerSource.addFeature(marker);
                markerLayer.setVisible(true);
            },
            showInfo(feature) {
                const id=feature.get("id")
                const type = feature.get("type")
                const year = feature.get('val')
                let item = {
                    photo_url: '',
                    photo_caption: '',
                    kl_url: '',
                    rows: [],
                    title: ''
                };
                let me = this;
                const language = this.$i18n.locale;

                for (var i = 0, len = lang.length; i < len; i++) {
                    this.t[i] = lang[i][language]
                }
                const skip = ['foto', 'FO', 'id', 'photo_url', 'kl_url', 'photo_caption', 'type']; // fields left out of the table
                let paramstring = 'id=' + id + '&type=' + type + '&year=' + year + '&language=' + language;
                axios.get(this.$config.klooster.info_url + '?' + paramstring).then(result => {
                    const data = result.data.features[0].properties;
                    item.photo_url = data.photo_url;
                    item.photo_caption = data.photo_caption;
                    item.kl_url = data.kl_url;
                    for (var key in data) {
                        if (!skip.includes(key)) {
                            item.rows.push({key: '<b>' + key + '</b>', value: data[key]});
                        }
                        item.type = data['type'];
                        item.title = data['type'];
                        item.title = item.title + ' ' + id;
                        item.map_url = 'index.html?id=' + id + '&nomenu=t&language=' + language;
                        item.feature = feature;
                    }
                    me.addItem(item);
                }, error => {
                    console.error(error);
                });
            },
            handleImageError(index) {
                this.items[index].photo_url = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs%3D';
            }
        }
    }

</script>

<style scoped>

</style>
<style>
    .hidden_header {
        display: none;
    }

    #feature-info {
        background-color: azure;
        position: relative;
        opacity: 0.95;
        z-index: 1050;
    }

    .scroll {
        padding-right: 15px;
        max-height: calc(100vh - 280px);;
        overflow-y: auto;
    }
</style>
