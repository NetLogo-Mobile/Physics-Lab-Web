<template>
  <div class="test-vapor">
    <h1>Vue Vapor 模式测试</h1>
    <p>计数器: {{ count }}</p>
    <button @click="increment">增加</button>
    <p>Vapor 模式测试组件</p>
  </div>
</template>

<script setup lang="ts" vapor>
import { ref, onMounted } from 'vue'

const count = ref(0)
const isVaporEnabled = ref(false)

const increment = () => {
  count.value++
}

onMounted(() => {
  isVaporEnabled.value = true
  console.log('Vapor 组件已挂载')
})
</script>

<style scoped>
.test-vapor {
  padding: 20px;
  text-align: center;
}

button {
  padding: 10px 20px;
  font-size: 16px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #359c6d;
}
</style>