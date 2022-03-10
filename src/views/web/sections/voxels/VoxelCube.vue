<template>
<div :class="'voxel-cube ' + propClass" :style="cubeStyle">
    <div v-for="i in faces" class="cube__face" :key="'face-' + i" @click.exact="emitSideClicked(i)">
      <div class="content" :style="faceStyle(i)"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'voxel-cube',
//  props: ['environment', 'propClass', 'x', 'y', 'z'],
  props: {
    environment: {
      type: String,
      default: 'live'
    },
    propClass: {
      type: String,
      default: 'got-no-class'
    },
    faceContent: {
      type: Array,
      default() {
        return []
      }
    },
    x: Number,
    y: Number,
    z: Number
  },
  data() {
    return {
      size: 1
    }
  },
  computed: {
    cubeStyle() {
      let tx = -(this.x - 1) * this.size 
      let tz = (this.y - 1) * this.size // fix this?
      let ty = -(this.z - 1) * this.size 
      
      let transform = 'transform: translateX('+tx+'em) translateY('+ty+'em) translateZ('+tz+'em);'
      
      return 'font-size: 1em;'+transform
    },
    faces() {
      let numFaces = 3
      switch (this.environment) {
          case 'live':
            numFaces = 3
            break;
          case 'edit':
            numFaces = 6
            break;
          case 'floor':
            numFaces = 1
            break;
        default:
          numFaces = 6
      }
      return numFaces
    }
  },
  methods: {
    faceStyle(i) {
      const imgPost = this.faceContent[i-1]
      if (imgPost && imgPost.mimeType == 'image') {
        return 'background-image: url(' + imgPost.audioUrl + ');'
      }
    },
    emitSideClicked(i) {
      const s = this.environment == 'floor' ? 2 : i - 1
      this.$emit('sideClicked', {side: s, x: this.x, y: this.y, z: this.z})
    }
  }
}
</script>

<style lang="scss">
/*
$cube-edge: 1em;
$half-edge: .5em;
*/

.voxel-cube {
  position: absolute;
  top: 50%; left: 50%;
  transform-style: preserve-3d;
  font-size: 1em;
  font: 12px/ #{$cube-edge} cookie, cursive;
  text-align: center;
  
  .cube__face {
    position: absolute;
    margin: -.5*$cube-edge;
    width: $cube-edge; height: $cube-edge;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    background-color: #33333333;
    background-position: center center;
    background-size: cover;
    background-repeat: no-repeat;
    backface-visibility: visible;
    border: 1px solid #00000055;
    box-sizing: border-box;
    img {
      width: 100%;
    }
  }
  .cube__face .content {
    font-size: 12px;
    width: 100%;
    height: 100%;
    background-size: cover;
  }
  
.cube__face:nth-child(3), &.floor-cube .cube__face:nth-child(1) {
  transform: rotateX( 90deg) translateZ(.5*$cube-edge);
}
.cube__face:nth-child(2) {
  transform: rotateY(270deg) translateZ(.5*$cube-edge);
}  
.cube__face:nth-child(1) {
  transform: rotateY(  0deg) translateZ(.5*$cube-edge);
}
.cube__face:nth-child(4) {
  transform: rotateY(180deg) translateZ(.5*$cube-edge);
    background: green;
}
.cube__face:nth-child(5) {
  transform: rotateY( 90deg) translateZ(.5*$cube-edge);
  background-color: #1cefff;
}
.cube__face:nth-child(6) {
  transform: rotateX(90deg) translateZ(-.5*$cube-edge) rotateZ(-180deg) rotateY(180deg);
  background-color: red;
}
    
  }
  
  
/*  COLORS*/
  .voxel-cube {
    /* from https://uigradients.com/ */
    &.red {
    .cube__face:nth-child(1) {
      background-color: $lightred; //#ED213A;
    }
    .cube__face:nth-child(2) {
      background-color: $darkred; //#93291E;
    }
    .cube__face:nth-child(3) {
      background-color: $medred; //#bf272c;
    }
    }
    &.green {
    .cube__face:nth-child(1) {
      background-color: $lightgreen; //#a8e063;
    }
    .cube__face:nth-child(2) {
      background-color: $darkgreen; //#56ab2f ;
    }
    .cube__face:nth-child(3) {
      background-color: $medgreen; //#80c64a;
    }
    }
    &.blue {
    .cube__face:nth-child(1) {
      background-color: $lightblue; //#00B4DB;
    }
    .cube__face:nth-child(2) {
      background-color: $darkblue; //#0083B0 ;
    }
    .cube__face:nth-child(3) {
      background-color: $medblue; //#009bc5;
    }  
    }
    &.yellow {
    .cube__face:nth-child(1) {
      background-color: $lightyellow; //#F3F9A7;
    }
    .cube__face:nth-child(2) {
      background-color: $darkyellow; //#CAC531;
    }
    .cube__face:nth-child(3) {
      background-color: $medyellow; //#dfdf71;
    }  
    }
    &.orange {
    .cube__face:nth-child(1) {
      background-color: $lightorange; //#FFD200;
    }
    .cube__face:nth-child(2) {
      background-color: $darkorange; //#F7971E;
    }
    .cube__face:nth-child(3) {
      background-color: $medorange; //#fbb513;
    }  
    }
    &.purple {
    .cube__face:nth-child(1) {
      background-color: $lightpurple; //#ffc0cb;
    }
    .cube__face:nth-child(2) {
      background-color: $darkpurple; //#800080;
    }
    .cube__face:nth-child(3) {
      background-color: $medpurple; //#c267a7;
    }  
    }
    &.white {
    .cube__face:nth-child(1) {
      background-color: $lightwhite; //#ffffff;
    }
    .cube__face:nth-child(2) {
      background-color: $darkwhite; //#ECE9E6;
    }
    .cube__face:nth-child(3) {
      background-color: $medwhite; //#f5f4f3;
    }  
    }
    &.brown {
    .cube__face:nth-child(1) {
      background-color: $lightbrown; //#B79891;
    }
    .cube__face:nth-child(2) {
      background-color: $darkbrown; //#94716B;
    }
    .cube__face:nth-child(3) {
      background-color: $medbrown; //#a5857d;
    }  
    }
    &.grey {
    .cube__face:nth-child(1) {
      background-color: $lightgrey; //#d7d2cc;
    }
    .cube__face:nth-child(2) {
      background-color: $darkgrey; //#304352;
    }
    .cube__face:nth-child(3) {
      background-color: $medgrey; //#858b90;
    }  
    }
    &.black {
    .cube__face:nth-child(1) {
      background-color: $lightblack; //#2C5364;
    }
    .cube__face:nth-child(2) {
      background-color: $darkblack; //#0F2027;
    }
    .cube__face:nth-child(3) {
      background-color: $medblack; //#203A43;
    }  
    }
    
  }
</style>