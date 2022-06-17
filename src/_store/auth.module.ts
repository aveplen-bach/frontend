import { parseAuthentication } from "@/_helpers/ls-to-auth";
import { authService } from "@/_services/auth";
import { Authentication } from "@/_services/model/auth";
import { Commit, Dispatch, useStore } from "vuex";
import { key } from ".";

export enum AuthStatus {
  notLoggedIn = 0,
  loggingIn,
  loggedIn,
}

export interface AuthState {
  status: AuthStatus;
  auth?: Authentication;
}

(async () => {
  const authentication = localStorage.getItem("authentication");
  if (authentication) {
    const store = useStore(key);
    store.dispatch(
      "auth/loginSuccess",
      await parseAuthentication(JSON.parse(authentication))
    );
  }
})();

export const auth = {
  namespaced: true,
  state: {
    status: AuthStatus.notLoggedIn,
  },

  actions: {
    async login(
      { commit, dispatch }: { commit: Commit; dispatch: Dispatch },
      {
        username,
        password,
        photo,
      }: { username: string; password: string; photo: Blob }
    ) {
      commit("loginRequest");

      try {
        const auth = await authService.login(username, password, photo);
        commit("loginSuccess", auth);
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

    loginSuccess({ commit }: { commit: Commit }, auth: Authentication) {
      commit("loginSuccess", auth);
    },
  },

  mutations: {
    loginRequest(state: AuthState) {
      console.log("login request");
      state.status = AuthStatus.loggingIn;
    },

    loginSuccess(state: AuthState, auth: Authentication) {
      console.log("login success");
      state.status = AuthStatus.loggedIn;
      state.auth = auth;
    },

    loginFailure(state: AuthState) {
      console.log("login failure");
      state.status = AuthStatus.notLoggedIn;
      state.auth = undefined;
    },

    logout(state: AuthState) {
      console.log("logout");
      state.status = AuthStatus.notLoggedIn;
      state.auth = undefined;
    },
  },
};
