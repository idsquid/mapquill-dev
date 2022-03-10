<template>
  <div class="user-dropdown">
    <button class="button" :class="{'dropdown-view': dropdownOpen}" @click="toggle">
      <v-icon :name="dropdownOpen ? 'times' : 'bars'"></v-icon>
    </button>
    <v-icon name="circle" color="#ef5b72" class="number-tip" v-if="(unsavedPosts || trashedPosts || alteredPosts) && !dropdownOpen"></v-icon>
    <div class="user-dialog" v-if="dropdownOpen">
      <div class="small row">{{ headlineMsg }}</div>
      
<!--      SAVE-->
      <div class="row" v-if="alteredPosts"><v-icon name="circle" color="#ef5b72"></v-icon><a @click="reviseAll">Save your {{ alteredPosts }} change(s)</a></div>
      
<!--      ADDPOST-->
      <div class="row"><v-icon name="building"></v-icon><a @click="$emit('toggleAddPost')">{{ appState == 'addpost-view' ? 'Close Builder' : 'Build a New Structure' }}</a></div>
      
<!--      LIST VIEW-->
      <div class="row"><v-icon name="list"></v-icon><router-link :to="{name: 'list', params: {env: $route.params.env}}">Goto List View</router-link></div>
      
<!--      OPEN EDITOR-->
      <div class="row"><v-icon name="edit"></v-icon><a @click="$store.commit('setAppState', 'editor-view')">Edit Active Structure</a></div>
      
<!--      COOKIES-->
      <div class="row"><v-icon name="cookie-bite"></v-icon><a @click="deleteCookies">Reset View</a></div>
      
<!--      COMMUNiTY STRUCTURIFY-->
      <div class="row"><v-icon name="hands-helping"></v-icon><a @click="saveCommunityStructure">Cloneify Active Structure</a></div>
    </div>
    
    <s3-frame ref="s3Frame" :store="store"><div slot-scope="{}"></div></s3-frame>
  </div>
</template>

<script>
import S3Frame from '@/services/S3Frame.vue' 
import { hostUtils } from '@/mixins/hostUtils.js'
  
export default {
  name: 'user-dropdown-view',
  props: ['store'],
  mixins: [hostUtils],
  components: {
    's3-frame': S3Frame
  },
  data() {
    return {
      dropdownOpen: false
    }
  },
  computed: {
    appState() {
      return this.store.state.appState
    },
    headlineMsg() {
      return this.store.state.loadingMsg || 'Welcome alpha-tester! You can:'
    },
     unsavedPosts: function() {
      const p = this.$store.state.posts.unsavedPosts
      if (!p.length) {
        return null
      } else {
        return p.length
      }
    },
    trashedPosts: function() {
      const p = this.$store.state.posts.trashedPosts
      if (!p.length) {
        return null
      } else {
        return p.length
      }
    },
    alteredPosts: function() {
      const p = this.$store.getters['posts/saveablePosts']
      if (!p.length) {
        return null
      } else {
        return p.length
      }
    }
  },
  watch: {
    appState(s) {
      if (s != 'user-dropdown-view') {
        this.dropdownOpen = false
      }
    }
  },
  methods: {
    toggle() {
      if (this.dropdownOpen) {
        this.dropdownOpen = false
        if (this.appState == 'user-dropdown-view') {
          this.store.commit('setAppState', 'map-view')
        }
      } else {
        this.dropdownOpen = true
        if (this.appState == 'map-view') {
          this.store.commit('setAppState', 'user-dropdown-view')
        }
      }
    },
    saveAll: function() {
      this.$refs.s3Frame.saveAll()
    },
    deleteAll: function() {
      this.$refs.s3Frame.deleteAll()
    },
    reviseAll: function() {
      //this.$refs.s3Frame.reviseAll()
      this.$refs.s3Frame.saveAll()
    },
    deleteCookies() {
      this.deleteAllCookies()
      this.$router.push({params: {}})
      location.reload()
    },
    saveCommunityStructure() {
      const activeStructure = this.store.getters.activeStructure
      
      this.store.commit('community/addStructure', activeStructure)
      this.$refs.s3Frame.saveCommunityCubeData()
    }
  }
}

</script>

<style lang="scss">
  .user-dropdown {
    margin: .75em;
    margin-bottom: 0;
    button {
      min-width: 4em;
      height: 4em;
      font-size: 13.3px; // why?
      /* margin-top: 1em; */
      border: 1px solid rgba(0,0,0,.5);
      box-shadow: none;
      background: white;
      &.dropdown-view {
        border-radius: 2em 2em 0 0;
      }
    }
    .number-tip {
      position: absolute;
      top: 1em;
      right: 1em;
    }
  }
  .user-dialog {
    @include column(space-evenly);
    position: absolute;
    background: #ffffff;
    top: 4em;
    padding: 1em;
    margin-left: 1em;
    min-width: 13em;
    border-radius: 2em 0 2em 2em;
    left: -4px;
    border: 1px solid rgba(0,0,0,.5);
    border-top: navajowhite;
    .row {
      margin: 1em 0;
      display: block;
    }
    .fa-icon {margin-right: 1em;}
  }
  
</style>