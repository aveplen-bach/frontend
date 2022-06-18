import { adminService } from "@/_services/users";
import { User } from "@/_services/model/user";
import { Commit, Dispatch } from "vuex";
import { RegisterRequest } from "@/_services/model/register";

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
    async getUsers({
      commit,
      dispatch,
    }: {
      commit: Commit;
      dispatch: Dispatch;
    }) {
      await commit("getUsersRequest");

      try {
        //
        const users = await adminService.getUsers();
        await commit("getUsersSuccess", users);
        await dispatch("alert/clear", {}, { root: true });
        await dispatch(
          "alert/success",
          "успешное получение списка пользователей",
          { root: true }
        );
        //
      } catch (error) {
        //
        await dispatch("alert/error", "ошибка получения списка пользователей", {
          root: true,
        });
        //
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
