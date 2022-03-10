/*
var
appState : app.vue, 

commits
addAudioPosts: app.vue, 

*/

import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import user from './modules/user.js'
import community from './modules/community.js'
import quill from './modules/quill.js'
import posts from './modules/posts.js'
import audio from './modules/audio.js'
import remotePosts from './modules/remotePosts.js'

export default new Vuex.Store({
  modules: {
    user,
    community,
    quill,
    posts,
    audio,
    remotePosts
  },
  state: {
    appState: 'map-view',
    defaultState: 'map-view',
    mapType: 'map', // timeline an option
    loading: false,
    activeLoading: [],
    
    remoteFileKeys: [],
    homeLatLng: {lat:13.3034502,lng:-34.4532591}, // middle of ocean
    homeLocation: 'Middle of Nowhere',
    homeZoom: 14,
    mapMaxZoom: 15,
    mapMinZoom: 2,
    //
    
    audioLatLng: null,
    audioLocation: null,
    
    //
    userName: null,
    userRole: 'user',
    userEnv: null,
    userLatLng: null,
    userZoom: null,
    //
    
    userMinecraftStateStrOLD: 'view',
    //
    userSearchLatLng: {},
    userSearchLocation: null,
    userLocation: null,
    activeCluster: null,
    activeMarker: null,
    quillSelectedId: null,
    structureHistory: [],
    //highlightedClusterId: 'undefined',
    //loading: false,
    loadingMsg: '',
    hasMic: false,
    allowedMic: false,
    allowedGPS: false
  },
  mutations: {
    setAppState: function(state,value) {
      if (value == 'default') {
        state.appState = state.defaultState
      } else {
        state.appState = value
      }
    },
    setMapType(state, type) {
      state.mapType = type
    },
    setUserRole(state, role) {
      state.userRole = role
    },
    setUserName(state, n) {
      state.userName = n
      document.title = 'Welcome '+n
      console.log('you username is now '+n)
    },
    setUserEnv(state, env) {
      state.userEnv = env
    },
    beginSave: (state, arrayOfIds) => {
      state.activeLoading = state.activeLoading.concat(arrayOfIds)
    },
    saveProgressed: (state, id) => {
      // refresh local state
      const i = state.activeLoading.indexOf(id)
      if (i != -1) {
        state.activeLoading.splice(i, 1)
//        if (state.activeLoading.length == 0) {
//          // alert posts module
//          if (id == state.posts.newestAudioPost.audioId) {
//            commit('posts/addNewStructure', id)
//          }
//        }
      } else {
        console.log('bad finishedUpload ID!')
      }
    },
    setLoadingState: function(state, value) {
      state.loadingMsg = value
    },
    setMinMaxZoom: function(state, value) {
      state.mapMinZoom = value[0]
      state.mapMaxZoom = value[1]
    },
    
    updateAudioLatLngOLD: function(state, value) {
        state.audioLatLng = value
      },
      updateAudioLocation: function(state, value) {
        // this can go i think
        state.audioLocation = value
      },
    
    updateMinecraftStateOLD: function(state, value) {
      state.userMinecraftStateStr = value
    },
    //
    
    updateUserSearchLatLng: function(state, value) {
      state.userSearchLatLng = value
    },
    updateUserSearchLocation: function(state, value) {
      state.userSearchLocation = value
    },
    updateUserLocation: function(state, value) {
      state.userLocation = value
    },
    updateUserLatLng: function(state, value) {
      state.userLatLng = value
    },
    updateUserZoom: function(state, value) {
      state.userZoom = value
    },
    updateActiveClusterOLD: function(state, value) {
      state.activeCluster = value
    },
    updateActiveMarker: function(state, value) {
      state.activeMarker = value
      // add navigability
      if (value && value.options) { // change this!
        const audioId = value.options.audioId,
              prevAudioId = state.structureHistory[0]
        if (audioId && audioId != prevAudioId) {
          state.structureHistory.unshift(audioId)
        }
      }
    },
    updateQuillSelected: function(state,value) {  
      // value is an ID
      state.quillSelectedId = value
      
    },
    stepHistoryBack(state) {
      state.structureHistory.shift()
    }

  },
  actions: {
    commitToPrevMarker(context) {
      if (context.state.structureHistory.length > 1) {
        context.commit("stepHistoryBack")
        return context.state.structureHistory[0]
      } else {
        return null
      }
    }
  },
  getters: {
    loading: state => {
      if (state.activeLoading.length) {
        return true
      } else {
        return false
      }
    },
    loadingStatus: state => {
      const n = state.activeLoading.length + 1
      return 'Uploading ' + n + '... ' + state.loadingMsg
    },
    useRemoteDatabase(state, getters) {
      return state.remotePosts && getters['user/currentMap'] != 'public'
    },
    userQuillSelectedId: state => {
      return state.quillSelectedId
    },
    userNameOLD: state => {
      return state.userName
    },
    userCanEditOLD: (state, getters) => (id) => {
      if (!id) return false
      
      const outpost = getters['posts/structureById'](id)
      
      const username = state.user.name
      const username2 = outpost?.userName
      
      return username && (username == username2 || username == 'orbix')
      
    },
    userLatLngOLD: state => {
      if (state.audioLatLng != null) {
        return state.audioLatLng
      } else {
        return state.homeLatLng
      }
    },
    userLocationOLD: state => {
      if (state.audioLocation != null) {
        return state.audioLocation.trim()
      } else {
        if (state.homeLatLng.lat == state.audioLatLng?.lat && state.homeLatLng.lng == state.audioLatLng?.lng) {
          return state.homeLocation
        } else {
          return 'here'
        }
        
      }
    },
    userZoomOLD: state => {
      if (state.userZoom != null) {
        return state.userZoom
      } else {
        return state.homeZoom
      }
    },
    latestHubId: state => {
      if (state.structureHistory.length > 1) {
        return state.structureHistory[0]
      } else {
        return null
      }
    },
    previousHubId: state => {
      if (state.structureHistory.length > 1) {
        return state.structureHistory[1]
      } else {
        return null
      }   
    },
    activeCubeDataOLD: state => {
      if (state.activeMarker == 'addpost-marker') {
        return state.posts.newestAudioPost.cubeData
      } else if (state.activeMarker && state.activeMarker.options.cubeData) {
        return state.activeMarker.options.cubeData
      } else {
        return null
      }
    },
    userMinecraftStateOLD: state => {
      return state.userMinecraftStateStr.split(' ')      
    },        
    //        
    buildingIdOLD: state => {
      if (state.activeMarker) {
        return state.activeMarker.options.audioId
      } else {
        return null
      }
    },
    activeStructureOLD: state => {
      // DRY ME!
      if (state.activeMarker == 'addpost-marker' && !state.quillSelectedId) {
        return state.posts.newestAudioPost
      } else if (state.activeMarker || state.quillSelectedId){
        const id = state.quillSelectedId || state.activeMarker.options.audioId
        for (var i=0; i<state.posts.allAudioPosts.length; i++) {
          let p = state.posts.allAudioPosts[i]
          if (p.audioId == id && p.audioPostType == 'home') {
            return p
          }
        }
      } else {
        return null
      }
    },
    activePostsOLD: (state, getters) => (mimetype, exclude) => {
      const activeBuilding = getters.activeStructure
      if (!activeBuilding) return null
      //
      const id = activeBuilding.audioId,
            posts = state.posts.allAudioPosts.filter(function(p) {
              const useType = mimetype || p.mimeType
              return p.audioId == id && p.mimeType == useType && p.audioPostType == 'content' && p.mimeType != exclude
            })
      if (!posts.length) {
        return null
      } else {
        return posts.sort((a,b) => (a.createdAt < b.createdAt ? 1 : -1))
      }
    }, 
    activeChildPostsOLD: (state, getters) => {
      const activeBuilding = getters.activeStructure
      if (!activeBuilding) return null
      //
      const id = activeBuilding.audioId
      let posts = state.posts.allAudioPosts.filter(function(p) {
              return p.audioId == id && p.audioPostType == 'content'
            }),
            tempMedia = state.posts.tempMedia.filter(p => p.audioId == id)
      
      // addpost media
      posts = posts.concat(tempMedia)
      
      if (!posts.length) {
        return []
      } else {
        return posts.sort((a,b) => (a.createdAt < b.createdAt ? 1 : -1))
      }
    },   
    latestPostOLD: state => {
      const activeBuilding = state.activeMarker
      if (!activeBuilding) return null
      //
      const id = activeBuilding.options.audioId,
            posts = state.posts.allAudioPosts.filter(function(p) {
              return p.audioId == id && p.audioPostType == 'content'
            })
      if (!posts.length) {
        return null
      } else {
        return posts.reverse()[0]
      }
    },
    latestImagePostOLD: state => {
      const activeBuilding = state.activeMarker
      if (!activeBuilding) return null
      //
      const id = activeBuilding.options.audioId,
            posts = state.posts.allAudioPosts.filter(function(p) {
              return p.audioId == id && p.mimeType == 'image'
            })
      if (!posts.length) {
        return null
      } else {
        return posts.reverse()[0]
      }
    }
}
})