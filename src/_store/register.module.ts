import { RegisterRequest } from "@/_services/model/register";
import { adminService } from "@/_services/users";
import { Commit } from "vuex";

export enum RegisterStatus {
  initial = 1,
  sending,
  success,
  failure,
}

export interface RegisterState {
  status: RegisterStatus;
  error: string;
}

export const register = {
  namespaced: true,
  state: {
    status: RegisterStatus.initial,
  },

  actions: {
    async register({ commit }: { commit: Commit }, req: RegisterRequest) {
      commit("registerRequest");

      try {
        await adminService.register(req);
        commit("registerSuccess");
      } catch (error) {
        console.error(error);
        commit("registerFailure", error);
      }
    },

    setError({ commit }: { commit: Commit }, error: string) {
      commit("registerFailure", error);
    },

    resetError({ commit }: { commit: Commit }) {
      commit("registerReset");
    },
  },

  mutations: {
    registerReset(state: RegisterState) {
      state.status = RegisterStatus.initial;
    },
    registerRequest(state: RegisterState) {
      state.status = RegisterStatus.sending;
    },
    registerSuccess(state: RegisterState) {
      state.status = RegisterStatus.success;
    },
    registerFailure(state: RegisterState, error: string) {
      state.status = RegisterStatus.failure;
      state.error = error;
    },
  },
};
