import { helloService } from "@/_services/hello";
import { Commit, Dispatch } from "vuex";

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
        debugger;
        const auth = await helloService.hello(helloToken, helloKey, helloIv);
        commit("helloSuccess");
        dispatch("resource/access", {}, { root: true });
        dispatch("auth/loginSuccess", auth, { root: true });
      } catch (error) {
        console.error(error);
        commit("helloFailure", error);
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
