import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import BlackHole from "../views/BlackHole.vue";
import Test from "../views/test.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/black-hole",
    name: "BlackHole",
    component: BlackHole,
  },
  {
    path: "/t",
    name: "test",
    component: Test,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
