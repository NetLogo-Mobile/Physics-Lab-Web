# physics-lab-web

技术栈：vite + vue3  typescript [基于c++的wasm](https://github.com/GoodenoughPhysicsLab/pltxt2htm/pull/)

## 构建

### 环境搭建

+ 安装nvm ，后运行`nvm install 22`，或者自行下载nodejs v22)
+ 推荐安装nrm，后运行`nrm use taobao`
+ 克隆仓库执行 `npm install` 安装依赖，所有警告均可忽略
+ 运行 `npm run dev` 启动本地服务器
+ 运行 `npm run lint` 格式化代码并校验eslint
+ 运行`npm run build ` 进行ts校验，**结束后删除docs/再提交**

### 推荐的插件
编辑器：prettier errorlens vue3-official
浏览器：vue.jsdevtool

### 其他开发工具
+ 矢量图标库：https://icomoon.io/app/#/select
+ vue3组件库：https://www.naiveui.com/zh-CN/os-theme/components/t

## 项目说明

前端项目基于

## 中间层一览

- `getPath.ts`: 使用环境变量在开发环境和生产环境指向了不同的url window.$getPath("url")
- `eventEmitter.ts`: 事件总线，用于页面间通信，传统的发布-订阅模式
- `utils.ts`: 存储字符串、对象以至于数据库等操作都会走这里
- `richTextParser`: 富文本解析器以后会使用wasm重构
- `api/`: 把物实的请求结果转换为我们自己希望的数据结构，包含请求前后的特殊的拦截器
- `storage.ts`：所有存储相关的都走这里
- `eventLogger.ts`：日志系统
- `errroLogger.ts`： debugger模式
- `config/`： 保护用户设置界面配置（部分实现）和项目runtime配置（没实现）
- `views/`: 页面
- `router/`: 增加页面后需要在此把url映射到页面


