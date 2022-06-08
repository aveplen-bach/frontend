import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import AboutView from "@/views/AboutView.vue";
import DashboardView from "@/views/DashboardView.vue";
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
    meta: {
      requiresAuth: false,
    },
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

export default router;
