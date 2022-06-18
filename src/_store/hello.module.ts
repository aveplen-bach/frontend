import { helloService } from "@/_services/hello";
import { useRouter } from "vue-router";
import { Commit, Dispatch } from "vuex";
import router from "@/_helpers/router";

export enum HelloStatus {
  initial = 1,
  sending,
  success,
  failure,
}

export interface HelloState {
  status: HelloStatus;
  error: string;
}

export const hello = {
  namespaced: true,
  state: {
    status: HelloStatus.initial,
  },

  actions: {
    async hello(
      { commit, dispatch }: { commit: Commit; dispatch: Dispatch },
      {
        helloToken,
        helloKey,
        helloIv,
      }: {
        helloToken: string;
        helloKey: string;
        helloIv: string;
      }
    ) {
      commit("helloRequest");
      try {
        //
        const auth = await helloService.hello(helloToken, helloKey, helloIv);
        await commit("helloSuccess");
        await dispatch("auth/loginSuccess", auth, { root: true });
        await router.push("/dashboard");
        await dispatch("alert/clear", {}, { root: true });
        await dispatch("alert/success", "успешная локальная авторизация", {
          root: true,
        });
        //
      } catch (error) {
        //
        await dispatch("alert/error", "ошибка локальной авторизации", {
          root: true,
        });
        //
      }
    },

    setError({ commit }: { commit: Commit }, error: string) {
      commit("helloFailure", error);
    },

    resetError({ commit }: { commit: Commit }) {
      commit("helloReset");
    },
  },

  mutations: {
    helloReset(state: HelloState) {
      state.status = HelloStatus.initial;
    },

    helloRequest(state: HelloState) {
      state.status = HelloStatus.sending;
    },

    helloSuccess(state: HelloState) {
      state.status = HelloStatus.success;
    },

    helloFailure(state: HelloState, error: string) {
      state.status = HelloStatus.failure;
      state.error = error;
    },
  },
};
