<template>
<div id="quill" class="map-container" :class="{'spider-open': spiderfied}">
  <div id="leaflet-map"></div>
</div>
</template>

<script>
  // VENDORS'
import 'leaflet/dist/leaflet.css';  
import 'leaflet.markercluster/dist/MarkerCluster.css';

// AUWALK
import mapExtended from '@/components/LeafletMapExtended.js'
import leafletClusterer from '@/components/LeafletClusterer.js'
  
export default {
  name: 'leaflet-cluster-map',
//  mixins: [hostUtils], 
  components: {
  },
  data: function() {
    return {
      // leaflet instantiation stuff
      map: null,
      addPostMarker: null,
      clusters: {},
      // auwalk options
      fullScreen: true,
      zoomToBoundsOnload: true,
      landOnLanding: false,
      landOnLatest: true,
      spiderfied: false
    }
  },
  mounted: function() {
    // makeit Fullscreen step 1/2
    if (this.fullScreen) {
      document.body.style.height = window.innerHeight + 'px'
    }
    // MAKE A MAP 
    this.map = mapExtended('leaflet-map', this.$store, {
      fullscreen: true
    })
    // FOR A USER
    const userPos = this.$store.getters['user/currentLocation']
      this.map.setView({
           lat: userPos.lat, 
           lng: userPos.lng
          }, userPos.zoom || this.map.getMaxZoom())
    //this.map.addLayer(this.map.options.osmTiles) // add here to cache?
    
    //
    //this.addKeystrokes()
    
    // ADD CLUSTERS LAYER TO MAP
    this.clusters = leafletClusterer(this.$store, this.map) 
    this.map.addLayer(this.clusters)
    
    // ADD POSTS TO CLUSTERS 
    const usePosts = this.$store.getters['posts/allStructures']()
    
    if (usePosts.length) {
      // step 2: ADD TO MAP via clusterer
      this.clusters.addLayers(usePosts)
    }
      
    // CASE: RELOCATE THE USER IF ZERO HISTORY and MAP ALREADY HAS CONTENT
      if (usePosts.length && userPos.zeroHistory) {
        // zoom to bounds
        const clusterBounds = this.clusters.getBounds()
        this.map.fitBounds(clusterBounds, {paddingTopLeft: [100,0], paddingBottomRight: [0,100], maxZoom: this.map.getMaxZoom()}) // what the hell is homeZoom?
      } 
      
    // SETUP UNIVERSAL MAP EVENTS
    this.map.addStandardEvents()
    
    // ADDING CLUSTER EVENTS
//    this.clusters.on('spiderfied', (e) => {
//      e.markers.forEach((m) => {
//        m.addTopClass('spiderfied')
//      })
//      e.cluster._icon.classList.add('spiderfied')
//      //
//      this.spiderfied = true
//    })
//    this.clusters.on('unspiderfied', (e) => {
//      e.markers.forEach((m) => {
//        m.removeTopClass('spiderfied')
//      })
//      e.cluster._icon.classList.remove('spiderfied')
//      //
//      this.spiderfied = false
//    })
    
    // ADD QUILL CAPABILITY IF AUTH
    if (this.$store.getters['user/canCreate']) {
      this.addPostMarker = this.map.addQuill()
    }
    
    setTimeout(() => this.map.updateUserData(true), 300)
    
  },
  computed: {
    newStructureReady() {
      return this.$store.state.posts.newStructureReadyForMap
    },
    deleteFileSelected: function() {
      return this.$store.state.posts.pleaseDeleteTheActiveMarker
    },
    userRequiresCenter() {
      return this.$store.state.user.requiresRecenter
    }
  },
  watch: {
    $route (to){
        if (to.name == 'map') {
          this.map.invalidateSize()
          const as = this.$store.getters['posts/activeStructure']
          if (as) {
            as.marker.getPopup().update()
          }
        }
    },
    newStructureReady(post) {
      if (post) {
        this.exitAddPost(false, false)
        if (post.audioPostType == 'home') {
          this.clusters.addLayer(post)
          this.$store.commit('posts/newStructureAdded')
        } else {
          const m = this.$store.getters['posts/structureById'](post.audioId)
          if (m.marker) {
            m.marker.openPopup()
          } // else new structures don't have markers
        }
      }
    },
    deleteFileSelected: function(doIt) {
      if (doIt) {
        const s = this.$store.getters['posts/activeStructure'],
              byeByeMarker = s.marker
        
        this.clusters.removeLayer(byeByeMarker)
        this.$store.commit('posts/setDeleteCurrentPostState', false)
      }
    },
    userRequiresCenter(doIt) {
      if (doIt) {
        this.map.centerOnUser()
        this.$store.commit('user/requiresRecenter', false)
      }
    }
  },
  methods: {
    addKeystrokes() {
      // meh
//      document.addEventListener('keydown', function (event) {
//        if (event.key === 'a' && event.ctrlKey) {
//          this.toggleAddpostView()
//        }
//        if (event.key === 'e' && event.ctrlKey) {
//          if (this.$store.state.appState != 'editor-view') {
//            this.$store.commit('setAppState', 'editor-view')
//          } else {
//            this.$store.commit('setAppState', 'map-view')
//          }
//        }
//      }.bind(this));
    },
    // MOUNTS (CLEAN UP)
    drawPolylines() {
        // POLYLINES
      // do it like this: https://dev.to/dimfeld/zoom-independent-shapes-in-leaflet-lnj
//      for (var i = 0; i<posts.length; i++) {
//        let s = posts[i],
//            e = this.$store.getters['posts/structureById'](s.gotoHubId)
//        if (e) {
//          let latLngs = [s.audioLatLng, e.audioLatLng],
//              p = L.polyline(latLngs, {weight: 5, opacity: .5}),
//              dur = Math.min(Math.max(this.distance(latLngs[0], latLngs[1]) / 100000, 2), 15),
//              maxz = this.$store.state.maxz
//          
//          p.on('click', function() {
//            this.map.flyTo(e.audioLatLng, maxz, {duration: dur})
//            setTimeout(function() {
//              e.marker.openPopup()
//            }, dur * 1000 + 200)
//          }.bind(this))
//
//          p.addTo(this.map)
//        }
//      }
      
      
    },
    // EVENTS
    enterAddPost: function(tileSwap=false) {
      this.$store.commit('setAppState', 'transitioning-addpost-view')
      
      this.map.closePopup()
      
      if (tileSwap) {
        this.map.removeLayer(this.osmTiles)
        this.map.addLayer(this.bwTiles)
      }
      
      this.map.placeQuill()
    },
    exitAddPost: function(tileSwap=false) {
      this.$store.commit('setAppState', 'transitioning-addpost-view')
      
      if(tileSwap) {
        this.map.removeLayer(this.bwTiles)
        this.map.addLayer(this.osmTiles)
      }
   
      this.map.removeQuill()
    },
    toggleAddpostView() {
      const state = this.$store.state.appState
      if (state != 'addpost-view' && state != 'leaving-addpost-view') {
        this.enterAddPost()
      } else {
        this.exitAddPost()
      }
    },
    distanceNOTINUSE(latLng1, latLng2) {
      const lat1 = latLng1.lat, lon1 = latLng1.lng,
            lat2 = latLng2.lat, lon2 = latLng2.lng
      const R = 6371e3; // metres
      const φ1 = lat1 * Math.PI/180; // φ, λ in radians
      const φ2 = lat2 * Math.PI/180;
      const Δφ = (lat2-lat1) * Math.PI/180;
      const Δλ = (lon2-lon1) * Math.PI/180;

      const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ/2) * Math.sin(Δλ/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

      const d = R * c; // in metres
      
      return d
    }
  }
}  
  
</script>

<style lang="scss">
  #leaflet-map, .map-container {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    width: 100%;
    height: 100%;
    background-color: #f2efe9;
  }



</style>