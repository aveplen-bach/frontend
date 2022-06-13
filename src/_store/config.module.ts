import { configService } from "@/_services/config";
import { UpdateFacerecConfigRequest as FacerecConfigRequest } from "@/_services/model/config";
import { Commit } from "vuex";

export enum ConfigStatus {
  initial = 1,
  sending,
  success,
  failure,
}

export interface ConfigState {
  status: ConfigStatus;
  error: string;
}

export const register = {
  namespaced: true,
  state: {
    status: ConfigStatus.initial,
  },

  actions: {
    async updateFacerecConfig(
      { commit }: { commit: Commit },
      req: FacerecConfigRequest
    ) {
      commit("configRequest");

      try {
        await configService.updateFacerecConfig(req);
        commit("configSuccess");
      } catch (error) {
        console.error(error);
        commit("configFailure", error);
      }
    },

    setError({ commit }: { commit: Commit }, error: string) {
      commit("configFailure", error);
    },

    resetError({ commit }: { commit: Commit }) {
      commit("configReset");
    },
  },

  mutations: {
    configReset(state: ConfigState) {
      state.status = ConfigStatus.initial;
    },
    configRequest(state: ConfigState) {
      state.status = ConfigStatus.sending;
    },
    configSuccess(state: ConfigState) {
      state.status = ConfigStatus.success;
    },
    configFailure(state: ConfigState, error: string) {
      state.status = ConfigStatus.failure;
      state.error = error;
    },
  },
};
