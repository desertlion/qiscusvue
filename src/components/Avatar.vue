<template>
  <div class="avatar">
    <img :src="src" />
  </div>
</template>

<script>
export default {
  props: ['src'],
  data () {
    return { }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.avatar { width: 30px; height: 30px; overflow: hidden; background: #999; border-radius: 50%; }
.avatar img { width: 30px; height: 30px; }
</style>
