<template>
  <div class="image-container">
    <div
      class="action"
      :style="{
        backgroundImage: `url(${getPath('/@base/assets/electricity.jpg')})`,
      }"
    >
      <p>电学实验</p>
    </div>
    <div
      class="action"
      :style="{
        backgroundImage: `url(${getPath('/@base/assets/astronomy.jpg')})`,
      }"
    >
      <p>天体物理实验</p>
    </div>
    <div
      class="action"
      :style="{
        backgroundImage: `url(${getPath('/@base/assets/electromagnetics.jpg')})`,
      }"
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
  flex: 1;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  color: white;
  padding: 20px;
  box-sizing: border-box;
  font-size: min(24px, 2em);
  border-radius: 15px;
  box-shadow: 0px 0px 50px rgba(0, 0, 0, 0.2);
}
p {
  margin: 0;
  width: 100%;
  text-align: left;
}
</style>
