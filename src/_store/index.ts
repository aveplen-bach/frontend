import { InjectionKey } from "vue";
import { createStore, Store } from "vuex";
import { alert, AlertState } from "./alert.module";
import { auth, AuthState } from "./auth.module";
import { users, UsersState } from "./users.module";
import { resource, ResourceState } from "./resource.module";

export interface State {
  alert?: AlertState;
  users?: UsersState;
  auth?: AuthState;
  resource?: ResourceState;
}

export const key: InjectionKey<Store<State>> = Symbol();
export default createStore<State>({
  modules: {
    alert,
    users,
    auth,
    resource,
  },
});
