<template>
  <li class="list-item">
    <b-card no-body class="mb-1">
      <b-card-header header-tag="header" class="p-1">
        <span v-handle class="handle"></span>
        <b-btn v-b-toggle="'layercard' + index" variant="info" class="layerbutton">
          {{ item.label }}
          <span class="float-right when-open mr-1"><font-awesome-icon icon="chevron-up"/></span>
          <span class="float-right when-closed mr-1"><font-awesome-icon icon="chevron-down"/></span>
        </b-btn>
        <input type="checkbox" :id="'checkbox' + index" v-model="it.visible" />
      </b-card-header>
      <b-collapse :id="'layercard' + index" v-model="show">
        <b-card-body>
          <p class="card-text">
            <vue-slider :ref="'slider' + index" v-model="it.opacity" v-bind="slideoptions"></vue-slider>
          </p>
          <p class="card-text">
            <img alt="legend" :src="it.legend_img"/>
          </p>
        </b-card-body>
      </b-collapse>
    </b-card>
  </li>
</template>

<script>
  import {ElementMixin, HandleDirective} from "vue-slicksort";
  import vueSlider from 'vue-slider-component';
  import 'vue-slider-component/theme/default.css'

  export default {
    components: {
      vueSlider
    },
    mixins: [ElementMixin],
    directives: {handle: HandleDirective},
    props: ['item', 'index'],
    data () {
      return{
        slideoptions: {
          tooltip: 'hover'
        },
        show: false,
        it: {},
      }
    },
    watch: {
      item(newValue) {
        if (Object.keys(this.it).length === 0 && this.it.constructor === Object) {
          this.it = newValue
        }
      }
    },
    created() {
      this.it = this.item;
    },
    methods: {
      visibilityChanged($event) {
        this.it.visible = $event;
        this.$emit('input', this.it)
      },
      opacityChanged($event) {
        this.it.opacity = $event;
        this.$emit('input', this.it)
      }
    },
  }
</script>

<style scoped>
  .handle {
    float: left;
    width: 1em;
    height: 1em;
    background-image: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50"><path d="M 0 7.5 L 0 12.5 L 50 12.5 L 50 7.5 L 0 7.5 z M 0 22.5 L 0 27.5 L 50 27.5 L 50 22.5 L 0 22.5 z M 0 37.5 L 0 42.5 L 50 42.5 L 50 37.5 L 0 37.5 z" color="black"></path></svg>');
    background-size: contain;
    background-repeat: no-repeat;
    opacity: 0.25;
    margin-right: 0.1em;
    margin-top: 0.3em;
    cursor: row-resize;
  }

  input {
    float: right;
    vertical-align: middle;
    margin-top: 0.5em;
  }

  .layerbutton {
    padding: 2px;
    font-size: 0.9em;
    width: -webkit-calc(100% - 50px);
    width: -moz-calc(100% - 50px);
    width: calc(100% - 50px);
  }

  .collapsed > .when-open,
  .not-collapsed > .when-closed {
    display: none;
  }
</style>
