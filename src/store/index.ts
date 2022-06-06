import { base64ToArrayBuffer } from "@/tetatet/cryptoutil";
import login from "@/tetatet/login";
import { LoginRequest } from "@/tetatet/model/login";
import { RegisterRequest } from "@/tetatet/model/register";
import { User } from "@/tetatet/model/user";
import AdminService from "@/tetatet/service/admin";
import CryptoService from "@/tetatet/service/crypto";
import OpenService from "@/tetatet/service/open";
import ProtectedService from "@/tetatet/service/protected";
import TokenService from "@/tetatet/service/token";
import axios from "axios";
import { InjectionKey } from "vue";
import { Commit, createStore, Dispatch, Store } from "vuex";

export interface State {
  services: Services;
  protected: Protected;
  dashboard: Dashboard;
}

interface Services {
  adminService: AdminService | null;
  cryptoService: CryptoService | null;
  openService: OpenService;
  protectedService: ProtectedService | null;
  tokenService: TokenService | null;
}

interface Protected {
  isAuthenticated: boolean;
}

interface Dashboard {
  userList: UserList;
  settings: Settings;
}

interface UserList {
  users: User[];
}

interface Settings {
  ack: boolean;
}

export const key: InjectionKey<Store<State>> = Symbol();

export default createStore<State>({
  state: {
    services: {
      adminService: null,
      cryptoService: null,
      openService: new OpenService(),
      protectedService: null,
      tokenService: null,
    },
    protected: {
      isAuthenticated: false,
    },
    dashboard: {
      userList: {
        users: [
          {
            userId: 1,
            username: "username1",
            createdAt: new Date(),
            updatedAt: new Date(),
            admin: false,
          },
          {
            userId: 2,
            username: "username2",
            createdAt: new Date(),
            updatedAt: new Date(),
            admin: true,
          },
        ],
      },
      settings: {
        ack: true,
      },
    },
  },

  mutations: {
    SERVICES_SET_ADMIN_SERVICE: (
      state: State,
      { adminService }: { adminService: AdminService }
    ) => {
      state.services.adminService = adminService;
    },

    SERVICES_SET_CRYPTO_SERVICE: (
      state: State,
      { cryptoService }: { cryptoService: CryptoService }
    ) => {
      state.services.cryptoService = cryptoService;
    },

    SERVICES_SET_OPEN_SERVICE: (
      state: State,
      { openService }: { openService: OpenService }
    ) => {
      state.services.openService = openService;
    },
    SERVICES_SET_PROTECTED_SERVICE: (
      state: State,
      { protectedService }: { protectedService: ProtectedService }
    ) => {
      state.services.protectedService = protectedService;
    },

    SERVICES_SET_TOKEN_SERVICE: (
      state: State,
      { tokenService }: { tokenService: TokenService }
    ) => {
      state.services.tokenService = tokenService;
    },

    SET_AUTHENTICATED: (
      state,
      { isAuthenticated }: { isAuthenticated: boolean }
    ) => {
      state.protected.isAuthenticated = isAuthenticated;
    },

    DASHBOARD_USERLIST_SET_USERS: (state, { users }: { users: User[] }) => {
      state.dashboard.userList.users = users;
    },
  },

  actions: {
    async login(
      { commit, dispatch }: { commit: Commit; dispatch: Dispatch },
      req: LoginRequest
    ) {
      const res = await login("http://localhost:8081/api/open/login", req);

      const tokenService = new TokenService(res.token, res.key, res.iv);
      const cryptoService = new CryptoService(res.key, res.iv);
      const adminService = new AdminService(tokenService, cryptoService);
      const protectedService = new ProtectedService(tokenService);

      commit("SERVICES_SET_ADMIN_SERVICE", { adminService });
      commit("SERVICES_SET_CRYPTO_SERVICE", { cryptoService });
      commit("SERVICES_SET_PROTECTED_SERVICE", { protectedService });
      commit("SERVICES_SET_TOKEN_SERVICE", { tokenService });

      dispatch("openAuthenicated");
    },

    async logout({
      commit,
      state,
      dispatch,
    }: {
      commit: Commit;
      state: State;
      dispatch: Dispatch;
    }) {
      const success = await state.services.protectedService?.logout();

      if (!success) {
        return;
      }

      commit("SERVICES_SET_ADMIN_SERVICE", { adminService: null });
      commit("SERVICES_SET_CRYPTO_SERVICE", { cryptoService: null });
      commit("SERVICES_SET_PROTECTED_SERVICE", { protectedService: null });
      commit("SERVICES_SET_TOKEN_SERVICE", { tokenService: null });

      dispatch("openAuthenicated");
    },

    async openAuthenicated({
      commit,
      state,
    }: {
      commit: Commit;
      state: State;
    }) {
      const isAuthenticated = await state.services.openService?.authenticated();
      commit("SET_AUTHENTICATED", { isAuthenticated });
    },

    async protectedAuthenticated({
      commit,
      state,
    }: {
      commit: Commit;
      state: State;
    }) {
      const isAuthenticated =
        await state.services.protectedService?.authenticated();
      commit("SET_AUTHENTICATED", { isAuthenticated });
    },

    async adminUsers({ commit, state }: { commit: Commit; state: State }) {
      const users = await state.services.adminService?.getUsers();
      commit("DASHBOARD_USERLIST_SET_USERS", { users });
    },

    async adminRegister(
      { state, dispatch }: { state: State; dispatch: Dispatch },
      req: RegisterRequest
    ) {
      const success = await state.services.adminService?.register(req);
      if (!success) {
        console.log("could not register user");
      }
      dispatch("adminUsers");
    },

    async hello({ commit, dispatch }: { commit: Commit; dispatch: Dispatch }) {
      const res = await axios.post("http://localhost:8081/api/open/hello", {
        userId: new Date().getTime(),
      });

      const token = res.data?.token;
      const keyb = base64ToArrayBuffer(res.data?.key);
      const iv = base64ToArrayBuffer(res.data?.iv);

      const key = await window.crypto.subtle.importKey(
        "raw",
        keyb,
        "AES-CBC",
        true,
        ["encrypt", "decrypt"]
      );

      const tokenService = new TokenService(token, key, iv);
      const cryptoService = new CryptoService(key, iv);
      const adminService = new AdminService(tokenService, cryptoService);
      const protectedService = new ProtectedService(tokenService);

      commit("SERVICES_SET_ADMIN_SERVICE", { adminService });
      commit("SERVICES_SET_CRYPTO_SERVICE", { cryptoService });
      commit("SERVICES_SET_PROTECTED_SERVICE", { protectedService });
      commit("SERVICES_SET_TOKEN_SERVICE", { tokenService });

      dispatch("openAuthenicated");
    },
  },
  getters: {},
  modules: {},
});
