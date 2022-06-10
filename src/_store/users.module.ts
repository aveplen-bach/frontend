import { adminService } from "@/_services/admin";
import { User } from "@/_services/model/user";
import { Commit } from "vuex";

export enum UsersStatus {
  loading = 1,
  loaded,
  failure,
}

export interface UsersState {
  users: User[];
  status: UsersStatus;
  error: string;
}

export const users = {
  namespaced: true,
  state: {
    users: [],
  },

  actions: {
    async getUsers({ commit }: { commit: Commit }) {
      commit("getUsersRequest");

      try {
        const users = await adminService.getUsers();
        commit("getUsersSuccess", users);
      } catch (error) {
        console.error(error);
        commit("getUsersFailure", error);
      }
    },
  },

  mutations: {
    getUsersRequest(state: UsersState) {
      state.status = UsersStatus.loading;
    },
    getUsersSuccess(state: UsersState, users: User[]) {
      state.status = UsersStatus.loaded;
      state.users = users;
    },
    getUsersFailure(state: UsersState, error: string) {
      state.status = UsersStatus.failure;
      state.error = error;
    },
  },
};
