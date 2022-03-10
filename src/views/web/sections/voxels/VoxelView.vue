<template>
<div class="voxel-view voxel-css" v-if="thePost && thePost.cubeDataLoaded">
  <div class="scene">
    <div class="isometric-container" :style="isoStyle" :class="'max-dimension-' + maxDimension">
      <voxel-cube v-for="(c, i) in cubes" :environment="c[4] || 'live'" :key="i" :propClass="c[3]" :x="c[0]" :y="c[1]" :z="c[2]" :faceContent="cubeFaceContent(c)" @click.native="$emit('cubeClicked', i)" @sideClicked="$emit('sideClicked', $event)"></voxel-cube>
    </div>
  </div>
  <slot></slot>
</div>
<div v-else>
  voxel view: no post
</div>
</template>

<script>

import VoxelCube from '@/views/web/sections/voxels/VoxelCube.vue' 
import {aFloor} from '@/views/web/sections/voxels/VoxelUtils.js'  
  
export default {
  name: 'voxel-view',
  props: {
    thePost: {type: Object, default: null},
    includes: {type: Array, default() {return []}},
    store: {type: Object, default: null}
  },
  components: {
    'voxel-cube': VoxelCube
  },
  created() {
    if (!this.thePost.cubeDataLoaded) {
      console.log('error: unloaded cube data')
    }
  },
  computed: {
    environment() {
      return 'live'
    },
    cubes() {
      let payload = []
      
      // thePost.cubeData must already be loaded
      if (this.thePost.cubeData.length) {
        payload = payload.concat(this.thePost.cubeData)
      }
      
      // added includes
      if (this.includes.indexOf('aFloor') > -1) {
        payload = payload.concat(aFloor(10, 10))
      }
      
      return payload
    },
    isoStyle() {
      const cubeScale = this.thePost.cubeScale,
            horzAdjust = this.thePost.horzAdjust / 100,
            vertAdjust = this.thePost.vertAdjust / 100,
            useStyles = {
              fontSize: cubeScale + '%',
              left: horzAdjust + 'em',
              top: -vertAdjust + 'em'
            }
      
      if (cubeScale > 720) {
        // go single photo mode
        useStyles['transform'] = 'none'
        useStyles['transform-style'] = 'flat'
      }
      
      return useStyles
    },
    contentForDisplay() {
      return this.store.getters['posts/contentById'](this.thePost.audioId, 'image')
    },
    
    maxDimension() {
      let maxDimension = 1
      if (this.cubes) {
      for (var i=0; i<this.cubes.length; i++) {
        for (var j=0; j<3; j++) {
          const pos = this.cubes[i][j]
          if (pos > maxDimension) {
            maxDimension = pos
          }
        }
      }
      }
      return maxDimension
    }
  },
  methods: {
    cubeFaceContent(c) {
      if (c[3].indexOf('picture-cube') != -1) {
        return this.contentForDisplay
      } else {
        return []
      }
    }
  }
}
  
</script>

<style lang="scss">
  .voxel-view {
    display: grid;
  }
.scene {
  @include column(center, center);
  perspective: 400em;
  perspective-origin: 0em -180em;
}

.isometric-container {
  position: relative;
  transform: rotateY(45deg);
  transform-style: preserve-3d;
} 
  
  // ENV
.map-container .voxel-view {
  @include mapIconRound;
  border: none;
  background: transparent;
}
$popupScaler: 1.5;
.map-container .popup-open .voxel-view {
  background-color: #ffffffee;
  border-radius: 5px;
  border: none;
  box-shadow: 0px 5px 9px #333;
  .scene {
    border-radius: 0;
  }
}
/*
.map-container .scene, .preview-mode .scene {
  overflow: hidden;
  border-radius: 99em;
}  
*/
  
</style>