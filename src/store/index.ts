import { Commit, createStore } from "vuex";

export default createStore({
    state: {
        token: "",
    },
    getters: {},
    mutations: {
        SET_TOKEN: (state: { token: string }, token: string) => state.token = token,
    },
    actions: {
        setToken: ({ commit }: { commit: Commit }, token: string) => commit("SET_TOKEN", token),
    },
    modules: {},
});
