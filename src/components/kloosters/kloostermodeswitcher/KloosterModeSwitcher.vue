<template>
    <b-nav-item :href="link">
        {{link_text}}
    </b-nav-item>
</template>

<script>
    export default {
        name: "KloosterModeSwitcher",
        data: function () {
            return {
                link_text: '',
                link: ''
            }
        },
        mounted: function () {
            if (this.$config.klooster.mode==='all'){
                this.link = '?mode=';
                this.link_text = 'by year';
            } else {
                this.link = '?mode=all';
                this.link_text = 'all locations';
            }
        }
    }
</script>

<style scoped>

</style>