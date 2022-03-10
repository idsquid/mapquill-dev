<template>
  <div class="audio-post pointerable">
    <h3>HTML Audio</h3>
    <audio controls>
       <source :src="thePost.audioUrl" >
    </audio>
    <div class="description">
      {{ thePost.audioDesc }}
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
export default Vue.extend({
  name: 'audio-post-view',
  props: ['thePost'],
  computed: {
    
  },
  mounted() {
    this.$emit('contentLoaded')
  }
})
</script>

<style lang="scss">
  .audio-post {
    width: 300px;
  }
</style>