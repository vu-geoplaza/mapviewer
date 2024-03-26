<template>
  <div>
  </div>
</template>

<script>
import {SharedEventBus} from "@/shared.js";

export default {
  name: "InfoMessage",
  mounted() {
    SharedEventBus.$on('show-message', (message, level) => {
      console.log('******** show message: ' + message);
      this.showInfo(message, level);
    });
  },
  methods: {
    showInfo: function (message, level) {
      let title='error';
      let variant='danger';
      if (level=='warning') {
        variant='warning';
      }
      if (level=='info') {
        variant='info';
      }
      this.$bvToast.toast(message, {
        title: title,
        toaster: 'b-toaster-top-center',
        variant: variant,
        solid: true
      });
    }
  }
}
</script>

<style scoped>
.message {
  top: 80px !important;
  width: 600px;
}
</style>