import { authService } from "@/_services/auth";
import { User } from "@/_services/model/user";
import { resourceService } from "@/_services/resource";
import { Commit, Dispatch } from "vuex";

export enum ResourceStatus {
  loading = 1,
  loaded,
  failure,
}

export interface ResourceState {
  authenticated: boolean;
  status: ResourceStatus;
  error: string;
}

export const resource = {
  namespaced: true,
  state: {
    authenticated: false,
    status: ResourceStatus.loading,
  },

  actions: {
    async access({ commit, dispatch }: { commit: Commit; dispatch: Dispatch }) {
      await commit("accessResourceRequest");
      try {
        const authenticated = await resourceService.access();
        await commit("accessResourceSuccess", authenticated);
      } catch (error) {
        // await commit("accessResourceFailure", error);
        await dispatch("alert/error", "ошибка доступа к ресурсу", {
          root: true,
        });
      }
    },
  },

  mutations: {
    accessResourceRequest(state: ResourceState) {
      state.status = ResourceStatus.loading;
    },
    accessResourceSuccess(state: ResourceState, authenticated: boolean) {
      state.status = ResourceStatus.loaded;
      state.authenticated = authenticated;
    },
    accessResourceFailure(state: ResourceState, error: string) {
      state.status = ResourceStatus.failure;
      state.error = error;
    },
  },
};
