/* mostly adds styling data to Leaflet popup */

import L from 'leaflet';
import structurePopup from '@/views/web/sections/map/PopupStructure.vue'
import structureCreate from '@/views/web/sections/map/PopupQuill.vue'

var PopupExtension = L.Popup.extend({
  options: {
//    minWidth: 330, 
    offset: [0,0], 
    keepInView: false,
    autoClose: false,
    closeOnClick: true,
    permanent: true,
    autoPan: true,
    autoPanPaddingTopLeft: L.point(0,15)
  },
  initialize: function(audioPost, store) {
    this.store = store
    if (audioPost.audioPostType == 'home') {
      this.audioPost = audioPost
    } else {
      this.audioPost = false
    }
    L.Popup.prototype.initialize.call(this);
  }
})

PopupExtension.addInitHook(function() {
  let vueContent = null
  if (this.audioPost.audioPostType == 'home' || this.audioPost.mimeType == 'text') {
    vueContent = new structurePopup()
    vueContent.store = this.store
    vueContent.popup = this

    let popupContent = vueContent.$mount().$el
    
    this.setContent(popupContent)
    
    
  } else if (!this.audioPost) {
    
    var buildingContent = new structureCreate()
    buildingContent.store = this.store
    buildingContent.popup = this
    this.setContent(buildingContent.$mount().$el)
    
    L.setOptions(this, {
      offset: [0,-40]
    })
    
  }
})

/* factory */
export default function popupExtended(audioPost, store) {
  return new PopupExtension(audioPost, store)
}