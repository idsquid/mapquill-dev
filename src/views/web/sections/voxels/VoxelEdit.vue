<template>
  <div class="voxel-editor" :class="editControls[selectedControl] + '-control'">
    <voxel-view v-if="thePost.cubeScale <= 720" @sideClicked="onSideClicked($event)" @cubeClicked="onCubeClicked($event)" :store="$store" :thePost="thePost" :includes="['aFloor']"></voxel-view>
    
    <div v-else class="voxel-canvas-container">
      <voxel-canvas :thePost="thePost"></voxel-canvas>
    </div>
    
    <voxel-edit-controls :colors="colors" :colorCodes="colorCodes" @newColor="selectedColor = $event" :editControls="editControls" :editIcons="editIcons" @newControl="selectedControl = $event"></voxel-edit-controls>
  </div>
</template>

<script>
import VoxelView from '@/views/web/sections/voxels/VoxelView.vue'  
import VoxelEditControls from '@/views/web/sections/voxels/VoxelEditControls.vue'  
import VoxelCanvas from '@/views/web/sections/voxels/VoxelCanvas.vue'  
  
export default {
  name: 'voxel-editor',
  components: {
    'voxel-view': VoxelView,
    'voxel-edit-controls': VoxelEditControls,
    VoxelCanvas
  },
  data() {
    return {
      colors: ['blue','red','green','yellow','orange','purple','white','brown','grey','black'],
      colorCodes: ['#009bc5','#bf272c','#80c64a','#dfdf71','#fbb513','#c267a7','#f5f4f3','#a5857d','#858b90','#203A43'],
      selectedColor: 0,
      editControls: ['create','tint','trash'],
      editIcons: ['cube', 'tint', 'trash'],
      selectedControl: 0,
      floorSize: 10
    }
  },
  computed: {
    thePost() {
       return this.$store.getters['posts/structureById'](this.$route.params.audioId)
    },
    activeControl() {
      return this.editControls[this.selectedControl]
    }
  },
  methods: {
    onSideClicked($event) {
      if (this.activeControl == 'create') {
        this.createCubeAt($event)
      }
    },
    onCubeClicked(cubeIndex) {
      const cubes = this.thePost.cubeData
      if (this.activeControl == 'trash') {
        cubes.splice(cubeIndex, 1)
      }
      if (this.activeControl == 'tint') {
        const cube = cubes[cubeIndex],
              color = this.colors[this.selectedColor]
        
        cube.splice(3, 1, color)
      }
      if (this.activeControl == 'camera') {
        const cube = cubes[cubeIndex]
        
        cube.splice(3, 1, 'picture-cube')
      }
    },
    createCubeAt(pos) { // from user input field
        const side = pos.side
          let x = pos.x,
              y = pos.y,
              z = pos.z
          if (side == 0) {
            y += 1;
          }
          if (side == 1) {
            x += 1;
          }
          if (side == 2) {
            z += 1;
          }
          if (side == 3) {
            y -= 1;
          }
          if (side == 4) {
            x -= 1;
          }
          if (side == 5) {
            z -= 1;
          }
        
        const cubeClass = this.colors[this.selectedColor],
              newCube = [x, y, z, cubeClass]
        
        let cubeExists = false
        this.thePost.cubeData.forEach(c => {
          const myCube = c[0] +' '+ c[1] + ' ' + c[2]
          const yourCube = newCube[0] +' '+ newCube[1] + ' ' + newCube[2]
          if (myCube == yourCube) {
            cubeExists = true
          }
        })

        if (!cubeExists) { 
          this.thePost.cubeData.push(newCube)
          
    // sort cubes by x, y, z
          this.thePost.cubeData.sort(function(a,b) {
               if (a[0] === b[0]) {
                   if (a[1] === b[1]) {
                       return (a[2] < b[2]) ? -1 : (a[2] > b[2]) ? 1 : 0;
                   } else {
                       return (a[1] < b[1]) ? -1 : 1;
                   }
               } else {
                    return (a[0] < b[0]) ? -1 : 1;
               }
          });
        }
      }
  }
}

</script>

<style lang="scss">
  .voxel-editor {
    font-size: 5em;
    display: grid;
    grid-template-rows: [row-start] auto 1fr [row-end];
    grid-template-columns: [col-start] 1fr 20% [col-end];
    grid-template-areas: ". controls" ". .";
    @include phone-only {
      grid-template-rows: [row-start] 20% 1fr [row-end];
      grid-template-columns: [col-start] 1fr [col-end];
      grid-template-areas: "controls view"
    }
    
    .voxel-canvas {
      margin: 20% 0;
      overflow: hidden !important;
      @include phone-only {
        margin: 0;
      }
    }
    
    .voxel-css {
      grid-row: row-start / row-end; 
      grid-column: col-start / col-end; 
      overflow: hidden;
      width: 100%;
      height: 100%;
      //background: radial-gradient(circle, $lightgrey $mapIconWidth / 2, $medwhite 18%);
      background-color: $lightgrey;
      background-image: linear-gradient(transparent 2px, transparent 2px),
      linear-gradient(90deg, transparent 2px, transparent 2px),
      linear-gradient(rgba(255,255,255,.3) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,.3) 1px, transparent 1px);
      background-size: 100px 100px, 100px 100px, 20px 20px, 20px 20px;
      background-position:-2px -2px, -2px -2px, -1px -1px, -1px -1px;
      @include phone-only {
        grid-row: 2 / 3;
      }
    }
    .voxel-canvas-container {
      padding: 10%;
      @include column(center, center);
      @include phone-only {
        grid-row: 2 / 3;
        .voxel-canvas {
          width: 80vw;
          height: 80vw;
        }
      }
    }
    .voxel-canvas {
      @include iconRound;
    }
    .voxel-edit-controls {
      grid-area: controls;
      z-index: 1;
    }
    
    // OTHER
    .scene {
      font-size: inherit; // inherits 2vmin from 
    }
    .voxel-cube {
      
    }
    .floor-cube .cube__face {
      background: transparent;
    }
    
    
    /**/
    &.create-control .voxel-cube {
      .cube__face:hover {
        border: none;
        background: radial-gradient(circle, rgba(51,51,51,1) 17%, white 18%);
      }
    }
    &.trash-control {
      .voxel-cube:hover {
      .cube__face {
        background-color: #ff112288;
      }
      }
    }
    &.tint-control {
      .voxel-cube:hover {
      .cube__face {
        box-shadow: 2px 2px 24px white inset;
      }
      }
    }
  }
</style>