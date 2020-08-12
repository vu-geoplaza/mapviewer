import { SharedEventBus } from '@/shared'

/**
 * Mixin, which binds the OL map to the target component.
 * Executes the onMapBound function of the target component, if available.
 */
export const Mapable = {
  data() {
    return {
      map: {}
    }
  },
  created: function () {
    SharedEventBus.$on('ol-map-mounted', (olMap) => {
      // make the OL map accesible in this component
      this.map = olMap;

      if (this.onMapBound) {
        this.onMapBound();
      }
    });
  }
};
