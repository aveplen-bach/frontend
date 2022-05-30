import axios from "axios";
import { createStore } from "vuex";

export default createStore({
  state: {
    users: [],
  },
  getters: {},
  actions: {
    async fetchUsers({ commit }) {
      try {
        const data = await axios.get("http://localhost:8081/api/v1/users");
        commit("SET_USERS", data.data);
      } catch (err) {
        alert(err);
        console.log(err);
      }
    },
  },
  mutations: {
    SET_USERS(state, users) {
      state.users = users;
    },
  },
  modules: {},
});
