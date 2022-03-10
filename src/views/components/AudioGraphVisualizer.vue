<template>
<div class="audio-visualizer" v-if="activeElement">
  <canvas width=10 height="10" :id="id"></canvas>
</div>
<div v-else class="audio-visualizer">
<!-- nothing here -->
  <canvas width=10 height="10" :id="id"></canvas>
</div>
</template>

<script>
export default {
  name: 'audio-visualizer',
  props: ['id', 'store'],
  data() {
    return {
      audioContext: null,
      element: null,
      analyser: null,
      dataArray: null,
      track: null,
      tracks: [],
      tracksBySrc: [],
      //
      canvas: null,
      ctx: null,
      //
      shape: 'osc'
//      urls: [],
//      activeUrlIndex: null,
//      analysers: []
    }
  },
  computed: {
    currentTime() {
      return this.store.getters['audio/currentTime']
    },
    currentData() {
      return this.store.getters['audio/dataArray']
    },
    activeElement() {
      return this.store.getters['audio/activeElement']
    },
    activeId() {
      return this.store.getters['audio/activePostId']
    }
  },
  watch: {
//    activeId() {
//      // when ID changes this signals need for refresh
//      this.element = null
//    },
//    currentTime() {
//      if (!this.element ) {
//        this.loadSrc()
//      }
//      
//      if (this.shape == 'bars') {  
//        this.analyser.fftSize = 128
//        this.analyser.getByteFrequencyData(this.dataArray)
//        this.drawBars()
//      } else {
//        this.analyser.fftSize = 1024
//        this.analyser.getByteTimeDomainData(this.dataArray);
//        this.draw()
//      }
//    },
    currentTime() {
      this.draw()
    }
  },
  methods: {
    loadSrc() {
      this.element = this.activeElement
      //
      const newSrc = this.element.src,
            srcIndex = this.tracksBySrc.indexOf(newSrc)
      
      let track = null
      if (srcIndex == -1) {
        track = this.audioContext.createMediaElementSource(this.element)
        this.tracks.push(track)
        this.tracksBySrc.push(newSrc)
      } else {
        track = this.tracks[srcIndex]
      }
      
      this.analyser.disconnect()
      track.disconnect()
      
      track.connect(this.analyser)
      this.analyser.connect(this.audioContext.destination)
      
      
    },
    draw() {
      const width = this.canvas.width,
            height = this.canvas.height,
            dataArray = this.currentData,
            bufferLength = 512 // this.analyser.frequencyBinCount
      
      this.ctx.clearRect(0,0,width,height)
      this.ctx.beginPath()
      
      var sliceWidth = width * 1.0 / bufferLength;
      var x = 0;
      
      for(var i = 0; i < bufferLength; i++) {
        var v = dataArray[i] / 128.0; // dataArray ranges 128-255
        var y = v * height / 2 ;
        
        if(i === 0) {
          this.ctx.moveTo(x, y);
        } else {
          this.ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }
      
      this.ctx.lineTo(width, height/2);
      this.ctx.stroke();
      
    },
    drawBars() {
      const width = this.canvas.width,
            height = this.canvas.height,
            bufferLength = this.analyser.frequencyBinCount,
            dataArray = this.currentData
      
      this.ctx.clearRect(0,0,width,height)
      
      var midPass = 16
      
      var barWidth = (width / (bufferLength - midPass * 2 )) * 2.5;
      var barHeight;
      var x = 0;
      
      
      for(var i = midPass; i < bufferLength - midPass; i++) {
        barHeight = dataArray[i]/2;

        this.ctx.fillStyle = 'rgb(' + (barHeight+100) + ',50,50)';
        this.ctx.fillRect(x,height-barHeight/2,barWidth,barHeight);

        x += barWidth + 1;
      }
        
    }
  },
  mounted() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.audioContext = new AudioContext()
    //
    this.analyser = this.audioContext.createAnalyser()
    this.analyser.fftSize = 2048
    this.dataArray = new Uint8Array(this.analyser.frequencyBinCount)
    //
    this.canvas = document.getElementById(this.id)
    //
    this.canvas.width = this.canvas.offsetWidth
    this.canvas.height = this.canvas.offsetHeight
    //
    this.ctx = this.canvas.getContext('2d')
    this.ctx.fillStyle = '#ff00aa';
    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = '#ff00aa';
  }
}
</script>

<style lang="scss">
  .audio-visualizer, .audio-visualizer canvas {
    width: 100%;
    height: 100%;
  }

</style>