import { InjectionKey } from "vue";
import { createStore, Store } from "vuex";
import { alert, AlertState } from "./alert.module";
import { auth, AuthState } from "./auth.module";
import { users, UsersState } from "./users.module";
import { resource, ResourceState } from "./resource.module";
import { register, RegisterState } from "./register.module";
import { config, ConfigState } from "./config.module";

export interface State {
  alert?: AlertState;
  users?: UsersState;
  auth?: AuthState;
  resource?: ResourceState;
  register?: RegisterState;
  config?: ConfigState;
}

export const key: InjectionKey<Store<State>> = Symbol();
export default createStore<State>({
  modules: {
    alert,
    users,
    auth,
    resource,
    register,
    config,
  },
});
