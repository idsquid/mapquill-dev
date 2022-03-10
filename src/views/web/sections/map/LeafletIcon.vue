<template>
  <div v-if="(markerCluster || isAddPostMarker) && store" :class="iconClass">
    
<!--    ADDPOST MARKER-->
    <icon-addpost v-if="isAddPostMarker" :store="store"></icon-addpost>
    
<!--    CLUSTERS-->
    <icon-cluster v-else-if="isACluster" :cluster="markerCluster" :store="store"></icon-cluster>
    
<!--    STRUCTURES -->
    <div v-else class="loading-container" v-observe-visibility="{
  callback: (isVisible) => visibilityChanged(isVisible),
  once: true,
}">
<!--      VOXEL ICON-->
<!--      CSS VOXELS-->
      <voxel-view v-if="cubeDataLoaded && useCssVoxels" :thePost="theStructure" :class="{active: structureId == quillSelectedId && userEditable}" :store="store">
        <!-- Info bubbles -->
        <map-icon-overlay :id="structureId" :store="store" v-if="infoOpen"></map-icon-overlay>
      </voxel-view>
<!--      CANVAS VOXELS!! -->
      <voxel-canvas v-else-if="cubeDataLoaded" :thePost="theStructure" :store="store">
        <map-icon-overlay :id="structureId" :store="store" v-if="infoOpen"></map-icon-overlay>
      </voxel-canvas>
      
        <!--      LOADING SPINNER -->
      <v-icon class="loading-indicator" color="white" name="spinner" scale="2.5" spin v-else></v-icon>
      
    </div>
  </div>
  <div v-else>
    <!-- nothing here -->
  </div>
</template>

<script>
  // this realestate is shared by the leaflet cluster and marker extensions!
  
  import Vue from 'vue'
//  import moment from 'moment'
  
  import IconAddPost from '@/views/web/sections/map/IconAddPost.vue'
  import VoxelView from '@/views/web/sections/voxels/VoxelView.vue'
  import VoxelCanvas from '@/views/web/sections/voxels/VoxelCanvas.vue'
  import IconCluster from '@/views/web/sections/map/IconCluster.vue'
  import IconOverlay from '@/views/web/sections/map/IconOverlay.vue'
  
  import { ObserveVisibility } from 'vue-observe-visibility'
  
  // CUBEDATA IMPORTS  
//  import axios from 'axios'; // call for cubeData objects
  
  export default Vue.extend({
    name: 'cluster-icon',
    components: {
      'icon-addpost': IconAddPost,
      VoxelView,
      VoxelCanvas,
      'icon-cluster': IconCluster,
      'map-icon-overlay': IconOverlay
    },
    directives: {
      'observe-visibility': ObserveVisibility
    },    
    data: function() {
      return {
        markerCluster: null, // set by iconCreateFunc in ClusterExtension
        store: null,
        isAddPostMarker: false,
        //
        infoOpen: true,
        useCssVoxels: false
      }
    },
    computed: {
      isACluster() {
        // as opposed to a structure
        if (this.markerCluster && typeof this.markerCluster._childClusters != 'undefined') {
          return true
        } else {
          return false
        }
      },
      structureId: function() {
        if (!this.markerCluster) return null
        const marker = this.markerCluster.getAllChildMarkers()[0]
        return marker.options.audioId
      },
      theStructure() {
        const id = this.structureId
        if (id) {
          return this.store.getters['posts/structureById'](id)
        } else {
          return null
        }
      },
      quillSelectedId() {
        return this.store.getters.userQuillSelectedId
      },
      userEditable() {
        if (this.structureId) {
          return this.store.getters.userCanEdit(this.structureId)
        } else {
          return this.store.getters.userCanEdit(this.quillSelectedId)
        }
      },
      isPlaying() {
        return !this.store.getters['audio/paused'](this.structureId)
      },
      cubeDataLoaded() {
        if (!this.theStructure) return false;
        return this.theStructure.cubeDataLoaded
      },
      clusterChildren: function() {
        return this.markerCluster.getAllChildMarkers()
      },
      iconClass() {
        const deets = [
          this.isPlaying ? 'is-playing' : '',
          this.infoOpen ? 'info-open' : '',
          this.isACluster ? 'cluster' : 'structure' // change this
        ]
        return deets.join(' ')
      }
    },
    methods: {
      async visibilityChanged (isVisible) {
        if (isVisible) {
          this.store.dispatch('posts/loadCubeData', this.theStructure)
        }
      }
    }
  })
  
</script>

<style lang="scss">
/*  LEAFLET'S TOP DIV*/
.leaflet-div-icon {
  border: none;
  border-radius: 1em;
  background: $lightyellow;
}
  
/*  ONE DOWN OUR ICON BEGINS*/
/*  AS EITHER A STRUCTURE OR CLUSTER */
  .cluster, .structure {
    position: relative; // to leaflet's css 
    left: 6px; // 
  }
  
/*  TWO DOWN*/
  .structure .loading-indicator {
    font-size: 2.5em;
    margin: -1.68em 0px 0px -1.68em;
    padding: 1em;
    background: #9ac5ef;
    border-radius: 99em;
  }
  
  /* THREE DOWN IS THE CONTENT */
  
  
  
/*  STATES*/
  .leaflet-container {
    .structure .voxel-canvas {
      @include mapIconRound;
      .canvas-container {
        border-radius: 99em;
        overflow: hidden;
      }
      > .fa-icon {
        width: 3em;
        height: 3em;
      }
    }
  }
/*
  .at-max-zoom .voxel-canvas {
   @include mapIconRound;
  }
*/
  .popup-open .structure {
    margin-top: $mapIconWidthBig / 3;
/*    transform: scale(1.5);*/
/*    font-size: $mapFontSize * 2;*/
  }
  .popup-open .structure .voxel-canvas {
    @include mapIconBig;
    margin-top: 1.5em;
    overflow: visible;
    border-radius: 0;
    background-color: #eeeeee;
    box-shadow: 0 4px 4px #333;
    .canvas-container, .photo-container {
      border-radius: 0;
      overflow: visible;
    }
  }
  .spider-open .cluster {
    opacity: .5;
  }
  .spider-open .spiderfied .cluster {
    opacity: 1;
  }
  .spiderfied .voxel-view {
    box-shadow: 0px 8px 4px #000000aa;
  }
  
  
/*ANIMATIONS*/
  .map-container {
    .structure {
      transition: margin-top .5s;
    }
    .voxel-canvas {
/*      transition: all .5s;*/
    }
    .popup-open .scene {
      //font-size: 100%;
    }
    .scene {
/*      font-size: 200%;*/
    }
  }

</style>