<template>
  <div class="map-icon-overlay" v-if="thePost && useOverlay">
<!--
    <div class="info-bubble images not-in-popup" v-if="imagePosts">
      <div v-for="(post, i) in imagePosts" :key="'img-'+i" class="img-thumbnail" :style="i < 2 ? imageBackground(post.audioUrl) : ''">
      </div>
    </div>
    
    <div class="info-bubble audios not-in-popup" v-if="audioPosts">
      <v-icon name="music" v-for="(post, j) in audioPosts" :key="'au-'+j"></v-icon>
    </div>
-->
    
    <div class="info-bubble all-posts not-in-popup" v-if="posts">
      <div class="thumb-container" v-for="(post, i) in posts" :key="'post-thumb-'+i">
        <div v-if="post.mimeType == 'image'" class="img-thumbnail" :style="imageBackground(post.audioUrl)"></div>
        <v-icon v-if="post.mimeType == 'audio'" name="music"></v-icon>
        <v-icon v-if="post.mimeType == 'text'" name="book"></v-icon>
      </div>
    </div>
    
<!--
    <div class="info-bubble edit-link in-popup not-at-max" >
        <v-icon name="search-plus" @click="zoomIn($event)" class="clickable button"></v-icon>
    </div>
-->
    <div class="info-bubble edit-link in-popup" >
        <v-icon name="edit" @click="gotoEdit($event)" class="clickable button"></v-icon>
    </div>
    
    <div class="title-banner not-in-popup" v-if="thePost.audioTitle">
      <div class="title">{{ thePost.audioTitle }}</div>
      <div class="controls">
        <div class="info">{{ imagePosts.length }} images</div>
        <div class="info">{{ audioPosts.length }} audio</div>
        <div class="info">{{ textPosts.length }} stories</div>
      </div>
    </div>
    
<!--    <content-tower v-if="includeBubbles" :posts="posts"></content-tower>-->
    
  </div>
  <div v-else>
    <!-- nothing here -->
  </div>
</template>

<script>
import Vue from 'vue'
//import ContentTower from '@/views/components/ContentTower.vue'  
  
export default Vue.extend({
  name: 'map-icon-overlay',
  props: {
    store: {
      type: Object,
      default: null
    },
    id: {
      type: String,
      default: null
    }
  },
  components: {
//    'content-tower': ContentTower
  },
  data() {
    return {
      useOverlay: true,
      includeBubbles: true
    }
  },
  computed: {
    thePost() {
      return this.store.getters['posts/structureById'](this.id)
    },
    posts() {
      return this.store.getters['posts/contentById'](this.id)
    },
//    includeBubbles() {
//      return this.thePost.cubeData.filter(c => c[3].indexOf('picture-cube') != -1).length == 0
//    },
    userCanEdit() {
      return this.store.getters.userCanEdit(this.id)
    },
    imagePosts() {
      return this.store.getters['posts/contentById'](this.id, 'image')
    },
    audioPosts() {
      return this.store.getters['posts/contentById'](this.id, 'audio')
    },
    textPosts() {
      return this.store.getters['posts/contentById'](this.id, 'text')
    },
    latestPost() {
      return this.posts[0]
    },
    latestType() {
      return this.latestPost?.mimeType
    }
  },
  methods: {
    gotoEdit(e) {
      if (e) e.stopPropagation()
      this.store.dispatch('user/requestsEdit', this.thePost.audioId)
    },
    zoomIn(e) {
      if (e) e.stopPropagation()
      const latLng = this.thePost.audioLatLng,
            map = this.thePost.marker._map,
            zoom = map.getMaxZoom()
      map.setView(latLng, zoom)
    },
    imageBackground(url) {
      return 'background-image: url(' + url + ');'
    },
    choosePostAction(name, e) {
      if (e) e.stopPropagation()
      Vue.set(this.thePost, 'activeAction', name)
      if (name == 'edit') {
        this.openEditor()
      }
    },
    stopProp(e) {
      if (e) e.stopPropagation()
    }
  }
})

</script>

<style lang="scss">
  @import url('https://fonts.googleapis.com/css2?family=Cantarell&display=swap');
  
  $item-area: 2em;
  
  .in-popup {
    opacity: 0;
    &.info-bubble {
      @include on-circle($item-count: 200, $circle-size: $iconBig, $item-size: $item-area, $rot: 90, $dir: -1); 
    }
  }
  .popup-open .in-popup {
    opacity: 1;
  }
  .at-max-zoom .not-at-max {
    display: none;
  }
  .popup-open .not-in-popup {
    opacity: 0;
    .info-bubble {
      @include on-circle($item-count: 200, $circle-size: $iconBig, $item-size: $item-area, $rot: 90, $dir: -1); 
    }
  }
  
  .map-icon-overlay {
    @include column(flex-end, center);
    position: absolute;
    width: $iconBig;
    height: $iconBig;
/*    left: -($iconBig - $mapIconWidth) / 2;*/
/*    top: -($iconBig - $mapIconHeight) / 2;*/
    z-index: 1;
/*    overflow: hidden;*/
  }
  
  
.info-bubble {
  .thumb-container {
    @include column(center, center);
    width: $item-area;
    height: $item-area;
    border: 1px solid #333;
    background-color: $medwhite;
    box-sizing: border-box;
    border-radius: 99em;
    overflow: hidden;
  }
  .img-thumbnail {
    width: 100%;
    height: 100%;
  }
} 
.info-bubble.all-posts {
  @include on-circle($item-count: 30, $circle-size: $iconBig, $item-size: $item-area, $rot: 140, $dir: 1); 
  
}
.info-bubble.audios {
  @include on-circle($item-count: 50, $circle-size: $iconBig, $item-size: $item-area, $rot: 135, $dir: 1); 
  .fa-icon {
    background: white;
    width: $item-area - 15;
    height: $item-area - 15;
    padding: 5px;
  }
}
  
  .edit-link {
    top: -0em;
    font-size: 1em;
  }  
.popup-open .edit-link {
  @include on-circle($item-count: 50, $circle-size: $iconBig + 5em, $item-size: $item-area, $rot: -28, $dir: 1); 
    z-index: 2;
    .fa-icon {
    background-color: $lightblue;
    color: white;
/*    padding: .5em;*/
    border: 1px solid $lightblack;
      box-shadow: none;
      border-radius: 50%;
    }
}
  
/*  TITLE BANNER*/
/*  LAYOUT*/
  .title-banner {
    @include row(center, center);
    transition: all .5s;
/*    margin-bottom: 3em;*/
    position: absolute;
    bottom: 0;
  }
  .popup-open .title-banner {
/*    margin-top: -8em;*/
  }
/*  LOOK*/
  .title-banner .title {
    font-family: 'Cantarell', sans-serif;
/*    flex-basis: 100%;*/
    background: #ffffffcc;
/*    transform: skewY(-20deg);*/
    padding: 0 1.5em;
    box-sizing: border-box;
    text-transform: uppercase;
    border: 2px solid $medblack;
    opacity: 1;
/*    transition: opacity 1s;*/
    border-radius: 0 2em;
    justify-content: center;
    text-align: center;
    font-weight: bold;
    overflow: hidden;
    position: absolute;
    top: -3em;
    left: 70%;
  }
  .title-banner .controls {
    display: none;
    flex-basis: 8em;
    
  }
  .title-banner .info {
    display: none;
  }
  
  // CONTENT TOWER
  $content-size: 3em;
  .map-icon-overlay .content-tower {
    font-size: $content-size;
    justify-content: center;
    margin: 0;
    .my-isometric-container {
      transform: none;
    }
    .tower-post {
      position: absolute;
      bottom: -$content-size / 3;
      right : -$content-size / 4;
      box-shadow: none;
/*      background-color: white;*/
      border: 1px solid blue;
      @for $i from 1 through 10 {
        &:nth-of-type(#{$i}) {
          $u: $i - 1;
          transform: none; //translateX($u * .15em) translateY($u * -.25em) scale(1 - $u * .2);
          z-index: -$i;
        }
      }
    }
/*
    .tower-post-content {
      font-size: .5em;
    }
*/
  }
  .popup-open .content-tower {
    display: none;
  }
  
  
/*  STATES!!*/
/*  STATE AT MAX ZOOM*/
  .disabled .at-max-zoom .map-icon-overlay {
    overflow: visible;
    justify-content: flex-end;
    align-items: flex-start;
    .info-bubble.audios, .info-bubble.edit-link {display: none;}

    .title-banner {
/*      grid-template-columns: 70% 1fr;*/
      border: 2px solid $medblack;
      background: $lightwhite;
/*      border-radius: 0 0 1em 1em;*/
    }
    .title-banner .title {
/*      background-color: #ffffff22;*/
      transform: skewY(0deg);
      height: auto;
      border-radius: 0;
      border: none;
    }
    .title-banner .controls {
      @include column(center, flex-start);
      font-size: 1em;
      color: black;
      background-color: white;
    }
    .title-banner .info {
      display: block;
      padding: 0 .25em;
      margin-bottom: 3px;
    }
  }
  

  
  
  
</style>