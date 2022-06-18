import { parseAuthentication } from "@/_helpers/ls-to-auth";
import router from "@/_helpers/router";
import { authService } from "@/_services/auth";
import { Authentication } from "@/_services/model/auth";
import { useRouter } from "vue-router";
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
        await authService.login(username, password, photo);
        await dispatch("authenticated");
        router.push("/protected");
      } catch (error) {
        await commit("loginFailure", error);
        await dispatch("alert/error", "ошибка аутентификации", { root: true });
      }
    },

    async logout({ commit, dispatch }: { commit: Commit; dispatch: Dispatch }) {
      try {
        await authService.logout();
        await commit("logout");
        router.push("/login");
      } catch (error) {
        await dispatch("alert/error", "ошибка окончания сессии", {
          root: true,
        });
      }
    },

    async authenticated({
      commit,
      dispatch,
    }: {
      commit: Commit;
      dispatch: Dispatch;
    }) {
      commit("loginRequest");
      try {
        await authService.authenticated();
        commit("loginSuccess");
      } catch (error) {
        commit("loginFailure", error);
        dispatch("alert/error", "ошибка проверки аутентификации", {
          root: true,
        });
      }
    },

    loginSuccess({ commit }: { commit: Commit }, auth: Authentication) {
      commit("loginSuccess", auth);
    },
  },

  mutations: {
    loginRequest(state: AuthState) {
      state.status = AuthStatus.loggingIn;
    },

    loginSuccess(state: AuthState, auth: Authentication) {
      state.status = AuthStatus.loggedIn;
      state.auth = auth;
    },

    loginFailure(state: AuthState) {
      state.status = AuthStatus.notLoggedIn;
      state.auth = undefined;
    },

    logout(state: AuthState) {
      state.status = AuthStatus.notLoggedIn;
      state.auth = undefined;
    },
  },
};
