<template>
  <div id="app">
    <keep-alive> <!-- https://itnext.io/yes-this-is-how-to-cache-pages-by-url-with-vue-vue-router-and-keep-alive-component-697ed76896e8 -->
      <!--  :key="$route.fullPath" -->
      <router-view v-if="!loading"></router-view>
      <div v-else class="loading-screen">loading...</div>
    </keep-alive>
  </div>
</template>

<script>
  export default {
    name: 'auwalk-vue',
    data: function() {
      return {
        loading: true
      }
    },
    async created() {
      console.log('App Created')

      // DOWNLOAD POSTS
      if (this.$store.getters.useRemoteDatabase) {
        const posts = await this.$store.dispatch('getRemotePosts')
        this.$store.commit('posts/addAudioPosts', posts)
        console.log('posts fetched by App created')
      } else {
        const localStorage = window.localStorage,
              localPosts = localStorage?.getItem('allPosts')
        if (localPosts) {
          this.$store.commit('posts/addAudioPosts', JSON.parse(localPosts))
        }
      }
      
      // REMEMBER USER's first request 
      this.$store.commit('user/setInitialQuery') // tells the user module to store the initial url params
      
      this.loading = false
    },
    computed: {
      appState: function() {
//        const s = this.$store.state.appState
//        let e = this.$route.params['env']
//        
//        if (e == undefined) e = 'timeline'
//        
//        return s + ' ' + e
        
        return ''
        
      }
    },
    watch: {
      
    },
    methods: {
//      async downloadCommunityStructureList() {
//        const structures = await this.$store.dispatch('getRemotePosts', 'design/'),
//              structureList = []
//
//        structures.forEach(s => {
//          if (s.audioPostType == 'home' && s.audioTitle) {
//            let listItem = {
//              title: s.audioTitle,
//              url: s.audioUrl
//            }
//            structureList.push(listItem)
//          } 
//        })
//        
//        // expect [{title: url},]
//        this.$store.commit('community/setStructureList',structureList)
//      }
    
    }
  }
</script>

<style lang="scss">
  @import "@/css/boilerplate.scss";
</style>
