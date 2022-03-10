/*  adds audioPost data to Leaflet Marker */

import L from 'leaflet';
import ClusterExtensionIcon from '@/views/web/sections/map/LeafletIcon.vue'
import leafletPopup from '@/components/LeafletPopup.js'


var QuillMarker = L.Marker.extend({
  initialize: function(store) {
    this.store = store
    this.isDragging = false
    
    const latLng = {lat:-69.389321,lng:30.5859375} // antarctica - i.e. offscreen
    
    const icon = new ClusterExtensionIcon()
    icon.store = this.store // this works here because the quill marker stands alone. clustered markers need their store set in the iconCreateFunction
    icon.isAddPostMarker = true
      
    const divIcon = L.divIcon({ 
      html: icon.$mount().$el
    })
    L.setOptions(this, {
      icon: divIcon, 
      pane: 'tooltipPane', 
      draggable: true,
      zIndexOffset: 1000
    })
    
    L.Marker.prototype.initialize.call(this, latLng);
  }
})

QuillMarker.addInitHook(function() {
//  POPUP
    let popup = leafletPopup(this.options, this.store)
    this.bindPopup(popup)
  
  // EVENTS!
  this.on('dragend', function(e) {
    const marker = e.target
    
    this.isDragging = false
    
    const markerLatLng = marker.getLatLng()
    //this.store.commit('updateAudioLatLng', markerLatLng)
    this.store.commit('quill/updateLatLng', markerLatLng)
    
    const selectedId = marker.getOverlappedMarker()
    
    this.store.commit('quill/updateSelectedId', selectedId)
    
    if (!this.store.getters['quill/selectedStructure']) {
      this.openPopup();
    }
    
  }.bind(this))
  this.on('dragstart', function() {
    this.isDragging = true
  }.bind(this))
  this.on('add', (e) => {
    this.store.commit('updateActiveMarker', 'addpost-marker') 
    this.store.commit('setAppState', 'addpost-view')
    
    const selectedId = e.target.getOverlappedMarker(),
          latLng = e.target.getLatLng()
    
    this.store.commit('quill/updateSelectedId', selectedId)
    if (!this.store.getters['quill/selectedStructure']) {
      this.openPopup();
    }
    
    //this.store.commit('updateAudioLatLng', latLng)
    this.store.commit('quill/updateLatLng', latLng)
    
    e.sourceTarget.getIcon().options.html.closest('.leaflet-marker-icon').classList.add('addpost-open')
  })
  this.on('remove', () => {
    this.store.commit('updateActiveMarker', null) 
    this.store.commit('setAppState', 'map-view')
    var els = document.getElementsByClassName('addpost-open')
    while (els[0]) {
      els[0].classList.remove('addpost-open')
    }
  })
  this.on('popupclose', function() {
    setTimeout(() => {
    if (!this.isDragging) {
      this.remove()
    }
    }, 300)
    
  }.bind(this))
  
})

QuillMarker.include({
//  content() {
//    const myId = this.options.audioId
//    return this.store.state.posts.allAudioPosts.filter(p => p.audioId == myId && p.audioPostType == 'content')
//  },
  getOverlappedMarker() {
    // Check if quill selected something
    const posts = this.store.getters['posts/allStructures']()
      let closestStructureId = null,
          distance = 999999999999999999
      posts.forEach(function(p) {
        const l1 = new L.LatLng(p.audioLatLng.lat, p.audioLatLng.lng),
              l2 = new L.LatLng(this.getLatLng().lat, this.getLatLng().lng),
              d = l1.distanceTo(l2)
        if (d < distance) { // naturally excludes itself
          closestStructureId = p.audioId
          distance = d
        }
      }, this)
    // return what QUILL SELECTED 
    let quillSelectedId = null
    if (distance < 200) { // 200 meters
      quillSelectedId = closestStructureId
    } 
    return quillSelectedId
  }
})

/* factory */
export default function quillMarker(store) {
  return new QuillMarker(store)
}