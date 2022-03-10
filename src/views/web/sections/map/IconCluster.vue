<template>
<div class="cluster-pie cluster-cube">
<!--
  <div class="post-previews row">
    <div class="post-preview column centered" v-for="(post, i) in posts" :key="i" :style="postStyle(post)">
      <v-icon name="music" v-if="post.mimeType == 'audio'" scale="2" color="#333"></v-icon>
    </div>
  </div>
-->
  <voxel-cluster v-if="useVoxelCluster" :posts="posts" :store="store"></voxel-cluster>
  <content-flower :posts="posts" :store="store"></content-flower>
  <div class="cluster-info">
    {{ clusterChildren.length }}
  </div>
</div>
</template>

<script>
import Vue from 'vue'
import VoxelCluster from '@/views/web/sections/voxels/VoxelCluster.vue' 
import ContentFlower from '@/views/components/ContentFlower.vue' 
  
export default Vue.extend({
  name: 'cluster-icon',
  props: ['cluster', 'store'],
  data() {
    return {
      useVoxelCluster: true
    }
  },
  components: {
    ContentFlower,
    VoxelCluster
  },
  created() {
    for (const p of this.posts) {
      if (p.audioPostType == 'home' && !p.cubeDataLoaded) {
        this.store.dispatch('posts/loadCubeData', p)
      }
    }
  },
  computed: {
    clusterChildren: function() {
      return this.cluster.getAllChildMarkers()
    },
    posts() {
      //
        let allContent = []
        let payload = []
        const contentLimit = 16
        const source = this.clusterChildren 
        
        for (var i=0; i<source.length; i++) {
          const marker = source[i],
                content = this.store.getters['posts/contentById'](marker.options.audioId),
                theStructure = this.store.getters['posts/structureById'](marker.options.audioId)
          
          if (allContent.length < contentLimit) {
            allContent = allContent.concat(content)
            if (!content.length || theStructure.cubeScale <= 720) {
              allContent = allContent.concat(theStructure)
            }
          }
        }
      
        // sorting here is necessary, yes.
        allContent.sort((a,b) => {
          return a.postDate > b.postDate ? 1 : -1 
        })
        
        // push to payload
        for (var j = 0; j < allContent.length; j++) {
          payload.push(allContent[j])
        }
      
      // send Something
      while (payload.length < 2) {
        payload.push({})
      }
      
        return payload
    }
  },
  methods: {
    postStyle(post) {
      if (post.mimeType == 'image') {
        return 'background-image: url(' + post.audioUrl + ')'
      } else {
        return ''
      }
    }
  }
})

</script>

<style lang="scss">
$pieSize: 8em;
  
.cluster-pie {
    position: absolute;
  z-index: -2;
    width: $pieSize;
    height: $pieSize;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: $darkorange;
  border: 2px solid $darkredFaded;  
  box-shadow: -4px 4px 4px #333;
/*  border-radius: 5em 2em 5em 5em;*/
  border-radius: 5px;
  overflow: hidden;
    color: white;
    top: -$pieSize/2;
    left: -$pieSize/2;
  }
  .cluster-info {
/*    display: none;*/
/*    @include row(center, center);*/
/*    width: 26%;*/
    background-color: $darkblueFaded;
    position: absolute;
    bottom: 0em;
    left: 0em;
    z-index: 1;
/*    border-radius: 1em .5em 1em 0;*/
    color: $lightwhite;
    font-weight: bold;
    text-shadow: -2px 2px 4px black;
/*    margin-bottom: 2em;*/
/*    border: 3px solid #333333aa;*/
/*    border-top: none;*/
/*    border-right: none;*/
    font-size: 12px;
/*    border: 1px solid white;*/
    margin: 0 0 -1px -1px;
/*    opacity: .7;*/
    padding: .4em .5em;
    border-radius: 0;
    .fa-icon {
      color: $darkpurple;
      margin: 0px 0 8px 4px;
    }
  }
  .at-max-zoom .cluster-pie .zoom-button {
    display: flex;
  }

</style>