<template>
  <footer>
    <router-link to="/">首页</router-link>
    <router-link to="/black-hole">黑洞</router-link>
    <router-link to="/friends">好友</router-link>
    <router-link to="/notifications">通知</router-link>
  </footer>
</template>

<script setup></script>

<style scoped>
footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 50px;
  background-color: #f8f9fa;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

footer a {
  color: #007bff;
  text-decoration: none;
}

footer a:hover {
  text-decoration: underline;
}

footer a.router-link-exact-active {
  color: #42b983;
}
</style>
