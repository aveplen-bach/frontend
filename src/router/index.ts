import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import AboutView from "@/views/AboutView.vue";
import DashboardView from "@/views/DashboardView.vue";
import BusyboardView from "@/views/BusyboardView.vue";
import LoginView from "@/views/LoginView.vue";
import ProtectedView from "@/views/ProtectedView.vue";

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
    path: "/busyboard",
    name: "busyboard",
    component: BusyboardView,
  },
  {
    path: "/protected",
    name: "protected",
    component: ProtectedView,
  },
  {
    path: "*",
    redirect: "/about",
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
