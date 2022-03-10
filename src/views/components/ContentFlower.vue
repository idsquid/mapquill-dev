<template>
<div class="content-flower grid">
    <div :class="'tower-post ' + p.mimeType" v-for="(p, i) in usePosts" :key="'tower-post'+i">
      <img class="tower-post-content" v-if="p.mimeType == 'image'" :src="p.audioUrl">
      <div class="tower-post-content" v-if="p.mimeType == 'audio'"><v-icon name="music"></v-icon></div>
      <div class="tower-post-content" v-if="p.mimeType == 'text' && p.audioPostType == 'content'"><v-icon name="font"></v-icon></div>
<!--
      <div class="tower-post-content a-structure" v-else-if="">
        <voxel-canvas v-if="useVoxels" :thePost="bigData" :store="store"></voxel-canvas>
        <v-icon name="home" color="#fff"></v-icon>
      </div>
-->
    </div>
  </div>
</template>

<script>
//import VoxelCanvas from '@/views/web/sections/voxels/VoxelCanvas.vue'  
  
export default {
  name: 'content-flower',
  props: ['posts', 'store'],
  data() {
    return {
      useVoxels: false
    }
  },
  computed: {
    usePosts() {
      return this.posts.filter((p) => p.audioPostType == 'content').slice(0, 9)
    }
  },
  components: {
//    VoxelCanvas
  }
}
</script>

<style lang="scss">
/*  $content-edge: 10em;*/
  .content-flower.circle {
    @include on-circle($item-count: 30, $circle-size: 10em, $item-size: 4em, $rot: 120, $dir: -1); 
    overflow: hidden;
    @include column(flex-end, center);
    perspective: 400em;
    perspective-origin: 0em -180em;
    position: absolute;
/*    font-size: 10em;*/
    z-index: 2;
    opacity: 1;
/*    top: -1em;*/
    .voxel-canvas {
/*
      width: 100%;
      height: 100%;
*/
    }
  }
  .content-flower.grid {
    position: absolute;
    z-index: -1;
    width: 100%; height: 100%;
    display: grid;
    grid-template: repeat(3, 33.333%) / repeat(3, 33.333%);

      .tower-post {
        &:nth-child(4), &:nth-child(5) {
          grid-column-start: 3;
        }
        &:nth-child(6) {
          grid-column-start: 1;
          grid-row-start: 2;
        }
        &:nth-child(7) {
          grid-column-start: 2;
          grid-row-start: 2;
        }
        &:nth-child(8) {
          grid-column-start: 1;
          grid-row-start: 3;
        }
        &:nth-child(9) {
          grid-column-start: 2;
          grid-row-start: 3;
        }
    }  
  }
  .tower-post {
/*    border: 1px solid #333;*/
/*    border: solid 2px black;*/
/*    width: 33%; height: 33%;*/
    background: black;
    box-sizing: border-box;
/*    border-radius: 5em;*/
    overflow: hidden;
/*    opacity: .95;*/
    &.audio {
      background-color: $medblack;
      color: $darkwhite;
      border: 2px solid $darkblue;
    }
  }
  .tower-post-content {
    @include column(center, center);
    width: 100%; height: 100%;
    font-size: 1em;
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