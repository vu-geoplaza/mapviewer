<template>
    <b-nav-item :href="link">
        {{link_text}}
    </b-nav-item>
</template>

<script>
    import {SharedEventBus} from "@/shared";
    export default {
        name: "KloosterModeSwitcher",
        data: function () {
            return {
                link_text: '',
                link: ''
            }
        },
        mounted: function () {
            var me=this;
            this.init();
            SharedEventBus.$on('change-language', function () { me.init() });
        },
        methods: {
            init: function() {
                if (this.$config.klooster.mode==='all'){
                    this.link = '?mode=&language=' + this.$config.klooster.language;
                    this.link_text = 'show by year';
                } else {
                    this.link = '?mode=all&language=' + this.$config.klooster.language;
                    this.link_text = 'show all';
                }
            }
        }
    }
</script>

<style scoped>

</style>