<template>
  <div id="map-full" :class="mapClass">
    
<!-- MAIN NAVIGATION AS OVERLAY NOT AVAIL IN PUBLIC V -->
<!--
    <overlay :class="{active: overlayOpen}" @closed="overlayOpen = false">
      <address-bar ref="addressBar" @searchComplete="overlayOpen = false"></address-bar>
    </overlay>
-->

    
<!--    MAP/USER ACTION MENU  -->
    <!--      QUILL TOGGLE-->
      <div class="quill-toggle clickable button" @click="toggleAddPostView" :class="{'active': inQuill}"><v-icon name="feather-alt"></v-icon></div>
    
    <sidebar position="bottomright" class="column">
<!--      ZOOM -->
      <div class="clickable button" @click="zoomOut"><v-icon name="search-minus"></v-icon></div>
      <div class="button" :class="atMaxZoom ? 'disabled' : 'clickable'" @click="zoomIn"><v-icon name="search-plus"></v-icon></div>
      
<!--      EDIT LINK-->
<!--
      <router-link v-if="activeStructure" :to="{ name: 'files', params: {audioId: activeStructure.audioId}}" v-slot="{route, navigate}" append custom>
        <div class="clickable button" @click="navigate">
          <v-icon name="edit"></v-icon>
        </div>
      </router-link>
      <div v-else class="disabled button"><v-icon name="edit"></v-icon></div>
-->
      
<!--      RESET VIEW-->
<!--      <div class="clickable button" @click="resetView"><v-icon name="redo"></v-icon></div>-->
      
    </sidebar>
    
<!--    THE LEAFLET MAP -->
    <leaflet-cluster-map ref="leafletMap"></leaflet-cluster-map>
    
  </div>
</template>

<script> 
import LeafletClusterMap from '@/views/web/sections/map/LeafletClusterMap.vue'
import Sidebar from '@/views/web/layout/Sidebar.vue'
  
export default {
  name: 'map-full',
  components: {
    'leaflet-cluster-map': LeafletClusterMap,
    'sidebar': Sidebar
  },
  data: function() {
    return {
      userNameInputValue: null, // huh? 
      mapVueElement: null,
      map: null,
      overlayOpen: false,
      //
      atMaxZoom: false
    }
  },
  mounted() {
    console.log('MapFull page mounted')
    this.mapVueElement = this.$refs.leafletMap
    this.map = this.$refs.leafletMap.map
    
    // Connect map events to our top class
    // don't do anything else with the map here!
    const setClassFromMap = () => {
      if (this.map.getZoom() == this.map.getMaxZoom()) {
        this.atMaxZoom = true
      } else {
        this.atMaxZoom = false
      }
    }
    this.map.on('zoomend', () => {
      setClassFromMap()
    })
    setClassFromMap()
    
    // special: 
    // if entering from single-post route, focus and open that post
    // not sure it works with clusterer, but it feels cool
    if (this.activeStructure) {
      const marker = this.activeStructure.marker
        if (marker) {
          this.map.setView(marker.getLatLng(), this.map.getMaxZoom())
          setTimeout(function() {
            marker.openPopup()
          }, 10)
        }
    }
  },
  computed: {
    activeStructure() {
      return this.$store.getters['posts/activeStructure']
    },
    inQuill() {
      // changes!
      // appState should be mapState, and handled by a map module
      return this.$store.state.appState == 'addpost-view' 
    },
    userSearch: function() {
      console.log('mapfull2 userSearch slated for dep')
      // move addressbar functions out of here!
      return this.$store.state.userSearchLatLng
    },
    mapClass: function() {
      const userZoom = this.$store.getters['user/currentLocation'].zoom
      let cl = {
        'at-max-zoom': this.atMaxZoom,
        'room-to-zoom': !this.atMaxZoom
      }
      cl['zoom-'+userZoom] = true
      
      return cl
    }
  },
  methods: {
    zoomActiveMarker() {
      const latLng = this.activeStructure.audioLatLng,
          map = this.map,
          zoom = map.getMaxZoom()
      map.setView(latLng, zoom)
    },
    resetView() {
      this.$store.dispatch('user/resetLocation')
    },
    toggleAddPostView: function() {
      if (this.inQuill) {
        this.mapVueElement.exitAddPost()
      } else {
        this.mapVueElement.enterAddPost()
      }
    },
    zoomOut() {
      this.map.zoomOut(4)
    },
    zoomIn() {
      if (this.activeStructure) {
        this.zoomActiveMarker()
      } else {
        this.map.zoomIn(2)
      }
    }
  }
  
}  
</script>

<style lang="scss">
  #map-full {
    @include column(center, center);
    width: 100%;
    flex-grow: 1;
    background-color: rgba(0,0,0,.8);
    padding-right: 0em; 
    .leaflet-container {
      font: 1em "Helvetica Neue", Arial, Helvetica, sans-serif;
      @include phone-only {
        font-size: .75em;
      }
    }
    .sidebar {
      margin: .5em;
    }
  }
  
  .quill-toggle {
    position: absolute; z-index: 1099;
    top: .5em; right: .5em;
    font-size: 150%;
    border-radius: 10px;
    background-color: rgba(206, 206, 206, 0.63);
    box-shadow: -2px 5px 5px #333;
    &.active {
      color: $medgreen;
    }
    .fa-icon {
      width: 1em;
      height: 1em;
    }
  }
  
</style>

