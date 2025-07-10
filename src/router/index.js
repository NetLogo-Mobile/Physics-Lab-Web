import { createRouter, createWebHashHistory } from "vue-router";
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
    meta: { keepAlive: false },
  },
  {
    path: "/list/:config",
    name: "list",
    component: () => import("../views/WorkList.vue"),
    meta: { keepAlive: true },
  },
  {
    path: "/:catchAll(.*)",
    component: () => import("../views/NotFound.vue"),
    meta: { keepAlive: true },
  },
];

const router = createRouter({
  history: createWebHashHistory("/Physics-Lab-Web/"),
  routes,
});

// router.beforeEach((to, from, next) => {
//   if (to.name === 'Home') {
//     // 预加载
//     Promise.all([
//       import('../components/messages/MessageList.vue')
//     ]).then(() => {
//       next();
//     });
//   } else {
//     next();
//   }
// });

Emitter.on("loginRequired", () => {
  Emitter.emit("error", "当前操作需要登录", 3);
  router.push("/");
});

export default router;
