<template>
  <div class="image-container">
    <div class="action" :style="{ backgroundImage: `url(${getPath('/@base/assets/electricity.jpg')})` }">
      <p>电学实验</p>
    </div>
    <div class="action" :style="{ backgroundImage: `url(${getPath('/@base/assets/astronomy.jpg')})` }">
      <p>天体物理实验</p>
    </div>
    <div
      class="action"
      :style="{ backgroundImage: `url(${getPath('/@base/assets/electromagnetics.jpg')})` }"
    >
      <p>电与磁实验</p>
    </div>
  </div>
</template>

<script setup>
import getPath from "../../services/getPath";
</script>

<style>
.image-container {
  display: flex;
  gap: 10px;
  flex-direction: column;
  height: 100%;
}

.action {
  background-size: cover;
  background-position: center;
  display: flex;
  width: 100%;
  height: 33%;
  flex-direction: column;
  align-items: flex-start; /* 左对齐 */
  justify-content: center; /* 垂直居中 */
  color: white;
  padding: 20px;
  box-sizing: border-box;
  font-size: min(24px,2em);
  border-radius: 15px;
  box-shadow: 0px 0px 50px rgba(0, 0, 0, 0.2);
}
p {
  margin: 0;
  width: 100%;
  text-align: left; /* 左对齐内容 */
}
</style>
