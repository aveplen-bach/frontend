import axios from "axios";
import { createStore } from "vuex";

export default createStore({
    state: {
        users: [],
        token: "",
    },
    getters: {},
    mutations: {
        SET_TOKEN: (state: { token: string }, token: string) => state.token = token,
        SET_USERS: (state, users) => state.users = users,
    },
    actions: {
        setToken: ({ commit }: { commit: Commit }, token: string) => commit("SET_TOKEN", token),
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
    modules: {},
});
