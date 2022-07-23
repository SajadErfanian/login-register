import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    userMobile: "",
    rules: [
      (value) => !!value || "Required.",
      (value) => (value && value.length == 11) || "11 characters",
    ],
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