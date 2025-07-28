<template>
  <div class="container">
    <div class="title">PHYSICS LAB WEB</div>
    <div class="github" @click="f()">Github</div>
    <div class="slogan">By the Users ; For the Users</div>
  </div>
</template>

<script setup>
function f() {
  window.location.href = "https://github.com/NetLogo-Mobile/Physics-Lab-Web";
}
</script>

<style scoped>
.container {
  width: 100vw;
  height: 100vh;
  height: 100dvh;
  background-color: rgb(182, 185, 188);
}

.title {
  text-align: center;
  font-size: 8vw;
  font-weight: 800;
  color: white;
  padding-top: 10%;
  position: relative;
  z-index: 1;
}

.title::after {
  content: "PHYSICS LAB WEB";
  position: absolute;
  left: 0;
  top: 0;
  padding-top: 10%;
  width: 100%;
  z-index: -1;
  color: black;
  transform: translate(-8vw, 4vw) scaleY(0.5) skew(50deg);
  filter: blur(4px);
  mask: linear-gradient(transparent, black);
}

.github {
  opacity: 0;
  animation:
    fade-in 2s ease-in 2s forwards,
    shadow-pop-tl 2s cubic-bezier(0.47, 0, 0.745, 0.715) 1s both;
  width: fit-content;
  font-size: 2vw;
  margin: -1vw 13vw 0 auto;
}

.slogan {
  text-align: center;
  font-family: "Courier New", monospace;
  font-size: 2.5vw;
  font-weight: 600;
  color: lime;
  text-shadow: 0 0 5px rgba(0, 255, 0, 0.5);
  opacity: 0;
  animation:
    fade-in 0.1s ease-in 1s forwards,
    typewriter 3s steps(40) 1s forwards,
    blink-caret 0.75s step-end 1s infinite;
  overflow: hidden;
  white-space: nowrap;
  border-right: 2px solid lime;
  margin: 2vw auto;
  width: 0;
}

@keyframes typewriter {
  from {
    width: 0;
  }

  to {
    width: 30ch;
  }
}

@keyframes blink-caret {
  from,
  to {
    border-color: transparent;
  }

  50% {
    border-color: lime;
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes shadow-pop-tl {
  0% {
    box-shadow:
      0 0 white,
      0 0 white,
      0 0 white,
      0 0 white;
    transform: translateX(0) translateY(0);
  }

  100% {
    box-shadow:
      -1px -1px white,
      -2px -2px white,
      -3px -3px white,
      -4px -4px white;
    transform: translateX(4px) translateY(4px);
  }
}
</style>
