/* utils */
var randId = function() {
  return 'au-' + Math.random().toString(36).substr(2, 5)
}

/* audioPost */
export default class AuwalkPost {
  constructor(source) {
    this.createdAt = parseInt(source.createdAt)
    this.lastModified = parseInt(source.lastModified)
    this.fileKey = source.fileKey
    
    // everything sorted by postDate now
    // kind of new
    if (source.postDate) {
      this.postDate = parseInt(source.postDate) 
    } else {
      this.postDate = this.createdAt
    }
    
    //console.log(source)
    this.audioId = source.audioId || randId()
    
    this.uAudioId = randId()
    
    this.userName = source.userName || 'public'
    
    this.audioPostType = source.audioPostType || 'home'
    
    this.audioTitle = source.audioTitle || null
    this.audioDesc = source.audioDesc || null
    
    this.audioLatLng = source.audioLatLng
    this.audioPoster = source.audioPoster
    
    this.audioFile= source.audioFile || null // null when remote
    this.audioUrl= source.audioUrl || null // null when local
    if (!this.audioUrl && this.audioFile != null && typeof this.audioFile.type != 'undefined') {
      this.audioUrl = window.URL.createObjectURL(this.audioFile)
    }
    
    this.cubeData = source.cubeData || []
    this.cubeDataLoaded = source.cubeDataLoaded || false
    this.cubeScale = source.cubeScale || 721 // ha!
    this.horzAdjust = source.horzAdjust || 0
    this.vertAdjust = source.vertAdjust || 0
    
    this.gotoHubId = source.gotoHubId || null
    
    this.audioFileSize = source.audioFileSize || null
    this.audioMime = source.audioMime || null // depreciated
    this.extension = source.extension || 'json'
    
    this.mimeType = source.mimeType || null
    if (!this.mimeType) {
      if (this.audioMime) {
        this.mimeType = this.audioMime.split('/')[0]
      } else {
        //this.mimeType = 'text'
      }
    }
    
    this.activeAction = 'home'
    
//    this.audioMime = source.audioMime //this.audioFile == null ? '' : 
//    this.audioFileSize = source.audioFileSize
//    
//     if (source.audioMime) {
//      this.mimeType = source.audioMime.split('/')[0]
//    } else {
//      this.mimeType = 'text' // currently empty content
//    }
    
    
  }
}
