const state = () => ({
  status: null,
  allElements: [],
  elementIds: [],
  audioBuffers: [],
  nodeSources: [],
  //
  audioContext: null,
  analyzer: null,
  dataArray: null,
  //
  activeUid: null,
  activePost: null,
  activeAudioPostId: null,
  activeUrl: null,
  //
  paused: true,
  duration: 0,
  currentTime: 0
})

const getters = {
  status: (state) => {
    return state.status
  },
  paused: (state, getters) => (id) => {
    const activePost = getters.activePost
    if (state.paused) {
      return true
    } 
    //
    if (id == activePost.uAudioId || (state.elementIds.indexOf(id) == -1 && id == activePost.audioId)) {
      return false
    } else {
      return true
    }
  },
  duration: (state) => {
    return state.duration
  },
  currentTime: (state) => {
    return state.currentTime
  },
  dataArray: (state) => {
    return state.dataArray
  },
//  activePost: (state) => {
//    const id = state.activeUid,
//          index = id ? state.elementIds.indexOf(id) : -1
//    
//    if (index != -1) {
//      return state.allElements[index]
//    } else {
//      return null
//    }
//  },
  activePostId: (state) => {
    return state.activeAudioPostId
  },
  activeUid: (state) => {
    return state.activeUid
  },
  activePost: (state) => {
    return state.activePost
  },
  activeUrl: (state) => {
    console.log('depreciated activeUrl')
    return state.activeUrl
  },
  activeElement: (state) => {
    if (state.activePost) {
      const index = state.elementIds.indexOf(state.activePost.uAudioId)
      //return state.allElements[index]
      return state.allElements[index]
    } else {
      return null
    }
  },
  activeSourceNode: (state) => {
    if (state.activeUid) {
      const index = state.elementIds.indexOf(state.activeUid)
      //return state.allElements[index]
      return state.nodeSources[index]
    } else {
      return null
    }
  },
  bufferById: (state) => (id) => {
    if (id) {
      const index = state.elementIds.indexOf(id)
      return state.audioBuffers[index]
    }
  },
  activeBuffer: (state) => {
    const index = state.elementIds.indexOf(state.activeUid)
    if (index != -1) {
      return state.audioBuffers[index]
    } else {
      return []
    }
  }
}

const actions = {
  togglePlay (context, id) {
    // FIRST ESTABLISH WHO'S CALLING and for WHAT
    const caller = context.rootGetters['posts/postByUid'](id)
    let targetPost = null
    //
    const currentPost = context.getters.activePost
    const currentAu = context.getters.activeElement
    const currentNode = context.getters.activeSourceNode
    
    // arrange cases in order of complexity
    if (!id) {
      targetPost = currentPost
    }
    if (caller == currentPost) {
      targetPost = currentPost
    }
    if (caller.audioPostType == 'home') {
      if (currentPost && id == currentPost.audioId) {
        // embedded player call
        targetPost = currentPost
      } else {
        targetPost = context.rootGetters['posts/contentById'](caller.audioId, 'audio')[0]
      }
    }
    if (caller.mimeType == 'audio') {
      targetPost = caller
    }
    if (!targetPost) {
      console.log('bad bad toggle')
      // no target at this point means there is an id
      // but the track audio element must be switched out
      // two case here: calling from an embedded player inside a "home"
      // 2. calling from a tracklist
      if (caller.audioPostType == 'home' && id == currentPost.audioId) {
        // embedded player call
        targetPost = currentPost
        // NOTE: this can leave targetPost null
      } else {
        // tracklist call
        targetPost = caller
      }
    }
    if (!targetPost) {
      console.log('this audioGraph')
      targetPost = context.rootGetters['posts/contentById'](caller.audioId, 'audio')[0]
    }
    if (!targetPost) {
      console.log('bad toggle')
      return false;
    }
    // RESOLVE THE CALL
    context.commit('updateActiveAudioPost', targetPost)
    const uid = targetPost.uAudioId
    // Get existing element index if any
    const index = context.state.elementIds.indexOf(uid)
    
    
    // THE AUDIO
    // THE BEGINNING - this user action allows audioContext to be created
    // FIRST PLAY IS SPECIAL
    if (!context.state.audioContext) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      context.state.audioContext = new AudioContext()
      //
      context.state.analyser = context.state.audioContext.createAnalyser()
      context.state.analyser.fftSize = 1024
      context.state.dataArray = new Uint8Array(context.state.analyser.frequencyBinCount)
    }
    
    // Discover or Create the HTML5 audioElement to be toggled 
    let useAudio = null,
        auNode = null
    
//    // straight toggle
//    if (currentAu) {
//      if (!id || id == currentPost.audioId) {
//        useAudio = currentAu
//        audioPost = currentPost
//      }
//    }
//    
//    // search
//    if (!id && !currentAu) {
//      // SETUP NEW TRACK BASED ON THE MAP's ACTIVESTRUCTURE
//      structure = context.rootGetters.activeStructure
//    } 
//    if (id && !currentAu) {
//      let myPost = context.rootGetters['posts/postByUid'](id)
//      
//      if (!myPost) {
//        structure = context.rootGetters['posts/structureById'](id)
//      } else {
//        audioPost = myPost
//      }
//    }
//    // now if
//    if (structure && !audioPost && !currentAu) {
//      audioPost = context.rootGetters['posts/contentById'](structure.audioId, 'audio')[0]
//      id = audioPost.uAudioId
//    }
//    
//    if (!currentAu) {
//      context.commit('updateActiveAudioPost', audioPost)
//    }
//    
    
  if (targetPost != currentPost) {
      //
      // REFRESH ACTIVE CALLER //
      //
      // pause current audioElement
      if (currentAu) {
        currentAu.pause()
      }
      // disconnect current node
      if (currentNode) {
        currentNode.disconnect()
        context.state.analyser.disconnect()
        context.state.audioContext.destination.disconnect()
      }
      
      // 
      if (index == -1) {
        console.log('new track play')
        // CREATE NEW TRACK
        useAudio = new Audio(targetPost.audioUrl)
        auNode = context.state.audioContext.createMediaElementSource(useAudio)
        
        //
        useAudio.crossOrigin = "anonymous"
        //
        // SETUP LISTENERS
        useAudio.addEventListener('canplay', () => {
          context.state.duration = useAudio.duration
        })
        useAudio.addEventListener('timeupdate', () => {
          context.state.analyser.getByteTimeDomainData(context.state.dataArray);
          context.state.currentTime = useAudio.currentTime
          
        })
        
        // and SAVE LOCALLY
        
        //
        context.state.allElements.push(useAudio)
        context.state.nodeSources.push(auNode)
        context.state.elementIds.push(uid)
        context.state.audioBuffers.push([])
        
        // fetch waveform
        context.dispatch('fetchAudioBuffer', uid)
        
        // AND CONNECT
        auNode.connect(context.state.analyser)
        context.state.analyser.connect(context.state.audioContext.destination)
        
      } else {
        useAudio = context.state.allElements[index]
        auNode = context.state.nodeSources[index]
        context.state.duration = useAudio.duration
      } 
      
      // UPDATE GRAPH
      
      
      } else {
        // TRACK EXISTS 
        // THESE getters have already been updated above
        useAudio = context.getters.activeElement
        auNode = context.getters.activeSourceNode
        context.state.duration = useAudio.duration
      }
    // DO THE TOGGLING
      if (useAudio.paused) {
          useAudio.play()
          context.state.paused = false
        } else {
          useAudio.pause()
          context.state.paused = true
        }
    },
  fetchAudioBuffer (context, id) {
    const elementIndex = context.state.elementIds.indexOf(id),
          element = context.state.allElements[elementIndex],
          src = element.src,
          existingBuffer = context.state.audioBuffers[elementIndex]
    
    if (existingBuffer.length) {
      return existingBuffer      
    } else {
      context.state.status = 'loading'
      context.state.audioBuffers[elementIndex] = ['loading']
    }
    
    fetch(src)
        .then(response => response.arrayBuffer())
        .then(arrayBuffer => context.state.audioContext.decodeAudioData(arrayBuffer, (audioBuffer) => {
           context.state.audioBuffers[elementIndex] = audioBuffer
           console.log('fetch complete')
            context.state.status = null
          return audioBuffer
      }, (e) => { console.log(e); }))
  }
  
}

const mutations = {
  updateActiveAudioPost(state, post) {
    state.activePost = post
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}