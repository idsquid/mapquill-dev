<template>
  <div class="popup-content" :class="viewClass" v-if="thePost && allChildPosts.length">
    <div id="app-busy" v-show="!thePost || store.state.activeLoading.length">
      <v-icon name="spinner" spin></v-icon>
    </div>
    
<!--    POPUP LANDING-->
<!--      <popup-home :thePost="thePost" :store="store"></popup-home>-->
    
      <carousel :posts="carouselPosts" @contentUpdated="updatePopup" v-if="thePost && allChildPosts.length" :includeAudio="audioPosts && audioPosts.length > 0">
        
<!--        AUDIO GRAPH fullpage and minimized -->
<!--        min-->
        <template v-slot:footer>
          <audio-graph v-if="useAudioGraph && audioPosts.length" :store="store" class="pointerable" :audioId="thePost.audioId" :uAudioId="thePost.uAudioId" @mounted="updatePopup" layout="compact"></audio-graph>
        </template>
<!-- fullpage-->
        <template v-slot:slide>
        <audio-graph v-if="useAudioGraph && audioPosts.length" :store="store" class="pointerable" :audioId="thePost.audioId" :uAudioId="thePost.uAudioId" @mounted="updatePopup"></audio-graph>
        </template>

<!--ADDITIONAL CONTENT PASSDD TO CAROUSEL -->
        
      </carousel>
    
    

 </div>
<div class="popup-content no-content" v-else>
  <span>
      nothing here, yet
    </span>
</div>
    
</template>

<script>
import Vue from 'vue'
  
import Carousel from '@/views/web/layout/Carousel.vue'
import AudioGraphPlayer from '@/views/components/AudioGraphPlayer.vue'
  
export default Vue.extend({
  name: 'structure-popup',
  components: {
    'carousel': Carousel,
    'audio-graph': AudioGraphPlayer
  },
  data: function() {
    return {
      optionsOpen: false,
      shareLinkOpen: false,
      store: null,
      popup: null,
      useAudioGraph: true
    }
  },
  computed: {
    isAdmin() {
      return this.store.state.userRole=='editor'
    },
    thePost() {
      const activePost = this.store.getters['posts/activeStructure']
      
      if (activePost && this.popup.audioPost.audioId == activePost.audioId) {
        return activePost
      } else {
        return null
      }
    },
    allChildPosts() {
      return this.store.getters['posts/contentById'](this.thePost.audioId) || []
    },      
    carouselPosts() {
      return this.store.getters['posts/contentById'](this.thePost.audioId, null, 'audio') || [] // everything except audio
    },
    imagePosts() {
      return this.store.getters['posts/contentById'](this.thePost.audioId, 'image')
    },
    audioPosts() {
      return this.store.getters['posts/contentById'](this.thePost.audioId, 'audio')
    },
    textPosts() {
      return this.store.getters['posts/contentById'](this.thePost.audioId, 'text')
    },
    viewClass() {
      if (this.thePost && this.audioPosts.length) {
        return 'audio-container'
      } else {
        return ''
      }
    }
  },
  methods: {
    updatePopup() {
      setTimeout(function() {this.popup.update()}.bind(this), 100)
    }
  }
})

</script>

<style lang="scss">
  .popup-content {
    font-size: 12px;
  }
  
  
</style>