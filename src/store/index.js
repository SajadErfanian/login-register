import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    userMobile: "",
  },
  getters: {

  },
  mutations: {
    loginUser(state, newPhoneNumber) {
      state.userMobile = newPhoneNumber
    }
  },
  actions: {},
  modules: {},
});