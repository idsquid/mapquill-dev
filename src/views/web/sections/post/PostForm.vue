<template>
<div class="post-form" v-if="thePost">
  <div class="post-type" :class="{'a-structure': isStructure, 'a-text': mimeType == 'text' && !isStructure, 'a-image': mimeType == 'image', 'a-audio': mimeType=='audio'}">
    
  </div>
  
 <div class="post-title text-field">
    <input type="text" v-model="thePost.audioTitle" placeholder="Untitled">
  </div>
  <div class="created-at date-field">
    <date-picker @input="dateUpdate" format="MM/DD/YYYY" value-type="timestamp" v-model="thePost.postDate" :default-value="thePost.postDate"></date-picker>
  </div>
<!--
  <div class="post-desc textarea-field">
    <label>Body</label>
    <textarea v-model="thePost.audioDesc"></textarea>
    {{ thePost.audioDesc }}
  </div>
-->
  <div class="file-preview" v-if="thePost.audioUrl">
    <image-post class="image-container" :thePost="thePost" v-if="mimeType=='image'"></image-post>
    <text-post v-if="mimeType == 'text' && !isStructure" :textUrl="thePost.audioUrl"></text-post>
    
    <voxel-canvas :thePost="thePost" v-if="isStructure"></voxel-canvas>
    <router-link v-if="isStructure" :to="{name:'voxels'}" v-slot="{route, navigate}" append custom>
        <div class="clickable button" @click="navigate">
          edit
        </div>
      </router-link>
    
    <audio-post v-if="mimeType == 'audio'" :thePost="thePost"></audio-post>
    <div v-if="mimeType=='video'" class="user-selected-media">
      <video controls>
         <source :src="thePost.audioUrl">
      </video>
    </div>
  </div>
  <div v-else class="file-preview">
    <v-icon class="loading-indicator" name="spinner" spin></v-icon>
  </div>
  
  <div class="post-menu">
    <div class="button" @click="savePost" :class="{'disabled': !isAltered}">save</div>
    <span class="a-link" @click="deletePost()">delete</span>
    
  </div>
  
</div>
<div v-else>
  no post
</div>
</template>

<script>
import imagePost from '@/views/web/sections/post/PostViewImage.vue' 
import textPost from '@/views/web/sections/post/PostViewText.vue' 
import audioPost from '@/views/web/sections/post/PostViewAudio.vue' 
import VoxelCanvas from '@/views/web/sections/voxels/VoxelCanvas.vue' 
  
//import moment from 'moment'  
import DatePicker from 'vue2-datepicker';
import 'vue2-datepicker/index.css';

export default {
  name: 'post-form',
  data() {
    return {
      revisedPostDate: null
    }
  },
  components: {
    'image-post': imagePost,
    'text-post': textPost,
    'audio-post': audioPost,
    VoxelCanvas,
    DatePicker
  },
  props: ['thePost', 'theFile'],
  computed: {
    isStructure() {
      return this.thePost.audioPostType == 'home'
    },
    mimeType() {
      return this.thePost.mimeType
    },
    postDate() {
      return new Date(this.thePost.postDate)
    },
//    createdAt() {
//      return moment(this.thePost.createdAt).format('MMMM Do, YYYY') // YYYY, h:mm a
//    },
    isAltered() {
      return this.thePost.alteredAt || !this.thePost.fileKey
    }
  },
  methods: {
    async savePost() {
      if (this.$store.getters.useRemoteDatabase) {
        // SAVE TO REMOTE DRIVE
        this.$store.dispatch('saveOne', this.thePost, {root: true})
      } else {
        this.$store.commit('posts/updateLocalStorage')
      } 
    },
    async deletePost() {
      this.$store.dispatch('posts/deletePost', this.thePost)
      if (this.thePost.audioPostType == 'home') {
        this.$router.push({name: 'map'})
      }
    },
    dateUpdate(d) {
      this.$set(this.thePost, 'postDate', d)
    }
  }
}

</script>

<style lang="scss">
  .post-form {
    .voxel-canvas {
      @include iconRound;
      overflow: hidden !important;
      .fa-icon {
        font-size: 3em;
      }
    }
  }

</style>
