<template>
  <div class="overlay">
    <div class="content">
      <slot>nothing here.</slot>
    </div>
    <div class="overlay active click-close" @click="$emit('closed')"></div>
  </div>
</template>

<script>
export default {
  name: 'auwalk-overlay',
  data() {
    return {
      
    }
  }
}

</script>

<style lang="scss">
  .overlay {
    @include column(center, center);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #000000aa;
    flex-wrap: wrap;
    &.active {
      z-index: 500;
    }
    &.click-close {
      background-color: transparent;
      z-index: -1;
    }
  }
  .overlay .content {
    width: 50%;
  }

</style>