import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import autoprefixer from "autoprefixer";
import legacy from "@vitejs/plugin-legacy";
import browserslist from "browserslist";

// https://vite.dev/config/
export default defineConfig({
  base: "./",
  build: {
    outDir: "./docs",
    rollupOptions: {
      output: {
        manualChunks: {
          vue: ["vue", "vue-router"],
          markdown: ["markdown-it"],
          heilight: ["markdown-it-highlightjs"],
          katex: ["markdown-it-katex"],
          domPurify: ["dompurify"],
        },
      },
    },
  },
  plugins: [
    vue(),
    legacy({
      targets: browserslist(),
    }),
  ],
  css: {
    postcss: {
      plugins: [autoprefixer()],
    },
  },
  server: {
    proxy: {
      // 代理/aliyun-oss
      "/static": {
        target: "https://physics-static-cn.turtlesim.com",
        changeOrigin: true,
        rewrite: (path) => {
          return path.replace("/static", "");
        },
        headers: {
          Referer: "https://www.turtlesim.com/",
        },
        secure: false, // 关闭 TLS 验证
      },
      "/api": {
        target: "https://physics-api-cn.turtlesim.com",
        changeOrigin: true,
        rewrite: (path) => {
          console.log(path.replace("/api", ""));
          return path.replace("/api", "");
        },
        headers: {
          Referer: "https://www.turtlesim.com/",
        },
      },
    },
  },
});
