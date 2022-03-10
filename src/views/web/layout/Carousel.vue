<template>
  <div class="carousel column fillNice">
    <div class="carousel-posts" v-if="viewIndex > -1 && activePost">
  <!-- CONTENT POSTS CONTAINER -->
        <image-post class="carousel-post" :thePost="activePost" v-if="activePost.mimeType == 'image'" @contentLoaded="contentLoaded"></image-post>
      
        <text-post class="carousel-post" :thePost="activePost" v-if="activePost.mimeType == 'text'" @contentLoaded="contentLoaded"></text-post>
      
        <audio-post class="carousel-post" :thePost="activePost" v-if="activePost.mimeType == 'audio'" @contentLoaded="contentLoaded"></audio-post>
      
<!-- CREATE POST COMPONENT 1/2 -->
<!--
      <div class="carousel-post centered column fillNice" v-if="viewIndex == -1">
        <create-post @postSaved="activePostIndex = 0" :justFileSelect="true"></create-post>
      </div>
-->
    </div>
    
<!--    AUDIO SLOTS-->
    <slot v-if="viewIndex > -1 && includeAudio" name="footer"></slot>
    
    <slot v-if="viewIndex == -1 && includeAudio" name="slide"></slot>
    
    <div class="row nav pointerable" v-if="posts.length">
      <!-- POST SELECT BUTTONS -->
<!--
      <span class="carousel-select" v-for="(post, i) in posts" :key="post.audioUrl" @click="activePostIndex = i" :class="{active: i == activePostIndex}">
         nothing here 
      </span>
-->
      
      <div class="carousel-select create-post-select" @click="activePostIndex = -1" :class="{active: viewIndex == -1}" v-if="includeAudio">
        <v-icon name="circle" color="#aaa" class="icon" />
      </div>
      
      <div class="carousel-select" v-for="(post, i) in posts" :key="post.audioUrl" @click="updateSlide(i)" :class="{active: i == activePostIndex}">
        <v-icon :name="post.mimeType == 'audio' ? 'music' : 'circle'" class="icon" />
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'

import imagePost from '@/views/web/sections/post/PostViewImage.vue'  
import textPost from '@/views/web/sections/post/PostViewText.vue'  
import audioPost from '@/views/web/sections/post/PostViewAudio.vue'  
//import createPost from '../components/createPost.vue'
  
export default Vue.extend({
  name: 'auwalk-carousel',
  components: {
    'image-post': imagePost,
    'text-post': textPost,
    'audio-post': audioPost
//    'create-post': createPost
  },
  props: {
    posts: {
      type: Array,
      default: function() {
        return []
      }
    },
    includeAudio: Boolean
  },
  data() {
    return {
      activePostIndex: -1
    }
  },
  computed: {
    activePost() {
      return this.posts[this.activePostIndex]
    },
    viewIndex() {
      if (this.posts.length) {
        return this.activePostIndex
      } else {
        return -1
      }
    },
    audioPosts() {
      return this.posts.filter(p => p.mimeType == 'audio')
    },
//    includeAudio() {
//      return this.audioPosts.length > 0
//    },
    imageStyle() {
      return 'background-image: url('+this.activePost.audioUrl+');'
    }
  },
  methods: {
    updateSlide(index) {
      this.activePostIndex = index
      this.contentLoaded()
    },
    contentLoaded() {
      //console.log('carousel emits contenLoaded')
      //alert('content loaded')
      this.$emit('contentUpdated')
    }
  },
  mounted() {
    //console.log('carousel mounted ' + this.posts.length)
    if (!this.includeAudio) this.activePostIndex = 0
    
  }
//  updated() {
//    console.log('carousel updated ' + this.posts.length)
//  },
//  destroyed() {
//    console.log('popup destroyed')
//  }
}) 

</script>

<style lang="scss">
  .carousel {
    align-items: center;
    justify-content: flex-start;
    height: 200px;
/*    height: 280px;*/
  }
  .carousel-posts {
    display: flex;
    flex-grow: 1;
    width: 100%;
    height: 82%; // CHANGE THUS!
  }
  .carousel-post {
/*    background-color: #f0f0f0;*/
/*    overflow: hidden;*/
  }
  .carousel .nav {
      width: 80%;
      justify-content: center;
      flex-wrap: wrap;
      .carousel-select {
        cursor: pointer;
/*        margin: 5px 5px 0;*/
        padding: 7px 5px;
        
  /*      border: 1px solid black;*/
        .icon {
          width: 10px;
          height: 10px;
          border-radius: 10em;
        }
        &span, &div {
          background-color: black;
          width: 7px;
          height: 7px;
        }
        &.active {
/*          background-color: #607d8b;*/
          .icon {
            box-shadow: 0 0 0 3px white, 0 0 0 4px black;
          }
        }
        &.create-post-select {
          &span, &div {
            background-color: red;
          }
          .icon {
            width: 8px;
            height: 8px;
            margin-bottom: 2px;
          }
        }
      }
    }
  .image-info {
    position: absolute;
    background: #ffffff91;
    padding: 5px;
    bottom: 0;
    max-width: 50%;
  }
</style>