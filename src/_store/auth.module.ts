import { authService } from "@/_services/auth";
import { Commit, Dispatch } from "vuex";

export enum AuthStatus {
  notLoggedIn = 0,
  loggingIn,
  loggedIn,
}

export interface AuthState {
  status: AuthStatus;
  user: any;
}

const user = localStorage.getItem("user");
const initialState = user
  ? { status: AuthStatus.loggedIn, user: JSON.parse(user) }
  : { status: AuthStatus.notLoggedIn };

export const auth = {
  namespaced: true,
  state: initialState,

  actions: {
    async login(
      { commit, dispatch }: { commit: Commit; dispatch: Dispatch },
      {
        username,
        password,
        photo,
      }: { username: string; password: string; photo: Blob }
    ) {
      commit("loginRequest", { username: "fjsdl" });

      try {
        await authService.login(username, password, photo);
        commit("loginSuccess", { username });
      } catch (error) {
        commit("loginFailure", error);
        dispatch("alert/error", error, { root: true });
      }
    },

    async logout({ commit, dispatch }: { commit: Commit; dispatch: Dispatch }) {
      try {
        await authService.logout();
        commit("logout");
      } catch (error) {
        dispatch("alert/error", error, { root: true });
      }
    },
  },

  mutations: {
    loginRequest(state: AuthState, { username }: { username: string }) {
      console.log("login request");
      state.status = AuthStatus.loggingIn;
      state.user = { username };
    },

    loginSuccess(state: AuthState, user: any) {
      console.log("login success");
      state.status = AuthStatus.loggedIn;
      state.user = user;
    },

    loginFailure(state: AuthState) {
      console.log("login failure");
      state.status = AuthStatus.notLoggedIn;
      state.user = null;
    },

    logout(state: AuthState) {
      console.log("logout");
      state.status = AuthStatus.notLoggedIn;
      state.user = null;
    },
  },
};
