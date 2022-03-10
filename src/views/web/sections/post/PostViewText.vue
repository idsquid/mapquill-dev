<template>
  <div class="text-post pointerable">
    {{ text }}
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
export default Vue.extend({
  name: 'text-post-view',
  props: ['thePost', 'textUrl'],
  data() {
    return {
      text: ''
    }
  },
  computed: {
    
  },
  mounted() {
    const _this = this
    
    let useUrl = this.textUrl || this.thePost.audioUrl
    
    // SAVE TXT OBJECT LOCALLY
    if (this.thePost && this.thePost.audioFile) {
      this.text = this.thePost.audioFile
      return
    }
    
//    console.log(this.textUrl)
    axios.get(useUrl).then(function(response) {
      _this.text = response.data
      
      if (_this.thePost) {
        Vue.set(_this.thePost, 'audioFile', response.data)
      }
      
      _this.$emit('contentLoaded')
    })
  }
  
})
</script>

<style lang="scss">
  .text-post {
    white-space: pre-wrap;
    overflow-y: scroll;
    width: 330px;
    max-height: 280px;
  }
</style>