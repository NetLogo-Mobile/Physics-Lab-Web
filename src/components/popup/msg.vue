<template></template>

<script setup lang="ts">
import { useMessage } from "naive-ui";
import Emitter from "../../services/eventEmitter";

// 展示详细的错误信息 ，日后会做在设置里可选
// To display more detailed error messages, we'll make it optional in the settings later.
const reportError = true;
window.$message = useMessage();
Emitter.on("warning", (msg: string, duration: number) => {
  window.$message.warning(msg, { duration: duration * 1000 });
});
Emitter.on("info", (msg: string, duration: number) => {
  window.$message.info(msg, { duration: duration * 1000 });
});
Emitter.on("error", (msg: string, duration: number, error: any = "") => {
  window.$message.error(msg, { duration: duration * 1000 });
  if (reportError && error !== "") {
    const str = typeof msg === "string" ? msg : JSON.stringify(msg);
    window.$message.error(str, { duration: duration * 3000 });
    console.error(error);
  }
});
Emitter.on("success", (msg: string, duration: number) => {
  window.$message.success(msg, { duration: duration * 1000 });
});
Emitter.on("loading", (msg: string, duration: number) => {
  window.$message.loading(msg, { duration: duration * 1000 });
});
</script>
