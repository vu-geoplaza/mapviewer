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
                language: this.$config.klooster.language,
                button_language: ''
            }
        },
        mounted: function () {
            this.language = this.$config.klooster.language;
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
                this.$config.klooster.language = this.language;
                localStorage.setObjectKey('language', this.language);
                SharedEventBus.$emit('change-language');
                this.$forceUpdate();
            }
        }
    }
</script>

<style scoped>

</style>
