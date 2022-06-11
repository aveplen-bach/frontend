import {
  createRouter,
  createWebHistory,
  NavigationGuardNext,
  RouteLocationNormalized,
  RouteRecordRaw,
} from "vue-router";
import AboutView from "@/about/AboutView.vue";
import DashboardView from "@/dashboard/DashboardView.vue";
import LoginView from "@/login/LoginView.vue";
import ProtectedView from "@/resource/ProtectedView.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/about",
    name: "about",
    component: AboutView,
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: DashboardView,
  },
  {
    path: "/login",
    name: "login",
    component: LoginView,
  },
  {
    path: "/protected",
    name: "protected",
    component: ProtectedView,
  },
  {
    path: "/:catchAll(.*)",
    name: "NotFound",
    redirect: "/about",
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach(
  (
    to: RouteLocationNormalized,
    _from: RouteLocationNormalized,
    next: NavigationGuardNext
  ) => {
    const publicPages = ["/about", "/login"];
    const authRequired = !(publicPages.indexOf(to.path) + 1);
    const loggedIn = localStorage.getItem("authentication");

    if (authRequired && !loggedIn) {
      return next("/login");
    }

    next();
  }
);

export default router;
