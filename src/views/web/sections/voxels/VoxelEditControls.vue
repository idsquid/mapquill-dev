<template>
<div class="vec voxel-edit-controls" v-if="thePost" :class="{'edits-photo': thePost.cubeScale > 720, 'edits-vox': thePost.cubeScale < 720}">
  <div class="sliders">
    <div class="controller">
      <input v-if="thePost.cubeScale > 720" type="range" name="font-scaler" min="721" max="1440" v-model="fontSlider">
      <input v-else type="range" name="font-scaler" min="10" max="720" v-model="fontSlider">
      <label for="font-scaler">Scale</label>
    </div>
    <div class="controller">
      <input type="range" name="horz-scaler" :min="-adjustMinMax" :max="adjustMinMax" v-model="horzSlider" step="1">
      <label for="font-scaler">Left/Right</label>
    </div>
    <div class="controller">
      <input type="range" name="vert-scaler" :min="-adjustMinMax" :max="adjustMinMax" v-model="vertSlider" step="1">
      <label for="vert-scaler">Up/Down</label>
    </div>
  </div>
  <div class="color-options">
    <div v-for="(color, i) in colorCodes" :key="color" class="swatch" :class="{active: selectedColor == i}" @click="selectColor(i)">
      <v-icon name="circle" :color="color"></v-icon>
    </div>
  </div>
  <div class="edit-options">
    <div v-for="(cont, i) in editControls" :key="cont + '-' + i" class="swatch" :class="{active: selectedControl == i}" @click="selectControl(i)">
      <v-icon :name="editIcons[i]"></v-icon>
    </div>
    <div class="button" @click="thePost.cubeScale = 721">Goto Photo Mode</div>
  </div>
  <div class="vox-cam-toggle">
    <div class="button" @click="thePost.cubeScale = 120">Goto Voxel Mode</div>
  </div>
  <div class="preview">
    <voxel-canvas :thePost="thePost"></voxel-canvas>
    <label>Preview</label>
  </div>
</div>
<div v-else>
  no post
  </div>
</template>

<script>
import VoxelCanvas from '@/views/web/sections/voxels/VoxelCanvas.vue'  
export default {
  name: 'voxel-edit-controls',
  props: ['colors', 'colorCodes', 'currentColor', 'editControls', 'editIcons'],
  components: {VoxelCanvas},
  data() {
    return {
      adjustMinMax: 500,
      selectedColor: 0,
      selectedControl: 0
    }
  },
  computed: {
    thePost() {
       return this.$store.getters['posts/structureById'](this.$route.params.audioId)
    },
    useScale() {
      return this.thePost?.cubeScale || 100
    },
    useVert() {
      return this.thePost?.vertAdjust || 0
    },
    useHorz() {
      return this.thePost?.horzAdjust || 0
    },
    fontSlider: {
      get() {
        return this.useScale
      },
      set(val) {
        this.thePost.cubeScale = val
      }
    },
    horzSlider: {
      get() {return this.useHorz},
      set(val) {
        this.thePost.horzAdjust = val
      }
    },
    vertSlider: {
      get() {return this.useVert},
      set(val) {
        this.thePost.vertAdjust = val
      }
    }
  },
  methods: {
    selectColor(i) {
      this.selectedColor = i
      this.$emit('newColor', i)
    },
    selectControl(i) {
      this.selectedControl = i
      this.$emit('newControl', i)
    }
  }
}
</script>

<style lang="scss">
  .voxel-edit-controls {
    display: grid;
    font-size: 12px;
    grid-template: repeat(99, auto) / none;
    background-color: #ffffffaa;
    padding: 1em;
    @include phone-only {
      grid-template: 1fr 1fr / repeat(3, 33%);
      grid-template-areas: 'slider slider slider' 'colors actions preview';
      .sliders {
        grid-area: slider;
        .controller {
        display: grid;
        grid-template: none / 80% 1fr;
        }
      }
      .color-options, .vox-cam-toggle {
        grid-area: colors;
      }
      .edit-options {
        grid-area: actions;
      }
      .preview {
        grid-area: preview;
      }
    }
    & > div {
      margin: .5em 0;
    }
    
    &.edits-photo {
      .color-options, .edit-options {
        display: none;
      }
    }
    &.edits-vox {
      .vox-cam-toggle {
        display: none;
      }
    }
    
  }
/*
  .controller {
    @include column(center, center);
    input {
      width: 90%;
    }
  }
*/
  .preview {
    @include column(center, center);
  }
  
  .edit-options {
    padding: 0 2em;
    .button {
      clear: both;
    }
  }
  .swatch {
    @include column(center, center);
    float: left;
    box-sizing: border-box;
    background-color: $darkwhite;
    width: 2em;
    height: 2em;
    border: 1px solid black;
    border-left-color: $darkwhite;
    border-top-color: $lightwhite;
    cursor: pointer;
    &.active {
      box-shadow: 0 0 2px #333 inset;
      border: none;
      background-color: $lightwhite;
    }
  }
  
</style>