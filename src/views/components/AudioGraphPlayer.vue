<template>
<div class="graph-player" :class="layout" v-if="popupPost">
  <div class="play-pause-button button" @click="togglePlay(thePost.uAudioId)">
    <v-icon :name="isPaused(audioId) ? 'play' : 'pause'"></v-icon>
  </div>
  <div class="title">
    {{ thePost.audioTitle || 'untitled' }} 
  </div>
  
  <div class="player-waveform" v-if="layout != 'compact'">
    <audio-waveform v-if="includeWaveform && thePost.audioId" class="" :id="'graph-player-waveform-' + audioId" :audioId="audioId" :store="store">
      <div class="overlay" :style="'width: ' + 100 * (currentTime / duration) + '%'"></div>
    </audio-waveform>
  </div>
    
  
  <input class="audio-scrubber" @input="scrubAudio($event)" type="range" id="time" min="0" :max="duration" :value="currentTime" step="0.01">
    
  
  <div class="visualizer" v-if="layout != 'compact'">
    <audio-visualizer :id="'graph-visualizer-' + audioId" v-if="thePost.audioId" :store="store"></audio-visualizer>
  </div>
  
  <div class="timecode">
      {{ currentTime }}:{{ duration }}
  </div>
  
  <slot></slot>
  
  <div class="tracks">
    <div class="row button" v-for="(post, i) in thePosts" :key="'post-'+i" @click="togglePlay(post.uAudioId)" :class="{active: !isPaused(post.uAudioId)}" >
      {{ post.audioTitle || 'untitled' }}
    </div>
  </div>
  
<!--  <div class="filler"> nothing here </div>-->

</div>
<div v-else class="graph-player loading">
  loading...
</div>

<!--
<div v-else class="graph-player">
  <slot></slot>
</div>
-->
</template>

<script>
import waveform from '@/views/components/AudioGraphWaveform.vue'  
import visualizer from '@/views/components/AudioGraphVisualizer.vue'  
  
export default {
  name: 'graph-player',
  components: {
    'audio-waveform': waveform,
    'audio-visualizer': visualizer
  },
  props: ['audioId','uAudioId', 'store','layout'],
  data() {
    return {
      emptyAudio: {
        paused: true,
        currentTime: '00:00'
      },
      includeWaveform: true
    }
  },
  computed: {
    popupPost() {
      return this.store.getters['posts/activeStructure']
    },
    thePosts() {
      return this.store.getters['posts/contentById'](this.popupPost.audioId, 'audio')
    },
    thePost() {
      const activeId = this.store.getters['audio/activePostId'],
            activePost = this.store.getters['posts/contentById'](activeId, 'audio')[0]
      
      if (!activeId || typeof activePost == 'undefined') {
        return {
          audioId: null
        }
      }
      
      return activePost
    },
    theObject() {
      return this.store.getters['audio/audioObject']
    },
    duration() {
      return Math.floor(this.store.getters['audio/duration']) || '0'
    },
    currentTime() {
      return Math.floor(this.store.getters['audio/currentTime']) || '00:00'
    }
  },
  watch: {
    popupPost(p) {
      console.log(p)
    }
  },
  methods: {
    togglePlay(uid) {
      const useId = uid || this.uAudioId
      
      this.store.dispatch('audio/togglePlay', useId)
    },
    scrubAudio(e) {
     const val = e.target.value,
           au = this.store.getters['audio/activeElement']
     if (au) au.currentTime = val
    },
    isPaused(id) {
      if (!this.store) return true;
      return this.store.getters['audio/paused'](id)
    }
  },
  mounted() {
    this.$emit('mounted')
  }
  
}
</script>

<style lang="scss">
  .graph-player {
    width: 100%;
    min-width: 200px;
    height: 160px;
    max-height: 200px;
    position: relative;
    background-color: $lightgrey;
/*    flex-wrap: wrap;*/
    overflow: hidden;
    box-shadow: 0 3px 4px $medblack;
    > * {
/*
      display: flex;
       max-width: 25%; 
      flex-basis: 1.3em;
      box-sizing: border-box;
      align-items: center;
      justify-content: center;
*/
/*      margin: auto auto;*/
    }
    div {
      background-color: $darkgrey;
      color: $darkwhite;
    }
  }
  /* GRID LAYOUTS */
  .graph-player {
    display: grid;
    grid-template-columns: 5em 40% 1fr 5em;
    grid-template-rows: 1fr auto 2em 1fr;
    .play-pause-button {
      grid-column: 1 / 2;
      grid-row: 1 / 2;
    }
    .title {
      grid-column: 1 / 2;
      grid-row: 2 / 4;
      overflow: scroll;
      opacity: 0;
    }
    .player-waveform {
      grid-column: 2 / 3;
      grid-row: 1 / 3;
    }
    .audio-scrubber {
      grid-column: 2 / 3;
      grid-row: 3 / 4;
    }
    .timebar {
      grid-column: 2 / 3;
      grid-row: 1 / 4;
    }
    .visualizer {
      grid-column: 3 / 4;
      grid-row: 1 / 3;
    }
    .timecode {
      @include column(center, center);
      grid-column: 3 / 4;
      grid-row: 3 / 4;
      align-items: center;
      justify-content: center;
    }
    .user-actions {
      grid-column: 4 / 5;
      grid-row: 1 / 4;
      display: flex;
      flex-wrap: wrap;
      .button {
        width: 50%;
        height: 33%;
        box-sizing: border-box;
        font-size: 10px;
      }
    }
    .tracks {
      grid-column: 1 / 4;
      grid-row: 4 / 5;
    }
  }
  
  .popup-content .graph-player {
      grid-template-columns: 4em 50% 1fr;
  }
  
  .compact.graph-player {
    height: 2em;
    grid-template-columns: 2em 60% 1fr;
    grid-template-rows: 2em 1fr;
    .title {
      grid-column: 1 / 4;
      grid-row: 2 / 3;
    }
    .audio-scrubber {
      grid-column: 2 / 3;
      grid-row: 1 / 2;
    }
    .timecode {
      grid-column: 3 / 4;
      grid-row: 1 / 2;
    }
  }
  
  .title {
    padding: 3px;
  }
  
 
  
  .timebar {
    @include column;
    height: 100%;
    input {
      position: relative;
      z-index: 2;
    }
/*
    > div {
      position: relative;
      height: 100%;
      background-color: blue;
    }
*/
  }
  
  .visualizer {
    
  }
  
  .filler {
    width: 100%;
    max-width: none;
    background-color: transparent !important;
  }
  
  /* EXTRA */
  @keyframes sound {
      0% {
        top: 50%; 
      }
      100% {
       top: 40%;   
      }
  }
  .cluster.is-playing {
    .cube {
      //animation: sound 600ms -800ms linear infinite alternate;
    }
    .minecraft.minecraft-icon {
      background-color: $darkwhite;
      box-shadow: 2px 2px 2px $darkpurple;
    }
  }

</style>