import { authService } from "@/_services/auth";
import { User } from "@/_services/model/user";
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

export const users = {
  namespaced: true,
  state: {
    authenticated: false,
  },

  actions: {
    async accessResource({ commit }: { commit: Commit }) {
      // commit("getUsersRequest");
      //   try {
      //     const users = await adminService.getUsers();
      //     commit("getUsersSuccess", users);
      //   } catch (error) {
      //     console.error(error);
      //     commit("getUsersFailure", error);
      //   }
    },
  },

  mutations: {
    // accessResourceRequest(state: ResourceState) {
    //   state.status = ResourceStatus.loading;
    // },
    // accessResourceSuccess(state: ResourceState, authenticated: boolean) {
    //   state.status = ResourceStatus.loaded;
    //   state.authenticated = authenticated;
    // },
    // accessResourceFailure(state: ResourceState, error: string) {
    //   state.status = ResourceStatus.failure;
    //   state.error = error;
    // },
  },
};
