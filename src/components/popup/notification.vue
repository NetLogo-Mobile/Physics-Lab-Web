<template></template>

<script setup lang="ts">
import { useDialog } from "naive-ui";
import Emitter from "../../services/eventEmitter";
window.$notification = useDialog();
Emitter.on("nWarning", (opt) => {
  window.$notification.warning(opt);
});
</script>
