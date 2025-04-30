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
}

.action {
  background-size: cover;
  background-position: center;
  display: flex;
  width: 100%;
  height: 110px;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  color: white;
  padding: 20px;
  box-sizing: border-box;
  font-size: 23px;
  border-radius: 15px;
  box-shadow: 0px 0px 50px rgba(0, 0, 0, 0.2);
}
</style>
