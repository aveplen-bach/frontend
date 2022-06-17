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
import HelloView from "@/hello/HelloView.vue";

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
    path: "/hello",
    name: "hello",
    component: HelloView,
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

export default router;
