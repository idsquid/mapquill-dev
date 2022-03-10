<template>
  <div class="sidebar" :class="useClass">
    <slot></slot>
  </div>
</template>

<script>

export default {
  name: 'sidebar',
  props: {
    position: {
      type: String,
      default: 'bottom'
    },
    addClass: {
      type: String,
      default: ''
    }
  },
  computed: {
    useClass() {
      return this.position + ' ' + this.addClass
    }
  }
}
  
</script>

<style lang="scss">
  .sidebar {
    display: flex;
    position: absolute;
    z-index: 401;
    /* top and bottom depend on parent align-items = center */
    &.top {
      top: 0;
      margin: 0;
      width: 100%;
/*      position: relative;*/
    }
     &.bottom {
      bottom: 0;
      width: 100%;
/*      padding: 3px 2px 17px;*/
      box-sizing: border-box;
      background-color: #00000066;
    }
     &.left {
/*
      top: 0;
      bottom: 0;
*/
      left: 0;
/*
       flex-direction: column;
       justify-content: center;
*/
/*      margin: auto;*/
    }
     &.right {
      top: 0;
      bottom: 0;
      right: 0;
       max-height: 70vh;
       flex-direction: column;
       justify-content: center;
      margin: auto;
    }
    &.topleft {
      top: 0;
      left: 0;
    }
    &.topright {
      top: 0;
      right: 0;
    }
    &.bottomright {
      right: 0;
      bottom: 0;
    }
    &.bottomleft {
      left: 0;
      bottom: 0;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: flex-start;
      margin: 0 0 20px 5px;
      width: 18em;
    }
  }
  
  .sidebar {
    .clickable.button {
/*      width: 2em;*/
    }
  }
  

</style>