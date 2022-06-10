import { Commit } from "vuex";

export enum AlertType {
  none,
  success,
  error,
}

export interface AlertState {
  type: AlertType;
  message: string;
}

export const alert = {
  namespaced: true,

  state: {
    type: AlertType.none,
    message: "",
  },

  actoins: {
    success({ commit }: { commit: Commit }, message: string) {
      commit("success", message);
    },
    error({ commit }: { commit: Commit }, message: string) {
      commit("error", message);
    },
    clear({ commit }: { commit: Commit }) {
      commit("clear");
    },
  },

  mutations: {
    success(state: AlertState, message: string) {
      state.type = AlertType.success;
      state.message = message;
    },
    error(state: AlertState, message: string) {
      state.type = AlertType.error;
      state.message = message;
    },
    clear(state: AlertState) {
      state.type = AlertType.none;
      state.message = "";
    },
  },
};
