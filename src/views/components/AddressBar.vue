<template>
  <geo-frame ref="geocoder">
    <div id="address-bar" slot-scope="{}">
      <div class="user-search" v-if="barActive">
          <input v-model='userQuery' placeholder="address search" v-on:keyup.enter="search">
          <div class="column centered input-button-container">
            <button @click="search">go</button>
          </div>
      </div>
      <button @click="geoposition">GPS</button>
      
      <!-- fiddler icon -->
        <slot></slot>
      
    </div>
  </geo-frame>
</template>

<script>
  import Vue from 'vue'
  import GeocodingFrame from '@/components/GeocodingFrame.vue'  
  
  export default Vue.extend({
    name: 'UiGeolocation',
    components: {
      'geo-frame': GeocodingFrame
    },
    data: function() {
      return {
        userQuery: null,
        open: true
      }
    },
    computed: {
      barActive: function() {
        return this.open
      }
    },
    methods: {
      toggleBar: function() {
        this.open = !this.open
      },
      async search() {
        this.$store.commit('setLoadingState', 'Searching...')
        this.$store.commit(
          'updateUserSearchLocation',
          false
        )
        var d = await this.$refs.geocoder.searchAddress(this.userQuery)
        this.$store.commit('setLoadingState', '')
        //this.$store.commit('setAppState', 'map-view')

        var streetName = this.processDisplayName(d)
        var latLng = {
          lat: d[0].lat,
          lng: d[0].lon
        }
        //console.log(latLng + ' ' + streetName)
        this.$store.commit(
          'updateUserSearchLatLng',
          latLng
        )
        this.$store.commit(
          'updateAudioLatLng',
          latLng
        )
        this.$store.commit(
          'updateUserSearchLocation',
          streetName
        )
        this.$store.commit(
          'updateUserLocation',
          d[0].display_name
        )
        this.$store.commit(
          'updateAudioLocation',
          d[0].display_name
        )
        //
        this.$emit('searchComplete')
      },
      async geoposition() {
        this.$store.commit('setLoadingState', 'GPS working...')
        var d = await this.$refs.geocoder.fetchAddress()
        this.$store.commit('setLoadingState', '')
        this.userLocation = d.address.town
        this.userLatLng = {
          lat: Number.parseFloat(d.lat).toFixed(7),
          lng: Number.parseFloat(d.lon).toFixed(7)
        }
        this.$store.commit(
          'updateUserLatLng',
          this.userLatLng
        )
      },
      processDisplayName(d) {
        var r = d[0].display_name.split(','),
            n = r.length > 1 ? r[3] : r[0]
        return n
      }
    }
  })
</script>

<style lang="scss">
  #address-bar {
    display: flex;
/*    width: 40%;*/
    width: calc(100% - 2px);
    border: 1px solid rgba(0,0,0,.5);
/*    border-radius: 2em;*/
/*    margin: 0 .5em 1.5em 0;*/
/*    background-color: rgba(0,0,0,.5);*/
    
    .user-search {
      width: 100%;
      display: flex;
      position: relative;
      input {
        width: 100%;
        padding: 1em;
/*        border-radius: 2em;*/
        border: none;
/*        box-shadow: 0 0 5px 0 black;*/
        outline: none;
        margin: 0;
      }
      .input-button-container {
/*        @include clickable;*/
        height: 100%;
        position: absolute;
        right: .5em;
        top: 0;
        button {
        /* height: 3em; */
        border: 1px solid #aaa;
        padding: .5em;
        /* display: block; */
        border-radius: 99em;
        }
      }
    }
  }
  #geo-header{
    display: flex;
  }
  #address-bar {
    
    
  }
   
</style>