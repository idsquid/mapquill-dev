import L from 'leaflet'
import 'leaflet.markercluster';
import leafletMarkerQuill from '@/components/LeafletMarkerQuill.js'

var MapExtended = L.Map.extend({
  options: {
    fullscreenBounds: [{lat:85, lng:180},{lat:-85, lng:-180}],
    osmTiles: new L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'}), // the map graphic. 
    bwTiles: L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
    maxZoom: 15,
    attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
    }),
    zoomControl: false,
    attributionControl: true,
//        noWrap: false,
    tap: false
  },
  initialize(id, $store, options) {
    this.$store = $store
    this.addPostMarker = null
    L.setOptions(this, options);
    L.Map.prototype.initialize.call(this, id);
  }
})

MapExtended.addInitHook(function() {
  this.addLayer(this.options.osmTiles) // added here does not cache

// ADD ATTRIBUTION
    this.attributionControl.setPosition('bottomleft');
//    this.map.zoomControl.setPosition('bottomleft');   
//    L.control.layers({
//      'osm': this.osmTiles,
//      'bwTiles': this.bwTiles
//    }).addTo(this.map)
  
  // OPTIONALLY ADD MAP TO PAGE HERE
//  this.setView(
//    this.$store.getters.userLatLng, 
//    this.$store.getters.userZoom
//  )
  
  // OPTIONALLY MAKE IT FULLSCREEN 
//  console.log(this.options)
  if (this.options.fullScreen) {
    window.onresize = function() {
      document.body.style.height = window.innerHeight + 'px'
      this.invalidateSize()
    }.bind(this)
  }
  
  // SET ZOOM MIN/MAX
  const fullscreenMinZoom = this.getBoundsZoom(this.options.fullscreenBounds, true),
        maxZoom = this.$store.state.mapMaxZoom
  this.setMinZoom(fullscreenMinZoom)
  this.setMaxZoom(maxZoom)
  this.$store.commit('setMinMaxZoom', [fullscreenMinZoom, maxZoom])
  
  // ADD A WHALE
  var mon = [[22.127527523534404, -69.45382833480836],
  [22.112658543770312, -69.46187496185304]]
  var imageUrl = require('@/assets/whales.jpg'),
      imageBounds = mon;
  L.imageOverlay(imageUrl, imageBounds).addTo(this)
  
})

MapExtended.include({
  getCurrentLocation() {
    const latLng = this.getCenter(),
          zoom = this.getZoom()
    return {
        lat: latLng.lat,
        lng: latLng.lng,
        zoom: zoom
      }
  },
  centerOnUser() {
    const pos = this.$store.getters['user/currentLocation']
    this.setView({
      lat: pos.lat,
      lng: pos.lng
    }, pos.zoom)
  },
  updateUserData(fromInit = false) {
    const pos = this.getCurrentLocation()
    this.$store.dispatch('user/updateLocation', pos)
    if (!fromInit) {
      this.$store.dispatch('user/updateUrlQuery', pos)
    }
  },
  addStandardEvents() {
    this.on('click', () => {
      this.$store.commit('setAppState', 'map-view')
      if (this.addPostMarker) {
        this.removeQuill()
      }
    })
    this.on('moveend', () => {
      this.updateUserData()
    })
  },
  addQuill() {
    this.addPostMarker = leafletMarkerQuill(this.$store)
  },
  placeQuill() {
     var mapCenter = this.getCenter(),
         currentPos = this.addPostMarker.getLatLng(),
         useLatLng = this.getBounds().contains(currentPos) ? false : mapCenter
     if (useLatLng) {
        this.addPostMarker.setLatLng(useLatLng) // this is annoying, but necessary currently
      }
    this.addPostMarker.addTo(this)
    //this.addPostMarker.openPopup()
    
    // accomplished in marker!
    //const quillSelectedId = this.addPostMarker.getOverlappedMarker()
    //this.$store.commit('updateQuillSelected', quillSelectedId)
  },
  removeQuill() {
    this.addPostMarker.closePopup()
    this.addPostMarker.remove()
  }
})

export default function mapExtended(id, $store, options) {
    return new MapExtended(id, $store, options);
}