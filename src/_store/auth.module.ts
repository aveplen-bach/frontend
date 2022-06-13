import { base64ToArrayBuffer, importKey } from "@/_helpers/crypto";
import { authService } from "@/_services/auth";
import { Authentication } from "@/_services/model/auth";
import { Commit, Dispatch } from "vuex";

export enum AuthStatus {
  notLoggedIn = 0,
  loggingIn,
  loggedIn,
}

export interface AuthState {
  status: AuthStatus;
  auth?: Authentication;
}

const authentication = localStorage.getItem("authentication");
const initialState: AuthState = {
  status: AuthStatus.notLoggedIn,
};

if (authentication) {
  const authp = JSON.parse(authentication);
  initialState.auth = {
    username: authp.username,
    key: await importKey(authp.key),
    iv: base64ToArrayBuffer(authp.iv),
    raw: authp.raw,
  };

  initialState.status = AuthStatus.loggedIn;
}

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
      commit("loginRequest");

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
