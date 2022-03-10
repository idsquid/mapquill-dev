<template>
<div class="content-tower">
  <div class="my-isometric-container">
    <div :class="'tower-post ' + p.mimeType" v-for="(p, i) in usePosts" :key="'tower-post'+i">
      <img class="tower-post-content" v-if="p.mimeType == 'image'" :src="p.audioUrl">
      <div class="tower-post-content" v-if="p.mimeType == 'audio'"><v-icon name="music"></v-icon></div>
      <div class="tower-post-content" v-if="p.mimeType == 'text' && p.audioPostType == 'content'"><v-icon name="font"></v-icon></div>
      <div class="tower-post-content a-structure" v-else>
        <voxel-canvas v-if="useVoxels" :thePost="bigData" :store="store"></voxel-canvas>
        <v-icon name="home" color="#fff"></v-icon>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import VoxelCanvas from '@/views/web/sections/voxels/VoxelCanvas.vue'  
  
export default {
  name: 'content-tower',
  props: ['posts', 'store'],
  data() {
    return {
      useVoxels: false
    }
  },
  computed: {
    usePosts() {
      return this.posts.filter((p) => p.audioPostType == 'content')
    }
  },
  components: {
    VoxelCanvas
  }
}
</script>

<style lang="scss">
/*  $content-edge: 10em;*/
  .content-tower {
    @include column(flex-end, center);
    perspective: 400em;
    perspective-origin: 0em -180em;
    width: 100%;
    height: 100%;
    position: absolute;
    font-size: 10em;
    z-index: -1;
    margin-bottom: 35%;
    .voxel-canvas {
/*
      width: 100%;
      height: 100%;
*/
    }
  }
  .my-isometric-container {
    position: relative;
    transform: rotateY(45deg);
    transform-style: preserve-3d;
  }
  .tower-post {
    position: absolute;
    @for $i from 0 through 10 {
      &:nth-of-type(#{$i}) {
        transform: translateY($i * -.1em) rotateX(90deg);
      }
    }
/*    background-color: red;*/
    margin: -.5em;
    width: 1em; height: 1em;
    border-radius: 99em;
    box-sizing: border-box;
    border-bottom: 5px solid $medblack;
    background-color: $darkwhite;
    color: $medblack;
    overflow: hidden;
    &:first-child {
      box-shadow: 15px 1px 14px #333;
    }
    &.audio {
      background-color: $medblack;
      color: $darkwhite;
      border: 2px solid blue;
    }
  }
  .tower-post-content {
    @include column(center, center);
    width: 100%; height: 100%;
    font-size: .5em;
    .fa-icon {
      width: 1em;
      height: 1em;
    }
    &.a-structure {
      background: $darkwhite;
      color: $lightgreen;
    }
/*    background: green;*/
  }

</style>