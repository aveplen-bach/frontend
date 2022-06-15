import { helloService } from "@/_services/hello";
import { Commit } from "vuex";

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
      { commit }: { commit: Commit },
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
        await helloService.hello(helloToken, helloKey, helloIv);
        commit("helloSuccess");
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
