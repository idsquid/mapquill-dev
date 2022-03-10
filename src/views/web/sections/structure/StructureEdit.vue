<template>
<div class="structure-editor">
  <h1>The Icon</h1>
  <div class="header">
    <post-form :thePost="thePost"></post-form>
    
  </div>
  <h1>The Posts </h1><post-create>Add New</post-create>
  <div class="body">
    <div class="file" v-for="(child, i) in childPosts" :key="'post-'+i">
      <post-form :thePost="child" v-if="child.audioId"></post-form>
    </div>
  </div>
</div>
</template>

<script>
import PostForm from '@/views/web/sections/post/PostForm.vue'
import PostCreate from '@/views/web/sections/post/PostCreate.vue'  
  
export default {
  name: 'structure-editor',
  components: {
    PostForm,
    PostCreate
  },
  computed: {
    thePost() {
      return this.$store.getters['posts/structureById'](this.$route.params.audioId)
    },
    childPosts() {
      return this.$store.getters['posts/contentById'](this.thePost.audioId) 
    }
  },
}

</script>

<style lang="scss">
/*  $postFormHeight: 21em;*/
  .structure-editor {
    @include column();  
    h1 {
      padding: .25em 0 0 .25em;
    }
    .header {
      display: grid;
      width: 100%;
      grid-template: none / 100%;
      grid-template-areas: 'top-post';
      padding: 0 1em 1em 0;
      .post-form {
        grid-area: top-post;
        background-color: $markerBlueFaded;
      }
    }
    .post-create {
      font-size: 18px;
      float: right;
      margin: 0em 2em 1em;
      border-bottom: 1px solid $lightblue;
    }
    .body {
      @include row();
      flex-wrap: wrap;
      grid-area: body;
      .post-form:last-child {
        border: none;
      }
    }
    
    .file {
      width: 100%;
/*      max-width: 96vw;*/
/*      min-height: $mapIconHeight * 3;*/
      overflow: hidden;
      background: #fafafa;
/*      border: 3px solid $darkblack;*/
/*      border-top: none;*/
/*      border-right: none;*/
      box-sizing: border-box;
/*      border-radius: 2em;*/
/*      border-top-right-radius: 0;*/
      overflow: hidden;
      margin: 1em 0;
      @include tablet-landscape {
        width: calc(50% - 2em);
      }
    }
    .new-file {
      background: #ffffff33;
      border: 2px dashed $medgrey;
      @include column(center, center);
    }
    .post-form {
      display: grid;
      width: 100%;
      grid-template: 3em 15em / 3em 4fr 1fr $mapIconHeight * .8;
      grid-template-areas: 'icon title date date' '. preview preview sidebar';
      padding: 1em;
      padding-left: 0;
      padding-bottom: 0;
      box-sizing: border-box;
      border-bottom: 1px solid #333;
    }
    .post-type {
      display: grid;
      grid-area: icon;
      border-radius: 99em;
      width: 60%; height: 60%;
      margin: 20%;
      &.a-structure {
        background: $lightgreen;
      }
      &.a-text {
        background: $medwhite;
      }
      &.a-audio {
        background: $lightblack;
      }
      &.a-image {
        background: $darkred;
      }
    }
    .audio-post {
      align-self: flex-start;
    }
    .post-title {
      display: grid;
      grid-area: title;
      width: 100%;
      height: 100%;
      input {
        padding-left: 1em;
      }
    }
    .mx-datepicker input {
      border: none;
      margin-right: 2em;
    }
    .mx-icon-calendar, .mx-icon-clear {
      right: 16px;
    }
    .file-preview {
      display: flex;
      justify-content: center;
      align-items: center;
      grid-area: preview;
      .image-post img {
        max-height: 100%;
      }
/*
      .voxel-view {
        @include mapIconRound;
        position: relative;
        top: 0; left: 0;
        margin: 0;
        font-size: 2em;
        .scene {
          overflow: hidden;
          border-radius: 99em;
        }
      }
*/
      .button {
        align-self: flex-end;
        margin: 1em 0;
      }
    }
    .created-at {
      @include row(center, center);
      background-color: $medwhite;
/*      display: grid;*/
      grid-area: date;
    }
    .post-menu {
      @include column(flex-end, center);
      display: flex;
      grid-area: sidebar;
/*      background-color: $medblack;*/
      padding: 12px 0px;
      box-sizing: border-box;
      border-left: 3px double white;
      font-size: 12px;
      .button {
        align-self: stretch;
        background-color: $darkblue;
        color: $medwhite;
        border: 1px solid $medblack;
        &.disabled {
          background-color: $medgrey
        }
      }
      .a-link {
        color: $lightred;
        text-decoration: underline;
        margin: 5px 0;
      }
    }
  }
  
  
</style>