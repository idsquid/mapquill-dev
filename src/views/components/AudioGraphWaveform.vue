<template>
  <div class="audio-waveform">
    <slot></slot>
    <canvas width="10" height="10" :id="id"></canvas>
  </div>
</template>

<script>
export default {
  props: ['id', 'audioId', 'store'],
  data() {
    return {
      audioContext: null,
      canvas: null,
      ctx: null
    }
  },
  computed: {
    audioStatus() {
      return this.store.getters['audio/status']
    }
  },
  watch: {
    audioStatus(msg) {
      if (!msg) { // i.e. done loading
        this.loadAudio()
      }
    },
    myAudioBuffer(audioBuffer) {
      if (audioBuffer.length > 2) {
        this.processBuffer(audioBuffer)
      }
    }
  },
  methods: {
    loadAudio() {
      const audioBuffer = this.store.getters['audio/activeBuffer']
      if (audioBuffer && audioBuffer.length > 2) {
        this.processBuffer(audioBuffer)
      } else {
        console.log('premature buffer call')
      }
    },
    async loadAudioOLD2() {
      const audioBuffer = await this.store.dispatch('audio/fetchAudioBuffer', this.activePostId)
      
//      console.log(audioBuffer)
      
      if (audioBuffer.length > 2) {
        this.processBuffer(audioBuffer)
      }
    },
    async loadAudioOLD() {
      fetch(this.activeUrl)
        .then(response => response.arrayBuffer())
        .then(arrayBuffer => this.audioContext.decodeAudioData(arrayBuffer, (audioBuffer) => {
            this.processBuffer(audioBuffer)
           }, (e) => { console.log(e); }))
//        .then(audioBuffer => {
//          
//          return 
//        });
    },
    processBuffer(audioBuffer) {
      //console.log(audioBuffer.length + ' bytes downloaded')
      // FILTER
      const rawData = audioBuffer.getChannelData(0); // We only need to work with one channel of data
      const samples = Math.round(this.canvas.width / 3) //70; // Number of samples we want to have in our final data set
      const blockSize = Math.floor(rawData.length / samples); // the number of samples in each subdivision
      const filteredData = [];
      for (let i = 0; i < samples; i++) {
        let blockStart = blockSize * i; // the location of the first sample in the block
        let sum = 0;
        for (let j = 0; j < blockSize; j++) {
          sum = sum + Math.abs(rawData[blockStart + j]); // find the sum of all the samples in the block
        }
        filteredData.push(sum / blockSize); // divide the sum by the block size to get the average
      }
      
      // AND NORMALIZE
      const multiplier = Math.pow(Math.max(...filteredData), -1);
      const normalizedData = filteredData.map(n => n * multiplier);
      
      // AND DRAW
      this.draw(normalizedData)
    },
    draw(normalizedData) {
      const canvas = this.canvas
      const ctx = this.ctx
      
      //const dpr = 1 // window.devicePixelRatio || 1;
      const padding = canvas.height / 10;
      //canvas.width = canvas.offsetWidth * dpr;
      //canvas.height = (canvas.offsetHeight + padding * 2) * dpr;
      //const ctx = canvas.getContext("2d");
      //ctx.scale(dpr, dpr);
      
      
      ctx.clearRect(0, -canvas.height / 2, canvas.width, canvas.height);
      
      // draw the line segments
      const width = canvas.offsetWidth / normalizedData.length;
      for (let i = 0; i < normalizedData.length; i++) {
        const x = width * i;
        let height = normalizedData[i] * canvas.height/2 - padding
        if (height < 0) {
            height = 0;
        } else if (height > canvas.height / 2) {
            height = canvas.height/2 - padding;
        }
        this.drawLineSegment(ctx, x, height, width, (i + 1) % 2);
      }
    },
    drawLineSegment(ctx, x, height, width, isEven) {
      ctx.lineWidth = 1; // how thick the line is
      ctx.strokeStyle = "#fff"; // what color our line is
      ctx.beginPath();
      height = isEven ? height : -height;
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.arc(x + width / 2, height, width / 2, Math.PI, 0, isEven);
      ctx.lineTo(x + width, 0);
      ctx.stroke();
    }
  },
  mounted() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.audioContext = new AudioContext()
    //this.loadAudio()
    //
    this.canvas = document.getElementById(this.id);
    this.canvas.width = this.canvas.offsetWidth
    this.canvas.height = 40 //this.canvas.offsetHeight
    
    this.ctx = this.canvas.getContext('2d')
    this.ctx.translate(0, this.canvas.height / 2 ); // set Y = 0 to be in the middle of the canvas
    //
    
  }
}
</script>

<style lang="scss">
  .audio-waveform {
    position: relative;
    width: 100%;
    height: 100%;

/*
    min-width: 200px;
    min-height: 100px;
*/
    .overlay {
      
    }
    canvas {
      width: 100%;
      height: 100%;
      background-color: $darkgrey;
      
    }
  }

</style>