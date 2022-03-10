<template>
<div class="addpost-marker" @click="preventEdit($event)" :class="quillClass">
  <v-icon name="mouse-pointer" scale="2"></v-icon>
  <div class="info">
    <div class="info-bubble"></div>
    <div class="info-bubble">
      <span v-if="theSelected">This spot's taken</span>
    </div>
  </div>
</div>


</template>

<script>
import Vue from 'vue'
  
export default Vue.extend({
  name: 'addpost-icon',
  props: ['store'],
  computed: {
    theSelected() {
      return this.store.getters['quill/selectedStructure']
    },
    quillClass() {
      return {
        'no-access': this.theSelected != null
      }
    }
  },
  methods: {
    preventEdit(e) {
      if (e) {
        if (this.theSelected) {
          // prevent popups for certain users
          e.stopPropagation()
        }
      }
    }
  }
})

</script>

<style lang="scss">
  .addpost-marker {
    @include mapIconRound;
    border-width: 5px;
    background-color: transparent;
    box-shadow: 0px 0px 30px $medgreen inset;
    .fa-icon, .info {
      position: absolute;
      z-index: 0;
    }
    &.no-access {
      background-color: $medred;
      box-shadow: none;
    }
    .fa-icon {
      color: white;
      filter: drop-shadow(3px 5px 2px rgb(0 0 0 / 0.4));
      stroke: #646464;
      stroke-width: .5em;
      bottom: -30%;
      right: -10%;
    }
    .info {
      width: 240%;
      top: 25%;
      left: -70%;
      text-align: center;
      font-size: 18px;
      font-weight: bold;
      color: white;
      z-index: 1;
      text-shadow: 1px 2px 2px black;
    }
  }

</style>