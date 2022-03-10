import L from 'leaflet';
import markerExtended from '@/components/LeafletMarker.js'
import LeafletIcon from '@/views/web/sections/map/LeafletIcon.vue'

var _iconCreateFunction = function(markerCluster) {
  // This is the Hack@!
  // I am passing Vue to the cluster data through its icon
  // loser!
    var icon = new LeafletIcon()
    icon.store = markerCluster.getAllChildMarkers()[0].store // weird hack~!!!~
    icon.markerCluster = markerCluster // Ha Ha Ha!!
  
    return L.divIcon({ html: icon.$mount().$el });
}

var ClusterIconExtension = L.MarkerClusterGroup.extend({
  options: {
    iconCreateFunction: _iconCreateFunction,
    zoomToBoundsOnClick: true,
    spiderfyOnMaxZoom: true,
    spiderLegPolylineOptions: { weight: 8, color: '#2196f3', opacity: 1 },
    //disableClusteringAtZoom: 12,
    //clusterPane: 'shadowPane',
    singleMarkerMode: true,
    spiderfyDistanceMultiplier: 3.5,
    showCoverageOnHover: false,
    maxClusterRadius: function(z) {
      if (z >= 14) {
        return 200
      } else {
        return 220
      }
    }
  },
  initialize: function(store, map) {
    this.store = store;
    this.map = map;
    this.spiderfied = false

    L.MarkerClusterGroup.prototype.initialize.call(this);
  },
  
  addLayer: function (audioPost) { 
    // HAPPENS when new posts are added to the map, via PopupAddPostClass
    // ACCEPTS structures i.e. "homes"
    // content posts (image/audio) go straight to the store
    
    if (audioPost.audioPostType == 'home') {
      const clusterGroup = this
      const marker = markerExtended(this.store, audioPost)
      
      audioPost.marker = marker

      L.MarkerClusterGroup.prototype.addLayer.call(clusterGroup, marker);
    }

  },
  addLayers: function (audioPosts) {
    // tied up tight
    let markers = []
    audioPosts.forEach(function(audioPost) {
      const marker = markerExtended(this.store, audioPost)
      
      markers.push(marker)
      
      audioPost.marker = marker
      
    }.bind(this))
    
    this.clearLayers()
    L.MarkerClusterGroup.prototype.addLayers.call(this, markers);
  },
  clearLayers: function () {
      L.MarkerClusterGroup.prototype.clearLayers.call(this);
  },
  refreshClusters: function () {
      L.MarkerClusterGroup.prototype.refreshClusters.call(this);
  },
  //Zoom down to show the given layer (spiderfying if necessary) then calls the callback
	zoomToShowLayer: function (layer, callback) {
		var map = this._map;

		if (typeof callback !== 'function') {
			callback = function () {};
		}

		var showMarker = function () {
			// Assumes that map.hasLayer checks for direct appearance on map, not recursively calling
			// hasLayer on Layer Groups that are on map (typically not calling this MarkerClusterGroup.hasLayer, which would always return true)
			if ((map.hasLayer(layer) || map.hasLayer(layer.__parent)) && !this._inZoomAnimation) {
				this._map.off('moveend', showMarker, this);
				this.off('animationend', showMarker, this);

				if (map.hasLayer(layer)) {
					callback();
				} else if (layer.__parent._icon) {
					this.once('spiderfied', callback, this);
					layer.__parent.spiderfy();
				}
			}
		};

		if (layer._icon && this._map.getBounds().contains(layer.getLatLng())) {
			//Layer is visible ond on screen, immediate return
			callback();
		} else if (layer.__parent._zoom < Math.round(this._map._zoom)) {
			//Layer should be visible at this zoom level. It must not be on screen so just pan over to it
			this._map.on('moveend', showMarker, this);
			this._map.setView(layer.getLatLng(), layer.__parent._zoom + 1); // this is the change - show as much map as possible yes!
		} else {
			this._map.on('moveend', showMarker, this);
			this.on('animationend', showMarker, this);
			layer.__parent.zoomToBounds();
		}
	}
})

ClusterIconExtension.addInitHook(function() {
  // all the cluster events (click, etc) are handled within the icons
//  this.on('spiderfied', () => {
//    this.spiderfied = true
//  })
//  this.on('unspiderfied', () => {
//    this.spiderfied = false
//  })
//  this.on('clusterclick', (e) => {
//    if (this.spiderfied) {
//      e.layer.unspiderfy()
//      this.spiderfied = false
//    }
//  })
})

/* factory */
export default function clusterIconExtension(store, map) {
  return new ClusterIconExtension(store, map)
}


/* also */

L.MarkerCluster.include({
  getClusterCount: function() {
    const allMarkers = this.getAllChildMarkers(),
          origLatLngs = []
    
    allMarkers.forEach(function(m) {
      const latLng = m.getLatLng(),
            s = latLng.lat + ' ' + latLng.lng
      if (origLatLngs.indexOf(s) == -1) {
        origLatLngs.push(s)
      }
    })
    //console.log(vMarker)
    
    return origLatLngs.length
  }

});