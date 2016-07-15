<template>
</template>

<script>
import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);
var App    = Vue.extend({});
var router = new VueRouter();
router.start(App, 'body');
</script>

<style>
*, *:before, *:after {
  box-sizing: border-box;
}
html, body {
  width: 100%; height: 100%; overflow: hidden;
}

body {
  display: flex;
  flex-flow: column nowrap;
}
</style>
