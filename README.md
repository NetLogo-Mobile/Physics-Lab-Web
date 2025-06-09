# physics-lab-web

## 本地构建

克隆仓库到本地后，执行 `npm install` 安装依赖，运行 `npm run dev` 启动本地服务器。注意，我们使用的是代理方案解决跨域问题，install 之后报错一个包（kateX）有跨站脚本攻击的风险：我们进行了防护

推送代码之前执行npm run build检查错误，但是请删除编译后的结果不要上传到仓库，更改gh-pages的内容需要本地编译。

## 中间层一览

- `getPath.ts`: 使用环境变量在开发环境和生产环境指向了不同的url
- `eventEmitter.ts`: 事件总线，用于页面间通信，传统的发布-订阅模式
- `utils.ts`: 存储字符串、对象以至于数据库等操作都会走这里
- `richTextParser`: 富文本解析器以后会使用wasm重构
- `api/`: 把物实的请求结果转换为我们自己希望的数据结构

## 贡献代码

1. 创建新页面，页面作为一个组件放在./views 下，并且在 vue-router 下配置
2. 创建组件**推荐使用对象传参**，e.g：使用 user 对象而不是 user_id,user_Nickname 等。
3. js 组件使用模块化语法，放在./services，做成纯函数
4. 矢量图标库：https://icomoon.io/app/#/select
5. 组件库：https://www.naiveui.com/zh-CN/os-theme/components/t

注意，在推送前，请先运行：npm run lint，会自动格式化代码并使用eslint校验