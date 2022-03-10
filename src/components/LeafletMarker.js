/*  adds audioPost data to Leaflet Marker */

import L from 'leaflet';
import leafletPopup from '@/components/LeafletPopup.js'

const _initAgnosticContent = function() {
  this.on('popupopen', function(e) {
    this.store.commit('setAppState', 'leaving-addpost-view')
    //
    this.store.commit('posts/updateActiveId', e.target.options.audioId)
    //
    this.store.commit('setAppState', 'popup-view')
    //
    e.target.setZIndexOffset(2000392)
    //
    e.target.addTopClass('popup-open')
    
  }.bind(this))
  this.on('popupclose', function(e) {
    this.store.commit('posts/updateActiveId', null)
    //
    e.target.setZIndexOffset(0)
    // 
    e.target.removeTopClass('popup-open')
//    var els = document.getElementsByClassName('popup-open')
//    while (els[0]) {
//      els[0].classList.remove('popup-open')
//    }
//    var els1 = document.getElementsByClassName('a-popup-is-open')
//    while (els1[0]) {
//      els1[0].classList.remove('a-popup-is-open')
//    }
    
  }.bind(this))
}

var MarkerExtended = L.Marker.extend({
  options: {
    zIndexOffset: 0
  },
  initialize: function(store, audioPost) {
    this.store = store

    let latLng = audioPost.audioLatLng
    
    /* ICON set by iconCreateFunction in ClusterExtension */
    L.setOptions(this, audioPost) // how we get data to markers
    
    L.Marker.prototype.initialize.call(this, latLng);
  }
})

MarkerExtended.addInitHook(function() {
//  POPUP
    let popup = leafletPopup(this.options, this.store)
    this.bindPopup(popup)
  
  // Events
 _initAgnosticContent.call(this)
  
})

L.Marker.include({
  addTopClass(c) {
    this.getIcon().options.html.closest('.leaflet-marker-icon').classList.add(c)
  },
  removeTopClass(c) {
    this.getIcon().options.html.closest('.leaflet-marker-icon').classList.remove(c)
  },
  content() {
    // this currently assumes it's a structure calling.
    // what if it's a content marker?
    const myId = this.options.audioId
    return this.store.getters['posts/contentById'](myId)
  }
})

/* factory */
export default function markerExtended(store, audioPost) {
  return new MarkerExtended(store, audioPost)
}