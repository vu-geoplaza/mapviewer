<template>
  <li class="list-item">
    <b-card no-body class="mb-1">
      <b-card-header header-tag="header" class="p-1">
        <span v-handle class="handle" style="float: left;"></span>
        <b-btn v-b-toggle="'layercard' + index" variant="info">{{ item.name }}</b-btn>
        <input type="checkbox" :id="'checkbox' + index" v-model="item.visible">
      </b-card-header>
      <b-collapse :id="'layercard' + index">
        <b-card-body>
          <p class="card-text">
            <img :src="item.legend_img"/>
          </p>
        </b-card-body>
      </b-collapse>
    </b-card>
  </li>
</template>

<script>
  import {ElementMixin, HandleDirective} from "vue-slicksort";

  export default {
    mixins: [ElementMixin],
    directives: {handle: HandleDirective},
    props: ['item', 'index'],
  }
</script>

<style>
  .handle {
    width: 18px;
    height: 18px;
    background-image: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50"><path d="M 0 7.5 L 0 12.5 L 50 12.5 L 50 7.5 L 0 7.5 z M 0 22.5 L 0 27.5 L 50 27.5 L 50 22.5 L 0 22.5 z M 0 37.5 L 0 42.5 L 50 42.5 L 50 37.5 L 0 37.5 z" color="black"></path></svg>');
    background-size: contain;
    background-repeat: no-repeat;
    opacity: 0.25;
    margin-right: 10px;
    margin-top: 8px;
    cursor: row-resize;
  }

  input {
    float: right;
    vertical-align: middle;
  }

  .btn {
    width: -webkit-calc(100% - 50px);
    width: -moz-calc(100% - 50px);
    width: calc(100% - 50px);
  }

</style>
