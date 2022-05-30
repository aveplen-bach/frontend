import { Commit, createStore } from "vuex";

export default createStore({
    state: {
        authenticated: false,
    },
    getters: {
        isAuthenticated: (state: { authenticated: boolean }) => state.authenticated
    },
    mutations: {
        SET_AUTHENTICATED: (state: { authenticated: boolean }, auth: boolean) => state.authenticated = auth,
    },
    actions: {
        setAuthenticated: ({ commit }: { commit: Commit }, auth: boolean) => commit("SET_AUTHENTICATED", auth),
    },
    modules: {},
});
