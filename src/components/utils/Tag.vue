<template>
  <div
    v-if="!tag.startsWith('Type-')"
    class="tag"
    :href="targetLink"
    v-text="tag === '交流' ? '综合交流' : tag"
  ></div>
</template>

<script setup>
defineProps({
  tag: String,
  targetLink: String,
});
</script>

<style scoped>
.tag {
  display: inline-block;
  padding: 1px 5px;
  border-radius: 20%;
  background-color: rgba(240, 240, 240, 0.8);
  color: #333;
  font-size: 10px;
  margin: 0 15px 0 0;
}
</style>
