import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: { keepAlive: true },
  },
  {
    path: "/black-hole",
    name: "BlackHole",
    component: () => import("../views/BlackHole.vue"),
    meta: { keepAlive: true },
  },
  {
    path: "/notifications",
    name: "notifications",
    component: () => import("../views/Notifications.vue"),
    meta: { keepAlive: false },
  },
  {
    path: "/messages",
    name: "messages",
    component: () => import("../views/Messages.vue"),
     meta: { keepAlive: true },
  },
  {
    path: "/ExperimentSummary/:category/:id/:image",
    name: "ExperimentSummary",
    component: () => import("../views/ExperimentSummary.vue"),
    meta: { keepAlive: true },
  },
  {
    path: "/:catchAll(.*)",
    component: () => import("../views/NotFound.vue"),
    meta: { keepAlive: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
