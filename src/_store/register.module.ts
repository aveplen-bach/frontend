import { RegisterRequest } from "@/_services/model/register";
import { adminService } from "@/_services/users";
import { Commit, Dispatch } from "vuex";

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
    async register(
      { commit, dispatch }: { commit: Commit; dispatch: Dispatch },
      req: RegisterRequest
    ) {
      commit("registerRequest");

      try {
        await adminService.register(req);
        await commit("registerSuccess");
        await dispatch("users/getUsers", {}, { root: true });
      } catch (error) {
        await commit("registerFailure", "ошибка регистрации");
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
