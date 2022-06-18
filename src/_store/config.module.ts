import { configService } from "@/_services/config";
import { UpdateFacerecConfigRequest as FacerecConfigRequest } from "@/_services/model/config";
import { Commit, Dispatch } from "vuex";

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

export const config = {
  namespaced: true,
  state: {
    status: ConfigStatus.initial,
  },

  actions: {
    async updateFacerecConfig(
      { commit, dispatch }: { commit: Commit; dispatch: Dispatch },
      distance: string
    ) {
      await commit("configRequest");

      try {
        await configService.updateFacerecConfig({ distanceStr: distance });
        await commit("configSuccess");
      } catch (error) {
        // await commit("configFailure", error);
        await dispatch("alert/error", "ошибка обновления конфигурации", {
          root: true,
        });
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
