//import {router} from "@/main.js"
import router from '@/router'
import Cookies from 'js-cookie'
import randId from '@/components/UtilityRandId.js'

const state = () => ({
  requestLat: null, // from initial load
  requestLng: null, // ...
  requestZoom: null, // ...
  requestUid: null, // ... //
  baseLat: 41.866337, 
  baseLng: -87.6089716,
  baseZoom: 12,
  //
  requiresRecenter: false,
  //
  name: 'public',
  env: 'dev'
})

const getters = {
  urlLocation(state, getters, rootState, rootGetters) {
    const lat = router.currentRoute.query['lat'],
          lng = router.currentRoute.query['lng'], // ...
          zoom = router.currentRoute.query['zoom'], // ...
          uid = router.currentRoute.query['uid']
    if ((lat && lng) || uid) {
      if (uid) {
        const post = rootGetters['posts/postByUid'](uid)
        if (post) {
          return {
            lat: post.audioLatLng.lat,
            lng: post.audioLatLng.lng
          }
        } else {
          return null
        }
      } else {
        return {
          lat: lat,
          lng: lng,
          zoom: zoom,
          fromUrl: true
        }
      }
    } else {
      return null
    }
  },
  currentMap(state) {
    return state.env
    
    //router.currentRoute.params['env'] || 'dev' // migrating towards a mapEnv model that will be managed through a vuex module - but not today
  },
  currentLocation(state, getters) {
    // Case 1: prioritize the URL
    if (getters.urlLocation) {
      return getters.urlLocation
    }
    
    // Case 2: user has a cookie history on the current map
    const env = getters.currentMap,
          cKey = Cookies.get(env)
    if (cKey) {
      return {
        lat: Cookies.get('lat-' + cKey),
        lng: Cookies.get('lng-' + cKey),
        zoom: Cookies.get('zoom-' + cKey),
        fromCookie: true
      }
    } 
    
    // Case 3: user has no history here
    return {
      lat: state.baseLat,
      lng: state.baseLng,
      zoom: state.baseZoom,
      zeroHistory: true
    }
  },
  cookieLocation(state, getters) {
    const env = getters['currentMap'],
          key = Cookies.get(env)
    
    if (!key) {
      return null
    } else {
      return {
        lat: 'lat-' + key,
        lng: 'lng-' + key,
        zoom: 'zoom-' + key,
        keys: [env, 'lat-'+key, 'lng-'+key, 'zoom-'+key]
      }
    }
  },
  canCreate() {
    return true
  }
    
  
}

const mutations = {
  touchState(state, object1) {
    for (const [key, value] of Object.entries(object1)) {
      if (typeof state[key] != 'undefined') {
        state[key] = value
      } else {
        console.log('error!')
      }
    }
  },
  setInitialQuery(state) {
    state.requestLat = router.currentRoute.query['lat'] // from initial load
    state.requestLng = router.currentRoute.query['lng'] // ...
    state.requestZoom = router.currentRoute.query['zoom'] // ...
    state.requestUid = router.currentRoute.query['uid'] // ... //
  },
  requiresRecenter(state, value) {
    state.requiresRecenter = value
  }
}

const actions = {
  requestsEdit(ctx, audioId) {
    router.push({ name: 'files', params: {audioId: audioId}})
  },
  async updateUrlQuery(ctx, value) {
    router.push({query: value}).catch(() => {
      console.log('router errors need work. Duped!')
    })
  },
  updateLocation({state, getters}, toPos) {
    const env = getters['currentMap'],
          key = Cookies.get(env) || randId(),
          pos = toPos || getters['currentLocation']
      
      Cookies.set(env, key)
      Cookies.set('lat-'+key, pos.lat)
      Cookies.set('lng-'+key, pos.lng)
      Cookies.set('zoom-'+key, pos.zoom)
    
    state.zoom = pos.zoom
  },
  resetLocation({state, getters, commit, rootGetters}) {
    // this should be moved to the router!
    const cookie = getters.cookieLocation
    if (cookie) {
      cookie.keys.forEach((n) => {
        Cookies.remove(n)
      })
    }

    if (state.requestLat || state.requestUid) {
        router.push({query: {
          lat: state.requestLat,
          lng: state.requestLng,
          zoom: state.requestZoom,
          uid: state.requestUid,
        }})
    } else {
        router.push({query: null})
    }
    
    if (!rootGetters.useRemoteDatabase) {
      window.localStorage.clear()
      window.location.reload()
    }
    
    commit('requiresRecenter', true)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}