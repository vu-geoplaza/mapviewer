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
                this.link_text = 'show by year';
            } else {
                this.link = '?mode=all';
                this.link_text = 'show all';
            }
        }
    }
</script>

<style scoped>

</style>