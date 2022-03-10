const state = () => ({
  latLng: null,
  selectedId: null
})

const getters = {
  latLng(state) {
    return state.latLng
  },
  selectedStructure(state, getters, rootState, rootGetters) {
    const audioId = state.selectedId
    if (!audioId) {
      return null
    } else {
      return rootGetters['posts/structureById'](audioId)
    }
  }
}

const mutations = {
  updateLatLng(state, value) {
    state.latLng = value
  },
  updateSelectedId(state, value) {
    state.selectedId = value
  }
}

const actions = {
  
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}