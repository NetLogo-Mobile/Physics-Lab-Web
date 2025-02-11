import { createRouter, createWebHistory } from "vue-router";
import Emitter from "../services/eventEmitter";
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
    component: () => import("../views/Comments.vue"),
    meta: { keepAlive: true },
  },
  {
    path: "/ExperimentSummary/:category/:id",
    name: "ExperimentSummary",
    component: () => import("../views/ExperimentSummary.vue"),
    meta: { keepAlive: true },
  },
  {
    path: "/Comments/:category/:id/:name",
    name: "Comments",
    component: () => import("../views/Comments.vue"),
    meta: { keepAlive: false },
  },
  {
    path: "/profile/:id",
    name: "profile",
    component: () => import("../views/Profile.vue"),
    meta: { keepAlive: true },
  },
  {
    path: "/friends",
    name: "friends",
    component: () => import("../views/Friends.vue"),
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

Emitter.on("loginRequired", () => {
  router.push("/");
});

export default router;
