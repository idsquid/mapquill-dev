<template>
<div class="post-create no-file" v-if="!file">
  <label class="file-select">
<!--    <v-icon name="cloud-upload-alt" class="select-button"></v-icon>-->
    <span class="a-link">add new</span>
    <input type="file" @change="setFile"/>
  </label>
</div>

<div v-else class="post-create yes-file">
  <post-form :thePost="thePost" :theFile="file"></post-form>
</div>

</template>

<script>
  import AuwalkPost from '@/components/AuwalkPost.js'
  import PostForm from '@/views/web/sections/post/PostForm.vue'
  
  export default {
  name: 'auwalk-file-select',
  emits: ['update'],
    components: {
      PostForm
    },
  data() {
    return {
      thePost: new AuwalkPost({
        'audioPostType': 'content'
      }),
      file: null,
      fileSize: null,
      fileType: null,
      mimeType: null
    }
  },
  computed: {
    fileUrl() {
     const url = window.URL.createObjectURL(this.file)
     //console.log(url)
      return url
    }
  },
  methods: {
    handleFileChange(e) {
      const file = e.target.files[0]
      //store.commit('updateAudioFile', file)
      this.$emit('update', file)
    },
    setFile: function(e) { // emitted from file-select
      const f = e.target.files[0]
      
      this.file = f
      this.fileSize = f.size
      
      const id = this.$store.getters['posts/activeStructure'].audioId,
            latLng = this.$store.getters['quill/latLng'],
            newPost = new AuwalkPost({
              audioId: id,
              createdAt: Date.now(),
              audioLatLng: latLng,
              audioPostType: 'content',
              mimeType: f.type.split('/')[0],
              audioMime: f.type.split('/')[0],
              audioFile: this.file,
              audioUrl: this.fileUrl
            })
      
      this.$store.commit('posts/addPost', newPost)
      
      this.file = null
      
    }
  }
}
</script>

<style scoped lang="scss">
.file-select > .select-button {
  background-color: #99999999;
  cursor: pointer;
      &:hover {
        transform: scale(1.05);
        opacity: .9;
      }
}
/*newer  */
  .file-select .fa-icon {
    box-shadow: -2px 2px 6px 0 black;
    padding: 10px;
    border-radius: 8PX;
    CURSOR: POINTER;

  }
  
.file-select img {
  
}

.file-select > input[type="file"] {
  display: none;
}
  img.upload-icon {
      
    }
</style>