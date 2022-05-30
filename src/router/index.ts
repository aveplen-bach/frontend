import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import LoginView from "@/views/LoginView.vue";
import SneakyLoginView from "@/views/SneakyLoginView.vue";
import RegisterView from "@/views/RegisterView.vue";
import DashboardView from "@/views/DashboardView.vue";

const routes: Array<RouteRecordRaw> = [
    { path: "/", component: HomeView },
    { path: "/login", component: LoginView },
    { path: "/sneaky-login", component: SneakyLoginView },
    { path: "/register", component: RegisterView },
    { path: "/dashboard", component: DashboardView },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

export default router;
