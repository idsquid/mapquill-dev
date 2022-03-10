<template>
<div class="edit-page fill" v-if="thePost && thePost.cubeDataLoaded && $route.params.audioId">
      <div class="menu">
        <router-link :to="{name: 'map'}" v-slot="{route, navigate}" append custom>
          <div class="clickable button" @click="navigate">
            <v-icon name="map"></v-icon>
          </div>
        </router-link>
        <div class="clickable button" @click="saveAll" v-if="saveablePosts">save all ({{ saveablePosts }})</div>
        <router-link v-if="$route.name == 'voxels'" :to="{name: 'files'}" v-slot="{route, navigate}" append custom>
          <div class="clickable button" @click="navigate">
            BACK
          </div>
        </router-link>
      </div>
      <router-view class="view"></router-view>
  </div>
  <div v-else>
    loading cubes...
</div>

</template>

<script>
export default {
  name: 'edit',
  data() {
    return {
      loading: true,
      unsavedChanges: false,
      watchersLoaded: false,
      editableFields: ['audioTitle', 'audioDesc', 'cubeData', 'cubeScale', 'horzAdjust', 'vertAdjust', 'gotoHubId', 'postDate']
    }
  },
  async created() {
    console.log('createe')
    const post = this.$store.getters['posts/structureById'](this.$route.params.audioId)
    
    if (post) {
      this.$store.commit('quill/updateLatLng', post.audioLatLng) // for content creation
      
      if (!post.cubeDataLoaded) {
        if (this.$store.getters.useRemoteDatabase) {
          await this.$store.dispatch('getRemoteFile', {post: post, property: 'cubeData'})
        } else {
          post.cubeDataLoaded = true
        }
      }
      this.$store.commit('posts/updateActiveId', post.audioId)
    }
  },
  mounted() {
//    console.log('mountee')
    if (this.thePost) {
      this.addWatchers()
    }
  },
  updated() {
//    console.log('updatee')
    if (this.thePost) {
      this.addWatchers()
    }
  },
  computed: {
    thePost() {
      if (this.$route.params?.audioId) {
        return this.$store.getters['posts/structureById'](this.$route.params.audioId)
      } else {
          return null
      }
      
    },
    saveablePosts() {
      return this.$store.getters['posts/saveablePosts'].length
    }
  },
  methods: {
    addWatchers() {
      // should only fire once.
      if (this.thePost.watchersLoaded) {
        return false
      }
      this.thePost.watchersLoaded = true
      
      let allPosts = this.$store.getters['posts/contentById'](this.thePost.audioId)

      allPosts = allPosts.concat([this.thePost])

      this.editableFields.forEach((f) => {
        allPosts.forEach(p => {
          this.$watch(function() {
            if (p) { // thePost goes away in the map view with router set to keep-alive
              return p[f]
            } else {
              return ''
            }
          },
          function() {
            this.$set(p, 'alteredAt', Date.now())
          })
        })
      })
    },
    saveAll() {
      if (this.$store.getters.useRemoteDatabase) {
        // SAVE TO REMOTE DRIVE
        this.$store.dispatch('saveAll', null, {root: true})
      } else {
        this.$store.commit('posts/updateLocalStorage')
      } 
    }
  },
  watch: {
    thePost() {
      if (this.thePost) { // thePost goes away when activeStructure popup is closed
        this.$nextTick(() => {
          // using nextTick to skip changes associated with loading cubeData
          this.addWatchers()
        })
      }
    }
  }
}

</script>

<style lang="scss">
  .edit-page {
    display: grid;
    grid-template-columns: $mapIconWidth 1fr;
    grid-template-rows: 1fr;
    grid-template-areas: "menu view";
    font-size: 12px;
    @include phone-only {
      grid-template-columns: 1fr;
      grid-template-rows: 32px 1fr;
      grid-template-areas: "menu" "view";
    }
    .menu {
      position: fixed;
      z-index: 2;
      background-color: #333333aa;
      display: flex;
      align-content: flex-start;
      flex-wrap: wrap;
      grid-area: menu;
      width: $mapIconWidth;
      height: 100%;
      @include phone-only {
        width: 100%;
        height: auto;
      }
      .button {
        font-size: 16px;
/*        width: $mapIconWidth;*/
/*        height: $mapIconWidth;*/
      }
    }
    .view {
      grid-area: view;
    }
  }

</style>