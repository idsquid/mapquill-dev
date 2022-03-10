import VueRouter from 'vue-router'
import store from '@/store/store.js'

// full page spreads
import MapFull from '@/views/web/sections/static/MapFull2.vue'
import Edit from '@/views/web/sections/static/Edit.vue'
import Error from '@/views/web/sections/static/Error.vue'

// child views
import VoxelEdit from '@/views/web/sections/voxels/VoxelEdit.vue'
import FilesEdit from '@/views/web/sections/structure/StructureEdit.vue'


const routes = [
  { path: '/error', name: 'error', component: Error},
  { path: '/:username/map/:env/post/:audioId', name: 'edit', component: Edit,
    children: [
      { path: 'editor', component: VoxelEdit, name: 'voxels' 
      },
      { path: 'files', component: FilesEdit, name: 'files' 
      }
    ]
  },
  { path: '/:username/map/:env', name: 'map', component: MapFull },
  { path: '/:env', redirect: to => ({
    name: 'map',
    params: {
      username: 'public',
      env: to.params.env
    }
  })},
  { path: '/', redirect: '/public/map/public'}
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  const requiredFields = ['username', 'env']
  
  let goodParams = true
  requiredFields.forEach((n) => {
    if (!to.params[n] || to.params[n].length <= 0) goodParams = false 
  })
  
  if (to.name == 'error') {
    next()
  } else if (!goodParams) { 
    next('/error')
  } else {
    // Authorized (ha)
    store.commit('user/touchState', {
      name: to.params.username,
      env: to.params.env  
    })
    
    next()
  }
  
  
})

export default router