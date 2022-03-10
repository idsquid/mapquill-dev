import AuwalkPost from '@/components/AuwalkPost.js'

const state = () => ({
  allAudioPosts: [],
  tempMedia: [],
  //
  activePostId: null,
  //
  unsavedPosts: [], // OLD
  trashedPosts: [], 
  alteredPosts: [], // OLD
  //
  newestAudioPostOLD: new AuwalkPost({}),
//  newStructureReadyToSave: false,
  newStructureReadyForMap: null,
  pleaseDeleteTheActiveMarker: false
})

const getters = {
  activeStructure(state, getters) {
    return getters.structureById(state.activePostId)
  },
  activeFilePosts(state, getters) {
    const id = getters.activeStructure
    return getters.contentById(id)
  },
  allStructures: (state) => (exclude) => {
    return state.allAudioPosts.filter(p => p.audioPostType == 'home' && p.audioId != exclude || typeof p.audioPostType == 'undefined')
  },
  allContent: (state, getters) => (mimetype) => {
    const posts = state.allAudioPosts.filter(p => {
      const useType = mimetype || p.mimeType,
            contentStructure = getters.structureById(p.audioId)
      return p.audioPostType == 'content' && p.mimeType == useType && contentStructure
    })  
     if (posts) {
      return posts.sort((a,b) => (a.createdAt < b.createdAt ? 1 : -1))
     } else {
       return null
     }
  },
  cubeDataById: (state) => (id) => {
    if (id == 'newest') {
      return state.newestAudioPost.cubeData
    }
     const home = state.allAudioPosts.filter(p => p.audioId == id && p.audioPostType == 'home')[0]  
     if (home) {
      return home.cubeData
     } else {
       console.log('call for deleted cube!')
       return []
     }
  },
  structureById: (state) => (id) => {
    if (id == 'newest') {
      return state.newestAudioPost
    }
      const home = state.allAudioPosts.filter(p => p.audioId == id && p.audioPostType == 'home')[0]  
       if (home) {
        return home
       } else {
         return null
       }
    },
  contentById: (state) => (id, mimetype, excludeType=false) => {
      if (!id) return []
      const posts = state.allAudioPosts.filter(p => {
        const useType = mimetype || p.mimeType
        
        return p.audioId == id && p.audioPostType == 'content' && p.mimeType == useType && excludeType != useType
      })  
       if (posts) {
        return posts.sort((a,b) => (a.postDate < b.postDate ? 1 : -1))
       } else {
         return null
       }
    },
  postByUid: (state) => (uid) => {
     let post = state.allAudioPosts.filter(p => p.uAudioId == uid)
     
     if (post.length) {
        return post[0]
       } else {
         return null
       }
  },
  hubsFromId: (state, getters) => (id) => {
    if (!id) return null
    const links = state.allAudioPosts.filter(p => {
            return p.audioId == id && p.audioPostType == 'content' && p.gotoHubId != null
          }) // Change this! gotoHub posts need independent garbage collection
    let posts = []
    links.forEach(p => {
      const structure = getters.structureById(p.gotoHubId)
      posts.push(structure)
    })

    if (posts) { // DRY me!
      return posts
     } else {
       return null
     }
  },
  saveablePosts: (state) => {
    return state.allAudioPosts.filter(post => {
      return (post.alteredAt) || (!post.fileKey)
    })
  }
}

const mutations = {
  updateActiveId(state, value) {
    state.activePostId = value
  },
  addAudioPosts: function(state, value) {
    // this should only fire once. test?
    
      value.forEach(function(p) {
        // check unique and push
        if (state.allAudioPosts.indexOf(p) == -1 && p.audioLatLng != null) {
          if (isNaN(p.createdAt)) {
            p.createdAt = Date.now() // an old patch
          }
          state.allAudioPosts.push(p)
        }
      })
    
    state.allAudioPosts.sort((a,b) => (a.createdAt > b.createdAt ? 1 : -1))
    
    },
  addPost(state, value) {
    /* push created audio */
    if (value.audioPostType == 'home') {
      console.log('posts addPost should not be here')
      //state.newestAudioPost = new AuwalkPost({}) // resets builder
    }
    
    if (value.audioPostType == 'home') {
      state.allAudioPosts.push(value)
      state.newStructureReadyForMap = value
    } else {
      state.allAudioPosts.push(value)
    }
  },
  addNewStructureOLD(state, id) {
    if (id != state.newestAudioPost.audioId) {
      console.log('bad addNewStructure ID!!')
      return false;
    }
    
    // else good save - !!REVISE!!
    console.log('addNewStructure')
    state.newStructureReadyForMap = new AuwalkPost(state.newestAudioPost)
    const newStructureSavedCopy = new AuwalkPost(state.newestAudioPost)
    newStructureSavedCopy.cubeDataLoaded = true
    state.allAudioPosts.push(newStructureSavedCopy)
    //
    for (var i=0; i<state.tempMedia.length; i++) {
      state.allAudioPosts.push(state.tempMedia.pop())
    }
    //
    state.newestAudioPost = new AuwalkPost({})
  },
  newStructureAdded(state) {
    state.newStructureReadyForMap = null
  },
  updateNewestPost(state, value) {
    console.log('dont be here updateNewestPost')
    const param = value[0],
          val = value[1]
    state.newestAudioPost[param] = val
  },
  updateUnsavedPostsOLD : function(state, value) {
    // checks unsaved against value array 0,1 
    state.unsavedPosts = state.unsavedPosts.filter(function(p, i) {
      return value[i] != 1 // saved is a 1
    })
  },
  emptyTrash(state) {
      state.trashedPosts = []
    },
  markPostAlteredOLD: function(state, value) {
      state.alteredPosts.push(value)
    },
    alteredPostSavedOLD: function(state, value) {
      const i = state.alteredPosts.indexOf(value)
      if (i > -1) {
        state.alteredPosts.splice(i, 1)
      } else {
        console.log('bad alteredPostSaved index: '+value)
      }
    },
    
    postAlteredOLD: function(state, post) {
      post.alteredAt = Date.now()
//      if (!post.alteredAt) {
//        const alteredAt = Date.now()
//        post.alteredAt = alteredAt
//        post.altered = true
//          
////        if (state.alteredPosts.indexOf(alteredAt == -1)) {
////          state.alteredPosts.push(alteredAt)
////        }
//      }
    },
//  newStructureReadyToSave(state, value) {
//    state.newStructureReadyToSave = value
//  },
  setDeleteCurrentPostState: function(state, value) {
      state.pleaseDeleteTheActiveMarker = value
    },
  cuePostForDeletion: function(state, value) {
    // remove temp media from state
//    const tempMediaIndex = state.tempMedia.indexOf(value)
//    if (tempMediaIndex > -1) {
//      state.tempMedia.splice(tempMediaIndex, 1)
//      return
//    }
    
    // remove committed assets
      const origPostIndex = state.allAudioPosts.indexOf(value)
      
      let post = null
      
      if (origPostIndex > -1) {
        post = state.allAudioPosts.splice(origPostIndex, 1)[0]
      }
      
      if (post) {
        state.trashedPosts.push(post)
        // now gather the children
        
        //state.activeMarker && state.activeMarker.options.audioId == post.audioId && 
        if (post.audioPostType == 'home') {
          for (var i=state.allAudioPosts.length-1; i>=0; i--) {
            var checkPost = state.allAudioPosts[i].audioId
            if (checkPost == post.audioId) {
              var p = state.allAudioPosts.splice(i, 1)[0]
              state.trashedPosts.push(p)
            }
          }
        }
        console.log('store delete complete')
        return true
      } else {
        console.log('bad cuePostForDeletion')
        return false
      }
    },
    updateLocalStorage(state) {
      // SAVE TO LOCALSTORAGE
      let localPosts = []
      state.allAudioPosts.forEach(post => {
        if (post.audioPostType == 'home') {
          localPosts.push(new AuwalkPost(post))
        }
        post.alteredAt = null
        post.fileKey = 'localStorage'
      })
      window.localStorage.setItem('allPosts', JSON.stringify(localPosts))
    }
}

const actions = {
  async loadCubeData({dispatch, rootGetters}, post) {
    if (rootGetters.useRemoteDatabase && !post.cubeDataLoaded) {
      await dispatch('getRemoteFile', {
        property: 'cubeData',
        post: post
      }, {root: true})
      return post.cubeData
    } else {
      // case of localStorage
      post.cubeDataLoaded = true
      return post.cubeData
    }
  },
  async createStructure({state, commit, dispatch, rootGetters}) {
    // CREATE POST AND ADD TO MAP
    const latLng = rootGetters['quill/latLng'],
          newPost = new AuwalkPost({
            audioLatLng: latLng,
            createdAt: Date.now(),
            lastModified: Date.now(),
            cubeData: [[1, 1, 1, 'yellow']],
            cubeDataLoaded: true
          })
    //
    state.allAudioPosts.push(newPost)
    state.newStructureReadyForMap = newPost // triggers LeafletClusterMap watcher
    
    // SAVE IT
    if (rootGetters.useRemoteDatabase) {
      // SAVE TO REMOTE DRIVE
      dispatch('saveAll', null, {root: true})
    } else {
      newPost.fileKey = 'localStorage'
      newPost.audioUrl = 'localStorage'
      commit('updateLocalStorage')
    }
  },
  async deletePost({state, commit, dispatch, rootGetters}, post) {
    if (post.audioPostType == 'home') state.pleaseDeleteTheActiveMarker = true // weird // cues leafletMap
    
    setTimeout(function() {
      // cuePostForDeletion removes post and children from allAudioPosts
      // and adds them to trashedPosts
      commit('cuePostForDeletion', post) 
      if (rootGetters.useRemoteDatabase && post.fileKey) {
        dispatch('deleteFiles', state.trashedPosts, {root: true})
        commit('emptyTrash')
      } else {
        commit('updateLocalStorage')
      }
    }, 1000) // give the map time to remove the marker
  }
}


export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}