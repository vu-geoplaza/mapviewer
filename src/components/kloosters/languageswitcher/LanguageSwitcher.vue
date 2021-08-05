<template>

    <b-nav-item href="#" @click="switchlanguage()" right>
        {{button_language}}
    </b-nav-item>

</template>

<script>
    import {SharedEventBus} from "@/shared";

    export default {
        name: "LanguageSwitcher",
        data: function () {
            return {
                language: this.$i18n.locale,
                button_language: ''
            }
        },
        mounted: function () {
            this.language = this.$i18n.locale;
            if (this.language === 'en') {
                this.button_language = 'nl';
            } else {
                this.button_language = 'en';
            }
        },
        methods: {
            switchlanguage() {
                if (this.language === 'nl') {
                    this.language = 'en';
                    this.button_language = 'nl';
                } else {
                    this.language = 'nl';
                    this.button_language = 'en';
                }
                this.$i18n.locale = this.language;
                SharedEventBus.$emit('change-language');
                this.$forceUpdate();
            }
        }
    }
</script>

<style scoped>

</style>
