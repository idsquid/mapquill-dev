<template>
<div class="popup-quill">
  <span>you can build here!</span>
  <div class="clickable button" @click="createStructure">Do That</div>
</div>
</template>

<script>
import Vue from 'vue'  
export default Vue.extend ({
  name: 'popup-quill',
  props: ['store'],
  methods: {
    async createStructure() {
      this.store.dispatch('posts/createStructure')
    }
  }
  
})
</script>

<style lang="scss">
  .popup-quill {
    @include column(center, center);
    > * {
      margin: 1em 0 .5em;
    }
  }
</style>