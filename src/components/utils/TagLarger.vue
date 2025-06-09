<template>
  <div
    v-if="!tag?.startsWith('Type-')"
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
  border-radius: 5px;
  background-color: hsla(0, 6%, 7%, 0.559);
  color: white;

  font-size: 0.65em;

  padding: 0.1em 7px;
  margin: 0 3px;
}

@media (min-aspect-ratio: 1/1) {
  .tag {
    padding: 0.2em 10px;
    font-size: 0.8em;
  }
}
</style>
